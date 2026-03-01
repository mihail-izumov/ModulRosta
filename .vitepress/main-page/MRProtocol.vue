<template>
  <section class="mr-launch-protocol-section" id="mr-launch-protocol">
    <div class="mr-launch-protocol-container">
      <div class="mr-section-label">ПРОТОКОЛ ЗАПУСКА</div>
      <h2 class="mr-section-title">Запуск цифрового модуля</h2>

      <div class="mr-protocol-table">
        <!-- Row: Scout -->
        <div 
          class="mr-protocol-row" 
          @click="openModal('scout')"
          @mousemove="handleMouseMove"
        >
          <div class="mr-protocol-code"><span>MOD-01</span></div>
          <div class="mr-protocol-info">
            <span class="mr-protocol-name">Разведка</span>
            <span class="mr-protocol-subtitle">СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ</span>
          </div>
          <div class="mr-protocol-duration">7–10 дней</div>
          <div class="mr-protocol-result">→ Бренд-платформа + GO/NO-GO</div>
          <div class="mr-protocol-price">150 000 ₽</div>
          <div class="mr-protocol-details-btn">
            <div class="mr-build-details-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
            </div>
            <span class="mr-details-text">ДЕТАЛИ</span>
          </div>
        </div>

        <!-- Row: Checkup -->
        <div 
          class="mr-protocol-row" 
          @click="openModal('checkup')"
          @mousemove="handleMouseMove"
        >
          <div class="mr-protocol-code"><span>MOD-02</span></div>
          <div class="mr-protocol-info">
            <span class="mr-protocol-name">Чертёж</span>
            <span class="mr-protocol-subtitle">АЙДЕНТИКА И ИНТЕРФЕЙС</span>
          </div>
          <div class="mr-protocol-duration">30 дней</div>
          <div class="mr-protocol-result">→ Дизайн-система + Прототип</div>
          <div class="mr-protocol-price">350 000 ₽</div>
          <div class="mr-protocol-details-btn">
            <div class="mr-build-details-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
            </div>
            <span class="mr-details-text">ДЕТАЛИ</span>
          </div>
        </div>

        <!-- Row: Execute -->
        <div 
          class="mr-protocol-row" 
          @click="openModal('execute')"
          @mousemove="handleMouseMove"
        >
          <div class="mr-protocol-code"><span>MOD-03</span></div>
          <div class="mr-protocol-info">
            <span class="mr-protocol-name">Сборка</span>
            <span class="mr-protocol-subtitle">ДИЗАЙН В КОДЕ</span>
          </div>
          <div class="mr-protocol-duration">30 дней</div>
          <div class="mr-protocol-result">→ Рабочий продукт</div>
          <div class="mr-protocol-price">по запросу</div>
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
          <div class="mr-package-card">
            <div class="mr-package-icon">📍</div>
            <div class="mr-package-title">Бренд-платформа</div>
          </div>
          <div class="mr-package-card">
            <div class="mr-package-icon">🎨</div>
            <div class="mr-package-title">Айдентика</div>
          </div>
          <div class="mr-package-card">
            <div class="mr-package-icon">📱</div>
            <div class="mr-package-title">Интерфейс</div>
          </div>
          <div class="mr-package-card">
            <div class="mr-package-icon">🚀</div>
            <div class="mr-package-title">Цифровой продукт</div>
          </div>
        </div>

        <p class="mr-protocol-summary-note">СЛОТ — это 60 дней зарезервированной мощности под вашу задачу. Вы покупаете не «часы программиста», а цельную систему от стратегии до пикселя в коде.</p>

        <div class="mr-protocol-slots-line">
          СВОБОДНО СЛОТОВ НА МАРТ: 1 ИЗ 2
        </div>

        <button class="mr-protocol-cta" @click="openModal('slot')">ПРОВЕРИТЬ ГОТОВНОСТЬ →</button>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="mr-protocol-modal-overlay" @click.self="closeModal">
        <div class="mr-protocol-modal">
          <button class="mr-modal-close" @click="closeModal">×</button>
          <div class="mr-modal-content" v-html="modalContent"></div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const modalOpen = ref(false)
const currentMode = ref<string>('')

const protocolData = {
  scout: {
    code: "MOD-01",
    title: "Разведка",
    subtitle: "СТРАТЕГИЯ И ПОЗИЦИОНИРОВАНИЕ",
    duration: "7–10 дней",
    price: "150 000 ₽",
    result: "Бренд-платформа + GO/NO-GO",
    description: "Определяем, кто вы на рынке и чем отличаетесь. Формируем стратегическую основу для бренда и продукта.",
    method: "Глубинные интервью, анализ конкурентов, позиционирование, формулировка ценностного предложения.",
    roadmap: [
      { phase: "Погружение", items: ["Глубинные интервью", "Анализ целевой аудитории"] },
      { phase: "Позиционирование", items: ["Анализ конкурентов", "Формулировка УТП"] },
      { phase: "Стратегия", items: ["Бренд-платформа", "Tone of Voice", "GO/NO-GO вердикт"] }
    ],
    deliverables: ["Бренд-платформа", "Позиционирование", "Анализ конкурентов", "GO / NO-GO вердикт"]
  },
  checkup: {
    code: "MOD-02",
    title: "Чертёж",
    subtitle: "АЙДЕНТИКА И ИНТЕРФЕЙС",
    duration: "30 дней",
    price: "350 000 ₽",
    result: "Дизайн-система + Прототип",
    description: "Создаём визуальную идентичность бренда и проектируем интерфейс продукта. Вы получаете полный дизайн-кит.",
    method: "Бренд-платформа, айдентика, UI-кит, кликабельный прототип ключевых экранов.",
    roadmap: [
      { phase: "Айдентика", items: ["Логотип", "Цвета", "Типографика"] },
      { phase: "UI-кит", items: ["Компоненты", "Иконки", "Формы"] },
      { phase: "Прототип", items: ["Экраны", "User Flow", "Интерактив"] },
      { phase: "Финализация", items: ["Гайдлайны", "Исходники"] }
    ],
    deliverables: ["Логотип и айдентика", "UI-кит компонентов", "Кликабельный прототип", "Бренд-гайдлайны"]
  },
  execute: {
    code: "MOD-03",
    title: "Сборка",
    subtitle: "ДИЗАЙН В КОДЕ",
    duration: "30 дней",
    price: "по запросу",
    result: "Рабочий продукт",
    description: "Превращаем дизайн в работающий продукт. Pixel-perfect вёрстка, чистый код, запуск в продакшн.",
    method: "Pixel-perfect вёрстка по макетам, современный стек, тестирование, деплой и поддержка.",
    roadmap: [
      { phase: "Фронтенд", items: ["Pixel-perfect вёрстка"] },
      { phase: "Бэкенд", items: ["Логика", "БД", "API"] },
      { phase: "Интеграции", items: ["Платежи", "Аналитика"] },
      { phase: "Тестирование", items: ["QA", "Оптимизация"] },
      { phase: "Релиз", items: ["Деплой", "Мониторинг"] }
    ],
    deliverables: ["Рабочий продукт", "Исходный код", "Документация", "7 дней поддержки"]
  }
}

const modalContent = computed(() => {
  if (currentMode.value === 'slot') {
    return `
      <div class="mr-modal-header">
        <span class="mr-modal-code">SLOT-60</span>
        <h3 class="mr-modal-title">Стартовый слот</h3>
        <span class="mr-modal-subtitle">ПОЛНЫЙ ЦИКЛ 60 ДНЕЙ</span>
      </div>
      <p class="mr-modal-description">От идеи до бренда и продукта. Стратегия → Айдентика → Интерфейс → Код. Единая система.</p>
      <div class="mr-slot-packages">
        <div class="mr-slot-package"><span class="mr-slot-package-icon">📍</span><span>Бренд-платформа</span></div>
        <div class="mr-slot-package"><span class="mr-slot-package-icon">🎨</span><span>Айдентика</span></div>
        <div class="mr-slot-package"><span class="mr-slot-package-icon">📱</span><span>Интерфейс</span></div>
        <div class="mr-slot-package"><span class="mr-slot-package-icon">🚀</span><span>Цифровой продукт</span></div>
      </div>
      <a href="https://t.me/runScale" target="_blank" class="mr-modal-cta">ЗАБРОНИРОВАТЬ СЛОТ →</a>
    `
  }
  
  const data = protocolData[currentMode.value as keyof typeof protocolData]
  if (!data) return ''
  
  return `
    <div class="mr-modal-header">
      <span class="mr-modal-code">${data.code}</span>
      <h3 class="mr-modal-title">${data.title}</h3>
      <span class="mr-modal-subtitle">${data.subtitle}</span>
    </div>
    <div class="mr-modal-meta">
      <div class="mr-modal-meta-item">
        <span class="mr-modal-meta-label">Длительность</span>
        <span class="mr-modal-meta-value">${data.duration}</span>
      </div>
      <div class="mr-modal-meta-item">
        <span class="mr-modal-meta-label">Стоимость</span>
        <span class="mr-modal-meta-value">${data.price}</span>
      </div>
      <div class="mr-modal-meta-item">
        <span class="mr-modal-meta-label">Результат</span>
        <span class="mr-modal-meta-value mr-accent">${data.result}</span>
      </div>
    </div>
    <p class="mr-modal-description">${data.description}</p>
    <div class="mr-modal-section">
      <h4>Метод</h4>
      <p>${data.method}</p>
    </div>
    <div class="mr-modal-section">
      <h4>Роадмап</h4>
      <div class="mr-modal-roadmap">
        ${data.roadmap.map(r => `
          <div class="mr-roadmap-phase">
            <div class="mr-roadmap-phase-title">${r.phase}</div>
            <div class="mr-roadmap-items">${r.items.join(' • ')}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="mr-modal-section">
      <h4>Артефакты</h4>
      <div class="mr-modal-deliverables">
        ${data.deliverables.map(d => `<span class="mr-deliverable-tag">${d}</span>`).join('')}
      </div>
    </div>
  `
})

function openModal(mode: string) {
  currentMode.value = mode
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modalOpen.value = false
  document.body.style.overflow = ''
}

function handleMouseMove(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  target.style.setProperty('--mouse-x', `${x}px`)
  target.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<style scoped>
.mr-launch-protocol-section {
  background: #0a0a0a;
  padding: 80px 24px;
}

.mr-launch-protocol-container {
  max-width: 1000px;
  margin: 0 auto;
}

.mr-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 16px;
}

.mr-section-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 300;
  margin-bottom: 24px;
  color: #fff;
}

.mr-protocol-table {
  background: #111111;
  border: 1px solid #222222;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;
}

.mr-protocol-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #222222;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
  position: relative;
  --mouse-x: 50%;
  --mouse-y: 50%;
}

/* Крестики по углам (CAD-стиль) */
.mr-protocol-row::before,
.mr-protocol-row::after {
  content: '+';
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #222222;
  transition: color 0.3s ease;
}
.mr-protocol-row::before { top: 8px; left: 8px; }
.mr-protocol-row::after { top: 8px; right: 8px; }
.mr-protocol-row:hover::before,
.mr-protocol-row:hover::after { color: #00ff88; }

/* Spotlight эффект */
.mr-protocol-row:hover {
  background: radial-gradient(
    300px circle at var(--mouse-x) var(--mouse-y),
    rgba(0, 255, 136, 0.06),
    transparent 50%
  );
  border-left: 3px solid #00ff88;
}

/* Скрываем цену и результат в таблице */
.mr-protocol-row .mr-protocol-price,
.mr-protocol-row .mr-protocol-result {
  display: none;
}

.mr-protocol-row:last-child { border-bottom: none; }

@media (max-width: 700px) {
  .mr-protocol-row::before,
  .mr-protocol-row::after { display: none; }
}

.mr-protocol-code span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 8px;
  border: 1px solid #00ff88;
  border-radius: 4px;
  display: inline-block;
}

.mr-protocol-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mr-protocol-name {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
}

.mr-protocol-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #00ff88;
  letter-spacing: 1px;
}

.mr-protocol-duration {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.mr-protocol-details-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #222222;
  border-radius: 6px;
  color: #00ff88;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: center;
}

.mr-protocol-details-btn:hover {
  background: #00ff88;
  border-color: #00ff88;
}

.mr-protocol-details-btn:hover .mr-details-text,
.mr-protocol-details-btn:hover .mr-build-details-icon {
  color: #000;
}

.mr-protocol-details-btn:hover .mr-build-details-icon svg {
  stroke: #000;
}

.mr-build-details-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mr-build-details-icon svg {
  color: #00ff88;
}

.mr-details-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #00ff88;
}

/* Protocol Footer */
.mr-protocol-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background: rgba(0, 255, 136, 0.05);
  border: 2px solid #00ff88;
  border-radius: 12px;
  margin-top: 24px;
  gap: 24px;
}

.mr-protocol-footer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
}

.mr-protocol-summary-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.mr-protocol-summary-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: #00ff88;
  font-weight: 600;
  text-align: center;
  margin: 0;
}

.mr-protocol-summary-note {
  font-size: 14px;
  color: #888888;
  text-align: center;
  line-height: 1.6;
  max-width: 600px;
  margin: 0;
}

.mr-protocol-footer-duration {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  color: #00ff88;
  font-weight: 700;
}

.mr-protocol-package-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
}

.mr-package-card {
  background: #111111;
  border: 1px solid #222222;
  border-radius: 8px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.mr-package-card:hover {
  border-color: #00ff88;
  transform: translateY(-2px);
}

.mr-package-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.mr-package-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.mr-protocol-slots-line {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #fff;
  letter-spacing: 2px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.mr-protocol-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 40px;
  background: #00ff88;
  color: #000;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.mr-protocol-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
}

@media (max-width: 900px) {
  .mr-protocol-row {
    grid-template-columns: 70px 1fr 80px;
    gap: 12px;
  }
  .mr-protocol-details-btn { display: none; }
  .mr-protocol-package-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .mr-protocol-footer {
    padding: 24px 16px;
  }
  .mr-protocol-footer-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  .mr-protocol-package-grid {
    grid-template-columns: 1fr 1fr;
  }
  .mr-protocol-slots-line {
    font-size: 11px;
    text-align: center;
  }
}

/* Modal */
.mr-protocol-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
}

.mr-protocol-modal {
  background: #111111;
  border: 1px solid #222222;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 40px;
}

.mr-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid #222222;
  border-radius: 8px;
  color: #888888;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mr-modal-close:hover {
  background: #00ff88;
  color: #000;
  border-color: #00ff88;
}
</style>

<style>
/* Modal Content Styles (not scoped) */
.mr-modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.mr-modal-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #00ff88;
  letter-spacing: 2px;
}

.mr-modal-title {
  font-size: 32px;
  font-weight: 600;
  margin: 8px 0;
  color: #fff;
}

.mr-modal-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #555555;
  letter-spacing: 2px;
}

.mr-modal-meta {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #0a0a0a;
  border-radius: 8px;
  flex-wrap: wrap;
}

.mr-modal-meta-item {
  text-align: center;
}

.mr-modal-meta-label {
  font-size: 11px;
  color: #555555;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 4px;
}

.mr-modal-meta-value {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.mr-modal-meta-value.mr-accent {
  color: #00ff88;
}

.mr-modal-description {
  font-size: 16px;
  color: #888888;
  line-height: 1.8;
  margin-bottom: 24px;
}

.mr-modal-section {
  margin-bottom: 24px;
}

.mr-modal-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mr-modal-section p {
  color: #888888;
  line-height: 1.6;
}

.mr-modal-roadmap {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.mr-roadmap-phase {
  background: #0a0a0a;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid #00ff88;
}

.mr-roadmap-phase-title {
  font-weight: 600;
  color: #00ff88;
  margin-bottom: 4px;
}

.mr-roadmap-items {
  font-size: 13px;
  color: #888888;
}

.mr-modal-deliverables {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mr-deliverable-tag {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  color: #00ff88;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.mr-slot-packages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 24px 0;
}

.mr-slot-package {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #0a0a0a;
  border-radius: 8px;
  color: #fff;
}

.mr-slot-package-icon {
  font-size: 24px;
}

.mr-modal-cta {
  display: block;
  width: 100%;
  padding: 16px;
  background: #00ff88;
  color: #000;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mr-modal-cta:hover {
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
}
</style>
