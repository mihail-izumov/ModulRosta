<script setup lang="ts">
/**
 * NavHeader.vue — Единый sticky-хедер для всех экранов.
 *
 * iOS-style: высота 48px, back-кнопка слева, заголовок по центру (absolute).
 * Слот #right для дополнительных действий (pen в RoomSettings).
 *
 * Используется в: RoomDetail, FxEditor, BuyModal (×2), RoomSettings, ColorPickerModal.
 */

import { T, Z } from '../../theme/tokens'

interface Props {
  title: string
  back?: string
}
withDefaults(defineProps<Props>(), { back: 'Назад' })
defineEmits<{ back: [] }>()
</script>

<template>
  <div
    :style="{
      position: 'sticky',
      top: 0,
      height: '48px',
      background: T.bg,
      borderBottom: `1px solid ${T.border}`,
      zIndex: Z.stickyHeader,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '12px',
      paddingRight: '12px',
      flexShrink: 0,
    }"
  >
    <button
      :style="{
        background: 'none',
        border: 'none',
        color: T.textSec,
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        padding: '4px 8px 4px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        fontFamily: 'inherit',
        lineHeight: 1,
      }"
      @click="$emit('back')"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64z"/>
      </svg>
      {{ back }}
    </button>

    <div
      :style="{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '16px',
        fontWeight: 700,
        color: T.text,
        whiteSpace: 'nowrap',
        maxWidth: '60%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }"
    >
      {{ title }}
    </div>

    <div :style="{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }">
      <slot name="right" />
    </div>
  </div>
</template>
