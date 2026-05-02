<script setup lang="ts">
/**
 * Chip.vue — Чип-кнопка.
 *
 * Источник: woodled-v42.jsx (Chip).
 * Две грани: активный (с neutral-рамкой) и неактивный (с border-рамкой).
 */

import { computed, type StyleValue } from 'vue'
import { T } from '../../theme/tokens'

interface Props {
  active?: boolean
  tint?: string
  style?: StyleValue
}
const props = withDefaults(defineProps<Props>(), {
  active: false,
  tint: '',
  style: () => ({}),
})

const baseStyle = computed<StyleValue>(() => {
  const c = props.tint || T.neutral
  return {
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    border: `1px solid ${props.active ? c : T.border}`,
    background: props.active ? c + '22' : 'transparent',
    color: props.active ? T.text : T.textSec,
  }
})
</script>

<template>
  <button :style="[baseStyle, props.style]">
    <slot />
  </button>
</template>
