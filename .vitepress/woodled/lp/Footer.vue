<script setup lang="ts">
import { ref } from 'vue'
import { PAGE } from './tokens'

/**
 * Footer collaboration mark + expandable manifesto.
 *
 * Layout: 3-column grid — invisible left spacer / centered logos block /
 * arrow on right. Spacer equals arrow column width, so the logos block is
 * truly centered in the pill regardless of arrow presence.
 *
 * Logos: <img> + filter:brightness(0) instead of div+mask. This preserves
 * each SVG's native aspect ratio (width:auto from height), so WOODLED and
 * Runscale stay proportionally sized to each other on both mobile and
 * desktop. brightness(0) recolors any source SVG to pure black.
 *
 * Arrow: filled-circle button in PAGE.pastelPinkD background with
 * PAGE.roseDeep stroke — visible but doesn't compete with the black logos.
 */

const WOODLED_LOGO_URL = '/woodled/customizer/woodled-logo.svg'
const RUNSCALE_LOGO_URL = 'https://runscale.ru/runscale_logo_2026_2.svg'

const expanded = ref(false)
function toggleExpand() {
  expanded.value = !expanded.value
}
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
    <!-- Collaboration pill — 3-column grid keeps logos centered + arrow on right -->
    <div
      :style="{
        width: '100%',
        padding: '12px clamp(14px, 3vw, 18px)',
        background: '#FFFFFF',
        borderRadius: '999px',
        boxShadow:
          '0 8px 28px rgba(184, 125, 82, 0.22), 0 2px 8px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(184, 125, 82, 0.06)',
        display: 'grid',
        gridTemplateColumns: 'clamp(36px, 8vw, 40px) 1fr clamp(36px, 8vw, 40px)',
        alignItems: 'center',
        boxSizing: 'border-box',
      }"
    >
      <!-- LEFT: invisible spacer mirroring arrow column width — keeps logos
           visually centered in the pill -->
      <div />

      <!-- CENTER: logos block, flex with × in the middle, equal gap from × to each logo -->
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 3vw, 18px)',
        }"
      >
        <a
          href="https://woodled.ru"
          target="_blank"
          rel="noopener noreferrer"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
          }"
          aria-label="WOODLED"
        >
          <!-- <img> + filter:brightness(0) — native aspect ratio preserved -->
          <img
            :src="WOODLED_LOGO_URL"
            alt="WOODLED"
            :style="{
              height: 'clamp(20px, 4.2vw, 28px)',
              width: 'auto',
              display: 'block',
              filter: 'brightness(0)',
            }"
          />
        </a>

        <!-- Hairline × (decorative) -->
        <span
          aria-hidden="true"
          :style="{
            color: '#000000',
            opacity: 0.45,
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
          }"
        >
          <svg
            viewBox="0 0 32 32"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="0.9"
            stroke-linecap="square"
            :style="{ display: 'block' }"
          >
            <line x1="5" y1="5" x2="27" y2="27" />
            <line x1="27" y1="5" x2="5" y2="27" />
          </svg>
        </span>

        <a
          href="https://runscale.ru"
          target="_blank"
          rel="noopener noreferrer"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
          }"
          aria-label="Модуль Роста"
        >
          <img
            :src="RUNSCALE_LOGO_URL"
            alt="Модуль Роста"
            :style="{
              height: 'clamp(20px, 4.2vw, 28px)',
              width: 'auto',
              display: 'block',
              filter: 'brightness(0)',
            }"
          />
        </a>
      </div>

      <!-- RIGHT: arrow in filled circle, sits in own grid column → equal margin to spacer -->
      <button
        type="button"
        @click="toggleExpand"
        :aria-expanded="expanded"
        aria-label="Показать подробнее"
        :style="{
          justifySelf: 'end',
          width: 'clamp(32px, 7vw, 38px)',
          height: 'clamp(32px, 7vw, 38px)',
          borderRadius: '50%',
          background: PAGE.pastelPinkD,
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: PAGE.roseDeep,
          transition: 'background 220ms ease, transform 120ms ease',
        }"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 360ms cubic-bezier(0.4, 0, 0.2, 1)',
          }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>

    <!-- Expanded manifesto -->
    <div
      :style="{
        maxHeight: expanded ? '1200px' : '0px',
        opacity: expanded ? 1 : 0,
        marginTop: expanded ? '20px' : '0px',
        overflow: 'hidden',
        transition:
          'max-height 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease, margin-top 400ms ease',
      }"
    >
      <div
        :style="{
          padding: 'clamp(22px, 5vw, 28px) clamp(20px, 5vw, 26px)',
          borderRadius: '22px',
          background: 'rgba(255, 250, 244, 0.65)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
          textAlign: 'center',
        }"
      >
        <h3
          :style="{
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 700,
            color: PAGE.text,
            margin: '0 0 18px',
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
          }"
        >
          Растём вместе
        </h3>

        <p
          :style="{
            margin: '0 0 14px',
            fontSize: 'clamp(15px, 3.5vw, 18px)',
            lineHeight: 1.5,
            letterSpacing: '-0.005em',
            fontWeight: 500,
            color: PAGE.text,
          }"
        >
          Новые технологии всегда были страстью WOODLED и МОДУЛЯ&nbsp;РОСТА. Мы искали способы сделать самые простые вещи ещё лучше и удобнее.
        </p>

        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(15px, 3.5vw, 18px)',
            lineHeight: 1.5,
            letterSpacing: '-0.005em',
            fontWeight: 500,
            color: PAGE.text,
          }"
        >
          Вместе мы создали новое пространство для света, чтобы живых домов было больше. Для себя, семьи и друзей – для жизни.
        </p>
      </div>
    </div>
  </footer>
</template>
