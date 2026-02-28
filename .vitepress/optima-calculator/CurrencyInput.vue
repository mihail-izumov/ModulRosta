<script setup>
import { ref, watch, computed } from 'vue'
import { formatNumberWithSpaces, parseFormattedNumber } from './utils.js'

const props = defineProps({
  modelValue: { type: Number, required: true },
  max: { type: Number, default: Infinity }
})

const emit = defineEmits(['update:modelValue'])

const displayValue = ref(formatNumberWithSpaces(Math.round(props.modelValue)))
const isFocused = ref(false)

const handleInput = (e) => {
  const raw = e.target.value.replace(/[^\d\s]/g, '')
  displayValue.value = raw
}

const handleBlur = () => {
  isFocused.value = false
  const num = parseFormattedNumber(displayValue.value) || 0
  const clamped = Math.min(num, props.max)
  emit('update:modelValue', clamped)
  displayValue.value = formatNumberWithSpaces(clamped)
}

const handleFocus = () => {
  isFocused.value = true
}

watch(() => props.modelValue, (newVal) => {
  if (!isFocused.value) {
    displayValue.value = formatNumberWithSpaces(Math.round(newVal))
  }
})
</script>

<template>
  <div class="osc-currency-input-wrap">
    <input
      type="text"
      :value="displayValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      class="osc-currency-input"
    />
    <span class="osc-currency-symbol">₽</span>
  </div>
</template>

<style scoped>
.osc-currency-input-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
}

.osc-currency-input {
  width: 100%;
  background: none;
  border: none;
  font-size: 14px;
  color: #fff;
  outline: none;
  text-align: right;
}

.osc-currency-symbol {
  font-size: 12px;
  color: #888;
}

.osc-currency-input-wrap:focus-within {
  border-color: #00D9C0;
  background: rgba(0,217,192,0.05);
}
</style>
