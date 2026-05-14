<script setup lang="ts">
import { PAGE } from './tokens'
</script>

<template>
  <footer
    :style="{
      padding: '16px 24px 32px',
      maxWidth: '720px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }"
  >
    <div
      :style="{
        width: '100%',
        padding: '18px 24px',
        background: '#FFFFFF',
        borderRadius: '999px',
        textAlign: 'center',
        boxShadow:
          '0 8px 28px rgba(184, 125, 82, 0.22), 0 2px 8px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(184, 125, 82, 0.06)',
        fontSize: '15px',
        fontWeight: 500,
        letterSpacing: 0,
      }"
    >
      <span :style="{ color: PAGE.roseLight, opacity: 0.78 }">Заряжено </span>
      <a
        href="https://runscale.ru/"
        target="_blank"
        rel="noopener noreferrer"
        :style="{
          color: PAGE.rose,
          textDecoration: 'none',
        }"
      >
        <span
          :style="{
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1.5px',
          }"
        >
          Модулем&nbsp;Роста
        </span>
        <span :style="{ textDecoration: 'none' }">®</span>
      </a>
    </div>
  </footer>
</template>
