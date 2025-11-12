<script setup>
import { ref } from 'vue'
// Устанавливаем первую вкладку активной по умолчанию
const activeTab = ref('checkup')
</script>

<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'checkup' }" @click="activeTab = 'checkup'">
      Чекап: 2 этапа
    </button>
    <button :class="{ active: activeTab === 'system' }" @click="activeTab = 'system'">
      Системный подход
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
    <!-- Вкладка: 2 этапа чекапа -->
    <div v-show="activeTab === 'checkup'" class="content-mr">
      <h3>Проверка готовности компании к системной трансформации: 2 этапа</h3>
      <p>80% компаний не готовы к глубокому анализу — у них нет данных, дисциплины или полномочий. Наша система <strong>двухэтапного чекапа</strong> быстро показывает, готовы ли вы к трансформации или сначала нужно подготовительный этап.</p>
    </div>

    <!-- Вкладка: Системный подход -->
    <div v-show="activeTab === 'system'" class="content-mr">
      <h3>Системный взгляд, а не точечные решения</h3>
      <ul>
        <li><strong>Системный подход:</strong> анализ ~180 связанных метрик и изучение влияния изменений в одной сфере на остальные.</li>
        <li><strong>Конкретика:</strong> только точные цифры потенциала и сроки результата — никаких абстрактных советов.</li>
        <li><strong>Фокус на тотальной эффективности:</strong> выявление скрытых потерь, неэффективных процессов, лишних затрат и потерь времени/ресурсов.</li>
      </ul>
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
      <ul>
        <li>Точные метрики — например, "оптимизация графика закупок высвободит X млн ₽" или "изменение мотивации увеличит выручку на Y%"</li>
        <li>Приоритизированный план действий с оценкой эффекта и сроков — что делать сейчас, а что отложить</li>
        <li>Пошаговые решения проблем с учётом взаимосвязей</li>
        <li>Детальный отчёт (~180 ключевых метрик) и пошаговый план внедрения с временными рамками</li>
        <li>Система контроля и трекинг результатов</li>
      </ul>
    </div>

    <!-- Вкладка: Для собственника -->
    <div v-show="activeTab === 'owner'" class="content-mr">
      <h3>Что получает собственник</h3>
      <ul>
        <li>Новый уровень стратегического мышления и применение фрейм-менеджмента к своему бизнесу</li>
        <li>Готовые инструменты для решения задач: конкретный план изменений</li>
        <li>Структуризация и систематизация текущего опыта</li>
        <li>Профессиональная поддержка экспертов на этапе внедрения</li>
      </ul>
    </div>

    <!-- Вкладка: Точность и контроль -->
    <div v-show="activeTab === 'precision'" class="content-mr">
      <h3>Что делает наш подход точным</h3>
      <ul>
        <li>Системный взгляд: анализируем бизнес как единый организм, 10 разделов от финансов до HR</li>
        <li>RAG-анализ: быстрые и надёжные цифры для принятия решений без "воды"</li>
        <li>Постоянные чекапы: ваша система непрерывных улучшений</li>
        <li>DMAIC-подход: точная синхронизация с командой, результат ежедневного исполнения</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Оставьте ваш оригинальный CSS без изменений — он подходит */
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

.content-mr .index-item {
  line-height: 1.5;
  background: rgba(255,255,255,0.03);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #c8ff5a;
}

.content-mr .index-item span {
  color: rgba(255,255,255,0.6);
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
</style>
