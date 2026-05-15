<script setup lang="ts">
import { ref } from 'vue'
import { PAGE } from './tokens'

/**
 * Footer collaboration mark with expandable manifesto.
 *
 * Top pill: [WOODLED logo] × [Runscale logo] ↓
 *   - Each logo is its own <a> link (target=_blank) to the respective site
 *   - The hairline × is decorative (aria-hidden)
 *   - The chevron is a <button> that toggles the expanded block
 *
 * Both logos render in BLACK regardless of source-SVG fill colors, via
 * the CSS-mask trick: the SVG is used as a shape mask, and `background: #000`
 * fills that shape. This works for the local WOODLED logo and for the
 * external Runscale SVG fetched from runscale.ru.
 *
 * Expanded block: glass-card style matching Descriptions cards but scaled
 * down for footer context. Two paragraphs with the "Растём вместе" title.
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
    <!-- Collaboration pill -->
    <div
      :style="{
        width: '100%',
        padding: '14px clamp(18px, 4vw, 24px)',
        background: '#FFFFFF',
        borderRadius: '999px',
        boxShadow:
          '0 8px 28px rgba(184, 125, 82, 0.22), 0 2px 8px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(184, 125, 82, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(12px, 3vw, 18px)',
        boxSizing: 'border-box',
      }"
    >
      <!-- WOODLED logo (link, recolored to black via mask) -->
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
        <div
          :style="{
            width: 'clamp(80px, 18vw, 110px)',
            height: '22px',
            background: '#000000',
            maskImage: `url(${WOODLED_LOGO_URL})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${WOODLED_LOGO_URL})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          }"
        />
      </a>

      <!-- Hairline × (decorative, aria-hidden) -->
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
          width="26"
          height="26"
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

      <!-- Runscale (Модуль Роста) logo -->
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
        <div
          :style="{
            width: 'clamp(80px, 18vw, 110px)',
            height: '22px',
            background: '#000000',
            maskImage: `url(${RUNSCALE_LOGO_URL})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${RUNSCALE_LOGO_URL})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          }"
        />
      </a>

      <!-- Chevron — toggles the expanded block -->
      <button
        type="button"
        @click="toggleExpand"
        :aria-expanded="expanded"
        aria-label="Показать подробнее"
        :style="{
          background: 'transparent',
          border: 'none',
          padding: '6px',
          margin: '0 0 0 4px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          opacity: 0.55,
          flexShrink: 0,
          borderRadius: '50%',
          transition: 'opacity 200ms ease',
        }"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
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

    <!--
      Expanded manifesto. max-height + opacity transition for smooth
      open/close. The 1200px ceiling is well above any plausible content
      height — actual height stops at content, the transition just finishes
      slightly later than visually needed.
    -->
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
            fontSize: 'clamp(26px, 6vw, 36px)',
            fontWeight: 700,
            color: PAGE.text,
            margin: '0 0 18px',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
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
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">WOODLED и МОДУЛЬ&nbsp;РОСТА</span>
          годами оживляли технологии в самых простых вещах. Мы доверяем чувствам. Так мы исследуем. Так мы создаём.
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
