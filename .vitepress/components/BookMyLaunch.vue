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
          <span class="bml-field-label" :class="{ active: true, focused: focus.contact }">Телефон</span>
          <input ref="contactInput" type="tel" :value="form.contact" @input="onPhoneInput" @keydown="onPhoneKeydown" @focus="focus.contact = true" @blur="focus.contact = false" class="bml-field-input" placeholder="+7(___) ___-__-__" />
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
          <button class="bml-submit" :disabled="!allReady || sending" :class="{ ready: allReady && !sending }" @click="submitForm">{{ sending ? 'Отправка...' : allReady ? 'Отправить запрос' : 'Заполните параметры' }}</button>
          <p v-if="sendError" class="bml-error">{{ sendError }}</p>
        </div>
      </template>

      <!-- Success -->
      <div v-else class="bml-success">
        <div class="bml-success-icon">
          <svg width="96" height="96" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1,0,0,1,-2871.99,-1.91406)"><g transform="matrix(0.435429,0,0,0.307879,2871.99,1.91406)"><rect x="0" y="0" width="2480.32" height="3507.87" style="fill:none;"/><g><g transform="matrix(1.96888,0,0,2.78456,-1240.14,-5507.65)"><path fill="#00ff88" d="M1259.75,1977.92C1607.39,1977.92 1889.63,2260.16 1889.63,2607.8C1889.63,2955.44 1607.39,3237.68 1259.75,3237.68C912.109,3237.68 629.87,2955.44 629.87,2607.8C629.87,2260.16 912.109,1977.92 1259.75,1977.92ZM1246.99,2040.57C1246.99,2058.13 1246.99,2084.77 1246.97,2111.29C1246.97,2165.52 1239.65,2219.5 1225.2,2271.77C1203.8,2349.26 1179.23,2462.95 1172.85,2592.61C1172.85,2592.61 1012.08,2685.26 947.925,2722.24C931.847,2731.5 921.939,2748.65 921.939,2767.2L921.939,2803C921.939,2811.56 928.341,2818.78 936.845,2819.79C991.788,2826.36 1179.81,2848.85 1179.81,2848.85C1184.4,2898.11 1190.51,2940.24 1197.31,2976.11C1197.31,2976.11 1122.21,3019.39 1091.14,3037.3C1082.96,3042.01 1077.93,3050.73 1077.93,3060.16L1077.93,3077.93L1228.75,3095.07C1229.9,3098.23 1231.04,3101.26 1232.18,3104.16C1240.97,3126.82 1245.92,3150.78 1246.84,3175.04C939.635,3168.15 692.37,2916.63 692.37,2607.8C692.37,2298.92 939.736,2047.35 1246.99,2040.57ZM1272.5,2040.57C1579.76,2047.35 1827.13,2298.92 1827.13,2607.8C1827.13,2916.63 1579.86,3168.15 1272.67,3175.04C1273.58,3150.58 1278.59,3126.43 1287.5,3103.59C1288.49,3101.06 1289.49,3098.43 1290.5,3095.7L1441.57,3077.99L1441.57,3060.22C1441.57,3050.78 1436.53,3042.07 1428.36,3037.36C1397.38,3019.51 1322.66,2976.44 1322.66,2976.44C1329.63,2940.39 1335.85,2898.08 1340.41,2848.76C1340.41,2848.76 1527.81,2826.35 1582.65,2819.79C1591.16,2818.78 1597.56,2811.56 1597.56,2803L1597.56,2767.2C1597.56,2748.65 1587.65,2731.5 1571.57,2722.24C1507.34,2685.22 1346.25,2592.38 1346.25,2592.38C1339.24,2462.86 1314.86,2349.3 1293.74,2271.86C1279.64,2220.19 1272.5,2166.88 1272.5,2113.33L1272.5,2040.57Z"/></g></g></g></g></svg>
        </div>
        <h2 class="bml-success-title">Запрос отправлен</h2>
        <p class="bml-success-text">Свяжемся с вами для подготовки 90 мин. сессии.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'

const form = reactive({
  name: '', company: '', contact: '+7',
  bottleneck: '', revenue: '', urgency: '',
  otherText: '',
})
const focus = reactive({ name: false, company: false, contact: false, other: false })
const submitted = ref(false)
const sending = ref(false)
const sendError = ref('')
const otherActive = ref(false)

const TG_BOT_TOKEN = import.meta.env.VITE_TG_BOT_TOKEN
const TG_CHAT_ID   = import.meta.env.VITE_TG_CHAT_ID

async function submitForm() {
  if (!allReady.value || sending.value) return
  sending.value = true
  sendError.value = ''

  const bottleneckText = bottleneckArr.value.join(', ')
  const otherText = otherActive.value && form.otherText ? `\nДругое: ${form.otherText}` : ''

  const text = [
    '*Новая заявка — Book My Launch*',
    '',
    `*Имя:* ${form.name}`,
    `*Компания/Проект:* ${form.company || '—'}`,
    `*Телефон:* ${form.contact}`,
    '',
    `*Что тормозит:* ${bottleneckText || '—'}${otherText}`,
    `*Оборот:* ${form.revenue}`,
    `*Когда нужно:* ${form.urgency}`,
  ].join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    })
    const data = await res.json()
    if (data.ok) {
      submitted.value = true
    } else {
      sendError.value = 'Ошибка отправки. Попробуйте ещё раз.'
      console.error('Telegram API error:', data)
    }
  } catch (err) {
    sendError.value = 'Нет соединения. Попробуйте ещё раз.'
    console.error('Network error:', err)
  } finally {
    sending.value = false
  }
}

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

const contactInput = ref<HTMLInputElement | null>(null)

const phoneDigits = ref('7')
const phoneMode = computed<'mask' | 'free'>(() =>
  phoneDigits.value.length > 0 && phoneDigits.value[0] === '7' ? 'mask' : 'free'
)

// --- Masked mode: +7(XXX)XXX-XX-XX ---
function formatMask(digits: string): string {
  if (digits.length === 0) return '+'
  let r = '+' + digits[0]
  if (digits.length > 1) r += '(' + digits.substring(1, 4)
  if (digits.length >= 4) r += ')'
  if (digits.length > 4) r += digits.substring(4, 7)
  if (digits.length > 7) r += '-' + digits.substring(7, 9)
  if (digits.length > 9) r += '-' + digits.substring(9, 11)
  return r
}

function cursorToDigitIndex(pos: number, formatted: string): number {
  let idx = 0
  for (let i = 0; i < pos && i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) idx++
  }
  return idx
}

function digitIndexToCursor(digitIdx: number, formatted: string): number {
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (count === digitIdx) return i
    if (/\d/.test(formatted[i])) count++
  }
  return formatted.length
}

// --- Free mode: +{digits} ---
function formatFree(digits: string): string {
  return digits.length === 0 ? '+' : '+' + digits
}

// --- Common ---
function formatCurrent(): string {
  return phoneMode.value === 'mask'
    ? formatMask(phoneDigits.value)
    : formatFree(phoneDigits.value)
}

const maxDigits = computed(() => phoneMode.value === 'mask' ? 11 : 15)

function syncFormContact() {
  form.contact = formatCurrent()
}
syncFormContact()

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  const allDigits = input.value.replace(/\D/g, '').substring(0, 15)
  phoneDigits.value = allDigits
  const formatted = allDigits.length > 0 && allDigits[0] === '7'
    ? formatMask(allDigits.substring(0, 11))
    : formatFree(allDigits)
  form.contact = formatted
  nextTick(() => {
    input.value = formatted
    input.setSelectionRange(formatted.length, formatted.length)
  })
}

function onPhoneKeydown(e: KeyboardEvent) {
  const input = e.target as HTMLInputElement
  const pos = input.selectionStart ?? 0
  const formatted = input.value
  const isMask = phoneMode.value === 'mask'

  if (e.key === 'Backspace') {
    e.preventDefault()
    if (isMask) {
      const digitIdx = cursorToDigitIndex(pos, formatted)
      if (digitIdx <= 0) return
      const d = phoneDigits.value
      phoneDigits.value = d.substring(0, digitIdx - 1) + d.substring(digitIdx)
      const newFormatted = formatCurrent()
      form.contact = newFormatted
      // If mode switched to free (e.g. deleted the 7), place cursor at end
      const newCursor = phoneMode.value === 'mask'
        ? digitIndexToCursor(digitIdx - 1, newFormatted)
        : Math.max(1, newFormatted.length)
      nextTick(() => { input.value = newFormatted; input.setSelectionRange(newCursor, newCursor) })
    } else {
      // Free mode: "+{digits}" — pos 0 is '+', pos 1+ maps to digits
      if (pos <= 1) return // don't erase '+'
      const idx = pos - 1 // index in digits
      const d = phoneDigits.value
      if (idx <= 0 || idx > d.length) return
      phoneDigits.value = d.substring(0, idx - 1) + d.substring(idx)
      const newFormatted = formatCurrent()
      form.contact = newFormatted
      const nc = Math.min(pos - 1, newFormatted.length)
      nextTick(() => { input.value = newFormatted; input.setSelectionRange(nc, nc) })
    }
    return
  }

  if (e.key === 'Delete') {
    e.preventDefault()
    if (isMask) {
      const digitIdx = cursorToDigitIndex(pos, formatted)
      const d = phoneDigits.value
      if (digitIdx >= d.length) return
      phoneDigits.value = d.substring(0, digitIdx) + d.substring(digitIdx + 1)
      const newFormatted = formatCurrent()
      form.contact = newFormatted
      const nc = digitIndexToCursor(digitIdx, newFormatted)
      nextTick(() => { input.value = newFormatted; input.setSelectionRange(nc, nc) })
    } else {
      const idx = pos - 1
      const d = phoneDigits.value
      if (idx < 0 || idx >= d.length) return
      phoneDigits.value = d.substring(0, idx) + d.substring(idx + 1)
      const newFormatted = formatCurrent()
      form.contact = newFormatted
      nextTick(() => { input.value = newFormatted; input.setSelectionRange(pos, pos) })
    }
    return
  }

  if (['Tab','Escape','Enter','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return
  if (e.ctrlKey || e.metaKey) return

  if (!/^\d$/.test(e.key)) { e.preventDefault(); return }
  if (phoneDigits.value.length >= maxDigits.value) { e.preventDefault(); return }

  e.preventDefault()

  if (isMask) {
    const digitIdx = cursorToDigitIndex(pos, formatted)
    const d = phoneDigits.value
    phoneDigits.value = d.substring(0, digitIdx) + e.key + d.substring(digitIdx)
    // If first digit just changed to non-7, mode will auto-switch via computed
    const newFormatted = formatCurrent()
    form.contact = newFormatted
    const nc = phoneMode.value === 'mask'
      ? digitIndexToCursor(digitIdx + 1, newFormatted)
      : newFormatted.length
    nextTick(() => { input.value = newFormatted; input.setSelectionRange(nc, nc) })
  } else {
    const idx = pos - 1 // position in digits
    const d = phoneDigits.value
    const insertAt = Math.max(0, Math.min(idx, d.length))
    phoneDigits.value = d.substring(0, insertAt) + e.key + d.substring(insertAt)
    // If first digit is now 7, mode switches to mask automatically
    const newFormatted = formatCurrent()
    form.contact = newFormatted
    if (phoneMode.value === 'mask') {
      const nc = digitIndexToCursor(insertAt + 1, newFormatted)
      nextTick(() => { input.value = newFormatted; input.setSelectionRange(nc, nc) })
    } else {
      const nc = insertAt + 2 // +1 for '+', +1 for new digit
      nextTick(() => { input.value = newFormatted; input.setSelectionRange(nc, nc) })
    }
  }
}

const phoneComplete = computed(() =>
  phoneMode.value === 'mask' ? phoneDigits.value.length === 11 : phoneDigits.value.length >= 7
)

const checks = computed(() => [
  { label: 'Контакт', ready: form.name.length > 0 && phoneComplete.value },
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
.bml-field-input::placeholder { color: rgba(255,255,255,0.15); letter-spacing: 2px; }

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
.bml-error { margin-top: 12px; font-size: 11px; color: #ff4444; letter-spacing: 1px; text-align: center; }

/* Success */
.bml-success { text-align: center; padding-top: 100px; }
.bml-success-icon { width: 180px; height: 180px; border: none; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
.bml-success-title { font-size: 20px; font-weight: 400; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 20px; border: none !important; border-bottom: none !important; }
.bml-success-text { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 0; line-height: 1.8; max-width: 400px; margin: 0 auto 40px; }

@media (max-width: 640px) {
  .bml-container { padding: 48px 16px 60px; }
  .bml-title { font-size: 17px; letter-spacing: 6px; }
}
</style>
