<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: Infinity }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const isFocused = ref(false)

const formatDisplay = (val) => {
  return val > 0 ? Math.round(val).toLocaleString('ru-RU') : ''
}

watch(() => props.modelValue, (newVal) => {
  if (!isFocused.value) {
    inputValue.value = formatDisplay(newVal)
  }
}, { immediate: true })

const handleInput = (e) => {
  const raw = e.target.value.replace(/[^\d]/g, '')
  if (raw) {
    inputValue.value = parseInt(raw).toLocaleString('ru-RU')
  } else {
    inputValue.value = ''
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
  const raw = inputValue.value.replace(/[^\d]/g, '')
  const val = parseInt(raw) || 0
  const clamped = Math.max(props.min, Math.min(val, props.max))
  emit('update:modelValue', clamped)
  inputValue.value = formatDisplay(clamped)
}
</script>

<template>
  <div class="currency-input-wrapper">
    <input 
      type="text"
      class="currency-input"
      :value="inputValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      placeholder="0"
    />
    <span class="currency-symbol">₽</span>
  </div>
</template>

<style scoped>
.currency-input-wrapper {
  position: relative;
}

.currency-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  text-align: right;
  transition: border-color 0.2s;
}

.currency-input:focus {
  border-color: #00D9C0;
}

.currency-input::placeholder {
  color: #555;
}

.currency-symbol {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  font-size: 12px;
  pointer-events: none;
}
</style>
