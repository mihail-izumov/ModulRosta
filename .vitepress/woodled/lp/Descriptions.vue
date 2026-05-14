<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PAGE } from './tokens'

/**
 * «Дизайнер — это [Я]» — кликабельный круглый бэйдж с буквой Я.
 * При клике открывается полностью чёрная модалка («экран как зеркало»):
 *   - сверху «Привет, дизайнер!»
 *   - под ним белая пилюля «Включить свет», закрывает модалку
 *   - можно закрыть смахиванием вниз (touch drag) и клавишей Esc
 */

const modalOpen = ref(false)
const dragY = ref(0)
const isDragging = ref(false)

let touchStartY = 0
let escListener: ((e: KeyboardEvent) => void) | null = null

function openModal() {
  modalOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}
function closeModal() {
  modalOpen.value = false
  // dragY snaps via the transition before the leave-animation kicks in.
  // Reset to 0 after the leave-transition completes (380ms below) so reopen
  // doesn't flash the previous offset.
  setTimeout(() => { dragY.value = 0 }, 400)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

function onTouchStart(e: TouchEvent) {
  if (!e.touches[0]) return
  touchStartY = e.touches[0].clientY
  isDragging.value = true
}
function onTouchMove(e: TouchEvent) {
  if (!isDragging.value || !e.touches[0]) return
  // Down-only drag — pull up beyond start does nothing.
  dragY.value = Math.max(0, e.touches[0].clientY - touchStartY)
}
function onTouchEnd() {
  isDragging.value = false
  if (dragY.value > 110) {
    closeModal()
  } else {
    dragY.value = 0 // snap back via transition
  }
}

onMounted(() => {
  escListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalOpen.value) closeModal()
  }
  window.addEventListener('keydown', escListener)
})

onBeforeUnmount(() => {
  if (escListener) {
    window.removeEventListener('keydown', escListener)
    escListener = null
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
      Дизайнер&nbsp;— это&nbsp;<button
        type="button"
        class="ya-badge"
        @click="openModal"
        aria-label="Привет, дизайнер"
      >
        <!-- Two pulse rings, phased 1.2s apart, for "tap me" attention -->
        <span class="ya-badge__ring ya-badge__ring--1" aria-hidden="true" />
        <span class="ya-badge__ring ya-badge__ring--2" aria-hidden="true" />
        <span class="ya-badge__letter">Я</span>
      </button>
    </h2>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
      <!-- Card 1 -->
      <div
        :style="{
          padding: '32px 28px',
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
            fontSize: 'clamp(22px, 4.8vw, 28px)',
            lineHeight: 1.0,
            letterSpacing: '-0.022em',
            textAlign: 'center',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          Соберите свой дом — комнаты, стены, мебель.
          <br />
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">Дизайнер – это&nbsp;я.</span>
        </p>
      </div>

      <!-- Card 2 -->
      <div
        :style="{
          padding: '32px 28px',
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
            fontSize: 'clamp(22px, 4.8vw, 28px)',
            lineHeight: 1.0,
            letterSpacing: '-0.022em',
            textAlign: 'center',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          Поставьте светильники WOODLED
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">в&nbsp;каждой комнате</span>
          — выбирайте дерево, цвет и&nbsp;форму.
        </p>
      </div>

      <!-- Card 3 -->
      <div
        :style="{
          padding: '32px 28px',
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
            fontSize: 'clamp(22px, 4.8vw, 28px)',
            lineHeight: 1.0,
            letterSpacing: '-0.022em',
            textAlign: 'center',
            fontWeight: 600,
            color: PAGE.text,
          }"
        >
          <span :style="{ color: PAGE.roseDeep, fontWeight: 600 }">Дом оживает на&nbsp;глазах</span>
          — настроение и&nbsp;баланс света считаются сразу.
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-title"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        :style="{
          transform: `translateY(${dragY}px)`,
          transition: isDragging
            ? 'none'
            : 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
          // Fade slightly as user drags down — visual hint that release will close
          opacity: 1 - Math.min(dragY / 400, 0.35),
        }"
      >
        <div class="designer-modal__handle" aria-hidden="true" />

        <div class="designer-modal__top">
          <div id="dm-title" class="designer-modal__title">
            Привет, дизайнер!
          </div>
          <button
            type="button"
            class="designer-modal__cta"
            @click="closeModal"
          >
            Включить свет
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* —— Я-badge — circular, rose-gold gradient, attention pulse rings ——————— */
.ya-badge {
  /* Inherit h2's font-size so badge scales with heading via em */
  font-size: inherit;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.05em;
  height: 1.05em;
  border-radius: 50%;
  vertical-align: -0.16em;

  /* Rose-gold gradient (not black, per spec) */
  background: linear-gradient(135deg, #BB7868 0%, #D8A293 50%, #EFC8B8 100%);
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  isolation: isolate; /* keep pulse rings clipped to the badge stack */

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.32),
    inset 0 -1px 0 rgba(154, 100, 64, 0.18),
    0 8px 22px rgba(154, 100, 64, 0.32);

  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ya-badge:hover { transform: scale(1.06); }
.ya-badge:active { transform: scale(0.94); }

.ya-badge__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(216, 162, 147, 0.75);
  animation: yaPulse 2.4s ease-out infinite;
  pointer-events: none;
}
.ya-badge__ring--2 { animation-delay: 1.2s; }
@keyframes yaPulse {
  0%   { transform: scale(1);   opacity: 0.85; }
  100% { transform: scale(2.0); opacity: 0; }
}

.ya-badge__letter {
  font-size: 0.62em;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 1;
  position: relative;
  z-index: 1;
}
</style>

<!--
  Modal styles are intentionally NOT scoped — <Teleport to="body"> moves the
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
  padding: 56px 24px 24px;
  box-sizing: border-box;

  /* Disable browser's default touch handling — our JS owns drag */
  touch-action: none;
  will-change: transform, opacity;
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
}

.designer-modal__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding-top: 4vh;
}

.designer-modal__title {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: clamp(26px, 6.5vw, 38px);
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  text-align: center;
  line-height: 1.15;
}

.designer-modal__cta {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  padding: 18px 38px;
  font-size: 17px;
  font-weight: 700;
  color: #1D1D1F;
  background: #FFFFFF;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 12px 32px rgba(255, 255, 255, 0.16);
  transition: transform 180ms ease, box-shadow 180ms ease;
  white-space: nowrap;
}
.designer-modal__cta:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 16px 36px rgba(255, 255, 255, 0.22);
}
.designer-modal__cta:active { transform: translateY(0); }

/* Vue <Transition name="dm"> — slide up on enter, slide down on leave */
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
