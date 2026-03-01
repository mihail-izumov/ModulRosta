<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Получить доступ' }
})

const emit = defineEmits(['close', 'submit'])

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const errors = ref({})

// Генерация номера заявки
const applicationNumber = computed(() => {
  const now = new Date()
  const part1 = String(now.getDate()).padStart(2, '0')
  const part2 = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return `${part1}-${part2}`
})

const applicationDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

// Строгое форматирование телефона +7(123)456-78-90
const formatPhone = (value) => {
  let digits = value.replace(/\D/g, '')
  
  // Заменяем 8 на 7
  if (digits.startsWith('8') && digits.length > 1) {
    digits = '7' + digits.slice(1)
  }
  
  // Добавляем 7 если нет
  if (digits.length > 0 && !digits.startsWith('7')) {
    digits = '7' + digits
  }
  
  // СТРОГО 11 цифр максимум
  digits = digits.slice(0, 11)
  
  if (digits.length === 0) return ''
  if (digits.length === 1) return `+${digits}`
  if (digits.length <= 4) return `+${digits[0]}(${digits.slice(1)}`
  if (digits.length <= 7) return `+${digits[0]}(${digits.slice(1, 4)})${digits.slice(4)}`
  if (digits.length <= 9) return `+${digits[0]}(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`
  return `+${digits[0]}(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
}

const handlePhoneInput = (e) => {
  const formatted = formatPhone(e.target.value)
  phone.value = formatted
  // Принудительно устанавливаем значение в поле
  e.target.value = formatted
}

const validate = () => {
  errors.value = {}
  
  if (!firstName.value.trim()) {
    errors.value.firstName = 'Введите имя'
  }
  
  if (!lastName.value.trim()) {
    errors.value.lastName = 'Введите фамилию'
  }
  
  const phoneDigits = phone.value.replace(/\D/g, '')
  if (!phone.value) {
    errors.value.phone = 'Введите телефон'
  } else if (phoneDigits.length !== 11) {
    errors.value.phone = 'Введите полный номер (+7 и 10 цифр)'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validate()) {
    const userData = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      fullName: `${firstName.value.trim()} ${lastName.value.trim()}`,
      phone: phone.value,
      applicationNumber: applicationNumber.value,
      applicationDate: applicationDate.value
    }
    
    try {
      sessionStorage.setItem('osc_user_data', JSON.stringify(userData))
    } catch (e) {}
    
    emit('submit', userData)
  }
}

const handleClose = () => {
  emit('close')
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    firstName.value = ''
    lastName.value = ''
    phone.value = ''
    errors.value = {}
    
    try {
      const saved = sessionStorage.getItem('osc_user_data')
      if (saved) {
        const data = JSON.parse(saved)
        firstName.value = data.firstName || ''
        lastName.value = data.lastName || ''
        phone.value = data.phone || ''
      }
    } catch (e) {}
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="osc-modal">
      <div v-if="show" class="osc-modal-overlay" @click.self="handleClose">
        <div class="osc-modal-content">
          <button class="osc-modal-close" @click="handleClose" aria-label="Закрыть">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m15 9-6 6"/>
              <path d="m9 9 6 6"/>
            </svg>
          </button>
          
          <h2 class="osc-modal-title">{{ title }}</h2>
          <p class="osc-modal-subtitle">Укажите контакты, чтобы продолжить</p>
          
          <!-- Номер заявки -->
          <div class="osc-application-info">
            <span class="osc-app-label">Отчёт №</span>
            <span class="osc-app-number">{{ applicationNumber }}</span>
            <span class="osc-app-date">от {{ applicationDate }}</span>
          </div>
          
          <div class="osc-modal-form">
            <div class="osc-form-row">
              <div class="osc-form-group">
                <label class="osc-form-label">Имя</label>
                <input 
                  type="text"
                  v-model="firstName"
                  class="osc-form-input"
                  :class="{ 'osc-input-error': errors.firstName }"
                  placeholder="Иван"
                  @keyup.enter="handleSubmit"
                />
                <span v-if="errors.firstName" class="osc-error-text">{{ errors.firstName }}</span>
              </div>
              
              <div class="osc-form-group">
                <label class="osc-form-label">Фамилия</label>
                <input 
                  type="text"
                  v-model="lastName"
                  class="osc-form-input"
                  :class="{ 'osc-input-error': errors.lastName }"
                  placeholder="Иванов"
                  @keyup.enter="handleSubmit"
                />
                <span v-if="errors.lastName" class="osc-error-text">{{ errors.lastName }}</span>
              </div>
            </div>
            
            <div class="osc-form-group">
              <label class="osc-form-label">Телефон</label>
              <input 
                type="tel"
                :value="phone"
                @input="handlePhoneInput"
                class="osc-form-input"
                :class="{ 'osc-input-error': errors.phone }"
                placeholder="+7(999)123-45-67"
                maxlength="18"
                @keyup.enter="handleSubmit"
              />
              <span v-if="errors.phone" class="osc-error-text">{{ errors.phone }}</span>
            </div>
            
            <button class="osc-modal-submit" @click="handleSubmit">
              Продолжить
            </button>
          </div>
          
          <p class="osc-modal-privacy">Нажимая кнопку, вы соглашаетесь с <a href="/terms/policy" target="_blank">политикой конфиденциальности</a></p>
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
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
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
  width: 100%;
  max-width: 480px;
  position: relative;
}

.osc-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.osc-modal-close:hover {
  background: rgba(232,25,44,0.2);
  color: #E8192C;
}

.osc-modal-title {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  text-align: center;
}

.osc-modal-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0 0 20px;
  text-align: center;
}

.osc-application-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 0 24px;
  padding: 12px 20px;
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.25);
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.osc-app-label {
  font-size: 12px;
  color: #aaa;
}

.osc-app-number {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.osc-app-date {
  font-size: 12px;
  color: #aaa;
}

.osc-modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.osc-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.osc-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.osc-form-label {
  font-size: 11px;
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
  width: 100%;
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
  font-size: 11px;
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
  color: #555;
  text-align: center;
  line-height: 1.3;
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

@media (max-width: 520px) {
  .osc-form-row {
    grid-template-columns: 1fr;
  }
}
</style>
