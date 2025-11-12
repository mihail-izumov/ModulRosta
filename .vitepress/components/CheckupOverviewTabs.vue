<script setup>
import { ref } from 'vue'
// Устанавливаем первую вкладку активной по умолчанию
const activeTab = ref('checkup')
</script>

<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'checkup' }" @click="activeTab = 'checkup'">
      Чекап в 2 этапа
    </button>
    <button :class="{ active: activeTab === 'system' }" @click="activeTab = 'system'">
      10 разделов бизнеса
    </button>
    <button :class="{ active: activeTab === 'dmaic' }" @click="activeTab = 'dmaic'">
      Методология DMAIC
    </button>
    <button :class="{ active: activeTab === 'results' }" @click="activeTab = 'results'">
      Результаты чекапа
    </button>
    <button :class="{ active: activeTab === 'owner' }" @click="activeTab = 'owner'">
      Что получает собственник
    </button>
    <button :class="{ active: activeTab === 'precision' }" @click="activeTab = 'precision'">
      Точность и контроль
    </button>
  </div>
  
  <div class="panel-mr">
    <!-- Вкладка: Чекап в 2 этапа -->
    <div v-show="activeTab === 'checkup'" class="content-mr">
      <h3>Чекап в 2 этапа</h3>
      <p>80% компаний не готовы к глубокому анализу — у них нет данных, дисциплины или полномочий. Наша система <strong>двухэтапного чекапа</strong> быстро показывает, готовы ли вы к трансформации или сначала нужен подготовительный этап.</p>
      <div class="link-mr">
        <a href="/checkup/roadmap" class="arrow-link">
          <span>Перейти к <strong>Карте Чекапа</strong></span>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#c8ff5a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </div>

    <!-- Вкладка: 10 разделов бизнеса -->
    <div v-show="activeTab === 'system'" class="content-mr">
      <h3>10 разделов бизнеса</h3>
      <ul>
        <li><strong>Системный подход:</strong> анализ ~180 связанных метрик и изучение влияния изменений в одной сфере на остальные.</li>
        <li><strong>Конкретика:</strong> только точные цифры потенциала и сроки результата — никаких абстрактных советов.</li>
        <li><strong>Фокус на тотальной эффективности:</strong> выявление скрытых потерь, неэффективных процессов, лишних затрат и потерь времени/ресурсов.</li>
      </ul>
      <div class="link-mr">
        <a href="/checkup/deep" class="arrow-link">
          <span>Подробнее о <strong>Глубоком Чекапе</strong></span>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#c8ff5a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </div>

    <!-- Вкладка: Методология DMAIC -->
    <div v-show="activeTab === 'dmaic'" class="content-mr">
      <h3>Методология DMAIC + кросс-анализ</h3>
      <ul>
        <li><strong>Определяем</strong> проблемы по принципу "есть/нет" и сразу приоритезируем их.</li>
        <li><strong>Измеряем</strong> текущее состояние и строим базовую линию.</li>
        <li><strong>Анализируем</strong> причины проблем — ищем взаимосвязи между процессами.</li>
        <li><strong>Улучшаем</strong> точечно, прогнозируя влияние на все соседние области.</li>
        <li><strong>Контролируем</strong> результаты через систему раннего предупреждения и регулярных чекапов.</li>
      </ul>
    </div>

    <!-- Вкладка: Результаты чекапа -->
    <div v-show="activeTab === 'results'" class="content-mr">
      <h3>Результаты</h3>
      <ul class="checked-list">
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Точные метрики — например, "оптимизация графика закупок высвободит X млн ₽" или "изменение мотивации увеличит выручку на Y%"
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Приоритизированный план действий с оценкой эффекта и сроков — что делать сейчас, а что отложить
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Пошаговые решения проблем с учётом взаимосвязей
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Детальный отчёт (~180 ключевых метрик) и пошаговый план внедрения с временными рамками
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Система контроля и трекинг результатов
        </li>
      </ul>
    </div>

    <!-- Вкладка: Для собственника -->
    <div v-show="activeTab === 'owner'" class="content-mr">
      <h3>Что получает собственник</h3>
      <ul class="checked-list">
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Новый уровень стратегического мышления и применение фрейм-менеджмента к своему бизнесу
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Готовые инструменты для решения задач: конкретный план изменений
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Структуризация и систематизация текущего опыта
        </li>
        <li>
          <span class="lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4L9 15"/><path d="M21 19L3 19"/><path d="M9 15L4 10"/></svg>
          </span>
          Профессиональная поддержка экспертов на этапе внедрения
        </li>
      </ul>
    </div>

    <!-- Вкладка: Точность и контроль -->
    <div v-show="activeTab === 'precision'" class="content-mr">
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
.tabs-mr {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.tabs-mr button {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.92);
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: all .2s ease;
}

.tabs-mr button:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.18);
}

.tabs-mr button.active {
  color: #0a0a0a;
  background: #c8ff5a;
  border-color: #c8ff5a;
  box-shadow: 0 0 0 2px rgba(200,255,90,0.25) inset;
}

.panel-mr {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 15px 16px;
}

.content-mr {
  color: rgba(255,255,255,0.92);
  font-size: 13px;
  line-height: 1.46;
}

.content-mr p:not(:last-child) {
  margin-bottom: 12px;
}

.content-mr p {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,0.88);
  line-height: 1.46;
}

.content-mr em {
  color: rgba(255,255,255,0.7);
  font-style: italic;
}
.content-mr h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255,255,255,0.9);
}

.content-mr h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #c8ff5a;
  letter-spacing: 0.01em;
}

.content-mr h4:first-of-type {
  margin-top: 12px;
}

.content-mr strong {
  font-weight: 600;
  color: #fff;
}

.content-mr ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}

.content-mr ul:not(:last-child) {
  margin-bottom: 15px;
}

.content-mr li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
}

.content-mr li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: rgba(255,255,255,0.5);
}

/* чекмарки lime */
.checked-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}
.checked-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  padding-left: 0;
  position: relative;
}
.checked-list li::before { display: none; }
.lime-check {
  flex-shrink: 0;
  margin-top: 2px;
  margin-right: 2px;
}

.link-mr {
  margin-top: 14px;
}
.arrow-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #c8ff5a;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: color .18s;
}
.arrow-link:hover {
  color: #eeff99;
}
.arrow-link svg {
  margin-top: 1px;
}
</style>
