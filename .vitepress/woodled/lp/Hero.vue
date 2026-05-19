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
  <!--
    Bottom padding tightened from 52 → 16. Combined with Slider's existing
    inner padding (12 outer + 24 inner = 36px above the first card), the
    gap from the FeatureTabs description to the slider images is ~52px —
    down from ~88px — so the slider visually "rises" without crashing into
    the description.
  -->
  <section
    :style="{
      padding: '28px 24px 16px',
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

    <!--
      Mobile-only line breaks. Three <br class="lp-mobile-only"> elements
      become active only at viewports ≤ 600px:
        1. After «Идеальное пространство» — forces «для света WOODLED.»
           onto its own line, so the first thought reads as a two-line
           heading-like fragment.
        2 + 3. Two consecutive <br> create an empty line between the two
           sentences, so the second sentence ("Настраивайте светильники…")
           reads as a separate paragraph on mobile.
      On desktop the <br>s collapse to nothing (display: none) and the
      paragraph flows continuously, byte-identical to the previous spec.
    -->
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
      Идеальное пространство <br class="lp-mobile-only" />для света WOODLED. <br class="lp-mobile-only" /><br class="lp-mobile-only" />Настраивайте светильники, расставляйте мебель, перекрасьте стены — наполните каждый уголок дома.
    </p>

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

<style scoped>
/*
  Utility: any element with .lp-mobile-only is laid out on mobile and
  invisible on desktop. Used on the subtitle <br>s above so the desktop
  paragraph stays a single flowing line of prose; on mobile the same
  paragraph splits into two visually distinct blocks.

  Breakpoint at 600px matches the existing site convention (Footer's old
  .lp-footer-break used the same value).
*/
@media (min-width: 601px) {
  .lp-mobile-only {
    display: none;
  }
}
</style>
