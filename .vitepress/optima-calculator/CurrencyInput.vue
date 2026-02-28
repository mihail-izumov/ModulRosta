<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 100000000 }
})

const emit = defineEmits(['update:modelValue'])

const formatWithSpaces = (num) => {
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const parseNumber = (str) => {
  return parseInt(str.replace(/\s/g, ''), 10) || 0
}

const displayValue = ref(formatWithSpaces(props.modelValue))

watch(() => props.modelValue, (newVal) => {
  displayValue.value = formatWithSpaces(newVal)
})

const handleInput = (event) => {
  const raw = event.target.value.replace(/\s/g, '')
  const num = parseInt(raw, 10)
  
  if (!isNaN(num)) {
    const clamped = Math.min(num, props.max)
    displayValue.value = formatWithSpaces(clamped)
    emit('update:modelValue', clamped)
  } else {
    displayValue.value = event.target.value
  }
}

const handleBlur = () => {
  const num = parseNumber(displayValue.value)
  const clamped = Math.min(Math.max(0, num), props.max)
  displayValue.value = formatWithSpaces(clamped)
  emit('update:modelValue', clamped)
}
</script>

<template>
  <div class="osc-currency-input-wrapper">
    <input 
      type="text"
      :value="displayValue"
      @input="handleInput"
      @blur="handleBlur"
      class="osc-currency-input"
      inputmode="numeric"
    />
    <span class="osc-currency-symbol">₽</span>
  </div>
</template>

<style scoped>
.osc-currency-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.osc-currency-input {
  width: 100%;
  padding: 12px 36px 12px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-align: right;
  outline: none;
  transition: all 0.2s;
}

.osc-currency-input:focus {
  border-color: #00D9C0;
  background: rgba(0,217,192,0.05);
}

.osc-currency-symbol {
  position: absolute;
  right: 14px;
  color: #888;
  font-size: 15px;
  pointer-events: none;
}
</style>
