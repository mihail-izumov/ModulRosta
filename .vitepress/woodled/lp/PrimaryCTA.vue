<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PAGE } from './tokens'

const props = withDefaults(defineProps<{
  size?: 'large' | 'small'
  label?: string
}>(), {
  size: 'large',
  label: 'Начать бесплатно',
})

const emit = defineEmits<{
  (e: 'mounted', el: HTMLElement): void
  (e: 'unmounted'): void
}>()

const btnRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (btnRef.value) emit('mounted', btnRef.value)
})
onBeforeUnmount(() => emit('unmounted'))

function handleClick() {
  if (typeof window !== 'undefined') {
    window.location.href = '/woodled/customizer'
  }
}
</script>

<template>
  <button
    ref="btnRef"
    @click="handleClick"
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: size === 'large' ? '14px' : '10px',
      padding: size === 'large' ? '20px 40px' : '11px 22px',
      fontSize: size === 'large' ? '18px' : '15px',
      backgroundImage: `linear-gradient(120deg, ${PAGE.rose} 0%, ${PAGE.roseLight} 25%, ${PAGE.roseGlow} 50%, ${PAGE.roseLight} 75%, ${PAGE.rose} 100%)`,
      backgroundSize: '220% 100%',
      animation: 'goldShimmer 7s ease-in-out infinite, glowPulse 4s ease-in-out infinite',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '999px',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: 'inherit',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 200ms ease',
      textShadow: '0 1px 1px rgba(90, 61, 38, 0.20)',
    }"
    @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')"
    @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')"
  >
    <!-- RotorSpinner: 10 rotating petals -->
    <div
      :style="{
        position: 'relative',
        width: (size === 'large' ? 28 : 18) + 'px',
        height: (size === 'large' ? 28 : 18) + 'px',
        flexShrink: 0,
      }"
    >
      <div
        v-for="i in 10"
        :key="i"
        :style="{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1.8px',
          height: ((size === 'large' ? 28 : 18) * 0.28) + 'px',
          marginTop: (-(size === 'large' ? 28 : 18) * 0.14) + 'px',
          marginLeft: '-0.9px',
          borderRadius: '1.2px',
          background: '#fff',
          transformOrigin: '50% 50%',
          '--rot': (((i - 1) / 10) * 360) + 'deg',
          animation: `rotorCycle 5000ms ease-in-out ${(i - 1) * 30}ms infinite`,
          opacity: 0,
        }"
      />
    </div>
    {{ label }}
  </button>
</template>
