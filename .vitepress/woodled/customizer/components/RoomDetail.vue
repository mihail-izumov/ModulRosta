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
 * Плюс модалки: RoomSettings, FxEditor, AddFxModal, RemoveFxModal, MoodDetailModal, Confirm.
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

import Icon from './ui/Icons.vue'
import Modal from './ui/Modal.vue'
import MoodBlock from './MoodBlock.vue'
import LumenDashboard from './LumenDashboard.vue'
import ZoneCard from './ZoneCard.vue'
import FurnitureBlock from './FurnitureBlock.vue'
import Footer from './Footer.vue'
import RoomSettings from './RoomSettings.vue'
import FxEditor from './FxEditor.vue'
import AddFxModal from './AddFxModal.vue'
import RemoveFxModal from './RemoveFxModal.vue'
import MoodDetailModal from './MoodDetailModal.vue'

interface Props {
  room: Room
}
const props = defineProps<Props>()
const emit = defineEmits<{
  update: [room: Room]
  delete: []
  close: []
  feedback: [msg: string]
}>()

/* ──────────────── Производные ──────────────── */

const rt = computed(() => getRT(props.room.typeId))
const base = computed(() => baseLm(rt.value, props.room))
const actual = computed(() => fxLm(props.room.fixtures))
const lamps = computed(() => fxLamps(props.room.fixtures))
const ratio = computed(() => (base.value > 0 ? actual.value / base.value : 0))
const mood = computed<Mood>(() => autoMood(ratio.value))
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

function removeFxAt(idx: number) {
  const name = MD[props.room.fixtures[idx]?.m]?.name
  emit('feedback', `${name} убран`)
  setFx(props.room.fixtures.filter((_, i) => i !== idx))
}

function updateFxAt(idx: number, next: Fixture) {
  const nf = [...props.room.fixtures]
  nf[idx] = next
  setFx(nf)
}

/* Settings-patch (с тостом). */
function handleSettingsPatch(key: keyof Room, value: unknown, toast?: string) {
  emit('update', { ...props.room, [key]: value as Room[typeof key] })
  if (toast) emit('feedback', toast)
}

/* ──────────────── UI state ──────────────── */

const editFx = ref<number | null>(null)
const addZone = ref<ZoneId | null>(null)
const showSettings = ref(false)
const confirmDel = ref(false)
const removeFxIdx = ref<number | null>(null)
const showMoodDetail = ref<Mood | null>(null)

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
        padding: '10px 16px',
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
          padding: '0 4px',
        }"
        @click="emit('close')"
      >
        ← Домой
      </button>
      <span :style="{ flex: 1, fontWeight: 700, fontSize: '18px', color: T.text, textAlign: 'center' }">
        {{ props.room.customName || rt.name }}
      </span>
      <button
        :style="{
          background: T.card,
          border: `1px solid ${T.neutral}44`,
          borderRadius: '8px',
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          color: T.text,
        }"
        @click="showSettings = true"
      >
        {{ getArea(rt, props.room) }} м² · {{ props.room.ceilingH }} м
        <Icon name="pen" :color="T.textSec" :size="12" style="margin-left: 6px; vertical-align: middle; opacity: 0.6;" />
      </button>
    </div>

    <div :style="{ padding: '16px', maxWidth: '480px', margin: '0 auto' }">
      <!-- Дашборд люмен -->
      <LumenDashboard
        :mood="mood"
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
          background: mood.color + '06',
          borderRadius: '16px',
          border: `1px solid ${mood.color}15`,
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
            background: `radial-gradient(ellipse 55% 55% at ${gl.pos}, ${mood.color}${glowHex(gl.opacity)}, transparent 65%)`,
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
            :mood="mood"
            :total-lm="actual"
            :limit="(props.room.limits ?? rt.limits)?.[zone.id] ?? 99"
            @add="addZone = zone.id"
            @edit="(idx) => (editFx = idx)"
            @limit-hit="onLimitHit(zone.id)"
          />
        </div>
      </div>

      <!-- Настроение -->
      <MoodBlock
        v-if="props.room.fixtures.length > 0"
        :mood="mood"
        @show-detail="showMoodDetail = mood"
      />

      <!-- Мебель -->
      <FurnitureBlock
        v-if="rt.furn.length > 0"
        :rt="rt"
        :room="props.room"
        :furn-pct="furnPct"
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
    </div>

    <!-- ───────── Модалки ───────── -->

    <RoomSettings
      v-if="showSettings"
      :rt="rt"
      :room="props.room"
      @patch="handleSettingsPatch"
      @close="showSettings = false"
    />

    <FxEditor
      v-if="editFx !== null && props.room.fixtures[editFx]"
      :item="props.room.fixtures[editFx]"
      :def-wood="rW"
      @save="(n) => editFx !== null && updateFxAt(editFx, n)"
      @delete="() => { removeFxIdx = editFx; editFx = null }"
      @close="editFx = null"
      @feedback="(msg) => emit('feedback', msg)"
    />

    <RemoveFxModal
      v-if="removeFxIdx !== null && props.room.fixtures[removeFxIdx]"
      :item="props.room.fixtures[removeFxIdx]"
      @confirm="() => { removeFxAt(removeFxIdx!); removeFxIdx = null }"
      @close="removeFxIdx = null"
    />

    <AddFxModal
      v-if="addZone"
      :zone="addZone"
      :def-wood="rW"
      @add="(fx) => { addFx(fx); addZone = null }"
      @close="addZone = null"
    />

    <MoodDetailModal
      v-if="showMoodDetail"
      :mood="showMoodDetail"
      @close="showMoodDetail = null"
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
