<script setup lang="ts">
/**
 * RoomDetail.vue — Полноэкранный редактор комнаты.
 *
 * Единственное изменение: AddFxModal получает roomArea, roomBaseLm, roomCurrentLm
 * для автоподбора размера светильника (см. AUTOSIZE.md).
 */

import { computed, ref } from 'vue'
import { T, Z } from '../theme/tokens'
import { ALL_ZONES, type Fixture, type ZoneId } from '../data/catalog'
import { autoMood, type Mood } from '../data/moods'
import { getRT, type Room, type ZoneLimits } from '../data/rooms'
import {
  baseLm, fxLm, fxLamps, getArea, furnPct as furnPctFn,
} from '../engine/brightness'
import {
  zoneFxCount, zoneLm,
  roomWood, roomZones, glowOpacity, opacityToHex, GLOW_POS,
} from '../engine/zone-engine'
import { pw, woodNames } from '../engine/i18n'
import { MD } from '../data/catalog'
import { getBright } from '../data/moods'
import { useConfigurator } from '../store/configurator'

import Icon from './ui/Icons.vue'
import Modal from './ui/Modal.vue'
import MoodBlock from './MoodBlock.vue'
import LumenDashboard from './LumenDashboard.vue'
import ZoneCard from './ZoneCard.vue'
import FurnitureBlock from './FurnitureBlock.vue'
import Footer from './Footer.vue'
import RoomSettings from './RoomSettings.vue'
import AddFxModal from './AddFxModal.vue'

interface Props {
  room: Room
}
const props = defineProps<Props>()
const emit = defineEmits<{
  update: [room: Room]
  delete: []
  close: []
  feedback: [msg: string]
  openFx: [roomId: string, fxIdx: number]
}>()

const cfg = useConfigurator()

/* ──────────────── Производные ──────────────── */

const rt = computed(() => getRT(props.room.typeId))
const base = computed(() => baseLm(rt.value, props.room))
const actual = computed(() => fxLm(props.room.fixtures))
const lamps = computed(() => fxLamps(props.room.fixtures))
const ratio = computed(() => (base.value > 0 ? actual.value / base.value : 0))
const mood = computed<Mood>(() => autoMood(ratio.value))
const tint = computed(() => props.room.cardColor ?? T.neutral)
const tintedMood = computed<Mood>(() => ({ ...mood.value, color: tint.value }))
const bright = computed(() => getBright(ratio.value))
const rW = computed(() => roomWood(props.room.fixtures))
const furnPct = computed(() => furnPctFn(props.room.furniture))
const zones = computed(() => roomZones(rt.value))
const area = computed(() => getArea(rt.value, props.room))

/* Endel glow */
interface GlowLayer { pos: string; opacity: number }
const glowLayers = computed<GlowLayer[]>(() =>
  zones.value.map((z) => ({
    pos: GLOW_POS[z.id] ?? GLOW_POS.center,
    opacity: glowOpacity(
      actual.value > 0 ? zoneLm(props.room.fixtures, z.id) / actual.value : 0,
    ),
  })),
)

function glowHex(op: number): string {
  return opacityToHex(op)
}

/* ──────────────── Мутации ──────────────── */

function patchRoom<K extends keyof Room>(key: K, value: Room[K]) {
  emit('update', { ...props.room, [key]: value })
}

function setFx(nf: Fixture[], toast?: string) {
  emit('update', { ...props.room, fixtures: nf })
  if (toast) emit('feedback', toast)
}

function addFx(fx: Fixture) {
  const limit = (props.room.limits ?? rt.value.limits)?.[fx.zone] ?? 99
  const cur = zoneFxCount(props.room.fixtures, fx.zone)
  if (cur >= limit) {
    const zName = ALL_ZONES.find((z) => z.id === fx.zone)?.name ?? fx.zone
    emit('feedback', `Максимум ${limit} точек для ${zName}`)
    return
  }
  const newFixtures = [...props.room.fixtures, fx]
  const newIdx = newFixtures.length - 1
  emit('update', { ...props.room, fixtures: newFixtures })
  emit('feedback', `${MD[fx.m]?.name} добавлен`)
  // Сразу открываем FxEditor — новый светильник стартует в онбординг-режиме
  emit('openFx', props.room.id, newIdx)
}

function handleSettingsPatch(key: keyof Room, value: unknown, toast?: string) {
  emit('update', { ...props.room, [key]: value as Room[typeof key] })
  if (toast) emit('feedback', toast)
}

/* ──────────────── UI state ──────────────── */

const addZone = ref<ZoneId | null>(null)
const showSettings = ref(false)
const confirmDel = ref(false)
const showSmartHelp = ref(false)

/** Текст для Смарт-подбор — действие, не повтор статуса. */
const smartLine = computed(() => {
  const r = ratio.value
  const rx = r.toFixed(2).replace(/\.?0+$/, '')
  if (r <= 0.5) return `${rx}× — добавьте светильники`
  if (r <= 0.8) return `${rx}× — добавьте бра или торшер`
  if (r <= 2.0) return `${rx}× — ничего менять не нужно`
  if (r <= 4.0) return `${rx}× — поставьте диммер`
  return `${rx}× — уберите лишнее или диммер`
})

function onLimitHit(zId: ZoneId) {
  const limit = (props.room.limits ?? rt.value.limits)?.[zId] ?? 99
  const zName = ALL_ZONES.find((z) => z.id === zId)?.name ?? zId
  emit(
    'feedback',
    `${zName}: все ${limit} ${pw(limit)} заняты. Добавьте точки в настройках комнаты →`,
  )
}

function onFurnToggle(next: string[], toast: string) {
  patchRoom('furniture', next as Room['furniture'])
  emit('feedback', toast)
}

function confirmDelete() {
  confirmDel.value = false
  emit('delete')
  emit('close')
}

function onShowMoodDetail() {
  cfg.showMoodDetail.value = tintedMood.value
}
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.roomDetail,
      overflow: 'auto',
    }"
  >
    <!-- Sticky header -->
    <div
      :style="{
        padding: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        position: 'sticky',
        top: 0,
        background: T.bg,
        zIndex: Z.stickyHeader,
      }"
    >
      <button
        :style="{
          background: 'none',
          border: 'none',
          color: T.textSec,
          fontSize: '14px',
          cursor: 'pointer',
          padding: '2px 4px',
        }"
        @click="emit('close')"
      >
        ← Домой
      </button>
      <span :style="{ flex: 1, fontWeight: 700, fontSize: '18px', color: T.text, textAlign: 'center' }">
        {{ props.room.customName || rt.name }}
      </span>
      <span :style="{ width: '70px' }" />
    </div>

    <div :style="{ padding: '16px', maxWidth: '480px', margin: '0 auto' }">
      <!-- Параметры комнаты -->
      <div
        :style="{
          background: `linear-gradient(135deg, ${tint}28, ${tint}10)`,
          border: `1px solid ${tint}33`,
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }"
        @click="showSettings = true"
      >
        <div
          :style="{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: tint + '22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }"
        >
          <Icon name="slidersH" :color="tint" :size="20" />
        </div>
        <div :style="{ flex: 1 }">
          <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
            Параметры комнаты
          </div>
          <div :style="{ fontSize: '11px', color: tint, marginTop: '2px' }">
            {{ props.room.sizeIndex === 3 ? (props.room.customArea ?? '') + ' м²' : rt.ranges[props.room.sizeIndex] + ' м²' }}
            · потолок {{ props.room.ceilingH }} м
          </div>
        </div>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          :stroke="tint" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"
          :style="{ flexShrink: 0, opacity: 0.6 }"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <!-- Дашборд люмен -->
      <LumenDashboard
        :mood="tintedMood"
        :bright="bright"
        :lamps="lamps"
        :actual="actual"
        :base="base"
        :ratio="ratio"
      />

      <!-- Смарт-подбор: компактная плашка внутри дашборда -->
      <div
        v-if="actual > 0"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 10px',
          marginTop: '-10px',
          marginBottom: '8px',
          marginLeft: '1px',
          marginRight: '1px',
          borderRadius: '0 0 13px 13px',
          background: T.card,
          borderLeft: `1px solid ${bright.color}33`,
          borderRight: `1px solid ${bright.color}33`,
          borderBottom: `1px solid ${bright.color}33`,
          position: 'relative',
          zIndex: 1,
        }"
      >
        <div class="rotor-dash" :style="{ '--rc': bright.color }" aria-hidden="true">
          <div v-for="i in 10" :key="i" class="rotor-dash-l" :style="{ '--rot': ((i - 1) / 10 * 360) + 'deg', animationDelay: ((i - 1) * 30) + 'ms' }" />
        </div>
        <div :style="{ fontSize: '10px', color: bright.color + 'bb', flex: 1, fontWeight: 500 }">
          {{ smartLine }}
        </div>
        <button
          :style="{
            padding: '3px 8px', borderRadius: '6px',
            background: bright.color + '18',
            border: `1px solid ${bright.color}33`,
            color: bright.color,
            cursor: 'pointer', fontSize: '9px', fontWeight: 600,
            flexShrink: 0, whiteSpace: 'nowrap',
          }"
          @click="showSmartHelp = true"
        >Смарт-подбор</button>
      </div>

      <!-- Glow wrapper + 2×2 сетка зон -->
      <div
        :style="{
          position: 'relative',
          marginBottom: 0,
          background: tintedMood.color + '06',
          borderRadius: '16px',
          border: `1px solid ${tintedMood.color}15`,
          padding: '8px',
        }"
      >
        <div
          v-for="(gl, i) in glowLayers"
          :key="i"
          :style="{
            position: 'absolute',
            inset: 0,
            borderRadius: '16px',
            pointerEvents: 'none',
            zIndex: 1,
            background: `radial-gradient(ellipse 55% 55% at ${gl.pos}, ${tintedMood.color}${glowHex(gl.opacity)}, transparent 65%)`,
            transition: 'background 1s ease',
          }"
        />

        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            position: 'relative',
            zIndex: 2,
          }"
        >
          <ZoneCard
            v-for="zone in zones"
            :key="zone.id"
            :zone="zone"
            :fixtures="props.room.fixtures"
            :mood="tintedMood"
            :total-lm="actual"
            :limit="(props.room.limits ?? rt.limits)?.[zone.id] ?? 99"
            @add="addZone = zone.id"
            @edit="(idx) => emit('openFx', props.room.id, idx)"
            @limit-hit="onLimitHit(zone.id)"
          />
        </div>
      </div>

      <!-- Настроение -->
      <MoodBlock
        v-if="props.room.fixtures.length > 0"
        :mood="tintedMood"
        @show-detail="onShowMoodDetail"
      />

      <!-- Мебель -->
      <FurnitureBlock
        v-if="rt.furn.length > 0"
        :rt="rt"
        :room="props.room"
        :furn-pct="furnPct"
        :tint="tint"
        @toggle="onFurnToggle"
      />

      <!-- Опасная зона -->
      <div
        :style="{
          marginTop: '32px',
          padding: '14px',
          background: T.red + '14',
          border: `1px solid ${T.red}33`,
          borderRadius: '10px',
        }"
      >
        <div
          :style="{
            fontSize: '12px',
            color: T.textSec,
            marginBottom: '10px',
            lineHeight: '1.5',
          }"
        >
          Комната будет удалена со всеми светильниками и настройками.<template v-if="props.room.fixtures.length > 0"> Потеряете {{ actual.toLocaleString('ru-RU') }} лм и {{ woodNames(props.room.fixtures) }}.</template>
        </div>
        <button
          :style="{
            width: '100%',
            padding: '10px',
            background: 'none',
            border: `1px solid ${T.red}44`,
            borderRadius: '8px',
            color: T.red,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }"
          @click="confirmDel = true"
        >
          Удалить комнату
        </button>
      </div>

      <Footer />
      <div :style="{ height: '80px' }" />
    </div>

    <!-- ───────── Модалки ───────── -->

    <RoomSettings
      v-if="showSettings"
      :rt="rt"
      :room="props.room"
      @patch="handleSettingsPatch"
      @close="showSettings = false"
    />

    <!-- AddFxModal: передаём данные комнаты для автоподбора размера -->
    <AddFxModal
      v-if="addZone"
      :zone="addZone"
      :def-wood="rW"
      :room-area="area"
      :room-base-lm="base"
      :room-current-lm="actual"
      :room-fixtures="props.room.fixtures"
      :room-name="props.room.customName || rt.name"
      @add="(fx) => { addFx(fx); addZone = null }"
      @close="addZone = null"
    />

    <Modal v-if="confirmDel" @close="confirmDel = false">
      <div :style="{ padding: '20px', textAlign: 'center' }">
        <div :style="{ color: T.text, fontSize: '14px', marginBottom: '16px' }">
          Удалить {{ props.room.customName || rt.name }}?
        </div>
        <div :style="{ display: 'flex', gap: '8px' }">
          <button
            :style="{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: `1px solid ${T.border}`,
              color: T.textSec,
              borderRadius: '6px',
              cursor: 'pointer',
            }"
            @click="confirmDel = false"
          >
            Нет
          </button>
          <button
            :style="{
              flex: 1,
              padding: '10px',
              background: T.red,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }"
            @click="confirmDelete"
          >
            Удалить
          </button>
        </div>
      </div>
    </Modal>

    <span v-show="false">{{ Icon }}</span>

    <!-- Смарт-подбор модалка — полный клон из FxEditor -->
    <Teleport to="body">
      <div v-if="showSmartHelp" :style="{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }" @click.self="showSmartHelp = false">
        <div :style="{ width: '100%', maxWidth: '480px', maxHeight: '92vh', overflow: 'auto', background: T.bg, borderTopLeftRadius: '18px', borderTopRightRadius: '18px', borderTop: `1px solid ${T.border}` }">
          <div :style="{ padding: '20px 20px 16px' }">

            <div :style="{ display: 'flex', justifyContent: 'center', padding: '20px 0 14px' }">
              <div class="rotor-hero" aria-hidden="true">
                <div v-for="i in 16" :key="i" class="rotor-hero-l" :style="{ '--rot': ((i-1)/16*360) + 'deg', animationDelay: ((i-1)*40) + 'ms' }" />
              </div>
            </div>

            <div :style="{ textAlign: 'center', marginBottom: '24px' }">
              <div :style="{ fontSize: '10px', fontWeight: 700, color: T.neutral, letterSpacing: '1.5px', marginBottom: '8px' }">СМАРТ-ПОДБОР</div>
              <div :style="{ fontSize: '22px', fontWeight: 800, color: T.text, lineHeight: 1.2, marginBottom: '10px' }">Как подбирается<br/>размер светильника</div>
              <div :style="{ fontSize: '13px', color: T.textSec, lineHeight: 1.6, maxWidth: '340px', margin: '0 auto' }">Алгоритм WOODLED сравнивает яркость всех светильников в комнате с нормой и подсказывает лучшее сочетание.</div>
            </div>

            <div :style="{ marginBottom: '24px' }">
              <div :style="{ fontSize: '12px', fontWeight: 700, color: T.textSec, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '10px' }">Учитываем три фактора</div>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
                <div :style="{ padding: '14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }">
                  <div :style="{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px', background: T.neutral + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.neutral" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M14 15H9v-5"/><path d="M16 3h5v5"/><path d="M21 3 9 15"/></svg></div>
                  <div :style="{ flex: 1 }"><div :style="{ fontSize: '13px', fontWeight: 700, color: T.text, marginBottom: '3px' }">Площадь и норма</div><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }">Базовая норма — 100 лм/м². Для спальни мягче, для кухни ярче. Каждая модель Rotor рассчитана на свой диапазон м².</div></div>
                </div>
                <div :style="{ padding: '14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }">
                  <div :style="{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px', background: T.yellow + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.yellow" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98"/><ellipse cx="12" cy="19" rx="9" ry="3"/></svg></div>
                  <div :style="{ flex: 1 }"><div :style="{ fontSize: '13px', fontWeight: 700, color: T.text, marginBottom: '3px' }">Все светильники в комнате</div><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }">Спот, бра, торшер — суммируем общий свет, и на этом фоне считаем, сколько добавит выбранный Rotor.</div></div>
                </div>
                <div :style="{ padding: '14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }">
                  <div :style="{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px', background: T.green + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg></div>
                  <div :style="{ flex: 1 }"><div :style="{ fontSize: '13px', fontWeight: 700, color: T.text, marginBottom: '3px' }">Мебель и зоны</div><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }">Стол, диван, кухонный гарнитур поднимают локальную норму — рабочей зоне нужно больше света, чем проходу.</div></div>
                </div>
              </div>
            </div>

            <div :style="{ marginBottom: '24px' }">
              <div :style="{ fontSize: '12px', fontWeight: 700, color: T.textSec, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '10px' }">Что означают статусы</div>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
                <div v-for="row in [
                  { label: 'Не хватает', color: T.red, desc: '< 50% нормы. Тёмная комната.' },
                  { label: 'Приглушённо', color: T.yellow, desc: '50–80%. Для атмосферы, но не для работы.' },
                  { label: 'Комфортно', color: T.green, desc: '80–200%. Целевой диапазон для жизни.' },
                  { label: 'С запасом', color: T.neutral, desc: '200–400%. Хорошо с диммером.' },
                  { label: 'Избыточно', color: T.textDim, desc: '> 400%. Слишком ярко без диммера.' },
                ]" :key="row.label" :style="{ padding: '10px 12px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }">
                  <div :style="{ padding: '4px 10px', borderRadius: '6px', background: row.color + '22', color: row.color, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', minWidth: '92px', textAlign: 'center' }">{{ row.label }}</div>
                  <div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.4, flex: 1 }">{{ row.desc }}</div>
                </div>
              </div>
            </div>

            <div :style="{ marginBottom: '24px' }">
              <div :style="{ fontSize: '12px', fontWeight: 700, color: T.textSec, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '10px' }">Кнопка «Выбери за меня»</div>
              <div :style="{ padding: '14px', background: T.green + '10', border: `1px solid ${T.green}33`, borderRadius: '12px' }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }">
                  <span :style="{ width: '22px', height: '22px', borderRadius: '50%', background: T.green, color: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }">✓</span>
                  <span :style="{ fontSize: '13px', fontWeight: 700, color: T.green }">Доверьтесь зелёной галочке</span>
                </div>
                <div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.6 }">Если несколько размеров подходят — нажмите «Выбери за меня». Алгоритм выберет самый сбалансированный: ровно столько света, сколько нужно, без переплаты за избыточный размер.</div>
              </div>
            </div>

            <div :style="{ marginBottom: '24px' }">
              <div :style="{ fontSize: '12px', fontWeight: 700, color: T.textSec, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '10px' }">Когда положиться на алгоритм</div>
              <div :style="{ padding: '14px', background: T.green + '10', border: `1px solid ${T.green}33`, borderRadius: '12px', marginBottom: '8px' }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }">
                  <span :style="{ width: '22px', height: '22px', borderRadius: '50%', background: T.green, color: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }">✓</span>
                  <span :style="{ fontSize: '13px', fontWeight: 700, color: T.green }">Обычная комната</span>
                </div>
                <div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.6 }">Типичная мебель, потолок до 2.7 м, светлые стены — рекомендация попадёт в комфортный диапазон.</div>
              </div>
              <div :style="{ padding: '14px', background: T.cardAlt, border: `1px solid ${T.border}`, borderRadius: '12px' }">
                <div :style="{ fontSize: '13px', fontWeight: 700, color: T.text, marginBottom: '10px' }">Играйте — выбирайте и пробуйте:</div>
                <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
                  <div :style="{ display: 'flex', gap: '8px', alignItems: 'flex-start' }"><span :style="{ color: T.yellow, fontSize: '14px', flexShrink: 0, marginTop: '1px' }">→</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Высокий потолок (&gt;3 м)</b> — выберите на размер крупнее</div></div>
                  <div :style="{ display: 'flex', gap: '8px', alignItems: 'flex-start' }"><span :style="{ color: T.yellow, fontSize: '14px', flexShrink: 0, marginTop: '1px' }">→</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Тёмные стены, мало окон</b> — тоже крупнее</div></div>
                  <div :style="{ display: 'flex', gap: '8px', alignItems: 'flex-start' }"><span :style="{ color: T.yellow, fontSize: '14px', flexShrink: 0, marginTop: '1px' }">→</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Конкретная задача</b> — выбирайте под зону</div></div>
                  <div :style="{ display: 'flex', gap: '8px', alignItems: 'flex-start' }"><span :style="{ color: T.yellow, fontSize: '14px', flexShrink: 0, marginTop: '1px' }">→</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Хотите минимализм</b> — компактнее + диммер</div></div>
                </div>
              </div>
            </div>

            <div :style="{ marginBottom: '24px' }">
              <div :style="{ fontSize: '12px', fontWeight: 700, color: T.textSec, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '10px' }">Как пользоваться</div>
              <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
                <div :style="{ padding: '12px 14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }"><span :style="{ width: '22px', height: '22px', borderRadius: '6px', background: T.neutral + '22', color: T.neutral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }">1</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Сравните карточки</b> — статусы показывают, как ляжет размер в комнату.</div></div>
                <div :style="{ padding: '12px 14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }"><span :style="{ width: '22px', height: '22px', borderRadius: '6px', background: T.neutral + '22', color: T.neutral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }">2</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">«Выбери за меня»</b> — алгоритм подставит лучший.</div></div>
                <div :style="{ padding: '12px 14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }"><span :style="{ width: '22px', height: '22px', borderRadius: '6px', background: T.neutral + '22', color: T.neutral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }">3</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Подбор обновляется</b> — при изменениях в комнате.</div></div>
                <div :style="{ padding: '12px 14px', background: T.card, border: `1px solid ${T.border}`, borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }"><span :style="{ width: '22px', height: '22px', borderRadius: '6px', background: T.neutral + '22', color: T.neutral, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }">4</span><div :style="{ fontSize: '12px', color: T.textSec, lineHeight: 1.5 }"><b :style="{ color: T.text }">Можно менять позже</b> — пересмотрите в чек-листе.</div></div>
              </div>
            </div>

            <button :style="{ width: '100%', padding: '14px', background: T.text, color: T.bg, border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }" @click="showSmartHelp = false">Супер!</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.rotor-dash { width: 20px; height: 20px; position: relative; flex-shrink: 0; }
.rotor-dash-l {
  position: absolute; top: 50%; left: 50%;
  width: 1.5px; height: 5px; margin: -2.5px 0 0 -.75px;
  border-radius: 1px;
  background: var(--rc, #b4915a);
  transform-origin: 50% 50%;
  animation: rotorDashCycle 5000ms ease-in-out infinite;
  opacity: 0;
}
@keyframes rotorDashCycle {
  0%   { transform: rotate(var(--rot)) translateY(-14px) scale(0.3); opacity: 0; }
  5%   { transform: rotate(var(--rot)) translateY(-7px) scale(1);   opacity: 0.7; }
  80%  { transform: rotate(var(--rot)) translateY(-7px) scale(1);   opacity: 0.7; }
  90%  { transform: rotate(var(--rot)) translateY(-14px) scale(0.3); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-14px) scale(0.3); opacity: 0; }
}
.rotor-hero { width: 100px; height: 100px; position: relative; animation: rotorHeroSpin 18s linear infinite; }
.rotor-hero-l {
  position: absolute; top: 50%; left: 50%;
  width: 3px; height: 22px; margin: -11px 0 0 -1.5px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #d4b87a, #b4915a, #8a6e3e);
  transform-origin: 50% 50%;
  animation: rotorHeroAssemble 3500ms ease-in-out infinite;
  opacity: 0;
}
@keyframes rotorHeroSpin { to { transform: rotate(360deg); } }
@keyframes rotorHeroAssemble {
  0%   { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
  20%  { transform: rotate(var(--rot)) translateY(-32px) scale(1);   opacity: 0.9; }
  70%  { transform: rotate(var(--rot)) translateY(-32px) scale(1);   opacity: 0.9; }
  85%  { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-70px) scale(0.4); opacity: 0; }
}
</style>
