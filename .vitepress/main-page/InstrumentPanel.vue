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
const activeModal = ref(null)

const dialWidth = 260
const gap = 30
const totalWidth = dialWidth + gap
let interval = null

const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

const openModal = (id) => { activeModal.value = id; document.body.style.overflow = 'hidden' }
const closeModal = () => { activeModal.value = null; document.body.style.overflow = '' }

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
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

onUnmounted(() => { window.removeEventListener('resize', checkMobile); if (interval) clearInterval(interval) })

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
<div class="ip">
  <svg class="chev" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.23199,0,0,1.23199,-8294.3,-5100.12)"><path d="M6895.66,4460.27L6895.66,4367.25L7170.76,4203.17L7445.87,4369.28L7445.87,4463.27L7609.08,4560.65L7609.08,4661.64L7608.88,4661.52L7608.48,4859.02L7446.82,4762.34L7446.82,4952.95L7171.71,4793.75L6896.61,4950.91L6896.61,4761.4L6732.45,4859.02L6732.45,4658.64C6732.45,4658.64 6732.45,4557.65 6732.45,4557.65L6895.66,4460.27ZM7171.71,4696.96L6982.75,4804.41L6982.75,4710.18L7171.71,4597.82L7360.68,4710.83L7360.68,4805.79L7171.71,4696.96ZM7391.44,4531.16L7170.76,4397.91L6895.66,4561.99L6895.66,4561.27L6814.11,4609.92L6814.14,4709.48L7171.69,4497.69L7171.71,4497.69L7527.73,4711.65L7527.68,4613.08L7391.44,4531.8L7391.44,4531.16Z" fill="white"/></g></svg>
  <h1 class="tt">От проблемы<br/>до работающей системы.</h1>
  <p class="sub">Одна команда. Полный цикл.</p>
  <div v-if="!isMobile" class="dk">
    <div class="dc">
      <div class="dl d1"><div class="db"></div><svg class="ds" viewBox="0 0 192 192"><line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.2)" stroke-width="1"/><line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.2)" stroke-width="1"/><g class="oc" style="--d:18s"><circle cx="96" cy="21" r="4" fill="#00ff88" class="pd"/><circle cx="161" cy="133" r="4" fill="#00ff88" class="pd"/><circle cx="31" cy="133" r="4" fill="#00ff88" class="pd"/></g><g class="occ" style="--d:15s"><circle cx="96" cy="31" r="3.5" fill="#00ff88"/><circle cx="152" cy="128" r="3.5" fill="#00ff88"/><circle cx="40" cy="128" r="3.5" fill="#00ff88"/></g><g class="oc" style="--d:12s"><circle cx="96" cy="40" r="3" fill="#00ff88"/><circle cx="144" cy="124" r="3" fill="#00ff88"/><circle cx="48" cy="124" r="3" fill="#00ff88"/></g><g class="occ" style="--d:9s"><circle cx="96" cy="50" r="2.5" fill="#00ff88"/><circle cx="136" cy="119" r="2.5" fill="#00ff88"/><circle cx="56" cy="119" r="2.5" fill="#00ff88"/></g><g class="oc" style="--d:7s"><circle cx="96" cy="58" r="2" fill="#00ff88"/><circle cx="129" cy="115" r="2" fill="#00ff88"/><circle cx="63" cy="115" r="2" fill="#00ff88"/></g><g class="occ" style="--d:5s"><circle cx="96" cy="66" r="1.5" fill="#00ff88" opacity="0.7"/><circle cx="122" cy="111" r="1.5" fill="#00ff88" opacity="0.7"/><circle cx="70" cy="111" r="1.5" fill="#00ff88" opacity="0.7"/></g><g class="oc" style="--d:3.5s"><circle cx="96" cy="74" r="1.5" fill="#00ff88" opacity="0.5"/><circle cx="115" cy="107" r="1.5" fill="#00ff88" opacity="0.5"/><circle cx="77" cy="107" r="1.5" fill="#00ff88" opacity="0.5"/></g><circle cx="96" cy="96" r="6" fill="#00ff88" class="cg"/></svg></div>
      <span class="lt">Видим</span>
      <button class="mb" @click.stop="openModal('vidim')">Узнать</button>
    </div>
    <div class="dc">
      <div class="dl d1"><div class="db"></div><svg class="ds" viewBox="0 0 192 192"><line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><circle cx="96" cy="96" r="63" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/><circle cx="96" cy="96" r="63" fill="none" stroke="#00ff88" stroke-width="8" stroke-linecap="round" :stroke-dasharray="rndDash" transform="rotate(-90 96 96)" class="pr"/></svg><div class="dcc"><template v-if="phase==='countdown'"><span class="cn">{{countdown}}</span><span class="cl">дней</span></template><span v-else class="pt" :class="{vis:showPoehali}">ПОЕХАЛИ!</span></div></div>
      <span class="lt">Запускаем</span>
      <button class="mb" @click.stop="openModal('zapuskaem')">Узнать</button>
    </div>
    <div class="dc">
      <div class="dl d1"><div class="db"></div><svg class="ds" viewBox="0 0 192 192"><line x1="10" y1="96" x2="182" y2="96" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="96" y1="10" x2="96" y2="182" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line v-for="(p,i) in dP" :key="'c'+i" x1="96" y1="96" :x2="p.x" :y2="p.y" stroke="#00ff88" stroke-width="2.5" :class="'lc'+i"/><line v-for="(p,i) in dP" :key="'b'+i" :x1="p.x" :y1="p.y" :x2="dP[(i+1)%6].x" :y2="dP[(i+1)%6].y" stroke="#00ff88" stroke-width="2" class="lb"/></svg><div v-for="i in 6" :key="'m'+i" class="dm" :class="'cp'+(i-1)"></div><div class="dkc"></div></div>
      <span class="lt">Расширяем</span>
      <button class="mb" @click.stop="openModal('rasshiryaem')">Узнать</button>
    </div>
  </div>
  <template v-if="isMobile">
    <div class="sc" @mousedown="handleStart($event.clientX)" @mousemove="handleMove($event.clientX)" @mouseup="handleEnd" @mouseleave="handleEnd" @touchstart="handleStart($event.touches[0].clientX)" @touchmove="handleMove($event.touches[0].clientX)" @touchend="handleEnd">
      <div class="st" :style="sliderStyle">
        <div class="dcm">
          <div class="dl d2"><div class="db"></div><svg class="ds" viewBox="0 0 200 200"><line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.2)" stroke-width="1"/><line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.2)" stroke-width="1"/><g class="oc" style="--d:18s"><circle cx="100" cy="22" r="4" fill="#00ff88" class="pd"/><circle cx="168" cy="139" r="4" fill="#00ff88" class="pd"/><circle cx="32" cy="139" r="4" fill="#00ff88" class="pd"/></g><g class="occ" style="--d:15s"><circle cx="100" cy="32" r="3.5" fill="#00ff88"/><circle cx="159" cy="134" r="3.5" fill="#00ff88"/><circle cx="41" cy="134" r="3.5" fill="#00ff88"/></g><g class="oc" style="--d:12s"><circle cx="100" cy="42" r="3" fill="#00ff88"/><circle cx="150" cy="129" r="3" fill="#00ff88"/><circle cx="50" cy="129" r="3" fill="#00ff88"/></g><g class="occ" style="--d:9s"><circle cx="100" cy="52" r="2.5" fill="#00ff88"/><circle cx="142" cy="124" r="2.5" fill="#00ff88"/><circle cx="58" cy="124" r="2.5" fill="#00ff88"/></g><g class="oc" style="--d:7s"><circle cx="100" cy="62" r="2" fill="#00ff88"/><circle cx="133" cy="119" r="2" fill="#00ff88"/><circle cx="67" cy="119" r="2" fill="#00ff88"/></g><g class="occ" style="--d:5s"><circle cx="100" cy="72" r="1.5" fill="#00ff88" opacity="0.7"/><circle cx="124" cy="114" r="1.5" fill="#00ff88" opacity="0.7"/><circle cx="76" cy="114" r="1.5" fill="#00ff88" opacity="0.7"/></g><g class="oc" style="--d:3.5s"><circle cx="100" cy="80" r="1.5" fill="#00ff88" opacity="0.5"/><circle cx="117" cy="110" r="1.5" fill="#00ff88" opacity="0.5"/><circle cx="83" cy="110" r="1.5" fill="#00ff88" opacity="0.5"/></g><circle cx="100" cy="100" r="6" fill="#00ff88" class="cg"/></svg></div>
          <span class="ltm">Видим</span>
          <button class="mb mbm" @click.stop="openModal('vidim')">Узнать</button>
        </div>
        <div class="dcm">
          <div class="dl d2"><div class="db"></div><svg class="ds" viewBox="0 0 200 200"><line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><circle cx="100" cy="100" r="70" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="8"/><circle cx="100" cy="100" r="70" fill="none" stroke="#00ff88" stroke-width="8" stroke-linecap="round" :stroke-dasharray="(phase==='countdown'?snakeProgress:fillProgress)/100*440+' 440'" transform="rotate(-90 100 100)" class="pr"/></svg><div class="dcc"><template v-if="phase==='countdown'"><span class="cn cnm">{{countdown}}</span><span class="cl clm">дней</span></template><span v-else class="pt ptm" :class="{vis:showPoehali}">ПОЕХАЛИ!</span></div></div>
          <span class="ltm">Запускаем</span>
          <button class="mb mbm" @click.stop="openModal('zapuskaem')">Узнать</button>
        </div>
        <div class="dcm">
          <div class="dl d2"><div class="db"></div><svg class="ds" viewBox="0 0 200 200"><line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0,255,136,0.15)" stroke-width="1"/><line x1="100" y1="100" x2="100" y2="58" stroke="#00ff88" stroke-width="2.5" class="lc0"/><line x1="100" y1="100" x2="136" y2="79" stroke="#00ff88" stroke-width="2.5" class="lc1"/><line x1="100" y1="100" x2="136" y2="121" stroke="#00ff88" stroke-width="2.5" class="lc2"/><line x1="100" y1="100" x2="100" y2="142" stroke="#00ff88" stroke-width="2.5" class="lc3"/><line x1="100" y1="100" x2="64" y2="121" stroke="#00ff88" stroke-width="2.5" class="lc4"/><line x1="100" y1="100" x2="64" y2="79" stroke="#00ff88" stroke-width="2.5" class="lc5"/><line x1="100" y1="58" x2="136" y2="79" stroke="#00ff88" stroke-width="2" class="lb"/><line x1="136" y1="79" x2="136" y2="121" stroke="#00ff88" stroke-width="2" class="lb"/><line x1="136" y1="121" x2="100" y2="142" stroke="#00ff88" stroke-width="2" class="lb"/><line x1="100" y1="142" x2="64" y2="121" stroke="#00ff88" stroke-width="2" class="lb"/><line x1="64" y1="121" x2="64" y2="79" stroke="#00ff88" stroke-width="2" class="lb"/><line x1="64" y1="79" x2="100" y2="58" stroke="#00ff88" stroke-width="2" class="lb"/></svg><div v-for="i in 6" :key="'mm'+i" class="dm dmm" :class="'cp'+(i-1)"></div><div class="dkc dkcm"></div></div>
          <span class="ltm">Расширяем</span>
          <button class="mb mbm" @click.stop="openModal('rasshiryaem')">Узнать</button>
        </div>
      </div>
    </div>
    <div class="si">
      <svg width="180" height="50" viewBox="0 0 180 50" style="overflow:visible">
        <path d="M 20 25 Q 90 5 160 25" fill="none" stroke="rgba(0,255,136,0.15)" stroke-width="1.5"/>
        <path d="M 20 25 Q 90 45 160 25" fill="none" stroke="rgba(0,255,136,0.15)" stroke-width="1.5"/>
        <path v-if="currentIndex===2" d="M 20 25 Q 90 5 160 25" fill="none" stroke="#00ff88" stroke-width="1" stroke-dasharray="5 10" class="dsb"/>
        <path v-if="currentIndex!==2" d="M 20 25 Q 90 45 160 25" fill="none" stroke="#00ff88" stroke-width="1" stroke-dasharray="5 10" class="dsf"/>
        <line x1="20" y1="25" x2="160" y2="25" stroke="rgba(0,255,136,0.2)" stroke-width="1.5"/>
        <line x1="20" y1="25" x2="90" y2="25" stroke="#00ff88" :stroke-width="currentIndex<=1?1.5:0.5" :opacity="currentIndex<=1?0.7:0.2" class="sl"/>
        <line x1="90" y1="25" x2="160" y2="25" stroke="#00ff88" :stroke-width="currentIndex>=1?1.5:0.5" :opacity="currentIndex>=1?0.7:0.2" class="sl"/>
        <g v-for="(x,i) in nX" :key="'node'+i" @click="goToSlide(i)" style="cursor:pointer">
          <circle v-if="currentIndex===i" :cx="x" cy="25" r="16" fill="none" stroke="#00ff88" stroke-width="1" class="pra"/>
          <g v-if="currentIndex===i" :transform="'translate('+x+',25)'"><g class="orb"><circle cx="15" cy="0" r="2" fill="#00ff88"/></g></g>
          <circle :cx="x" cy="25" :r="currentIndex===i?10:6" :fill="currentIndex===i?'#00ff88':'black'" stroke="#00ff88" :stroke-width="currentIndex===i?2:1.5" :class="{na:currentIndex===i}" class="nc"/>
          <circle v-if="currentIndex===i" :cx="x" cy="25" r="4" fill="black"/>
          <circle v-else :cx="x" cy="25" r="2" fill="#00ff88" opacity="0.5"/>
        </g>
      </svg>
      <div class="sh"><svg width="12" height="8" viewBox="0 0 12 8"><path d="M 4 4 L 8 0.5 M 4 4 L 8 7.5" stroke="#00ff88" stroke-width="1.5" fill="none" opacity="0.5"/></svg><span>переключить</span><svg width="12" height="8" viewBox="0 0 12 8"><path d="M 8 4 L 4 0.5 M 8 4 L 4 7.5" stroke="#00ff88" stroke-width="1.5" fill="none" opacity="0.5"/></svg></div>
    </div>
  </template>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="activeModal" class="mr-ip-overlay" @click.self="closeModal">
      <div class="mr-ip-modal">
        <button class="mr-ip-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div class="mr-ip-modal-body">
          <!-- Content will be in separate component -->
          <div class="mr-ip-modal-placeholder">
            <span v-if="activeModal === 'vidim'">ВИДИМ</span>
            <span v-else-if="activeModal === 'zapuskaem'">ЗАПУСКАЕМ</span>
            <span v-else-if="activeModal === 'rasshiryaem'">РАСШИРЯЕМ</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
@keyframes scw{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes sccw{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@keyframes dp{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes c0{0%,5%{transform:translate(-50%,-50%) translate(0,-70px) scale(.3);opacity:0}10%,65%{transform:translate(-50%,-50%) translate(0,-40px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(0,-10px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes c1{0%,12%{transform:translate(-50%,-50%) translate(61px,-35px) scale(.3);opacity:0}17%,65%{transform:translate(-50%,-50%) translate(35px,-20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(9px,-5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes c2{0%,22%{transform:translate(-50%,-50%) translate(61px,35px) scale(.3);opacity:0}27%,65%{transform:translate(-50%,-50%) translate(35px,20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(9px,5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes c3{0%,32%{transform:translate(-50%,-50%) translate(0,70px) scale(.3);opacity:0}37%,65%{transform:translate(-50%,-50%) translate(0,40px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(0,10px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes c4{0%,42%{transform:translate(-50%,-50%) translate(-61px,35px) scale(.3);opacity:0}47%,65%{transform:translate(-50%,-50%) translate(-35px,20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(-9px,5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes c5{0%,52%{transform:translate(-50%,-50%) translate(-61px,-35px) scale(.3);opacity:0}57%,65%{transform:translate(-50%,-50%) translate(-35px,-20px) scale(1);opacity:1}75%,90%{transform:translate(-50%,-50%) translate(-9px,-5px) scale(.6);opacity:.8}95%,100%{transform:translate(-50%,-50%) translate(0,0) scale(0);opacity:0}}
@keyframes l0{0%,12%{opacity:0}17%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes l1{0%,19%{opacity:0}24%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes l2{0%,29%{opacity:0}34%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes l3{0%,39%{opacity:0}44%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes l4{0%,49%{opacity:0}54%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes l5{0%,59%{opacity:0}64%,70%{opacity:1}80%,100%{opacity:0}}
@keyframes lba{0%,66%{opacity:0}72%,75%{opacity:.8}85%,100%{opacity:0}}
@keyframes ca{0%,70%{transform:translate(-50%,-50%) scale(1)}85%{transform:translate(-50%,-50%) scale(1.5)}95%,100%{transform:translate(-50%,-50%) scale(1)}}
@keyframes pran{0%,100%{opacity:.4}50%{opacity:.2}}
@keyframes dsfa{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
@keyframes dsba{0%{stroke-dashoffset:0}100%{stroke-dashoffset:40}}
@keyframes orbAnim{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
</style>

<style scoped>
.ip{background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 32px 24px;overflow:visible}
.chev{width:48px;height:48px;margin-bottom:16px}
.tt{font-family:'Inter',sans-serif;font-size:52px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:4px;text-shadow:0 0 8px rgba(255,255,255,.2);margin-bottom:16px;margin-top:0;text-align:center;line-height:1.2}
.sub{font-family:'Inter',sans-serif;font-size:34px;font-weight:400;color:#00ff88;text-align:center;margin:0 0 56px;letter-spacing:1px;line-height:1.3}
@media(max-width:768px){.chev{width:32px;height:32px;margin-bottom:12px}.tt{font-size:24px;letter-spacing:2px;margin-bottom:12px}.sub{font-size:18px;margin-bottom:36px}.ip{padding:24px 16px 16px}}
.dk{display:flex;align-items:flex-start;justify-content:center;gap:64px;overflow:visible}
.dc{display:flex;flex-direction:column;align-items:center;overflow:visible}
.dcm{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:260px;overflow:visible}
.dl{position:relative;border-radius:50%;border:1px solid rgba(16,185,129,.3);background:#000;display:flex;align-items:center;justify-content:center;overflow:visible;box-shadow:inset 0 0 40px rgba(0,255,136,.15),inset 0 0 70px rgba(0,255,136,.08),0 0 30px rgba(0,255,136,.2),0 0 60px rgba(0,255,136,.1)}
.d1{width:192px;height:192px}.d2{width:200px;height:200px}
.db{position:absolute;inset:10px;border-radius:50%;border:2px solid rgba(16,185,129,.5);pointer-events:none}
.ds{position:absolute;inset:0;width:100%;height:100%}
.oc{transform-origin:center;animation:scw var(--d,10s) linear infinite}
.occ{transform-origin:center;animation:sccw var(--d,10s) linear infinite}
.pd{animation:dp 3s ease-in-out infinite}
.cg{filter:drop-shadow(0 0 10px #00ff88)}
.pr{filter:drop-shadow(0 0 6px #00ff88)}
.dm{position:absolute;top:50%;left:50%;width:16px;height:16px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88}
.dmm{width:16px;height:16px}
.cp0{animation:c0 12s ease-out infinite}.cp1{animation:c1 12s ease-out infinite}.cp2{animation:c2 12s ease-out infinite}.cp3{animation:c3 12s ease-out infinite}.cp4{animation:c4 12s ease-out infinite}.cp5{animation:c5 12s ease-out infinite}
.lc0{animation:l0 12s ease-out infinite}.lc1{animation:l1 12s ease-out infinite}.lc2{animation:l2 12s ease-out infinite}.lc3{animation:l3 12s ease-out infinite}.lc4{animation:l4 12s ease-out infinite}.lc5{animation:l5 12s ease-out infinite}
.lb{animation:lba 12s ease-out infinite}
.dkc{position:absolute;top:50%;left:50%;width:27px;height:27px;border-radius:50%;background:#000;border:3px solid #00ff88;box-shadow:0 0 12px #00ff88,inset 0 0 8px rgba(0,255,136,.3);animation:ca 12s ease-out infinite}
.dkcm{width:28px;height:28px}
.dcc{position:absolute;inset:0;z-index:10}
.cn{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Inter',sans-serif;font-weight:700;font-size:58px;color:#00ff88;text-shadow:0 0 15px rgba(0,255,136,.6);line-height:1}
.cnm{font-size:60px}
.cl{position:absolute;top:50%;left:50%;transform:translate(-50%,26px);font-family:'Inter',sans-serif;font-size:13px;color:#00ff88;opacity:.8;text-transform:uppercase;letter-spacing:.1em}
.clm{transform:translate(-50%,30px)}
.pt{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Inter',sans-serif;font-weight:700;font-size:16px;color:#00ff88;text-shadow:0 0 15px rgba(0,255,136,.6);text-align:center;opacity:0;transition:opacity 1s ease-out}
.pt.vis{opacity:1}.ptm{font-size:17px}
.lt{font-family:'Inter',sans-serif;font-size:28px;font-weight:700;color:#00ff88;text-transform:uppercase;letter-spacing:2px;text-align:center;line-height:1.5;margin-top:24px}
.ltm{font-family:'Inter',sans-serif;font-size:24px;font-weight:700;color:#00ff88;text-transform:uppercase;letter-spacing:2px;text-align:center;line-height:1.4;margin-top:16px}

/* More button */
.mb{display:inline-flex;align-items:center;justify-content:center;padding:8px 24px;margin-top:12px;background:#00ff88 !important;color:#000 !important;border:none !important;border-radius:6px;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .3s ease;text-decoration:none !important}
.mb:hover{box-shadow:0 0 20px rgba(0,255,136,.5);transform:translateY(-1px)}
.mb::before,.mb::after{display:none !important;content:none !important}
.mbm{padding:6px 20px;font-size:10px;margin-top:10px}

.sc{position:relative;width:100%;height:420px;max-width:100vw;overflow:visible;touch-action:pan-y;user-select:none;cursor:grab}
.sc:active{cursor:grabbing}
.st{display:flex;align-items:flex-start;position:absolute;padding-top:30px}
.si{margin-top:24px;display:flex;flex-direction:column;align-items:center}
.dsf{animation:dsfa 2s linear infinite}
.dsb{animation:dsba 2s linear infinite}
.pra{animation:pran 2s ease-in-out infinite}
.nc{transition:all .3s ease}
.na{filter:drop-shadow(0 0 12px #00ff88)}
.sl{transition:all .3s ease}
.orb{animation:orbAnim 3s linear infinite}
.sh{display:flex;align-items:center;gap:8px;margin-top:12px}
.sh span{font-family:'Inter',sans-serif;font-size:9px;color:rgba(0,255,136,.5);letter-spacing:2px;text-transform:uppercase}

/* Modal overlay */
.mr-ip-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);backdrop-filter:blur(10px);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:24px 24px 0;overflow-y:auto}
.mr-ip-modal{position:relative;width:100%;max-width:1100px;min-height:calc(100vh - 24px);background:#111;border:1px solid #222;border-bottom:none;border-radius:24px 24px 0 0;overflow:hidden}
.mr-ip-close{position:sticky;top:24px;float:right;margin-right:24px;width:56px;height:56px;background:rgba(0,0,0,.5) !important;border:2px solid rgba(255,255,255,.2) !important;border-radius:50%;color:#fff !important;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s ease;z-index:10;text-decoration:none !important;backdrop-filter:blur(10px)}
.mr-ip-close:hover{background:rgba(255,255,255,.1) !important;border-color:rgba(255,255,255,.4) !important}
.mr-ip-close::before,.mr-ip-close::after{display:none !important;content:none !important}
.mr-ip-modal-body{padding:24px 48px 80px}
.mr-ip-modal-placeholder{display:flex;align-items:center;justify-content:center;height:60vh;font-family:'Inter',sans-serif;font-size:32px;font-weight:700;color:#00ff88;text-transform:uppercase;letter-spacing:4px;opacity:.3}

@media(max-width:768px){
  .mr-ip-overlay{padding:16px 16px 0}
  .mr-ip-modal{min-height:calc(100vh - 16px);border-radius:16px 16px 0 0}
  .mr-ip-modal-body{padding:16px 24px 60px}
  .mr-ip-close{top:16px;margin-right:16px;width:48px;height:48px}
  .mr-ip-close svg{width:24px;height:24px}
  .mr-ip-modal-placeholder{font-size:24px;height:50vh}
}
</style>
