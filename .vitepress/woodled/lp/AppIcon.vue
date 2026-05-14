<script setup lang="ts">
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
    <!-- Soft breathing halo — no hard card frame -->
    <div
      :style="{
        position: 'absolute',
        inset: '-20px',
        background:
          'radial-gradient(circle at center, rgba(232,181,160,0.22), transparent 65%)',
        filter: 'blur(16px)',
        pointerEvents: 'none',
        animation: 'haloPulse 4s ease-in-out infinite',
      }"
    />

    <!-- Bare image — no border-radius / no boxShadow -->
    <img
      :src="COVER_URL"
      alt="WOODLED"
      :style="{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: 'auto',
      }"
    />
  </div>
</template>
