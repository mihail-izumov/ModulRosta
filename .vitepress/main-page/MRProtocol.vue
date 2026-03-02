<template>
  <section class="mr-launch-protocol-section" id="mr-launch-protocol">
    <div class="mr-launch-protocol-container">
      <div class="mr-section-label">ПРОТОКОЛ ЗАПУСКА</div>
      <h2 class="mr-section-title">Запуск цифрового модуля</h2>

      <div class="mr-protocol-table">
        <div 
          v-for="item in protocolItems" 
          :key="item.id"
          class="mr-protocol-row" 
          @click="openProtocolModal(item.id)"
          @mousemove="handleMouseMove"
        >
          <div class="mr-protocol-code"><span>{{ item.code }}</span></div>
          <div class="mr-protocol-info">
            <span class="mr-protocol-name">{{ item.title }}</span>
            <span class="mr-protocol-subtitle">{{ item.subtitle }}</span>
          </div>
          <div class="mr-protocol-duration">{{ item.duration }}</div>
          <div class="mr-protocol-details-btn">
            <div class="mr-build-details-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
            </div>
            <span class="mr-details-text">ДЕТАЛИ</span>
          </div>
        </div>
      </div>

      <!-- Protocol Footer -->
      <div class="mr-protocol-footer">
        <div class="mr-protocol-footer-header">
          <span class="mr-protocol-summary-label">СТАРТОВЫЙ СЛОТ — ПОЛНЫЙ ЦИКЛ</span>
          <span class="mr-protocol-footer-duration">60 ДНЕЙ</span>
        </div>
        <p class="mr-protocol-summary-value">СТРАТЕГИЯ → ДИЗАЙН → КОД</p>
        <div class="mr-protocol-package-grid">
          <div class="mr-package-card"><div class="mr-package-icon">📍</div><div class="mr-package-title">Бренд-платформа</div></div>
          <div class="mr-package-card"><div class="mr-package-icon">🎨</div><div class="mr-package-title">Айдентика</div></div>
          <div class="mr-package-card"><div class="mr-package-icon">📱</div><div class="mr-package-title">Интерфейс</div></div>
          <div class="mr-package-card"><div class="mr-package-icon">🚀</div><div class="mr-package-title">Цифровой продукт</div></div>
        </div>
        <p class="mr-protocol-summary-note">СЛОТ — это 60 дней зарезервированной мощности под вашу задачу. Вы покупаете не «часы программиста», а цельную систему от стратегии до пикселя в коде.</p>
        <div class="mr-protocol-slots-line">СВОБОДНО СЛОТОВ НА МАРТ: 1 ИЗ 2</div>
        <button class="mr-protocol-cta" @click="openProtocolModal('slot')">ПРОВЕРИТЬ ГОТОВНОСТЬ →</button>
      </div>
    </div>

    <!-- Protocol Modal Wizard -->
    <Teleport to="body">
      <div v-if="modalOpen" class="mr-modal-overlay" @click.self="closeModal">
        <button class="mr-modal-close" @click="closeModal"></button>
        <div class="mr-modal-content">
          <!-- Step Indicator -->
          <div class="mr-protocol-step-indicator">
            <span v-for="(step, index) in protocolSteps" :key="index" 
                  :class="['mr-step-dot', { active: currentStep === index, passed: currentStep > index }, step === 'slot' ? 'final' : '']">
              {{ step === 'slot' ? '★' : index + 1 }}
            </span>
            <template v-for="(_, index) in protocolSteps.slice(0, -1)" :key="'line-' + index">
              <span :class="['mr-step-line', { passed: currentStep > index }]"></span>
            </template>
          </div>

          <!-- Step Content -->
          <div class="mr-protocol-step-content" v-html="stepContent"></div>

          <!-- Navigation -->
          <div class="mr-protocol-nav">
            <button :class="['mr-protocol-nav-btn', 'prev', { hidden: currentStep === 0 }]" @click="prevStep">← НАЗАД</button>
            <button :class="['mr-protocol-nav-btn', 'next', { hidden: currentStep === protocolSteps.length - 1 }]" @click="nextStep">ДАЛЕЕ →</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const modalOpen = ref(false)
const currentStep = ref(0)
const protocolSteps = ['scout', 'checkup', 'execute', 'slot']

const protocolItems = [
  { id: 'scout', code: 'MOD-01', title: 'Разведка', subtitle: 'СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ', duration: '7–10 дней' },
  { id: 'checkup', code: 'MOD-02', title: 'Чертёж', subtitle: 'АЙДЕНТИКА И ИНТЕРФЕЙС', duration: '30 дней' },
  { id: 'execute', code: 'MOD-03', title: 'Сборка', subtitle: 'ДИЗАЙН В КОДЕ', duration: '30 дней' }
]

const protocolData: Record<string, any> = {
  scout: {
    code: "MOD-01", title: "Разведка", subtitle: "СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ",
    duration: "7–10 дней", price: "150 000 ₽", result: "Бренд-платформа + GO/NO-GO",
    method: "Глубинные интервью, анализ конкурентов, позиционирование, формулировка ценностного предложения.",
    roadmap: [
      { days: "1–3", title: "Погружение", description: "Интервью с основателем, изучение рынка и целевой аудитории." },
      { days: "4–6", title: "Позиционирование", description: "Анализ конкурентов, поиск дифференциации, формулировка УТП." },
      { days: "7–10", title: "Стратегия", description: "Бренд-платформа, tone of voice, GO/NO-GO вердикт." }
    ],
    deliverables: ["Бренд-платформа", "Позиционирование", "Анализ конкурентов", "GO / NO-GO вердикт"]
  },
  checkup: {
    code: "MOD-02", title: "Чертёж", subtitle: "АЙДЕНТИКА И ИНТЕРФЕЙС",
    duration: "30 дней", price: "350 000 ₽", result: "Дизайн-система + Прототип",
    method: "Создаём визуальную идентичность бренда и проектируем интерфейс продукта. Полный дизайн-кит от логотипа до кликабельного прототипа.",
    roadmap: [
      { days: "1–7", title: "Айдентика", description: "Логотип, цветовая палитра, типографика, фирменные элементы." },
      { days: "8–18", title: "UI-кит", description: "Компоненты интерфейса, иконки, формы, сетки." },
      { days: "19–26", title: "Прототип", description: "Кликабельный макет ключевых экранов продукта." },
      { days: "27–30", title: "Финализация", description: "Гайдлайны, исходники, передача материалов." }
    ],
    deliverables: ["Логотип и айдентика", "UI-кит компонентов", "Кликабельный прототип", "Бренд-гайдлайны"]
  },
  execute: {
    code: "MOD-03", title: "Сборка", subtitle: "ДИЗАЙН В КОДЕ",
    duration: "30 дней", price: "по запросу", result: "Рабочий продукт",
    method: "Превращаем дизайн в работающий продукт. Pixel-perfect вёрстка, чистый код, современный стек, запуск в продакшн.",
    roadmap: [
      { days: "1–10", title: "Фронтенд", description: "Pixel-perfect вёрстка по утверждённым макетам." },
      { days: "11–20", title: "Бэкенд", description: "Бизнес-логика, база данных, API." },
      { days: "21–25", title: "Интеграции", description: "Платежи, аналитика, внешние сервисы." },
      { days: "26–28", title: "Тестирование", description: "QA, оптимизация производительности." },
      { days: "29–30", title: "Релиз", description: "Деплой, мониторинг, документация." }
    ],
    deliverables: ["Рабочий продукт", "Исходный код", "Документация", "7 дней поддержки"]
  }
}

const stepContent = computed(() => {
  const stepId = protocolSteps[currentStep.value]
  
  if (stepId === 'slot') {
    return `
      <div class="mr-modal-header" style="justify-content: center; text-align: center; margin-bottom: 32px;">
        <h2 class="mr-modal-title" style="font-size: 28px;">От идеи до бренда и продукта</h2>
        <p style="font-size: 14px; color: #555; margin-top: 8px;">Стратегия → Айдентика → Интерфейс → Код. Единая система.</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88; letter-spacing: 2px; margin-bottom: 8px;">LAUNCH PAD • ПОЛНЫЙ ЦИКЛ</div>
          <h3 style="font-size: 20px; font-weight: 400; color: #fff; margin: 0;">Бренд-платформа + Дизайн-система + Рабочий продукт</h3>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; color: #555; margin-bottom: 4px;">Срок реализации</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 24px; color: #00ff88; font-weight: 600;">60 дней</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="padding: 20px; background: #0a0a0a; border-radius: 8px; border: 1px solid #222;">
          <div style="color: #555; font-size: 11px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Входит в пакет:</div>
          <ul style="margin: 0; padding-left: 0; list-style: none; color: #fff; font-size: 14px; line-height: 1.8;">
            <li style="padding: 4px 0; border-bottom: 1px solid #222;">→ Аудит и Стратегия (MOD-01)</li>
            <li style="padding: 4px 0; border-bottom: 1px solid #222;">→ Дизайн-система и Прототип (MOD-02)</li>
            <li style="padding: 4px 0;">→ Разработка и Релиз (MOD-03)</li>
          </ul>
        </div>
        <div style="padding: 20px; background: #0a0a0a; border-radius: 8px; border: 1px solid #222; display: flex; flex-direction: column; justify-content: center;">
          <div style="color: #555; font-size: 11px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Стоимость слота:</div>
          <div style="font-size: 32px; color: #00ff88; font-weight: 600;">от 500 000 ₽</div>
          <div style="font-size: 11px; color: #555; margin-top: 8px;">*оплата поэтапная (3 транша)</div>
        </div>
      </div>
      <div class="mr-pixel-perfect-badge" style="margin-bottom: 24px; justify-content: center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        ТОЧНОСТЬ ДО ПИКСЕЛЯ: Полное соответствие кода дизайн-макетам
      </div>
      <a href="https://t.me/runScale" target="_blank" class="mr-slot-cta">ЗАБРОНИРОВАТЬ СЛОТ →</a>
    `
  }
  
  const data = protocolData[stepId]
  if (!data) return ''

  const artifactGallery = stepId === 'checkup' ? `
    <div class="mr-artifact-gallery">
      <div class="mr-artifact-card">
        <div class="mr-artifact-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="mr-artifact-card-title">Бренд-платформа</div>
        <div class="mr-artifact-card-desc">Позиционирование и стратегия</div>
      </div>
      <div class="mr-artifact-card">
        <div class="mr-artifact-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
        <div class="mr-artifact-card-title">UI-кит</div>
        <div class="mr-artifact-card-desc">Компоненты и стили</div>
      </div>
      <div class="mr-artifact-card">
        <div class="mr-artifact-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg></div>
        <div class="mr-artifact-card-title">Прототип</div>
        <div class="mr-artifact-card-desc">Кликабельный макет</div>
      </div>
    </div>
  ` : ''

  const assemblyVisual = stepId === 'execute' ? `
    <div class="mr-module-assembly-visual">
      <div class="mr-assembly-block header">HEADER</div>
      <div class="mr-assembly-block sidebar">NAV</div>
      <div class="mr-assembly-block content">CONTENT</div>
      <div class="mr-assembly-scanner"></div>
    </div>
  ` : ''

  const pixelPerfectBadge = stepId === 'execute' ? `
    <div class="mr-pixel-perfect-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ТОЧНОСТЬ ДО ПИКСЕЛЯ: Полное соответствие кода дизайн-макетам
    </div>
  ` : ''

  return `
    <div class="mr-modal-header">
      <span class="mr-protocol-modal-code">${data.code}</span>
      <h2 class="mr-modal-title">${data.title}</h2>
    </div>
    <div class="mr-details-meta">
      <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">${data.subtitle}</span></div>
      <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">${data.duration}</span></div>
      <div class="mr-details-meta-row"><span class="mr-details-meta-label">Цена</span><span class="mr-details-meta-value">${data.price}</span></div>
      <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">${data.result}</span></div>
    </div>
    <div class="mr-protocol-modal-method">${data.method}</div>
    ${assemblyVisual}
    <div class="mr-protocol-modal-roadmap">
      ${data.roadmap.map((step: any) => `
        <div class="mr-roadmap-step">
          <div class="mr-roadmap-step-days">${step.days}</div>
          <div class="mr-roadmap-step-content">
            <div class="mr-roadmap-step-title">${step.title}</div>
            <div class="mr-roadmap-step-desc">${step.description}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="mr-details-tags">
      ${data.deliverables.map((d: string) => `<span class="mr-details-tag">${d}</span>`).join('')}
    </div>
    ${artifactGallery}
    ${pixelPerfectBadge}
  `
})

function openProtocolModal(modeId: string) {
  const idx = protocolSteps.indexOf(modeId)
  currentStep.value = idx >= 0 ? idx : 0
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modalOpen.value = false
  document.body.style.overflow = ''
}

function nextStep() {
  if (currentStep.value < protocolSteps.length - 1) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

function handleMouseMove(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
  target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
}
</script>

<style scoped>
.mr-launch-protocol-section { background: #0a0a0a; padding: 80px 24px; }
.mr-launch-protocol-container { max-width: 1000px; margin: 0 auto; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 300; margin-bottom: 24px; color: #fff; }

.mr-protocol-table { background: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; margin-top: 24px; }

.mr-protocol-row {
  display: grid; grid-template-columns: 80px 1fr 100px 100px; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid #222; cursor: pointer; transition: all 0.3s ease;
  gap: 16px; position: relative; --mouse-x: 50%; --mouse-y: 50%;
}
.mr-protocol-row::before, .mr-protocol-row::after { content: '+'; position: absolute; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #222; transition: color 0.3s ease; }
.mr-protocol-row::before { top: 8px; left: 8px; }
.mr-protocol-row::after { top: 8px; right: 8px; }
.mr-protocol-row:hover::before, .mr-protocol-row:hover::after { color: #00ff88; }
.mr-protocol-row:hover { background: radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 136, 0.06), transparent 50%); border-left: 3px solid #00ff88; }
.mr-protocol-row:last-child { border-bottom: none; }

.mr-protocol-code span { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88; text-transform: uppercase; letter-spacing: 1px; padding: 4px 8px; border: 1px solid #00ff88; border-radius: 4px; display: inline-block; }
.mr-protocol-info { display: flex; flex-direction: column; gap: 4px; }
.mr-protocol-name { font-weight: 600; font-size: 16px; color: #fff; }
.mr-protocol-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88; letter-spacing: 1px; }
.mr-protocol-duration { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #fff; }

.mr-protocol-details-btn { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: transparent; border: 1px solid #222; border-radius: 6px; color: #00ff88; cursor: pointer; transition: all 0.3s ease; justify-content: center; }
.mr-protocol-details-btn:hover { background: #00ff88; border-color: #00ff88; }
.mr-protocol-details-btn:hover .mr-details-text, .mr-protocol-details-btn:hover .mr-build-details-icon { color: #000; }
.mr-protocol-details-btn:hover .mr-build-details-icon svg { stroke: #000; }
.mr-build-details-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
.mr-build-details-icon svg { color: #00ff88; }
.mr-details-text { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #00ff88; }

/* Protocol Footer */
.mr-protocol-footer { display: flex; flex-direction: column; align-items: center; padding: 32px; background: rgba(0, 255, 136, 0.05); border: 2px solid #00ff88; border-radius: 12px; margin-top: 24px; gap: 24px; }
.mr-protocol-footer-header { display: flex; justify-content: space-between; align-items: center; width: 100%; padding-bottom: 16px; border-bottom: 1px solid rgba(0, 255, 136, 0.2); }
.mr-protocol-summary-label { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #00ff88; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
.mr-protocol-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #00ff88; font-weight: 600; text-align: center; margin: 0; }
.mr-protocol-summary-note { font-size: 14px; color: #888; text-align: center; line-height: 1.6; max-width: 600px; margin: 0; }
.mr-protocol-footer-duration { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: #00ff88; font-weight: 700; }
.mr-protocol-package-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }
.mr-package-card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px 16px; text-align: center; transition: all 0.3s ease; }
.mr-package-card:hover { border-color: #00ff88; transform: translateY(-2px); }
.mr-package-icon { font-size: 24px; margin-bottom: 8px; }
.mr-package-title { font-size: 13px; font-weight: 600; color: #fff; }
.mr-protocol-slots-line { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fff; letter-spacing: 2px; padding: 12px 24px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; }
.mr-protocol-cta { display: inline-flex; align-items: center; gap: 8px; padding: 16px 40px; background: #00ff88; color: #000; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; border: none; cursor: pointer; border-radius: 6px; }
.mr-protocol-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }

@media (max-width: 900px) {
  .mr-protocol-row { grid-template-columns: 70px 1fr 80px; gap: 12px; }
  .mr-protocol-details-btn { display: none; }
  .mr-protocol-package-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 700px) {
  .mr-protocol-row::before, .mr-protocol-row::after { display: none; }
  .mr-protocol-footer { padding: 24px 16px; }
  .mr-protocol-footer-header { flex-direction: column; gap: 8px; text-align: center; }
  .mr-protocol-slots-line { font-size: 11px; text-align: center; }
}

/* Modal */
.mr-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,1); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; }
.mr-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: #000; border: 2px solid #00ff88; color: #00ff88; cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; display: flex; align-items: center; justify-content: center; }
.mr-modal-close::before, .mr-modal-close::after { content: ''; position: absolute; width: 36px; height: 2px; background: currentColor; }
.mr-modal-close::before { transform: rotate(45deg); }
.mr-modal-close::after { transform: rotate(-45deg); }
.mr-modal-close:hover { background: #00ff88; color: #000; box-shadow: 0 0 40px rgba(0, 255, 136, 0.4); transform: scale(1.05); }
.mr-modal-content { max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; overflow-x: hidden; }

/* Step Indicator */
.mr-protocol-step-indicator { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px; }
.mr-step-dot { width: 24px; height: 24px; border-radius: 50%; background: #111; border: 1px solid #222; color: #555; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; transition: all 0.3s ease; }
.mr-step-dot.active { background: rgba(0, 255, 136, 0.1); border-color: #00ff88; color: #00ff88; box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); }
.mr-step-dot.passed { border-color: #00ff88; color: #00ff88; }
.mr-step-line { height: 1px; width: 40px; background: #222; transition: all 0.3s ease; }
.mr-step-line.passed { background: #00ff88; }

/* Navigation */
.mr-protocol-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #222; }
.mr-protocol-nav-btn { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; padding: 12px 24px; background: transparent; color: #888; border: 1px solid #222; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; }
.mr-protocol-nav-btn:hover { color: #00ff88; border-color: #00ff88; }
.mr-protocol-nav-btn.next { background: rgba(0, 255, 136, 0.05); color: #00ff88; border-color: #00ff88; }
.mr-protocol-nav-btn.next:hover { background: #00ff88; color: #000; box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }
.mr-protocol-nav-btn.hidden { visibility: hidden; }
</style>

<style>
/* Global modal content styles */
.mr-modal-header { display: flex; align-items: center; justify-content: flex-start; gap: 16px; margin-bottom: 32px; }
.mr-modal-title { font-size: 28px; font-weight: 600; color: #00ff88; }
.mr-protocol-modal-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88; text-transform: uppercase; letter-spacing: 2px; padding: 6px 12px; border: 1px solid #00ff88; border-radius: 4px; margin-right: 16px; }

.mr-details-meta { margin-bottom: 24px; background: #000; border-radius: 12px; }
.mr-details-meta-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px; position: relative; }
.mr-details-meta-row:last-child { border-bottom: none; }
.mr-details-meta-row::before { content: '+'; position: absolute; left: -16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #222; }
.mr-details-meta-label { color: #555; }
.mr-details-meta-value { color: #fff; font-weight: 600; text-align: right; }
.mr-details-meta-value.accent { color: #00ff88; }

.mr-protocol-modal-method { padding: 16px; background: rgba(0, 255, 136, 0.05); border-left: 2px solid #00ff88; margin-bottom: 24px; font-size: 14px; color: #888; line-height: 1.6; }

.mr-protocol-modal-roadmap { margin-bottom: 24px; }
.mr-roadmap-step { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid #222; }
.mr-roadmap-step:last-child { border-bottom: none; }
.mr-roadmap-step-days { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #00ff88; min-width: 70px; font-weight: 700; }
.mr-roadmap-step-content { flex: 1; }
.mr-roadmap-step-title { font-weight: 600; font-size: 14px; color: #fff; margin-bottom: 4px; }
.mr-roadmap-step-desc { font-size: 13px; color: #888; line-height: 1.5; }

.mr-details-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.mr-details-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 8px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); color: #00ff88; border-radius: 6px; }

/* Artifact Gallery */
.mr-artifact-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; margin-bottom: 24px; }
@media (max-width: 600px) { .mr-artifact-gallery { grid-template-columns: 1fr; } }
.mr-artifact-card { background: #0a0a0a; border: 1px solid #222; border-radius: 8px; padding: 20px; text-align: center; transition: all 0.3s ease; }
.mr-artifact-card:hover { border-color: #00ff88; transform: translateY(-2px); }
.mr-artifact-card-icon { width: 48px; height: 48px; margin: 0 auto 12px; background: rgba(0, 255, 136, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #00ff88; }
.mr-artifact-card-icon svg { width: 24px; height: 24px; }
.mr-artifact-card-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.mr-artifact-card-desc { font-size: 11px; color: #555; }

/* Assembly Visual */
.mr-module-assembly-visual { position: relative; height: 200px; background: linear-gradient(90deg, #222 1px, transparent 1px) 0 0 / 20px 20px, linear-gradient(#222 1px, transparent 1px) 0 0 / 20px 20px; border: 1px solid #222; border-radius: 8px; margin: 24px 0; overflow: hidden; }
.mr-assembly-block { position: absolute; background: #111; border: 1px solid #00ff88; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #00ff88; animation: mrAssemblyFly 2s ease-out forwards; opacity: 0; }
.mr-assembly-block.header { width: 80%; height: 30px; top: 10px; left: 10%; animation-delay: 0s; }
.mr-assembly-block.sidebar { width: 20%; height: 120px; top: 50px; left: 5%; animation-delay: 0.3s; }
.mr-assembly-block.content { width: 65%; height: 120px; top: 50px; right: 5%; animation-delay: 0.6s; }
@keyframes mrAssemblyFly { 0% { transform: translateY(-50px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
.mr-assembly-scanner { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, transparent, #00ff88, transparent); animation: mrScanDown 2s ease-in-out 1.2s infinite; opacity: 0; }
@keyframes mrScanDown { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

/* Pixel Perfect Badge */
.mr-pixel-perfect-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid #00ff88; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #00ff88; letter-spacing: 1px; margin-top: 16px; }
.mr-pixel-perfect-badge svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Slot CTA */
.mr-slot-cta { display: flex; width: 100%; justify-content: center; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #00ff88; color: #000; text-decoration: none; border-radius: 6px; transition: all 0.3s ease; }
.mr-slot-cta:hover { box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }
</style>
