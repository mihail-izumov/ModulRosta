<script setup lang="ts">
import { PAGE } from './tokens'
import PrimaryCTA from './PrimaryCTA.vue'

defineProps<{ show: boolean }>()
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      top: '14px',
      left: '50%',
      width: 'calc(100% - 28px)',
      maxWidth: '720px',
      zIndex: 100,

      // X-centering combined with show/hide Y-slide. Both encoded in one transform.
      transform: show
        ? 'translate(-50%, 0)'
        : 'translate(-50%, calc(-100% - 28px))',
      transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: show ? 'auto' : 'none',

      padding: '6px 6px 6px 22px',
      borderRadius: '999px',
      background: 'rgba(255, 250, 244, 0.62)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.45)',
      boxShadow: `
        0 14px 36px rgba(184, 125, 82, 0.22),
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
    <span
      :style="{
        fontSize: '13px',
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: PAGE.text,
        whiteSpace: 'nowrap',
      }"
    >
      Мой Лес
    </span>

    <PrimaryCTA size="small" />
  </div>
</template>
