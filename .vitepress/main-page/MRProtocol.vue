<template>
  <section class="mr-protocol-section" id="mr-launch-protocol">
    <div class="mr-protocol-container">
      <div class="mr-section-label">ПРОТОКОЛ ЗАПУСКА</div>
      <h2 class="mr-section-title">Запуск цифрового продукта</h2>

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
        <div class="mr-protocol-footer-label">ВСЁ ВКЛЮЧЕНО</div>
        <p class="mr-protocol-footer-text">Стратегия, дизайн-система, интерфейс, код, запуск и&nbsp;сопровождение&nbsp;— одна команда, один процесс, один результат.</p>
        <button class="mr-protocol-cta" @click="openProtocolModal('slot')">Детали</button>
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
                <!-- Step 0: Scout / ВИДИМ -->
                <div v-if="currentStep === 0" class="mr-step-scout">
                  <div class="mr-modal-header"><span class="mr-protocol-modal-code">ЗАП-01</span><h2 class="mr-modal-title">Разведка</h2></div>
                  <div class="mr-details-meta">
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">ВИДИМ ЧТО ТОРМОЗИТ РОСТ</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">~20д</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">Карта модулей + Стратегия запуска</span></div>
                  </div>
                  <div class="mr-protocol-modal-method">Видим архитектуру бизнеса в цифре до того, как её описал клиент. Не симптомы — причину.</div>
                  <div class="mr-protocol-modal-roadmap">
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">1–3</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Ранскейл-сессия</div><div class="mr-roadmap-step-desc">Погружение в бизнес. Интервью с основателем, определение узких горлышек.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">4–10</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Чекап</div><div class="mr-roadmap-step-desc">10 направлений, 180 метрик. Карта модулей бизнеса в цифре. Порядок запуска.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">11–17</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Радар</div><div class="mr-roadmap-step-desc">Анализ рынка, конкуренты, проверка гипотез. Карта возможностей.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">18–20</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Стратегия</div><div class="mr-roadmap-step-desc">Какой модуль первым. Что даст максимальный эффект. GO/NO-GO.</div></div></div>
                  </div>
                  <div class="mr-details-tags"><span class="mr-details-tag">Ранскейл-сессия</span><span class="mr-details-tag">Чекап 180 метрик</span><span class="mr-details-tag">Радар рынка</span><span class="mr-details-tag">GO/NO-GO</span></div>
                </div>

                <!-- Step 1: Checkup / ЗАПУСКАЕМ -->
                <div v-if="currentStep === 1" class="mr-step-checkup">
                  <div class="mr-modal-header"><span class="mr-protocol-modal-code">ЗАП-02</span><h2 class="mr-modal-title">Симуляция</h2></div>
                  <div class="mr-details-meta">
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">ПРОВЕРЯЕМ РЕШЕНИЕ ДО ЗАПУСКА</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">~20д</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">Прототип модуля + Проверенные гипотезы</span></div>
                  </div>
                  <div class="mr-protocol-modal-method">Собираем решение и проверяем на реальных данных. Маленькая версия → ошибки → корректировка → масштаб.</div>
                  <!-- Artifact Gallery -->
                  <div class="mr-artifact-gallery">
                    <div class="mr-artifact-card">
                      <div class="mr-artifact-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg></div>
                      <div class="mr-artifact-card-title">Архитектура модуля</div>
                      <div class="mr-artifact-card-desc">Структура, логика, связи</div>
                    </div>
                    <div class="mr-artifact-card">
                      <div class="mr-artifact-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></div>
                      <div class="mr-artifact-card-title">Рабочий прототип</div>
                      <div class="mr-artifact-card-desc">Кликабельная версия на реальных данных</div>
                    </div>
                    <div class="mr-artifact-card">
                      <div class="mr-artifact-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
                      <div class="mr-artifact-card-title">Данные и метрики</div>
                      <div class="mr-artifact-card-desc">Проверка гипотез на цифрах</div>
                    </div>
                  </div>
                  <div class="mr-protocol-modal-roadmap">
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">1–5</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Архитектура</div><div class="mr-roadmap-step-desc">Структура модуля, бизнес-логика, потоки данных.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">6–12</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Прототип</div><div class="mr-roadmap-step-desc">Рабочая версия на реальных данных. Итерации по обратной связи.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">13–17</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Проверка</div><div class="mr-roadmap-step-desc">Тестирование гипотез. Корректировка на основе данных.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">18–20</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Финализация</div><div class="mr-roadmap-step-desc">Готовность к боевому запуску. Документация.</div></div></div>
                  </div>
                  <div class="mr-details-tags"><span class="mr-details-tag">Архитектура модуля</span><span class="mr-details-tag">Рабочий прототип</span><span class="mr-details-tag">Тест на данных</span><span class="mr-details-tag">Готовность к запуску</span></div>
                </div>

                <!-- Step 2: Execute / РАСШИРЯЕМ -->
                <div v-if="currentStep === 2" class="mr-step-execute">
                  <div class="mr-modal-header"><span class="mr-protocol-modal-code">ЗАП-03</span><h2 class="mr-modal-title">Запуск</h2></div>
                  <div class="mr-details-meta">
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Этап</span><span class="mr-details-meta-value accent">МОДУЛЬ В БОЮ</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Срок</span><span class="mr-details-meta-value">~20д</span></div>
                    <div class="mr-details-meta-row"><span class="mr-details-meta-label">Результат</span><span class="mr-details-meta-value accent">Рабочий модуль на ваших данных</span></div>
                  </div>
                  <div class="mr-protocol-modal-method">Модуль работает. На ваших данных, в вашем бизнесе. Пока конкуренты думают — вы уже запустили.</div>
                  <!-- Assembly Animation -->
                  <div class="mr-module-assembly-visual">
                    <div class="mr-assembly-block header">HEADER</div>
                    <div class="mr-assembly-block sidebar">SIDEBAR</div>
                    <div class="mr-assembly-block content">CONTENT</div>
                    <div class="mr-assembly-scanner"></div>
                  </div>
                  <div class="mr-protocol-modal-roadmap">
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">1–7</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Разработка</div><div class="mr-roadmap-step-desc">Фронтенд, бэкенд, бизнес-логика. Pixel-perfect по прототипу.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">8–13</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Интеграции</div><div class="mr-roadmap-step-desc">Подключение к системам бизнеса. Платежи, аналитика, API.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">14–17</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Боевой тест</div><div class="mr-roadmap-step-desc">Модуль работает на реальных данных. Отладка под нагрузкой.</div></div></div>
                    <div class="mr-roadmap-step"><div class="mr-roadmap-step-days">18–20</div><div class="mr-roadmap-step-content"><div class="mr-roadmap-step-title">Деплой</div><div class="mr-roadmap-step-desc">Релиз, документация, передача управления.</div></div></div>
                  </div>
                  <div class="mr-pixel-perfect-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>РАБОТАЕТ 24/7: Без зарплаты. Без больничных. Без совещаний.</div>
                  <div class="mr-details-tags"><span class="mr-details-tag">Рабочий модуль</span><span class="mr-details-tag">Исходный код</span><span class="mr-details-tag">Документация</span><span class="mr-details-tag">7д поддержки</span></div>
                </div>

                <!-- Step 3: Slot -->
                <div v-if="currentStep === 3" class="mr-step-slot">
                  <div class="mr-slot-header"><h2 class="mr-slot-title">Всё включено</h2></div>
                  <div class="mr-slot-offer"><div class="mr-slot-offer-label">ПОЛНЫЙ ЗАПУСК</div><h3 class="mr-slot-offer-title">Стратегия, дизайн, код, запуск — одна команда, один результат.</h3><div class="mr-slot-duration"><span class="mr-slot-duration-label">Срок реализации</span><span class="mr-slot-duration-value mr-slot-duration-small">~60д</span></div></div>
                  <div class="mr-slot-grid"><div class="mr-slot-box"><div class="mr-slot-box-label">ВХОДИТ:</div><ul class="mr-slot-list"><li>→ ЗАП-01  Разведка</li><li>→ ЗАП-02  Симуляция</li><li>→ ЗАП-03  Запуск</li></ul></div><div class="mr-slot-box mr-slot-price-box"><div class="mr-slot-box-label">СТОИМОСТЬ СЛОТА:</div><div class="mr-slot-price">от 800 000 ₽</div><div class="mr-slot-price-note">*оплата поэтапная (3 транша)</div></div></div>
                  <a href="https://runscale.ru/book-my-launch" target="_blank" class="mr-slot-cta">ЗАБРОНИРОВАТЬ СЛОТ →</a>
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
  { id: 'scout', code: 'ЗАП-01', title: 'Разведка', subtitle: 'НАХОДИМ ЧТО ТОРМОЗИТ РОСТ', duration: '~20д' },
  { id: 'checkup', code: 'ЗАП-02', title: 'Симуляция', subtitle: 'ПРОВЕРЯЕМ РЕШЕНИЕ', duration: '~20д' },
  { id: 'execute', code: 'ЗАП-03', title: 'Запуск', subtitle: 'РЕШЕНИЕ РАБОТАЕТ', duration: '~20д' }
]

function openProtocolModal(modeId: string) {
  const stepMap: Record<string, number> = { scout: 0, checkup: 1, execute: 2, slot: 3 }
  currentStep.value = stepMap[modeId] ?? 0
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() { modalOpen.value = false; document.body.style.overflow = '' }
function nextStep() { 
  if (currentStep.value < 3) {
    currentStep.value++
    scrollToTop()
  }
}
function prevStep() { 
  if (currentStep.value > 0) {
    currentStep.value--
    scrollToTop()
  }
}
function scrollToTop() {
  const scrollEl = document.querySelector('.mr-protocol-modal-scroll')
  if (scrollEl) scrollEl.scrollTop = 0
}
function goToStep(step: number) { currentStep.value = step }
</script>

<style scoped>
.mr-protocol-section { padding: 80px 24px; overflow-x: hidden; }
.mr-protocol-container { max-width: 1100px; margin: 0 auto; }
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
.mr-protocol-footer {
  display: flex; flex-direction: column; align-items: flex-start; padding: 32px;
  background:
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(0, 255, 136, 0.03) 10px,
      rgba(0, 255, 136, 0.03) 20px
    ),
    rgba(0, 255, 136, 0.05);
  border: 2px solid rgb(0, 255, 136); border-radius: 12px; margin-top: 24px; gap: 16px;
}
.mr-protocol-footer-label { font-size: clamp(28px, 5vw, 42px); font-weight: 500; color: #fff; }
.mr-protocol-footer-text { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: rgb(0, 255, 136); margin: 0; line-height: 1.7; max-width: 600px; letter-spacing: 0.5px; }

.mr-protocol-cta { display: inline-flex; align-items: center; gap: 8px; padding: 16px 40px; background: rgb(0, 255, 136) !important; color: #000 !important; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; border: none !important; cursor: pointer; border-radius: 6px; text-decoration: none !important; margin-top: 8px; }
.mr-protocol-cta::before, .mr-protocol-cta::after { display: none !important; content: none !important; }
.mr-protocol-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }

@media (max-width: 900px) {
  .mr-protocol-row { grid-template-columns: 70px 1fr 60px; }
  .mr-protocol-details-btn { display: none; }
  .mr-protocol-cta { width: 100%; justify-content: center; }
}

/* Modal Wrapper */
.mr-protocol-modal-wrapper { position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; }

.mr-protocol-modal-overlay { flex: 1; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); display: flex; flex-direction: column; overflow: hidden; }

.mr-protocol-modal-scroll { flex: 1; overflow-y: auto; padding: 40px; padding-bottom: 100px; display: flex; justify-content: center; align-items: flex-start; }

.mr-protocol-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: transparent !important; border: 2px solid rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; }
.mr-protocol-modal-close::before, .mr-protocol-modal-close::after { content: ''; position: absolute; top: 50%; left: 50%; width: 36px; height: 2px; background: currentColor; }
.mr-protocol-modal-close::before { transform: translate(-50%, -50%) rotate(45deg); }
.mr-protocol-modal-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
.mr-protocol-modal-close:hover { background: rgb(0, 255, 136) !important; color: #000 !important; }

.mr-protocol-modal-content { max-width: 900px; width: 100%; }

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

/* Artifact Gallery for ЗАП-02 */
.mr-artifact-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
@media (max-width: 600px) { .mr-artifact-gallery { grid-template-columns: 1fr; } }
.mr-artifact-card { background: rgba(17, 17, 17, 0.8); border: 1px solid #222; border-radius: 8px; padding: 20px; text-align: center; transition: all 0.3s ease; }
.mr-artifact-card:hover { border-color: rgb(0, 255, 136); transform: translateY(-2px); }
.mr-artifact-card-icon { width: 48px; height: 48px; margin: 0 auto 12px; background: rgba(0, 255, 136, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: rgb(0, 255, 136); }
.mr-artifact-card-title { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.mr-artifact-card-desc { font-size: 11px; color: #555; }

/* Assembly Animation for ЗАП-03 */
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
.mr-slot-duration-value.mr-slot-duration-small { font-size: 14px; color: #555; font-weight: 700; letter-spacing: 1px; }
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
