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
      ><!-- Two separate underlined words + an un-underlined nbsp between them.
          This keeps the underline from "tailing" across the space character. -->
        <span
          :style="{
            borderBottom: `1.5px solid ${PAGE.rose}`,
            paddingBottom: '2px',
          }"
        >Модулем</span><!--
        --><span :style="{ display: 'inline-block', width: '0.30em' }"><!-- spacer --></span><!--
        --><span
          :style="{
            borderBottom: `1.5px solid ${PAGE.rose}`,
            paddingBottom: '2px',
          }"
        >Роста</span>
        <span>®</span>
      </a>
    </div>
  </footer>
</template>
