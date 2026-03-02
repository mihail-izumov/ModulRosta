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
      <div v-if="modalOpen" class="mr-protocol-modal-wrapper">
        <div class="mr-protocol-modal-overlay" @click.self="closeModal">
          <button class="mr-protocol-modal-close mr-desktop-only" @click="closeModal"></button>
          
          <div class="mr-protocol-modal-scroll">
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
              <div class="mr-protocol-step-content">
                <!-- Step 0: Scout -->
                <div v-if="currentStep === 0" class="mr-step-scout">
                  <div class="mr-modal-header"><span class="mr-protocol-modal-code">MOD-01</span><h2 class="mr-modal-title">Разведка</h2></div>
                  <div class="mr-details-meta">
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">7–10д</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Цена</span><span class="mr-details-meta-value">150 000 ₽</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">Бренд-платформа + GO/NO-GO</span></div>
                  </div>
                  <div class="mr-protocol-modal-method">Глубинные интервью, анализ конкурентов, позиционирование.</div>
                  <div class="mr-protocol-modal-roadmap">
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">1–3</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Погружение</div><div class="mr-roadmap-step-desc">Интервью с основателем, изучение рынка.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">4–6</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Позиционирование</div><div class="mr-roadmap-step-desc">Анализ конкурентов, поиск дифференциации.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">7–10</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Стратегия</div><div class="mr-roadmap-step-desc">Бренд-платформа, GO/NO-GO вердикт.</div></div></div>
                  </div>
                  <div class="mr-details-tags"><span class="mr-details-tag">Бренд-платформа</span><span class="mr-details-tag">Позиционирование</span><span class="mr-details-tag">Анализ конкурентов</span><span class="mr-details-tag">GO/NO-GO</span></div>
                </div>

                <!-- Step 1: Checkup -->
                <div v-if="currentStep === 1" class="mr-step-checkup">
                  <div class="mr-modal-header"><span class="mr-protocol-modal-code">MOD-02</span><h2 class="mr-modal-title">Чертёж</h2></div>
                  <div class="mr-details-meta">
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">АЙДЕНТИКА И ИНТЕРФЕЙС</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">30д</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Цена</span><span class="mr-details-meta-value">350 000 ₽</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">Дизайн-система + Прототип</span></div>
                  </div>
                  <div class="mr-protocol-modal-method">Создаём визуальную идентичность и проектируем интерфейс.</div>
                  <!-- Artifact Gallery -->
                  <div class="mr-artifact-gallery">
                    <div class="mr-artifact-card">
                      <div class="mr-artifact-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg></div>
                      <div class="mr-artifact-card-title">Логотип и айдентика</div>
                      <div class="mr-artifact-card-desc">Основные носители</div>
                    </div>
                    <div class="mr-artifact-card">
                      <div class="mr-artifact-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg></div>
                      <div class="mr-artifact-card-title">UI-кит</div>
                      <div class="mr-artifact-card-desc">Компоненты и стили</div>
                    </div>
                    <div class="mr-artifact-card">
                      <div class="mr-artifact-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></div>
                      <div class="mr-artifact-card-title">Макеты</div>
                      <div class="mr-artifact-card-desc">Кликабельный прототип</div>
                    </div>
                  </div>
                  <div class="mr-protocol-modal-roadmap">
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">1–7</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Айдентика</div><div class="mr-roadmap-step-desc">Логотип, цвета, типографика.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">8–18</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">UI-кит</div><div class="mr-roadmap-step-desc">Компоненты, иконки, формы.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">19–26</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Прототип</div><div class="mr-roadmap-step-desc">Кликабельный макет.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">27–30</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Финализация</div><div class="mr-roadmap-step-desc">Гайдлайны, исходники.</div></div></div>
                  </div>
                  <div class="mr-details-tags"><span class="mr-details-tag">Логотип и айдентика</span><span class="mr-details-tag">UI-кит</span><span class="mr-details-tag">Прототип</span><span class="mr-details-tag">Гайдлайны</span></div>
                </div>

                <!-- Step 2: Execute -->
                <div v-if="currentStep === 2" class="mr-step-execute">
                  <div class="mr-modal-header"><span class="mr-protocol-modal-code">MOD-03</span><h2 class="mr-modal-title">Сборка</h2></div>
                  <div class="mr-details-meta">
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">ДИЗАЙН В КОДЕ</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">30д</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Цена</span><span class="mr-details-meta-value">по запросу</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">Рабочий продукт</span></div>
                  </div>
                  <div class="mr-protocol-modal-method">Превращаем дизайн в работающий продукт. Pixel-perfect.</div>
                  <!-- Assembly Animation -->
                  <div class="mr-module-assembly-visual">
                    <div class="mr-assembly-block header">HEADER</div>
                    <div class="mr-assembly-block sidebar">SIDEBAR</div>
                    <div class="mr-assembly-block content">CONTENT</div>
                    <div class="mr-assembly-scanner"></div>
                  </div>
                  <div class="mr-protocol-modal-roadmap">
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">1–10</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Фронтенд</div><div class="mr-roadmap-step-desc">Pixel-perfect вёрстка.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">11–20</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Бэкенд</div><div class="mr-roadmap-step-desc">Бизнес-логика, API.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">21–25</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Интеграции</div><div class="mr-roadmap-step-desc">Платежи, аналитика.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">26–30</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Релиз</div><div class="mr-roadmap-step-desc">Деплой, документация.</div></div></div>
                  </div>
                  <div class="mr-pixel-perfect-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>ТОЧНОСТЬ ДО ПИКСЕЛЯ: Полное соответствие кода дизайн-макетам</div>
                  <div class="mr-details-tags"><span class="mr-details-tag">Рабочий продукт</span><span class="mr-details-tag">Исходный код</span><span class="mr-details-tag">Документация</span><span class="mr-details-tag">7д поддержки</span></div>
                </div>

                <!-- Step 3: Slot -->
                <div v-if="currentStep === 3" class="mr-step-slot">
                  <div class="mr-slot-header"><h2 class="mr-slot-title">От идеи до бренда и продукта</h2><p class="mr-slot-subtitle">Стратегия → Айдентика → Интерфейс → Код. Единая система.</p></div>
                  <div class="mr-slot-offer"><div class="mr-slot-offer-label">LAUNCH PAD • ПОЛНЫЙ ЦИКЛ</div><h3 class="mr-slot-offer-title">Бренд-платформа + Дизайн-система + Рабочий продукт</h3><div class="mr-slot-duration"><span class="mr-slot-duration-label">Срок реализации</span><span class="mr-slot-duration-value">60 дней</span></div></div>
                  <div class="mr-slot-grid"><div class="mr-slot-box"><div class="mr-slot-box-label">ВХОДИТ В ПАКЕТ:</div><ul class="mr-slot-list"><li>→ Аудит и Стратегия (MOD-01)</li><li>→ Дизайн-система и Прототип (MOD-02)</li><li>→ Разработка и Релиз (MOD-03)</li></ul></div><div class="mr-slot-box mr-slot-price-box"><div class="mr-slot-box-label">СТОИМОСТЬ СЛОТА:</div><div class="mr-slot-price">от 500 000 ₽</div><div class="mr-slot-price-note">*оплата поэтапная (3 транша)</div></div></div>
                  <a href="https://t.me/runScale" target="_blank" class="mr-slot-cta">ЗАБРОНИРОВАТЬ СЛОТ →</a>
                </div>
              </div>

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
          </div>
        </div>
        
        <!-- Mobile close - OUTSIDE scroll container -->
        <div class="mr-protocol-mobile-close">
          <button class="mr-protocol-mobile-close-btn" @click="closeModal">ЗАКРЫТЬ</button>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const modalOpen = ref(false)
const currentStep = ref(0)

const protocolItems = [
  { id: 'scout', code: 'MOD-01', title: 'Разведка', subtitle: 'СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ', duration: '7–10д' },
  { id: 'checkup', code: 'MOD-02', title: 'Чертёж', subtitle: 'АЙДЕНТИКА И ИНТЕРФЕЙС', duration: '30д' },
  { id: 'execute', code: 'MOD-03', title: 'Сборка', subtitle: 'ДИЗАЙН В КОДЕ', duration: '30д' }
]

function openProtocolModal(modeId: string) {
  const stepMap: Record<string, number> = { scout: 0, checkup: 1, execute: 2, slot: 3 }
  currentStep.value = stepMap[modeId] ?? 0
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
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 500; margin-bottom: 24px; color: #fff; }

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
.mr-protocol-summary-label { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
.mr-protocol-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: rgb(0, 255, 136); font-weight: 600; text-align: center; margin: 0; }
.mr-protocol-footer-duration { font-family: 'JetBrains Mono', monospace; font-size: 24px; color: rgb(0, 255, 136); font-weight: 700; }

.mr-protocol-package-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }

.mr-package-card { background: rgba(17, 17, 17, 0.5); border: 1px solid #222; border-radius: 8px; padding: 20px 16px; text-align: center; }

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

.mr-protocol-cta { display: inline-flex; align-items: center; gap: 8px; padding: 16px 40px; background: rgb(0, 255, 136) !important; color: #000 !important; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; border: none !important; cursor: pointer; border-radius: 6px; text-decoration: none !important; }
.mr-protocol-cta::before, .mr-protocol-cta::after { display: none !important; content: none !important; }
.mr-protocol-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }

@media (max-width: 900px) {
  .mr-protocol-row { grid-template-columns: 70px 1fr 60px; }
  .mr-protocol-details-btn { display: none; }
  .mr-protocol-package-grid { grid-template-columns: repeat(2, 1fr); }
  .mr-protocol-summary-label { font-size: 14px; }
  .mr-protocol-footer-duration { font-size: 18px; }
}

/* Modal Wrapper */
.mr-protocol-modal-wrapper { position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; }

.mr-protocol-modal-overlay { flex: 1; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); display: flex; align-items: flex-start; justify-content: center; overflow: hidden; }

.mr-protocol-modal-scroll { flex: 1; overflow-y: auto; padding: 40px; padding-bottom: 100px; width: 100%; display: flex; justify-content: center; }

.mr-protocol-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: transparent !important; border: 2px solid rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; }
.mr-protocol-modal-close::before, .mr-protocol-modal-close::after { content: ''; position: absolute; top: 50%; left: 50%; width: 36px; height: 2px; background: currentColor; }
.mr-protocol-modal-close::before { transform: translate(-50%, -50%) rotate(45deg); }
.mr-protocol-modal-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
.mr-protocol-modal-close:hover { background: rgb(0, 255, 136) !important; color: #000 !important; }

.mr-protocol-modal-content { max-width: 900px; width: 100%; margin-top: 60px; }

/* Mobile close - fixed at bottom */
.mr-protocol-mobile-close { display: none; }
@media (max-width: 768px) {
  .mr-desktop-only { display: none !important; }
  .mr-protocol-modal-scroll { padding: 20px; padding-bottom: 100px; }
  .mr-protocol-modal-content { margin-top: 20px; }
  .mr-protocol-mobile-close { display: block; background: #000; padding: 16px; border-top: 1px solid #222; }
  .mr-protocol-mobile-close-btn { width: 100%; padding: 16px; background: #000 !important; border: 2px solid rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 2px; border-radius: 8px; cursor: pointer; text-decoration: none !important; }
  .mr-protocol-mobile-close-btn:hover { background: rgb(0, 255, 136) !important; color: #000 !important; }
  .mr-protocol-mobile-close-btn::before, .mr-protocol-mobile-close-btn::after { display: none !important; }
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
.mr-protocol-nav-btn { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; padding: 12px 24px; background: transparent !important; color: #888 !important; border: 1px solid #222 !important; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; text-decoration: none !important; }
.mr-protocol-nav-btn::before, .mr-protocol-nav-btn::after { display: none !important; }
.mr-protocol-nav-btn:hover { color: rgb(0, 255, 136) !important; border-color: rgb(0, 255, 136) !important; }
.mr-protocol-nav-btn.next { background: rgba(0, 255, 136, 0.05) !important; color: rgb(0, 255, 136) !important; border-color: rgb(0, 255, 136) !important; }
.mr-protocol-nav-btn.next:hover { background: rgb(0, 255, 136) !important; color: #000 !important; }
.mr-protocol-nav-btn.hidden { visibility: hidden; }

/* Step Content Styles */
.mr-modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
.mr-modal-title { font-size: 28px; font-weight: 600; color: rgb(0, 255, 136); margin: 0; }
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

/* Artifact Gallery for MOD-02 */
.mr-artifact-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
@media (max-width: 600px) { .mr-artifact-gallery { grid-template-columns: 1fr; } }
.mr-artifact-card { background: rgba(17, 17, 17, 0.8); border: 1px solid #222; border-radius: 8px; padding: 20px; text-align: center; transition: all 0.3s ease; }
.mr-artifact-card:hover { border-color: rgb(0, 255, 136); transform: translateY(-2px); }
.mr-artifact-card-icon { width: 48px; height: 48px; margin: 0 auto 12px; background: rgba(0, 255, 136, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: rgb(0, 255, 136); }
.mr-artifact-card-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.mr-artifact-card-desc { font-size: 11px; color: #555; }

/* Assembly Animation for MOD-03 */
.mr-module-assembly-visual { position: relative; height: 200px; background: linear-gradient(90deg, #222 1px, transparent 1px) 0 0 / 20px 20px, linear-gradient(#222 1px, transparent 1px) 0 0 / 20px 20px; border: 1px solid #222; border-radius: 8px; margin: 24px 0; overflow: hidden; }
.mr-assembly-block { position: absolute; background: #111; border: 1px solid rgb(0, 255, 136); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgb(0, 255, 136); animation: mr-assemblyFly 2s ease-out forwards; opacity: 0; }
.mr-assembly-block.header { width: 80%; height: 30px; top: 10px; left: 10%; animation-delay: 0s; }
.mr-assembly-block.sidebar { width: 20%; height: 120px; top: 50px; left: 5%; animation-delay: 0.3s; }
.mr-assembly-block.content { width: 65%; height: 120px; top: 50px; right: 5%; animation-delay: 0.6s; }
@keyframes mr-assemblyFly { 0% { transform: translateY(-50px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
.mr-assembly-scanner { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, transparent, rgb(0, 255, 136), transparent); animation: mr-scanDown 2s ease-in-out 1.2s infinite; opacity: 0; }
@keyframes mr-scanDown { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

/* Pixel Perfect Badge */
.mr-pixel-perfect-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgb(0, 255, 136); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgb(0, 255, 136); letter-spacing: 1px; margin-bottom: 24px; }
.mr-pixel-perfect-badge svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Slot styles */
.mr-slot-header { text-align: center; margin-bottom: 32px; }
.mr-slot-title { font-size: 28px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.mr-slot-subtitle { font-size: 14px; color: #555; margin: 0; }
.mr-slot-offer { margin-bottom: 24px; }
.mr-slot-offer-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); letter-spacing: 2px; margin-bottom: 8px; }
.mr-slot-offer-title { font-size: 20px; color: #fff; margin: 0 0 16px 0; }
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
.mr-slot-cta { display: flex; width: 100%; justify-content: center; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: rgb(0, 255, 136) !important; color: #000 !important; text-decoration: none !important; border-radius: 6px; transition: all 0.3s ease; border: none !important; }
.mr-slot-cta::before, .mr-slot-cta::after { display: none !important; }
.mr-slot-cta:hover { box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }
</style>
