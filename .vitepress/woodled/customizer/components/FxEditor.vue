<script setup lang="ts">
/**
 * FxEditor.vue — Пошаговый кастомайзер светильника.
 *
 * Порт: SuperApp ClientSim (WoodledSuperApp.jsx v8).
 * Работает с синхронизированными catalog.ts и materials.ts.
 */

import { computed, ref } from 'vue'
import { T, Z, WCOL } from '../theme/tokens'
import {
  MD, FAMILIES,
  type Fixture, type ModelId, type FamilyId,
} from '../data/catalog'
import {
  MATS, BOWLS as ALL_BOWLS, BTEMPS, DEF_OPT, OPT_PRICE,
  WOOD_TIPS, BTEMP_TIPS, OPT_TIPS,
  type Wood, type Bowl,
} from '../data/materials'
import Icon, { type IconName } from './ui/Icons.vue'

/* ═══ PROPS & EMITS ═══ */

interface Props {
  item: Fixture
  defWood?: Wood
  skipSize?: boolean
}
const props = withDefaults(defineProps<Props>(), { skipSize: false })
const emit = defineEmits<{
  (e: 'save', fx: Fixture): void
  (e: 'delete'): void
  (e: 'close'): void
  (e: 'feedback', msg: string): void
}>()

/* ═══ TYPES ═══ */

type StepId = 'size' | 'wood' | 'mount' | 'bowl' | 'temp' | 'patrons' | 'diffuser' | 'wire' | 'base' | 'bulbs'
type StepStatus = 'default' | 'chosen'

const SM: Record<StepId, { name: string; desc: string; icon: IconName }> = {
  size:     { name: 'Размер',       desc: 'Подберите размер под комнату',     icon: 'fxSize' },
  wood:     { name: 'Дерево',       desc: 'Три породы — три характера',       icon: 'leafy' },
  mount:    { name: 'Крепление',    desc: 'Как светильник крепится к потолку', icon: 'fxMount' },
  bowl:     { name: 'Чаша',         desc: 'Декоративная накладка на потолке',  icon: 'fxBowl' },
  temp:     { name: 'Температура',  desc: 'Оттенок света',                   icon: 'thermo' },
  patrons:  { name: 'Патроны',      desc: 'Больше патронов — ярче свет',      icon: 'sun' },
  diffuser: { name: 'Рассеиватель', desc: 'Мягкий свет без бликов',           icon: 'fxDiffuser' },
  wire:     { name: 'Подключение',  desc: 'Как подать электричество',         icon: 'fxWire' },
  base:     { name: 'Основание',    desc: 'Цвет ножки торшера',              icon: 'dotDashed' },
  bulbs:    { name: 'Лампочки',     desc: 'Включить в комплект?',             icon: 'bulb' },
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
const view = ref<'steps' | 'summary'>('steps')
const touched = ref(new Set<StepId>())

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
    steps: Object.fromEntries(stps.map(s => [s, 'default' as StepStatus])),
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
  return ids.map(id => ALL_BOWLS.find(b => b.id === id)).filter(Boolean) as Bowl[]
})
const freeBowls = computed(() => availBowls.value.filter(b => b.price === 0))
const paidBowls = computed(() => availBowls.value.filter(b => b.price > 0))

const simMats = computed(() => MATS.map(m => ({
  id: m.id as Wood, name: m.name,
  color: m.color || WCOL[m.id as Wood],
  tip: WOOD_TIPS[m.id as Wood] ?? '',
})))

const price = computed(() => {
  const m = model.value, b = build.value
  let p = m.p[b.wood] || 0
  p += Math.max(0, b.lamps - m.lamps) * m.sur
  if (b.diffuser && m.hasDiffuser) p += OPT_PRICE.diffuser
  if (b.moisture) p += OPT_PRICE.moisture
  if (m.bulbOpts) {
    const bo = m.bulbOpts.find(x => x.id === b.bulbOpt)
    if (bo) p += bo.price
  } else if (!m.bulbsIn && b.bulbs && m.bulbPrice) {
    p += Math.round(m.bulbPrice * b.lamps / m.lamps)
  }
  if (m.wireOpts) {
    const wo = m.wireOpts.find(x => x.id === b.wire)
    if (wo) p += wo.price
  }
  return p
})

const progress = computed(() => {
  const t = steps.value.length
  const d = steps.value.filter(s => build.value.steps[s] === 'chosen').length
  return { total: t, done: d, pct: t ? Math.round(d / t * 100) : 0 }
})
const status = computed(() => {
  const c = steps.value.filter(s => build.value.steps[s] === 'chosen').length
  if (c === steps.value.length) return 'Собран'
  return c > 0 ? 'В сборке' : 'Новый'
})
const sc = computed(() => status.value === 'Собран' ? T.green : status.value === 'В сборке' ? T.neutral : T.textDim)
const isDone = computed(() => status.value === 'Собран')

/* ═══ MUTATIONS ═══ */

function upBuild(patch: Partial<Build>) {
  build.value = { ...build.value, ...patch }
  touched.value = new Set([...touched.value, curStep.value])
}

function doCommit(isChoice: boolean) {
  build.value = { ...build.value, steps: { ...build.value.steps, [curStep.value]: isChoice ? 'chosen' : 'default' } }
  touched.value = new Set([...touched.value].filter(x => x !== curStep.value))
  advance()
}

function advance() {
  if (stepIdx.value < steps.value.length - 1) {
    stepIdx.value++
    if (steps.value[stepIdx.value] === 'bowl' && build.value.mount === 'flush') advance()
  } else { view.value = 'summary' }
}

function prev() { stepIdx.value > 0 ? stepIdx.value-- : emit('close') }
function goToStep(i: number) { stepIdx.value = i; view.value = 'steps' }

function lampOpts(): number[] {
  const r: number[] = []
  for (let i = model.value.minL; i <= model.value.maxL; i++) r.push(i)
  return r
}

function diffMult(): number {
  return build.value.diffuser && model.value.diffLoss ? (1 - model.value.diffLoss) : 1
}

function doSave() {
  const b = build.value
  emit('save', {
    m: b.m, q: props.item.q ?? 1, wood: b.wood, zone: props.item.zone, l: b.lamps,
    opts: {
      bowl: b.bowl, mount: b.mount, wire: b.wire, btemp: b.btemp,
      diffuser: b.diffuser, moisture: b.moisture, bulbs: b.bulbs,
      bulbOpt: b.bulbOpt, baseColor: b.baseColor,
    },
  })
  emit('close')
}

/* ═══ HELPERS ═══ */

const fmt = (n: number) => n.toLocaleString('ru-RU')
function spw(n: number) { const a = Math.abs(n), l = a % 10, t = a % 100; if (t >= 11 && t <= 19) return 'патронов'; if (l === 1) return 'патрон'; if (l >= 2 && l <= 4) return 'патрона'; return 'патронов' }
function slw(n: number) { const a = Math.abs(n), l = a % 10, t = a % 100; if (t >= 11 && t <= 19) return 'лампочек'; if (l === 1) return 'лампочка'; if (l >= 2 && l <= 4) return 'лампочки'; return 'лампочек' }
function bowlName() { return ALL_BOWLS.find(x => x.id === build.value.bowl)?.name ?? '—' }
function btempK() { const bt = BTEMPS.find(x => x.id === build.value.btemp); return bt ? bt.kelvin + 'К' : '—' }
function bulbTotal() { return (model.value.bulbPrice ?? OPT_PRICE.bulbsPerLamp) * build.value.lamps }
function bulbPer() { return model.value.bulbPrice ? Math.round(model.value.bulbPrice / model.value.lamps) : OPT_PRICE.bulbsPerLamp }
</script>

<template>
  <div :style="{ position: 'fixed', inset: 0, background: T.bg, zIndex: Z.fullscreenModal, overflow: 'auto' }">
    <div :style="{ maxWidth: '480px', margin: '0 auto', padding: '16px 20px', fontFamily: `'Segoe UI', system-ui, sans-serif`, color: T.text, display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }">

      <!-- ═══ STEPS ═══ -->
      <template v-if="view === 'steps'">
        <!-- Header -->
        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }">
          <button @click="prev" :style="{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer', padding: 0, fontSize: '20px' }">←</button>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: T.neutral }">{{ model.type }}</div>
            <div :style="{ fontSize: '18px', fontWeight: 700 }">{{ model.name }}</div>
          </div>
          <div :style="{ textAlign: 'right' }">
            <div :style="{ fontSize: '16px', fontWeight: 700, color: T.neutral }">{{ fmt(price) }} ₽</div>
            <div :style="{ fontSize: '10px', color: T.textDim }">{{ simMats.find(x => x.id === build.wood)?.name }}</div>
          </div>
        </div>
        <!-- Dots -->
        <div :style="{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }">
          <button v-for="(s, i) in steps" :key="s" @click="stepIdx = i" :style="{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }">
            <div :style="{ width: i === stepIdx ? '14px' : '8px', height: i === stepIdx ? '14px' : '8px', borderRadius: '50%', background: build.steps[s] === 'chosen' ? T.green : T.border, border: i === stepIdx ? `2px solid ${T.text}` : 'none', transition: 'all .2s' }" />
          </button>
        </div>
        <!-- Card -->
        <div :style="{ flex: 1 }">
          <div :style="{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '20px' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
                <Icon :name="meta.icon" :color="T.neutral" :size="18" />
                <span :style="{ fontSize: '16px', fontWeight: 700 }">{{ meta.name }}</span>
              </div>
              <span :style="{ fontSize: '11px', color: T.textDim }">{{ stepIdx + 1 }} из {{ steps.length }}</span>
            </div>
            <div :style="{ fontSize: '12px', color: T.textSec, marginBottom: '16px' }">{{ curStep === 'bulbs' ? `${build.lamps} ${spw(build.lamps)}` : meta.desc }}</div>

            <!-- size -->
            <div v-if="curStep === 'size' && families" :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
              <button v-for="fid in families" :key="fid" @click="() => { mid = fid; upBuild({ m: fid, lamps: MD[fid].lamps }) }"
                :style="{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer', border: build.m === fid ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.m === fid ? T.neutral + '18' : T.card, color: build.m === fid ? T.text : T.textSec }">
                <span :style="{ padding: '4px 10px', borderRadius: '6px', background: T.neutral + '22', fontSize: '14px', fontWeight: 800, color: T.neutral }">{{ MD[fid].letter }}</span>
                <div :style="{ flex: 1 }">
                  <div :style="{ fontSize: '16px', fontWeight: 700, color: T.text }">{{ MD[fid].dimD }} <span :style="{ fontSize: '12px', color: T.textSec }">см</span></div>
                  <div :style="{ fontSize: '11px', color: T.textDim }">высота {{ MD[fid].dimH }} см</div>
                  <div :style="{ fontSize: '11px', color: T.textSec, marginTop: '2px' }">{{ fmt(MD[fid].lmPer * MD[fid].lamps) }} лм</div>
                </div>
                <span :style="{ padding: '4px 10px', borderRadius: '6px', background: T.neutral + '15', fontSize: '12px', fontWeight: 700 }">{{ MD[fid].sqMin }}–{{ MD[fid].sqMax }} м²</span>
              </button>
            </div>

            <!-- wood -->
            <div v-else-if="curStep === 'wood'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }">
              <button v-for="mt in simMats" :key="mt.id" @click="upBuild({ wood: mt.id })"
                :style="{ padding: '16px 8px', borderRadius: '10px', cursor: 'pointer', border: build.wood === mt.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.wood === mt.id ? T.neutral + '18' : T.card, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }">
                <div :style="{ width: '40px', height: '40px', borderRadius: '50%', background: mt.color, border: mt.id === 'black' ? `2px solid ${T.textDim}` : 'none' }" />
                <div :style="{ fontSize: '14px', fontWeight: 700, color: build.wood === mt.id ? T.text : T.textSec, marginTop: '10px' }">{{ mt.name }}</div>
                <div v-if="mt.tip" :style="{ fontSize: '11px', color: T.textDim, marginTop: '6px', lineHeight: '1.4' }">{{ mt.tip }}</div>
              </button>
            </div>

            <!-- mount -->
            <div v-else-if="curStep === 'mount'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
              <button v-for="mt in SIM_MOUNTS" :key="mt.id" @click="upBuild({ mount: mt.id })"
                :style="{ padding: '18px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', border: build.mount === mt.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.mount === mt.id ? T.neutral + '18' : T.card, color: build.mount === mt.id ? T.text : T.textSec }">
                <div :style="{ fontSize: '13px', fontWeight: 600 }">{{ mt.name }}</div>
                <div :style="{ fontSize: '10px', color: T.textDim, marginTop: '6px' }">{{ mt.tip }}</div>
              </button>
            </div>

            <!-- bowl -->
            <div v-else-if="curStep === 'bowl'">
              <div v-if="freeBowls.length > 0">
                <div :style="{ fontSize: '10px', fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '6px' }">{{ paidBowls.length > 0 ? 'Стандарт · входит в цену' : 'Выберите чашу' }}</div>
                <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '6px' }">
                  <button v-for="b in freeBowls" :key="b.id" @click="upBuild({ bowl: b.id })"
                    :style="{ padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', border: build.bowl === b.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.bowl === b.id ? T.neutral + '18' : T.card, color: build.bowl === b.id ? T.text : T.textSec }">
                    <div :style="{ fontSize: '12px', fontWeight: 600 }">{{ b.name }}</div>
                  </button>
                </div>
              </div>
              <div v-if="paidBowls.length > 0" :style="{ marginTop: freeBowls.length > 0 ? '12px' : '0' }">
                <div :style="{ fontSize: '10px', fontWeight: 700, color: T.yellow, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '6px' }">С доплатой</div>
                <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '6px' }">
                  <button v-for="b in paidBowls" :key="b.id" @click="upBuild({ bowl: b.id })"
                    :style="{ padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', border: build.bowl === b.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.bowl === b.id ? T.neutral + '18' : T.card, color: build.bowl === b.id ? T.text : T.textSec }">
                    <div :style="{ fontSize: '12px', fontWeight: 600 }">{{ b.name }}</div>
                    <div :style="{ fontSize: '11px', color: T.yellow, marginTop: '3px' }">+{{ fmt(b.price) }} ₽</div>
                  </button>
                </div>
              </div>
            </div>

            <!-- temp -->
            <div v-else-if="curStep === 'temp'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }">
              <button v-for="bt in BTEMPS" :key="bt.id" @click="upBuild({ btemp: bt.id })"
                :style="{ padding: '12px 6px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', border: build.btemp === bt.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.btemp === bt.id ? T.neutral + '18' : T.card, color: build.btemp === bt.id ? T.text : T.textSec }">
                <div :style="{ fontSize: '13px', fontWeight: 700 }">{{ bt.label }}</div>
                <div :style="{ fontSize: '11px', color: T.textDim, marginTop: '2px' }">{{ bt.kelvin }}К</div>
                <div v-if="bt.tip" :style="{ fontSize: '10px', color: T.textSec, marginTop: '6px', lineHeight: '1.3' }">{{ bt.tip }}</div>
              </button>
            </div>

            <!-- patrons -->
            <div v-else-if="curStep === 'patrons'">
              <div :style="{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(lampOpts().length, 5)}, 1fr)`, gap: '8px' }">
                <button v-for="v in lampOpts()" :key="v" @click="upBuild({ lamps: v })"
                  :style="{ padding: '14px 4px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: build.lamps === v ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.lamps === v ? T.neutral + '18' : T.card }">
                  <div :style="{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', background: T.neutral + '22', fontSize: '10px', fontWeight: 700, color: T.neutral, marginBottom: '6px' }">{{ v }}</div>
                  <div :style="{ fontSize: '16px', fontWeight: 800, color: build.lamps === v ? T.yellow : T.text }">{{ fmt(Math.round(v * model.lmPer * diffMult())) }}</div>
                  <div :style="{ fontSize: '10px', color: T.textDim }">лм</div>
                  <div v-if="v === model.lamps" :style="{ fontSize: '10px', color: T.neutral, marginTop: '4px' }">станд.</div>
                  <div v-if="(v - model.lamps) * model.sur > 0" :style="{ fontSize: '11px', color: T.yellow, marginTop: '4px', fontWeight: 700 }">+{{ fmt((v - model.lamps) * model.sur) }} ₽</div>
                </button>
              </div>
            </div>

            <!-- diffuser -->
            <div v-else-if="curStep === 'diffuser'" :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
              <button @click="upBuild({ diffuser: true })" :style="{ width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', border: build.diffuser ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.diffuser ? T.neutral + '12' : T.cardAlt, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
                <div><div :style="{ fontSize: '14px', fontWeight: 700 }">Добавить рассеиватель</div><div :style="{ fontSize: '11px', color: T.textDim, marginTop: '4px' }">{{ OPT_TIPS.diffuser.on }}</div></div>
                <span :style="{ fontSize: '14px', fontWeight: 700, color: T.yellow, flexShrink: 0 }">+{{ fmt(OPT_PRICE.diffuser) }} ₽</span>
              </button>
              <button @click="upBuild({ diffuser: false })" :style="{ width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', border: !build.diffuser ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: !build.diffuser ? T.neutral + '12' : T.cardAlt, color: T.textSec, fontSize: '13px' }">{{ OPT_TIPS.diffuser.off }}</button>
            </div>

            <!-- wire -->
            <div v-else-if="curStep === 'wire' && model.wireOpts" :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
              <button v-for="w in model.wireOpts" :key="w.id" @click="upBuild({ wire: w.id })"
                :style="{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '8px', cursor: 'pointer', border: build.wire === w.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.wire === w.id ? T.neutral + '18' : T.card, color: build.wire === w.id ? T.text : T.textSec }">
                <div><div :style="{ fontSize: '13px', fontWeight: 600 }">{{ w.label }}</div><div v-if="w.tip" :style="{ fontSize: '10px', color: T.textDim, marginTop: '2px' }">{{ w.tip }}</div></div>
                <span v-if="w.price > 0" :style="{ fontSize: '12px', fontWeight: 700, color: T.yellow, flexShrink: 0 }">+{{ fmt(w.price) }} ₽</span>
                <span v-else :style="{ fontSize: '10px', color: T.green, flexShrink: 0 }">стандарт</span>
              </button>
            </div>

            <!-- base -->
            <div v-else-if="curStep === 'base'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }">
              <button v-for="(bc, bcId) in BASE_COLORS" :key="bcId" @click="upBuild({ baseColor: String(bcId) })"
                :style="{ padding: '20px 10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', border: build.baseColor === bcId ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.baseColor === bcId ? T.neutral + '18' : T.card, color: build.baseColor === bcId ? T.text : T.textSec }">
                <div :style="{ width: '36px', height: '36px', borderRadius: '50%', background: bc.color, margin: '0 auto 8px', border: `1px solid ${T.border}` }" />
                <div :style="{ fontSize: '14px', fontWeight: 700 }">{{ bc.name }}</div>
              </button>
            </div>

            <!-- bulbs (bulbOpts — Rotor X) -->
            <div v-else-if="curStep === 'bulbs' && model.bulbOpts" :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
              <div :style="{ fontSize: '12px', color: T.textSec, marginBottom: '2px' }">Включить в комплект?</div>
              <button v-for="bo in model.bulbOpts" :key="bo.id" @click="upBuild({ bulbOpt: bo.id })"
                :style="{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer', border: build.bulbOpt === bo.id ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.bulbOpt === bo.id ? T.neutral + '18' : T.card, color: build.bulbOpt === bo.id ? T.text : T.textSec, fontSize: '14px' }">
                <span :style="{ fontWeight: 600 }">{{ bo.label }}</span>
                <span v-if="bo.price > 0" :style="{ fontWeight: 700, color: T.yellow }">+{{ fmt(bo.price) }} ₽</span>
              </button>
            </div>

            <!-- bulbs (стандартные) -->
            <div v-else-if="curStep === 'bulbs'" :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
              <button @click="upBuild({ bulbs: true })" :style="{ width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', border: build.bulbs ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: build.bulbs ? T.neutral + '12' : T.cardAlt, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
                <div><div :style="{ fontSize: '14px', fontWeight: 700 }">Да, {{ build.lamps }} {{ slw(build.lamps) }}</div><div :style="{ fontSize: '11px', color: T.textDim, marginTop: '4px' }">{{ build.lamps }} × {{ fmt(bulbPer()) }} ₽</div></div>
                <span :style="{ fontSize: '14px', fontWeight: 700, color: T.yellow, flexShrink: 0 }">+{{ fmt(bulbTotal()) }} ₽</span>
              </button>
              <button @click="upBuild({ bulbs: false })" :style="{ width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', border: !build.bulbs ? (isTouched ? '2px solid #fff' : `2px solid ${T.neutral}`) : `1px solid ${T.border}`, background: !build.bulbs ? T.neutral + '12' : T.cardAlt, color: T.textSec, fontSize: '13px' }">Подберу свои лампочки</button>
            </div>
          </div>
        </div>
        <!-- Nav -->
        <div :style="{ display: 'flex', gap: '8px', marginTop: '16px', paddingBottom: '8px' }">
          <button v-if="stepIdx > 0" @click="prev" :style="{ padding: '12px 16px', background: 'none', border: `1px solid ${T.border}`, borderRadius: '8px', color: T.textSec, cursor: 'pointer', fontSize: '18px' }">←</button>
          <button @click="doCommit(isTouched)" :style="{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', background: isTouched ? T.text : T.neutral + '33', color: isTouched ? T.bg : T.neutral }">{{ isTouched ? '✓ Выбрать' : 'Пропустить →' }}</button>
        </div>
      </template>

      <!-- ═══ SUMMARY ═══ -->
      <template v-if="view === 'summary'">
        <div :style="{ textAlign: 'center', marginBottom: '20px', paddingTop: '20px' }">
          <div :style="{ width: '60px', height: '60px', borderRadius: '14px', background: sc + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" :stroke="sc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div :style="{ fontSize: '20px', fontWeight: 700 }">{{ model.name }}</div>
          <div :style="{ fontSize: '24px', fontWeight: 800, color: isDone ? sc : T.neutral, marginTop: '4px' }">{{ fmt(price) }} ₽</div>
          <div :style="{ display: 'inline-block', marginTop: '8px', padding: '4px 14px', borderRadius: '6px', background: sc + '22', fontSize: '13px', fontWeight: 700, color: sc }">{{ status }}</div>
        </div>
        <!-- Checklist -->
        <div :style="{ background: T.card, border: `1px solid ${isDone ? sc + '44' : T.border}`, borderRadius: '10px', padding: '14px', marginBottom: '16px' }">
          <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }">
            <span :style="{ fontSize: '13px', fontWeight: 700 }">Чеклист</span>
            <span :style="{ fontSize: '12px', fontWeight: 700, color: sc }">{{ isDone ? '' : `${progress.done} из ${progress.total}` }}</span>
          </div>
          <div :style="{ height: '6px', background: T.border, borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }">
            <div :style="{ height: '100%', width: progress.pct + '%', background: sc, borderRadius: '4px', transition: 'width .3s' }" />
          </div>
          <button v-for="(s, i) in steps" :key="s" @click="goToStep(i)"
            :style="{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < steps.length - 1 ? `1px solid ${T.border}` : 'none', textAlign: 'left' }">
            <Icon :name="SM[s]?.icon ?? 'sun'" :size="16" :color="build.steps[s] === 'chosen' ? T.green : T.textDim" />
            <span :style="{ flex: 1, fontSize: '13px', color: T.text }">{{ SM[s]?.name }}</span>
            <span :style="{ fontSize: '10px', padding: '3px 10px', borderRadius: '5px', fontWeight: 600, background: build.steps[s] === 'chosen' ? T.green + '22' : T.neutral + '15', color: build.steps[s] === 'chosen' ? T.green : T.neutral }">{{ build.steps[s] === 'chosen' ? 'Готово' : 'Выбрать' }}</span>
          </button>
        </div>
        <!-- My choices -->
        <div :style="{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', padding: '14px', marginBottom: '16px' }">
          <div :style="{ fontSize: '11px', fontWeight: 700, color: T.neutral, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '8px' }">Мой выбор</div>
          <div v-for="([k, v], i) in ([
            ['Дерево', simMats.find(x => x.id === build.wood)?.name],
            ['Свет', `${build.lamps} патр. · ${fmt(Math.round(build.lamps * model.lmPer * diffMult()))} лм · ${btempK()}`],
            model.hasMount ? ['Крепление', build.mount === 'pendant' ? 'На подвесе' : 'Вплотную'] : null,
            model.avBowls.length > 0 ? ['Чаша', bowlName()] : null,
            model.hasDiffuser ? ['Рассеиватель', build.diffuser ? `Да (+${fmt(OPT_PRICE.diffuser)} ₽)` : 'Нет'] : null,
            model.wireOpts ? ['Подключение', model.wireOpts.find(x => x.id === build.wire)?.label || '—'] : null,
            model.baseColors ? ['Основание', BASE_COLORS[build.baseColor as keyof typeof BASE_COLORS]?.name || '—'] : null,
            (model.bulbPrice || model.bulbOpts) ? ['Лампочки', model.bulbOpts ? (model.bulbOpts.find(x => x.id === build.bulbOpt)?.label ?? '—') : (build.bulbs ? `${build.lamps} шт` : 'Свои')] : null,
          ].filter(Boolean) as [string, string][])" :key="i"
            :style="{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '12px' }">
            <span :style="{ color: T.textSec }">{{ k }}</span>
            <span :style="{ fontWeight: 600 }">{{ v }}</span>
          </div>
        </div>
        <!-- Actions -->
        <div :style="{ display: 'flex', gap: '8px' }">
          <button @click="() => { stepIdx = 0; view = 'steps' }" :style="{ flex: 1, padding: '12px', background: 'none', border: `1px solid ${T.border}`, borderRadius: '8px', color: T.textSec, cursor: 'pointer', fontSize: '13px' }">Изменить</button>
          <button @click="doSave" :style="{ flex: 1, padding: '12px', background: isDone ? sc : T.neutral, color: T.bg, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }">Сохранить</button>
        </div>
        <div :style="{ textAlign: 'center', marginTop: '16px' }">
          <button @click="emit('delete')" :style="{ padding: '8px 20px', background: 'none', border: `1px solid ${T.red}55`, borderRadius: '6px', color: T.red, cursor: 'pointer', fontSize: '12px' }">Удалить светильник</button>
        </div>
      </template>
    </div>
  </div>
</template>
