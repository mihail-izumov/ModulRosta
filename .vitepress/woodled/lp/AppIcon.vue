<script setup lang="ts">
/**
 * AppIcon — отображает /woodled/og-cover.png c многослойным «объёмным» свечением:
 *   1. Внешняя тень в цвете страницы (тёплый peach) — приземляет иконку
 *   2. Внутренний тёплый белый halo — даёт объём, как backlight за стеклянной плашкой
 *   3. drop-shadow на самой картинке — короткая тень для дополнительной глубины
 * Серую тень намеренно не используем — она убивает тёплую палитру страницы.
 */
const COVER_URL = '/woodled/og-cover.png'
</script>

<template>
  <div
    :style="{
      position: 'relative',
      width: 'clamp(150px, 33vw, 190px)',
      margin: '0 auto 24px',
    }"
  >
    <!-- 1. Outer warm shadow in page palette — peach ambient grounding -->
    <div
      :style="{
        position: 'absolute',
        inset: '-32px',
        background: `radial-gradient(ellipse at center 58%,
          rgba(232, 181, 160, 0.42) 0%,
          rgba(232, 181, 160, 0.18) 35%,
          transparent 72%
        )`,
        filter: 'blur(22px)',
        pointerEvents: 'none',
      }"
    />

    <!-- 2. Inner warm-white halo — backlight effect, gives volume -->
    <div
      :style="{
        position: 'absolute',
        inset: '-14px',
        background: `radial-gradient(circle at center 38%,
          rgba(255, 251, 245, 0.85) 0%,
          rgba(255, 244, 232, 0.50) 35%,
          rgba(252, 230, 215, 0.18) 60%,
          transparent 78%
        )`,
        filter: 'blur(12px)',
        pointerEvents: 'none',
        animation: 'haloPulse 4s ease-in-out infinite',
      }"
    />

    <!-- 3. Image with short drop-shadow for foreground depth -->
    <img
      :src="COVER_URL"
      alt="WOODLED"
      :style="{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: 'auto',
        filter: 'drop-shadow(0 14px 24px rgba(154, 100, 64, 0.18))',
      }"
    />
  </div>
</template>
