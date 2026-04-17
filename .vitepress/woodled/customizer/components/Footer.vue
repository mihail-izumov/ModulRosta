<script setup lang="ts">
/**
 * Footer.vue — Лого WOODLED внизу страниц.
 *
 * Источник: woodled-v42.jsx (Footer).
 * SVG-лого инвертируется в белое через filter.
 */
</script>

<template>
  <div
    :style="{
      marginTop: '60px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
      opacity: 0.35,
    }"
  >
    <img
      src="https://runscale.ru/woodled/customizer/woodled-logo.svg"
      alt="WOODLED"
      :style="{ height: '22px', filter: 'brightness(0) invert(1)' }"
    />
  </div>
</template>
