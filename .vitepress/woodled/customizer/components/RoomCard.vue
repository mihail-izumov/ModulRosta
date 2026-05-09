<script setup lang="ts">
/**
 * RoomCard.vue — Карточка комнаты на главном экране.
 *
 * batch11 #6:
 *   #2 — Пилюля с названием комнаты УЖЕ: padding 8px со всех сторон
 *        (было асимметрично 8px 14px 8px 22px). Боковые отступы =
 *        вертикальные = 8px (как воздух вокруг иконки палитры).
 *   #3 — Кнопка «Больше Света» полностью удалена. Дизайн перенесён
 *        в ZoneCard на странице комнаты.
 *   #4 — В центр rotor-анимации (для пустых карточек) добавлен
 *        пульсирующий круг с «+» внутри. Дизайн в дубовых тонах
 *        (как ламели), пульсирует opacity + scale, показывая что
 *        карточка в спящем режиме и ждёт действия.
 */

import { computed } from 'vue'
import { T, WCOL } from '../theme/tokens'
import { MD } from '../data/catalog'
import { MATS } from '../data/materials'
import { autoMood } from '../data/moods'
import { baseLm, fxLm } from '../engine/brightness'
import { getRT, type Room } from '../data/rooms'
import Icon, { fxIcName } from './ui/Icons.vue'

interface Props {
  room: Room
}
const props = defineProps<Props>()
const emit = defineEmits<{ click: []; pickColor: [] }>()

const rt = computed(() => getRT(props.room.typeId))
const base = computed(() => baseLm(rt.value, props.room))
const actual = computed(() => fxLm(props.room.fixtures))
const ratio = computed(() => (base.value > 0 ? actual.value / base.value : 0))
const mood = computed(() => autoMood(ratio.value))

// batch6: per-instance random offsets для десинхронизации
const cardSpinOffset = `-${(Math.random() * 90).toFixed(2)}s`
const cardCycleOffset = `-${(Math.random() * 12).toFixed(2)}s`
// batch11 #6 (#4): отдельный offset для пульса, чтобы карточки не пульсировали в унисон
const pulseOffset = `-${(Math.random() * 2.5).toFixed(2)}s`

const cardStyle = computed(() => {
  const isEmpty = mood.value.id === 'empty'
  const cc = props.room.cardColor
  const tint = cc ?? (isEmpty ? null : T.neutral)
  return {
    background: tint ? `linear-gradient(135deg, ${tint}22, ${tint}08)` : T.card,
    border: `1px solid ${tint ? tint + '44' : T.border}`,
    borderRadius: '12px',
    padding: '14px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    minHeight: '160px',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }
})

/** batch11 #6 (#2): пилюля уже — padding 8px со всех сторон. */
const badgeStyle = computed(() => {
  const cc = props.room.cardColor
  const tint = cc ?? (mood.value.id === 'empty' ? null : T.neutral)
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '999px',
    background: cc
      ? `linear-gradient(135deg, ${cc}cc, ${cc}88)`
      : tint ? tint + '30' : T.border,
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
    position: 'relative' as const,
    zIndex: 2,
  }
})

const bgShadowColor = computed(() => {
  const cc = props.room.cardColor
  return cc ? cc + '50' : '#00000080'
})

interface Circle {
  key: string; type: string; wood: string; color: string; matName: string; isBlack: boolean
}

const circles = computed<Circle[]>(() => {
  const out: Circle[] = []
  props.room.fixtures.forEach((it, i) => {
    const md = MD[it.m]
    if (!md) return
    const wood = it.wood ?? 'oak'
    const col = WCOL[wood]
    const matName = MATS.find((x) => x.id === wood)?.name ?? 'Дуб'
    const q = it.q ?? 1
    for (let j = 0; j < q; j++) {
      out.push({ key: `${i}-${j}`, type: md.type, wood, color: col, matName, isBlack: wood === 'black' })
    }
  })
  return out
})

const paletteIconColor = computed(() => '#fff')

/** Текст названия — для боковой части пилюли (для отступа слева). */
const roomName = computed(() => props.room.customName || rt.value.name)
</script>

<template>
  <div :style="cardStyle" @click="emit('click')">
    <!-- ═══ BG-ротор: ламели (только в empty) ═══ -->
    <div
      v-if="mood.id === 'empty'"
      :style="{
        position: 'absolute',
        top: '54%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '130px',
        height: '130px',
        opacity: 0.18,
        filter: `drop-shadow(0 8px 18px ${bgShadowColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
        pointerEvents: 'none',
        zIndex: 0,
      }"
      aria-hidden="true"
    >
      <div class="rotor-card" :style="{ animationDelay: cardSpinOffset }">
        <div
          v-for="i in 12"
          :key="i"
          class="rotor-card-l"
          :style="{
            '--rot': ((i - 1) / 12 * 360) + 'deg',
            animationDelay: `calc(${cardCycleOffset} + ${((i - 1) * 0.144).toFixed(3)}s)`,
          }"
        />
      </div>
    </div>

    <!-- ═══ batch11 #6 (#4): пульсирующий «+» в круге, поверх ламелей ═══ -->
    <div
      v-if="mood.id === 'empty'"
      class="rotor-pulse"
      :style="{
        position: 'absolute',
        top: '54%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
        animationDelay: pulseOffset,
      }"
      aria-hidden="true"
    >
      <div class="rotor-pulse-ring">
        <span class="rotor-pulse-plus">+</span>
      </div>
    </div>

    <!-- ═══ Бейдж с названием + иконка палитры ═══ -->
    <div :style="badgeStyle">
      <span>{{ roomName }}</span>
      <button
        :style="{
          background: 'rgba(255,255,255,0.18)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          flexShrink: 0,
        }"
        @click.stop="emit('pickColor')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="paletteIconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/>
          <circle cx="13.5" cy="6.5" r="1.5" :fill="paletteIconColor" stroke="none"/>
          <circle cx="17.5" cy="10.5" r="1.5" :fill="paletteIconColor" stroke="none"/>
          <circle cx="6.5" cy="12.5" r="1.5" :fill="paletteIconColor" stroke="none"/>
          <circle cx="8.5" cy="7.5" r="1.5" :fill="paletteIconColor" stroke="none"/>
        </svg>
      </button>
    </div>

    <!-- ═══ Filled state: круги светильников ═══ -->
    <template v-if="mood.id !== 'empty'">
      <div
        :style="{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }"
      >
        <div v-if="circles.length === 0" :style="{ fontSize: '11px', color: T.textDim, padding: '12px 0' }">
          Добавьте свет
        </div>
        <div
          v-for="c in circles"
          :key="c.key"
          :style="{ textAlign: 'center', width: '44px' }"
        >
          <div
            :style="{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: c.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: c.isBlack ? `2px solid ${T.textDim}` : 'none',
            }"
          >
            <Icon :name="fxIcName(c.type as any)" :color="T.bg" :size="16" />
          </div>
          <div
            :style="{
              fontSize: '11px',
              fontWeight: 500,
              color: T.text,
              marginTop: '4px',
              lineHeight: 1.2,
              opacity: 0.85,
            }"
          >
            {{ c.matName }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.rotor-card {
  width: 100%;
  height: 100%;
  position: relative;
  animation: rotorCardSpin 90s linear infinite;
}

.rotor-card-l {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 36px;
  margin: -18px 0 0 -2px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #d4b87a, #b4915a, #8a6e3e);
  transform-origin: 50% 50%;
  animation: rotorCardCycle 12s ease-in-out infinite;
  opacity: 0;
}

@keyframes rotorCardSpin {
  to { transform: rotate(360deg); }
}

@keyframes rotorCardCycle {
  0%   { transform: rotate(var(--rot)) translateY(-60px) scale(0.3); opacity: 0; }
  5%   { transform: rotate(var(--rot)) translateY(-45px) scale(1);   opacity: 0.95; }
  80%  { transform: rotate(var(--rot)) translateY(-45px) scale(1);   opacity: 0.95; }
  90%  { transform: rotate(var(--rot)) translateY(-60px) scale(0.3); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-60px) scale(0.3); opacity: 0; }
}

/* batch11 #6 (#4): пульсирующий «+» в круге, дубовые тона */
.rotor-pulse {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotorPulse 2.4s ease-in-out infinite;
}

.rotor-pulse-ring {
  width: 38px;
  height: 38px;
  border: 2px solid #b4915a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(180, 145, 90, 0.06);
}

.rotor-pulse-plus {
  font-size: 24px;
  font-weight: 300;
  color: #d4b87a;
  line-height: 1;
  /* Микроподъём чтобы оптически центрировать «+» */
  margin-top: -2px;
}

@keyframes rotorPulse {
  0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 0.9;  transform: translate(-50%, -50%) scale(1.08); }
}
</style>
