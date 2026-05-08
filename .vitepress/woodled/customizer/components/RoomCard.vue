<script setup lang="ts">
/**
 * RoomCard.vue — Карточка комнаты на главном экране.
 *
 * Fix v4 (empty state):
 *   - Дубовый лист крупный (130px), прозрачный (opacity 0.18),
 *     с drop-shadow для объёма. Сидит фоном по центру карточки.
 *   - Кнопка «Больше Света» — glassmorphism: subtle bg, backdrop-blur,
 *     pill-форма, цвет в тон карточки. Лежит над листом (zIndex 1).
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
const leafShadowColor = computed(() => {
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
    <!-- ═══ BG-лист (только в empty state) ═══ -->
    <Icon
      v-if="mood.id === 'empty'"
      name="leafy"
      :color="accentColor"
      :size="130"
      :style="{
        position: 'absolute',
        top: '54%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.16,
        filter: `drop-shadow(0 8px 18px ${leafShadowColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
        pointerEvents: 'none',
        zIndex: 0,
      }"
    />

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

    <!-- ═══ Empty state: pill-кнопка над листом ═══ -->
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
