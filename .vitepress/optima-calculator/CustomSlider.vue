<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  color: { type: String, default: '#00D9C0' }
})

const emit = defineEmits(['update:modelValue'])

const percent = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const gradientStyle = computed(() => {
  return {
    background: `linear-gradient(to right, ${props.color} 0%, ${props.color} ${percent.value}%, #1a1a1a ${percent.value}%, #1a1a1a 100%)`
  }
})

const handleInput = (e) => {
  emit('update:modelValue', Number(e.target.value))
}
</script>

<template>
  <div class="custom-slider-wrapper">
    <input 
      type="range"
      class="custom-slider"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :style="gradientStyle"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.custom-slider-wrapper {
  position: relative;
  height: 28px;
  display: flex;
  align-items: center;
}

.custom-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
}

.custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.custom-slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.custom-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
</style>
