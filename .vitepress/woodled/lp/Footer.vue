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
    <!--
      Collaboration mark: WOODLED® × Модуль Роста®
      Two clickable brand names with a hairline SVG × between them — the
      "Brand × Brand" pattern (Acne × Champion, Nike × Off-White). The ×
      is bigger than the text but drawn at stroke 0.75 so it reads as a
      delicate "in collaboration with" mark, not a multiplication operator.
    -->
    <div
      :style="{
        width: '100%',
        padding: '12px clamp(16px, 4vw, 22px)',
        background: '#FFFFFF',
        borderRadius: '999px',
        boxShadow:
          '0 8px 28px rgba(184, 125, 82, 0.22), 0 2px 8px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(184, 125, 82, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(10px, 2.5vw, 16px)',
        fontSize: '15px',
        fontWeight: 500,
        letterSpacing: 0,
        boxSizing: 'border-box',
      }"
    >
      <a
        class="footer-brand-link"
        href="https://woodled.ru"
        target="_blank"
        rel="noopener noreferrer"
        :style="{ color: PAGE.rose, whiteSpace: 'nowrap' }"
      ><span class="footer-brand-word">WOODLED</span><span class="footer-brand-reg">®</span></a>

      <!-- Hairline ×, ~2x text height. stroke-linecap square keeps the
           line ends crisp; opacity tones it down so it's a mark not a focal. -->
      <span
        aria-hidden="true"
        :style="{
          color: PAGE.rose,
          opacity: 0.5,
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
        }"
      >
        <svg
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="none"
          stroke="currentColor"
          stroke-width="0.85"
          stroke-linecap="square"
          :style="{ display: 'block' }"
        >
          <line x1="5" y1="5" x2="27" y2="27" />
          <line x1="27" y1="5" x2="5" y2="27" />
        </svg>
      </span>

      <a
        class="footer-brand-link"
        href="https://runscale.ru"
        target="_blank"
        rel="noopener noreferrer"
        :style="{ color: PAGE.rose, whiteSpace: 'nowrap' }"
      ><span class="footer-brand-word">Модуль</span> <span class="footer-brand-word">Роста</span><span class="footer-brand-reg">®</span></a>
    </div>
  </footer>
</template>
