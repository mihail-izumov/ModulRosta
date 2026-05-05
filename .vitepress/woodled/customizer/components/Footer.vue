<script setup lang="ts">
/**
 * Footer.vue — Лого WOODLED внизу страниц.
 *
 * Источник: woodled-v42.jsx (Footer).
 *
 * Подход: SVG рендерится как CSS-маска, а цвет задаётся через background.
 * Это окрашивает лого в тон темы (T.neutral — тёплый бежевый).
 *
 * Ссылка «Начать заново» переехала в HouseStats → блок «Дополнительно».
 * Это единая точка управления домом — больше нигде не дублируется.
 */

import { T } from '../theme/tokens'

const LOGO_URL = 'https://runscale.ru/woodled/customizer/woodled-logo.svg'
</script>

<template>
  <div
    :style="{
      marginTop: '60px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
      opacity: 0.55,
    }"
  >
    <div
      :style="{
        width: '130px',
        height: '22px',
        background: T.neutral,
        maskImage: `url(${LOGO_URL})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${LOGO_URL})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }"
    />
  </div>
</template>
