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
      <span :style="{ display: 'block' }">Мой дизайн.</span>
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
      >Мой свет.</span>
    </h1>

    <p
      :style="{
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: PAGE.text,
        maxWidth: '540px',
        margin: '0 auto 32px',
      }"
    >
      Идеальное пространство для света WOODLED. Настраивайте светильники, расставляйте мебель, перекрасьте стены — наполните каждый уголок дома.
    </p>

    <!--
      New order (May 2026): CTA first, FeatureTabs below.
        AppIcon → H1 → subtitle → PrimaryCTA → FeatureTabs (3 tabs + desc)
      The CTA being adjacent to the subtitle makes the «scan→tap» path
      tighter; FeatureTabs becomes a supporting "why try it" block instead
      of a gate between intent and action.
    -->
    <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }">
      <PrimaryCTA
        size="large"
        @mounted="(el) => $emit('cta-mounted', el)"
        @unmounted="$emit('cta-unmounted')"
      />
    </div>

    <FeatureTabs />
  </section>
</template>
