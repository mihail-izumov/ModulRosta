<script setup lang="ts">
const COVER_URL = '/woodled/og-cover.png'
</script>

<template>
  <div
    :style="{
      position: 'relative',
      width: 'clamp(220px, 50vw, 280px)',
      margin: '0 auto 28px',
    }"
  >
    <!-- soft outer halo -->
    <div
      :style="{
        position: 'absolute',
        inset: '-40px',
        background:
          'radial-gradient(circle at center, rgba(212,165,116,0.40) 0%, rgba(232,181,160,0.20) 40%, transparent 75%)',
        filter: 'blur(24px)',
        pointerEvents: 'none',
      }"
    />
    <!-- breathing inner halo -->
    <div
      :style="{
        position: 'absolute',
        inset: '-16px',
        background:
          'radial-gradient(circle at center, rgba(232,181,160,0.30), transparent 70%)',
        filter: 'blur(12px)',
        pointerEvents: 'none',
        animation: 'haloPulse 4s ease-in-out infinite',
      }"
    />

    <!-- cover image card -->
    <img
      :src="COVER_URL"
      alt="WOODLED"
      :style="{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: 'auto',
        borderRadius: '26px',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.55),
          0 14px 36px rgba(154,100,64,0.30),
          0 0 0 1px rgba(154,100,64,0.10)
        `,
      }"
    />
  </div>
</template>
