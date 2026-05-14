<script setup lang="ts">
/**
 * StickyHeader — плавающая пилюля, появляется когда CTA уехал выше экрана.
 *
 * Особенности:
 * - `position: fixed` относительно layout-viewport, но в мобильном Chrome URL-бар
 *   накладывается поверх layout-viewport при скролле вверх. Чтобы пилюля
 *   следовала за реальной видимой областью, подписываемся на `visualViewport`
 *   и динамически сдвигаем `top` на `visualViewport.offsetTop`.
 * - backdrop-blur уменьшен с 28px до 16px чтобы было лучше видно что подложка
 *   просвечивает фон.
 * - Лейбл «МОЙ ЛЕС / WOODLED» на двух строках, крупнее.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PAGE } from './tokens'
import PrimaryCTA from './PrimaryCTA.vue'

defineProps<{ show: boolean }>()

const BASE_TOP = 12 // px from visible-viewport top
const safeTop = ref<number>(BASE_TOP)

let detach: (() => void) | null = null

onMounted(() => {
  if (typeof window === 'undefined') return
  const vv = window.visualViewport
  if (!vv) return

  const update = () => {
    // vv.offsetTop is how far below layout-viewport the visual-viewport starts —
    // i.e. roughly the height of the Chrome URL bar / iOS top safe area.
    safeTop.value = BASE_TOP + (vv.offsetTop || 0)
  }
  vv.addEventListener('scroll', update)
  vv.addEventListener('resize', update)
  update()

  detach = () => {
    vv.removeEventListener('scroll', update)
    vv.removeEventListener('resize', update)
  }
})

onBeforeUnmount(() => {
  detach?.()
  detach = null
})
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      top: safeTop + 'px',
      left: '50%',
      width: 'calc(100% - 28px)',
      maxWidth: '720px',
      zIndex: 100,

      // Composite transform: X-center + Y-slide (out of frame when hidden).
      transform: show
        ? 'translate(-50%, 0)'
        : 'translate(-50%, calc(-100% - 28px))',
      transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1), top 200ms ease-out',
      pointerEvents: show ? 'auto' : 'none',

      padding: '8px 8px 8px 22px',
      borderRadius: '999px',

      // Less blur (16px instead of 28) and lower opacity (0.45) so the
      // background dot grid / palette gradient is still readable under the pill.
      background: 'rgba(255, 250, 244, 0.45)',
      backdropFilter: 'blur(16px) saturate(170%)',
      WebkitBackdropFilter: 'blur(16px) saturate(170%)',
      border: '1px solid rgba(255, 255, 255, 0.45)',
      boxShadow: `
        0 14px 36px rgba(184, 125, 82, 0.20),
        0 2px 8px rgba(184, 125, 82, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.65)
      `,

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxSizing: 'border-box',
    }"
  >
    <!-- Two-line uppercase label, bigger -->
    <div
      :style="{
        fontSize: '15px',
        fontWeight: 800,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: PAGE.text,
        lineHeight: 1.0,
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }"
    >
      Мой&nbsp;Лес
      <br />
      WOODLED
    </div>

    <PrimaryCTA size="small" />
  </div>
</template>
