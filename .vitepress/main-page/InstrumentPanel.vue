<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ModalVidim from './instrument-panel/ModalVidim.vue'
import ModalZapuskaem from './instrument-panel/ModalZapuskaem.vue'
import ModalRasshiryaem from './instrument-panel/ModalRasshiryaem.vue'

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
const activeModal = ref(null)

const dialWidth = 260
const gap = 30
const totalWidth = dialWidth + gap
let interval = null

const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

const openModal = (id) => { activeModal.value = id; document.body.style.overflow = 'hidden' }
const closeModal = () => { activeModal.value = null; document.body.style.overflow = '' }
const handleEscape = (e) => { if (e.key === 'Escape' && activeModal.value) closeModal() }

/* Per-node color for mobile nav */
const nc = ['#58a6ff', '#00ff88', '#ff8800']
const nodeColor = (i) => nc[i]

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', handleEscape)
  interval = setInterval(() => {
    if (phase.value === 'countdown') {
      const n = snakeProgress.value - (100 / 240)
      if (n <= 0) { phase.value = 'complete'; snakeProgress.value = 0 }
      else { snakeProgress.value = n; countdown.value = Math.ceil((n / 100) * 60) }
    } else if (phase.value === 'complete') {
      setTimeout(() => { showPoehali.value = true }, 100)
      setTimeout(() => { phase.value = 'fill' }, 2000)
    } else if (phase.value === 'fill') {
      if (fillProgress.value >= 100) {
        setTimeout(() => { phase.value = 'countdown'; snakeProgress.value = 100; fillProgress.value = 0; countdown.value = 60; showPoehali.value = false }, 1000)
      } else { fillProgress.value += 2.5 }
    }
  }, 25)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', handleEscape)
  if (interval) clearInterval(interval)
})

const handleStart = (x) => { if (!isMobile.value) return; isDragging.value = true; startX.value = x - translateX.value }
const handleMove = (x) => { if (!isDragging.value || !isMobile.value) return; translateX.value = Math.max(-(totalWidth * 2), Math.min(0, x - startX.value)) }
const handleEnd = () => { if (!isDragging.value || !isMobile.value) return; isDragging.value = false; const i = Math.max(0, Math.min(2, Math.round(-translateX.value / totalWidth))); currentIndex.value = i; translateX.value = -i * totalWidth }
const goToSlide = (i) => { currentIndex.value = i; translateX.value = -i * totalWidth }

const sliderStyle = computed(() => ({ left: '50%', gap: gap + 'px', transform: 'translateX(calc(-130px + ' + translateX.value + 'px))', transition: isDragging.value ? 'none' : 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }))
const rndDash = computed(() => { const c = 2 * Math.PI * 63; return phase.value === 'countdown' ? (snakeProgress.value / 100) * c + ' ' + c : (fillProgress.value / 100) * c + ' ' + c })
const dP = [{ x: 96, y: 56 }, { x: 130.6, y: 76 }, { x: 130.6, y: 116 }, { x: 96, y: 136 }, { x: 61.4, y: 116 }, { x: 61.4, y: 76 }]
const nX = [20, 90, 160]
</script>

<template>
<div class="mr-ip">
  <h1 class="mr-ip-tt">От проблемы<br/>до работающей системы.</h1>
  <p class="mr-ip-sub">Одна команда. Полный цикл.</p>

  <!-- ══════ DESKTOP ══════ -->
  <div v-if="!isMobile" class="mr-ip-dk">

    <!-- ВИДИМ — синий #58a6ff -->
    <div class="mr-ip-dc">
      <div class="mr-ip-dl mr-ip-d1 mr-ip-dl-v"><div class="mr-ip-db mr-ip-db-v"></div><svg class="mr-ip-ds" viewBox="0 0 192 192"><line x1="10" y1="96" x2="182" y2="96" stroke="rgba(88,166,255,0.2)" stroke-width="1"/><line x1="96" y1="10" x2="96" y2="182" stroke="rgba(88,166,255,0.2)" stroke-width="1"/><g class="mr-ip-oc" style="--d:18s"><circle cx="96" cy="21" r="4" fill="#58a6ff" class="mr-ip-pd"/><circle cx="161" cy="133" r="4" fill="#58a6ff" class="mr-ip-pd"/><circle cx="31" cy="133" r="4" fill="#58a6ff" class="mr-ip-pd"/></g><g class="mr-ip-occ" style="--d:15s"><circle cx="96" cy="31" r="3.5" fill="#58a6ff"/><circle cx="152" cy="128" r="3.5" fill="#58a6ff"/><circle cx="40" cy="128" r="3.5" fill="#58a6ff"/></g><g class="mr-ip-oc" style="--d:12s"><circle cx="96" cy="40" r="3" fill="#58a6ff"/><circle cx="144" cy="124" r="3" fill="#58a6ff"/><circle cx="48" cy="124" r="3" fill="#58a6ff"/></g><g class="mr-ip-occ" style="--d:9s"><circle cx="96" cy="50" r="2.5" fill="#58a6ff"/><circle cx="136" cy="119" r="2.5" fill="#58a6ff"/><circle cx="56" cy="119" r="2.5" fill="#58a6ff"/></g><g class="mr-ip-oc" style="--d:7s"><circle cx="96" cy="58" r="2" fill="#58a6ff"/><circle cx="129" cy="115" r="2" fill="#58a6ff"/><circle cx="63" cy="115" r="2" fill="#58a6ff"/></g><g class="mr-ip-occ" style="--d:5s"><circle cx="96" cy="66" r="1.5" fill="#58a6ff" opacity="0.7"/><circle cx="122" cy="111" r="1.5" fill="#58a6ff" opacity="0.7"/><circle cx="70" cy="111" r="1.5" fill="#58a6ff" opacity="0.7"/></g><g class="mr-ip-oc" style="--d:3.5s"><circle cx="96" cy="74" r="1.5" fill="#58a6ff" opacity="0.5"/><circle cx="115" cy="107" r="1.5" fill="#58a6ff" opacity="0.5"/><circle cx="77" cy="107" r="1.5" fill="#58a6ff" opacity="0.5"/></g><circle cx="96" cy="96" r="6" fill="#58a6ff" class="mr-ip-cg mr-ip-cg-v"/></svg></div>
      <span class="mr-ip-lt mr-ip-lt-v">Видим</span>
      <button class="mr-ip-mb mr-ip-mb-v" @click.stop="openModal('vidim')">Узнать</button>
    </div>

    <!-- ЗАПУСКАЕМ — зелёный #00ff88 -->
    <div class="mr-ip-dc">
      <div class="mr-ip-dl mr-ip-d1"><div class="mr-ip-db"></div><svg class="mr-ip-ds" viewBox="0 0 192 192"><line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><circle cx="96" cy="96" r="63" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/><circle cx="96" cy="96" r="63" fill="none" stroke="#00ff88" stroke-width="8" stroke-linecap="round" :stroke-dasharray="rndDash" transform="rotate(-90 96 96)" class="mr-ip-pr"/></svg><div class="mr-ip-dcc"><template v-if="phase==='countdown'"><span class="mr-ip-cn">{{countdown}}</span><span class="mr-ip-cl">дней</span></template><span v-else class="mr-ip-pt" :class="{'mr-ip-vis':showPoehali}">ПОЕХАЛИ!</span></div></div>
      <span class="mr-ip-lt">Запускаем</span>
      <button class="mr-ip-mb" @click.stop="openModal('zapuskaem')">Узнать</button>
    </div>

    <!-- РАСШИРЯЕМ — amber #ff8800 -->
    <div class="mr-ip-dc">
      <div class="mr-ip-dl mr-ip-d1 mr-ip-dl-a"><div class="mr-ip-db mr-ip-db-a"></div><svg class="mr-ip-ds" viewBox="0 0 192 192"><line x1="10" y1="96" x2="182" y2="96" stroke="rgba(255,136,0,0.15)" stroke-width="1"/><line x1="96" y1="10" x2="96" y2="182" stroke="rgba(255,136,0,0.15)" stroke-width="1"/><line v-for="(p,i) in dP" :key="'c'+i" x1="96" y1="96" :x2="p.x" :y2="p.y" stroke="#ff8800" stroke-width="2.5" :class="'mr-ip-lc'+i"/><line v-for="(p,i) in dP" :key="'b'+i" :x1="p.x" :y1="p.y" :x2="dP[(i+1)%6].x" :y2="dP[(i+1)%6].y" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/></svg><div v-for="i in 6" :key="'m'+i" class="mr-ip-dm mr-ip-dm-a" :class="'mr-ip-cp'+(i-1)"></div><div class="mr-ip-dkc mr-ip-dkc-a"></div></div>
      <span class="mr-ip-lt mr-ip-lt-a">Расширяем</span>
      <button class="mr-ip-mb mr-ip-mb-a" @click.stop="openModal('rasshiryaem')">Узнать</button>
    </div>
  </div>

  <!-- ══════ MOBILE ══════ -->
  <template v-if="isMobile">
    <div class="mr-ip-sc" @mousedown="handleStart($event.clientX)" @mousemove="handleMove($event.clientX)" @mouseup="handleEnd" @mouseleave="handleEnd" @touchstart="handleStart($event.touches[0].clientX)" @touchmove="handleMove($event.touches[0].clientX)" @touchend="handleEnd">
      <div class="mr-ip-st" :style="sliderStyle">

        <!-- ВИДИМ mobile — синий -->
        <div class="mr-ip-dcm">
          <div class="mr-ip-dl mr-ip-d2 mr-ip-dl-v"><div class="mr-ip-db mr-ip-db-v"></div><svg class="mr-ip-ds" viewBox="0 0 200 200"><line x1="10" y1="100" x2="190" y2="100" stroke="rgba(88,166,255,0.2)" stroke-width="1"/><line x1="100" y1="10" x2="100" y2="190" stroke="rgba(88,166,255,0.2)" stroke-width="1"/><g class="mr-ip-oc" style="--d:18s"><circle cx="100" cy="22" r="4" fill="#58a6ff" class="mr-ip-pd"/><circle cx="168" cy="139" r="4" fill="#58a6ff" class="mr-ip-pd"/><circle cx="32" cy="139" r="4" fill="#58a6ff" class="mr-ip-pd"/></g><g class="mr-ip-occ" style="--d:15s"><circle cx="100" cy="32" r="3.5" fill="#58a6ff"/><circle cx="159" cy="134" r="3.5" fill="#58a6ff"/><circle cx="41" cy="134" r="3.5" fill="#58a6ff"/></g><g class="mr-ip-oc" style="--d:12s"><circle cx="100" cy="42" r="3" fill="#58a6ff"/><circle cx="150" cy="129" r="3" fill="#58a6ff"/><circle cx="50" cy="129" r="3" fill="#58a6ff"/></g><g class="mr-ip-occ" style="--d:9s"><circle cx="100" cy="52" r="2.5" fill="#58a6ff"/><circle cx="142" cy="124" r="2.5" fill="#58a6ff"/><circle cx="58" cy="124" r="2.5" fill="#58a6ff"/></g><g class="mr-ip-oc" style="--d:7s"><circle cx="100" cy="62" r="2" fill="#58a6ff"/><circle cx="133" cy="119" r="2" fill="#58a6ff"/><circle cx="67" cy="119" r="2" fill="#58a6ff"/></g><g class="mr-ip-occ" style="--d:5s"><circle cx="100" cy="72" r="1.5" fill="#58a6ff" opacity="0.7"/><circle cx="124" cy="114" r="1.5" fill="#58a6ff" opacity="0.7"/><circle cx="76" cy="114" r="1.5" fill="#58a6ff" opacity="0.7"/></g><g class="mr-ip-oc" style="--d:3.5s"><circle cx="100" cy="80" r="1.5" fill="#58a6ff" opacity="0.5"/><circle cx="117" cy="110" r="1.5" fill="#58a6ff" opacity="0.5"/><circle cx="83" cy="110" r="1.5" fill="#58a6ff" opacity="0.5"/></g><circle cx="100" cy="100" r="6" fill="#58a6ff" class="mr-ip-cg mr-ip-cg-v"/></svg></div>
          <span class="mr-ip-ltm mr-ip-lt-v">Видим</span>
          <button class="mr-ip-mb mr-ip-mbm mr-ip-mb-v" @click.stop="openModal('vidim')">Узнать</button>
        </div>

        <!-- ЗАПУСКАЕМ mobile — зелёный -->
        <div class="mr-ip-dcm">
          <div class="mr-ip-dl mr-ip-d2"><div class="mr-ip-db"></div><svg class="mr-ip-ds" viewBox="0 0 200 200"><line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><circle cx="100" cy="100" r="70" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/><circle cx="100" cy="100" r="70" fill="none" stroke="#00ff88" stroke-width="8" stroke-linecap="round" :stroke-dasharray="(phase==='countdown'?snakeProgress:fillProgress)/100*440+' 440'" transform="rotate(-90 100 100)" class="mr-ip-pr"/></svg><div class="mr-ip-dcc"><template v-if="phase==='countdown'"><span class="mr-ip-cn mr-ip-cnm">{{countdown}}</span><span class="mr-ip-cl mr-ip-clm">дней</span></template><span v-else class="mr-ip-pt mr-ip-ptm" :class="{'mr-ip-vis':showPoehali}">ПОЕХАЛИ!</span></div></div>
          <span class="mr-ip-ltm">Запускаем</span>
          <button class="mr-ip-mb mr-ip-mbm" @click.stop="openModal('zapuskaem')">Узнать</button>
        </div>

        <!-- РАСШИРЯЕМ mobile — amber -->
        <div class="mr-ip-dcm">
          <div class="mr-ip-dl mr-ip-d2 mr-ip-dl-a"><div class="mr-ip-db mr-ip-db-a"></div><svg class="mr-ip-ds" viewBox="0 0 200 200"><line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,136,0,0.15)" stroke-width="1"/><line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,136,0,0.15)" stroke-width="1"/><line x1="100" y1="100" x2="100" y2="58" stroke="#ff8800" stroke-width="2.5" class="mr-ip-lc0"/><line x1="100" y1="100" x2="136" y2="79" stroke="#ff8800" stroke-width="2.5" class="mr-ip-lc1"/><line x1="100" y1="100" x2="136" y2="121" stroke="#ff8800" stroke-width="2.5" class="mr-ip-lc2"/><line x1="100" y1="100" x2="100" y2="142" stroke="#ff8800" stroke-width="2.5" class="mr-ip-lc3"/><line x1="100" y1="100" x2="64" y2="121" stroke="#ff8800" stroke-width="2.5" class="mr-ip-lc4"/><line x1="100" y1="100" x2="64" y2="79" stroke="#ff8800" stroke-width="2.5" class="mr-ip-lc5"/><line x1="100" y1="58" x2="136" y2="79" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/><line x1="136" y1="79" x2="136" y2="121" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/><line x1="136" y1="121" x2="100" y2="142" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/><line x1="100" y1="142" x2="64" y2="121" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/><line x1="64" y1="121" x2="64" y2="79" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/><line x1="64" y1="79" x2="100" y2="58" stroke="#ff8800" stroke-width="2" class="mr-ip-lb"/></svg><div v-for="i in 6" :key="'mm'+i" class="mr-ip-dm mr-ip-dmm mr-ip-dm-a" :class="'mr-ip-cp'+(i-1)"></div><div class="mr-ip-dkc mr-ip-dkcm mr-ip-dkc-a"></div></div>
          <span class="mr-ip-ltm mr-ip-lt-a">Расширяем</span>
          <button class="mr-ip-mb mr-ip-mbm mr-ip-mb-a" @click.stop="openModal('rasshiryaem')">Узнать</button>
        </div>
      </div>
    </div>

    <!-- Mobile nav — per-node colors -->
    <div class="mr-ip-si">
      <svg width="180" height="50" viewBox="0 0 180 50" style="overflow:visible">
        <path d="M 20 25 Q 90 5 160 25" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
        <path d="M 20 25 Q 90 45 160 25" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
        <path v-if="currentIndex===2" d="M 20 25 Q 90 5 160 25" fill="none" :stroke="nodeColor(currentIndex)" stroke-width="1" stroke-dasharray="5 10" class="mr-ip-dsb"/>
        <path v-if="currentIndex!==2" d="M 20 25 Q 90 45 160 25" fill="none" :stroke="nodeColor(currentIndex)" stroke-width="1" stroke-dasharray="5 10" class="mr-ip-dsf"/>
        <line x1="20" y1="25" x2="160" y2="25" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
        <line x1="20" y1="25" x2="90" y2="25" :stroke="currentIndex<=1?nodeColor(currentIndex):'rgba(255,255,255,0.15)'" :stroke-width="currentIndex<=1?1.5:0.5" :opacity="currentIndex<=1?0.7:0.2" class="mr-ip-sl"/>
        <line x1="90" y1="25" x2="160" y2="25" :stroke="currentIndex>=1?nodeColor(currentIndex):'rgba(255,255,255,0.15)'" :stroke-width="currentIndex>=1?1.5:0.5" :opacity="currentIndex>=1?0.7:0.2" class="mr-ip-sl"/>
        <g v-for="(x,i) in nX" :key="'node'+i" @click="goToSlide(i)" style="cursor:pointer">
          <circle v-if="currentIndex===i" :cx="x" cy="25" r="16" fill="none" :stroke="nodeColor(i)" stroke-width="1" class="mr-ip-pra"/>
          <g v-if="currentIndex===i" :transform="'translate('+x+',25)'"><g class="mr-ip-orb"><circle cx="15" cy="0" r="2" :fill="nodeColor(i)"/></g></g>
          <circle :cx="x" cy="25" :r="currentIndex===i?10:6" :fill="currentIndex===i?nodeColor(i):'black'" :stroke="nodeColor(i)" :stroke-width="currentIndex===i?2:1.5" :class="{'mr-ip-na':currentIndex===i}" class="mr-ip-nc" :style="currentIndex===i?'filter:drop-shadow(0 0 12px '+nodeColor(i)+')':''"/>
          <circle v-if="currentIndex===i" :cx="x" cy="25" r="4" fill="black"/>
          <circle v-else :cx="x" cy="25" r="2" :fill="nodeColor(i)" opacity="0.5"/>
        </g>
      </svg>
      <div class="mr-ip-sh"><svg width="12" height="8" viewBox="0 0 12 8"><path d="M 4 4 L 8 0.5 M 4 4 L 8 7.5" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none" opacity="0.5"/></svg><span>переключить</span><svg width="12" height="8" viewBox="0 0 12 8"><path d="M 8 4 L 4 0.5 M 8 4 L 4 7.5" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none" opacity="0.5"/></svg></div>
    </div>
  </template>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="mr-ip-fade">
    <div v-if="activeModal" class="mr-ip-overlay" @click.self="closeModal">
      <Transition name="mr-ip-slide" appear>
      <div class="mr-ip-modal" :key="activeModal">
        <button class="mr-ip-close" @click="closeModal" aria-label="Закрыть">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div class="mr-ip-modal-body">
          <ModalVidim v-if="activeModal === 'vidim'" />
          <ModalZapuskaem v-else-if="activeModal === 'zapuskaem'" />
          <ModalRasshiryaem v-else-if="activeModal === 'rasshiryaem'" />
        </div>
      </div>
      </Transition>
    </div>
    </Transition>
  </Teleport>
</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
@import './instrument-panel/modal-content.css';
/* === Prefixed keyframes (mripa- = mr-ip animation). Global by necessity, but namespaced. === */
@keyframes mripa-scw{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes mripa-sccw{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@keyframes mripa-dp{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes mripa-c0{0%,5%{transform:translate(-50%,-50%) translate(0,-70px) scale(.3);opacity:0}10%,65%{transform:translate(-50%,-50%) translate(0,-40px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(0,-10px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes mripa-c1{0%,12%{transform:translate(-50%,-50%) translate(61px,-35px) scale(.3);opacity:0}17%,65%{transform:translate(-50%,-50%) translate(35px,-20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(9px,-5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes mripa-c2{0%,22%{transform:translate(-50%,-50%) translate(61px,35px) scale(.3);opacity:0}27%,65%{transform:translate(-50%,-50%) translate(35px,20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(9px,5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes mripa-c3{0%,32%{transform:translate(-50%,-50%) translate(0,70px) scale(.3);opacity:0}37%,65%{transform:translate(-50%,-50%) translate(0,40px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(0,10px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes mripa-c4{0%,42%{transform:translate(-50%,-50%) translate(-61px,35px) scale(.3);opacity:0}47%,65%{transform:translate(-50%,-50%) translate(-35px,20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(-9px,5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes mripa-c5{0%,52%{transform:translate(-50%,-50%) translate(-61px,-35px) scale(.3);opacity:0}57%,65%{transform:translate(-50%,-50%) translate(-35px,-20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(-9px,-5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes mripa-l0{0%,12%{opacity:0}17%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes mripa-l1{0%,19%{opacity:0}24%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes mripa-l2{0%,29%{opacity:0}34%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes mripa-l3{0%,39%{opacity:0}44%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes mripa-l4{0%,49%{opacity:0}54%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes mripa-l5{0%,59%{opacity:0}64%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes mripa-lba{0%,66%{opacity:0}72%,75%{opacity:.8}85%,100%{opacity:0}}
@keyframes mripa-ca{0%,70%{transform:translate(-50%,-50%) scale(1)}85%{transform:translate(-50%,-50%) scale(1.5)}95%,100%{transform:translate(-50%,-50%) scale(1)}}
@keyframes mripa-pran{0%,100%{opacity:.4}50%{opacity:.2}}
@keyframes mripa-dsfa{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
@keyframes mripa-dsba{0%{stroke-dashoffset:0}100%{stroke-dashoffset:40}}
@keyframes mripa-orbAnim{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
</style>

<style scoped>
/* === All classes prefixed with mr-ip- to avoid global collisions === */
/* Hard-reset for the counter span: defensive against any global rule that targets short class names. */
.mr-ip .mr-ip-cn,
.mr-ip .mr-ip-cl,
.mr-ip .mr-ip-pt{display:block !important;visibility:visible !important;opacity:1 !important}

.mr-ip{background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:15px 32px 24px;overflow:visible}
.mr-ip-tt{font-family:'Inter',sans-serif;font-size:52px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:4px;text-shadow:0 0 8px rgba(255,255,255,.2);margin-bottom:16px;margin-top:15px;text-align:center;line-height:1.2}
.mr-ip-sub{font-family:'Inter',sans-serif;font-size:34px;font-weight:400;color:#777;text-align:center;margin:0 0 56px;letter-spacing:1px;line-height:1.3}
@media(max-width:768px){.mr-ip-tt{font-size:24px;letter-spacing:2px;margin-bottom:12px}.mr-ip-sub{font-size:18px;margin-bottom:36px}.mr-ip{padding:39px 16px 16px}}
.mr-ip-dk{display:flex;align-items:flex-start;justify-content:center;gap:64px;overflow:visible}
.mr-ip-dc{display:flex;flex-direction:column;align-items:center;overflow:visible}
.mr-ip-dcm{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:260px;overflow:visible}

/* ── Dial base (green default = ЗАПУСКАЕМ) ── */
.mr-ip-dl{position:relative;border-radius:50%;border:1px solid rgba(16,185,129,.3);background:#000;display:flex;align-items:center;justify-content:center;overflow:visible;box-shadow:inset 0 0 40px rgba(0,255,136,.15),inset 0 0 70px rgba(0,255,136,.08),0 0 30px rgba(0,255,136,.2),0 0 60px rgba(0,255,136,.1)}
.mr-ip-d1{width:192px;height:192px}.mr-ip-d2{width:200px;height:200px}
.mr-ip-db{position:absolute;inset:10px;border-radius:50%;border:2px solid rgba(16,185,129,.5);pointer-events:none}

/* Dial — ВИДИМ blue */
.mr-ip-dl-v{border-color:rgba(88,166,255,.3);box-shadow:inset 0 0 40px rgba(88,166,255,.15),inset 0 0 70px rgba(88,166,255,.08),0 0 30px rgba(88,166,255,.2),0 0 60px rgba(88,166,255,.1)}
.mr-ip-db-v{border-color:rgba(88,166,255,.5)}

/* Dial — РАСШИРЯЕМ amber */
.mr-ip-dl-a{border-color:rgba(255,136,0,.3);box-shadow:inset 0 0 40px rgba(255,136,0,.15),inset 0 0 70px rgba(255,136,0,.08),0 0 30px rgba(255,136,0,.2),0 0 60px rgba(255,136,0,.1)}
.mr-ip-db-a{border-color:rgba(255,136,0,.5)}

.mr-ip-ds{position:absolute;inset:0;width:100%;height:100%}
.mr-ip-oc{transform-origin:center;animation:mripa-scw var(--d,10s) linear infinite}
.mr-ip-occ{transform-origin:center;animation:mripa-sccw var(--d,10s) linear infinite}
.mr-ip-pd{animation:mripa-dp 3s ease-in-out infinite}

/* Center glow — variants */
.mr-ip-cg{filter:drop-shadow(0 0 10px #00ff88)}
.mr-ip-cg-v{filter:drop-shadow(0 0 10px #58a6ff)}

.mr-ip-pr{filter:drop-shadow(0 0 6px #00ff88)}

/* Module dots (РАСШИРЯЕМ) — green default */
.mr-ip-dm{position:absolute;top:50%;left:50%;width:16px;height:16px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88}
.mr-ip-dmm{width:16px;height:16px}
/* Module dots — amber */
.mr-ip-dm-a{background:#ff8800;box-shadow:0 0 8px #ff8800}

.mr-ip-cp0{animation:mripa-c0 12s ease-out infinite}
.mr-ip-cp1{animation:mripa-c1 12s ease-out infinite}
.mr-ip-cp2{animation:mripa-c2 12s ease-out infinite}
.mr-ip-cp3{animation:mripa-c3 12s ease-out infinite}
.mr-ip-cp4{animation:mripa-c4 12s ease-out infinite}
.mr-ip-cp5{animation:mripa-c5 12s ease-out infinite}
.mr-ip-lc0{animation:mripa-l0 12s ease-out infinite}
.mr-ip-lc1{animation:mripa-l1 12s ease-out infinite}
.mr-ip-lc2{animation:mripa-l2 12s ease-out infinite}
.mr-ip-lc3{animation:mripa-l3 12s ease-out infinite}
.mr-ip-lc4{animation:mripa-l4 12s ease-out infinite}
.mr-ip-lc5{animation:mripa-l5 12s ease-out infinite}
.mr-ip-lb{animation:mripa-lba 12s ease-out infinite}

/* Center hub (РАСШИРЯЕМ) — green default */
.mr-ip-dkc{position:absolute;top:50%;left:50%;width:27px;height:27px;border-radius:50%;background:#000;border:3px solid #00ff88;box-shadow:0 0 12px #00ff88,inset 0 0 8px rgba(0,255,136,.3);animation:mripa-ca 12s ease-out infinite}
.mr-ip-dkcm{width:28px;height:28px}
/* Center hub — amber */
.mr-ip-dkc-a{border-color:#ff8800;box-shadow:0 0 12px #ff8800,inset 0 0 8px rgba(255,136,0,.3)}

.mr-ip-dcc{position:absolute;inset:0;z-index:10}
.mr-ip-cn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Inter',sans-serif;font-weight:700;font-size:58px;color:#00ff88;text-shadow:0 0 15px rgba(0,255,136,.6);line-height:1}
.mr-ip-cnm{font-size:60px}
.mr-ip-cl{position:absolute;top:50%;left:50%;transform:translate(-50%,26px);font-family:'Inter',sans-serif;font-size:13px;color:#00ff88;opacity:.8;text-transform:uppercase;letter-spacing:.1em}
.mr-ip-clm{transform:translate(-50%,30px)}
.mr-ip-pt{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Inter',sans-serif;font-weight:700;font-size:16px;color:#00ff88;text-shadow:0 0 15px rgba(0,255,136,.6);text-align:center;opacity:0;transition:opacity 1s ease-out}
.mr-ip-pt.mr-ip-vis{opacity:1}
.mr-ip-ptm{font-size:17px}

/* Labels — green default */
.mr-ip-lt{font-family:'Inter',sans-serif;font-size:28px;font-weight:700;color:#00ff88;text-transform:uppercase;letter-spacing:2px;text-align:center;line-height:1.5;margin-top:24px}
.mr-ip-ltm{font-family:'Inter',sans-serif;font-size:24px;font-weight:700;color:#00ff88;text-transform:uppercase;letter-spacing:2px;text-align:center;line-height:1.4;margin-top:16px}
/* Labels — blue / amber */
.mr-ip-lt-v{color:#58a6ff}
.mr-ip-lt-a{color:#ff8800}

/* ── Buttons ── */
/* Default: green outline (ЗАПУСКАЕМ) */
.mr-ip-mb{display:inline-flex;align-items:center;justify-content:center;padding:8px 24px;margin-top:12px;background:transparent !important;color:#00ff88 !important;border:1.5px solid #00ff88 !important;border-radius:6px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .3s ease;text-decoration:none !important}
.mr-ip-mb:hover{box-shadow:0 0 20px rgba(0,255,136,.4);transform:translateY(-1px);background:rgba(0,255,136,.08) !important}
.mr-ip-mb::before,.mr-ip-mb::after{display:none !important;content:none !important}
.mr-ip-mbm{padding:6px 20px;font-size:10px;margin-top:10px}
/* Button — ВИДИМ: outline blue */
.mr-ip-mb-v{background:transparent !important;color:#58a6ff !important;border:1.5px solid #58a6ff !important}
.mr-ip-mb-v:hover{box-shadow:0 0 20px rgba(88,166,255,.4);background:rgba(88,166,255,.08) !important}
/* Button — РАСШИРЯЕМ: outline amber */
.mr-ip-mb-a{background:transparent !important;color:#ff8800 !important;border:1.5px solid #ff8800 !important}
.mr-ip-mb-a:hover{box-shadow:0 0 20px rgba(255,136,0,.4);background:rgba(255,136,0,.08) !important}

.mr-ip-sc{position:relative;width:100%;height:420px;max-width:100vw;overflow:visible;touch-action:pan-y;user-select:none;cursor:grab}
.mr-ip-sc:active{cursor:grabbing}
.mr-ip-st{display:flex;align-items:flex-start;position:absolute;padding-top:30px}
.mr-ip-si{margin-top:24px;display:flex;flex-direction:column;align-items:center}
.mr-ip-dsf{animation:mripa-dsfa 2s linear infinite}
.mr-ip-dsb{animation:mripa-dsba 2s linear infinite}
.mr-ip-pra{animation:mripa-pran 2s ease-in-out infinite}
.mr-ip-nc{transition:all .3s ease}
.mr-ip-na{filter:drop-shadow(0 0 12px #00ff88)}
.mr-ip-sl{transition:all .3s ease}
.mr-ip-orb{animation:mripa-orbAnim 3s linear infinite}
.mr-ip-sh{display:flex;align-items:center;gap:8px;margin-top:12px}
.mr-ip-sh span{font-family:'Inter',sans-serif;font-size:9px;color:rgba(255,255,255,.35);letter-spacing:2px;text-transform:uppercase}

/* Modal overlay */
.mr-ip-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);backdrop-filter:blur(10px);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:24px 24px 0;overflow-y:auto}
.mr-ip-modal{position:relative;width:100%;max-width:1100px;min-height:calc(100vh - 24px);background:#111;border:1px solid #222;border-bottom:none;border-radius:24px 24px 0 0;overflow:hidden}
.mr-ip-close{position:sticky;top:24px;float:right;margin-right:24px;width:56px;height:56px;background:rgba(0,0,0,.5) !important;border:2px solid rgba(255,255,255,.2) !important;border-radius:50%;color:#fff !important;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s ease;z-index:10;text-decoration:none !important;backdrop-filter:blur(10px)}
.mr-ip-close:hover{background:rgba(255,255,255,.1) !important;border-color:rgba(255,255,255,.4) !important}
.mr-ip-close::before,.mr-ip-close::after{display:none !important;content:none !important}
.mr-ip-modal-body{padding:24px 48px 80px}

/* Modal transitions */
.mr-ip-fade-enter-active{transition:opacity .2s ease}
.mr-ip-fade-leave-active{transition:opacity .18s ease}
.mr-ip-fade-enter-from,.mr-ip-fade-leave-to{opacity:0}
.mr-ip-slide-enter-active{transition:opacity .25s ease-out,transform .25s ease-out}
.mr-ip-slide-leave-active{transition:opacity .2s ease,transform .2s ease}
.mr-ip-slide-enter-from{opacity:0;transform:translateY(20px)}
.mr-ip-slide-leave-to{opacity:0;transform:translateY(10px)}

@media(max-width:768px){
  .mr-ip-overlay{padding:16px 16px 0}
  .mr-ip-modal{min-height:calc(100vh - 16px);border-radius:16px 16px 0 0}
  .mr-ip-modal-body{padding:16px 24px 60px}
  .mr-ip-close{top:16px;margin-right:16px;width:48px;height:48px}
  .mr-ip-close svg{width:24px;height:24px}
}
</style>
