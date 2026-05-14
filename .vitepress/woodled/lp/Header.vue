<script setup lang="ts">
import { PAGE } from './tokens'

const LOGO_URL = '/woodled/customizer/woodled-logo.svg'
</script>

<template>
  <header
    :style="{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }"
  >
    <div :style="{ fontSize: '18px', fontWeight: 800, letterSpacing: 0, color: PAGE.text }">
      Мой Лес WOODLED
    </div>

    <a
      href="https://woodled.ru"
      target="_blank"
      rel="noopener noreferrer"
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        opacity: 0.85,
      }"
      aria-label="WOODLED.RU"
    >
      <!-- Logo via CSS mask so it inherits the page text color -->
      <div
        :style="{
          width: '120px',
          height: '22px',
          background: PAGE.text,
          maskImage: `url(${LOGO_URL})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center right',
          WebkitMaskImage: `url(${LOGO_URL})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center right',
        }"
      />
    </a>
  </header>
</template>
