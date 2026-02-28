<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  position: { type: String, default: 'top' },
  html: { type: Boolean, default: false },
  maxWidth: { type: Number, default: 280 }
})

const isVisible = ref(false)

const show = () => { isVisible.value = true }
const hide = () => { isVisible.value = false }

const tooltipStyle = computed(() => ({
  maxWidth: `${props.maxWidth}px`
}))
</script>

<template>
  <div class="osc-tooltip-wrapper" @mouseenter="show" @mouseleave="hide">
    <slot />
    <Transition name="osc-tip">
      <div 
        v-if="isVisible" 
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
  z-index: 1000;
  padding: 12px 16px;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #ddd;
  white-space: pre-wrap;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  pointer-events: none;
}

.osc-tooltip-box.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.osc-tooltip-box.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.osc-tip-enter-active,
.osc-tip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.osc-tip-enter-from,
.osc-tip-leave-to {
  opacity: 0;
}

:deep(strong) {
  color: #fff;
  font-weight: 600;
}
</style>
