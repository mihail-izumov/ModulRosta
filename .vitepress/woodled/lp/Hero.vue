<script setup lang="ts">
import { PAGE } from './tokens'
import AppIcon from './AppIcon.vue'
import PrimaryCTA from './PrimaryCTA.vue'
import FeatureTabs from './FeatureTabs.vue'

defineEmits<{
  (e: 'cta-mounted', el: HTMLElement): void
  (e: 'cta-unmounted'): void
}>()
</script>

<template>
  <section
    :style="{
      padding: '28px 24px 52px',
      maxWidth: '720px',
      margin: '0 auto',
      textAlign: 'center',
    }"
  >
    <AppIcon />

    <h1
      :style="{
        fontFamily: `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif`,
        fontSize: 'clamp(36px, 8vw, 56px)',
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        margin: '0 0 28px',
        color: PAGE.text,
      }"
    >
      <!-- Two block-level spans so line-height is identical for both lines.
           Plain text on line 1, shimmer treatment kept on line 2. No periods
           on either — the title reads as a brand mark, not a sentence. -->
      <span :style="{ display: 'block' }">Мой Лес</span>
      <span
        :style="{
          display: 'block',
          backgroundImage: `linear-gradient(120deg, ${PAGE.rose} 0%, ${PAGE.roseLight} 28%, ${PAGE.roseGlow} 50%, ${PAGE.roseLight} 72%, ${PAGE.rose} 100%)`,
          backgroundSize: '220% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          animation: 'goldShimmer 7s ease-in-out infinite',
        }"
      >WOODLED</span>
    </h1>

    <p
      :style="{
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: PAGE.textSec,
        maxWidth: '540px',
        margin: '0 auto 32px',
      }"
    >
      Ваше идеальное пространство для света. Играйте с дизайном светильников, расставьте мебель, перекрасьте стены – наполните светом каждый уголок. Дом оживает.
    </p>

    <!-- FeatureTabs moved ABOVE the CTA. Order is now:
         AppIcon → H1 → subtitle → FeatureTabs (3 tabs + description) → CTA -->
    <div :style="{ marginBottom: '32px' }">
      <FeatureTabs />
    </div>

    <div :style="{ display: 'flex', justifyContent: 'center' }">
      <PrimaryCTA
        size="large"
        @mounted="(el) => $emit('cta-mounted', el)"
        @unmounted="$emit('cta-unmounted')"
      />
    </div>
  </section>
</template>
