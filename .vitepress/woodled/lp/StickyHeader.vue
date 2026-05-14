<script setup lang="ts">
import PrimaryCTA from './PrimaryCTA.vue'

defineProps<{ show: boolean }>()
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '10px 20px',
      background: 'rgba(248, 229, 213, 0.42)',
      backdropFilter: 'blur(32px) saturate(180%)',
      WebkitBackdropFilter: 'blur(32px) saturate(180%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.30)',
      display: 'flex',
      justifyContent: 'center',
      transform: show ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: show ? 'auto' : 'none',
      boxShadow: show ? '0 4px 24px rgba(184, 125, 82, 0.10)' : 'none',
    }"
  >
    <PrimaryCTA size="small" />
  </div>
</template>
