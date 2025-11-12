<script setup>
import { ref } from 'vue'

const activeTab = ref('why-not-promise')
const openAccordions = ref({
  commitment1: false,
  commitment2: false,
  commitment3: false
})

const toggleAccordion = (key) => {
  openAccordions.value[key] = !openAccordions.value[key]
}

const openLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="mr-tabs-container">
    <div class="mr-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ 'mr-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="mr-panel">
      <!-- 1. Почему не обещаем X2 -->
      <div v-show="activeTab === 'why-not-promise'" class="mr-content">
        <h3>Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
        <p>Рынок бизнес-аналитики наводнен пустыми обещаниями: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:</p>
        <ul>
          <li>Проценты легко манипулировать — 30% от чего и за какой период?</li>
          <li>Возврат денег означает, что аналитик не несет ответственности за внедрение</li>
          <li>Красивые цифры отвлекают от главного — реальных изменений в бизнесе</li>
        </ul>
        <div class="mr-highlight">
          <h4>Мы выбрали другой путь</h4>
          <p>Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство</strong> — работать до получения результата.<br>Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.</p>
        </div>
      </div>

      <!-- 2. Наше обязательство -->
      <div v-show="activeTab === 'commitment'" class="mr-content">
        <h3>Как работает наше обязательство</h3>

        <div class="mr-accordion">
          <button @click="toggleAccordion('commitment1')" class="mr-accordion-btn">
            <span :class="{ 'open': openAccordions.commitment1 }">></span>
            Карту системных узких мест
          </button>
          <div v-show="openAccordions.commitment1" class="mr-accordion-body">
            <ul>
              <li>Конкретные данные о потерях эффективности</li>
              <li>Измеримые показатели каждой проблемы</li>
              <li>Приоритизация по влиянию на результат</li>
              <li>Валидация командой — не теоретические выводы, а подтверждённые факты</li>
            </ul>
          </div>
        </div>

        <div class="mr-accordion">
          <button @click="toggleAccordion('commitment2')" class="mr-accordion-btn">
            <span :class="{ 'open': openAccordions.commitment2 }">></span>
            Три готовых к внедрению решения
          </button>
          <div v-show="openAccordions.commitment2" class="mr-accordion-body">
            <ul>
              <li>Согласованные с командой планы действий</li>
              <li>Назначенные ответственные за каждое направление</li>
              <li>Чёткие критерии успеха по каждому решению</li>
              <li>Ресурсы и инструменты для реализации</li>
            </ul>
          </div>
        </div>

        <div class="mr-accordion">
          <button @click="toggleAccordion('commitment3')" class="mr-accordion-btn">
            <span :class="{ 'open': openAccordions.commitment3 }">></span>
            Запущенные пилотные проекты
          </button>
          <div v-show="openAccordions.commitment3" class="mr-accordion-body">
            <ul>
              <li>Работающие процессы по каждому из решений</li>
              <li>Первые измеримые результаты пилотов</li>
              <li>Обратная связь от команды по каждому нововведению</li>
              <li>План масштабирования успешных пилотов</li>
            </ul>
          </div>
        </div>

        <div class="mr-highlight">
          <h4>Что происходит, если мы не выполняем обязательство</h4>
          <p>Если по истечении 30 дней <strong>хотя бы один</strong> из трёх пунктов не выполнен <strong>по нашей вине</strong>, мы продолжаем работать до его выполнения <strong>без дополнительной оплаты</strong>.</p>
          <p><strong>Ключевое условие:</strong> "по нашей вине" означает, что мы не переносим ответственность на клиента за <strong>наши</strong> методологические ошибки или <strong>нашу</strong> неспособность найти решения.</p>
        </div>
      </div>

      <!-- Остальные вкладки — аналогично, сокращу ради объёма -->
      <!-- (Полный код по запросу) -->
    </div>
  </div>
</template>

<style>
/* === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ === */
:root {
  --lime: #c8ff5a;
  --lime-hover: #e8ff8a;
  --dark: #18181c;
  --panel-bg: rgba(24, 24, 28, 0.95);
  --border: rgba(255, 255, 255, 0.14);
  --text: rgba(255, 255, 255, 0.95);
  --text-muted: #a1a1a1;
}

/* === КОНТЕЙНЕР === */
.mr-tabs-container {
  max-width: 100%;
  margin: 0 auto;
  font-family: inherit;
}

/* === ТАБЫ === */
.mr-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.mr-tabs button {
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid var(--border);
  color: var(--text);
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s ease;
}

.mr-tabs button:hover {
  background: rgba(200, 255, 90, 0.12);
  border-color: var(--lime);
}

.mr-tabs .mr-active {
  background: var(--lime);
  color: #0a0a0a;
  border-color: var(--lime);
}

/* === ПАНЕЛЬ === */
.mr-panel {
  background: var(--panel-bg);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 32px;
  color: var(--text);
}

/* === КОНТЕНТ === */
.mr-content h3 {
  margin: 0 0 20px;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.mr-content p {
  margin: 0 0 16px;
  line-height: 1.5;
  font-size: 14px;
}

.mr-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.mr-content li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.mr-content li::before {
  content: "–";
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  top: -2px;
}

/* === ВЫДЕЛЕННЫЙ БЛОК === */
.mr-highlight {
  background: rgba(200, 255, 90, 0.08);
  border: 1.5px solid var(--lime);
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  text-align: center;
}

.mr-highlight h4 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #fff;
}

.mr-highlight p {
  margin: 0 0 16px;
  font-size: 14px;
}

/* === АККОРДЕОН === */
.mr-accordion {
  margin-bottom: 16px;
}

.mr-accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 12px 0;
  text-align: left;
  color: var(--lime);
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
}

.mr-accordion-btn span {
  font-size: 28px;
  transition: transform 0.25s ease;
  display: inline-block;
}

.mr-accordion-btn span.open {
  transform: rotate(90deg);
}

.mr-accordion-body {
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid var(--lime);
  margin: 8px 0 24px 44px;
  padding: 12px 0 12px 24px;
  border-radius: 7px;
}

.mr-accordion-body ul {
  margin: 0;
  padding-left: 16px;
}

.mr-accordion-body li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
  font-size: 14px;
}

.mr-accordion-body li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--lime);
  font-weight: 700;
}

/* === КНОПКА ССЫЛКА === */
.mr-lime-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--lime);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.22s ease;
}

.mr-lime-btn:hover {
  color: var(--lime-hover);
  transform: translateX(2px);
}

.mr-lime-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  transition: transform 0.22s ease;
}

.mr-lime-btn:hover svg {
  transform: translateX(6px);
}
</style>
