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
const openAccordions = ref(new Set())

const dialWidth = 260
const gap = 30
const totalWidth = dialWidth + gap
let interval = null

const checkMobile = () => { isMobile.value = window.innerWidth < 768 }

const openModal = (id) => {
  activeModal.value = id
  document.body.style.overflow = 'hidden'
  openAccordions.value = new Set()
}
const closeModal = () => {
  activeModal.value = null
  document.body.style.overflow = ''
}
const handleEscape = (e) => {
  if (e.key === 'Escape' && activeModal.value) closeModal()
}
const toggleAccordion = (key) => {
  const s = new Set(openAccordions.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  openAccordions.value = s
}
const isOpen = (key) => openAccordions.value.has(key)

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
<div class="ip">
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

  <!-- Modals -->
  <Teleport to="body">
    <Transition name="modal-fade">
    <div v-if="activeModal" class="mr-ip-overlay" @click.self="closeModal">
      <Transition name="modal-slide" appear>
      <div class="mr-ip-modal" :key="activeModal">
        <button class="mr-ip-close" @click="closeModal" aria-label="Закрыть">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div class="mr-ip-modal-body">

          <!-- ═══════════════════════════════════════ -->
          <!-- ВИДИМ -->
          <!-- ═══════════════════════════════════════ -->
          <template v-if="activeModal === 'vidim'">
            <h1 class="md-h1">ВИДИМ</h1>
            <div class="md-intro">
              <p>Архитектуру бизнеса в цифре — до того, как её описал клиент.</p>
              <p>Куда идут рынки — и как оказаться там первым.</p>
              <p>Какой модуль запустить первым, чтобы эффект был взрывным.</p>
            </div>

            <div class="md-divider"></div>

            <h2 class="md-h2"><span class="md-mono">2</span> этапа</h2>

            <!-- Этап 1 -->
            <h3 class="md-h3"><span class="md-mono">1</span> — Ранскейл-сессия · <span class="md-mono">90</span> минут</h3>
            <h4 class="md-h4">Не аудит. Не диагностика. Не анкета на <span class="md-mono">50</span> вопросов.</h4>
            <p class="md-text">Не обязательство. Не контракт на полгода. Один разговор, после которого вы видите свой бизнес иначе.</p>
            <p class="md-text">Это разговор о будущем вашего рынка с командой, которая видит на <span class="md-mono">2</span> года вперёд. <span class="md-mono">45</span> запусков — от ресторанов до международных саммитов — дают способность видеть паттерны, которые изнутри бизнеса не видны.</p>

            <!-- Аккордион: Что происходит -->
            <div class="md-accordion" :class="{ open: isOpen('v-1') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-1')">
                <span class="md-accordion-icon">{{ isOpen('v-1') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Что происходит</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-1') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Мы смотрим на бизнес и видим:</p>
                  <p class="md-text-inner md-dash">Какой цифровой модуль нужен первым</p>
                  <p class="md-text-inner md-dash">Что даст максимальный эффект при минимальных ресурсах</p>
                  <p class="md-text-inner md-dash">Какие модули понадобятся дальше и как они соединяются</p>
                  <p class="md-text-inner md-dash">Где узкое горлышко, которое тормозит рост прямо сейчас</p>
                </div>
              </div>
            </div>

            <p class="md-text">Вам не нужно знать, что именно строить. Владелец бизнеса приходит с направлением: «хочу расти», «хочу как у лидеров», «хочу без штата». Этого достаточно. Мы видим за вас — и сразу запускаем.</p>

            <div class="md-divider"></div>

            <!-- Этап 2 -->
            <h3 class="md-h3"><span class="md-mono">2</span> — RAG Аналитика</h3>
            <p class="md-text">Фирменные методологии и технологии бизнес-аналитики Модуля Роста. Внутри: Чекап + анализ рынка Радаром.</p>

            <div class="md-divider-thin"></div>

            <!-- Чекап -->
            <h4 class="md-h4-section">Чекап</h4>
            <p class="md-result"><span class="md-result-label">Результат:</span> карта модулей бизнеса в цифре. Порядок запуска. Понимание, что будет через <span class="md-mono">3</span>, <span class="md-mono">6</span>, <span class="md-mono">12</span> месяцев если начать сейчас.</p>

            <div class="md-accordion" :class="{ open: isOpen('v-2') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-2')">
                <span class="md-accordion-icon">{{ isOpen('v-2') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Как устроен Чекап</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-2') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Разбираем бизнес по <span class="md-mono">10</span> направлениям и <span class="md-mono">180</span> взаимосвязанным метрикам. Не ещё один отчёт — системный подход шаг за шагом: все одинаково видят цель, оценивают как работает бизнес, непрерывно его улучшают и действуют в соответствии с точным и гибким планом.</p>
                  <p class="md-text-inner md-method-label">Методология DMAIC + кросс-анализ:</p>
                  <p class="md-text-inner md-dash"><strong>Определяем:</strong> проблемы по принципу «есть/нет» и сразу приоритезируем</p>
                  <p class="md-text-inner md-dash"><strong>Измеряем:</strong> текущее состояние и строим базовую линию</p>
                  <p class="md-text-inner md-dash"><strong>Анализируем:</strong> причины проблем — ищем взаимосвязи между процессами</p>
                  <p class="md-text-inner md-dash"><strong>Улучшаем:</strong> точечно, прогнозируя влияние на все соседние области</p>
                  <p class="md-text-inner md-dash"><strong>Контролируем:</strong> результаты через систему раннего предупреждения и регулярных чекапов</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('v-3') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-3')">
                <span class="md-accordion-icon">{{ isOpen('v-3') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Что получает собственник</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-3') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner md-dash">Точные метрики — например, «оптимизация графика закупок высвободит X млн ₽» или «изменение мотивации увеличит выручку на <span class="md-mono">Y%</span>»</p>
                  <p class="md-text-inner md-dash">Приоритизированный план действий — что делать сейчас, а что отложить, с оценкой эффекта и сроков</p>
                  <p class="md-text-inner md-dash">Пошаговые решения проблем — с учётом взаимосвязей между процессами</p>
                  <p class="md-text-inner md-dash">Детальный отчёт — анализ ~<span class="md-mono">180</span> ключевых метрик и пошаговый план внедрения с временными рамками</p>
                  <p class="md-text-inner md-dash">Система контроля — трекинг результатов и регулярные чекапы</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('v-4') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-4')">
                <span class="md-accordion-icon">{{ isOpen('v-4') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Обязательство</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-4') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Платите за движение, а не за презентации. Если за <span class="md-mono">30</span> дней не завершили <span class="md-mono">3</span> основных улучшения — продолжаем бесплатно.</p>
                  <p class="md-text-inner">Запускаем изменения, пока другие готовят отчёты. Быстро и точно против долго и сложно.</p>
                </div>
              </div>
            </div>

            <a class="md-link" href="https://runscale.ru/checkup/overview.html" target="_blank" rel="noopener">Подробнее о Чекапе <span class="md-link-arrow">→</span></a>

            <div class="md-divider-thin"></div>

            <!-- Радар -->
            <h4 class="md-h4-section">Радар</h4>
            <p class="md-result"><span class="md-result-label">Результат:</span> карта рынка. Используется для симуляций, проверки гипотез, быстрой коррекции всех частей стратегии.</p>

            <div class="md-accordion" :class="{ open: isOpen('v-5') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-5')">
                <span class="md-accordion-icon">{{ isOpen('v-5') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Как работает Радар</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-5') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Проприетарная система оценки, созданная для поиска компаний, чей потенциал значительно превышает текущие результаты.</p>
                  <p class="md-text-inner">Мы не ищем «проблемные» бизнесы. Мы ищем «спящих гигантов».</p>
                  <p class="md-text-inner">Радар рассчитывает Индекс Роста на основе взвешенного анализа четырёх ключевых областей по десяткам публичных и косвенных признаков. Алгоритм анализирует не столько сами факты, сколько разрывы, противоречия и резонансы между ними.</p>
                  <p class="md-text-inner md-highlight">Радар не показывает, что в компании «не так».<br/>Он подсвечивает, где скрыт потенциал роста.</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('v-6') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-6')">
                <span class="md-accordion-icon">{{ isOpen('v-6') ? '−' : '+' }}</span>
                <span class="md-accordion-title"><span class="md-mono">4</span> области анализа</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-6') }">
                <div class="md-accordion-content">
                  <div class="md-analysis-block">
                    <p class="md-analysis-title">Напряжение Роста · <span class="md-mono">35%</span></p>
                    <p class="md-text-inner">Основной драйвер индекса. Здоровое противоречие между амбициозными целями и операционной реальностью — признак потенциала.</p>
                  </div>
                  <div class="md-analysis-block">
                    <p class="md-analysis-title">Сила Видения Основателя · <span class="md-mono">25%</span></p>
                    <p class="md-text-inner">Стратегический фундамент. Лидеры, чья мечта больше их текущего бизнеса, способны на кратные прорывы.</p>
                  </div>
                  <div class="md-analysis-block">
                    <p class="md-analysis-title">Квантовый Скачок · <span class="md-mono">20%</span></p>
                    <p class="md-text-inner">Способность к трансформации. История смелых решений и скорость реакции на кризисы определяют готовность к переменам.</p>
                  </div>
                  <div class="md-analysis-block">
                    <p class="md-analysis-title">Человеческий Фактор · <span class="md-mono">20%</span></p>
                    <p class="md-text-inner">Культурная основа. Резонанс между ценностями команды и декларациями бренда создаёт устойчивый рост.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('v-7') }">
              <button class="md-accordion-header" @click="toggleAccordion('v-7')">
                <span class="md-accordion-icon">{{ isOpen('v-7') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Источники данных</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('v-7') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Агрегируем сотни источников для полной картины компании:</p>
                  <p class="md-text-inner md-dash"><strong>Финансовые данные:</strong> отчётность, СПАРК, динамика выручки, инвестиционные раунды</p>
                  <p class="md-text-inner md-dash"><strong>Коммуникации руководства:</strong> интервью, конференции, медиа, соцсети CEO</p>
                  <p class="md-text-inner md-dash"><strong>Обратная связь пользователей:</strong> HeadHunter, Хабр, App Store, Отзовик</p>
                  <p class="md-text-inner md-dash"><strong>Профессиональные сообщества:</strong> отраслевые медиа, LinkedIn, Telegram, конференции</p>
                  <p class="md-text-inner" style="margin-top: 12px;">Система оценивает не только <em>что</em> говорится, но и <em>как</em>: эмоциональный фон, повторяющиеся метафоры, скрытые напряжения, лингвистические паттерны.</p>
                </div>
              </div>
            </div>

            <a class="md-link" href="https://runscale.ru/radar/overview.html" target="_blank" rel="noopener">Подробнее о Радаре <span class="md-link-arrow">→</span></a>
          </template>

          <!-- ═══════════════════════════════════════ -->
          <!-- ЗАПУСКАЕМ -->
          <!-- ═══════════════════════════════════════ -->
          <template v-else-if="activeModal === 'zapuskaem'">
            <h1 class="md-h1">ЗАПУСКАЕМ</h1>
            <h2 class="md-h2">Первый цифровой модуль в Ранскейл режиме</h2>
            <p class="md-text md-bold">Один модуль — один результат. Работает с первого дня.</p>
            <p class="md-text md-bold">Доминирование — пока конкуренты думают, вы уже запустили.</p>
            <p class="md-text">Не делаем «сайты», «приложения» или «CRM». Форма определяется в процессе. Запускаем цифровые модули, которые решают конкретное узкое горлышко бизнеса.</p>

            <div class="md-divider"></div>

            <h2 class="md-h2">Ранскейл режим (R&D Циклы)</h2>
            <p class="md-text">Срезаем всё лишнее: ТЗ, согласования, бюрократию, перфекционизм. Оставляем только то, что работает.</p>
            <p class="md-text md-cycle">Маленькая версия → ошибки → корректировка → масштаб.<br/>Не «большой план → идеальное исполнение».</p>

            <div class="md-divider"></div>

            <h2 class="md-h2">Каждый модуль — готовый цифровой продукт</h2>

            <div class="md-accordion" :class="{ open: isOpen('z-1') }">
              <button class="md-accordion-header" @click="toggleAccordion('z-1')">
                <span class="md-accordion-icon">{{ isOpen('z-1') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Работает без владельца</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('z-1') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Система принимает решения. Всё видно с телефона. Не нужно быть на месте, чтобы контролировать.</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('z-2') }">
              <button class="md-accordion-header" @click="toggleAccordion('z-2')">
                <span class="md-accordion-icon">{{ isOpen('z-2') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Работает без участия сотрудников</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('z-2') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Или с минимальным. Модуль берёт на себя то, что раньше делали люди — точнее, быстрее, без выходных.</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('z-3') }">
              <button class="md-accordion-header" @click="toggleAccordion('z-3')">
                <span class="md-accordion-icon">{{ isOpen('z-3') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Без нового штата</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('z-3') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Позволяет масштабироваться без увеличения сложности. Больше рынка — меньше людей.</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('z-4') }">
              <button class="md-accordion-header" @click="toggleAccordion('z-4')">
                <span class="md-accordion-icon">{{ isOpen('z-4') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Становится лучше сам по себе</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('z-4') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Шаг за шагом. Каждое взаимодействие калибрует систему — она учится на реальных данных вашего бизнеса.</p>
                </div>
              </div>
            </div>

            <div class="md-divider"></div>

            <div class="md-summary">
              <p class="md-summary-label">Итого:</p>
              <p class="md-summary-line">Работает <span class="md-mono">24/7</span>.</p>
              <p class="md-summary-line">Без зарплаты. Без больничных.</p>
              <p class="md-summary-line">Без обучения и совещаний.</p>
            </div>
          </template>

          <!-- ═══════════════════════════════════════ -->
          <!-- РАСШИРЯЕМ -->
          <!-- ═══════════════════════════════════════ -->
          <template v-else-if="activeModal === 'rasshiryaem'">
            <h1 class="md-h1">РАСШИРЯЕМ</h1>
            <h2 class="md-h2">Модуль Роста® — принцип модульной сборки бизнеса</h2>
            <p class="md-text">Не движок. Не метод. Не платформа. Принцип, по которому цифровые продукты проектируются и стыкуются.</p>
            <p class="md-text md-bold">Модули стыкуются друг с другом. Бизнес в цифре растёт. Каждый модуль усиливает всю систему.</p>

            <div class="md-divider"></div>

            <h2 class="md-h2">Принцип модульной сборки</h2>
            <p class="md-text">Каждый модуль автономен — работает сам по себе.<br/>Каждый спроектирован для стыковки — соединяется с другими.<br/>Когда модулей больше — они интегрируются друг с другом и с тем, куда растёт бизнес.<br/>Целое сильнее суммы частей.</p>
            <p class="md-text">Каждый модуль запускается отдельно, работает автономно, решает конкретное узкое горлышко. Но каждый спроектирован так, чтобы стыковаться с другими. Когда модулей больше — они интегрируются друг с другом и с тем, куда и как растёт компания.</p>

            <div class="md-divider"></div>

            <h2 class="md-h2">Модуль за модулем</h2>
            <p class="md-text">Не нужно покупать «всё сразу». Один модуль, результат, решение запустить второй. Потом третий. В какой-то момент — полная цифровая система. Но путь к ней — модуль за модулем.</p>

            <div class="md-accordion" :class="{ open: isOpen('r-1') }">
              <button class="md-accordion-header" @click="toggleAccordion('r-1')">
                <span class="md-accordion-icon">{{ isOpen('r-1') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Как это работает на практике</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('r-1') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner md-module-line">Модуль бронирования запущен → работает.</p>
                  <p class="md-text-inner md-module-line">Модуль лояльности запущен → работает + стыкуется с бронированием.</p>
                  <p class="md-text-inner md-module-line">Модуль аналитики запущен → работает + видит данные из обоих модулей.</p>
                  <p class="md-text-inner md-module-line">Витрина запущена → работает + связана с бронированием + лояльностью + аналитикой.</p>
                  <p class="md-text-inner" style="margin-top: 12px;">Каждый модуль — отдельный запуск, отдельный результат. Но вместе — система, которая управляет бизнесом.</p>
                </div>
              </div>
            </div>

            <div class="md-accordion" :class="{ open: isOpen('r-2') }">
              <button class="md-accordion-header" @click="toggleAccordion('r-2')">
                <span class="md-accordion-icon">{{ isOpen('r-2') ? '−' : '+' }}</span>
                <span class="md-accordion-title">Что происходит когда система собрана</span>
              </button>
              <div class="md-accordion-body" :class="{ expanded: isOpen('r-2') }">
                <div class="md-accordion-content">
                  <p class="md-text-inner">Конкуренты реагируют. Вы действуете.</p>
                  <p class="md-text-inner">Вы масштабируетесь. Они нанимают.</p>
                  <p class="md-text-inner">Ваша система работает. Их команда совещается.</p>
                  <p class="md-text-inner">Вы уже запустили. Они ещё обсуждают.</p>
                </div>
              </div>
            </div>

            <div class="md-divider"></div>

            <h2 class="md-h2">Единственная метрика</h2>
            <p class="md-text md-bold">Доминирует ли бизнес на своём рынке после запуска.</p>
            <p class="md-text">Не «работает ли система». Не «доволен ли клиент». А: стал ли бизнес сильнее?</p>
            <p class="md-text">Если да — расширяемся. Если нет — чиним.</p>
            <p class="md-text">Каждое расширение — новый модуль, новый результат. Бизнес не уходит — он достраивает.</p>
          </template>

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
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600&display=swap');
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
.ip{background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:15px 32px 24px;overflow:visible}
.tt{font-family:'Inter',sans-serif;font-size:52px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:4px;text-shadow:0 0 8px rgba(255,255,255,.2);margin-bottom:16px;margin-top:15px;text-align:center;line-height:1.2}
.sub{font-family:'Inter',sans-serif;font-size:34px;font-weight:400;color:#00ff88;text-align:center;margin:0 0 56px;letter-spacing:1px;line-height:1.3}
@media(max-width:768px){.tt{font-size:24px;letter-spacing:2px;margin-bottom:12px}.sub{font-size:18px;margin-bottom:36px}.ip{padding:39px 16px 16px}}
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

/* ═══════════════════════════════════════════════════════════ */
/* Modal overlay & shell */
/* ═══════════════════════════════════════════════════════════ */
.mr-ip-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:24px 24px 0;overflow-y:auto}
.mr-ip-modal{position:relative;width:100%;max-width:680px;min-height:calc(100vh - 24px);background:#0a0a0a;border:1px solid rgba(255,255,255,.08);border-bottom:none;border-radius:4px 4px 0 0;overflow:hidden}
.mr-ip-close{position:sticky;top:24px;float:right;margin-right:24px;width:48px;height:48px;background:transparent !important;border:1px solid rgba(255,255,255,.12) !important;border-radius:2px;color:rgba(255,255,255,.5) !important;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .25s ease;z-index:10;text-decoration:none !important}
.mr-ip-close:hover{color:#ff8800 !important;border-color:rgba(255,136,0,.3) !important}
.mr-ip-close::before,.mr-ip-close::after{display:none !important;content:none !important}
.mr-ip-close svg{width:20px;height:20px}
.mr-ip-modal-body{padding:32px 48px 80px}

/* Modal transitions */
.modal-fade-enter-active{transition:opacity .2s ease}
.modal-fade-leave-active{transition:opacity .18s ease}
.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
.modal-slide-enter-active{transition:opacity .25s ease-out,transform .25s ease-out}
.modal-slide-leave-active{transition:opacity .2s ease,transform .2s ease}
.modal-slide-enter-from{opacity:0;transform:translateY(20px)}
.modal-slide-leave-to{opacity:0;transform:translateY(10px)}

/* ═══════════════════════════════════════════════════════════ */
/* Modal content typography */
/* ═══════════════════════════════════════════════════════════ */
.md-h1{font-family:'Inter',sans-serif;font-weight:700;font-size:32px;color:#00ff88;text-transform:uppercase;letter-spacing:4px;margin:0 0 24px;line-height:1.2}
.md-h2{font-family:'Inter',sans-serif;font-weight:600;font-size:20px;color:#00ff88;margin:0 0 16px;line-height:1.4}
.md-h3{font-family:'Inter',sans-serif;font-weight:600;font-size:18px;color:#58a6ff;margin:0 0 12px;line-height:1.4}
.md-h4{font-family:'Inter',sans-serif;font-weight:600;font-size:15px;color:#e0e0e0;margin:0 0 12px;line-height:1.5}
.md-h4-section{font-family:'Inter',sans-serif;font-weight:700;font-size:18px;color:#00ff88;margin:0 0 10px;line-height:1.4}
.md-text{font-family:'Inter',sans-serif;font-weight:400;font-size:15px;color:#c0c0c0;line-height:1.7;margin:0 0 14px}
.md-text.md-bold{color:#e0e0e0;font-weight:500}
.md-text.md-cycle{color:#58a6ff;font-style:italic}
.md-mono{font-family:'JetBrains Mono',monospace;font-weight:500;color:#e0e0e0}
.md-intro{margin-bottom:8px}
.md-intro p{font-family:'Inter',sans-serif;font-weight:400;font-size:15px;color:#c0c0c0;line-height:1.7;margin:0 0 4px}

/* Dividers */
.md-divider{height:1px;background:rgba(255,255,255,.06);margin:28px 0}
.md-divider-thin{height:1px;background:rgba(255,255,255,.04);margin:20px 0}

/* Result blocks */
.md-result{font-family:'Inter',sans-serif;font-size:14px;color:#a0a0a0;line-height:1.7;margin:0 0 16px;padding-left:12px;border-left:2px solid rgba(0,255,136,.2)}
.md-result-label{font-weight:600;color:#00ff88}

/* ═══════════════════════════════════════════════════════════ */
/* Accordions */
/* ═══════════════════════════════════════════════════════════ */
.md-accordion{border-top:1px solid rgba(255,255,255,.06);margin-bottom:0}
.md-accordion:last-of-type{border-bottom:1px solid rgba(255,255,255,.06)}
.md-accordion-header{display:flex;align-items:center;gap:12px;width:100%;padding:14px 0;background:none !important;border:none !important;cursor:pointer;text-align:left;min-height:44px;text-decoration:none !important;transition:none}
.md-accordion-header::before,.md-accordion-header::after{display:none !important;content:none !important}
.md-accordion-header:hover .md-accordion-title{color:#ff8800}
.md-accordion-header:hover .md-accordion-icon{color:#ff8800}
.md-accordion-icon{font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:500;color:rgba(255,255,255,.35);flex-shrink:0;width:18px;text-align:center;transition:color .2s ease}
.md-accordion.open .md-accordion-icon{color:#ff8800}
.md-accordion-title{font-family:'Exo 2','Inter',sans-serif;font-weight:500;font-size:13px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1.5px;transition:color .2s ease}
.md-accordion.open .md-accordion-title{color:#ff8800}
.md-accordion-body{max-height:0;overflow:hidden;opacity:0;transition:max-height .3s ease,opacity .25s ease}
.md-accordion-body.expanded{max-height:800px;opacity:1}
.md-accordion-content{padding:0 0 16px 30px}
.md-text-inner{font-family:'Inter',sans-serif;font-weight:400;font-size:14px;color:#a0a0a0;line-height:1.7;margin:0 0 6px}
.md-text-inner strong{font-weight:600;color:#c0c0c0}
.md-text-inner em{font-style:italic;color:#b0b0b0}
.md-text-inner.md-dash{padding-left:16px;position:relative}
.md-text-inner.md-dash::before{content:'—';position:absolute;left:0;color:rgba(255,255,255,.2)}
.md-text-inner.md-highlight{color:#58a6ff;font-weight:500;margin-top:10px}
.md-method-label{font-weight:600;color:#c0c0c0;margin-top:10px !important}

/* Analysis blocks (Radar) */
.md-analysis-block{margin-bottom:14px}
.md-analysis-block:last-child{margin-bottom:0}
.md-analysis-title{font-family:'Inter',sans-serif;font-weight:600;font-size:14px;color:#58a6ff;margin:0 0 4px;line-height:1.4}

/* Module lines (Расширяем) */
.md-module-line{padding-left:16px;position:relative;color:#b0b0b0 !important}
.md-module-line::before{content:'›';position:absolute;left:0;color:#00ff88;font-weight:700}

/* Links */
.md-link{display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-size:14px;font-weight:500;color:#ff8800;text-decoration:none;margin:16px 0 4px;transition:color .2s ease}
.md-link:hover{color:#ffaa33;text-shadow:0 0 8px rgba(255,136,0,.3)}
.md-link:hover .md-link-arrow{transform:translateX(3px)}
.md-link-arrow{display:inline-block;transition:transform .2s ease}

/* Summary (Запускаем) */
.md-summary{padding:20px 0 0}
.md-summary-label{font-family:'Inter',sans-serif;font-weight:700;font-size:16px;color:#e0e0e0;margin:0 0 8px}
.md-summary-line{font-family:'Inter',sans-serif;font-weight:400;font-size:15px;color:#00ff88;line-height:1.8;margin:0}

/* ═══════════════════════════════════════════════════════════ */
/* Mobile */
/* ═══════════════════════════════════════════════════════════ */
@media(max-width:768px){
  .mr-ip-overlay{padding:16px 0 0}
  .mr-ip-modal{max-width:100%;min-height:calc(100vh - 16px);border-radius:4px 4px 0 0;border-left:none;border-right:none}
  .mr-ip-modal-body{padding:20px 20px 60px}
  .mr-ip-close{top:16px;margin-right:16px;width:44px;height:44px}
  .mr-ip-close svg{width:18px;height:18px}
  .md-h1{font-size:24px;letter-spacing:3px;margin-bottom:20px}
  .md-h2{font-size:17px}
  .md-h3{font-size:16px}
  .md-text{font-size:14px}
  .md-accordion-content{padding-left:20px}
  .md-accordion-header{min-height:48px;padding:16px 0}
}
</style>
