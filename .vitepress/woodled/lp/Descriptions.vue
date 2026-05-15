<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PAGE } from './tokens'

/**
 * «Дизайнер — это Я» — Я is now a plain inline button that visually reads
 * as part of the heading text (no badge, no rings, no size jump). Cursor
 * hints clickability. Tapping opens the dark "mirror" modal.
 *
 * The modal layout:
 *   - top: «Привет, дизайнер!»
 *   - bottom: «Включить свет» pill (pushed to bottom via margin-top:auto)
 *
 * On «Включить свет» click → `revealing` mode:
 *   - title + button fade out fast (400ms)
 *   - black backdrop transitions to transparent slow (1800ms)
 *   - the LP behind is gradually revealed — "turning on the lights" metaphor
 *   - after 1900ms, modalOpen flips false → Vue Transition removes the
 *     (already-invisible) element
 *
 * Swipe-down / Esc still close instantly without reveal.
 */

const modalOpen = ref(false)
const revealing = ref(false)
const dragY = ref(0)
const isDragging = ref(false)

let touchStartY = 0
let escListener: ((e: KeyboardEvent) => void) | null = null
let revealTimer: ReturnType<typeof setTimeout> | null = null

function openModal() {
  // If a reveal is in flight from a previous open, cancel its timer so the
  // new session doesn't auto-close.
  if (revealTimer !== null) {
    clearTimeout(revealTimer)
    revealTimer = null
  }
  revealing.value = false
  modalOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

function closeModal() {
  modalOpen.value = false
  if (revealTimer !== null) {
    clearTimeout(revealTimer)
    revealTimer = null
  }
  // Reset state after Vue's leave-transition completes.
  setTimeout(() => {
    dragY.value = 0
    revealing.value = false
  }, 400)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

function reveal() {
  if (revealing.value) return
  revealing.value = true
  // Slightly longer than the bg fade (1800ms) so the page underneath is
  // fully visible before the modal element is removed.
  revealTimer = setTimeout(() => {
    modalOpen.value = false
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
    setTimeout(() => {
      dragY.value = 0
      revealing.value = false
    }, 400)
    revealTimer = null
  }, 1900)
}

function onTouchStart(e: TouchEvent) {
  if (revealing.value) return
  if (!e.touches[0]) return
  touchStartY = e.touches[0].clientY
  isDragging.value = true
}
function onTouchMove(e: TouchEvent) {
  if (revealing.value || !isDragging.value || !e.touches[0]) return
  dragY.value = Math.max(0, e.touches[0].clientY - touchStartY)
}
function onTouchEnd() {
  if (revealing.value) return
  isDragging.value = false
  if (dragY.value > 110) {
    closeModal()
  } else {
    dragY.value = 0
  }
}

onMounted(() => {
  escListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalOpen.value && !revealing.value) closeModal()
  }
  window.addEventListener('keydown', escListener)
})

onBeforeUnmount(() => {
  if (escListener) {
    window.removeEventListener('keydown', escListener)
    escListener = null
  }
  if (revealTimer !== null) {
    clearTimeout(revealTimer)
    revealTimer = null
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <section :style="{ padding: '20px 24px 56px', maxWidth: '720px', margin: '0 auto' }">
    <h2
      :style="{
        fontSize: 'clamp(32px, 7vw, 48px)',
        fontWeight: 700,
        color: PAGE.text,
        textAlign: 'center',
        margin: '0 0 36px',
        letterSpacing: '-0.025em',
        lineHeight: 1.08,
      }"
    >
      Дизайнер&nbsp;— это <button
        type="button"
        class="ya-inline"
        @click="openModal"
        aria-label="Привет, дизайнер"
      >Я</button>
    </h2>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
      <!-- Card 1 -->
      <div
        :style="{
          padding: '28px 26px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
        }"
      >
        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(18px, 4.2vw, 22px)',
            lineHeight: 1.35,
            letterSpacing: '-0.015em',
            textAlign: 'center',
            fontWeight: 500,
            color: PAGE.text,
          }"
        >
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">3 типа дома</span>, от студии до семейного гнезда. Можно начать с чистого листа – добавить новые комнаты и светильники. Перекрасить стены тоже можно.
        </p>
      </div>

      <!-- Card 2 -->
      <div
        :style="{
          padding: '28px 26px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
        }"
      >
        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(18px, 4.2vw, 22px)',
            lineHeight: 1.35,
            letterSpacing: '-0.015em',
            textAlign: 'center',
            fontWeight: 500,
            color: PAGE.text,
          }"
        >
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">Живые персональные рекомендации.</span> Параметры комнаты и мебель определяют каким должен быть комфортный свет.
        </p>
      </div>

      <!-- Card 3 -->
      <div
        :style="{
          padding: '28px 26px',
          borderRadius: '28px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${PAGE.glassBorder}`,
          boxShadow: `0 8px 32px rgba(184, 125, 82, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)`,
        }"
      >
        <p
          :style="{
            margin: 0,
            fontSize: 'clamp(18px, 4.2vw, 22px)',
            lineHeight: 1.35,
            letterSpacing: '-0.015em',
            textAlign: 'center',
            fontWeight: 500,
            color: PAGE.text,
          }"
        >
          Просто выбрать нужное. Вы меняете параметры светильников – <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">WOODLED SMART</span> показывает что изменилось и как сделать ещё лучше. Дом оживает – с технологией WOODLED SMART.
        </p>
      </div>
    </div>
  </section>

  <!-- "Mirror" modal — teleported to body so it escapes the LP wrapper -->
  <Teleport to="body">
    <Transition name="dm">
      <div
        v-if="modalOpen"
        class="designer-modal"
        :class="{ 'is-revealing': revealing }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-title"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        :style="{
          transform: `translateY(${dragY}px)`,
          // While dragging — no transform transition (follows finger).
          // While revealing — also no transform transition (we don't want to drag during reveal).
          // Otherwise — smooth snap-back / leave transition.
          transition: isDragging || revealing
            ? 'background-color 1800ms cubic-bezier(0.4, 0, 0.2, 1)'
            : 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1), background-color 1800ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1 - Math.min(dragY / 400, 0.35),
        }"
      >
        <div class="designer-modal__handle" aria-hidden="true" />

        <div class="designer-modal__top">
          <div id="dm-title" class="designer-modal__title">
            Привет, дизайнер!
          </div>
        </div>

        <!-- Button section — pushed to bottom via flex margin-top:auto -->
        <div class="designer-modal__bottom">
          <button
            type="button"
            class="designer-modal__cta"
            @click="reveal"
            :disabled="revealing"
          >
            Включить свет
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* —— Я as a circled symbol — reads as a glyph (like ® or ©), not as a
   colored standalone letter. Border weight matches the stroke weight of the
   surrounding heading text. Using inline-block + line-height equal to
   height means the inline-block's baseline = its inner letter's baseline =
   the surrounding line's baseline. The letter sits ON the line, the circle
   wraps around it. */
.ya-inline {
  display: inline-block;
  width: 1.15em;
  height: 1.15em;
  line-height: 1.15em;
  text-align: center;
  vertical-align: baseline;
  /* Breathing room from "это" — the user explicitly asked for this offset. */
  margin-left: 0.18em;

  /* The ring. 0.11em at heading size ≈ 3.5px @ 32px / ~5.3px @ 48px — matches
     SF Pro 700's stroke width so it reads as part of the type, not as UI. */
  border: 0.11em solid currentColor;
  border-radius: 50%;

  /* Inherit type, color, letter-spacing from the heading. */
  font: inherit;
  color: inherit;
  letter-spacing: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  box-sizing: content-box;

  transition: opacity 180ms ease, transform 120ms ease;
}
.ya-inline:hover { opacity: 0.65; }
.ya-inline:active { transform: scale(0.94); }
.ya-inline:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
</style>

<!--
  Modal styles intentionally NOT scoped — <Teleport to="body"> moves the
  DOM out of this component's scope, so scoped attribute selectors wouldn't
  match. Class names are namespaced (.designer-modal*) to avoid collisions.
-->
<style>
.designer-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #000;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 24px 56px;
  box-sizing: border-box;

  touch-action: none;
  will-change: transform, opacity, background-color;
}

/* Reveal mode — bg fades to transparent, "the lights turning on" */
.designer-modal.is-revealing {
  background-color: rgba(0, 0, 0, 0);
  pointer-events: none; /* prevent any interaction during fade */
}
.designer-modal.is-revealing .designer-modal__title,
.designer-modal.is-revealing .designer-modal__cta,
.designer-modal.is-revealing .designer-modal__handle {
  opacity: 0;
  transition: opacity 400ms ease;
}

.designer-modal__handle {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.22);
  transition: opacity 400ms ease;
}

.designer-modal__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding-top: 6vh;
}

.designer-modal__title {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
  font-size: clamp(26px, 6.5vw, 38px);
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  text-align: center;
  line-height: 1.15;
  transition: opacity 400ms ease;
}

/* Bottom CTA — pushed to bottom via auto margin */
.designer-modal__bottom {
  margin-top: auto;
  margin-bottom: max(env(safe-area-inset-bottom, 0px), 4vh);
  display: flex;
  justify-content: center;
  transition: opacity 400ms ease;
}

.designer-modal__cta {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
  padding: 18px 38px;
  font-size: 17px;
  font-weight: 600;
  color: #1D1D1F;
  background: #FFFFFF;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 12px 32px rgba(255, 255, 255, 0.16);
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 400ms ease;
  white-space: nowrap;
}
.designer-modal__cta:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 16px 36px rgba(255, 255, 255, 0.22);
}
.designer-modal__cta:active:not(:disabled) { transform: translateY(0); }
.designer-modal__cta:disabled { cursor: default; }

/* Vue <Transition name="dm"> — slide up on enter, slide down on leave.
   Leave plays even after reveal but it's invisible (bg already transparent,
   title+button already opacity 0), so no visual artifact. */
.dm-enter-active,
.dm-leave-active {
  transition: opacity 280ms ease, transform 380ms cubic-bezier(0.4, 0, 0.2, 1);
}
.dm-enter-from {
  opacity: 0;
  transform: translateY(100%) !important;
}
.dm-leave-to {
  opacity: 0;
  transform: translateY(100%) !important;
}
</style>
