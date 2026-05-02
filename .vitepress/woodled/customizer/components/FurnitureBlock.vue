<script setup lang="ts">
/**
 * FurnitureBlock.vue — Секция «Обстановка» в RoomDetail.
 *
 * Источник: woodled-v42.jsx (блок furn с чипами + бейджем потерь).
 * Toggle-чип на каждую мебель, бейдж с % потерь, текст furnText.
 */

import { computed } from 'vue'
import { T } from '../theme/tokens'
import { FURN, furnText, furnStatus } from '../data/furniture'
import type { FurnId, Room, RoomType } from '../data/rooms'
import { baseLm } from '../engine/brightness'
import Chip from './ui/Chip.vue'

interface Props {
  rt: RoomType
  room: Room
  furnPct: number
  tint?: string
}
const props = withDefaults(defineProps<Props>(), { tint: '#A89878' })
const emit = defineEmits<{
  toggle: [nextFurn: FurnId[], toast: string]
}>()

const text = computed(() => furnText(props.room.furniture, props.furnPct))
const status = computed(() => furnStatus(props.furnPct))

/**
 * Тост по добавлению/удалению. Количество лм — «сколько мебель съедает».
 */
function handleToggle(id: FurnId) {
  const f = FURN[id]
  if (!f) return
  const isIn = props.room.furniture.includes(id)
  const next: FurnId[] = isIn
    ? props.room.furniture.filter((x) => x !== id)
    : [...props.room.furniture, id]

  let toast = ''
  if (isIn) {
    toast = `${f.name} убрана — вернулось ${Math.round(f.ab * 100)}% света`
  } else {
    const baseNoFurn = baseLm(props.rt, { ...props.room, furniture: [] })
    const lm = Math.round(f.ab * baseNoFurn)
    toast = `${f.name}: −${Math.round(f.ab * 100)}% света, нужно ещё ${lm} лм`
  }
  emit('toggle', next, toast)
}
</script>

<template>
  <div
    :style="{
      background: props.tint + '08',
      borderRadius: '10px',
      padding: '12px',
      marginTop: '16px',
      textAlign: 'center',
      border: `1px solid ${props.tint}18`,
    }"
  >
    <div
      :style="{
        fontSize: '11px',
        fontWeight: 600,
        color: T.text,
        marginBottom: '8px',
      }"
    >
      Обстановка
    </div>

    <div
      :style="{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
        justifyContent: 'center',
      }"
    >
      <Chip
        v-for="id in props.rt.furn"
        :key="id"
        :active="props.room.furniture.includes(id)"
        :tint="props.tint"
        @click="handleToggle(id)"
      >
        {{ FURN[id]?.name }}
      </Chip>
    </div>

    <div v-if="props.furnPct !== 0" :style="{ marginTop: '8px' }">
      <span
        :style="{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '10px',
          background: props.tint + '18',
          fontSize: '11px',
          fontWeight: 600,
          color: props.tint,
        }"
      >
        <template v-if="props.furnPct > 0">−{{ props.furnPct }}% меньше света</template>
        <template v-else>+{{ Math.abs(props.furnPct) }}% больше</template>
        · {{ status }}
      </span>
    </div>

    <div
      :style="{
        fontSize: '11px',
        color: T.text,
        marginTop: '8px',
        lineHeight: 1.5,
      }"
    >
      {{ text }}
    </div>
  </div>
</template>
