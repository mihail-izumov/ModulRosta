<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// ── Data ──
const PAIRS = [
  { left: 'Симптом', right: 'Причина', label: 'Фокус' },
  { left: 'Шум', right: 'Сигнал', label: 'Ускорение' },
  { left: 'Шоу', right: 'Результат', label: 'Амбиция' },
]

const BLUE = { r: 88, g: 166, b: 255 }
const AMBER = { r: 255, g: 136, b: 0 }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function lerpC(a: typeof BLUE, b: typeof BLUE, t: number) {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  }
}
function rgb(c: { r: number; g: number; b: number }) { return `rgb(${c.r},${c.g},${c.b})` }

// ── State ──
const containerEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

const selected = ref([true, true, true])
const launchHover = ref(false)
const formHover = ref(false)
const launchPulse = ref(false)
const isMobile = ref(false)
const uiBlend = ref(1)

let wasReset = false
let pixels: any[] = []
let time = 0
let rafId: number | null = null
let wave = 1.7
let waveTarget = 1
let maxDist = Math.sqrt(2)
let uiBlendInternal = 1
let canvasW = 0
let canvasH = 0

const count = computed(() => selected.value.filter(Boolean).length)
const allSelected = computed(() => count.value === 3)
const iconActive = computed(() => launchHover.value || launchPulse.value)

const accent = computed(() => lerpC(BLUE, AMBER, uiBlend.value))
const accentRgb = computed(() => rgb(accent.value))
const headerBg = computed(() => {
  const a = accent.value
  return `rgb(${Math.round(6 + a.r * 0.1)},${Math.round(6 + a.g * 0.1)},${Math.round(10 + a.b * 0.1)})`
})
const formBg = computed(() => headerBg.value)

// ── Watch for 3/3 pulse ──
let pulseTimer: ReturnType<typeof setTimeout> | null = null

watch(count, (newVal, oldVal) => {
  waveTarget = newVal === 3 ? 1 : 0
  if (newVal < 3) {
    wasReset = true
  } else if (newVal === 3 && oldVal !== undefined && oldVal < 3 && wasReset) {
    // Wait for v-if to mount the icon in default state, then trigger rotation
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          launchPulse.value = true
          if (pulseTimer) clearTimeout(pulseTimer)
          pulseTimer = setTimeout(() => { launchPulse.value = false }, 2000)
        })
      })
    })
  }
})

// ── Toggle logic ──
function handleToggle(i: number, side: 'left' | 'right') {
  const s = [...selected.value]
  if (side === 'left' && s[i]) {
    selected.value = [false, false, false]
    return
  }
  if (!s[i]) {
    s[i] = true
    selected.value = s
  }
}

// ── Canvas ──
function buildPixels() {
  const canvas = canvasEl.value
  const container = containerEl.value
  if (!canvas || !container) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = container.clientWidth
  const h = container.clientHeight
  isMobile.value = w < 640
  const cell = w < 640 ? 6 : 8
  const step = cell + 1
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  canvasW = canvas.width
  canvasH = canvas.height
  const cols = Math.ceil(canvasW / (step * dpr)) + 1
  const rows = Math.ceil(canvasH / (step * dpr)) + 1
  maxDist = Math.sqrt(2)
  pixels = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = c / Math.max(cols - 1, 1)
      const ny = r / Math.max(rows - 1, 1)
      pixels.push({
        x: c * step * dpr, y: r * step * dpr, w: cell * dpr,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        flickerSeed: Math.random() * 1000,
        nx,
        dist: Math.sqrt(nx * nx + ny * ny),
        noiseOffset: Math.random() * 0.4,
      })
    }
  }
}

let lastUiUpdate = 0

function draw(now: number) {
  rafId = requestAnimationFrame(draw)
  const canvas = canvasEl.value
  if (!canvas || !canvasW) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  time += 0.007
  const t = time

  wave += (waveTarget * 1.7 - wave) * (waveTarget === 1 ? 0.012 : 0.018)
  if (waveTarget === 0 && wave < 0.001) wave = 0
  uiBlendInternal += (waveTarget - uiBlendInternal) * 0.025
  if (now - lastUiUpdate > 50) {
    lastUiUpdate = now
    uiBlend.value = uiBlendInternal
  }

  ctx.clearRect(0, 0, canvasW, canvasH)
  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i]
    const breathe = Math.sin(t * p.speed + p.phase) * 0.5 + 0.5
    const wv = Math.sin(t * 0.35 + p.nx * 4) * 0.5 + 0.5
    const fl = Math.sin(t * 3.8 + p.flickerSeed) + Math.sin(t * 7.1 + p.flickerSeed * 1.3)
    const flm = fl > 1.6 ? 1.8 : fl > 1.3 ? 1.3 : 1.0
    const alpha = (0.08 + breathe * 0.14 + wv * 0.08) * flm
    const threshold = (p.dist + p.noiseOffset * 0.45) / (maxDist + 0.5)
    const blend = Math.max(0, Math.min(1, (wave - threshold) * 3.5))
    const c = lerpC(BLUE, AMBER, blend)
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
    ctx.fillRect(p.x, p.y, p.w, p.w)
  }
}

let ro: ResizeObserver | null = null

onMounted(() => {
  buildPixels()
  rafId = requestAnimationFrame(draw)
  if (containerEl.value) {
    ro = new ResizeObserver(() => buildPixels())
    ro.observe(containerEl.value)
  }
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (ro) ro.disconnect()
  if (pulseTimer) clearTimeout(pulseTimer)
})

// ── Mobile touch helpers ──
function onLaunchTouchStart() { launchHover.value = true }
function onLaunchTouchEnd() { setTimeout(() => { launchHover.value = false }, 400) }
function onFormTouchStart() { formHover.value = true }
function onFormTouchEnd() { setTimeout(() => { formHover.value = false }, 300) }
</script>

<template>
  <div class="mr-sl-root">
    <div class="mr-sl-column">

      <!-- Heading -->
      <div class="mr-sl-heading">
        <span class="mr-sl-heading-white">Вы знаете, что хотите.</span>
        <br>
        <span class="mr-sl-heading-accent" :style="{ color: accentRgb }">
          Мы делаем это в цифре.
        </span>
      </div>

      <!-- Main panel -->
      <div ref="containerEl" class="mr-sl-panel">
        <canvas ref="canvasEl" class="mr-sl-canvas" />
        <div class="mr-sl-overlay" />

        <div class="mr-sl-content">

          <!-- Header bar -->
          <div
            class="mr-sl-header"
            :style="{
              background: headerBg,
              borderBottom: `1px solid rgba(${accent.r},${accent.g},${accent.b},0.2)`,
            }"
          >
            <span
              class="mr-sl-header-text"
              :style="{ color: allSelected ? accentRgb : 'rgba(255,255,255,0.85)' }"
            >
              {{ allSelected ? 'Системы активны' : 'Первый запуск' }}
            </span>
          </div>

          <!-- Body -->
          <div class="mr-sl-body">

            <!-- Toggle rows -->
            <div class="mr-sl-toggles">
              <div v-for="(pair, i) in PAIRS" :key="i">
                <!-- Label -->
                <div
                  class="mr-sl-label"
                  :style="{ marginTop: i === 0 ? '0' : undefined }"
                >
                  {{ pair.label }}
                </div>

                <div class="mr-sl-row">
                  <!-- Toggle pill -->
                  <div class="mr-sl-pill">
                    <!-- Slider -->
                    <div
                      class="mr-sl-slider"
                      :style="{
                        left: selected[i] ? 'calc(50%)' : '3px',
                        background: accentRgb,
                      }"
                    />
                    <!-- Labels -->
                    <div class="mr-sl-pill-labels">
                      <div
                        class="mr-sl-pill-half"
                        :style="{ color: selected[i] ? accentRgb : '#fff' }"
                        @click="handleToggle(i, 'left')"
                      >
                        {{ pair.left }}
                      </div>
                      <div
                        class="mr-sl-pill-half"
                        :style="{ color: selected[i] ? '#fff' : accentRgb }"
                        @click="handleToggle(i, 'right')"
                      >
                        {{ pair.right }}
                      </div>
                    </div>
                  </div>

                  <!-- Circle indicator -->
                  <div
                    class="mr-sl-circle"
                    :style="{
                      background: selected[i] ? accentRgb : 'rgb(6,6,10)',
                      border: `1px solid ${selected[i] ? `rgba(${accent.r},${accent.g},${accent.b},0.4)` : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: selected[i]
                        ? `inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 14px rgba(${accent.r},${accent.g},${accent.b},0.3)`
                        : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
                    }"
                  >
                    <div
                      class="mr-sl-dot"
                      :class="{ 'mr-sl-dot--active': selected[i] }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom button -->
            <div
              class="mr-sl-button"
              :class="{ 'mr-sl-button--active': allSelected }"
              :style="{
                background: allSelected ? '#fff' : 'rgb(6,6,10)',
                border: `${allSelected ? '1.5px' : '1px'} solid ${allSelected ? accentRgb : 'rgba(255,255,255,0.06)'}`,
                boxShadow: allSelected
                  ? `0 0 18px rgba(${accent.r},${accent.g},${accent.b},0.3)`
                  : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
              }"
              @mouseenter="launchHover = true"
              @mouseleave="launchHover = false"
              @touchstart.passive="onLaunchTouchStart"
              @touchend.passive="onLaunchTouchEnd"
              @click="allSelected && (window.location.href = '/launch-terminal')"
            >
              <!-- Shimmer when inactive -->
              <div
                v-if="!allSelected"
                class="mr-sl-shimmer"
                :style="{
                  background: `linear-gradient(90deg, transparent 0%, rgba(${accent.r},${accent.g},${accent.b},0.04) 25%, rgba(${accent.r},${accent.g},${accent.b},0.1) 50%, rgba(${accent.r},${accent.g},${accent.b},0.04) 75%, transparent 100%)`,
                }"
              />

              <!-- Active: icon + text -->
              <div v-if="allSelected" class="mr-sl-btn-inner">
                <div class="mr-sl-icon-wrap">
                  <!-- Circle overlay (visible during rotation) -->
                  <div
                    class="mr-sl-icon-circle"
                    :class="{ 'mr-sl-icon-circle--show': iconActive }"
                  >
                    <svg :width="isMobile ? 34 : 41" :height="isMobile ? 34 : 41" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="540" cy="540" r="513" fill="none" :stroke="accentRgb" stroke-width="54"/>
                    </svg>
                  </div>
                  <!-- Rocket (rotates + scales) -->
                  <div
                    class="mr-sl-icon-rocket"
                    :class="{ 'mr-sl-icon-rocket--active': iconActive }"
                  >
                    <svg :width="isMobile ? 34 : 41" :height="isMobile ? 34 : 41" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;">
                      <g transform="matrix(0.85714,0,0,0.85714,-540.0,-1695.9)">
                        <path :fill="accentRgb" d="M1259.75,1977.92C1607.39,1977.92 1889.63,2260.16 1889.63,2607.8C1889.63,2955.44 1607.39,3237.68 1259.75,3237.68C912.109,3237.68 629.87,2955.44 629.87,2607.8C629.87,2260.16 912.109,1977.92 1259.75,1977.92ZM1246.99,2040.57C1246.99,2058.13 1246.99,2084.77 1246.97,2111.29C1246.97,2165.52 1239.65,2219.5 1225.2,2271.77C1203.8,2349.26 1179.23,2462.95 1172.85,2592.61C1172.85,2592.61 1012.08,2685.26 947.925,2722.24C931.847,2731.5 921.939,2748.65 921.939,2767.2L921.939,2803C921.939,2811.56 928.341,2818.78 936.845,2819.79C991.788,2826.36 1179.81,2848.85 1179.81,2848.85C1184.4,2898.11 1190.51,2940.24 1197.31,2976.11C1197.31,2976.11 1122.21,3019.39 1091.14,3037.3C1082.96,3042.01 1077.93,3050.73 1077.93,3060.16L1077.93,3077.93L1228.75,3095.07C1229.9,3098.23 1231.04,3101.26 1232.18,3104.16C1240.97,3126.82 1245.92,3150.78 1246.84,3175.04C939.635,3168.15 692.37,2916.63 692.37,2607.8C692.37,2298.92 939.736,2047.35 1246.99,2040.57ZM1272.5,2040.57C1579.76,2047.35 1827.13,2298.92 1827.13,2607.8C1827.13,2916.63 1579.86,3168.15 1272.67,3175.04C1273.58,3150.58 1278.59,3126.43 1287.5,3103.59C1288.49,3101.06 1289.49,3098.43 1290.5,3095.7L1441.57,3077.99L1441.57,3060.22C1441.57,3050.78 1436.53,3042.07 1428.36,3037.36C1397.38,3019.51 1322.66,2976.44 1322.66,2976.44C1329.63,2940.39 1335.85,2898.08 1340.41,2848.76C1340.41,2848.76 1527.81,2826.35 1582.65,2819.79C1591.16,2818.78 1597.56,2811.56 1597.56,2803L1597.56,2767.2C1597.56,2748.65 1587.65,2731.5 1571.57,2722.24C1507.34,2685.22 1346.25,2592.38 1346.25,2592.38C1339.24,2462.86 1314.86,2349.3 1293.74,2271.86C1279.64,2220.19 1272.5,2166.88 1272.5,2113.33L1272.5,2040.57Z"/>
                      </g>
                    </svg>
                  </div>
                </div>
                <span class="mr-sl-btn-text" :style="{ color: accentRgb }">
                  Ранскейл режим
                </span>
              </div>

              <!-- Inactive: counter -->
              <span
                v-else
                class="mr-sl-counter"
                :style="{ color: accentRgb }"
              >
                {{ count }} / 3
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form link -->
      <div
        class="mr-sl-form-link"
        :class="{ 'mr-sl-form-link--hover': formHover }"
        :style="{ background: formBg }"
        @click="window.location.href = '/book-my-launch'"
        @mouseenter="formHover = true"
        @mouseleave="formHover = false"
        @touchstart.passive="onFormTouchStart"
        @touchend.passive="onFormTouchEnd"
      >
        <span class="mr-sl-form-text" :style="{ color: accentRgb }">
          Или заполнить форму
        </span>
        <span class="mr-sl-form-icon" :style="{ color: accentRgb }">
          <!-- Circle stays -->
          <svg class="mr-sl-form-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12A10 10 0 1 1 12 2"/>
          </svg>
          <!-- Arrow moves -->
          <svg
            class="mr-sl-form-svg mr-sl-form-arrow"
            :class="{ 'mr-sl-form-arrow--hover': formHover }"
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M22 2 12 12"/>
            <path d="M16 2h6v6"/>
          </svg>
        </span>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* ── Keyframes ── */
@keyframes mr-sl-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes mr-sl-pulse {
  0%, 100% { box-shadow: 0 0 14px rgba(255,136,0,0.2) !important; }
  50% { box-shadow: 0 0 28px rgba(255,136,0,0.4) !important; }
}

/* ── Root ── */
.mr-sl-root {
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
  padding-top: 90px !important;
  padding-bottom: 16px !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
  font-family: 'Inter', sans-serif !important;
}

.mr-sl-column {
  max-width: 700px !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 22px !important;
  margin-bottom: 90px !important;
}

/* ── Heading ── */
.mr-sl-heading {
  text-align: center !important;
}
.mr-sl-heading-white {
  font-size: 28px !important;
  font-weight: 500 !important;
  color: #fff !important;
  font-family: 'Inter', sans-serif !important;
  line-height: 1.35 !important;
  letter-spacing: 0.2px !important;
}
.mr-sl-heading-accent {
  font-size: 28px !important;
  font-weight: 500 !important;
  font-family: 'Inter', sans-serif !important;
  line-height: 1.35 !important;
  letter-spacing: 0.2px !important;
  transition: color 0.6s ease !important;
}

/* ── Panel ── */
.mr-sl-panel {
  position: relative !important;
  width: 100% !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 20px rgba(0,0,0,0.4) !important;
  padding: 0 !important;
}
.mr-sl-canvas {
  position: absolute !important;
  inset: 0 !important;
  pointer-events: none !important;
}
.mr-sl-overlay {
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;
  pointer-events: none !important;
  background: radial-gradient(ellipse 90% 100% at 50% 50%, rgba(6,6,10,0.55) 0%, rgba(6,6,10,0.3) 50%, rgba(6,6,10,0.08) 100%) !important;
}
.mr-sl-content {
  position: relative !important;
  z-index: 2 !important;
}

/* ── Header ── */
.mr-sl-header {
  height: 96px !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 28px !important;
  border-radius: 20px 20px 0 0 !important;
  transition: background 0.6s ease, border-color 0.8s ease !important;
}
.mr-sl-header-text {
  font-size: 18px !important;
  font-weight: 500 !important;
  font-family: 'Inter', sans-serif !important;
  transition: color 0.8s ease !important;
}

/* ── Body ── */
.mr-sl-body {
  padding: 20px 24px 24px !important;
}
.mr-sl-toggles {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
}

/* ── Label ── */
.mr-sl-label {
  font-size: 15px !important;
  font-weight: 500 !important;
  color: rgb(255,255,255) !important;
  margin-bottom: 8px !important;
  margin-top: 14px !important;
  padding-left: 4px !important;
  font-family: 'Inter', sans-serif !important;
  letter-spacing: 0.3px !important;
}
.mr-sl-label:first-child,
.mr-sl-toggles > div:first-child .mr-sl-label {
  margin-top: 0 !important;
}

/* ── Row ── */
.mr-sl-row {
  display: flex !important;
  gap: 10px !important;
  align-items: center !important;
}

/* ── Pill toggle ── */
.mr-sl-pill {
  flex: 1 !important;
  position: relative !important;
  height: 48px !important;
  border-radius: 9999px !important;
  background: rgb(6,6,10) !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03) !important;
  overflow: hidden !important;
  cursor: pointer !important;
  user-select: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
.mr-sl-slider {
  position: absolute !important;
  top: 3px !important;
  bottom: 3px !important;
  width: calc(50% - 3px) !important;
  border-radius: 9999px !important;
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.6s ease !important;
  z-index: 0 !important;
}
.mr-sl-pill-labels {
  position: relative !important;
  z-index: 1 !important;
  display: flex !important;
  height: 100% !important;
}
.mr-sl-pill-half {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  font-family: 'Inter', sans-serif !important;
  cursor: pointer !important;
  transition: color 0.4s ease !important;
}

/* ── Circle indicator ── */
.mr-sl-circle {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.5s ease !important;
}
.mr-sl-dot {
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
  background: rgb(30,32,40) !important;
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
.mr-sl-dot--active {
  width: 22px !important;
  height: 22px !important;
  background: rgba(255,255,255,0.9) !important;
  box-shadow: 0 0 8px rgba(255,255,255,0.25) !important;
}

/* ── Bottom button ── */
.mr-sl-button {
  margin-top: 18px !important;
  height: 54px !important;
  border-radius: 9999px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 22px !important;
  cursor: default !important;
  transition: background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease !important;
  position: relative !important;
  overflow: hidden !important;
}
.mr-sl-button--active {
  cursor: pointer !important;
  animation: mr-sl-pulse 2.5s ease-in-out infinite !important;
}

.mr-sl-shimmer {
  position: absolute !important;
  inset: 0 !important;
  border-radius: 9999px !important;
  background-size: 200% 100% !important;
  animation: mr-sl-shimmer 3s ease-in-out infinite !important;
  pointer-events: none !important;
}

.mr-sl-btn-inner {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}
.mr-sl-btn-text {
  font-size: 13px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  font-family: 'Inter', sans-serif !important;
}
.mr-sl-counter {
  font-family: 'Inter', sans-serif !important;
  font-size: 24px !important;
  font-weight: 800 !important;
  letter-spacing: 2px !important;
  position: relative !important;
  z-index: 1 !important;
}

/* ── Icon ── */
.mr-sl-icon-wrap {
  position: relative !important;
  width: 41px !important;
  height: 41px !important;
  flex-shrink: 0 !important;
}
.mr-sl-icon-circle {
  position: absolute !important;
  inset: 0 !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease 0.6s !important;
}
.mr-sl-icon-circle--show {
  opacity: 1 !important;
  transition: opacity 0.3s ease !important;
}
.mr-sl-icon-rocket {
  position: absolute !important;
  inset: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transform: rotate(0deg) scale(1) !important;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
  transform-origin: center center !important;
}
.mr-sl-icon-rocket--active {
  transform: rotate(90deg) scale(0.75) !important;
}

/* ── Form link ── */
.mr-sl-form-link {
  border-radius: 9999px !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 12px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1) !important;
  padding: 13px 28px !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  transition: all 0.3s ease !important;
  filter: brightness(1) !important;
}
.mr-sl-form-link--hover {
  filter: brightness(1.3) !important;
}
.mr-sl-form-text {
  font-size: 14px !important;
  font-weight: 500 !important;
  font-family: 'Inter', sans-serif !important;
  letter-spacing: 0.3px !important;
  transition: color 0.6s ease !important;
}
.mr-sl-form-icon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  width: 20px !important;
  height: 20px !important;
  transition: color 0.6s ease !important;
}
.mr-sl-form-svg {
  position: absolute !important;
  inset: 0 !important;
}
.mr-sl-form-arrow {
  transition: transform 0.3s ease !important;
  transform: translate(0, 0) !important;
}
.mr-sl-form-arrow--hover {
  transform: translate(3px, -3px) !important;
}

/* ── Mobile ── */
@media (max-width: 639px) {
  .mr-sl-root { padding-top: 56px !important; }
  .mr-sl-column { margin-bottom: 56px !important; gap: 16px !important; }
  .mr-sl-heading-white,
  .mr-sl-heading-accent { font-size: 20px !important; }
  .mr-sl-heading { padding: 0 8px !important; }
  .mr-sl-panel { border-radius: 16px !important; }
  .mr-sl-header {
    height: 80px !important;
    padding: 0 20px !important;
    border-radius: 16px 16px 0 0 !important;
  }
  .mr-sl-header-text { font-size: 15px !important; }
  .mr-sl-body { padding: 16px 14px 18px !important; }
  .mr-sl-toggles { gap: 4px !important; }
  .mr-sl-label {
    font-size: 13px !important;
    margin-bottom: 6px !important;
    margin-top: 10px !important;
  }
  .mr-sl-row { gap: 8px !important; }
  .mr-sl-pill { height: 40px !important; }
  .mr-sl-pill-half {
    font-size: 11px !important;
  }
  .mr-sl-circle {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
  }
  .mr-sl-button {
    margin-top: 14px !important;
    height: 48px !important;
    padding: 0 18px !important;
  }
  .mr-sl-btn-inner { gap: 6px !important; }
  .mr-sl-btn-text {
    font-size: 11px !important;
  }
  .mr-sl-counter { font-size: 20px !important; }
  .mr-sl-icon-wrap {
    width: 34px !important;
    height: 34px !important;
  }
  .mr-sl-form-link { padding: 12px 22px !important; }
  .mr-sl-form-text { font-size: 13px !important; }
}
</style>
