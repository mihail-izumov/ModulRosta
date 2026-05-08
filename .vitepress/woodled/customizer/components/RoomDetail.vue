<script setup lang="ts">
/**
 * RoomDetail.vue — Полноэкранный редактор комнаты.
 *
 * Fix 2: Хедер заменён на NavHeader (единый стиль).
 */

import { computed, ref } from 'vue'
import { T, Z } from '../theme/tokens'
import { ALL_ZONES, type Fixture, type ZoneId } from '../data/catalog'
import { autoMood, type Mood } from '../data/moods'
import { getRT, ROOM_PREP, type Room, type ZoneLimits } from '../data/rooms'
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
import NavHeader from './ui/NavHeader.vue'
import MoodBlock from './MoodBlock.vue'
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

const roomPrepName = computed(() =>
  props.room.customName
    ? `в ${props.room.customName}`
    : ROOM_PREP[props.room.typeId] ?? `в ${rt.value.name}`
)

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
  emit('openFx', props.room.id, newIdx)
}

function handleSettingsPatch(key: keyof Room, value: unknown, toast?: string) {
  emit('update', { ...props.room, [key]: value as Room[typeof key] })
  if (toast) emit('feedback', toast)
}

const addZone = ref<ZoneId | null>(null)
const showSettings = ref(false)
const confirmDel = ref(false)
const showSmartHelp = ref(false)

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
    <NavHeader
      :title="props.room.customName || rt.name"
      back="Домой"
      @back="emit('close')"
    />

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

      <!-- Дашборд + Смарт-подбор -->
      <div
        :style="{
          background: T.card,
          border: `1px solid ${tintedMood.color}33`,
          borderRadius: '14px',
          padding: '12px 14px',
          marginBottom: '8px',
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
          <div
            :style="{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: tintedMood.color + '18',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flexShrink: 0,
            }"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="tintedMood.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/><path d="M10 22h4"/>
            </svg>
            <span :style="{ fontSize: '14px', fontWeight: 700, color: tintedMood.color }">{{ lamps }}</span>
          </div>

          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ fontSize: '15px', fontWeight: 700, color: T.text, marginBottom: '4px' }">
              {{ actual.toLocaleString('ru-RU') }}<span :style="{ fontWeight: 400, color: T.textSec }"> из {{ base.toLocaleString('ru-RU') }} лм</span>
            </div>
            <div :style="{ height: '5px', background: T.border, borderRadius: '3px', overflow: 'hidden' }">
              <div
                :style="{
                  height: '100%',
                  width: Math.min((actual / base) * 100, 100) + '%',
                  background: tintedMood.color,
                  borderRadius: '3px',
                  transition: 'width .3s',
                }"
              />
            </div>
          </div>

          <div
            :style="{
              padding: '6px 12px',
              borderRadius: '8px',
              background: bright.color + '22',
              fontSize: '12px',
              fontWeight: 700,
              color: bright.color,
              flexShrink: 0,
            }"
          >
            {{ bright.name }}
          </div>
        </div>

        <div
          v-if="actual > 0"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px',
            padding: '5px 10px',
            borderRadius: '8px',
            background: tintedMood.color + '10',
          }"
        >
          <div class="rotor-dash" :style="{ '--rc': tintedMood.color }" aria-hidden="true">
            <div v-for="i in 10" :key="i" class="rotor-dash-l" :style="{ '--rot': ((i - 1) / 10 * 360) + 'deg', animationDelay: ((i - 1) * 30) + 'ms' }" />
          </div>
          <div :style="{ fontSize: '10px', color: tintedMood.color + 'bb', flex: 1, fontWeight: 500 }">
            {{ smartLine }}
          </div>
          <button
            :style="{
              padding: '3px 8px', borderRadius: '6px',
              background: tintedMood.color + '18',
              border: `1px solid ${tintedMood.color}33`,
              color: tintedMood.color,
              cursor: 'pointer', fontSize: '9px', fontWeight: 600,
              flexShrink: 0, whiteSpace: 'nowrap',
            }"
            @click="showSmartHelp = true"
          >Смарт-подбор</button>
        </div>
      </div>

      <!-- Glow wrapper + 2×2 зоны -->
      <div
        :style="{
          position: 'relative',
          marginBottom: '16px',
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

      <FurnitureBlock
        v-if="rt.furn.length > 0"
        :rt="rt"
        :room="props.room"
        :furn-pct="furnPct"
        :tint="tint"
        @toggle="onFurnToggle"
      />

      <MoodBlock
        v-if="props.room.fixtures.length > 0"
        :mood="tintedMood"
        :ratio="ratio"
        :room-prep-name="roomPrepName"
        @show-detail="onShowMoodDetail"
      />

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
