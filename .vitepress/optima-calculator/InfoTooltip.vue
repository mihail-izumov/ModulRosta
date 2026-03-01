<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  position: { type: String, default: 'top' },
  html: { type: Boolean, default: false },
  maxWidth: { type: Number, default: 520 }
})

const isVisible = ref(false)
const tooltipRef = ref(null)
const wrapperRef = ref(null)
const adjustedStyle = ref({})

const show = async () => { 
  isVisible.value = true
  await nextTick()
  adjustPosition()
}
const hide = () => { isVisible.value = false }

const adjustPosition = () => {
  if (!tooltipRef.value || !wrapperRef.value) return
  
  const tooltip = tooltipRef.value.getBoundingClientRect()
  const wrapper = wrapperRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const padding = 20
  
  let left = wrapper.left + wrapper.width / 2 - tooltip.width / 2
  
  // Prevent overflow on right
  if (left + tooltip.width > viewportWidth - padding) {
    left = viewportWidth - padding - tooltip.width
  }
  
  // Prevent overflow on left
  if (left < padding) {
    left = padding
  }
  
  // Calculate offset from wrapper center
  const wrapperCenter = wrapper.left + wrapper.width / 2
  const offset = left - (wrapperCenter - tooltip.width / 2)
  
  adjustedStyle.value = {
    left: `calc(50% + ${offset}px)`,
    transform: 'translateX(-50%)'
  }
}

const tooltipStyle = computed(() => ({
  maxWidth: `${props.maxWidth}px`,
  minWidth: '340px',
  width: 'max-content',
  ...adjustedStyle.value
}))
</script>

<template>
  <div class="osc-tooltip-wrapper" ref="wrapperRef" @mouseenter="show" @mouseleave="hide">
    <slot />
    <Transition name="osc-tip">
      <div 
        v-if="isVisible" 
        ref="tooltipRef"
        class="osc-tooltip-box"
        :class="position"
        :style="tooltipStyle"
      >
        <div v-if="html" v-html="text"></div>
        <template v-else>{{ text }}</template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.osc-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  cursor: help;
}

.osc-tooltip-box {
  position: absolute;
  z-index: 9999;
  padding: 18px 24px;
  background: rgba(18, 18, 18, 0.98);
  border: 1px solid rgba(0, 217, 192, 0.35);
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.75;
  color: #e8e8e8;
  white-space: pre-wrap;
  box-shadow: 0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06);
  pointer-events: none;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.osc-tooltip-box.top {
  bottom: 100%;
  margin-bottom: 14px;
}

.osc-tooltip-box.bottom {
  top: 100%;
  margin-top: 14px;
}

.osc-tooltip-box.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) !important;
  margin-right: 14px;
}

.osc-tooltip-box.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) !important;
  margin-left: 14px;
}

/* Arrow indicator */
.osc-tooltip-box::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgba(18, 18, 18, 0.98);
  border: 1px solid rgba(0, 217, 192, 0.35);
  border-radius: 2px;
}

.osc-tooltip-box.top::after {
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-top: none;
  border-left: none;
}

.osc-tooltip-box.bottom::after {
  top: -7px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-bottom: none;
  border-right: none;
}

.osc-tip-enter-active,
.osc-tip-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.osc-tip-enter-from,
.osc-tip-leave-to {
  opacity: 0;
}

.osc-tooltip-box.top.osc-tip-enter-from,
.osc-tooltip-box.top.osc-tip-leave-to {
  transform: translateX(-50%) translateY(8px);
}

.osc-tooltip-box.bottom.osc-tip-enter-from,
.osc-tooltip-box.bottom.osc-tip-leave-to {
  transform: translateX(-50%) translateY(-8px);
}

/* HTML content styling */
.osc-tooltip-box :deep(strong),
.osc-tooltip-box :deep(b) {
  color: #00D9C0;
  font-weight: 600;
}

.osc-tooltip-box :deep(em) {
  color: #ffcc00;
  font-style: normal;
}

.osc-tooltip-box :deep(br) {
  display: block;
  margin: 4px 0;
}

.osc-tooltip-box :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.osc-tooltip-box :deep(li) {
  margin: 4px 0;
}
</style>
