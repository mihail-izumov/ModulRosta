<template>
  <section class="mr-hero-root">
    <div class="mr-hero-glow" />

    <div ref="wrapRef" class="mr-hero-wrap">
      <!-- ЦИФРОВОЕ -->
      <div class="mr-hero-canvas-row" :style="{ height: fontSize * 1.15 + 'px' }">
        <canvas ref="canvas1Ref" class="mr-hero-canvas" />
      </div>

      <!-- ПРЕВОСХОДСТВО -->
      <div class="mr-hero-canvas-row" :style="{ height: fontSize * 1.15 + 'px', marginTop: -fontSize * 0.15 + 'px' }">
        <canvas ref="canvas2Ref" class="mr-hero-canvas" />
      </div>

      <!-- Subtitle block -->
      <div ref="subBlockRef" class="mr-hero-sub sub-block">
        <div class="mr-hero-inline-track">
          <!-- Beam text -->
          <span ref="beamTextRef" class="beam-wrap mr-hero-beam-text">
            <span
              class="tip-span"
              :class="{ hovered: hovered === 1 }"
              @click.stop="toggleTip(1)"
              @mouseenter="hovered = 1"
              @mouseleave="hovered = null"
            >Не рисуем картинки.</span>
            <span class="beam-spacer">&ensp;</span>
            <span
              class="tip-span"
              :class="{ hovered: hovered === 2 }"
              @click.stop="toggleTip(2)"
              @mouseenter="hovered = 2"
              @mouseleave="hovered = null"
            >Не делаем презентации.</span>
          </span>

          <!-- Track -->
          <div class="mr-hero-track-line">
            <span class="mr-hero-track-bg" />
            <span ref="dotRef" class="mr-hero-track-dot" />
          </div>
        </div>

        <!-- Accent -->
        <div class="mr-hero-accent">
          <strong>Строим и запускаем <span class="accent-wrap">цифровые продукты.</span></strong>
        </div>

        <!-- Tooltip — absolute, no layout shift -->
        <div class="tooltip-anchor">
          <div v-if="activeTipData" ref="tooltipRef" class="mr-hero-tooltip">
            {{ activeTipData.tip }}
            <svg ref="chevronRef" class="mr-hero-chevron" width="28" height="28" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1.23199,0,0,1.23199,-8294.3,-5100.12)">
                <path d="M6895.66,4460.27L6895.66,4367.25L7170.76,4203.17L7445.87,4369.28L7445.87,4463.27L7609.08,4560.65L7609.08,4661.64L7608.88,4661.52L7608.48,4859.02L7446.82,4762.34L7446.82,4952.95L7171.71,4793.75L6896.61,4950.91L6896.61,4761.4L6732.45,4859.02L6732.45,4658.64C6732.45,4658.64 6732.45,4557.65 6732.45,4557.65L6895.66,4460.27ZM7171.71,4696.96L6982.75,4804.41L6982.75,4710.18L7171.71,4597.82L7360.68,4710.83L7360.68,4805.79L7171.71,4696.96ZM7391.44,4531.16L7170.76,4397.91L6895.66,4561.99L6895.66,4561.27L6814.11,4609.92L6814.14,4709.48L7171.69,4497.69L7171.71,4497.69L7527.73,4711.65L7527.68,4613.08L7391.44,4531.8L7391.44,4531.16Z" fill="rgba(88,166,255,0.4)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const BLUE = { r: 88, g: 166, b: 255 }
const CELL = 10
const GAP = 2
const STEP = CELL + GAP
const FONT = '"Camera Plain Variable", "Camera Plain", ui-sans-serif, system-ui, sans-serif'

const tips = [
  { id: 1, text: 'Не рисуем картинки.', tip: 'Дизайн без инженерии мёртв. Мы проектируем логику и тягу, а не просто перекрашиваем пиксели.' },
  { id: 2, text: 'Не делаем презентации.', tip: 'Слайды не запускают. Запуск запускает. Мы строим работающий продукт, а не рассказываем о нём.' },
]

const wrapRef = ref(null)
const canvas1Ref = ref(null)
const canvas2Ref = ref(null)
const subBlockRef = ref(null)
const dotRef = ref(null)
const beamTextRef = ref(null)
const tooltipRef = ref(null)
const chevronRef = ref(null)

const activeTip = ref(null)
const hovered = ref(null)
const fontSize = ref(100)

const activeTipData = computed(() => tips.find(t => t.id === activeTip.value) || null)

function toggleTip(id) {
  activeTip.value = activeTip.value === id ? null : id
}

let pix1 = []
let pix2 = []
let animId = null
let pixelTime = 0
let mountTime = 0
let fontSizeInternal = 100

function buildPixelsForCanvas(canvas) {
  if (!canvas) return []
  const parent = canvas.parentElement
  if (!parent) return []
  const dpr = Math.min(window.devicePixelRatio, 2)
  const rect = parent.getBoundingClientRect()
  const w = Math.floor(rect.width)
  const h = Math.floor(rect.height)
  if (w < 10 || h < 10) return []
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const CW = canvas.width, CH = canvas.height
  const cols = Math.ceil(CW / STEP) + 1
  const rows = Math.ceil(CH / STEP) + 1
  const arr = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = c * STEP, y = r * STEP
      arr.push({ x, y, nx: CW > 0 ? x / CW : 0, ny: CH > 0 ? y / CH : 0, ph: Math.random() * Math.PI * 2, sp: 0.2 + Math.random() * 0.65, flk: Math.random() * 1000 })
    }
  return arr
}

function drawPixelText(canvas, pixels, text, fs, time) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const CW = canvas.width, CH = canvas.height
  if (!pixels.length || CW < 10) return
  ctx.clearRect(0, 0, CW, CH)
  const t = time
  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i]
    const breath = Math.sin(t * p.sp + p.ph) * 0.5 + 0.5
    const wave = Math.sin(t * 0.45 + p.nx * 6 + p.ny * 4) * 0.5 + 0.5
    const f1 = Math.sin(t * 4.2 + p.flk)
    const f2 = Math.sin(t * 7.5 + p.flk * 1.3)
    const fv = f1 + f2
    const flk = fv > 1.6 ? 2.2 : fv > 1.1 ? 1.5 : 1.0
    const sweep = Math.sin(t * 0.7 - p.nx * 3.5) * 0.5 + 0.5
    let a = (0.08 + breath * 0.2 + wave * 0.14 + sweep * 0.1) * flk
    if (fv > 1.5) a += 0.4
    a = Math.max(0.03, Math.min(0.95, a))
    ctx.fillStyle = `rgba(${BLUE.r},${BLUE.g},${BLUE.b},${a})`
    ctx.fillRect(p.x, p.y, CELL, CELL)
  }
  ctx.globalCompositeOperation = 'destination-in'
  const dpr = Math.min(window.devicePixelRatio, 2)
  const fsPx = fs * dpr
  ctx.font = `700 ${fsPx}px ${FONT}`
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  const m = ctx.measureText(text)
  const tw = m.width
  const asc = m.actualBoundingBoxAscent || fsPx * 0.73
  const desc = m.actualBoundingBoxDescent || fsPx * 0.1
  const textH = asc + desc
  ctx.fillText(text, (CW - tw) / 2, (CH - textH) / 2 + asc)
  ctx.globalCompositeOperation = 'source-over'
}

function measure() {
  const wrap = wrapRef.value
  if (!wrap) return
  const W = wrap.clientWidth
  if (W < 20) return
  const tmp = document.createElement('canvas').getContext('2d')
  tmp.font = `700 100px ${FONT}`
  const w1 = tmp.measureText('ЦИФРОВОЕ').width || 500
  const w2 = tmp.measureText('ПРЕВОСХОДСТВО').width || 800
  const s = Math.floor((W / Math.max(w1, w2)) * 100 * 0.96)
  fontSizeInternal = s
  fontSize.value = s
}

function buildAll() {
  pix1 = buildPixelsForCanvas(canvas1Ref.value)
  pix2 = buildPixelsForCanvas(canvas2Ref.value)
}

function draw() {
  pixelTime += 0.008 / 3
  drawPixelText(canvas1Ref.value, pix1, 'ЦИФРОВОЕ', fontSizeInternal, pixelTime)
  drawPixelText(canvas2Ref.value, pix2, 'ПРЕВОСХОДСТВО', fontSizeInternal, pixelTime)

  const isMobile = window.innerWidth <= 700
  const wavePeriod = isMobile ? 2.5 : 3.5
  const elapsed = (performance.now() - mountTime) / 1000
  const progress = (elapsed % wavePeriod) / wavePeriod
  const dotPosPercent = (1 - progress) * 100

  const dot = dotRef.value
  if (dot) {
    dot.style.left = dotPosPercent + '%'
    dot.style.opacity = String(Math.min(progress * 5, (1 - progress) * 5, 1))
    dot.style.width = isMobile ? '22%' : '12%'
  }

  const beam = beamTextRef.value
  if (beam) {
    if (isMobile) {
      beam.style.backgroundImage = `radial-gradient(circle at ${dotPosPercent}% 50%, rgba(88,166,255,1) 0%, rgba(100,175,255,0.7) 8%, rgba(140,190,255,0.38) 20%)`
    } else {
      beam.style.backgroundImage = `radial-gradient(circle at ${dotPosPercent}% 50%, rgba(88,166,255,0.95) 0%, rgba(120,180,255,0.5) 4%, rgba(140,190,255,0.35) 12%)`
    }
  }

  const g = Math.sin(progress * Math.PI)

  const tt = tooltipRef.value
  if (tt) {
    tt.style.boxShadow = `0 0 ${12+g*15}px rgba(88,166,255,${0.06+g*0.14}), 0 0 ${25+g*35}px rgba(88,166,255,${0.03+g*0.06}), inset 0 0 ${15+g*18}px rgba(88,166,255,${0.02+g*0.04}), inset 0 1px 0 rgba(88,166,255,${0.08+g*0.14})`
    tt.style.borderColor = `rgba(88,166,255,${0.1+g*0.2})`
  }

  const chev = chevronRef.value
  if (chev) {
    const path = chev.querySelector('path')
    if (path) path.setAttribute('fill', `rgba(88,166,255,${0.25+g*0.45})`)
    chev.style.filter = g > 0.1 ? `drop-shadow(0 0 ${4+g*10}px rgba(88,166,255,${g*0.5}))` : 'none'
  }

  animId = requestAnimationFrame(draw)
}

function onResize() {
  measure()
  nextTick(buildAll)
}

function onClickOutside(e) {
  if (subBlockRef.value && !subBlockRef.value.contains(e.target)) {
    activeTip.value = null
  }
}

onMounted(() => {
  measure()
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      measure()
      setTimeout(() => { measure(); buildAll() }, 120)
    })
  }
  buildAll()
  mountTime = performance.now()
  animId = requestAnimationFrame(draw)

  window.addEventListener('resize', onResize)
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('touchstart', onClickOutside)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('touchstart', onClickOutside)
})

watch(fontSize, () => {
  nextTick(buildAll)
})
</script>

<style scoped>
.mr-hero-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  overflow: hidden;
  font-family: 'Camera Plain Variable', 'Camera Plain', ui-sans-serif, system-ui, sans-serif;
  padding: 5vh 12px 15vh;
  position: relative;
}

.mr-hero-glow {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 50vh;
  background: radial-gradient(ellipse 55% 50% at 50% 50%, rgba(88,166,255,0.03) 0%, transparent 70%);
  pointer-events: none;
}

.mr-hero-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1400px;
  text-align: center;
}

.mr-hero-canvas-row {
  position: relative;
  width: 100%;
  line-height: 1;
  overflow: hidden;
}

.mr-hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mr-hero-sub {
  font-size: clamp(28px, 3.2vw, 34px);
  line-height: 1.55;
  color: rgba(255,255,255,0.35);
  max-width: 900px;
  margin: 24px auto 0;
  font-weight: 400;
  position: relative;
}

.mr-hero-inline-track {
  display: inline-block;
  text-align: center;
}

.mr-hero-beam-text {
  display: inline;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: radial-gradient(circle at 100% 50%, rgba(88,166,255,0.95) 0%, rgba(120,180,255,0.5) 4%, rgba(140,190,255,0.35) 12%);
}

.tip-span {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: -webkit-text-fill-color 0.2s, text-shadow 0.2s;
  -webkit-text-fill-color: inherit;
}

.tip-span.hovered {
  -webkit-text-fill-color: rgba(88,166,255,0.9) !important;
  text-shadow: 0 0 12px rgba(88,166,255,0.25);
}

.beam-spacer {
  display: inline-block;
  width: 0.8em;
}

.mr-hero-track-line {
  position: relative;
  height: 4px;
  margin: 0.75em 0;
  width: 100%;
}

.mr-hero-track-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255,255,255,0.04);
  border-radius: 2px;
}

.mr-hero-track-dot {
  position: absolute;
  top: 0;
  left: 100%;
  width: 12%;
  height: 4px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(88,166,255,1) 0%, rgba(88,166,255,0.5) 35%, transparent 65%);
  border-radius: 2px;
  pointer-events: none;
  opacity: 0;
}

.mr-hero-accent {
  text-align: center;
}

.mr-hero-accent strong {
  color: #fff;
  font-weight: 500;
}

.accent-wrap {
  display: inline;
}

.tooltip-anchor {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.tooltip-anchor > * {
  pointer-events: auto;
}

.mr-hero-tooltip {
  background: rgba(8,12,24,0.5);
  backdrop-filter: blur(28px) saturate(1.5);
  -webkit-backdrop-filter: blur(28px) saturate(1.5);
  color: rgba(255,255,255,0.8);
  padding: 20px 28px;
  border-radius: 14px;
  font-size: 16px;
  line-height: 1.7;
  width: min(480px, 90vw);
  text-align: center;
  border: 1px solid rgba(88,166,255,0.12);
  z-index: 100;
}

.mr-hero-chevron {
  display: block;
  margin: 14px auto 0;
}

/* ═══ Mobile ═══ */
@media (max-width: 700px) {
  .sub-block {
    font-size: clamp(20px, 5.5vw, 28px) !important;
    max-width: 100% !important;
    margin-top: 16px !important;
  }
  .beam-wrap {
    display: block !important;
  }
  .beam-wrap .tip-span {
    display: block !important;
    text-align: center !important;
  }
  .beam-spacer {
    display: none !important;
  }
  .accent-wrap {
    display: block !important;
  }
  .tooltip-anchor {
    margin-top: 1.5em !important;
  }
}
</style>
