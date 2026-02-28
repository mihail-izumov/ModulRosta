<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  html: { type: Boolean, default: false }
})

const isVisible = ref(false)
const tooltipRef = ref(null)
const position = ref({ x: 0, y: 0 })

const showTooltip = (event) => {
  isVisible.value = true
}

const hideTooltip = () => {
  isVisible.value = false
}
</script>

<template>
  <span 
    class="osc-tooltip-wrapper"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot />
    <Transition name="osc-tooltip-fade">
      <div 
        v-if="isVisible" 
        ref="tooltipRef"
        class="osc-tooltip-box"
      >
        <div v-if="html" v-html="text" class="osc-tooltip-content"></div>
        <div v-else class="osc-tooltip-content">{{ text }}</div>
      </div>
    </Transition>
  </span>
</template>

<style scoped>
.osc-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  cursor: help;
}

.osc-tooltip-box {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  background: #1a1a1a;
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #ccc;
  line-height: 1.6;
  white-space: pre-wrap;
  max-width: 320px;
  min-width: 200px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.osc-tooltip-box::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1a1a1a;
}

.osc-tooltip-content :deep(strong) {
  color: #fff;
  font-weight: 600;
}

.osc-tooltip-content :deep(span) {
  display: block;
  margin-top: 8px;
}

.osc-tooltip-fade-enter-active,
.osc-tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.osc-tooltip-fade-enter-from,
.osc-tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
