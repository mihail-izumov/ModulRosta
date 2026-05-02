<script setup lang="ts">
/**
 * RoomCard.vue — Карточка комнаты на главном экране.
 *
 * Источник: woodled-v42.jsx (RoomCard).
 * Два состояния:
 *   - empty: hint + leafy icon
 *   - with mood: цветной бейдж + круги деревьев
 */

import { computed } from 'vue'
import { T, WCOL } from '../theme/tokens'
import { MD } from '../data/catalog'
import { MATS } from '../data/materials'
import { autoMood } from '../data/moods'
import { baseLm, fxLm } from '../engine/brightness'
import { getRT, type Room, ROOM_HINTS } from '../data/rooms'
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
  const tint = cc ?? (isEmpty ? null : mood.value.color)
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
    minHeight: '140px',
    textAlign: 'center' as const,
    position: 'relative' as const,
  }
})

const badgeStyle = computed(() => ({
  display: 'inline-block',
  padding: '3px 12px',
  borderRadius: '12px',
  background: mood.value.id === 'empty' ? T.border : mood.value.color + '30',
  fontSize: '11px',
  fontWeight: 600,
  color: T.text,
}))

/**
 * Разворачиваем каждую единицу светильника (учитывая q > 1) в отдельный круг.
 */
interface Circle {
  key: string
  type: string
  wood: string
  color: string
  matName: string
  isBlack: boolean
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
      out.push({
        key: `${i}-${j}`,
        type: md.type,
        wood,
        color: col,
        matName,
        isBlack: wood === 'black',
      })
    }
  })
  return out
})
</script>

<template>
  <div :style="cardStyle" @click="emit('click')">
    <!-- Palette icon -->
    <button
      :style="{
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: props.room.cardColor ? props.room.cardColor + '33' : T.border + '88',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        opacity: 0.7,
        transition: 'opacity .2s',
      }"
      @click.stop="emit('pickColor')"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" :stroke="props.room.cardColor ?? T.textSec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    </button>
    <div :style="badgeStyle">
      {{ props.room.customName || rt.name }}
    </div>

    <template v-if="mood.id === 'empty'">
      <div
        :style="{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.35,
        }"
      >
        <Icon name="leafy" :color="T.textSec" :size="40" />
      </div>
      <div :style="{ fontSize: '12px', color: T.textSec }">
        {{ ROOM_HINTS[props.room.typeId] ?? 'Добавьте свет' }}
      </div>
    </template>

    <template v-else>
      <div
        :style="{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
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
