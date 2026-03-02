<template>
  <section class="mr-protocol-section" id="mr-launch-protocol">
    <div class="mr-protocol-container">
      <div class="mr-section-label">ПРОТОКОЛ ЗАПУСКА</div>
      <h2 class="mr-section-title">Запуск цифрового модуля</h2>

      <div class="mr-protocol-table">
        <div v-for="item in protocolItems" :key="item.id" class="mr-protocol-row" @click="openProtocolModal(item.id)">
          <div class="mr-protocol-code"><span>{{ item.code }}</span></div>
          <div class="mr-protocol-info">
            <span class="mr-protocol-name">{{ item.title }}</span>
            <span class="mr-protocol-subtitle">{{ item.subtitle }}</span>
          </div>
          <div class="mr-protocol-duration">{{ item.duration }}</div>
          <div class="mr-protocol-details-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
            <span>ДЕТАЛИ</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mr-protocol-footer">
        <div class="mr-protocol-footer-header">
          <span class="mr-protocol-summary-label">СТАРТОВЫЙ СЛОТ — ПОЛНЫЙ ЦИКЛ</span>
          <span class="mr-protocol-footer-duration">60 ДНЕЙ</span>
        </div>
        <p class="mr-protocol-summary-value">СТРАТЕГИЯ → ДИЗАЙН → КОД</p>
        <div class="mr-protocol-package-grid">
          <div class="mr-package-card">
            <div class="mr-package-icon-glass">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
            </div>
            <div class="mr-package-title">Стратегия</div>
          </div>
          <div class="mr-package-card">
            <div class="mr-package-icon-glass">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="7"/><circle cx="15" cy="15" r="7"/></svg>
            </div>
            <div class="mr-package-title">Дизайн-система</div>
          </div>
          <div class="mr-package-card">
            <div class="mr-package-icon-glass">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21v-6"/><path d="M12 9V3"/><path d="M3 15h18"/><path d="M3 9h18"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
            </div>
            <div class="mr-package-title">Интерфейс</div>
          </div>
          <div class="mr-package-card">
            <div class="mr-package-icon-glass">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/></svg>
            </div>
            <div class="mr-package-title">Цифровой продукт</div>
          </div>
        </div>
        <button class="mr-protocol-cta" @click="openProtocolModal('scout')">ПРОВЕРИТЬ ГОТОВНОСТЬ →</button>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="mr-protocol-modal-overlay" @click.self="closeModal">
        <button class="mr-protocol-modal-close mr-desktop-only" @click="closeModal"></button>
        
        <div class="mr-protocol-modal-content">
          <!-- Step Indicator -->
          <div class="mr-protocol-step-indicator">
            <span :class="['mr-step-dot', { active: currentStep === 0, passed: currentStep > 0 }]" @click="goToStep(0)">1</span>
            <span :class="['mr-step-line', { passed: currentStep > 0 }]"></span>
            <span :class="['mr-step-dot', { active: currentStep === 1, passed: currentStep > 1 }]" @click="goToStep(1)">2</span>
            <span :class="['mr-step-line', { passed: currentStep > 1 }]"></span>
            <span :class="['mr-step-dot', { active: currentStep === 2, passed: currentStep > 2 }]" @click="goToStep(2)">3</span>
            <span :class="['mr-step-line', { passed: currentStep > 2 }]"></span>
            <span :class="['mr-step-dot', 'final', { active: currentStep === 3 }]" @click="goToStep(3)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
            </span>
          </div>

          <!-- Step Content -->
          <div class="mr-protocol-step-content" v-html="stepContent"></div>

          <!-- Navigation -->
          <div class="mr-protocol-nav">
            <button :class="['mr-protocol-nav-btn', 'prev', { hidden: currentStep === 0 }]" @click="prevStep">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              НАЗАД
            </button>
            <button :class="['mr-protocol-nav-btn', 'next', { hidden: currentStep === 3 }]" @click="nextStep">
              ДАЛЕЕ
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Mobile close -->
        <div class="mr-protocol-mobile-close">
          <button class="mr-protocol-mobile-close-btn" @click="closeModal">ЗАКРЫТЬ</button>
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
  { id: 'scout', code: 'MOD-01', title: 'Разведка', subtitle: 'СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ', duration: '7–10д' },
  { id: 'checkup', code: 'MOD-02', title: 'Чертёж', subtitle: 'АЙДЕНТИКА И ИНТЕРФЕЙС', duration: '30д' },
  { id: 'execute', code: 'MOD-03', title: 'Сборка', subtitle: 'ДИЗАЙН В КОДЕ', duration: '30д' }
]

const protocolData: Record<string, any> = {
  scout: { code: "MOD-01", title: "Разведка", subtitle: "СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ", duration: "7–10д", price: "150 000 ₽", result: "Бренд-платформа + GO/NO-GO", method: "Глубинные интервью, анализ конкурентов, позиционирование.", roadmap: [{ days: "1–3", title: "Погружение", description: "Интервью с основателем, изучение рынка." }, { days: "4–6", title: "Позиционирование", description: "Анализ конкурентов, поиск дифференциации." }, { days: "7–10", title: "Стратегия", description: "Бренд-платформа, GO/NO-GO вердикт." }], deliverables: ["Бренд-платформа", "Позиционирование", "Анализ конкурентов", "GO/NO-GO"] },
  checkup: { code: "MOD-02", title: "Чертёж", subtitle: "АЙДЕНТИКА И ИНТЕРФЕЙС", duration: "30д", price: "350 000 ₽", result: "Дизайн-система + Прототип", method: "Создаём визуальную идентичность и проектируем интерфейс.", roadmap: [{ days: "1–7", title: "Айдентика", description: "Логотип, цвета, типографика." }, { days: "8–18", title: "UI-кит", description: "Компоненты, иконки, формы." }, { days: "19–26", title: "Прототип", description: "Кликабельный макет." }, { days: "27–30", title: "Финализация", description: "Гайдлайны, исходники." }], deliverables: ["Логотип и айдентика", "UI-кит", "Прототип", "Гайдлайны"] },
  execute: { code: "MOD-03", title: "Сборка", subtitle: "ДИЗАЙН В КОДЕ", duration: "30д", price: "по запросу", result: "Рабочий продукт", method: "Превращаем дизайн в работающий продукт. Pixel-perfect.", roadmap: [{ days: "1–10", title: "Фронтенд", description: "Pixel-perfect вёрстка." }, { days: "11–20", title: "Бэкенд", description: "Бизнес-логика, API." }, { days: "21–25", title: "Интеграции", description: "Платежи, аналитика." }, { days: "26–30", title: "Релиз", description: "Деплой, документация." }], deliverables: ["Рабочий продукт", "Исходный код", "Документация", "7д поддержки"] }
}

const stepContent = computed(() => {
  const stepId = protocolSteps[currentStep.value]
  
  if (stepId === 'slot') {
    return `
      <div class="mr-slot-header"><h2 class="mr-slot-title">От идеи до бренда и продукта</h2><p class="mr-slot-subtitle">Стратегия → Айдентика → Интерфейс → Код. Единая система.</p></div>
      <div class="mr-slot-offer"><div class="mr-slot-offer-label">LAUNCH PAD • ПОЛНЫЙ ЦИКЛ</div><h3 class="mr-slot-offer-title">Бренд-платформа + Дизайн-система + Рабочий продукт</h3><div class="mr-slot-duration"><span class="mr-slot-duration-label">Срок реализации</span><span class="mr-slot-duration-value">60 дней</span></div></div>
      <div class="mr-slot-grid"><div class="mr-slot-box"><div class="mr-slot-box-label">ВХОДИТ В ПАКЕТ:</div><ul class="mr-slot-list"><li>→ Аудит и Стратегия (MOD-01)</li><li>→ Дизайн-система и Прототип (MOD-02)</li><li>→ Разработка и Релиз (MOD-03)</li></ul></div><div class="mr-slot-box mr-slot-price-box"><div class="mr-slot-box-label">СТОИМОСТЬ СЛОТА:</div><div class="mr-slot-price">от 500 000 ₽</div><div class="mr-slot-price-note">*оплата поэтапная (3 транша)</div></div></div>
      <div class="mr-pixel-perfect-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>ТОЧНОСТЬ ДО ПИКСЕЛЯ: Полное соответствие кода дизайн-макетам</div>
      <a href="https://t.me/runScale" target="_blank" class="mr-slot-cta">ЗАБРОНИРОВАТЬ СЛОТ →</a>`
  }
  
  const d = protocolData[stepId]
  if (!d) return ''
  return `
    <div class="mr-modal-header"><span class="mr-protocol-modal-code">${d.code}</span><h2 class="mr-modal-title">${d.title}</h2></div>
    <div class="mr-details-meta"><div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">${d.subtitle}</span></div><div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">${d.duration}</span></div><div class="mr-details-meta-row"><span class="mr-details-meta-label">Цена</span><span class="mr-details-meta-value">${d.price}</span></div><div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">${d.result}</span></div></div>
    <div class="mr-protocol-modal-method">${d.method}</div>
    <div class="mr-protocol-modal-roadmap">${d.roadmap.map((s: any) => `<div class="mr-roadmap-step"><div class="mr-roadmap-step-days">${s.days}</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">${s.title}</div><div class="mr-roadmap-step-desc">${s.description}</div></div></div>`).join('')}</div>
    <div class="mr-details-tags">${d.deliverables.map((t: string) => `<span class="mr-details-tag">${t}</span>`).join('')}</div>`
})

function openProtocolModal(modeId: string) {
  const idx = protocolSteps.indexOf(modeId)
  currentStep.value = idx >= 0 ? idx : 0
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() { modalOpen.value = false; document.body.style.overflow = '' }
function nextStep() { if (currentStep.value < 3) currentStep.value++ }
function prevStep() { if (currentStep.value > 0) currentStep.value-- }
function goToStep(step: number) { currentStep.value = step }
</script>

<style scoped>
.mr-protocol-section { padding: 80px 24px; }
.mr-protocol-container { max-width: 1000px; margin: 0 auto; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 300; margin-bottom: 24px; color: #fff; }

.mr-protocol-table { background: rgba(17, 17, 17, 0.5); border: 1px solid #222; border-radius: 8px; overflow: hidden; margin-top: 24px; }

.mr-protocol-row { display: grid; grid-template-columns: 80px 1fr 80px 100px; align-items: center; padding: 20px 24px; border-bottom: 1px solid #222; cursor: pointer; transition: all 0.3s ease; gap: 16px; }
.mr-protocol-row:hover { background: rgba(0, 255, 136, 0.02); border-left: 3px solid rgb(0, 255, 136); }
.mr-protocol-row:last-child { border-bottom: none; }

.mr-protocol-code span { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); padding: 4px 8px; border: 1px solid rgb(0, 255, 136); border-radius: 4px; }
.mr-protocol-info { display: flex; flex-direction: column; gap: 4px; }
.mr-protocol-name { font-weight: 600; font-size: 16px; color: #fff; }
.mr-protocol-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); letter-spacing: 1px; }
.mr-protocol-duration { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #fff; }

.mr-protocol-details-btn { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: transparent; border: 1px solid #222; border-radius: 6px; color: rgb(0, 255, 136); cursor: pointer; transition: all 0.3s ease; }
.mr-protocol-details-btn:hover { background: rgb(0, 255, 136); border-color: rgb(0, 255, 136); color: #000; }
.mr-protocol-details-btn span { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; }

/* Footer */
.mr-protocol-footer { display: flex; flex-direction: column; align-items: center; padding: 32px; background: rgba(0, 255, 136, 0.05); border: 2px solid rgb(0, 255, 136); border-radius: 12px; margin-top: 24px; gap: 24px; }
.mr-protocol-footer-header { display: flex; justify-content: space-between; align-items: center; width: 100%; padding-bottom: 16px; border-bottom: 1px solid rgba(0, 255, 136, 0.2); }
.mr-protocol-summary-label { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
.mr-protocol-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: rgb(0, 255, 136); font-weight: 600; text-align: center; margin: 0; }
.mr-protocol-footer-duration { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: rgb(0, 255, 136); font-weight: 700; }

.mr-protocol-package-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }

.mr-package-card { background: rgba(17, 17, 17, 0.5); border: 1px solid #222; border-radius: 8px; padding: 20px 16px; text-align: center; transition: all 0.3s ease; }
.mr-package-card:hover { border-color: rgb(0, 255, 136); transform: translateY(-2px); }

/* Glassmorphism icon */
.mr-package-icon-glass {
  width: 48px; height: 48px; margin: 0 auto 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  background-image: linear-gradient(135deg, rgba(0, 255, 136, 0.1), transparent), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  background-clip: padding-box, border-box; background-origin: padding-box, border-box;
  border: 1px solid transparent; position: relative;
}
.mr-package-icon-glass::before { content: ''; position: absolute; inset: 0; border-radius: 12px; padding: 1px; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 50%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
.mr-package-icon-glass svg { color: rgb(0, 255, 136); }

.mr-package-title { font-size: 13px; font-weight: 600; color: #fff; }

.mr-protocol-cta { display: inline-flex; align-items: center; gap: 8px; padding: 16px 40px; background: rgb(0, 255, 136); color: #000; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; border: none; cursor: pointer; border-radius: 6px; }
.mr-protocol-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }

@media (max-width: 900px) {
  .mr-protocol-row { grid-template-columns: 70px 1fr 60px; }
  .mr-protocol-details-btn { display: none; }
  .mr-protocol-package-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Modal */
.mr-protocol-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: flex-start; justify-content: center; padding: 40px; padding-bottom: 100px; overflow-y: auto; }

.mr-protocol-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: transparent; border: 2px solid rgb(0, 255, 136); color: rgb(0, 255, 136); cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; }
.mr-protocol-modal-close::before, .mr-protocol-modal-close::after { content: ''; position: absolute; top: 50%; left: 50%; width: 36px; height: 2px; background: currentColor; }
.mr-protocol-modal-close::before { transform: translate(-50%, -50%) rotate(45deg); }
.mr-protocol-modal-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
.mr-protocol-modal-close:hover { background: rgb(0, 255, 136); color: #000; }

.mr-protocol-modal-content { max-width: 900px; width: 100%; margin-top: 60px; }

/* Mobile close */
.mr-protocol-mobile-close { display: none; }
@media (max-width: 768px) {
  .mr-desktop-only { display: none !important; }
  .mr-protocol-modal-overlay { padding: 20px; padding-bottom: 80px; }
  .mr-protocol-modal-content { margin-top: 20px; }
  .mr-protocol-mobile-close { display: block; position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: #000; z-index: 10002; }
  .mr-protocol-mobile-close-btn { width: 100%; padding: 16px; background: transparent; border: 2px solid rgb(0, 255, 136); color: rgb(0, 255, 136); font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 2px; border-radius: 8px; cursor: pointer; }
  .mr-protocol-mobile-close-btn:hover { background: rgb(0, 255, 136); color: #000; }
}

/* Step Indicator */
.mr-protocol-step-indicator { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 32px; }
.mr-step-dot { width: 36px; height: 36px; border-radius: 50%; background: transparent; border: 2px solid #333; color: #555; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; transition: all 0.3s ease; cursor: pointer; }
.mr-step-dot:hover { border-color: #555; }
.mr-step-dot.active { background: rgba(0, 255, 136, 0.1); border-color: rgb(0, 255, 136); color: rgb(0, 255, 136); box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }
.mr-step-dot.passed { border-color: rgb(0, 255, 136); color: rgb(0, 255, 136); }
.mr-step-dot.final { padding: 0; }
.mr-step-dot.final svg { width: 14px; height: 14px; }
.mr-step-line { height: 2px; width: 40px; background: #333; transition: all 0.3s ease; }
.mr-step-line.passed { background: rgb(0, 255, 136); }

/* Navigation */
.mr-protocol-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #222; }
.mr-protocol-nav-btn { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; padding: 12px 24px; background: transparent; color: #888; border: 1px solid #222; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; }
.mr-protocol-nav-btn:hover { color: rgb(0, 255, 136); border-color: rgb(0, 255, 136); }
.mr-protocol-nav-btn.next { background: rgba(0, 255, 136, 0.05); color: rgb(0, 255, 136); border-color: rgb(0, 255, 136); }
.mr-protocol-nav-btn.next:hover { background: rgb(0, 255, 136); color: #000; }
.mr-protocol-nav-btn.hidden { visibility: hidden; }
</style>

<style>
/* Global modal content styles */
.mr-modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
.mr-modal-title { font-size: 28px; font-weight: 600; color: rgb(0, 255, 136); }
.mr-protocol-modal-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); padding: 6px 12px; border: 1px solid rgb(0, 255, 136); border-radius: 4px; }

.mr-details-meta { margin-bottom: 24px; }
.mr-details-meta-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px; }
.mr-details-meta-row:last-child { border-bottom: none; }
.mr-details-meta-label { color: #555; }
.mr-details-meta-value { color: #fff; font-weight: 600; }
.mr-details-meta-value.accent { color: rgb(0, 255, 136); }

.mr-protocol-modal-method { padding: 16px; background: rgba(0, 255, 136, 0.05); border-left: 2px solid rgb(0, 255, 136); margin-bottom: 24px; font-size: 14px; color: #888; }

.mr-protocol-modal-roadmap { margin-bottom: 24px; }
.mr-roadmap-step { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid #222; }
.mr-roadmap-step:last-child { border-bottom: none; }
.mr-roadmap-step-days { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgb(0, 255, 136); min-width: 60px; font-weight: 700; }
.mr-roadmap-step-title { font-weight: 600; font-size: 14px; color: #fff; margin-bottom: 4px; }
.mr-roadmap-step-desc { font-size: 13px; color: #888; }

.mr-details-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.mr-details-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 8px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); color: rgb(0, 255, 136); border-radius: 6px; }

/* Slot styles */
.mr-slot-header { text-align: center; margin-bottom: 32px; }
.mr-slot-title { font-size: 28px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.mr-slot-subtitle { font-size: 14px; color: #555; }
.mr-slot-offer { margin-bottom: 24px; }
.mr-slot-offer-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); letter-spacing: 2px; margin-bottom: 8px; }
.mr-slot-offer-title { font-size: 20px; color: #fff; margin-bottom: 16px; }
.mr-slot-duration-label { font-size: 12px; color: #555; display: block; margin-bottom: 4px; }
.mr-slot-duration-value { font-family: 'JetBrains Mono', monospace; font-size: 32px; color: rgb(0, 255, 136); font-weight: 600; }
.mr-slot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
@media (max-width: 600px) { .mr-slot-grid { grid-template-columns: 1fr; } }
.mr-slot-box { padding: 20px; background: rgba(10, 10, 10, 0.5); border-radius: 8px; border: 1px solid #222; }
.mr-slot-box-label { color: #555; font-size: 11px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
.mr-slot-list { margin: 0; padding: 0; list-style: none; color: #fff; font-size: 14px; line-height: 1.8; }
.mr-slot-list li { padding: 4px 0; border-bottom: 1px solid #222; }
.mr-slot-list li:last-child { border-bottom: none; }
.mr-slot-price { font-size: 32px; color: rgb(0, 255, 136); font-weight: 600; }
.mr-slot-price-note { font-size: 11px; color: #555; margin-top: 8px; }
.mr-pixel-perfect-badge { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgb(0, 255, 136); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgb(0, 255, 136); letter-spacing: 1px; margin-bottom: 24px; }
.mr-pixel-perfect-badge svg { width: 16px; height: 16px; flex-shrink: 0; }
.mr-slot-cta { display: flex; width: 100%; justify-content: center; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: rgb(0, 255, 136); color: #000; text-decoration: none; border-radius: 6px; transition: all 0.3s ease; }
.mr-slot-cta:hover { box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }
</style>
