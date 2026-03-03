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

// R&D dial computed
const rndDasharray = computed(() => {
  const circumference = 2 * Math.PI * 63
  if (phase.value === 'countdown') {
    return `${(snakeProgress.value / 100) * circumference} ${circumference}`
  }
  return `${(fillProgress.value / 100) * circumference} ${circumference}`
})

// Dock positions
const dockPositions = [
  { x: 96, y: 56 },
  { x: 130.6, y: 76 },
  { x: 130.6, y: 116 },
  { x: 96, y: 136 },
  { x: 61.4, y: 116 },
  { x: 61.4, y: 76 }
]
</script>

<template>
  <div class="instrument-panel">
    <!-- ЗАГОЛОВОК -->
    <h1 class="main-title">R&D запуски</h1>
    
    <!-- DESKTOP VERSION -->
    <div v-if="!isMobile" class="desktop-layout">
      <!-- RAG DIAL -->
      <div class="dial-container">
        <div class="dial dial-192">
          <div class="dial-inner-border"></div>
          <svg class="dial-svg" viewBox="0 0 192 192">
            <!-- Axes -->
            <line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
            <line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
            
            <!-- Orbit 1 -->
            <g class="orbit-cw" style="--duration: 18s">
              <circle cx="96" cy="21" r="4" fill="#00ff88" class="pulse-dot"/>
              <circle cx="161" cy="133" r="4" fill="#00ff88" class="pulse-dot" style="animation-delay: 1s"/>
              <circle cx="31" cy="133" r="4" fill="#00ff88" class="pulse-dot" style="animation-delay: 2s"/>
            </g>
            <!-- Orbit 2 -->
            <g class="orbit-ccw" style="--duration: 15s">
              <circle cx="96" cy="31" r="3.5" fill="#00ff88"/>
              <circle cx="152" cy="128" r="3.5" fill="#00ff88"/>
              <circle cx="40" cy="128" r="3.5" fill="#00ff88"/>
            </g>
            <!-- Orbit 3 -->
            <g class="orbit-cw" style="--duration: 12s">
              <circle cx="96" cy="40" r="3" fill="#00ff88"/>
              <circle cx="144" cy="124" r="3" fill="#00ff88"/>
              <circle cx="48" cy="124" r="3" fill="#00ff88"/>
            </g>
            <!-- Orbit 4 -->
            <g class="orbit-ccw" style="--duration: 9s">
              <circle cx="96" cy="50" r="2.5" fill="#00ff88"/>
              <circle cx="136" cy="119" r="2.5" fill="#00ff88"/>
              <circle cx="56" cy="119" r="2.5" fill="#00ff88"/>
            </g>
            <!-- Orbit 5 -->
            <g class="orbit-cw" style="--duration: 7s">
              <circle cx="96" cy="58" r="2" fill="#00ff88"/>
              <circle cx="129" cy="115" r="2" fill="#00ff88"/>
              <circle cx="63" cy="115" r="2" fill="#00ff88"/>
            </g>
            <!-- Orbit 6 -->
            <g class="orbit-ccw" style="--duration: 5s">
              <circle cx="96" cy="66" r="1.5" fill="#00ff88" opacity="0.7"/>
              <circle cx="122" cy="111" r="1.5" fill="#00ff88" opacity="0.7"/>
              <circle cx="70" cy="111" r="1.5" fill="#00ff88" opacity="0.7"/>
            </g>
            <!-- Orbit 7 -->
            <g class="orbit-cw" style="--duration: 3.5s">
              <circle cx="96" cy="74" r="1.5" fill="#00ff88" opacity="0.5"/>
              <circle cx="115" cy="107" r="1.5" fill="#00ff88" opacity="0.5"/>
              <circle cx="77" cy="107" r="1.5" fill="#00ff88" opacity="0.5"/>
            </g>
            
            <!-- Center -->
            <circle cx="96" cy="96" r="6" fill="#00ff88" class="center-glow"/>
          </svg>
        </div>
        <span class="label-text">RAG<br/>аналитика</span>
      </div>
      
      <!-- R&D DIAL -->
      <div class="dial-container">
        <div class="dial dial-192">
          <div class="dial-inner-border"></div>
          <svg class="dial-svg" viewBox="0 0 192 192">
            <line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <circle cx="96" cy="96" r="63" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/>
            <circle 
              cx="96" cy="96" r="63" 
              fill="none" 
              stroke="#00ff88" 
              stroke-width="8" 
              stroke-linecap="round"
              :stroke-dasharray="rndDasharray"
              transform="rotate(-90 96 96)"
              class="progress-ring"
            />
          </svg>
          <div class="dial-center-content">
            <template v-if="phase === 'countdown'">
              <span class="countdown-number">{{ countdown }}</span>
              <span class="countdown-label">дней</span>
            </template>
            <span v-else class="poehali-text" :class="{ visible: showPoehali }">ПОЕХАЛИ!</span>
          </div>
        </div>
        <span class="label-text">R&D<br/>циклы</span>
      </div>
      
      <!-- DOCK DIAL -->
      <div class="dial-container">
        <div class="dial dial-192">
          <div class="dial-inner-border"></div>
          <svg class="dial-svg" viewBox="0 0 192 192">
            <line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            <line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
            
            <!-- Lines to center -->
            <line v-for="(pos, i) in dockPositions" :key="'lc'+i" 
              x1="96" y1="96" :x2="pos.x" :y2="pos.y" 
              stroke="#00ff88" stroke-width="2.5" 
              :class="'line-to-center-' + i"/>
            
            <!-- Lines between -->
            <line v-for="(pos, i) in dockPositions" :key="'lb'+i"
              :x1="pos.x" :y1="pos.y" 
              :x2="dockPositions[(i + 1) % 6].x" :y2="dockPositions[(i + 1) % 6].y"
              stroke="#00ff88" stroke-width="2" 
              class="line-between"/>
          </svg>
          
          <!-- Modules -->
          <div v-for="i in 6" :key="'m'+i" class="dock-module" :class="'capture-' + (i-1)"></div>
          
          <!-- Center -->
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
            <div class="dial dial-200">
              <div class="dial-inner-border"></div>
              <svg class="dial-svg" viewBox="0 0 200 200">
                <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
                <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
                
                <g class="orbit-cw" style="--duration: 18s">
                  <circle cx="100" cy="22" r="4" fill="#00ff88" class="pulse-dot"/>
                  <circle cx="168" cy="139" r="4" fill="#00ff88" class="pulse-dot"/>
                  <circle cx="32" cy="139" r="4" fill="#00ff88" class="pulse-dot"/>
                </g>
                <g class="orbit-ccw" style="--duration: 15s">
                  <circle cx="100" cy="32" r="3.5" fill="#00ff88"/>
                  <circle cx="159" cy="134" r="3.5" fill="#00ff88"/>
                  <circle cx="41" cy="134" r="3.5" fill="#00ff88"/>
                </g>
                <g class="orbit-cw" style="--duration: 12s">
                  <circle cx="100" cy="42" r="3" fill="#00ff88"/>
                  <circle cx="150" cy="129" r="3" fill="#00ff88"/>
                  <circle cx="50" cy="129" r="3" fill="#00ff88"/>
                </g>
                <g class="orbit-ccw" style="--duration: 9s">
                  <circle cx="100" cy="52" r="2.5" fill="#00ff88"/>
                  <circle cx="142" cy="124" r="2.5" fill="#00ff88"/>
                  <circle cx="58" cy="124" r="2.5" fill="#00ff88"/>
                </g>
                <g class="orbit-cw" style="--duration: 7s">
                  <circle cx="100" cy="62" r="2" fill="#00ff88"/>
                  <circle cx="133" cy="119" r="2" fill="#00ff88"/>
                  <circle cx="67" cy="119" r="2" fill="#00ff88"/>
                </g>
                <g class="orbit-ccw" style="--duration: 5s">
                  <circle cx="100" cy="72" r="1.5" fill="#00ff88" opacity="0.7"/>
                  <circle cx="124" cy="114" r="1.5" fill="#00ff88" opacity="0.7"/>
                  <circle cx="76" cy="114" r="1.5" fill="#00ff88" opacity="0.7"/>
                </g>
                <g class="orbit-cw" style="--duration: 3.5s">
                  <circle cx="100" cy="80" r="1.5" fill="#00ff88" opacity="0.5"/>
                  <circle cx="117" cy="110" r="1.5" fill="#00ff88" opacity="0.5"/>
                  <circle cx="83" cy="110" r="1.5" fill="#00ff88" opacity="0.5"/>
                </g>
                
                <circle cx="100" cy="100" r="6" fill="#00ff88" class="center-glow"/>
              </svg>
            </div>
            <span class="label-text-mobile">RAG<br/>аналитика</span>
          </div>
          
          <!-- Mobile R&D -->
          <div class="dial-container-mobile">
            <div class="dial dial-200">
              <div class="dial-inner-border"></div>
              <svg class="dial-svg" viewBox="0 0 200 200">
                <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/>
                <circle 
                  cx="100" cy="100" r="70" 
                  fill="none" 
                  stroke="#00ff88" 
                  stroke-width="8" 
                  stroke-linecap="round"
                  :stroke-dasharray="`${(phase === 'countdown' ? snakeProgress : fillProgress) / 100 * 440} 440`"
                  transform="rotate(-90 100 100)"
                  class="progress-ring"
                />
              </svg>
              <div class="dial-center-content">
                <template v-if="phase === 'countdown'">
                  <span class="countdown-number countdown-mobile">{{ countdown }}</span>
                  <span class="countdown-label">дней</span>
                </template>
                <span v-else class="poehali-text poehali-mobile" :class="{ visible: showPoehali }">ПОЕХАЛИ!</span>
              </div>
            </div>
            <span class="label-text-mobile">R&D<br/>циклы</span>
          </div>
          
          <!-- Mobile Dock -->
          <div class="dial-container-mobile">
            <div class="dial dial-200">
              <div class="dial-inner-border"></div>
              <svg class="dial-svg" viewBox="0 0 200 200">
                <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.15)" stroke-width="1"/>
                
                <line x1="100" y1="100" x2="100" y2="58" stroke="#00ff88" stroke-width="2.5" class="line-to-center-0"/>
                <line x1="100" y1="100" x2="136" y2="79" stroke="#00ff88" stroke-width="2.5" class="line-to-center-1"/>
                <line x1="100" y1="100" x2="136" y2="121" stroke="#00ff88" stroke-width="2.5" class="line-to-center-2"/>
                <line x1="100" y1="100" x2="100" y2="142" stroke="#00ff88" stroke-width="2.5" class="line-to-center-3"/>
                <line x1="100" y1="100" x2="64" y2="121" stroke="#00ff88" stroke-width="2.5" class="line-to-center-4"/>
                <line x1="100" y1="100" x2="64" y2="79" stroke="#00ff88" stroke-width="2.5" class="line-to-center-5"/>
                
                <line x1="100" y1="58" x2="136" y2="79" stroke="#00ff88" stroke-width="2" class="line-between"/>
                <line x1="136" y1="79" x2="136" y2="121" stroke="#00ff88" stroke-width="2" class="line-between"/>
                <line x1="136" y1="121" x2="100" y2="142" stroke="#00ff88" stroke-width="2" class="line-between"/>
                <line x1="100" y1="142" x2="64" y2="121" stroke="#00ff88" stroke-width="2" class="line-between"/>
                <line x1="64" y1="121" x2="64" y2="79" stroke="#00ff88" stroke-width="2" class="line-between"/>
                <line x1="64" y1="79" x2="100" y2="58" stroke="#00ff88" stroke-width="2" class="line-between"/>
              </svg>
              
              <div v-for="i in 6" :key="'mm'+i" class="dock-module dock-module-mobile" :class="'capture-' + (i-1)"></div>
              <div class="dock-center dock-center-mobile"></div>
            </div>
            <span class="label-text-mobile">Стыковка<br/>модулей</span>
          </div>
        </div>
      </div>
      
      <!-- SLIDER INDICATOR -->
      <div class="slider-indicator">
        <svg width="180" height="50" viewBox="0 0 180 50" class="indicator-svg">
          <!-- Background arcs -->
          <path d="M 20 25 Q 90 5 160 25" fill="none" stroke="rgba(0,255,136,0.15)" stroke-width="1.5"/>
          <path d="M 20 25 Q 90 45 160 25" fill="none" stroke="rgba(0,255,136,0.15)" stroke-width="1.5"/>
          
          <!-- Animated arcs -->
          <path v-if="currentIndex === 2" d="M 20 25 Q 90 5 160 25" fill="none" stroke="#00ff88" stroke-width="1" stroke-dasharray="5 10" class="data-stream-back"/>
          <path v-if="currentIndex !== 2" d="M 20 25 Q 90 45 160 25" fill="none" stroke="#00ff88" stroke-width="1" stroke-dasharray="5 10" class="data-stream-fwd"/>
          
          <!-- Center line -->
          <line x1="20" y1="25" x2="160" y2="25" stroke="rgba(0,255,136,0.2)" stroke-width="1.5"/>
          
          <!-- Connection segments -->
          <line x1="30" y1="25" x2="84" y2="25" stroke="#00ff88" :stroke-width="currentIndex <= 1 ? 1.5 : 0.5" :opacity="currentIndex <= 1 ? 0.7 : 0.2" class="segment-line"/>
          <line x1="96" y1="25" x2="150" y2="25" stroke="#00ff88" :stroke-width="currentIndex >= 1 ? 1.5 : 0.5" :opacity="currentIndex >= 1 ? 0.7 : 0.2" class="segment-line"/>
          
          <!-- Nodes -->
          <g v-for="i in 3" :key="'node'+i" @click="goToSlide(i - 1)" class="node-group">
            <!-- Pulse ring -->
            <circle v-if="currentIndex === i - 1" :cx="20 + (i - 1) * 70" cy="25" r="16" fill="none" stroke="#00ff88" stroke-width="1" class="pulse-ring"/>
            
            <!-- Orbiting dot -->
            <circle v-if="currentIndex === i - 1" cx="0" cy="0" r="2" fill="#00ff88" class="orbiting-dot" :style="`--cx: ${20 + (i - 1) * 70}px`"/>
            
            <!-- Main node -->
            <circle :cx="20 + (i - 1) * 70" cy="25" :r="currentIndex === i - 1 ? 10 : 6" :fill="currentIndex === i - 1 ? '#00ff88' : 'black'" stroke="#00ff88" :stroke-width="currentIndex === i - 1 ? 2 : 1.5" :class="{ 'node-active': currentIndex === i - 1 }" class="node-circle"/>
            
            <!-- Inner circle -->
            <circle v-if="currentIndex === i - 1" :cx="20 + (i - 1) * 70" cy="25" r="4" fill="black"/>
            <circle v-else :cx="20 + (i - 1) * 70" cy="25" r="2" fill="#00ff88" opacity="0.5"/>
          </g>
        </svg>
        
        <div class="slider-hint">
          <svg width="12" height="8" viewBox="0 0 12 8"><path d="M 4 4 L 8 0.5 M 4 4 L 8 7.5" stroke="#00ff88" stroke-width="1.5" fill="none" opacity="0.5"/></svg>
          <span>переключить</span>
          <svg width="12" height="8" viewBox="0 0 12 8"><path d="M 8 4 L 4 0.5 M 8 4 L 4 7.5" stroke="#00ff88" stroke-width="1.5" fill="none" opacity="0.5"/></svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
/* Global animations - NOT scoped */
@keyframes spin-cw {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-ccw {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
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

@keyframes pulse-ring-anim {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.2; }
}

@keyframes data-stream-fwd {
  0% { stroke-dashoffset: 40; }
  100% { stroke-dashoffset: 0; }
}

@keyframes data-stream-back {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 40; }
}

@keyframes orbit-around {
  from { transform: rotate(0deg) translateX(18px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

.instrument-panel {
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
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
  margin-bottom: 64px;
  margin-top: 0;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 28px;
    letter-spacing: 2px;
    margin-bottom: 32px;
  }
  .instrument-panel {
    padding: 16px;
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
  box-shadow: inset 0 0 40px rgba(0,255,136,0.15), inset 0 0 70px rgba(0,255,136,0.08), 0 0 30px rgba(0,255,136,0.2), 0 0 60px rgba(0,255,136,0.1);
}

.dial-192 {
  width: 192px;
  height: 192px;
}

.dial-200 {
  width: 200px;
  height: 200px;
}

.dial-inner-border {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.5);
  pointer-events: none;
}

.dial-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Orbit animations */
.orbit-cw {
  transform-origin: center;
  animation: spin-cw var(--duration, 10s) linear infinite;
}

.orbit-ccw {
  transform-origin: center;
  animation: spin-ccw var(--duration, 10s) linear infinite;
}

.pulse-dot {
  animation: dot-pulse 3s ease-in-out infinite;
}

.center-glow {
  filter: drop-shadow(0 0 10px #00ff88);
}

.progress-ring {
  filter: drop-shadow(0 0 6px #00ff88);
}

/* Dock animations */
.dock-module {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
}

.dock-module-mobile {
  width: 16px;
  height: 16px;
}

.capture-0 { animation: capture-0 12s ease-out infinite; }
.capture-1 { animation: capture-1 12s ease-out infinite; }
.capture-2 { animation: capture-2 12s ease-out infinite; }
.capture-3 { animation: capture-3 12s ease-out infinite; }
.capture-4 { animation: capture-4 12s ease-out infinite; }
.capture-5 { animation: capture-5 12s ease-out infinite; }

.line-to-center-0 { animation: line-to-center-0 12s ease-out infinite; }
.line-to-center-1 { animation: line-to-center-1 12s ease-out infinite; }
.line-to-center-2 { animation: line-to-center-2 12s ease-out infinite; }
.line-to-center-3 { animation: line-to-center-3 12s ease-out infinite; }
.line-to-center-4 { animation: line-to-center-4 12s ease-out infinite; }
.line-to-center-5 { animation: line-to-center-5 12s ease-out infinite; }

.line-between { animation: line-between 12s ease-out infinite; }

.dock-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: black;
  border: 3px solid #00ff88;
  box-shadow: 0 0 12px #00ff88, inset 0 0 8px rgba(0,255,136,0.3);
  animation: core-absorb 12s ease-out infinite;
}

.dock-center-mobile {
  width: 28px;
  height: 28px;
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
  font-size: 58px;
  color: #00ff88;
  text-shadow: 0 0 15px rgba(0,255,136,0.6);
  line-height: 1;
}

.countdown-mobile {
  font-size: 60px;
}

.countdown-label {
  font-family: 'Orbitron', monospace;
  font-size: 13px;
  color: #00ff88;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
}

.poehali-text {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 23px;
  color: #00ff88;
  text-shadow: 0 0 15px rgba(0,255,136,0.6);
  text-align: center;
  opacity: 0;
  transition: opacity 1s ease-out;
}

.poehali-text.visible {
  opacity: 1;
}

.poehali-mobile {
  font-size: 24px;
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
  height: 300px;
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
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.indicator-svg {
  overflow: visible;
}

.data-stream-fwd {
  animation: data-stream-fwd 2s linear infinite;
}

.data-stream-back {
  animation: data-stream-back 2s linear infinite;
}

.pulse-ring {
  animation: pulse-ring-anim 2s ease-in-out infinite;
  transform-origin: center;
}

.orbiting-dot {
  transform-origin: var(--cx, 90px) 25px;
  animation: orbit-around 3s linear infinite;
}

.node-group {
  cursor: pointer;
}

.node-circle {
  transition: all 0.3s ease;
}

.node-active {
  filter: drop-shadow(0 0 12px #00ff88);
}

.segment-line {
  transition: all 0.3s ease;
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
</style>
