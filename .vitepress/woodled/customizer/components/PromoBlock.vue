<script setup lang="ts">
/**
 * PromoBlock.vue — «3 000 ₽ на первый светильник».
 *
 * Источник: woodled-v42.jsx (главный экран, блок с IC.gift).
 * Показывается когда все комнаты пусты. По клику открывает гостиную.
 */

import { T, RGBA } from '../theme/tokens'
import Icon from './ui/Icons.vue'

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <div
    :style="{
      background: RGBA.white06,
      border: `1px solid ${RGBA.white12}`,
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }"
    @click="emit('click')"
  >
    <div
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: T.green + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }"
    >
      <Icon name="gift" :color="T.text" :size="22" />
    </div>
    <div :style="{ flex: 1 }">
      <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
        3 000 ₽ на первый светильник
      </div>
      <div
        :style="{
          fontSize: '11px',
          color: T.text,
          marginTop: '2px',
          opacity: 0.7,
        }"
      >
        Соберите лес WOODLED Rotor и получите скидку
      </div>
    </div>
    <span :style="{ fontSize: '20px', color: T.textSec }">›</span>
  </div>
</template>
