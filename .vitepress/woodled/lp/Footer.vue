<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { PAGE } from './tokens'

/**
 * Footer collaboration mark + expandable manifesto.
 *
 * Toggle: 3-dot button with a dual-pattern animation:
 *   - 5.5s cycle: pause → wave → pause → see-saw (2up/1down ↔ 1up/2down) → pause
 *   - When open, container rotates 90° and animations stop (dots vertical, still)
 *
 * On open, the expanded block scrolls into the viewport centre automatically
 * (setTimeout matching the 700ms max-height transition).
 */

const WOODLED_LOGO_URL = '/woodled/customizer/woodled-logo.svg'
const RUNSCALE_LOGO_URL = 'https://runscale.ru/runscale_logo_2026_2.svg'

const expanded = ref(false)
const expandedRef = ref<HTMLElement | null>(null)

function toggleExpand() {
  const wasOpen = expanded.value
  expanded.value = !expanded.value
  // Just opened — scroll the fully-expanded block into the viewport centre.
  // 720ms slightly outpaces the 700ms max-height transition so we scroll to
  // the FINAL block size, not an intermediate one.
  if (!wasOpen) {
    nextTick(() => {
      setTimeout(() => {
        expandedRef.value?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 720)
    })
  }
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
      <!-- LEFT: spacer for visual centering -->
      <div />

      <!-- CENTER: logos + hairline × -->
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
          :style="{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }"
          aria-label="WOODLED"
        >
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

        <!-- Hairline × in site palette (PAGE.rose at 0.5 opacity) -->
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
          :style="{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }"
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

      <!-- RIGHT: 3-dot toggle -->
      <button
        type="button"
        @click="toggleExpand"
        :aria-expanded="expanded"
        aria-label="Показать подробнее"
        :class="{ 'is-expanded': expanded }"
        class="footer-toggle"
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
          transition: 'background 220ms ease',
        }"
      >
        <span class="footer-dots">
          <span class="footer-dot" />
          <span class="footer-dot" />
          <span class="footer-dot" />
        </span>
      </button>
    </div>

    <!-- Expanded manifesto — scrolls into view on open -->
    <div
      ref="expandedRef"
      :style="{
        maxHeight: expanded ? '1500px' : '0px',
        opacity: expanded ? 1 : 0,
        marginTop: expanded ? '20px' : '0px',
        overflow: 'hidden',
        transition:
          'max-height 700ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease, margin-top 400ms ease',
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

        <!--
          New order (per task 2):
            1. lyrical questions (bold 600)
            2. lyrical answer with "люксы и люмены" (bold 600)
            3. relocated + retexted "WOODLED и МОДУЛЬ РОСТА всегда искали..." (500)
            4. closing "Вместе мы создали..." with mobile-only break before "для жизни"
        -->
        <p
          :style="{
            margin: '0 0 10px',
            fontSize: 'clamp(15px, 3.5vw, 18px)',
            lineHeight: 1.5,
            letterSpacing: '-0.005em',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          Сколько света нужно? Как создать неповторимое настроение?
        </p>
        <p
          :style="{
            margin: '0 0 14px',
            fontSize: 'clamp(15px, 3.5vw, 18px)',
            lineHeight: 1.5,
            letterSpacing: '-0.005em',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          Свет — это не люксы и люмены. Это тёплые сумерки, утро в лесу, ясный полдень — мягкое тепло дуба и ореха в доме. Описать это словами трудно. Именно поэтому мы за это и беремся.
        </p>

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
          WOODLED и МОДУЛЬ&nbsp;РОСТА всегда применяли новые технологии, чтобы сделать самые простые вещи ещё лучше и удобнее.
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
          Вместе мы создали новое пространство для света. Больше живых домов. Для себя, семьи и друзей – <span class="lp-footer-break">для жизни.</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* —— 3-dot toggle ——
   Each dot has its own dual-pattern keyframe over 5.5s:
     0-9%   pause (flat)
     9-36%  wave (each dot phased)
     36-45% pause
     45-82% see-saw — dot1/dot3 in sync, dot2 opposite (2up1down ↔ 1up2down)
     82-100% final pause
   When the toggle is open, .is-expanded freezes all animations and rotates
   the container 90° → dots appear vertical (= "close me" affordance). */
.footer-dots {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3px;
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
.footer-toggle.is-expanded .footer-dots {
  transform: rotate(90deg);
}

.footer-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}
.footer-dot:nth-child(1) {
  animation: dot1Cycle 5.5s ease-in-out infinite;
}
.footer-dot:nth-child(2) {
  animation: dot2Cycle 5.5s ease-in-out infinite;
}
.footer-dot:nth-child(3) {
  animation: dot3Cycle 5.5s ease-in-out infinite;
}

/* Freeze all dots when expanded — they sit still in vertical layout */
.footer-toggle.is-expanded .footer-dot {
  animation: none;
  transform: translateY(0);
}

/*
  Dot 1 (left) — wave peak at 14%; see-saw: up in state A, down in state B
  (outer dot, syncs with dot 3)
*/
@keyframes dot1Cycle {
  0%, 9% { transform: translateY(0); }
  14% { transform: translateY(-3px); }
  24% { transform: translateY(3px); }
  31% { transform: translateY(0); }
  36% { transform: translateY(0); }
  45% { transform: translateY(0); }
  55% { transform: translateY(-3px); }   /* state A: outer up */
  65% { transform: translateY(3px); }    /* state B: outer down */
  75% { transform: translateY(-3px); }   /* state A again */
  82% { transform: translateY(0); }
  100% { transform: translateY(0); }
}

/*
  Dot 2 (middle) — wave peak at 19% (delayed); see-saw: OPPOSITE phase
  (down in state A, up in state B → so 2 outer + 1 middle alternate)
*/
@keyframes dot2Cycle {
  0%, 9% { transform: translateY(0); }
  19% { transform: translateY(-3px); }
  29% { transform: translateY(3px); }
  35% { transform: translateY(0); }
  45% { transform: translateY(0); }
  55% { transform: translateY(3px); }    /* state A: middle down */
  65% { transform: translateY(-3px); }   /* state B: middle up */
  75% { transform: translateY(3px); }    /* state A again */
  82% { transform: translateY(0); }
  100% { transform: translateY(0); }
}

/*
  Dot 3 (right) — wave peak at 24% (most delayed); see-saw: SAME as dot 1
  (outer pair moves together)
*/
@keyframes dot3Cycle {
  0%, 9% { transform: translateY(0); }
  24% { transform: translateY(-3px); }
  33% { transform: translateY(3px); }
  40% { transform: translateY(0); }
  45% { transform: translateY(0); }
  55% { transform: translateY(-3px); }   /* state A: outer up */
  65% { transform: translateY(3px); }    /* state B: outer down */
  75% { transform: translateY(-3px); }   /* state A again */
  82% { transform: translateY(0); }
  100% { transform: translateY(0); }
}

/*
  "для жизни" on its own line in mobile. Inline on desktop, block (forced
  new line) on viewports ≤ 600px. Inherits text-align from the parent <p>
  (centered) so it sits centered on its own line.
*/
@media (max-width: 600px) {
  .lp-footer-break {
    display: block;
  }
}
</style>
