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
    <div
      :style="{
        fontFamily: `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif`,
        fontSize: 'clamp(28px, 5vw, 40px)',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: PAGE.text,
        lineHeight: 1,
      }"
    >
      Живой Дом
    </div>

    <a
      href="https://woodled.ru"
      target="_blank"
      rel="noopener noreferrer"
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        opacity: 0.85,
      }"
      aria-label="WOODLED.RU"
    >
      <!--
        <img> + filter:brightness(0) — preserves the SVG's native aspect
        ratio automatically (width:auto) and recolors any fill to pure black.
        Height scales with viewport via clamp so the proportion to "Живой Дом"
        (clamp 28..40) stays consistent across mobile and desktop.
      -->
      <img
        :src="LOGO_URL"
        alt="WOODLED"
        :style="{
          height: 'clamp(22px, 3.8vw, 32px)',
          width: 'auto',
          display: 'block',
          filter: 'brightness(0)',
        }"
      />
    </a>
  </header>
</template>
