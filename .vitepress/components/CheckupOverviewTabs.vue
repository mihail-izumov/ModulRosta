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
    <!-- Чекап в 2 этапа -->
    <div v-show="activeTab === 'checkup'" class="mr-content">
      <h3>Чекап в 2 этапа</h3>
      <p>80% компаний не готовы к глубокому анализу — у них нет данных, дисциплины или полномочий. Наша система <strong>двухэтапного чекапа</strong> быстро показывает, готовы ли вы к трансформации или сначала нужен подготовительный этап.</p>
      <div class="mr-link-block">
        <a href="/checkup/roadmap" class="mr-arrow-link" target="_self">
          <span>Перейти к <strong>Карте Чекапа</strong></span>
          <span class="mr-arrow-icon">
            <!-- новая стрелка -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- 10 разделов бизнеса -->
    <div v-show="activeTab === 'system'" class="mr-content">
      <h3>10 разделов бизнеса</h3>
      <ul>
        <li><strong>Системный подход:</strong> анализ ~180 связанных метрик и изучение влияния изменений в одной сфере на остальные.</li>
        <li><strong>Конкретика:</strong> только точные цифры потенциала и сроки результата — никаких абстрактных советов.</li>
        <li><strong>Фокус на тотальной эффективности:</strong> выявление скрытых потерь, неэффективных процессов, лишних затрат и потерь времени/ресурсов.</li>
      </ul>
      <div class="mr-link-block">
        <a href="/checkup/deep" class="mr-arrow-link" target="_self">
          <span>Подробнее о <strong>Глубоком Чекапе</strong></span>
          <span class="mr-arrow-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- DMAIC -->
    <div v-show="activeTab === 'dmaic'" class="mr-content">
      <h3>Методология DMAIC + кросс-анализ</h3>
      <ul>
        <li><strong>Определяем</strong> проблемы по принципу "есть/нет" и сразу приоритезируем их.</li>
        <li><strong>Измеряем</strong> текущее состояние и строим базовую линию.</li>
        <li><strong>Анализируем</strong> причины проблем — ищем взаимосвязи между процессами.</li>
        <li><strong>Улучшаем</strong> точечно, прогнозируя влияние на все соседние области.</li>
        <li><strong>Контролируем</strong> результаты через систему раннего предупреждения и регулярных чекапов.</li>
      </ul>
      <div class="mr-link-block">
        <a href="/technology/analytics-360" class="mr-arrow-link" target="_blank" rel="noopener">
          <span>Открыть <strong>Аналитику 360°</strong></span>
          <span class="mr-arrow-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Результаты чекапа -->
    <div v-show="activeTab === 'results'" class="mr-content">
      <h3>Результаты</h3>
      <ul class="mr-checked-list">
        <li>
          <span class="mr-lime-check">
            <!-- чекмарка новая, 30% меньше -->
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Точные метрики</strong> — например, "оптимизация графика закупок высвободит X млн ₽" или "изменение мотивации увеличит выручку на Y%"
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Приоритизированный план действий</strong> с оценкой эффекта и сроков — что делать сейчас, а что отложить
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Пошаговые решения проблем</strong> с учётом взаимосвязей
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Детальный отчёт</strong> (~180 ключевых метрик) и пошаговый план внедрения с временными рамками
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Система контроля</strong> и трекинг результатов
        </li>
      </ul>
    </div>

    <!-- Для собственника -->
    <div v-show="activeTab === 'owner'" class="mr-content">
      <h3>Что получает собственник</h3>
      <ul class="mr-checked-list">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Новый уровень стратегического мышления</strong> и применение фрейм-менеджмента к своему бизнесу
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Готовые инструменты</strong> для решения задач: конкретный план изменений
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Структуризация и систематизация опыта</strong>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="15.4" height="15.4" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Профессиональная поддержка экспертов</strong> на этапе внедрения
        </li>
      </ul>
    </div>

    <!-- Точность и контроль -->
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
.mr-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.mr-tabs button {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.13);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.93);
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13.7px;
  line-height: 1.1;
  cursor: pointer;
  transition: all .22s cubic-bezier(.45,.8,.55,1);
}
.mr-tabs button:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.22);
}
.mr-tabs .mr-active {
  color: #101a0f;
  background: #c8ff5a;
  border-color: #c8ff5a;
  box-shadow: 0 0 0 2px rgba(200,255,90,0.32) inset;
}

.mr-panel {
  border: 1px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.037);
  border-radius: 13px;
  padding: 17px 18px;
}

.mr-content {
  color: rgba(255,255,255,0.93);
  font-size: 14px;
  line-height: 1.53;
}

.mr-content p:not(:last-child) {
  margin-bottom: 14px;
}

.mr-content p, .mr-content ul, .mr-content li {
  font-size: 14px;
  color: rgba(255,255,255,0.91);
  line-height: 1.53;
}

.mr-content h3 {
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255,255,255,0.94);
}

.mr-content strong {
  font-weight: 600;
  color: #fff;
}

.mr-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 14px 0;
}

.mr-content ul:not(:last-child) {
  margin-bottom: 18px;
}
.mr-content li {
  position: relative;
  padding-left: 18px;
  margin-bottom: 8px;
}
.mr-content li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: rgba(255,255,255,0.52);
}

/* Чекмарки */
.mr-checked-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px 0;
}
.mr-checked-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 13px;
  padding-left: 0;
  position: relative;
}
.mr-checked-list li::before { display: none; }
.mr-lime-check {
  flex-shrink: 0;
  margin-top: 2px;
  margin-right: 2px;
  display: flex;
  align-items: center;
}

/* Линк-блок и стили ссылок, максимально независимые! */
.mr-link-block {
  margin-top: 18px;
}
.mr-arrow-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #c8ff5a !important;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  transition: color .21s, gap .26s;
  position: relative;
  padding: 0;
  outline: none;
  cursor: pointer;
}
.mr-arrow-link:hover {
  color: #eeff99 !important;
  gap: 26px;
}
.mr-arrow-icon {
  transition: transform .33s cubic-bezier(.51,.62,.42,1);
}
.mr-arrow-link:hover .mr-arrow-icon {
  transform: translateX(8px);
}
.mr-arrow-link strong { color: #c8ff5a; font-weight: 700; }

</style>
