<script setup lang="ts">
/**
 * MoodBlock.vue — Блок настроения внутри RoomDetail.
 *
 * Источник: woodled-v42.jsx (секция mood в RoomDetail).
 * Показывается только когда в комнате есть хотя бы один светильник.
 */

import { T, RGBA } from '../theme/tokens'
import type { Mood } from '../data/moods'

interface Props {
  mood: Mood
}
defineProps<Props>()
const emit = defineEmits<{ showDetail: [] }>()
</script>

<template>
  <div
    :style="{
      background: mood.color + '30',
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '16px',
      textAlign: 'center',
    }"
  >
    <div :style="{ fontSize: '16px', fontWeight: 700, color: '#fff' }">
      {{ mood.name }}
    </div>
    <div
      :style="{
        fontSize: '12px',
        color: 'rgba(255,255,255,.7)',
        marginTop: '4px',
        lineHeight: 1.5,
      }"
    >
      {{ mood.desc }}
    </div>
    <button
      :style="{
        marginTop: '10px',
        padding: '8px 18px',
        background: RGBA.white12,
        border: `1px solid ${RGBA.white20}`,
        borderRadius: '8px',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
      }"
      @click="emit('showDetail')"
    >
      Больше о настроении
    </button>
  </div>
</template>
