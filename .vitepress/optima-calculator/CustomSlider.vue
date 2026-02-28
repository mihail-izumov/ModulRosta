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

const handleInput = (event) => {
  emit('update:modelValue', Number(event.target.value))
}
</script>

<template>
  <div class="osc-slider-container">
    <input 
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      class="osc-slider"
      :style="{
        background: `linear-gradient(to right, ${color} 0%, ${color} ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`
      }"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.osc-slider-container {
  width: 100%;
  padding: 8px 0;
}

.osc-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.osc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  transition: transform 0.15s ease;
}

.osc-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.osc-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
</style>
