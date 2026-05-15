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
      <!--
        Two underlined words separated by a plain text space (no spacer span,
        no nbsp). The `.footer-brand-word` class gets a border-bottom from
        global CSS in App.vue — high-specificity selector ensures it wins
        against the general link-reset. The ® lives in a sibling span with
        NO underline. No space between Роста and ®, so they read as "Роста®".
      -->
      <a
        class="footer-brand-link"
        href="https://runscale.ru/"
        target="_blank"
        rel="noopener noreferrer"
        :style="{ color: PAGE.rose }"
      ><span class="footer-brand-word">Модулем</span> <span class="footer-brand-word">Роста</span><span class="footer-brand-reg">®</span></a>
    </div>
  </footer>
</template>
