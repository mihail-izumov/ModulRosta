<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  color: { type: String, default: '#00D9C0' }
})

const emit = defineEmits(['update:modelValue'])

const progress = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const sliderStyle = computed(() => ({
  background: `linear-gradient(to right, ${props.color} 0%, ${props.color} ${progress.value}%, rgba(255,255,255,0.1) ${progress.value}%, rgba(255,255,255,0.1) 100%)`
}))

const handleInput = (e) => {
  emit('update:modelValue', Number(e.target.value))
}
</script>

<template>
  <input
    type="range"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :style="sliderStyle"
    class="osc-custom-slider"
    @input="handleInput"
  />
</template>

<style scoped>
.osc-custom-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  outline: none;
}

.osc-custom-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: transform 0.15s ease;
}

.osc-custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.osc-custom-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
</style>
