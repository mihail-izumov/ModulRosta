<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const countdown = ref(60)
const snakeProgress = ref(100)
const phase = ref('countdown')
const fillProgress = ref(0)
const showPoehali = ref(false)

const isMobile = ref(false)
const currentIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const translateX = ref(0)

const dialWidth = 260
const gap = 30
const totalWidth = dialWidth + gap

const greenColor = '#00ff88'

const iconContainerStyle = {
  boxShadow: 'inset 0 0 40px rgba(0,255,136,0.15), inset 0 0 70px rgba(0,255,136,0.08), 0 0 30px rgba(0,255,136,0.2), 0 0 60px rgba(0,255,136,0.1)'
}

let interval = null

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  interval = setInterval(() => {
    if (phase.value === 'countdown') {
      const newVal = snakeProgress.value - (100 / 240)
      if (newVal <= 0) {
        phase.value = 'complete'
        snakeProgress.value = 0
      } else {
        snakeProgress.value = newVal
        countdown.value = Math.ceil((newVal / 100) * 60)
      }
    } else if (phase.value === 'complete') {
      setTimeout(() => { showPoehali.value = true }, 100)
      setTimeout(() => { phase.value = 'fill' }, 2000)
    } else if (phase.value === 'fill') {
      if (fillProgress.value >= 100) {
        setTimeout(() => {
          phase.value = 'countdown'
          snakeProgress.value = 100
          fillProgress.value = 0
          countdown.value = 60
          showPoehali.value = false
        }, 1000)
      } else {
        fillProgress.value += 2.5
      }
    }
  }, 25)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (interval) clearInterval(interval)
})

const handleStart = (clientX) => {
  if (!isMobile.value) return
  isDragging.value = true
  startX.value = clientX - translateX.value
}

const handleMove = (clientX) => {
  if (!isDragging.value || !isMobile.value) return
  const newTranslate = clientX - startX.value
  translateX.value = Math.max(-(totalWidth * 2), Math.min(0, newTranslate))
}

const handleEnd = () => {
  if (!isDragging.value || !isMobile.value) return
  isDragging.value = false
  const index = Math.round(-translateX.value / totalWidth)
  const snappedIndex = Math.max(0, Math.min(2, index))
  currentIndex.value = snappedIndex
  translateX.value = -snappedIndex * totalWidth
}

const goToSlide = (index) => {
  currentIndex.value = index
  translateX.value = -index * totalWidth
}

const sliderStyle = computed(() => ({
  left: '50%',
  gap: `${gap}px`,
  transform: `translateX(calc(-${dialWidth/2}px + ${translateX.value}px))`,
  transition: isDragging.value ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
}))

// Dial calculations
const getDialParams = (size) => {
  const inset = size * 0.05
  const innerSize = size - inset * 2
  const center = size / 2
  const trackRadius = size * 0.35
  const circumference = 2 * Math.PI * trackRadius
  const hexRadius = size * 0.21
  
  const positions = [
    { x: center, y: center - hexRadius },
    { x: center + hexRadius * 0.866, y: center - hexRadius * 0.5 },
    { x: center + hexRadius * 0.866, y: center + hexRadius * 0.5 },
    { x: center, y: center + hexRadius },
    { x: center - hexRadius * 0.866, y: center + hexRadius * 0.5 },
    { x: center - hexRadius * 0.866, y: center - hexRadius * 0.5 },
  ]
  
  return { inset, innerSize, center, trackRadius, circumference, hexRadius, positions }
}

const desktopParams = getDialParams(192)
const mobileParams = getDialParams(200)
</script>

<template>
  <div class="instrument-panel">
    <!-- ЗАГОЛОВОК -->
    <h1 class="main-title">R&D запуски</h1>
    
    <!-- DESKTOP VERSION -->
    <div v-if="!isMobile" class="desktop-layout">
      <!-- RAG DIAL -->
      <div class="dial-container">
        <div class="dial" :style="{ ...iconContainerStyle, width: '192px', height: '192px' }">
          <div class="dial-inner-border" :style="{ inset: `${desktopParams.inset}px` }"></div>
          <svg class="dial-axes" :style="{ inset: `${desktopParams.inset}px`, width: `${desktopParams.innerSize}px`, height: `${desktopParams.innerSize}px` }" :viewBox="`0 0 ${desktopParams.innerSize} ${desktopParams.innerSize}`">
            <line :x1="0" :y1="desktopParams.innerSize/2" :x2="desktopParams.innerSize" :y2="desktopParams.innerSize/2" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
            <line :x1="desktopParams.innerSize/2" :y1="0" :x2="desktopParams.innerSize/2" :y2="desktopParams.innerSize" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
          </svg>
          <svg class="dial-content" viewBox="0 0 192 192">
            <g v-for="(orbit, oi) in 7" :key="oi" :style="{ animation: `${oi % 2 === 0 ? 'spin' : 'spin-reverse'} ${18 - oi * 2}s linear infinite`, transformOrigin: '96px 96px' }">
              <circle v-for="di in 3" :key="di" :cx="96" :cy="192 * (0.11 + oi * 0.04)" :r="4 - oi * 0.4" :fill="greenColor" :opacity="1 - oi * 0.07"/>
              <circle v-for="di in 3" :key="'r' + di" :cx="192 * (0.84 - oi * 0.03)" :cy="192 * (0.695 - oi * 0.02)" :r="4 - oi * 0.4" :fill="greenColor" :opacity="1 - oi * 0.07"/>
              <circle v-for="di in 3" :key="'l' + di" :cx="192 * (0.16 + oi * 0.03)" :cy="192 * (0.695 - oi * 0.02)" :r="4 - oi * 0.4" :fill="greenColor" :opacity="1 - oi * 0.07"/>
            </g>
            <circle cx="96" cy="96" r="6" :fill="greenColor" :style="{ filter: `drop-shadow(0 0 10px ${greenColor})` }"/>
          </svg>
        </div>
        <span class="label-text">RAG<br/>аналитика</span>
      </div>
      
      <!-- R&D DIAL -->
      <div class="dial-container">
        <div class="dial" :style="{ ...iconContainerStyle, width: '192px', height: '192px' }">
          <div class="dial-inner-border" :style="{ inset: `${desktopParams.inset}px` }"></div>
          <svg class="dial-axes" :style="{ inset: `${desktopParams.inset}px`, width: `${desktopParams.innerSize}px`, height: `${desktopParams.innerSize}px` }" :viewBox="`0 0 ${desktopParams.innerSize} ${desktopParams.innerSize}`">
            <line :x1="0" :y1="desktopParams.innerSize/2" :x2="desktopParams.innerSize" :y2="desktopParams.innerSize/2" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <line :x1="desktopParams.innerSize/2" :y1="0" :x2="desktopParams.innerSize/2" :y2="desktopParams.innerSize" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <circle :cx="desktopParams.innerSize/2" :cy="desktopParams.innerSize/2" :r="desktopParams.trackRadius" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/>
            <circle v-if="phase === 'countdown'" :cx="desktopParams.innerSize/2" :cy="desktopParams.innerSize/2" :r="desktopParams.trackRadius" fill="none" :stroke="greenColor" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${(snakeProgress / 100) * desktopParams.circumference} ${desktopParams.circumference}`" :transform="`rotate(-90 ${desktopParams.innerSize/2} ${desktopParams.innerSize/2})`" :style="{ filter: `drop-shadow(0 0 6px ${greenColor})` }"/>
            <circle v-if="phase === 'complete' || phase === 'fill'" :cx="desktopParams.innerSize/2" :cy="desktopParams.innerSize/2" :r="desktopParams.trackRadius" fill="none" :stroke="greenColor" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${(fillProgress / 100) * desktopParams.circumference} ${desktopParams.circumference}`" :transform="`rotate(-90 ${desktopParams.innerSize/2} ${desktopParams.innerSize/2})`" :style="{ filter: `drop-shadow(0 0 8px ${greenColor})` }"/>
          </svg>
          <div class="dial-center-content">
            <template v-if="phase === 'countdown'">
              <span class="countdown-number" :style="{ fontSize: '57.6px' }">{{ countdown }}</span>
              <span class="countdown-label" :style="{ fontSize: '13.44px' }">дней</span>
            </template>
            <span v-if="phase === 'complete' || phase === 'fill'" class="poehali-text" :style="{ opacity: showPoehali ? 1 : 0, fontSize: '23px' }">ПОЕХАЛИ!</span>
          </div>
        </div>
        <span class="label-text">R&D<br/>циклы</span>
      </div>
      
      <!-- DOCK DIAL -->
      <div class="dial-container">
        <div class="dial" :style="{ ...iconContainerStyle, width: '192px', height: '192px' }">
          <div class="dial-inner-border" :style="{ inset: `${desktopParams.inset}px` }"></div>
          <svg class="dial-content" viewBox="0 0 192 192">
            <line :x1="desktopParams.inset" :y1="96" :x2="192 - desktopParams.inset" :y2="96" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <line :x1="96" :y1="desktopParams.inset" :x2="96" :y2="192 - desktopParams.inset" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <line v-for="(pos, i) in desktopParams.positions" :key="'c' + i" x1="96" y1="96" :x2="pos.x" :y2="pos.y" :stroke="greenColor" stroke-width="2.5" :style="{ animation: `line-to-center-${i} 12s ease-out infinite` }"/>
            <line v-for="(pos, i) in desktopParams.positions" :key="'b' + i" :x1="pos.x" :y1="pos.y" :x2="desktopParams.positions[(i + 1) % 6].x" :y2="desktopParams.positions[(i + 1) % 6].y" :stroke="greenColor" stroke-width="2" style="animation: line-between 12s ease-out infinite"/>
          </svg>
          <div v-for="i in 6" :key="i" class="dock-module" :style="{ width: '15.36px', height: '15.36px', animation: `capture-${i - 1} 12s ease-out infinite` }"></div>
          <div class="dock-center"></div>
        </div>
        <span class="label-text">Стыковка<br/>модулей</span>
      </div>
    </div>
    
    <!-- MOBILE VERSION -->
    <template v-if="isMobile">
      <div 
        class="slider-container"
        @mousedown="handleStart($event.clientX)"
        @mousemove="handleMove($event.clientX)"
        @mouseup="handleEnd"
        @mouseleave="handleEnd"
        @touchstart="handleStart($event.touches[0].clientX)"
        @touchmove="handleMove($event.touches[0].clientX)"
        @touchend="handleEnd"
      >
        <div class="slider-track" :style="sliderStyle">
          <!-- Mobile RAG -->
          <div class="dial-container-mobile">
            <div class="dial" :style="{ ...iconContainerStyle, width: '200px', height: '200px' }">
              <div class="dial-inner-border" :style="{ inset: `${mobileParams.inset}px` }"></div>
              <svg class="dial-axes" :style="{ inset: `${mobileParams.inset}px`, width: `${mobileParams.innerSize}px`, height: `${mobileParams.innerSize}px` }" :viewBox="`0 0 ${mobileParams.innerSize} ${mobileParams.innerSize}`">
                <line :x1="0" :y1="mobileParams.innerSize/2" :x2="mobileParams.innerSize" :y2="mobileParams.innerSize/2" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
                <line :x1="mobileParams.innerSize/2" :y1="0" :x2="mobileParams.innerSize/2" :y2="mobileParams.innerSize" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
              </svg>
              <svg class="dial-content" viewBox="0 0 200 200">
                <g v-for="(orbit, oi) in 7" :key="oi" :style="{ animation: `${oi % 2 === 0 ? 'spin' : 'spin-reverse'} ${18 - oi * 2}s linear infinite`, transformOrigin: '100px 100px' }">
                  <circle :cx="100" :cy="200 * (0.11 + oi * 0.04)" :r="4 - oi * 0.4" :fill="greenColor" :opacity="1 - oi * 0.07"/>
                  <circle :cx="200 * (0.84 - oi * 0.03)" :cy="200 * (0.695 - oi * 0.02)" :r="4 - oi * 0.4" :fill="greenColor" :opacity="1 - oi * 0.07"/>
                  <circle :cx="200 * (0.16 + oi * 0.03)" :cy="200 * (0.695 - oi * 0.02)" :r="4 - oi * 0.4" :fill="greenColor" :opacity="1 - oi * 0.07"/>
                </g>
                <circle cx="100" cy="100" r="6" :fill="greenColor" :style="{ filter: `drop-shadow(0 0 10px ${greenColor})` }"/>
              </svg>
            </div>
            <span class="label-text-mobile">RAG<br/>аналитика</span>
          </div>
          
          <!-- Mobile R&D -->
          <div class="dial-container-mobile">
            <div class="dial" :style="{ ...iconContainerStyle, width: '200px', height: '200px' }">
              <div class="dial-inner-border" :style="{ inset: `${mobileParams.inset}px` }"></div>
              <svg class="dial-axes" :style="{ inset: `${mobileParams.inset}px`, width: `${mobileParams.innerSize}px`, height: `${mobileParams.innerSize}px` }" :viewBox="`0 0 ${mobileParams.innerSize} ${mobileParams.innerSize}`">
                <line :x1="0" :y1="mobileParams.innerSize/2" :x2="mobileParams.innerSize" :y2="mobileParams.innerSize/2" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <line :x1="mobileParams.innerSize/2" :y1="0" :x2="mobileParams.innerSize/2" :y2="mobileParams.innerSize" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <circle :cx="mobileParams.innerSize/2" :cy="mobileParams.innerSize/2" :r="mobileParams.trackRadius" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/>
                <circle v-if="phase === 'countdown'" :cx="mobileParams.innerSize/2" :cy="mobileParams.innerSize/2" :r="mobileParams.trackRadius" fill="none" :stroke="greenColor" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${(snakeProgress / 100) * mobileParams.circumference} ${mobileParams.circumference}`" :transform="`rotate(-90 ${mobileParams.innerSize/2} ${mobileParams.innerSize/2})`" :style="{ filter: `drop-shadow(0 0 6px ${greenColor})` }"/>
                <circle v-if="phase === 'complete' || phase === 'fill'" :cx="mobileParams.innerSize/2" :cy="mobileParams.innerSize/2" :r="mobileParams.trackRadius" fill="none" :stroke="greenColor" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${(fillProgress / 100) * mobileParams.circumference} ${mobileParams.circumference}`" :transform="`rotate(-90 ${mobileParams.innerSize/2} ${mobileParams.innerSize/2})`" :style="{ filter: `drop-shadow(0 0 8px ${greenColor})` }"/>
              </svg>
              <div class="dial-center-content">
                <template v-if="phase === 'countdown'">
                  <span class="countdown-number" :style="{ fontSize: '60px' }">{{ countdown }}</span>
                  <span class="countdown-label" :style="{ fontSize: '14px' }">дней</span>
                </template>
                <span v-if="phase === 'complete' || phase === 'fill'" class="poehali-text" :style="{ opacity: showPoehali ? 1 : 0, fontSize: '24px' }">ПОЕХАЛИ!</span>
              </div>
            </div>
            <span class="label-text-mobile">R&D<br/>циклы</span>
          </div>
          
          <!-- Mobile Dock -->
          <div class="dial-container-mobile">
            <div class="dial" :style="{ ...iconContainerStyle, width: '200px', height: '200px' }">
              <div class="dial-inner-border" :style="{ inset: `${mobileParams.inset}px` }"></div>
              <svg class="dial-content" viewBox="0 0 200 200">
                <line :x1="mobileParams.inset" :y1="100" :x2="200 - mobileParams.inset" :y2="100" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <line :x1="100" :y1="mobileParams.inset" :x2="100" :y2="200 - mobileParams.inset" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <line v-for="(pos, i) in mobileParams.positions" :key="'c' + i" x1="100" y1="100" :x2="pos.x" :y2="pos.y" :stroke="greenColor" stroke-width="2.5" :style="{ animation: `line-to-center-${i} 12s ease-out infinite` }"/>
                <line v-for="(pos, i) in mobileParams.positions" :key="'b' + i" :x1="pos.x" :y1="pos.y" :x2="mobileParams.positions[(i + 1) % 6].x" :y2="mobileParams.positions[(i + 1) % 6].y" :stroke="greenColor" stroke-width="2" style="animation: line-between 12s ease-out infinite"/>
              </svg>
              <div v-for="i in 6" :key="i" class="dock-module" :style="{ width: '16px', height: '16px', animation: `capture-${i - 1} 12s ease-out infinite` }"></div>
              <div class="dock-center-mobile"></div>
            </div>
            <span class="label-text-mobile">Стыковка<br/>модулей</span>
          </div>
        </div>
      </div>
      
      <!-- SLIDER INDICATOR -->
      <div class="slider-indicator">
        <svg width="180" height="50" viewBox="0 0 180 50" style="overflow: visible">
          <path d="M 20 25 Q 90 5 160 25" fill="none" stroke="rgba(0,255,136,0.15)" stroke-width="1.5"/>
          <path v-if="currentIndex === 2" d="M 20 25 Q 90 5 160 25" fill="none" :stroke="greenColor" stroke-width="1" stroke-dasharray="5 10" style="animation: data-stream-backward 2s linear infinite"/>
          <path d="M 20 25 Q 90 45 160 25" fill="none" stroke="rgba(0,255,136,0.15)" stroke-width="1.5"/>
          <path v-if="currentIndex !== 2" d="M 20 25 Q 90 45 160 25" fill="none" :stroke="greenColor" stroke-width="1" stroke-dasharray="5 10" style="animation: data-stream-forward 2s linear infinite"/>
          <line x1="20" y1="25" x2="160" y2="25" stroke="rgba(0,255,136,0.2)" stroke-width="1.5"/>
          <g v-for="i in 3" :key="i" @click="goToSlide(i - 1)" style="cursor: pointer">
            <circle v-if="currentIndex === i - 1" :cx="20 + (i - 1) * 70" cy="25" r="16" fill="none" :stroke="greenColor" stroke-width="1" style="animation: pulse-ring 2s ease-in-out infinite"/>
            <circle v-if="currentIndex === i - 1" r="2" :fill="greenColor">
              <animateMotion dur="3s" repeatCount="indefinite" :path="`M ${20 + (i - 1) * 70} 7 A 18 18 0 1 1 ${20 + (i - 1) * 70 - 0.01} 7`"/>
            </circle>
            <circle :cx="20 + (i - 1) * 70" cy="25" :r="currentIndex === i - 1 ? 10 : 6" :fill="currentIndex === i - 1 ? greenColor : 'black'" :stroke="greenColor" :stroke-width="currentIndex === i - 1 ? 2 : 1.5" :style="{ filter: currentIndex === i - 1 ? `drop-shadow(0 0 12px ${greenColor})` : 'none', transition: 'all 0.3s ease' }"/>
            <circle v-if="currentIndex === i - 1" :cx="20 + (i - 1) * 70" cy="25" r="4" fill="black"/>
            <circle v-if="currentIndex !== i - 1" :cx="20 + (i - 1) * 70" cy="25" r="2" :fill="greenColor" opacity="0.5"/>
          </g>
          <line x1="30" y1="25" x2="84" y2="25" :stroke="greenColor" :stroke-width="currentIndex <= 1 ? 1.5 : 0.5" :opacity="currentIndex <= 1 ? 0.7 : 0.2" style="transition: all 0.3s ease"/>
          <line x1="96" y1="25" x2="150" y2="25" :stroke="greenColor" :stroke-width="currentIndex >= 1 ? 1.5 : 0.5" :opacity="currentIndex >= 1 ? 0.7 : 0.2" style="transition: all 0.3s ease"/>
        </svg>
        <div class="slider-hint">
          <svg width="12" height="8" viewBox="0 0 12 8"><path d="M 8 4 L 4 0.5 M 8 4 L 4 7.5" :stroke="greenColor" stroke-width="1.5" fill="none" opacity="0.5" transform="scale(-1, 1) translate(-12, 0)"/></svg>
          <span>переключить</span>
          <svg width="12" height="8" viewBox="0 0 12 8"><path d="M 8 4 L 4 0.5 M 8 4 L 4 7.5" :stroke="greenColor" stroke-width="1.5" fill="none" opacity="0.5"/></svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

.instrument-panel {
  min-height: 100vh;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  overflow: hidden;
}

.main-title {
  font-family: monospace;
  font-size: 64px;
  font-weight: 700;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.6), 0 0 80px rgba(0,255,136,0.4), 0 0 120px rgba(0,255,136,0.3);
  margin-bottom: 48px;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
    letter-spacing: 2px;
    margin-bottom: 24px;
  }
}

.desktop-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 64px;
}

.dial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dial-container-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 260px;
}

.dial {
  position: relative;
  border-radius: 50%;
  border: 1px solid rgba(16, 185, 129, 0.3);
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dial-inner-border {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.5);
}

.dial-axes {
  position: absolute;
}

.dial-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.dial-center-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.countdown-number {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  color: #00ff88;
  text-shadow: 0 0 15px rgba(0,255,136,0.6);
  line-height: 1;
}

.countdown-label {
  font-family: 'Orbitron', monospace;
  color: #00ff88;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
}

.poehali-text {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  color: #00ff88;
  text-shadow: 0 0 15px rgba(0,255,136,0.6);
  text-align: center;
  transition: opacity 1s ease-out;
}

.dock-module {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
}

.dock-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26.88px;
  height: 26.88px;
  border-radius: 50%;
  background: black;
  border: 3px solid #00ff88;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 0 12px #00ff88, inset 0 0 8px rgba(0,255,136,0.3);
  animation: core-absorb 12s ease-out infinite;
}

.dock-center-mobile {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: black;
  border: 3px solid #00ff88;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 0 12px #00ff88, inset 0 0 8px rgba(0,255,136,0.3);
  animation: core-absorb 12s ease-out infinite;
}

.label-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  line-height: 1.5;
  margin-top: 24px;
}

.label-text-mobile {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  line-height: 1.4;
  margin-top: 16px;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 320px;
  max-width: 100vw;
  overflow: visible;
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
}

.slider-container:active {
  cursor: grabbing;
}

.slider-track {
  display: flex;
  align-items: flex-start;
  position: absolute;
}

.slider-indicator {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.slider-hint span {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  color: rgba(0,255,136,0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Animations */
@keyframes dot-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes capture-0 {
  0%, 5% { transform: translate(-50%, -50%) translate(0, -70px) scale(0.3); opacity: 0; }
  10%, 65% { transform: translate(-50%, -50%) translate(0, -40px) scale(1); opacity: 1; }
  75%, 90% { transform: translate(-50%, -50%) translate(0, -10px) scale(0.6); opacity: 0.8; }
  95%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
}

@keyframes capture-1 {
  0%, 12% { transform: translate(-50%, -50%) translate(61px, -35px) scale(0.3); opacity: 0; }
  17%, 65% { transform: translate(-50%, -50%) translate(35px, -20px) scale(1); opacity: 1; }
  75%, 90% { transform: translate(-50%, -50%) translate(9px, -5px) scale(0.6); opacity: 0.8; }
  95%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
}

@keyframes capture-2 {
  0%, 22% { transform: translate(-50%, -50%) translate(61px, 35px) scale(0.3); opacity: 0; }
  27%, 65% { transform: translate(-50%, -50%) translate(35px, 20px) scale(1); opacity: 1; }
  75%, 90% { transform: translate(-50%, -50%) translate(9px, 5px) scale(0.6); opacity: 0.8; }
  95%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
}

@keyframes capture-3 {
  0%, 32% { transform: translate(-50%, -50%) translate(0, 70px) scale(0.3); opacity: 0; }
  37%, 65% { transform: translate(-50%, -50%) translate(0, 40px) scale(1); opacity: 1; }
  75%, 90% { transform: translate(-50%, -50%) translate(0, 10px) scale(0.6); opacity: 0.8; }
  95%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
}

@keyframes capture-4 {
  0%, 42% { transform: translate(-50%, -50%) translate(-61px, 35px) scale(0.3); opacity: 0; }
  47%, 65% { transform: translate(-50%, -50%) translate(-35px, 20px) scale(1); opacity: 1; }
  75%, 90% { transform: translate(-50%, -50%) translate(-9px, 5px) scale(0.6); opacity: 0.8; }
  95%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
}

@keyframes capture-5 {
  0%, 52% { transform: translate(-50%, -50%) translate(-61px, -35px) scale(0.3); opacity: 0; }
  57%, 65% { transform: translate(-50%, -50%) translate(-35px, -20px) scale(1); opacity: 1; }
  75%, 90% { transform: translate(-50%, -50%) translate(-9px, -5px) scale(0.6); opacity: 0.8; }
  95%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
}

@keyframes line-to-center-0 { 0%, 12% { opacity: 0; } 17%, 70% { opacity: 1; } 80%, 100% { opacity: 0; } }
@keyframes line-to-center-1 { 0%, 19% { opacity: 0; } 24%, 70% { opacity: 1; } 80%, 100% { opacity: 0; } }
@keyframes line-to-center-2 { 0%, 29% { opacity: 0; } 34%, 70% { opacity: 1; } 80%, 100% { opacity: 0; } }
@keyframes line-to-center-3 { 0%, 39% { opacity: 0; } 44%, 70% { opacity: 1; } 80%, 100% { opacity: 0; } }
@keyframes line-to-center-4 { 0%, 49% { opacity: 0; } 54%, 70% { opacity: 1; } 80%, 100% { opacity: 0; } }
@keyframes line-to-center-5 { 0%, 59% { opacity: 0; } 64%, 70% { opacity: 1; } 80%, 100% { opacity: 0; } }

@keyframes line-between {
  0%, 66% { opacity: 0; }
  72%, 75% { opacity: 0.8; }
  85%, 100% { opacity: 0; }
}

@keyframes core-absorb {
  0%, 70% { transform: translate(-50%, -50%) scale(1); }
  85% { transform: translate(-50%, -50%) scale(1.5); }
  95%, 100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.2; }
}

@keyframes data-stream-forward {
  0% { stroke-dashoffset: 40; }
  100% { stroke-dashoffset: 0; }
}

@keyframes data-stream-backward {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 40; }
}
</style>
