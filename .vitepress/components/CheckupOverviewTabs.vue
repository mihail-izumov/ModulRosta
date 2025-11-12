<script setup>
import { ref } from 'vue'
const activeTab = ref('checkup')
</script>

<template>
  <div class="mr-tabs">
    <button :class="{ 'mr-active': activeTab === 'checkup' }" @click="activeTab = 'checkup'">
      Чекап в 2 этапа
    </button>
    <button :class="{ 'mr-active': activeTab === 'system' }" @click="activeTab = 'system'">
      10 разделов бизнеса
    </button>
    <button :class="{ 'mr-active': activeTab === 'dmaic' }" @click="activeTab = 'dmaic'">
      Методология DMAIC
    </button>
    <button :class="{ 'mr-active': activeTab === 'results' }" @click="activeTab = 'results'">
      Результаты чекапа
    </button>
    <button :class="{ 'mr-active': activeTab === 'owner' }" @click="activeTab = 'owner'">
      Что получает собственник
    </button>
    <button :class="{ 'mr-active': activeTab === 'precision' }" @click="activeTab = 'precision'">
      Точность и контроль
    </button>
  </div>

  <div class="mr-panel">
    <!-- Вкладка: Чекап в 2 этапа -->
    <div v-show="activeTab === 'checkup'" class="mr-content">
      <h3>Чекап в 2 этапа</h3>
      <p>80% компаний не готовы к глубокому анализу — у них нет данных, дисциплины или полномочий. Наша система <strong>двухэтапного чекапа</strong> быстро показывает, готовы ли вы к трансформации или сначала нужен подготовительный этап.</p>
      <div class="mr-linkbox">
        <a href="/checkup/roadmap" class="mr-lime-link">
          <span>Перейти к <strong>Карте Чекапа</strong></span>
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Вкладка: 10 разделов бизнеса -->
    <div v-show="activeTab === 'system'" class="mr-content">
      <h3>10 разделов бизнеса</h3>
      <ul>
        <li><strong>Системный подход:</strong> анализ ~180 связанных метрик и изучение влияния изменений в одной сфере на остальные.</li>
        <li><strong>Конкретика:</strong> только точные цифры потенциала и сроки результата — никаких абстрактных советов.</li>
        <li><strong>Фокус на тотальной эффективности:</strong> выявление скрытых потерь, неэффективных процессов, лишних затрат и потерь времени/ресурсов.</li>
      </ul>
      <div class="mr-linkbox">
        <a href="/checkup/deep" class="mr-lime-link">
          <span>Подробнее о <strong>Глубоком Чекапе</strong></span>
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Вкладка: Методология DMAIC -->
    <div v-show="activeTab === 'dmaic'" class="mr-content">
      <h3>Методология DMAIC + кросс-анализ</h3>
      <ul>
        <li><strong>Определяем</strong> проблемы по принципу "есть/нет" и сразу приоритезируем их.</li>
        <li><strong>Измеряем</strong> текущее состояние и строим базовую линию.</li>
        <li><strong>Анализируем</strong> причины проблем — ищем взаимосвязи между процессами.</li>
        <li><strong>Улучшаем</strong> точечно, прогнозируя влияние на все соседние области.</li>
        <li><strong>Контролируем</strong> результаты через систему раннего предупреждения и регулярных чекапов.</li>
      </ul>
      <div class="mr-linkbox">
        <a href="/technology/analytics-360" class="mr-lime-link" target="_blank" rel="noopener">
          <span>Аналитика 360°</span>
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Вкладка: Результаты чекапа -->
    <div v-show="activeTab === 'results'" class="mr-content">
      <h3>Результаты</h3>
      <ul class="mr-checked">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Точные метрики —</strong> например, "оптимизация графика закупок высвободит X млн ₽" или "изменение мотивации увеличит выручку на Y%"
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Приоритизированный план действий —</strong> что делать сейчас, а что отложить, с оценкой эффекта и сроков
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Пошаговые решения проблем —</strong> с учётом взаимосвязей между процессами
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Детальный отчёт —</strong> анализ ~180 ключевых метрик и пошаговый план внедрения с временными рамками
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Система контроля —</strong> трекинг результатов и регулярные чекапы
        </li>
      </ul>
    </div>

    <!-- Вкладка: Для собственника -->
    <div v-show="activeTab === 'owner'" class="mr-content">
      <h3>Что получает собственник</h3>
      <ul class="mr-checked">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Новый уровень стратегического мышления —</strong> применение фрейм-менеджмента к своему бизнесу
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Готовые инструменты —</strong> конкретный план изменений для решения задач
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Структуризация и систематизация —</strong> аудита существующего опыта
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Профессиональная поддержка —</strong> сопровождение экспертов на этапе внедрения
        </li>
      </ul>
    </div>

    <!-- Вкладка: Точность и контроль -->
    <div v-show="activeTab === 'precision'" class="mr-content">
      <h3>Что делает наш подход точным</h3>
      <ul>
        <li><strong>Системный взгляд:</strong> анализируем бизнес как единый организм, 10 разделов от финансов до HR</li>
        <li><strong>RAG-анализ:</strong> быстрые и надёжные цифры для решений, никакой "воды"</li>
        <li><strong>Постоянные чекапы:</strong> ваша система непрерывных улучшений</li>
        <li><strong>DMAIC-подход:</strong> точная синхронизация с командой, результат ежедневного исполнения</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Основная структура: уникальные префиксы mr- */
.mr-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.mr-tabs button {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.92);
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all .2s ease;
}
.mr-tabs button:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.18);
}
.mr-tabs .mr-active {
  color: #0a0a0a;
  background: #c8ff5a;
  border-color: #c8ff5a;
  box-shadow: 0 0 0 2px rgba(200,255,90,0.25) inset;
}

/* Панель контента */
.mr-panel {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 15px 16px;
}
.mr-content {
  color: rgba(255,255,255,0.92);
  font-size: 14px;
  line-height: 1.46;
}
.mr-content p:not(:last-child) {
  margin-bottom: 12px;
}
.mr-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.88);
  line-height: 1.46;
}
.mr-content em {
  color: rgba(255,255,255,0.7);
  font-style: italic;
}
.mr-content h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255,255,255,0.9);
}
.mr-content h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #c8ff5a;
  letter-spacing: 0.01em;
}
.mr-content h4:first-of-type {
  margin-top: 12px;
}
.mr-content strong {
  font-weight: 700;
  color: #fff;
}
.mr-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}
.mr-content ul:not(:last-child) {
  margin-bottom: 15px;
}
.mr-content li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
  font-size: 14px;
}
.mr-content li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: rgba(255,255,255,0.5);
}
.mr-checked { list-style: none; padding: 0; margin: 0 0 12px 0; }
.mr-checked li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 13px !important;
  padding-left: 0;
  position: relative;
  font-size: 14px;
}
.mr-checked li::before { display: none; }
.mr-lime-check {
  flex-shrink: 0;
  margin-top: 1px;
  margin-right: 2px;
  line-height: 0;
}

/* Ссылки - полный лайм, стили изолированы */
.mr-linkbox {
  margin-top: 14px;
}
.mr-lime-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #c8ff5a !important;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  cursor: pointer;
  position: relative;
  transition: color .18s, background .18s;
  z-index: 0;
}
.mr-lime-link:hover {
  color: #e4ff95 !important;
}
.mr-lime-link .mr-arrow {
  transition: transform 0.18s cubic-bezier(.7,.2,.3,1) 0s;
  margin-left: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
}
.mr-lime-link:hover .mr-arrow {
  transform: translateX(7px);
}
</style>
