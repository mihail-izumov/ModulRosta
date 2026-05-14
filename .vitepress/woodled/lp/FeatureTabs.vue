<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { PAGE } from './tokens'

/**
 * Sliding-pill segmented control. A single absolute-positioned white pill
 * sits behind the tab labels and translates/resizes to align with the active
 * tab via template refs. This avoids the visual jump caused by swapping
 * background-color on each button (the previous implementation).
 */

const FEATURES = [
  {
    label: 'Без регистрации',
    text: 'Не нужны email или пароль. Открывайте конструктор и собирайте дом — план сохраняется по уникальной ссылке.',
  },
  {
    label: 'Ссылки',
    text: 'Покажите ваш дизайн светильника или весь дом друзьям. Они увидят всё так же, как видите вы и смогут добавить что-то своё.',
  },
  {
    label: 'Советы',
    text: 'WOODLED помогает собрать идеальный свет. Отправьте ссылку на Ваш Лес и получите поддержку эксперта по свету. Самые смелые мечты — шаг за шагом.',
  },
]

const active = ref(0)
const currentText = computed(() => FEATURES[active.value].text)

// Template refs for measuring each tab — stored as an array indexed by tab number.
const tabEls = ref<(HTMLElement | null)[]>([])
function setTabRef(el: unknown, i: number) {
  tabEls.value[i] = el as HTMLElement | null
}

// Pill geometry — kept in refs so they reactively drive style.
const pillX = ref(0)
const pillW = ref(0)
const pillReady = ref(false)

function measurePill() {
  const el = tabEls.value[active.value]
  if (!el) return
  pillX.value = el.offsetLeft
  pillW.value = el.offsetWidth
  if (!pillReady.value) {
    // First measurement done — flip the flag on next tick so the initial
    // appearance doesn't animate from (0,0) to first tab position.
    nextTick(() => { pillReady.value = true })
  }
}

watch(active, () => nextTick(measurePill))

onMounted(() => {
  nextTick(measurePill)
  window.addEventListener('resize', measurePill)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measurePill)
})

const pillStyle = computed(() => ({
  position: 'absolute' as const,
  top: '4px',
  bottom: '4px',
  left: '0',
  width: `${pillW.value}px`,
  transform: `translateX(${pillX.value}px)`,
  borderRadius: '999px',
  background: '#FFFFFF',
  boxShadow:
    'inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 2px 8px rgba(184, 125, 82, 0.16), 0 0 0 0.5px rgba(184, 125, 82, 0.06)',
  opacity: pillReady.value ? 1 : 0,
  pointerEvents: 'none' as const,
  zIndex: 0,
  // Smooth slide + width change with a snappy iOS-style curve.
  transition: pillReady.value
    ? 'transform 380ms cubic-bezier(0.32, 0.72, 0, 1), width 380ms cubic-bezier(0.32, 0.72, 0, 1), opacity 220ms ease'
    : 'opacity 220ms ease',
}))
</script>

<template>
  <div :style="{ width: '100%' }">
    <div :style="{ display: 'flex', justifyContent: 'center' }">
      <div
        :style="{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px',
          borderRadius: '999px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(184, 125, 82, 0.10)',
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 10px rgba(184, 125, 82, 0.06)`,
          maxWidth: '100%',
        }"
      >
        <!-- Sliding white pill — sits behind tab labels, animates position+width -->
        <div :style="pillStyle" />

        <button
          v-for="(f, i) in FEATURES"
          :key="i"
          :ref="(el) => setTabRef(el, i)"
          @click="active = i"
          :style="{
            position: 'relative',
            zIndex: 1,
            padding: 'clamp(7px, 1.6vw, 10px) clamp(14px, 3.5vw, 20px)',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'clamp(13px, 3.2vw, 15px)',
            fontWeight: 600,
            color: i === active ? PAGE.roseDeep : PAGE.textSec,
            letterSpacing: '-0.005em',
            background: 'transparent',
            transition: 'color 300ms ease',
            whiteSpace: 'nowrap',
          }"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Description text — bumped from clamp(13..15) to clamp(15..17), +2pt as requested -->
    <div :style="{ marginTop: '18px' }">
      <p
        :key="active"
        :style="{
          margin: 0,
          fontSize: 'clamp(15px, 3.4vw, 17px)',
          fontWeight: 500,
          lineHeight: 1.55,
          color: PAGE.textDim,
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          animation: 'fadeInUp 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }"
      >
        {{ currentText }}
      </p>
    </div>
  </div>
</template>
