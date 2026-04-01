<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ═══ REFS ═══
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapRef = ref<HTMLElement | null>(null)
const canvasGlowRef = ref<HTMLElement | null>(null)
const canvasLinesRef = ref<HTMLElement | null>(null)
const termRef = ref<HTMLElement | null>(null)
const termScrollRef = ref<HTMLElement | null>(null)
const termInnerRef = ref<HTMLElement | null>(null)
const jLogRef = ref<HTMLElement | null>(null)
const jBadgeRef = ref<HTMLElement | null>(null)
const jTitleRef = ref<HTMLElement | null>(null)
const jNumRef = ref<HTMLElement | null>(null)
const jClockRef = ref<HTMLElement | null>(null)
const jIconRef = ref<SVGElement | null>(null)
const pnTitleRef = ref<HTMLElement | null>(null)
const showDetails = ref(false)

function openDetails() { showDetails.value = true }
function closeDetails() { showDetails.value = false }

// ═══ LOGO MASK ═══
let logoMask: ImageData | null = null
const LS = 400
const CHEVRON_PATH = 'M6895.66,4460.27L6895.66,4367.25L7170.76,4203.17L7445.87,4369.28L7445.87,4463.27L7609.08,4560.65L7609.08,4661.64L7608.88,4661.52L7608.48,4859.02L7446.82,4762.34L7446.82,4952.95L7171.71,4793.75L6896.61,4950.91L6896.61,4761.4L6732.45,4859.02L6732.45,4658.64C6732.45,4658.64 6732.45,4557.65 6732.45,4557.65L6895.66,4460.27ZM7171.71,4696.96L6982.75,4804.41L6982.75,4710.18L7171.71,4597.82L7360.68,4710.83L7360.68,4805.79L7171.71,4696.96ZM7391.44,4531.16L7170.76,4397.91L6895.66,4561.99L6895.66,4561.27L6814.11,4609.92L6814.14,4709.48L7171.69,4497.69L7171.71,4497.69L7527.73,4711.65L7527.68,4613.08L7391.44,4531.8L7391.44,4531.16Z'

function buildLogoMask(): Promise<void> {
  return new Promise(resolve => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LS}" height="${LS}" viewBox="0 0 1080 1080" style="fill-rule:evenodd;clip-rule:evenodd;"><rect width="1080" height="1080" fill="black"/><rect x="0" y="0" width="1080" height="1080" style="fill:none;"/><g transform="matrix(1.23199,0,0,1.23199,-8294.3,-5100.12)"><path d="${CHEVRON_PATH}" style="fill:white;"/></g></svg>`
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = LS; c.height = LS
      c.getContext('2d')!.drawImage(img, 0, 0, LS, LS)
      logoMask = c.getContext('2d')!.getImageData(0, 0, LS, LS)
      resolve()
    }
    img.onerror = () => resolve()
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  })
}

function isLogo(nx: number, ny: number): boolean {
  if (!logoMask) return false
  const aspect = CW / CH
  const scale = 0.95
  const lx = ((nx - 0.5) * aspect) / scale + 0.5
  const ly = (ny - 0.5) / scale + 0.5
  if (lx < 0 || lx > 1 || ly < 0 || ly > 1) return false
  const sx = Math.floor(lx * LS), sy = Math.floor(ly * LS)
  if (sx < 0 || sx >= LS || sy < 0 || sy >= LS) return false
  return logoMask.data[(sy * LS + sx) * 4] > 128
}

// ═══ CANVAS ═══
const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
const CELL = 14, GAP = 2, STEP = CELL + GAP
let CW = 0, CH = 0, cols = 0, rows = 0
let pixels: any[] = [], time = 0, waveActive = false, waveTime: number | null = null
let logoIdxs: number[] = [], logoRevealed = 0, logoIv: ReturnType<typeof setInterval> | null = null
let greenWaveTime: number | null = null
let rafId: number | null = null
let clockIv: ReturnType<typeof setInterval> | null = null

const BLUE = { r: 88, g: 166, b: 255 }
const AMBER = { r: 255, g: 136, b: 0 }
const GREEN = { r: 0, g: 255, b: 136 }

function shuffle(a: any[]) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
function lC(a: typeof BLUE, b: typeof BLUE, t: number) { return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t } }

function buildLines() {
  const el = canvasLinesRef.value; if (!el) return; el.innerHTML = ''
  ;[33, 66].forEach(p => { const d = document.createElement('div'); d.className = 'cl-h'; d.style.top = p + '%'; el.appendChild(d) })
  ;[50].forEach(p => { const d = document.createElement('div'); d.className = 'cl-v'; d.style.left = p + '%'; el.appendChild(d) })
}

function buildPixels() {
  const canvas = canvasRef.value, wrap = canvasWrapRef.value
  if (!canvas || !wrap) return
  const ww = wrap.clientWidth, hh = wrap.clientHeight
  if (ww < 10 || hh < 10) return
  CW = canvas.width = Math.round(ww * DPR); CH = canvas.height = Math.round(hh * DPR)
  canvas.style.width = ww + 'px'; canvas.style.height = hh + 'px'
  cols = Math.ceil(CW / STEP) + 1; rows = Math.ceil(CH / STEP) + 1
  pixels = []; logoIdxs = []
  const asp = CW / CH
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c * STEP, y = r * STEP, nx = x / CW, ny = y / CH
    const dx = (nx - 0.5) * asp, dy = ny - 0.5, dist = Math.sqrt(dx * dx + dy * dy)
    const il = isLogo(nx, ny), idx = pixels.length
    pixels.push({ x, y, nx, ny, dist, isLogo: il, ph: Math.random() * Math.PI * 2, sp: 0.3 + Math.random() * 0.5, flk: Math.random() * 1000, act: 0, tA: 0, lg: 0, gT: 0 })
    if (il) logoIdxs.push(idx)
  }
  shuffle(logoIdxs)
  buildLines()
}

function startLogoReveal() {
  logoRevealed = 0; const total = logoIdxs.length; if (!total) return
  const batch = Math.max(1, Math.ceil(total / 120))
  logoIv = setInterval(() => { for (let i = 0; i < batch && logoRevealed < total; i++) { pixels[logoIdxs[logoRevealed]].lg = 1; logoRevealed++ } if (logoRevealed >= total && logoIv) clearInterval(logoIv) }, 16)
}
function startGreenWave() { greenWaveTime = performance.now() }
function resetPixels() {
  waveActive = false; waveTime = null; greenWaveTime = null
  if (logoIv) clearInterval(logoIv)
  pixels.forEach(p => { p.act = 0; p.tA = 0; p.lg = 0; p.gT = 0 })
  canvasGlowRef.value?.classList.remove('active')
}

function draw(now: number) {
  rafId = requestAnimationFrame(draw)
  const canvas = canvasRef.value; if (!canvas || !CW || !pixels.length) return
  const ctx = canvas.getContext('2d'); if (!ctx) return
  time += 0.007; ctx.clearRect(0, 0, CW, CH)
  const wR = (waveActive && waveTime) ? (now - waveTime) * 0.00035 : 0
  const gR = greenWaveTime ? (now - greenWaveTime) * 0.0004 : 0
  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i]
    if (waveActive && waveTime && wR > p.dist) p.tA = Math.min(1, (wR - p.dist) * 3)
    p.act += (p.tA - p.act) * 0.035
    if (greenWaveTime && gR > p.dist) { const gPen = Math.min(1, (gR - p.dist) * 2.5); p.gT += (gPen - p.gT) * 0.04 }
    const a = p.act, l = p.lg, g = p.gT
    const br = Math.sin(time * p.sp + p.ph) * 0.5 + 0.5, wv = Math.sin(time * 0.35 + p.nx * 4 + p.ny * 3) * 0.5 + 0.5
    const fv = Math.sin(time * 3.8 + p.flk) + Math.sin(time * 7.1 + p.flk * 1.3), flk = fv > 1.6 ? 1.8 : fv > 1.3 ? 1.3 : 1.0
    const sA = 0.05 + br * 0.04 + wv * 0.03, aA = 0.14 + br * 0.16 + wv * 0.07, fo = Math.max(0.2, 1 - p.dist * 0.4)
    let alpha = (sA + (aA - sA) * a) * fo * flk
    if (l > 0) alpha += 0.55 * (0.55 + Math.sin(time * 0.8 + p.ph) * 0.15) * flk
    if (g > 0.01 && g < 0.9) alpha += Math.sin(g * Math.PI) * 0.3
    let wf = 0; if (a > 0.01 && a < 0.9) { wf = Math.sin(a * Math.PI); alpha += wf * 0.45 }
    alpha = Math.max(0.008, Math.min(0.95, alpha))
    const pixTarget = lC(AMBER, GREEN, g)
    let color: typeof BLUE
    if (a < 0.01 && l < 1) color = BLUE
    else if (wf > 0.1) color = lC(lC(BLUE, pixTarget, a), AMBER, wf * 0.85)
    else color = lC(BLUE, pixTarget, Math.max(a, l))
    if (l > 0) color = lC(color, GREEN, 0.75)
    ctx.fillStyle = `rgba(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)},${alpha})`
    ctx.fillRect(p.x, p.y, CELL, CELL)
  }
}

// ═══ JOURNAL ═══
function jl(t: string, cls = 'dim') {
  const el = jLogRef.value; if (!el) return
  const l = document.createElement('div'); l.className = 'jl ' + cls; l.textContent = t
  el.appendChild(l); while (el.children.length > 40) el.removeChild(el.firstChild!)
  el.scrollTop = el.scrollHeight
}
function jClear() { if (jLogRef.value) jLogRef.value.innerHTML = '' }

// ═══ PHASE ═══
const ICON_COLORS: Record<string, string> = { blue: 'rgba(88,166,255,0.7)', amber: 'rgba(255,136,0,0.7)', green: 'rgba(0,255,136,0.65)', '': 'rgba(255,255,255,0.7)' }
const DIVIDER_COLORS: Record<string, string> = { blue: 'rgba(88,166,255,0.25)', amber: 'rgba(255,136,0,0.3)', green: 'rgba(0,255,136,0.25)', '': 'rgba(255,255,255,0.15)' }

function setPhase(ph: string) {
  const c = ph || ''
  if (jBadgeRef.value) jBadgeRef.value.className = 'journal-badge ' + c
  if (jTitleRef.value) jTitleRef.value.className = 'journal-title ' + c
  if (termRef.value) termRef.value.className = 'terminal ' + c
  jIconRef.value?.querySelectorAll('path').forEach(el => el.setAttribute('fill', ICON_COLORS[c] || ICON_COLORS['']))
  if (pnTitleRef.value) pnTitleRef.value.style.borderBottomColor = DIVIDER_COLORS[c] || DIVIDER_COLORS['']
}

// ═══ TERMINAL HELPERS ═══
function ti() { return termInnerRef.value! }
function tScroll() { requestAnimationFrame(() => { if (termScrollRef.value) termScrollRef.value.scrollTop = termScrollRef.value.scrollHeight }) }
function tClear() { if (termInnerRef.value) termInnerRef.value.innerHTML = '' }
function tGap() { const d = document.createElement('div'); d.className = 't-gap'; ti().appendChild(d); tScroll() }

function tType(text: string, cls = '', speed = 30): Promise<HTMLElement> {
  return new Promise(resolve => {
    const d = document.createElement('div'); if (cls) d.className = cls; ti().appendChild(d)
    let i = 0
    const iv = setInterval(() => { d.textContent = text.slice(0, ++i); tScroll(); if (i >= text.length) { clearInterval(iv); resolve(d) } }, speed)
  })
}

function tInput(primaryText: string, ghostText: string, primaryCls = ''): Promise<string> {
  return new Promise(resolve => {
    const wrap = document.createElement('div'); wrap.className = 't-input-line'; wrap.innerHTML = `<span class="prompt">&gt;</span>`
    const inp = document.createElement('input') as HTMLInputElement; inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false
    wrap.appendChild(inp); ti().appendChild(wrap)
    const btns = document.createElement('div'); btns.className = 't-btns'
    const btnP = document.createElement('button'); btnP.className = 't-btn ' + (primaryCls || ''); btnP.textContent = primaryText.toUpperCase()
    const btnG = document.createElement('button'); btnG.className = 't-btn ghost'; btnG.textContent = ghostText.toUpperCase()
    btns.appendChild(btnP); btns.appendChild(btnG); ti().appendChild(btns)
    const kb = document.createElement('div'); kb.className = 't-kb-hint'; kb.textContent = 'Y / N для ввода с клавиатуры'; ti().appendChild(kb)
    tScroll(); inp.focus()
    function finish(val: string) { inp.disabled = true; inp.value = val; btnP.disabled = true; btnG.disabled = true; btnP.style.opacity = '0.4'; btnG.style.opacity = '0.4'; btnP.style.pointerEvents = 'none'; btnG.style.pointerEvents = 'none'; kb.style.display = 'none'; document.removeEventListener('keydown', handler); resolve(val) }
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const v = inp.value.trim().toLowerCase(); if (v) finish(v) } })
    btnP.addEventListener('click', () => finish(primaryText.toLowerCase()))
    btnG.addEventListener('click', () => finish(ghostText.toLowerCase()))
    const handler = (e: KeyboardEvent) => { if (document.activeElement === inp && inp.value) return; if (e.code === 'KeyY') { e.preventDefault(); finish(primaryText.toLowerCase()) } if (e.code === 'KeyN') { e.preventDefault(); finish(ghostText.toLowerCase()) } }
    document.addEventListener('keydown', handler)
  })
}

function tButton(text: string, btnCls = 'amber'): Promise<void> {
  return new Promise(resolve => {
    const btn = document.createElement('button'); btn.className = 't-btn ' + btnCls; btn.textContent = text.toUpperCase(); ti().appendChild(btn)
    const kb = document.createElement('div'); kb.className = 't-kb-hint'; kb.textContent = 'Enter / Y для подтверждения'; ti().appendChild(kb); tScroll()
    btn.addEventListener('click', () => { btn.disabled = true; btn.style.opacity = '0.4'; kb.style.display = 'none'; document.removeEventListener('keydown', handler); resolve() })
    const handler = (e: KeyboardEvent) => { if (e.code === 'KeyY' || e.key === 'Enter') { e.preventDefault(); document.removeEventListener('keydown', handler); btn.disabled = true; btn.style.opacity = '0.4'; kb.style.display = 'none'; resolve() } }
    document.addEventListener('keydown', handler)
  })
}

function tProgress(duration: number): Promise<void> {
  return new Promise(resolve => {
    const wrapper = document.createElement('div'); wrapper.className = 't-progress'
    const barEl = document.createElement('div'); barEl.className = 'bar'
    const segs: HTMLElement[] = []; const total = 20
    for (let i = 0; i < total; i++) { const s = document.createElement('span'); s.className = 'seg empty'; barEl.appendChild(s); segs.push(s) }
    wrapper.appendChild(barEl)
    const pctEl = document.createElement('span'); pctEl.textContent = ' 0%'; pctEl.style.marginLeft = '6px'; wrapper.appendChild(pctEl)
    ti().appendChild(wrapper); tScroll()
    const start = performance.now()
    function upd() {
      const el = performance.now() - start; let t = Math.min(1, el / duration)
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const filled = Math.min(total, Math.round(t * total)); const pct = Math.min(100, Math.round(t * 100))
      for (let i = 0; i < total; i++) segs[i].className = i < filled ? 'seg filled' : 'seg empty'
      pctEl.textContent = ' ' + pct + '%'; tScroll()
      if (pct >= 100) { pctEl.textContent = ' 100%'; tScroll(); resolve() }
      else requestAnimationFrame(upd)
    }
    upd()
  })
}

function wait(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

function tCountdown() {
  const cd = document.createElement('div'); cd.className = 't-countdown'; ti().appendChild(cd)
  const target = Date.now() + 24 * 60 * 60 * 1000
  function upd() {
    const left = target - Date.now(); if (left <= 0) { cd.textContent = '00:00:00'; return }
    const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000)
    cd.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    requestAnimationFrame(upd)
  }
  upd()
}

// ═══ COUNTER API ═══
const _e = 'aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5QjFJS0hGeHRQTEJMdnktaW9Lb2RseEUzbWwxanc1VWNIeFZxalBmVl8zbDhNRGNBcVI5ck9oekowYjY3R2ZIUkovZXhlYw=='
const COUNTER_API = typeof atob !== 'undefined' ? atob(_e) : ''

async function fetchAndIncrement(): Promise<number> {
  if (COUNTER_API) {
    try {
      const res = await fetch(COUNTER_API, { method: 'POST' })
      const data = await res.json()
      if (data.count) {
        localStorage.setItem('rs_launch_num', String(data.count))
        return data.count
      }
    } catch (e) { /* fallback */ }
  }
  let num = parseInt(localStorage.getItem('rs_launch_num') || '0'); num++
  localStorage.setItem('rs_launch_num', String(num))
  return num
}

function displayNum(num: number) {
  if (jNumRef.value) jNumRef.value.textContent = String(num).padStart(3, '0')
}

function showCachedNum() {
  // Мгновенно показать последнее известное значение
  const cached = parseInt(localStorage.getItem('rs_launch_num') || '0')
  displayNum(cached || 1)
}

async function incLaunchNum() {
  const num = await fetchAndIncrement()
  displayNum(num)
}

// ═══ BOOKING ═══
async function offerBooking() {
  tGap()
  await tButton('ЗАБРОНИРОВАТЬ МОЙ ЗАПУСК', 'green')
  jl('Переход к бронированию', 'green')
  tGap(); await tType('[OK] Выполняется переход', 't-green', 20); jl('Сессия открыта', 'green')
  await wait(2000)
  window.location.href = '/book-my-launch'
}

function offerBookingSleep() {
  tGap()
  const btn = document.createElement('button'); btn.className = 't-btn-sleep'; btn.textContent = 'ЗАБРОНИРОВАТЬ МОЙ ЗАПУСК'
  ti().appendChild(btn)
  const kb = document.createElement('div'); kb.className = 't-kb-hint'; kb.textContent = 'Enter / Y для подтверждения'; ti().appendChild(kb); tScroll()
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.style.animation = 'none'; btn.style.opacity = '0.4'; kb.style.display = 'none'
    setPhase('green'); startGreenWave(); startLogoReveal()
    canvasGlowRef.value?.classList.add('active')
    jl('Подтверждение получено', 'green'); jl('Переход к бронированию', 'green')
    tGap(); await tType('[OK] Сессия подтверждена', 't-green', 20)
    tGap(); await tType('[OK] Выполняется переход', 't-green', 20); jl('Сессия открыта', 'green')
    await wait(3000)
    window.location.href = '/book-my-launch'
  })
  const handler = (e: KeyboardEvent) => { if (e.code === 'KeyY' || e.key === 'Enter') { e.preventDefault(); document.removeEventListener('keydown', handler); btn.click() } }
  document.addEventListener('keydown', handler)
}

// ═══ MAIN SCENARIO ═══
async function runPhase0() {
  tClear(); setPhase('blue')
  await tType('Сессия доступна', 't-blue', 28); tGap()
  await tType('Начать?', 't-bright', 35)
  jl('Сессия Ранскейл обнаружена', 'blue'); jl('Ожидание решения...', 'blue')

  const ans = await tInput('да', 'нет')
  if (['нет', 'no', 'n'].includes(ans)) {
    tGap(); await tType('Сессия отклонена.', 't-dim', 25); tGap()
    await tType('Повторный доступ через:', 't-blue', 25); tCountdown()
    jl('Сессия отклонена', 'dim'); jl('Блокировка на 24 часа', 'blue')
    tGap(); await tButton('СБРОСИТЬ', '')
    tClear(); jClear(); await incLaunchNum(); setPhase('blue'); runPhase0(); return
  }

  setPhase('amber'); jl('> scale --session', 'amber'); tGap()
  await tType('Подготовка сессии...', 't-amber', 25)
  waveActive = true; waveTime = performance.now()

  const jLines: [string, string][] = [
    ['Проверка конфигурации...', 'amber'], ['Подготовка: анализ данных... [OK]', 'amber'],
    ['Подготовка: формат сессии... [OK]', 'amber'], ['Подготовка: документ GO/NO GO... [OK]', 'amber'],
    ['Развёртывание сектора A1... [OK]', 'amber'], ['Развёртывание сектора B2... [OK]', 'amber'],
    ['Развёртывание сектора C3... [OK]', 'amber'], ['Синхронизация...', 'amber'], ['Верификация...', 'amber'],
  ]
  let ji = 0
  const jiv = setInterval(() => { if (ji < jLines.length) { jl(jLines[ji][0], jLines[ji][1]); ji++ } else clearInterval(jiv) }, 480)
  await tProgress(4500)
  clearInterval(jiv); while (ji < jLines.length) { jl(jLines[ji][0], jLines[ji][1]); ji++ }

  tGap()
  await tType('[OK] Сессия подготовлена', 't-amber', 25)
  await tType('[OK] Формат определён', 't-amber', 25)
  jl('Развёртывание завершено', 'amber'); jl('Все системы: работают', 'amber')
  tGap()
  await tType('Запросить доступ на сессию Ранскейл?', 't-amber', 25)
  jl('Ожидание подтверждения...', 'amber')

  const ans2 = await tInput('запросить', 'отмена', 'amber')
  if (['отмена', 'нет', 'no', 'n', 'cancel'].includes(ans2)) {
    tGap(); await tType('Модуль остаётся доступным.', 't-dim', 25); tGap()
    await tType('Закрыть сессию?', 't-white', 30); jl('Отказ от запуска', 'dim')
    const ans3 = await tInput('да', 'нет')
    if (['да', 'yes', 'y', 'д'].includes(ans3)) {
      tGap(); await tType('Сессия завершена.', 't-dim', 25); jl('Сессия закрыта', 'dim'); jl('Полный сброс...', 'dim')
      await wait(2000); resetPixels(); jClear(); tClear(); await incLaunchNum(); setPhase('blue'); runPhase0()
    } else {
      tGap(); await tType('Система остаётся в режиме доступа.', 't-white', 25); jl('Режим ожидания...', 'dim')
      offerBookingSleep()
    }
    return
  }

  // ── GREEN — confirmed ──
  setPhase('green'); startGreenWave(); startLogoReveal()
  canvasGlowRef.value?.classList.add('active')
  jl('Идентификация: активна', 'green')
  tGap(); jl('Подтверждение получено', 'green')
  await tType('[OK] Сессия подтверждена', 't-green', 25); tGap()
  jl('Создание сессии...', 'green'); jl('Redirect > /book-my-launch', 'green')
  await offerBooking()

  tGap(); await tType('Сбросить систему?', 't-white', 25)
  const ansR = await tInput('сброс', 'нет')
  if (['сброс', 'да', 'yes', 'y', 'д', 'reset'].includes(ansR)) {
    tGap(); await tType('Сессия завершена.', 't-dim', 25); jl('Полный сброс...', 'dim')
    await wait(2000); resetPixels(); jClear(); tClear(); await incLaunchNum(); setPhase('blue'); runPhase0()
  } else { tGap(); await tType('Система остаётся в режиме доступа.', 't-white', 25); jl('Режим ожидания...', 'green'); offerBookingSleep() }
}

// ═══ CLOCK ═══
function updateClock() {
  const n = new Date()
  if (jClockRef.value) jClockRef.value.textContent = n.toLocaleDateString('ru-RU') + ' — ' + n.toLocaleTimeString('ru-RU')
}

// ═══ LIFECYCLE ═══
function onResize() { buildPixels() }

onMounted(async () => {
  // Мгновенно показать кэшированное значение
  showCachedNum()
  // API обновит в фоне (без await — не блокирует загрузку)
  fetchAndIncrement().then(num => displayNum(num))
  updateClock(); clockIv = setInterval(updateClock, 1000)

  await buildLogoMask()
  await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  buildPixels(); rafId = requestAnimationFrame(draw)
  setPhase('blue')
  window.addEventListener('resize', onResize)

  await wait(800); jl('Загрузка версии 1.0', 'dim')
  await wait(800); jl('Настройка параметров...', 'dim')
  await wait(800); jl('Текущая дата: ' + new Date().toLocaleDateString('ru-RU'), 'dim')
  await wait(800); jl('Ожидание ввода...', 'blue')
  await wait(400); runPhase0()
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (clockIv) clearInterval(clockIv)
  if (logoIv) clearInterval(logoIv)
  window.removeEventListener('resize', onResize)
})

function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') showDetails.value = false }
onMounted(() => document.addEventListener('keydown', onEsc))
onUnmounted(() => document.removeEventListener('keydown', onEsc))
</script>

<template>
  <div class="lt-root">
    <div class="layout">
      <!-- LEFT PANEL -->
      <div class="panel-left">
        <div style="flex-shrink:0">
          <div class="journal-header">
            <svg ref="jIconRef" class="journal-icon" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;">
              <rect x="0" y="0" width="1080" height="1080" style="fill:none;" />
              <g transform="matrix(1.23199,0,0,1.23199,-8294.3,-5100.12)">
                <path :d="CHEVRON_PATH" fill="white" />
              </g>
            </svg>
            <div class="journal-title-row">
              <div ref="jTitleRef" class="journal-title">ЖУРНАЛ ЗАПУСКА</div>
              <div ref="jBadgeRef" class="journal-badge">№<span ref="jNumRef">000</span></div>
            </div>
          </div>
        </div>
        <div ref="jLogRef" class="journal-log" />
        <div ref="jClockRef" class="journal-clock" />
      </div>

      <!-- RIGHT PANEL -->
      <div class="panel-right">
        <div ref="canvasWrapRef" class="canvas-area">
          <canvas ref="canvasRef" class="lt-canvas" />
          <div ref="canvasGlowRef" class="canvas-glow" />
          <div ref="canvasLinesRef" class="canvas-lines" />
          <div class="terminal-wrap">
            <div ref="termRef" class="terminal">
              <div class="term-fade" />
              <div ref="termScrollRef" class="term-scroll">
                <div ref="termInnerRef" />
              </div>
            </div>
          </div>
        </div>

        <!-- PATCH NOTES -->
        <div class="patch-notes">
          <div ref="pnTitleRef" class="pn-title">РЕЖИМ РАНСКЕЙЛ СЕССИИ</div>
          <div class="pn-line" style="color:rgba(255,255,255,0.85);font-weight:500;">90 минут. Одно решение.</div>
          <div style="height:8px" />
          <div class="pn-line">Находим что тормозит рост.</div>
          <div class="pn-line">Выбираем цифровой продукт, который решает это.</div>
          <div class="pn-line">Вердикт: <span style="color:rgba(0,255,136,0.7);font-weight:500;">GO</span> или <span style="color:rgba(255,255,255,0.6);font-weight:500;">NO GO</span>.</div>
          <div style="height:8px" />
          <div class="pn-dim">Формат: видеозвонок · Результат: вердикт на 1 странице</div>
          <div class="pn-btn-wrap" style="margin-top:14px;margin-bottom:20px;padding-bottom:8px;">
            <button class="pn-details-btn" @click="openDetails">ДЕТАЛИ СЕССИИ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- DETAILS PANEL — absolute over lt-root -->
    <Transition name="dp-fade">
      <div v-if="showDetails" class="dp-overlay" @click.self="closeDetails">
        <div class="dp-card">
          <div class="dp-header">РЕЖИМ РАНСКЕЙЛ</div>
          <div class="dp-stats">
            <div class="dp-stat"><span class="dp-stat-val">90</span><span class="dp-stat-label">МИН.</span></div>
            <div class="dp-stat-div" />
            <div class="dp-stat"><span class="dp-stat-val" style="color:rgba(255,255,255,0.9)">8/10</span><span class="dp-stat-label">NO-GO</span></div>
            <div class="dp-stat-div" />
            <div class="dp-stat"><span class="dp-stat-val dp-stat-go">GO</span><span class="dp-stat-label">ВЕРДИКТ</span></div>
          </div>
          <div class="dp-specs">
            <div class="dp-spec-row"><span class="dp-spec-label">Что ищем</span><span class="dp-spec-val">причину, не симптом</span></div>
            <div class="dp-spec-row"><span class="dp-spec-label">Как решаем</span><span class="dp-spec-val">сигнал, не шум</span></div>
            <div class="dp-spec-row"><span class="dp-spec-label">Что получаете</span><span class="dp-spec-val">вердикт <span class="dp-go">GO</span> / <span class="dp-nogo">NO GO</span></span></div>
          </div>
          <div class="dp-format-badge">90 мин · видеозвонок · вердикт на 1 странице</div>
          <div class="dp-desc">
            <p style="color:rgba(255,255,255,0.85)">Находим что тормозит рост прямо сейчас. Выбираем один цифровой продукт, который решает это.</p>
            <p><span class="dp-go">GO</span> — запускаем. <span class="dp-nogo">NO GO</span> — документ показывает что устранить, чтобы запуск стал возможным.</p>
          </div>
          <button class="dp-close-btn" @click="closeDetails">ЗАКРЫТЬ</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700;800&family=Fira+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

.lt-root{width:100%;height:calc(100vh - 64px);height:calc(100dvh - 64px);background:transparent;overflow:hidden;padding:0;margin:0;font-family:'Fira Sans',sans-serif;color:#fff;position:relative;z-index:1;}
.layout{display:flex;width:100%;height:100%;border:1px solid rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;}

/* LEFT */
.panel-left{width:30%;min-width:260px;max-width:380px;height:100%;background:#0b0d12;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;padding:28px 24px;flex-shrink:0;z-index:10;overflow:hidden;}
.journal-header{margin-bottom:16px;flex-shrink:0;}
.journal-icon{display:block;width:64px;height:64px;margin-bottom:14px;}
.journal-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
.journal-title{font-family:'Inter',sans-serif;font-size:15px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;white-space:nowrap;color:rgba(255,255,255,0.85);transition:color 1s;}
.journal-title.blue{color:rgba(88,166,255,0.7);}
.journal-title.amber{color:rgba(255,136,0,0.7);}
.journal-title.green{color:rgba(0,255,136,0.65);}
.journal-badge{font-family:'Inter',sans-serif;font-size:15px;font-weight:700;letter-spacing:0.05em;white-space:nowrap;padding:5px 14px;background:rgba(88,166,255,0.06);border:1px solid rgba(88,166,255,0.2);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:8px;color:rgba(88,166,255,0.7);box-shadow:0 0 15px rgba(88,166,255,0.06),inset 0 0 15px rgba(88,166,255,0.03);transition:all 1s;}
.journal-badge.amber{background:rgba(255,136,0,0.06);border-color:rgba(255,136,0,0.25);color:rgba(255,136,0,0.7);box-shadow:0 0 15px rgba(255,136,0,0.08),inset 0 0 15px rgba(255,136,0,0.03);}
.journal-badge.green{background:rgba(0,255,136,0.06);border-color:rgba(0,255,136,0.2);color:rgba(0,255,136,0.65);box-shadow:0 0 15px rgba(0,255,136,0.06),inset 0 0 15px rgba(0,255,136,0.03);}
.journal-log{flex:1 1 0;min-height:0 !important;max-height:none;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:400;line-height:2;color:rgba(255,255,255,0.25);overflow-y:auto !important;overflow-x:hidden;padding-right:4px;}
.journal-log::-webkit-scrollbar{width:3px;}.journal-log::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);}.journal-log::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}
:deep(.jl){opacity:0;transform:translateY(4px);animation:jIn 0.4s ease forwards;}
:deep(.jl.blue){color:rgba(88,166,255,0.6);}:deep(.jl.amber){color:rgba(255,136,0,0.65);}:deep(.jl.green){color:rgba(0,255,136,0.6);}:deep(.jl.dim){color:rgba(255,255,255,0.25);}
@keyframes jIn{to{opacity:1;transform:translateY(0);}}
.journal-clock{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:400;letter-spacing:0.04em;padding-top:14px;border-top:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.35);flex-shrink:0;}

/* RIGHT */
.panel-right{flex:1;height:100%;display:flex;flex-direction:column;}
.canvas-area{flex:1;position:relative;overflow:hidden;min-height:0;}
.lt-canvas{display:block;position:absolute;top:0;left:0;}
.canvas-glow{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:0;transition:opacity 4s ease;background:radial-gradient(ellipse 55% 45% at 50% 50%,rgba(0,255,136,0.06) 0%,transparent 70%);}
.canvas-glow.active{opacity:1;}
.canvas-lines{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;}
:deep(.cl-h),:deep(.cl-v){position:absolute;background:rgba(255,255,255,0.025);}
:deep(.cl-h){left:0;width:100%;height:1px;}:deep(.cl-v){top:0;height:100%;width:1px;}

/* TERMINAL */
.terminal-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:20;width:clamp(380px,46vw,580px);}
.terminal{position:relative;background:rgba(8,10,16,0.6);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border:1px solid rgba(88,166,255,0.15);border-radius:12px;font-family:'Fira Sans',sans-serif;font-size:15px;font-weight:400;line-height:1.8;color:rgba(255,255,255,0.75);height:44vh;overflow:hidden;box-shadow:0 0 30px rgba(88,166,255,0.06),0 0 80px rgba(88,166,255,0.03),inset 0 0 40px rgba(88,166,255,0.02);transition:border-color 1s,box-shadow 1s;}
.terminal.amber{border-color:rgba(255,136,0,0.2);box-shadow:0 0 30px rgba(255,136,0,0.08),0 0 80px rgba(255,136,0,0.04),inset 0 0 40px rgba(255,136,0,0.02);}
.terminal.green{border-color:rgba(0,255,136,0.18);box-shadow:0 0 30px rgba(0,255,136,0.06),0 0 80px rgba(0,255,136,0.03),inset 0 0 40px rgba(0,255,136,0.02);}
.terminal::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;z-index:5;background:linear-gradient(90deg,transparent,rgba(88,166,255,0.35),transparent);transition:background 1s;}
.terminal.amber::before{background:linear-gradient(90deg,transparent,rgba(255,136,0,0.4),transparent);}
.terminal.green::before{background:linear-gradient(90deg,transparent,rgba(0,255,136,0.35),transparent);}
.term-fade{position:absolute;top:0;left:0;right:0;height:40px;background:linear-gradient(to bottom,rgba(8,10,16,0.65) 0%,transparent 100%);z-index:4;pointer-events:none;border-radius:12px 12px 0 0;}
.term-scroll{height:100%;overflow-y:scroll;scroll-behavior:smooth;padding:clamp(24px,2.5vw,36px);}
.term-scroll::-webkit-scrollbar{width:4px;}.term-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);}.term-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}

:deep(.t-green){color:rgba(0,255,136,0.9);}:deep(.t-amber){color:rgba(255,136,0,0.9);}:deep(.t-blue){color:rgba(88,166,255,0.8);}:deep(.t-dim){color:rgba(255,255,255,0.35);}:deep(.t-bright){color:rgba(255,255,255,0.9);font-weight:500;}:deep(.t-white){color:rgba(255,255,255,0.75);}:deep(.t-gap){height:16px;}
:deep(.t-input-line){display:flex;align-items:center;margin-top:12px;}:deep(.t-input-line .prompt){color:rgba(88,166,255,0.5);margin-right:10px;flex-shrink:0;font-family:'Fira Code',monospace;}
.terminal.amber :deep(.t-input-line .prompt){color:rgba(255,136,0,0.5);}
.terminal.green :deep(.t-input-line .prompt){color:rgba(0,255,136,0.5);}
:deep(.t-input-line input){background:none;border:none;outline:none;font-family:'Fira Sans',sans-serif;font-size:15px;font-weight:400;color:rgba(255,255,255,0.85);flex:1;caret-color:rgba(88,166,255,0.8);}
:deep(.t-input-line input::placeholder){color:rgba(255,255,255,0.1);}

:deep(.t-btns){display:flex;gap:10px;margin-top:14px;}
:deep(.t-btn){font-family:'Fira Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:0.1em;color:#fff;background:rgba(88,166,255,0.08);border:1px solid rgba(88,166,255,0.2);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:8px;padding:10px 28px;cursor:pointer;box-shadow:0 0 12px rgba(88,166,255,0.05),inset 0 0 12px rgba(88,166,255,0.03);transition:all 0.3s;}
:deep(.t-btn:hover){background:rgba(88,166,255,0.18);box-shadow:0 0 25px rgba(88,166,255,0.1),inset 0 0 15px rgba(88,166,255,0.04);}
:deep(.t-btn.amber){background:rgba(255,136,0,0.08);border-color:rgba(255,136,0,0.25);box-shadow:0 0 12px rgba(255,136,0,0.06),inset 0 0 12px rgba(255,136,0,0.03);}:deep(.t-btn.amber:hover){background:rgba(255,136,0,0.2);box-shadow:0 0 25px rgba(255,136,0,0.12),inset 0 0 15px rgba(255,136,0,0.04);}
:deep(.t-btn.green){background:rgba(0,255,136,0.08);border-color:rgba(0,255,136,0.2);box-shadow:0 0 12px rgba(0,255,136,0.05),inset 0 0 12px rgba(0,255,136,0.03);}:deep(.t-btn.green:hover){background:rgba(0,255,136,0.18);box-shadow:0 0 25px rgba(0,255,136,0.1),inset 0 0 15px rgba(0,255,136,0.04);}
:deep(.t-btn.ghost){background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.06);color:rgba(255,255,255,0.3);box-shadow:none;}:deep(.t-btn.ghost:hover){background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);}
:deep(.t-kb-hint){font-family:'Fira Code',monospace;font-size:11px;color:rgba(255,255,255,0.22);letter-spacing:0.06em;margin-top:10px;}
:deep(.t-progress){font-family:'Fira Code',monospace;font-size:14px;color:rgba(255,136,0,0.8);margin-top:8px;display:flex;align-items:center;gap:6px;}:deep(.t-progress.done){color:rgba(255,136,0,0.9);}
:deep(.t-progress .bar){display:flex;gap:1px;align-items:center;}
:deep(.t-progress .seg){width:12px;height:14px;display:inline-block;}
:deep(.t-progress .seg.filled){background:currentColor;opacity:0.9;}:deep(.t-progress .seg.empty){background:currentColor;opacity:0.15;}
:deep(.t-countdown){font-family:'Fira Code',monospace;font-size:14px;color:rgba(88,166,255,0.6);margin-top:4px;}

:deep(.t-btn-sleep){font-family:'Fira Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:0.1em;color:rgba(0,255,136,0.7);background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:8px;padding:12px 32px;cursor:pointer;transition:all 0.4s;animation:btnSleep 3s ease-in-out infinite;}
:deep(.t-btn-sleep:hover){animation:none;color:rgba(0,255,136,0.95);background:rgba(0,255,136,0.15);border-color:rgba(0,255,136,0.3);box-shadow:0 0 30px rgba(0,255,136,0.12),inset 0 0 20px rgba(0,255,136,0.05);}
@keyframes btnSleep{0%,100%{box-shadow:0 0 8px rgba(0,255,136,0.04),inset 0 0 8px rgba(0,255,136,0.02);border-color:rgba(0,255,136,0.1);opacity:0.7;}50%{box-shadow:0 0 20px rgba(0,255,136,0.1),inset 0 0 15px rgba(0,255,136,0.04);border-color:rgba(0,255,136,0.25);opacity:1;}}

/* PATCH NOTES */
.patch-notes{height:24%;min-height:130px;max-height:280px;background:rgba(10,12,16,0.95);border-top:1px solid rgba(255,255,255,0.05);padding:20px 28px 28px;font-family:'Fira Sans',sans-serif;font-size:13px;font-weight:300;line-height:1.9;color:rgba(255,255,255,0.35);overflow-y:auto;z-index:10;}
.patch-notes::-webkit-scrollbar{width:3px;}.patch-notes::-webkit-scrollbar-track{background:transparent;}.patch-notes::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);}
.pn-title{font-size:13px;font-weight:600;letter-spacing:0.08em;color:rgba(255,255,255,0.9);text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.15);transition:border-color 1s;}
.pn-line{color:rgba(255,255,255,0.35);margin-bottom:2px;}
.pn-dim{color:rgba(255,255,255,0.2);font-size:12px;margin-top:8px;}
.pn-details-btn{font-family:'Fira Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:8px 20px;cursor:pointer;transition:all 0.3s;backdrop-filter:blur(8px);}
.pn-details-btn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2);}

/* DETAILS PANEL — absolute overlay inside lt-root */
.dp-overlay{position:absolute;inset:0;z-index:99;background:rgba(3,5,10,0.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;padding:24px;}
.dp-fade-enter-active,.dp-fade-leave-active{transition:opacity 0.3s ease;}
.dp-fade-enter-from,.dp-fade-leave-to{opacity:0;}
.dp-card{width:100%;max-width:480px;background:rgba(8,12,24,0.6);border:1px solid rgba(88,166,255,0.12);border-radius:16px;padding:36px 32px 28px;position:relative;box-shadow:0 0 60px rgba(0,0,0,0.4);}
.dp-card::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(88,166,255,0.25),transparent);}
.dp-header{font-family:'Inter',sans-serif;font-size:18px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.9);text-transform:uppercase;margin-bottom:24px;text-align:center;}
.dp-stats{display:flex;justify-content:center;align-items:center;gap:24px;margin-bottom:24px;}
.dp-stat{text-align:center;}
.dp-stat-val{font-family:'Fira Code',monospace;font-size:32px;font-weight:500;color:#fff;display:block;line-height:1;margin-bottom:6px;letter-spacing:1px;}
.dp-stat-go{color:rgba(0,255,136,0.9);}
.dp-stat-label{font-family:'Fira Code',monospace;font-size:9px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2px;}
.dp-stat-div{width:1px;height:44px;background:rgba(255,255,255,0.08);}
.dp-specs{margin-bottom:18px;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:10px;}
.dp-spec-row{display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-family:'Fira Code',monospace;font-size:13px;}
.dp-spec-row:first-child{padding-top:4px;}
.dp-spec-row:last-child{border-bottom:none;padding-bottom:4px;}
.dp-spec-label{color:rgba(255,255,255,0.35);font-weight:400;}
.dp-spec-val{color:rgba(255,255,255,0.8);font-weight:500;text-align:right;}
.dp-go{color:rgba(0,255,136,0.85);font-family:'Fira Code',monospace;font-weight:700;}
.dp-nogo{color:rgba(255,255,255,0.6);font-family:'Fira Code',monospace;font-weight:700;}
.dp-format-badge{font-family:'Fira Code',monospace;font-size:12px;color:rgba(255,136,0,0.7);text-align:center;margin-bottom:18px;padding:10px 16px;background:rgba(255,136,0,0.04);border:1px solid rgba(255,136,0,0.12);border-radius:8px;letter-spacing:0.03em;}
.dp-desc{margin-bottom:24px;}
.dp-desc p{font-family:'Fira Sans',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.8;margin:0 0 10px;text-align:center;}
.dp-desc p:last-child{margin-bottom:0;}
.dp-close-btn{display:block;width:100%;font-family:'Fira Sans',sans-serif;font-size:15px;font-weight:500;letter-spacing:0.1em;color:rgba(255,255,255,0.9);background:rgba(88,166,255,0.08);border:1px solid rgba(88,166,255,0.2);border-radius:10px;padding:14px 0;cursor:pointer;transition:all 0.3s;box-shadow:0 0 12px rgba(88,166,255,0.05),inset 0 0 12px rgba(88,166,255,0.03);}
.dp-close-btn:hover{background:rgba(88,166,255,0.18);box-shadow:0 0 25px rgba(88,166,255,0.1),inset 0 0 15px rgba(88,166,255,0.05);}

/* MOBILE */
@media(max-width:768px){
  .lt-root{padding:0;height:calc(100vh - 64px);height:calc(100dvh - 64px);min-height:0;background:transparent;overflow:hidden;margin:0;max-width:100vw;}
  .layout{flex-direction:column;border:none;border-radius:0;gap:0;overflow:hidden;height:100%;}
  .panel-left{width:100%;max-width:none;min-width:0;height:110px;min-height:110px;padding:12px 16px;border-right:none;border-bottom:1px solid rgba(255,255,255,0.06);overflow:hidden;flex-shrink:0;}
  .journal-header{display:flex;align-items:center;gap:12px;margin-bottom:6px;}
  .journal-icon{width:32px;height:32px;margin-bottom:0;}
  .journal-title-row{margin-bottom:0;}.journal-title{font-size:14px;}.journal-badge{font-size:14px;padding:4px 12px;}
  .journal-log{max-height:45px;flex:none;font-size:10px;line-height:1.6;}.journal-clock{display:none;}
  .panel-right{flex:1;min-height:0;overflow:hidden;}.canvas-area{flex:3;min-height:0;overflow:hidden;}
  .terminal-wrap{width:90% !important;}
  .terminal{height:42vh;}
  .patch-notes{flex-shrink:0;height:auto;min-height:130px;max-height:170px;padding:14px 16px;font-size:13px;line-height:1.8;margin-top:0;border-top:1px solid rgba(255,255,255,0.06);}
  .pn-title{font-size:13px;margin-bottom:10px;padding-bottom:8px;}
  .pn-dim{font-size:11px;}
  :deep(.t-btn),:deep(.t-btn-sleep){max-width:100%;width:100%;text-align:center;line-height:1.4;}
  .pn-btn-wrap{margin-bottom:12px !important;padding-bottom:4px !important;}
  .pn-details-btn{font-size:12px !important;padding:8px 20px !important;}
  .dp-overlay{padding:16px;}
  .dp-card{padding:24px 20px 20px;border-radius:12px;}
  .dp-header{font-size:15px;margin-bottom:18px;}
  .dp-stats{gap:16px;margin-bottom:18px;}.dp-stat-val{font-size:26px;}.dp-stat-div{height:36px;}
  .dp-spec-row{flex-direction:column;gap:2px;padding:8px 0;font-size:12px;}.dp-spec-val{text-align:left;}
  .dp-close-btn{font-size:14px;padding:12px 0;}
}
</style>
