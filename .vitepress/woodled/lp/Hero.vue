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
      Subtitle restructure.

      DESKTOP (>600px):
        Both <span>s are inline; <br class="lp-mobile-only">s are hidden.
        Reads as one flowing paragraph with two font-weights mixed inline:
        bold-600 first sentence → regular-400 second sentence. The single
        space between </span><span> in source collapses to one separator.

      MOBILE (≤600px):
        Both <span>s become display: block; <br>s engage.
        Block 1 (600):  «Идеальное пространство»
                        «для света WOODLED.»
        ↓ 14px margin — bigger than line spacing (9px visual gap) but
          smaller than the previous double-<br> (~36px), so the two
          sentences read as distinct blocks without a full empty line.
        Block 2 (400):  «Настраивайте … наполните каждый»
                        «уголок дома.»
        The second <br> inside block 2 pins «уголок дома.» to its own line
        regardless of viewport width (otherwise it wraps as «…каждый уголок»
        + «дома.» on iPhone widths).
    -->
    <p
      :style="{
        fontSize: '18px',
        lineHeight: 1.5,
        color: PAGE.text,
        maxWidth: '540px',
        margin: '0 auto 32px',
      }"
    >
      <span class="lp-line lp-line--bold">Идеальное пространство <br class="lp-mobile-only" />для света WOODLED.</span>
      <span class="lp-line lp-line--regular">Настраивайте светильники, расставляйте мебель, перекрасьте стены — наполните каждый <br class="lp-mobile-only" />уголок дома.</span>
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
  Subtitle weight contrast — applied on every viewport so the
  desktop paragraph also reads as bold-lead + regular-body.
*/
.lp-line--bold {
  font-weight: 600;
}
.lp-line--regular {
  font-weight: 400;
}

/*
  Mobile-only line-break utility — used on the <br>s inside the subtitle
  so the desktop paragraph stays single-flow and identical to the previous
  spec, but on mobile each forced break engages.
*/
@media (min-width: 601px) {
  .lp-mobile-only {
    display: none;
  }
}

/*
  Mobile: spans become blocks; the second block gets a 14px top gap.
  Adjacent-sibling selector (.lp-line + .lp-line) means only the SECOND
  block carries the margin, so the first block sits flush with whatever
  is above it (the H1). 14px lands deliberately between "continuous
  paragraph" (~9px visible gap) and "empty line" (~36px) — distinctly
  paragraph-break but not over-spaced.
*/
@media (max-width: 600px) {
  .lp-line {
    display: block;
  }
  .lp-line + .lp-line {
    margin-top: 14px;
  }
}
</style>
