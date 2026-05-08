<script setup lang="ts">
/**
 * RoomCard.vue — Карточка комнаты на главном экране.
 *
 * Fix v5 (empty state):
 *   - Дубовый лист заменён на анимацию сборки ротора (12 ламелей).
 *     Та же логика, что в Preloader (assemble) и RoomDetail dashboard
 *     (rotor-dash) — ламели циклично собираются в круг и медленно
 *     вращаются. Размер/положение/прозрачность/тени — как у листа.
 *   - Ламели всегда в дубовом градиенте (бренд rotor); цвет карточки
 *     передаётся через тонирующую drop-shadow.
 *   - НЕ трогается лист в ZoneCard на странице комнаты — он остаётся.
 *
 * Fix v6 (batch6 — desync + slowdown):
 *   - Spin: 30s → 90s (почти неощутимое вращение)
 *   - Cycle: 5s → 12s (спокойное «дыхание»)
 *   - Stagger: 60ms → 144ms (пропорционально, wave-эффект тот же)
 *   - Per-instance random negative delays — 4 карточки на главной
 *     никогда не в одной фазе, гипноз убран.
 *
 * Кнопка «Больше Света» — glassmorphism: subtle bg, backdrop-blur,
 * pill-форма, цвет в тон карточки. Лежит над ротором (zIndex 2).
 */

import { computed } from 'vue'
import { T, WCOL, RGBA } from '../theme/tokens'
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

// ── batch6: per-instance random offsets для десинхронизации ──
// Negative delay = анимация стартует «уже в процессе», без паузы.
const cardSpinOffset = `-${(Math.random() * 90).toFixed(2)}s`
const cardCycleOffset = `-${(Math.random() * 12).toFixed(2)}s`

const cardStyle = computed(() => {
  const isEmpty = mood.value.id === 'empty'
  const cc = props.room.cardColor
  const tint = cc ?? (isEmpty ? null : T.neutral)
  return {
    background: tint
      ? `linear-gradient(135deg, ${tint}22, ${tint}08)`
      : T.card,
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

const badgeStyle = computed(() => {
  const cc = props.room.cardColor
  const tint = cc ?? (mood.value.id === 'empty' ? null : T.neutral)
  return {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '12px',
    background: cc
      ? `linear-gradient(135deg, ${cc}cc, ${cc}88)`
      : tint ? tint + '30' : T.border,
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    position: 'relative' as const,
    zIndex: 2,
  }
})

// Цвета для empty state
const accentColor = computed(() => props.room.cardColor ?? T.textSec)
const accentText = computed(() => props.room.cardColor ?? T.text)
// Цвет тонирующей тени — карточный, либо нейтральный тёмный
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
</script>

<template>
  <div :style="cardStyle" @click="emit('click')">
    <!-- ═══ BG-ротор: анимация сборки ламелей (только в empty) ═══ -->
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
      <div
        class="rotor-card"
        :style="{ animationDelay: cardSpinOffset }"
      >
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

    <!-- ═══ Палитра (выбор цвета) ═══ -->
    <button
      :style="{
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: props.room.cardColor ? props.room.cardColor + '44' : T.border,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'all .2s',
        zIndex: 3,
      }"
      @click.stop="emit('pickColor')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="props.room.cardColor ?? T.textSec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/>
        <circle cx="13.5" cy="6.5" r="1.5" :fill="props.room.cardColor ?? T.textSec" stroke="none"/>
        <circle cx="17.5" cy="10.5" r="1.5" :fill="props.room.cardColor ?? T.textSec" stroke="none"/>
        <circle cx="6.5" cy="12.5" r="1.5" :fill="props.room.cardColor ?? T.textSec" stroke="none"/>
        <circle cx="8.5" cy="7.5" r="1.5" :fill="props.room.cardColor ?? T.textSec" stroke="none"/>
      </svg>
    </button>

    <!-- ═══ Badge с названием ═══ -->
    <div :style="badgeStyle">
      {{ props.room.customName || rt.name }}
    </div>

    <!-- ═══ Empty state: pill-кнопка над ротором ═══ -->
    <template v-if="mood.id === 'empty'">
      <div
        :style="{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
          position: 'relative',
          zIndex: 2,
        }"
      >
        <!-- Glassmorphism pill -->
        <div
          :style="{
            padding: '4px 12px',
            background: props.room.cardColor
              ? props.room.cardColor + '14'
              : 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${accentColor}66`,
            borderRadius: '999px',
            color: accentText,
            fontSize: '10px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            lineHeight: 1.4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }"
        >
          <Icon name="up" :color="accentText" :size="12" />
          Больше Света
        </div>
      </div>
    </template>

    <!-- ═══ Filled state: круги светильников ═══ -->
    <template v-else>
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
              fontSize: '10px',
              color: T.text,
              marginTop: '4px',
              lineHeight: 1.2,
              opacity: 0.8,
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
/**
 * Анимация сборки ротора для empty-карточки.
 *
 * batch6: замедление (spin 90s, cycle 12s) + десинхронизация
 * (random negative animation-delay через inline :style).
 *
 * Все animation-delay управляются inline — здесь только
 * animation shorthand без delay-компоненты.
 *
 * Геометрия: контейнер 130×130, ламель 4×36px, сборка на translateY(-45px),
 * scattered на translateY(-60px). Всё внутри 130×130 без overflow.
 *
 * Брендовый дубовый градиент — как в Preloader (--pl-oakL/oak/oakD).
 */

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
</style>
