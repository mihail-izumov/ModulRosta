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
        fontSize: 'clamp(36px, 8vw, 56px)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.025em',
        margin: '0 0 28px',
        color: PAGE.text,
      }"
    >
      Соберите свет WOODLED.
      <br />
      <span
        :style="{
          backgroundImage: `linear-gradient(120deg, ${PAGE.rose} 0%, ${PAGE.roseLight} 28%, ${PAGE.roseGlow} 50%, ${PAGE.roseLight} 72%, ${PAGE.rose} 100%)`,
          backgroundSize: '220% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          animation: 'goldShimmer 7s ease-in-out infinite',
          display: 'inline-block',
        }"
      >
        Оживите дом.
      </span>
    </h1>

    <p
      :style="{
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: PAGE.textSec,
        maxWidth: '540px',
        margin: '0 auto 36px',
      }"
    >
      Живой Лес собирает план света для вашего дома — расставляйте светильники WOODLED по комнатам, выбирайте дерево и цвета, а конструктор сразу показывает баланс и настроение.
    </p>

    <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }">
      <PrimaryCTA
        size="large"
        @mounted="(el) => $emit('cta-mounted', el)"
        @unmounted="$emit('cta-unmounted')"
      />
    </div>

    <FeatureTabs />
  </section>
</template>
