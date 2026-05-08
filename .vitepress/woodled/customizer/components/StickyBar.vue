<script setup lang="ts">
/**
 * StickyBar.vue — Закреплённая нижняя панель с двумя кнопками.
 *
 * Fix 3: Кнопка «Мой лес» — белый фон, без обводки, тёмный текст.
 */

import { T, Z } from '../theme/tokens'
import Icon from './ui/Icons.vue'

const emit = defineEmits<{ share: []; buy: [] }>()
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: Z.stickyBar,
    }"
  >
    <div
      :style="{
        height: '32px',
        background: `linear-gradient(to bottom, transparent, ${T.bg})`,
      }"
    />
    <div
      :style="{
        background: T.bg,
        padding: '8px 16px 16px',
        maxWidth: '560px',
        margin: '0 auto',
      }"
    >
      <div :style="{ display: 'flex', gap: '10px' }">
        <button
          :style="{
            flex: 1,
            padding: '12px 0',
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: T.text,
            fontSize: '13px',
            fontWeight: 600,
          }"
          @click="emit('share')"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Поделиться
        </button>

        <button
          :style="{
            flex: 1,
            padding: '12px 0',
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: T.bg,
            fontSize: '13px',
            fontWeight: 600,
          }"
          @click="emit('buy')"
        >
          <Icon name="trees" :color="T.bg" :size="16" />
          Мой лес
        </button>
      </div>
    </div>
  </div>
</template>
