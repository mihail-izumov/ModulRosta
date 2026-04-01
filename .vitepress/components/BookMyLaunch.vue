<template>
  <div class="bml-page">
    <div class="bml-container">
      <div class="bml-glow bml-glow-1"></div>

      <template v-if="!submitted">
        <h1 class="bml-title">Забронировать<br/>мой запуск</h1>
        <p class="bml-subtitle">предполётная подготовка</p>

        <!-- Имя -->
        <div class="bml-field" :class="{ focused: focus.name }" @click="$refs.nameInput?.focus()">
          <span class="bml-field-label" :class="{ active: focus.name || form.name.length > 0, focused: focus.name }">Имя</span>
          <input ref="nameInput" type="text" :value="form.name" @input="form.name = $event.target.value" @focus="focus.name = true" @blur="focus.name = false" class="bml-field-input" />
        </div>

        <!-- Компания / Проект -->
        <div class="bml-field" :class="{ focused: focus.company }" @click="$refs.companyInput?.focus()">
          <span class="bml-field-label" :class="{ active: focus.company || form.company.length > 0, focused: focus.company }">Компания / Проект</span>
          <input ref="companyInput" type="text" :value="form.company" @input="form.company = $event.target.value" @focus="focus.company = true" @blur="focus.company = false" class="bml-field-input" />
        </div>

        <!-- Телефон -->
        <div class="bml-field" :class="{ focused: focus.contact }" @click="$refs.contactInput?.focus()">
          <span class="bml-field-label" :class="{ active: focus.contact || form.contact.length > 0, focused: focus.contact }">Телефон</span>
          <input ref="contactInput" type="tel" :value="form.contact" @input="form.contact = $event.target.value" @focus="focus.contact = true" @blur="focus.contact = false" class="bml-field-input" />
        </div>

        <!-- Bottleneck: multi -->
        <div class="bml-group">
          <div class="bml-group-label">
            Что тормозит рост прямо сейчас
            <span v-if="bottleneckArr.length" class="bml-group-count">({{ bottleneckArr.length }})</span>
          </div>
          <div class="bml-toggles">
            <button v-for="opt in bottleneckOptions" :key="opt" :class="['bml-toggle', { active: bottleneckArr.includes(opt) }]" @click="toggleMulti('bottleneck', opt)">{{ opt }}</button>
            <button :class="['bml-toggle', { active: otherActive }]" @click="toggleOther">Другое</button>
          </div>
          <div v-if="otherActive" class="bml-other-wrap">
            <textarea
              ref="otherInput"
              v-model="form.otherText"
              class="bml-other-textarea"
              rows="7"
              placeholder="Опишите подробнее..."
              @focus="focus.other = true"
              @blur="focus.other = false"
              :class="{ focused: focus.other }"
            ></textarea>
          </div>
        </div>

        <!-- Revenue -->
        <div class="bml-group">
          <div class="bml-group-label">Оборот в месяц</div>
          <div class="bml-toggles">
            <button v-for="opt in revenueOptions" :key="opt" :class="['bml-toggle', { active: form.revenue === opt }]" @click="toggleSingle('revenue', opt)">{{ opt }}</button>
          </div>
        </div>

        <!-- Urgency -->
        <div class="bml-group">
          <div class="bml-group-label">Когда нужно</div>
          <div class="bml-toggles">
            <button v-for="opt in urgencyOptions" :key="opt" :class="['bml-toggle', { active: form.urgency === opt }]" @click="toggleSingle('urgency', opt)">{{ opt }}</button>
          </div>
        </div>

        <!-- Status readout -->
        <div class="bml-status">
          <div class="bml-progress-row">
            <div class="bml-progress-track">
              <div class="bml-progress-fill" :style="{ width: (readyCount / checks.length * 100) + '%' }" :class="{ complete: allReady }"></div>
            </div>
            <span class="bml-progress-count" :class="{ complete: allReady }">{{ readyCount }}/{{ checks.length }}</span>
          </div>
          <div v-for="(c, i) in checks" :key="i" class="bml-status-row" :class="{ last: i === checks.length - 1 }">
            <span class="bml-status-label" :class="{ ready: c.ready }">{{ c.label }}</span>
            <div class="bml-dot-wrap">
              <div class="bml-dot" :class="{ ready: c.ready }"></div>
              <div v-if="c.ready" class="bml-dot-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="bml-submit-wrap">
          <button class="bml-submit" :disabled="!allReady" :class="{ ready: allReady }" @click="submitted = true">{{ allReady ? 'Отправить запрос' : 'Заполните параметры' }}</button>
        </div>
      </template>

      <!-- Success -->
      <div v-else class="bml-success">
        <div class="bml-success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8800" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="bml-success-title">Запрос отправлен</h2>
        <p class="bml-success-text">Мы свяжемся с вами в Telegram для предполётной подготовки.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'

const form = reactive({
  name: '', company: '', contact: '',
  bottleneck: '', revenue: '', urgency: '',
  otherText: '',
})
const focus = reactive({ name: false, company: false, contact: false, other: false })
const submitted = ref(false)
const otherActive = ref(false)

const bottleneckOptions = ['Всё держится на мне', 'Не масштабируется', 'Нет системы', 'Теряю клиентов', 'Конкуренты быстрее']
const revenueOptions = ['Стартап', 'до 10 млн', '10–50 млн', '50–150 млн', '150+ млн']
const urgencyOptions = ['Вчера', 'В этом месяце', 'В этом квартале', 'Пока думаю']

const bottleneckArr = computed(() => form.bottleneck ? form.bottleneck.split('|||') : [])

const otherInput = ref<HTMLTextAreaElement | null>(null)

function toggleMulti(key: string, val: string) {
  const arr = form[key] ? form[key].split('|||') : []
  const idx = arr.indexOf(val)
  if (idx >= 0) arr.splice(idx, 1); else arr.push(val)
  form[key] = arr.join('|||')
}

function toggleSingle(key: string, val: string) {
  form[key] = form[key] === val ? '' : val
}

function toggleOther() {
  otherActive.value = !otherActive.value
  if (!otherActive.value) {
    form.otherText = ''
  } else {
    nextTick(() => otherInput.value?.focus())
  }
}

const checks = computed(() => [
  { label: 'Контакт', ready: form.name.length > 0 && form.contact.length > 0 },
  { label: 'Точка роста', ready: form.bottleneck.length > 0 || (otherActive.value && form.otherText.length > 0) },
  { label: 'Масштаб', ready: form.revenue.length > 0 },
  { label: 'Срочность', ready: form.urgency.length > 0 },
])
const readyCount = computed(() => checks.value.filter(c => c.ready).length)
const allReady = computed(() => checks.value.every(c => c.ready))
</script>

<style scoped>
.bml-page {
  background: transparent;
  color: #fff;
  font-family: 'Inter', -apple-system, sans-serif;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
}
.bml-container {
  max-width: 540px;
  width: 100%;
  padding: 64px 24px 80px;
  position: relative;
  overflow: hidden;
}
.bml-glow { position: absolute; border-radius: 50%; pointer-events: none; }
.bml-glow-1 { top: 8%; left: -10%; width: 280px; height: 280px; background: radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%); filter: blur(40px); }

.bml-title { font-size: 20px; font-weight: 400; letter-spacing: 8px; text-transform: uppercase; text-align: center; margin-bottom: 8px; color: #fff; line-height: 1.6; }
.bml-subtitle { font-size: 11px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; text-align: center; margin-bottom: 48px; color: rgba(255,255,255,0.3); }

/* Fields */
.bml-field { position: relative; height: 72px; border-bottom: 1.5px solid #444; transition: border-color 0.3s; cursor: text; }
.bml-field.focused { border-bottom-color: #ff8800; }
.bml-field-label { position: absolute; left: 0; top: 50%; transform: translateY(-50%); font-size: 12.5px; font-weight: 400; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.45); pointer-events: none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.bml-field-label.active { top: 10px; transform: translateY(0); font-size: 9.5px; letter-spacing: 2.5px; }
.bml-field-label.focused { color: #ff8800; }
.bml-field-input { position: absolute; left: 0; bottom: 10px; width: 100%; background: transparent; border: none; color: #ff8800; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 400; letter-spacing: 1px; outline: none; caret-color: #ff8800; padding: 0; }

/* Toggles */
.bml-group { margin-bottom: 8px; }
.bml-group-label { font-size: 9.5px; font-weight: 400; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 14px; margin-top: 24px; }
.bml-group-count { color: rgba(245,158,11,0.5); margin-left: 8px; font-size: 9px; letter-spacing: 1.5px; }
.bml-toggles { display: flex; flex-wrap: wrap; gap: 8px; }
.bml-toggle { padding: 10px 18px !important; background: transparent !important; border: 1.5px solid #444 !important; border-radius: 2px !important; color: rgba(255,255,255,0.55) !important; font-size: 11px !important; font-family: 'Inter', sans-serif !important; font-weight: 400 !important; letter-spacing: 1.5px !important; text-transform: uppercase !important; cursor: pointer !important; transition: all 0.25s ease !important; white-space: nowrap !important; text-decoration: none !important; }
.bml-toggle::before, .bml-toggle::after { display: none !important; content: none !important; }
.bml-toggle:hover { border-color: rgba(245,158,11,0.4) !important; color: rgba(255,255,255,0.7) !important; }
.bml-toggle.active { background: rgba(245,158,11,0.12) !important; border-color: #ff8800 !important; color: #ff8800 !important; font-weight: 600 !important; }

/* Other textarea */
.bml-other-wrap { margin-top: 12px; width: 100%; }
.bml-other-textarea {
  width: 100%;
  background: transparent;
  border: 1.5px solid #444;
  border-radius: 2px;
  color: #ff8800;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: 0.5px;
  line-height: 1.6;
  padding: 14px 16px;
  outline: none;
  caret-color: #ff8800;
  resize: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}
.bml-other-textarea::placeholder { color: rgba(255,255,255,0.2); letter-spacing: 1px; font-size: 12px; }
.bml-other-textarea.focused { border-color: #ff8800; }

/* Status */
.bml-status { margin-top: 48px; border: 1px solid #2a2a2a; background: rgba(255,255,255,0.02); padding: 0 20px; }
.bml-progress-row { display: flex; align-items: center; gap: 14px; padding: 18px 0 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.bml-progress-track { flex: 1; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.bml-progress-fill { height: 100%; background: linear-gradient(90deg, rgba(245,158,11,0.5), rgba(245,158,11,0.2)); border-radius: 2px; transition: width 0.5s ease, background 0.5s ease; }
.bml-progress-fill.complete { background: #ff8800; }
.bml-progress-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.3); transition: color 0.5s; flex-shrink: 0; }
.bml-progress-count.complete { color: #ff8800; }
.bml-status-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.bml-status-row.last { border-bottom: none; }
.bml-status-label { font-size: 11px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); transition: color 0.5s; }
.bml-status-label.ready { color: rgba(245,158,11,0.8); }
.bml-dot-wrap { position: relative; width: 10px; height: 10px; }
.bml-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: background 0.5s ease, box-shadow 0.5s ease; }
.bml-dot.ready { background: #ff8800; box-shadow: 0 0 8px rgba(245,158,11,0.6); }
.bml-dot-pulse { position: absolute; top: -3px; left: -3px; width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(245,158,11,0.3); animation: bml-pulse 2s ease-out infinite; }
@keyframes bml-pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }

/* Submit */
.bml-submit-wrap { margin-top: 16px; margin-bottom: 40px; }
.bml-submit { padding: 24px 0 !important; background: transparent !important; border: 1.5px solid #444 !important; border-radius: 2px !important; color: rgba(255,255,255,0.35) !important; font-size: 13px !important; font-weight: 600 !important; letter-spacing: 5px !important; text-transform: uppercase !important; cursor: not-allowed !important; font-family: 'Inter', sans-serif !important; transition: all 0.5s !important; width: 100% !important; text-decoration: none !important; }
.bml-submit::before, .bml-submit::after { display: none !important; content: none !important; }
.bml-submit.ready { border-color: #ff8800 !important; color: #ff8800 !important; cursor: pointer !important; }
.bml-submit.ready:hover { background: #ff8800 !important; color: #000 !important; }

/* Success */
.bml-success { text-align: center; padding-top: 100px; }
.bml-success-icon { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #ff8800; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
.bml-success-title { font-size: 20px; font-weight: 400; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 20px; }
.bml-success-text { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 1px; line-height: 1.8; max-width: 400px; margin: 0 auto 40px; }

@media (max-width: 640px) {
  .bml-container { padding: 48px 16px 60px; }
  .bml-title { font-size: 17px; letter-spacing: 6px; }
}
</style>
