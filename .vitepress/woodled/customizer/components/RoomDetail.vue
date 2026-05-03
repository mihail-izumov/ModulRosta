<script setup lang="ts">
/**
 * RoomDetail.vue — Полноэкранный редактор комнаты.
 *
 * Источник: woodled-v42.jsx (RoomDetail).
 * Компоновка сверху вниз:
 *   - Sticky header (← / название / кнопка размер-потолок)
 *   - MoodBlock (если есть свет)
 *   - LumenDashboard
 *   - Glow wrapper + 2×2 сетка ZoneCard
 *   - FurnitureBlock (если в rt есть furn)
 *   - «Удалить комнату»
 *   - Footer
 *
 * Плюс модалки: RoomSettings, AddFxModal, Confirm.
 * (FxEditor и MoodDetailModal — на корневом уровне App.vue, чтобы избежать
 *  stacking-context конфликта со StickyBar.)
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

/* Endel glow: 4 слоя, интенсивность ∝ share каждой зоны. */
interface GlowLayer {
  pos: string
  opacity: number
}
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
  setFx([...props.room.fixtures, fx], `${MD[fx.m]?.name} добавлен`)
}

/* Settings-patch (с тостом). */
function handleSettingsPatch(key: keyof Room, value: unknown, toast?: string) {
  emit('update', { ...props.room, [key]: value as Room[typeof key] })
  if (toast) emit('feedback', toast)
}

/* ──────────────── UI state ──────────────── */

const addZone = ref<ZoneId | null>(null)
const showSettings = ref(false)
const confirmDel = ref(false)

/* Hit-limit toast для ZoneCard. */
function onLimitHit(zId: ZoneId) {
  const limit = (props.room.limits ?? rt.value.limits)?.[zId] ?? 99
  const zName = ALL_ZONES.find((z) => z.id === zId)?.name ?? zId
  emit(
    'feedback',
    `${zName}: все ${limit} ${pw(limit)} заняты. Добавьте точки в настройках комнаты →`,
  )
}

/* Мебель: передаёт новый массив. */
function onFurnToggle(next: string[], toast: string) {
  patchRoom('furniture', next as Room['furniture'])
  emit('feedback', toast)
}

/* Удаление комнаты — через confirmDel модалку. */
function confirmDelete() {
  confirmDel.value = false
  emit('delete')
  emit('close')
}

/* Открыть полноэкранный онбординг настроения — пишем в store напрямую,
 * чтобы App.vue (который рендерит модалку) увидел и мог скрыть StickyBar. */
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

      <!-- Удаление комнаты + woodNames -->
      <div
        :style="{
          marginTop: '50px',
          paddingTop: '16px',
          borderTop: `1px solid ${T.border}`,
        }"
      >
        <div :style="{ textAlign: 'center' }">
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
            @click="confirmDel = true"
          >
            Удалить комнату
          </button>
        </div>
        <div
          v-if="props.room.fixtures.length > 0"
          :style="{
            fontSize: '11px',
            color: T.textDim,
            marginTop: '8px',
            textAlign: 'center',
          }"
        >
          Потеряете {{ actual.toLocaleString('ru-RU') }} лм — {{ woodNames(props.room.fixtures) }}
        </div>
      </div>

      <Footer />

      <!-- Bottom spacer для global sticky bar -->
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

    <AddFxModal
      v-if="addZone"
      :zone="addZone"
      :def-wood="rW"
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

    <!-- tiny unused ref silencer -->
    <span v-show="false">{{ Icon }}</span>
  </div>
</template>
