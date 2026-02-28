<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true }
})

const show = ref(false)
const tooltipRef = ref(null)
const containerRef = ref(null)
const position = ref({ left: '50%', transform: 'translateX(-50%)' })

const updatePosition = () => {
  if (show.value && tooltipRef.value && containerRef.value) {
    const tooltipRect = tooltipRef.value.getBoundingClientRect()
    
    if (tooltipRect.left < 10) {
      position.value = { left: '0', transform: 'translateX(0)' }
    } else if (tooltipRect.right > window.innerWidth - 10) {
      position.value = { left: 'auto', right: '0', transform: 'translateX(0)' }
    } else {
      position.value = { left: '50%', transform: 'translateX(-50%)' }
    }
  }
}

watch(show, (newVal) => {
  if (newVal) {
    setTimeout(updatePosition, 0)
  }
})
</script>

<template>
  <span 
    ref="containerRef"
    class="info-tooltip-container"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <slot />
    <span class="info-tooltip-icon">?</span>
    <Transition name="tooltip">
      <div 
        v-if="show" 
        ref="tooltipRef"
        class="info-tooltip-popup"
        :style="position"
      >
        {{ text }}
      </div>
    </Transition>
  </span>
</template>

<style scoped>
.info-tooltip-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.info-tooltip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #222;
  color: #666;
  font-size: 10px;
  cursor: help;
  transition: all 0.2s;
}

.info-tooltip-icon:hover {
  background: #333;
  color: #888;
}

.info-tooltip-popup {
  position: absolute;
  bottom: 100%;
  margin-bottom: 8px;
  padding: 12px 14px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 11px;
  color: #aaa;
  line-height: 1.6;
  width: 280px;
  z-index: 1000;
  white-space: pre-line;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
