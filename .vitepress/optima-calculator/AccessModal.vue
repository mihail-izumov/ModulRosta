<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Получить доступ' }
})

const emit = defineEmits(['close', 'submit'])

const fullName = ref('')
const phone = ref('')
const errors = ref({})

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.length <= 1) return `+${digits}`
  if (digits.length <= 4) return `+${digits.slice(0,1)} (${digits.slice(1)}`
  if (digits.length <= 7) return `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4)}`
  if (digits.length <= 9) return `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`
  return `+${digits.slice(0,1)} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9,11)}`
}

const handlePhoneInput = (e) => {
  phone.value = formatPhone(e.target.value)
}

const validate = () => {
  errors.value = {}
  
  if (!fullName.value.trim()) {
    errors.value.fullName = 'Введите имя и фамилию'
  } else if (fullName.value.trim().split(' ').length < 2) {
    errors.value.fullName = 'Введите имя и фамилию'
  }
  
  const phoneDigits = phone.value.replace(/\D/g, '')
  if (!phone.value) {
    errors.value.phone = 'Введите телефон'
  } else if (phoneDigits.length < 11) {
    errors.value.phone = 'Введите полный номер'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validate()) {
    emit('submit', {
      fullName: fullName.value.trim(),
      phone: phone.value
    })
  }
}

const handleClose = () => {
  emit('close')
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    fullName.value = ''
    phone.value = ''
    errors.value = {}
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="osc-modal">
      <div v-if="show" class="osc-modal-overlay" @click.self="handleClose">
        <div class="osc-modal-content">
          <button class="osc-modal-close" @click="handleClose">×</button>
          
          <h2 class="osc-modal-title">{{ title }}</h2>
          <p class="osc-modal-subtitle">Введите контактные данные для продолжения</p>
          
          <div class="osc-modal-form">
            <div class="osc-form-group">
              <label class="osc-form-label">Имя и Фамилия</label>
              <input 
                type="text"
                v-model="fullName"
                class="osc-form-input"
                :class="{ 'osc-input-error': errors.fullName }"
                placeholder="Иван Иванов"
                @keyup.enter="handleSubmit"
              />
              <span v-if="errors.fullName" class="osc-error-text">{{ errors.fullName }}</span>
            </div>
            
            <div class="osc-form-group">
              <label class="osc-form-label">Телефон</label>
              <input 
                type="tel"
                :value="phone"
                @input="handlePhoneInput"
                class="osc-form-input"
                :class="{ 'osc-input-error': errors.phone }"
                placeholder="+7 (999) 123-45-67"
                @keyup.enter="handleSubmit"
              />
              <span v-if="errors.phone" class="osc-error-text">{{ errors.phone }}</span>
            </div>
            
            <button class="osc-modal-submit" @click="handleSubmit">
              Продолжить
            </button>
          </div>
          
          <p class="osc-modal-privacy">
            Нажимая кнопку, вы соглашаетесь с 
            <a href="/terms/policy" target="_blank">политикой конфиденциальности</a>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.osc-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.osc-modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.osc-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.osc-modal-close:hover {
  background: rgba(255,255,255,0.2);
}

.osc-modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  text-align: center;
}

.osc-modal-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px;
  text-align: center;
}

.osc-modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.osc-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.osc-form-label {
  font-size: 12px;
  font-weight: 500;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.osc-form-input {
  padding: 14px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
}

.osc-form-input::placeholder {
  color: #555;
}

.osc-form-input:focus {
  border-color: #00D9C0;
  background: rgba(0,217,192,0.05);
}

.osc-form-input.osc-input-error {
  border-color: #E8192C;
}

.osc-error-text {
  font-size: 12px;
  color: #E8192C;
}

.osc-modal-submit {
  margin-top: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.osc-modal-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,217,192,0.4);
}

.osc-modal-privacy {
  margin-top: 16px;
  font-size: 11px;
  color: #666;
  text-align: center;
}

.osc-modal-privacy a {
  color: #00D9C0;
  text-decoration: none;
}

.osc-modal-privacy a:hover {
  text-decoration: underline;
}

/* Transitions */
.osc-modal-enter-active,
.osc-modal-leave-active {
  transition: opacity 0.3s ease;
}

.osc-modal-enter-active .osc-modal-content,
.osc-modal-leave-active .osc-modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.osc-modal-enter-from,
.osc-modal-leave-to {
  opacity: 0;
}

.osc-modal-enter-from .osc-modal-content,
.osc-modal-leave-to .osc-modal-content {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}
</style>
