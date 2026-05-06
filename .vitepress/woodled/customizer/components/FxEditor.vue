<script setup lang="ts">
/**
 * FxEditor.vue — Страница светильника.
 *
 * Структура (сверху вниз):
 *   1. Sticky шапка: ← Назад, название светильника.
 *   2. Hero-блок: иконка + название + тип·дерево + статус +
 *      разбивка цены + компактный «Мой выбор».
 *   3. Чек-лист (тапается → экран шага → возврат сюда).
 *   4. Действия: Сохранить / Поделиться / Удалить.
 *
 * Шаг «Размер» обогащён рекомендацией: бейдж «Подходит» на оптимальной
 * модели, индикатор покрытия площади, прогноз яркости/настроения.
 * Данные комнаты приходят через опциональные пропсы roomArea / roomBaseLm /
 * roomCurrentLmWithoutThis. Без них — стандартный UI без рекомендации.
 */

import { computed, ref } from 'vue'
import { T, WCOL } from '../theme/tokens'
import {
  MD, FAMILIES,
  type Fixture, type ModelId,
} from '../data/catalog'
import {
  MATS, BOWLS as ALL_BOWLS, BTEMPS, DEF_OPT, OPT_PRICE,
  WOOD_TIPS, OPT_TIPS,
  type Wood, type Bowl,
} from '../data/materials'
import { getBright, autoMood } from '../data/moods'
import { buildSizeRecommendation, type AreaFit, type SizeCandidate } from '../engine/autosize'
import Icon, { type IconName } from './ui/Icons.vue'
import { buildFixtureShareUrl } from '../engine/share'

/* ═══ PROPS & EMITS ═══ */

interface Props {
  item: Fixture
  defWood?: Wood
  skipSize?: boolean
  backLabel?: string
  /** Площадь комнаты (м²). Если undefined — рекомендация не показывается. */
  roomArea?: number
  /** Целевые люмены комнаты (baseLm). */
  roomBaseLm?: number
  /** Текущие люмены комнаты БЕЗ этого светильника. */
  roomCurrentLmWithoutThis?: number
}
const props = withDefaults(defineProps<Props>(), {
  skipSize: false,
  backLabel: '← Назад',
})
const emit = defineEmits<{
  (e: 'save', fx: Fixture): void
  (e: 'delete'): void
  (e: 'close'): void
  (e: 'feedback', msg: string): void
}>()

/* ═══ TYPES ═══ */

type StepId =
  | 'size' | 'wood' | 'mount' | 'bowl' | 'temp' | 'patrons'
  | 'diffuser' | 'wire' | 'base' | 'bulbs'
type StepStatus = 'default' | 'chosen'

const SM: Record<StepId, { name: string; desc: string; icon: IconName }> = {
  size:     { name: 'Размер',       desc: 'Подберите размер под комнату',      icon: 'fxSize' },
  wood:     { name: 'Дерево',       desc: 'Три породы — три характера',        icon: 'leafy' },
  mount:    { name: 'Крепление',    desc: 'Как светильник крепится к потолку', icon: 'fxMount' },
  bowl:     { name: 'Чаша',         desc: 'Декоративная накладка на потолке',  icon: 'fxBowl' },
  temp:     { name: 'Температура',  desc: 'Оттенок света',                     icon: 'thermo' },
  patrons:  { name: 'Патроны',      desc: 'Больше патронов — ярче свет',       icon: 'sun' },
  diffuser: { name: 'Рассеиватель', desc: 'Мягкий свет без бликов',            icon: 'fxDiffuser' },
  wire:     { name: 'Подключение',  desc: 'Как подать электричество',          icon: 'fxWire' },
  base:     { name: 'Основание',    desc: 'Цвет ножки торшера',                icon: 'dotDashed' },
  bulbs:    { name: 'Лампочки',     desc: 'Включить в комплект?',              icon: 'bulb' },
}

const SIM_MOUNTS = [
  { id: 'pendant', name: 'На подвесе', tip: 'Потолок >2.7м — больше света' },
  { id: 'flush',   name: 'Вплотную',   tip: 'Потолок <2.7м — минимум зазора' },
] as const

const BASE_COLORS = {
  white: { name: 'Белое', color: '#E8E0D4' },
  black: { name: 'Чёрное', color: '#3A3530' },
} as const

/* ═══ STATE ═══ */

const mid = ref<ModelId>(props.item.m)
const stepIdx = ref(0)

const hasExistingOpts = !!(props.item.opts && Object.keys(props.item.opts).length > 0)
const existingDone = props.item.done ?? []
const legacyAllDone = hasExistingOpts && existingDone.length === 0

const view = ref<'steps' | 'summary'>('summary')
const touched = ref(new Set<StepId>())
const priceOpen = ref(false)

interface Build {
  m: ModelId; wood: Wood; mount: string; bowl: string; btemp: string
  lamps: number; diffuser: boolean; moisture: boolean; bulbs: boolean
  wire: string; baseColor: string; bulbOpt: string
  steps: Record<string, StepStatus>
}

function getSteps(modelId: ModelId): StepId[] {
  const m = MD[modelId]
  const s: StepId[] = []
  const fam = m.family ? FAMILIES[m.family] : null
  if (!props.skipSize && fam && fam.length > 1) s.push('size')
  s.push('wood')
  if (m.hasMount) s.push('mount')
  if (m.avBowls.length > 0) s.push('bowl')
  s.push('temp')
  if (m.minL !== m.maxL) s.push('patrons')
  if (m.hasDiffuser) s.push('diffuser')
  if (m.wireOpts) s.push('wire')
  if (m.baseColors) s.push('base')
  if (!m.bulbsIn && (m.bulbPrice || m.bulbOpts)) s.push('bulbs')
  return s
}

const build = ref<Build>((() => {
  const m = MD[props.item.m]
  const o = props.item.opts ?? {}
  const stps = getSteps(props.item.m)
  return {
    m: props.item.m,
    wood: props.item.wood ?? props.defWood ?? 'oak',
    mount: o.mount ?? DEF_OPT.mount,
    bowl: o.bowl ?? DEF_OPT.bowl,
    btemp: o.btemp ?? DEF_OPT.btemp,
    lamps: props.item.l ?? m.lamps,
    diffuser: o.diffuser ?? DEF_OPT.diffuser,
    moisture: o.moisture ?? DEF_OPT.moisture,
    bulbs: o.bulbs ?? DEF_OPT.bulbs,
    wire: o.wire ?? DEF_OPT.wire,
    baseColor: o.baseColor ?? 'white',
    bulbOpt: o.bulbOpt ?? 'none',
    steps: Object.fromEntries(
      stps.map((s) => {
        let isDone: boolean
        if (existingDone.length > 0) {
          isDone = existingDone.includes(s)
        } else if (legacyAllDone) {
          isDone = true
        } else {
          isDone = false
        }
        return [s, isDone ? 'chosen' as StepStatus : 'default' as StepStatus]
      }),
    ),
  }
})())

/* ═══ COMPUTED ═══ */

const model = computed(() => MD[mid.value])
const steps = computed(() => getSteps(mid.value))
const curStep = computed(() => steps.value[stepIdx.value])
const meta = computed(() => SM[curStep.value] || { name: '', desc: '' })
const isTouched = computed(() => touched.value.has(curStep.value))

const families = computed(() => {
  const m = model.value
  return m.family ? [...FAMILIES[m.family]].reverse() : null
})

const availBowls = computed(() => {
  const ids = model.value.avBowls
  return ids.map((id) => ALL_BOWLS.find((b) => b.id === id)).filter(Boolean) as Bowl[]
})
const freeBowls = computed(() => availBowls.value.filter((b) => b.price === 0))
const paidBowls = computed(() => availBowls.value.filter((b) => b.price > 0))

const simMats = computed(() =>
  MATS.map((m) => ({
    id: m.id as Wood,
    name: m.name,
    color: m.color || WCOL[m.id as Wood],
    tip: WOOD_TIPS[m.id as Wood] ?? '',
  })),
)

interface PriceRow { label: string; amount: number }

const priceBreakdown = computed<PriceRow[]>(() => {
  const m = model.value, b = build.value
  const items: PriceRow[] = []

  const woodName = simMats.value.find((x) => x.id === b.wood)?.name ?? 'Дуб'
  items.push({ label: `Базовая (${woodName})`, amount: m.p[b.wood] || 0 })

  const extra = Math.max(0, b.lamps - m.lamps)
  if (extra > 0) {
    items.push({ label: `+${extra} ${spw(extra)}`, amount: extra * m.sur })
  }

  if (m.avBowls.length > 0 && b.bowl) {
    const bowl = ALL_BOWLS.find((x) => x.id === b.bowl)
    if (bowl && bowl.price > 0) {
      items.push({ label: `Чаша «${bowl.name}»`, amount: bowl.price })
    }
  }

  if (b.diffuser && m.hasDiffuser) {
    items.push({ label: 'Рассеиватель', amount: OPT_PRICE.diffuser })
  }

  if (b.moisture) {
    items.push({ label: 'Влагозащита', amount: OPT_PRICE.moisture })
  }

  if (m.bulbOpts) {
    const bo = m.bulbOpts.find((x) => x.id === b.bulbOpt)
    if (bo && bo.price > 0) items.push({ label: bo.label, amount: bo.price })
  } else if (!m.bulbsIn && b.bulbs && m.bulbPrice) {
    const amt = Math.round((m.bulbPrice * b.lamps) / m.lamps)
    items.push({ label: `Лампочки ${b.lamps} шт`, amount: amt })
  }

  if (m.wireOpts) {
    const wo = m.wireOpts.find((x) => x.id === b.wire)
    if (wo && wo.price > 0) items.push({ label: wo.label, amount: wo.price })
  }

  return items
})

const price = computed(() => priceBreakdown.value.reduce((s, r) => s + r.amount, 0))

const progress = computed(() => {
  const t = steps.value.length
  const d = steps.value.filter((s) => build.value.steps[s] === 'chosen').length
  return { total: t, done: d, pct: t ? Math.round((d / t) * 100) : 0 }
})

const status = computed(() => {
  const c = steps.value.filter((s) => build.value.steps[s] === 'chosen').length
  if (c === steps.value.length) return 'Собран'
  return c > 0 ? 'В сборке' : 'Новый'
})
const sc = computed(() =>
  status.value === 'Собран'
    ? T.green
    : status.value === 'В сборке'
      ? T.neutral
      : T.textDim,
)
const isDone = computed(() => status.value === 'Собран')

const myChoices = computed<[string, string][]>(() => {
  const m = model.value, b = build.value
  const list: ([string, string] | null)[] = [
    ['Свет', `${b.lamps} п. · ${fmt(Math.round(b.lamps * m.lmPer * diffMult()))} лм · ${btempK()}`],
    m.hasMount ? ['Крепление', b.mount === 'pendant' ? 'На подвесе' : 'Вплотную'] : null,
    m.avBowls.length > 0 ? ['Чаша', bowlName()] : null,
    m.hasDiffuser ? ['Рассеиватель', b.diffuser ? 'Да' : 'Нет'] : null,
    m.wireOpts ? ['Подключение', m.wireOpts.find((x) => x.id === b.wire)?.label || '—'] : null,
    m.baseColors ? ['Основание', BASE_COLORS[b.baseColor as keyof typeof BASE_COLORS]?.name || '—'] : null,
    (m.bulbPrice || m.bulbOpts)
      ? ['Лампочки', m.bulbOpts
          ? (m.bulbOpts.find((x) => x.id === b.bulbOpt)?.label ?? '—')
          : (b.bulbs ? `${b.lamps} шт в комплекте` : 'Свои')]
      : null,
  ]
  return list.filter(Boolean) as [string, string][]
})

/* ═══ SIZE RECOMMENDATION ═══ */

/** Есть ли данные комнаты для показа рекомендации. */
const hasRoomContext = computed(() =>
  props.roomArea != null && props.roomBaseLm != null && props.roomCurrentLmWithoutThis != null,
)

/** Рекомендации для каждого члена семейства. null если нет контекста комнаты. */
const sizeRecs = computed<SizeCandidate[] | null>(() => {
  if (!hasRoomContext.value || !families.value) return null
  return buildSizeRecommendation(
    families.value,
    props.roomArea!,
    props.roomBaseLm!,
    props.roomCurrentLmWithoutThis!,
    props.item.q ?? 1,
  )
})

/** Рекомендуемая модель (зелёный бейдж). */
const recommendedMid = computed<ModelId | null>(() => {
  if (!sizeRecs.value) return null
  const rec = sizeRecs.value.find((r) => r.recommended)
  return rec?.mid ?? null
})

/** Получить рекомендацию для конкретной модели. */
function getRecFor(fid: ModelId): SizeCandidate | null {
  if (!sizeRecs.value) return null
  return sizeRecs.value.find((r) => r.mid === fid) ?? null
}

/** Цвет индикатора покрытия площади. */
function areaFitColor(fit: AreaFit): string {
  if (fit === 'ideal') return T.green
  if (fit === 'acceptable') return T.yellow
  return T.red
}

/** Текст прогноза яркости/настроения для кандидата. */
function projectedLabel(fid: ModelId): string | null {
  const rec = getRecFor(fid)
  if (!rec) return null
  const bright = getBright(rec.projectedRatio)
  const mood = autoMood(rec.projectedRatio)
  if (mood.id === 'empty') return bright.name
  return `${mood.name} · ${bright.name}`
}

/** Цвет прогноза яркости. */
function projectedColor(fid: ModelId): string {
  const rec = getRecFor(fid)
  if (!rec) return T.textDim
  const bright = getBright(rec.projectedRatio)
  return bright.color
}

/** Подсказка под списком размеров. */
const sizeHintText = computed<string | null>(() => {
  if (!sizeRecs.value || !props.roomArea) return null
  const allPoor = sizeRecs.value.every((r) => r.areaFit === 'poor')
  if (allPoor) return `Ни один размер не рассчитан на ${props.roomArea} м² — добавьте бра или торшер`

  const rec = sizeRecs.value.find((r) => r.recommended)
  if (!rec) return null
  if (build.value.m === rec.mid) return 'Оптимальный размер для вашей комнаты'

  const currentRec = sizeRecs.value.find((r) => r.mid === build.value.m)
  if (!currentRec) return null
  if (currentRec.modelLm < rec.modelLm) {
    return `Для ${props.roomArea} м² может не хватить света — рекомендуем ${MD[rec.mid].name}`
  }
  return `Для ${props.roomArea} м² будет с запасом — можно диммировать`
})

/* ═══ MUTATIONS ═══ */

function upBuild(patch: Partial<Build>) {
  build.value = { ...build.value, ...patch }
  touched.value = new Set([...touched.value, curStep.value])
}

function doCommit(isChoice: boolean) {
  build.value = {
    ...build.value,
    steps: {
      ...build.value.steps,
      [curStep.value]: isChoice ? 'chosen' : 'default',
    },
  }
  touched.value = new Set([...touched.value].filter((x) => x !== curStep.value))
  view.value = 'summary'
}

function goToStep(i: number) {
  stepIdx.value = i
  view.value = 'steps'
}

function backFromStep() {
  view.value = 'summary'
}

function lampOpts(): number[] {
  const r: number[] = []
  for (let i = model.value.minL; i <= model.value.maxL; i++) r.push(i)
  return r
}

function diffMult(): number {
  return build.value.diffuser && model.value.diffLoss
    ? 1 - model.value.diffLoss
    : 1
}

function buildFixture(): Fixture {
  const b = build.value
  const done = (Object.entries(b.steps) as [StepId, StepStatus][])
    .filter(([, status]) => status === 'chosen')
    .map(([s]) => s as string)
  return {
    m: b.m,
    q: props.item.q ?? 1,
    wood: b.wood,
    zone: props.item.zone,
    l: b.lamps,
    opts: {
      bowl: b.bowl, mount: b.mount, wire: b.wire, btemp: b.btemp,
      diffuser: b.diffuser, moisture: b.moisture, bulbs: b.bulbs,
      bulbOpt: b.bulbOpt, baseColor: b.baseColor,
    },
    done,
  }
}

function doSave() {
  emit('save', buildFixture())
}

async function shareFx() {
  const url = buildFixtureShareUrl(buildFixture())
  try {
    await navigator.clipboard.writeText(url)
    emit('feedback', 'Ссылка на светильник скопирована')
  } catch {
    emit('feedback', url)
  }
}

/* ═══ HELPERS ═══ */

const fmt = (n: number) => n.toLocaleString('ru-RU')
function spw(n: number) {
  const a = Math.abs(n), l = a % 10, t = a % 100
  if (t >= 11 && t <= 19) return 'патронов'
  if (l === 1) return 'патрон'
  if (l >= 2 && l <= 4) return 'патрона'
  return 'патронов'
}
function slw(n: number) {
  const a = Math.abs(n), l = a % 10, t = a % 100
  if (t >= 11 && t <= 19) return 'лампочек'
  if (l === 1) return 'лампочка'
  if (l >= 2 && l <= 4) return 'лампочки'
  return 'лампочек'
}
function bowlName() {
  return ALL_BOWLS.find((x) => x.id === build.value.bowl)?.name ?? '—'
}
function btempK() {
  const bt = BTEMPS.find((x) => x.id === build.value.btemp)
  return bt ? bt.kelvin + 'К' : '—'
}
function bulbTotal() {
  const bp = model.value.bulbPrice ?? OPT_PRICE.bulbsPerLamp * model.value.lamps
  return Math.round((bp * build.value.lamps) / model.value.lamps)
}
function bulbPer() {
  return model.value.bulbPrice
    ? Math.round(model.value.bulbPrice / model.value.lamps)
    : OPT_PRICE.bulbsPerLamp
}
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      overflow: 'auto',
    }"
  >
    <!-- ═══════ STICKY HEADER ═══════ -->
    <div
      :style="{
        position: 'sticky',
        top: 0,
        background: T.bg,
        zIndex: 2,
        borderBottom: `1px solid ${T.border}`,
      }"
    >
      <div
        :style="{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '12px 80px 12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }"
      >
        <button
          :style="{
            background: 'none',
            border: 'none',
            color: T.textSec,
            cursor: 'pointer',
            padding: '4px 8px 4px 0',
            fontSize: '14px',
            fontWeight: 500,
            flexShrink: 0,
          }"
          @click="view === 'summary' ? emit('close') : backFromStep()"
        >
          {{ view === 'summary' ? props.backLabel : '← К чек-листу' }}
        </button>

        <div
          :style="{
            flex: 1,
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 700,
            color: T.text,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }"
        >
          {{ model.name }}
        </div>
      </div>
    </div>

    <!-- ═══════ КОНТЕНТ ═══════ -->
    <div
      :style="{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '16px 20px',
        fontFamily: `'Segoe UI', system-ui, sans-serif`,
        color: T.text,
        boxSizing: 'border-box',
      }"
    >
      <!-- ═══════════════ SUMMARY ═══════════════ -->
      <template v-if="view === 'summary'">
        <!-- ═══ HERO-БЛОК ═══ -->
        <div
          :style="{
            background: T.card,
            border: `1px solid ${isDone ? sc + '44' : T.border}`,
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '16px',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
            <div
              :style="{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: WCOL[build.wood] + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }"
            >
              <Icon name="ceiling" :color="WCOL[build.wood]" :size="26" />
            </div>

            <div :style="{ flex: 1, minWidth: 0 }">
              <div :style="{ fontSize: '15px', fontWeight: 700, color: T.text, marginBottom: '2px' }">
                {{ model.name }}
              </div>
              <div
                :style="{
                  fontSize: '11px',
                  color: T.textDim,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                }"
              >
                <span :style="{ textTransform: 'uppercase', letterSpacing: '.5px' }">
                  {{ model.type }} · {{ simMats.find((x) => x.id === build.wood)?.name }}
                </span>
                <span
                  :style="{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: sc + '22',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: sc,
                  }"
                >
                  {{ status }}
                </span>
              </div>
            </div>

            <button
              :style="{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                color: T.neutral,
                flexShrink: 0,
              }"
              @click="priceOpen = !priceOpen"
            >
              <span :style="{ fontSize: '15px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }">
                {{ fmt(price) }} ₽
              </span>
              <span
                :style="{
                  fontSize: '10px',
                  color: T.textSec,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  marginTop: '2px',
                }"
              >
                {{ priceOpen ? 'Скрыть' : 'Детали' }}
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"
                  :style="{ transform: priceOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          </div>

          <!-- Разбивка цены -->
          <div
            v-if="priceOpen"
            :style="{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: `1px solid ${T.border}`,
            }"
          >
            <div
              v-for="(row, i) in priceBreakdown"
              :key="i"
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '12px',
                padding: '3px 0',
              }"
            >
              <span :style="{ color: T.textSec }">{{ row.label }}</span>
              <span
                :style="{
                  color: i === 0 ? T.text : T.yellow,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }"
              >
                {{ i === 0 ? '' : '+' }}{{ fmt(row.amount) }} ₽
              </span>
            </div>
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '13px',
                fontWeight: 800,
                color: T.text,
                marginTop: '6px',
                paddingTop: '8px',
                borderTop: `1px solid ${T.border}`,
              }"
            >
              <span>Итого</span>
              <span :style="{ color: T.neutral, fontVariantNumeric: 'tabular-nums' }">
                {{ fmt(price) }} ₽
              </span>
            </div>
          </div>

          <!-- Мой выбор -->
          <div
            :style="{
              borderTop: `1px solid ${T.border}`,
              marginTop: '12px',
              paddingTop: '10px',
            }"
          >
            <div
              :style="{
                fontSize: '10px',
                fontWeight: 700,
                color: T.neutral,
                textTransform: 'uppercase',
                letterSpacing: '.8px',
                marginBottom: '6px',
              }"
            >
              Мой выбор
            </div>
            <div
              :style="{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '4px 12px',
              }"
            >
              <div
                v-for="([k, v]) in myChoices"
                :key="k"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  gap: '8px',
                }"
              >
                <span :style="{ color: T.textSec, flexShrink: 0 }">{{ k }}</span>
                <span
                  :style="{
                    fontWeight: 600,
                    color: T.text,
                    textAlign: 'right',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }"
                >
                  {{ v }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ ЧЕК-ЛИСТ ═══ -->
        <div
          :style="{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '16px',
          }"
        >
          <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }">
            <span :style="{ fontSize: '13px', fontWeight: 700 }">Чек-лист</span>
            <span :style="{ fontSize: '12px', fontWeight: 700, color: sc }">
              {{ isDone ? 'Готово' : `${progress.done} из ${progress.total}` }}
            </span>
          </div>
          <div
            :style="{
              height: '6px',
              background: T.border,
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px',
            }"
          >
            <div
              :style="{
                height: '100%',
                width: progress.pct + '%',
                background: sc,
                borderRadius: '4px',
                transition: 'width .3s',
              }"
            />
          </div>
          <button
            v-for="(s, i) in steps"
            :key="s"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: i < steps.length - 1 ? `1px solid ${T.border}` : 'none',
              textAlign: 'left',
            }"
            @click="goToStep(i)"
          >
            <Icon
              :name="SM[s]?.icon ?? 'sun'"
              :size="18"
              :color="build.steps[s] === 'chosen' ? T.green : T.textDim"
            />
            <span :style="{ flex: 1, fontSize: '13px', color: T.text }">{{ SM[s]?.name }}</span>
            <span
              :style="{
                fontSize: '10px',
                padding: '4px 10px',
                borderRadius: '5px',
                fontWeight: 600,
                background: build.steps[s] === 'chosen' ? T.green + '22' : T.neutral + '15',
                color: build.steps[s] === 'chosen' ? T.green : T.neutral,
              }"
            >
              {{ build.steps[s] === 'chosen' ? 'Готово' : 'Выбрать' }}
            </span>
          </button>
        </div>

        <!-- ═══ ACTIONS ═══ -->
        <button
          :style="{
            width: '100%',
            padding: '14px',
            background: isDone ? sc : T.neutral,
            color: T.bg,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '8px',
          }"
          @click="doSave"
        >
          Сохранить
        </button>

        <button
          :style="{
            width: '100%',
            padding: '12px',
            background: 'none',
            border: `1px solid ${T.border}`,
            borderRadius: '8px',
            color: T.textSec,
            cursor: 'pointer',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '20px',
          }"
          @click="shareFx"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Поделиться ссылкой на светильник
        </button>

        <div :style="{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${T.border}` }">
          <button
            :style="{
              padding: '8px 20px',
              background: 'none',
              border: `1px solid ${T.red}55`,
              borderRadius: '6px',
              color: T.red,
              cursor: 'pointer',
              fontSize: '12px',
            }"
            @click="emit('delete')"
          >
            Удалить светильник
          </button>
        </div>
      </template>

      <!-- ═══════════════ STEP ═══════════════ -->
      <template v-if="view === 'steps'">
        <div :style="{ marginBottom: '16px', paddingTop: '8px' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }">
            <Icon :name="meta.icon" :color="T.neutral" :size="18" />
            <span :style="{ fontSize: '17px', fontWeight: 700 }">{{ meta.name }}</span>
            <span :style="{ flex: 1 }" />
            <span :style="{ fontSize: '11px', color: T.textDim }">
              {{ stepIdx + 1 }} из {{ steps.length }}
            </span>
          </div>
          <div :style="{ fontSize: '12px', color: T.textSec }">
            {{ curStep === 'bulbs' ? `${build.lamps} ${spw(build.lamps)}` : meta.desc }}
          </div>
        </div>

        <div
          :style="{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '12px',
            padding: '16px',
          }"
        >
          <!-- ═══ SIZE (с рекомендацией) ═══ -->
          <div
            v-if="curStep === 'size' && families"
            :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }"
          >
            <button
              v-for="fid in families"
              :key="fid"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: build.m === fid
                  ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`)
                  : `1px solid ${T.border}`,
                background: build.m === fid ? T.neutral + '18' : T.card,
                color: build.m === fid ? T.text : T.textSec,
                position: 'relative',
              }"
              @click="() => { mid = fid; upBuild({ m: fid, lamps: MD[fid].lamps }) }"
            >
              <!-- Бейдж «Подходит» -->
              <div
                v-if="recommendedMid === fid"
                :style="{
                  position: 'absolute',
                  top: '-8px',
                  right: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: T.green,
                  fontSize: '9px',
                  fontWeight: 700,
                  color: T.bg,
                  letterSpacing: '0.5px',
                }"
              >
                ПОДХОДИТ
              </div>

              <span
                :style="{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: T.neutral + '22',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: T.neutral,
                }"
              >
                {{ MD[fid].letter }}
              </span>
              <div :style="{ flex: 1 }">
                <div :style="{ fontSize: '16px', fontWeight: 700, color: T.text }">
                  {{ MD[fid].dimD }}
                  <span :style="{ fontSize: '12px', color: T.textSec }">см</span>
                </div>
                <div :style="{ fontSize: '11px', color: T.textDim }">
                  высота {{ MD[fid].dimH }} см
                </div>
                <div :style="{ fontSize: '11px', color: T.textSec, marginTop: '2px' }">
                  {{ fmt(MD[fid].lmPer * MD[fid].lamps) }} лм
                </div>
                <!-- Прогноз яркости -->
                <div
                  v-if="getRecFor(fid)"
                  :style="{
                    fontSize: '10px',
                    color: projectedColor(fid),
                    marginTop: '4px',
                    fontWeight: 600,
                  }"
                >
                  → {{ projectedLabel(fid) }}
                </div>
              </div>
              <!-- Площадь с индикатором -->
              <div :style="{ textAlign: 'right', flexShrink: 0 }">
                <span
                  :style="{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: getRecFor(fid)
                      ? areaFitColor(getRecFor(fid)!.areaFit) + '15'
                      : T.neutral + '15',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: getRecFor(fid)
                      ? areaFitColor(getRecFor(fid)!.areaFit)
                      : T.text,
                  }"
                >
                  {{ MD[fid].sqMin }}–{{ MD[fid].sqMax }} м²
                </span>
                <div
                  v-if="hasRoomContext"
                  :style="{
                    fontSize: '9px',
                    color: T.textDim,
                    marginTop: '4px',
                  }"
                >
                  ваша {{ props.roomArea }} м²
                </div>
              </div>
            </button>

            <!-- Подсказка под списком -->
            <div
              v-if="sizeHintText"
              :style="{
                fontSize: '11px',
                color: T.textSec,
                textAlign: 'center',
                marginTop: '6px',
                lineHeight: 1.5,
              }"
            >
              {{ sizeHintText }}
            </div>
          </div>

          <!-- wood -->
          <div
            v-else-if="curStep === 'wood'"
            :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }"
          >
            <button
              v-for="mt in simMats"
              :key="mt.id"
              :style="{
                padding: '16px 8px',
                borderRadius: '10px',
                cursor: 'pointer',
                border: build.wood === mt.id
                  ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`)
                  : `1px solid ${T.border}`,
                background: build.wood === mt.id ? T.neutral + '18' : T.card,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }"
              @click="upBuild({ wood: mt.id })"
            >
              <div
                :style="{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: mt.color,
                  border: mt.id === 'black' ? `2px solid ${T.textDim}` : 'none',
                }"
              />
              <div
                :style="{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: build.wood === mt.id ? T.text : T.textSec,
                  marginTop: '10px',
                }"
              >
                {{ mt.name }}
              </div>
              <div
                v-if="mt.tip"
                :style="{ fontSize: '11px', color: T.textDim, marginTop: '6px', lineHeight: '1.4' }"
              >
                {{ mt.tip }}
              </div>
            </button>
          </div>

          <!-- mount -->
          <div
            v-else-if="curStep === 'mount'"
            :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }"
          >
            <button
              v-for="mt in SIM_MOUNTS"
              :key="mt.id"
              :style="{
                padding: '18px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                border: build.mount === mt.id
                  ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`)
                  : `1px solid ${T.border}`,
                background: build.mount === mt.id ? T.neutral + '18' : T.card,
                color: build.mount === mt.id ? T.text : T.textSec,
              }"
              @click="upBuild({ mount: mt.id })"
            >
              <div :style="{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }">
                <Icon
                  :name="mt.id === 'pendant' ? 'fxPendant' : 'fxFlush'"
                  :size="28"
                  :color="build.mount === mt.id ? T.neutral : T.textDim"
                />
              </div>
              <div :style="{ fontSize: '13px', fontWeight: 600 }">{{ mt.name }}</div>
              <div :style="{ fontSize: '10px', color: T.textDim, marginTop: '6px' }">
                {{ mt.tip }}
              </div>
            </button>
          </div>

          <!-- bowl -->
          <div v-else-if="curStep === 'bowl'">
            <div v-if="freeBowls.length > 0">
              <div
                :style="{
                  fontSize: '10px', fontWeight: 700, color: T.textDim,
                  textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '6px',
                }"
              >
                {{ paidBowls.length > 0 ? 'Стандарт · входит в цену' : 'Выберите чашу' }}
              </div>
              <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '6px' }">
                <button
                  v-for="b in freeBowls" :key="b.id"
                  :style="{
                    padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                    border: build.bowl === b.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                    background: build.bowl === b.id ? T.neutral + '18' : T.card,
                    color: build.bowl === b.id ? T.text : T.textSec,
                  }"
                  @click="upBuild({ bowl: b.id })"
                >
                  <div :style="{ fontSize: '12px', fontWeight: 600 }">{{ b.name }}</div>
                </button>
              </div>
            </div>
            <div v-if="paidBowls.length > 0" :style="{ marginTop: freeBowls.length > 0 ? '12px' : '0' }">
              <div :style="{ fontSize: '10px', fontWeight: 700, color: T.yellow, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '6px' }">
                С доплатой
              </div>
              <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '6px' }">
                <button
                  v-for="b in paidBowls" :key="b.id"
                  :style="{
                    padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                    border: build.bowl === b.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                    background: build.bowl === b.id ? T.neutral + '18' : T.card,
                    color: build.bowl === b.id ? T.text : T.textSec,
                  }"
                  @click="upBuild({ bowl: b.id })"
                >
                  <div :style="{ fontSize: '12px', fontWeight: 600 }">{{ b.name }}</div>
                  <div :style="{ fontSize: '11px', color: T.yellow, marginTop: '3px' }">+{{ fmt(b.price) }} ₽</div>
                </button>
              </div>
            </div>
          </div>

          <!-- temp -->
          <div v-else-if="curStep === 'temp'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }">
            <button v-for="bt in BTEMPS" :key="bt.id"
              :style="{
                padding: '12px 6px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                border: build.btemp === bt.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: build.btemp === bt.id ? T.neutral + '18' : T.card,
                color: build.btemp === bt.id ? T.text : T.textSec,
              }"
              @click="upBuild({ btemp: bt.id })"
            >
              <div :style="{ fontSize: '13px', fontWeight: 700 }">{{ bt.label }}</div>
              <div :style="{ fontSize: '11px', color: T.textDim, marginTop: '2px' }">{{ bt.kelvin }}К</div>
              <div v-if="bt.tip" :style="{ fontSize: '10px', color: T.textSec, marginTop: '6px', lineHeight: '1.3' }">{{ bt.tip }}</div>
            </button>
          </div>

          <!-- patrons -->
          <div v-else-if="curStep === 'patrons'">
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px' }">
              <button v-for="v in lampOpts()" :key="v"
                :style="{
                  padding: '14px 6px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                  border: build.lamps === v ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                  background: build.lamps === v ? T.neutral + '18' : T.card, transition: 'all .15s',
                }"
                @click="upBuild({ lamps: v })"
              >
                <div :style="{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: T.neutral + '22', fontSize: '11px', fontWeight: 700, color: T.neutral, marginBottom: '8px' }">
                  {{ v }} {{ spw(v) }}
                </div>
                <div :style="{ fontSize: '20px', fontWeight: 800, color: build.lamps === v ? T.yellow : T.text }">
                  {{ fmt(Math.round(v * model.lmPer * diffMult())) }}
                  <span :style="{ fontSize: '12px', fontWeight: 400, color: T.textDim }">лм</span>
                </div>
                <div v-if="v === model.lamps" :style="{ fontSize: '10px', color: T.neutral, marginTop: '6px' }">стандарт</div>
                <div v-if="(v - model.lamps) * model.sur > 0" :style="{ fontSize: '11px', color: T.yellow, marginTop: '4px', fontWeight: 700 }">
                  +{{ fmt((v - model.lamps) * model.sur) }} ₽
                </div>
              </button>
            </div>
          </div>

          <!-- diffuser -->
          <div v-else-if="curStep === 'diffuser'" :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
            <button
              :style="{
                width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                border: build.diffuser ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: build.diffuser ? T.neutral + '12' : T.cardAlt, color: T.text,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }"
              @click="upBuild({ diffuser: true })"
            >
              <div>
                <div :style="{ fontSize: '14px', fontWeight: 700 }">Добавить рассеиватель</div>
                <div :style="{ fontSize: '11px', color: T.textDim, marginTop: '4px' }">{{ OPT_TIPS.diffuser.on }}</div>
              </div>
              <span :style="{ fontSize: '14px', fontWeight: 700, color: T.yellow, flexShrink: 0 }">+{{ fmt(OPT_PRICE.diffuser) }} ₽</span>
            </button>
            <button
              :style="{
                width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                border: !build.diffuser ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: !build.diffuser ? T.neutral + '12' : T.cardAlt, color: T.textSec, fontSize: '13px',
              }"
              @click="upBuild({ diffuser: false })"
            >
              {{ OPT_TIPS.diffuser.off }}
            </button>
          </div>

          <!-- wire -->
          <div v-else-if="curStep === 'wire' && model.wireOpts" :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
            <button v-for="w in model.wireOpts" :key="w.id"
              :style="{
                textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', borderRadius: '8px', cursor: 'pointer',
                border: build.wire === w.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: build.wire === w.id ? T.neutral + '18' : T.card,
                color: build.wire === w.id ? T.text : T.textSec,
              }"
              @click="upBuild({ wire: w.id })"
            >
              <div>
                <div :style="{ fontSize: '13px', fontWeight: 600 }">{{ w.label }}</div>
                <div v-if="w.tip" :style="{ fontSize: '10px', color: T.textDim, marginTop: '2px' }">{{ w.tip }}</div>
              </div>
              <span v-if="w.price > 0" :style="{ fontSize: '12px', fontWeight: 700, color: T.yellow, flexShrink: 0 }">+{{ fmt(w.price) }} ₽</span>
              <span v-else :style="{ fontSize: '10px', color: T.green, flexShrink: 0 }">стандарт</span>
            </button>
          </div>

          <!-- base -->
          <div v-else-if="curStep === 'base'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }">
            <button v-for="(bc, bcId) in BASE_COLORS" :key="bcId"
              :style="{
                padding: '20px 10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                border: build.baseColor === bcId ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: build.baseColor === bcId ? T.neutral + '18' : T.card,
                color: build.baseColor === bcId ? T.text : T.textSec,
              }"
              @click="upBuild({ baseColor: String(bcId) })"
            >
              <div :style="{ width: '36px', height: '36px', borderRadius: '50%', background: bc.color, margin: '0 auto 8px', border: `1px solid ${T.border}` }" />
              <div :style="{ fontSize: '14px', fontWeight: 700 }">{{ bc.name }}</div>
            </button>
          </div>

          <!-- bulbs (Rotor X bulbOpts) -->
          <div v-else-if="curStep === 'bulbs' && model.bulbOpts" :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
            <div :style="{ fontSize: '12px', color: T.textSec, marginBottom: '2px' }">Включить в комплект?</div>
            <button v-for="bo in model.bulbOpts" :key="bo.id"
              :style="{
                textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', borderRadius: '8px', cursor: 'pointer',
                border: build.bulbOpt === bo.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: build.bulbOpt === bo.id ? T.neutral + '18' : T.card,
                color: build.bulbOpt === bo.id ? T.text : T.textSec, fontSize: '14px',
              }"
              @click="upBuild({ bulbOpt: bo.id })"
            >
              <span :style="{ fontWeight: 600 }">{{ bo.label }}</span>
              <span v-if="bo.price > 0" :style="{ fontWeight: 700, color: T.yellow }">+{{ fmt(bo.price) }} ₽</span>
            </button>
          </div>

          <!-- bulbs (стандартные) -->
          <div v-else-if="curStep === 'bulbs'" :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
            <button
              :style="{
                width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                border: build.bulbs ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: build.bulbs ? T.neutral + '12' : T.cardAlt, color: T.text,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }"
              @click="upBuild({ bulbs: true })"
            >
              <div>
                <div :style="{ fontSize: '14px', fontWeight: 700 }">Да, {{ build.lamps }} {{ slw(build.lamps) }} в комплекте</div>
                <div :style="{ fontSize: '11px', color: T.textDim, marginTop: '4px' }">{{ build.lamps }} {{ spw(build.lamps) }} × {{ fmt(bulbPer()) }} ₽</div>
              </div>
              <span :style="{ fontSize: '14px', fontWeight: 700, color: T.yellow, flexShrink: 0 }">+{{ fmt(bulbTotal()) }} ₽</span>
            </button>
            <button
              :style="{
                width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                border: !build.bulbs ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`,
                background: !build.bulbs ? T.neutral + '12' : T.cardAlt, color: T.textSec, fontSize: '13px',
              }"
              @click="upBuild({ bulbs: false })"
            >
              Подберу свои лампочки
            </button>
          </div>
        </div>

        <button
          :style="{
            width: '100%', marginTop: '14px', padding: '14px', border: 'none', borderRadius: '10px',
            cursor: 'pointer', fontWeight: 700, fontSize: '14px',
            background: isTouched ? T.text : T.neutral + '33',
            color: isTouched ? T.bg : T.neutral,
          }"
          @click="doCommit(isTouched)"
        >
          {{ isTouched ? '✓ Готово, к чек-листу' : 'Пропустить →' }}
        </button>
      </template>
    </div>
  </div>
</template>
