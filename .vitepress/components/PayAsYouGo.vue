<script setup>
import { ref } from 'vue'
const activeTab = ref('checkup')
</script>

<template>
  <div class="mr-tabs">
    <button :class="{'mr-active': activeTab === 'checkup'}" @click="activeTab = 'checkup'">Чекап в 2 этапа</button>
    <button :class="{'mr-active': activeTab === 'system'}" @click="activeTab = 'system'">10 разделов бизнеса</button>
    <button :class="{'mr-active': activeTab === 'dmaic'}" @click="activeTab = 'dmaic'">Методология DMAIC</button>
    <button :class="{'mr-active': activeTab === 'results'}" @click="activeTab = 'results'">Результаты чекапа</button>
    <button :class="{'mr-active': activeTab === 'owner'}" @click="activeTab = 'owner'">Что получает собственник</button>
    <button :class="{'mr-active': activeTab === 'precision'}" @click="activeTab = 'precision'">Точность и контроль</button>
  </div>

  <div class="mr-panel">
    <!-- Чекап в 2 этапа -->
    <div v-show="activeTab === 'checkup'" class="mr-content">
      <h3>Чекап в 2 этапа</h3>
      <p>80% компаний не готовы к глубокому анализу — у них нет данных, дисциплины или полномочий. Наша система <strong>двухэтапного чекапа</strong> быстро показывает, готовы ли вы к трансформации или сначала нужен подготовительный этап.</p>
      <div class="mr-linkbox">
        <a href="/checkup/roadmap" class="mr-lime-link">
          <span>Перейти к <strong>Карте Чекапа</strong></span>
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- 10 разделов бизнеса -->
    <div v-show="activeTab === 'system'" class="mr-content">
      <h3>10 разделов бизнеса</h3>
      <ul class="mr-ul">
        <li><strong>Системный подход:</strong> анализ ~180 связанных метрик и изучение влияния изменений в одной сфере на остальные.</li>
        <li><strong>Конкретика:</strong> только точные цифры потенциала и сроки результата — никаких абстрактных советов.</li>
        <li><strong>Фокус на тотальной эффективности:</strong> выявление скрытых потерь, неэффективных процессов, лишних затрат и потерь времени/ресурсов.</li>
      </ul>
      <div class="mr-linkbox">
        <a href="/checkup/deep" class="mr-lime-link">
          <span>Подробнее о Глубоком Чекапе</span>
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Методология DMAIC -->
    <div v-show="activeTab === 'dmaic'" class="mr-content">
      <h3>Методология DMAIC + кросс-анализ</h3>
      <ul class="mr-ul">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Результаты чекапа -->
    <div v-show="activeTab === 'results'" class="mr-content">
      <h3>Результаты</h3>
      <ul class="mr-checked">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Точные метрики —</strong>
          например, "оптимизация графика закупок высвободит X млн ₽" или "изменение мотивации увеличит выручку на Y%"
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Приоритизированный план действий —</strong>
          что делать сейчас, а что отложить, с оценкой эффекта и сроков
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Пошаговые решения проблем —</strong>
          с учётом взаимосвязей между процессами
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Детальный отчёт —</strong>
          анализ ~180 ключевых метрик и пошаговый план внедрения с временными рамками
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Система контроля —</strong>
          трекинг результатов и регулярные чекапы
        </li>
      </ul>
    </div>

    <!-- Что получает собственник -->
    <div v-show="activeTab === 'owner'" class="mr-content">
      <h3>Что получает собственник</h3>
      <ul class="mr-checked">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Новый уровень стратегического мышления —</strong>
          применение фрейм-менеджмента к своему бизнесу
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Готовые инструменты —</strong>
          конкретный план изменений для решения задач
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Структуризация и систематизация —</strong>
          аудита существующего опыта
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <strong>Профессиональная поддержка —</strong>
          сопровождение экспертов на этапе внедрения
        </li>
      </ul>
    </div>

    <!-- Точность и контроль -->
    <div v-show="activeTab === 'precision'" class="mr-content">
      <h3>Что делает наш подход точным</h3>
      <ul class="mr-ul">
        <li><strong>Системный взгляд:</strong> анализируем бизнес как единый организм, 10 разделов от финансов до HR</li>
        <li><strong>RAG-анализ:</strong> быстрые и надёжные цифры для решений, никакой "воды"</li>
        <li><strong>Постоянные чекапы:</strong> ваша система непрерывных улучшений</li>
        <li><strong>DMAIC-подход:</strong> точная синхронизация с командой, результат ежедневного исполнения</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* tabs */
.mr-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.mr-tabs button {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.92);
  padding: 9px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all .2s ease;
  outline: none;
  box-shadow:none;
}
.mr-tabs button:hover, .mr-tabs .mr-active:not(:hover) {
  background: rgba(255,255,255,0.08);
  border-color: #c8ff5a;
}
.mr-tabs .mr-active {
  color: #0a0a0a;
  background: #c8ff5a;
  border-color: #c8ff5a;
  box-shadow: 0 0 0 2px rgba(200,255,90,0.22) inset;
}

/* panel */
.mr-panel {
  border: 1.5px solid rgba(255,255,255,0.14);
  border-radius: 19px;
  background: rgba(24,24,28,1);
  padding: 30px 32px 26px 32px;
  margin-top: 18px;
  color: #fff;
  box-sizing: border-box;
}

/* content */
.mr-content {
  color: rgba(255,255,255,0.95);
  font-size: 14px !important;
  line-height: 1.54;
  padding: 0;
}
.mr-content p:not(:last-child) { margin-bottom: 13px; }
.mr-content p, .mr-content li, .mr-content span, .mr-content strong {
  font-size: 14px !important;
  line-height: 1.58;
}
.mr-content h3 {
  margin: 0 0 17px;
  font-size: 22px;
  font-weight: 700;
  color: #FFF;
  line-height: 1.15;
}
.mr-content strong { font-weight: 800; color: #fff; }

/* обычный ul */
.mr-ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
}
.mr-ul li {
  position: relative;
  padding-left: 0;
  margin-bottom: 12px;
  color: #fff;
  font-size: 14px !important;
  line-height: 1.6;
  letter-spacing: 0.01em;
}
.mr-ul li::before {
  content: '–';
  position: absolute;
  left: -15px;
  color: rgba(255,255,255,0.52);
  font-size: 22px;
  font-weight: 400;
  top: -1px;
}

/* extra spacing для чек-листа */
.mr-checked {
  list-style: none;
  margin: 0 0 4px 0;
  padding: 0;
}
.mr-checked li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 14px;
  padding-left: 0;
  font-size: 14px !important;
  line-height: 1.58;
  letter-spacing: 0.01em;
}
.mr-checked li::before { display: none; }
.mr-lime-check {
  flex-shrink: 0;
  margin-top: 3px;
  margin-right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* link lime, защищен от тем */
.mr-linkbox {
  margin-top: 19px;
  font-size: 14px;
}
.mr-lime-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #c8ff5a !important;
  font-weight: 900;
  font-size: 17px;
  text-decoration: none !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  cursor: pointer;
  outline: none;
  letter-spacing: 0.01em;
  transition: color .2s;
  z-index: 0;
  --mr-arrow-move: 0px;
}
.mr-lime-link:visited,
.mr-lime-link:active { color: #c8ff5a !important; }
.mr-lime-link:hover { color: #d3ff43 !important; }
.mr-lime-link .mr-arrow {
  transition: transform 0.23s cubic-bezier(.7,.2,.3,1) 0s;
  margin-left: 6px;
  margin-top: 1px;
  display: flex;
  align-items: center;
  will-change: transform;
  /* for smooth motion */
}
.mr-lime-link:hover .mr-arrow {
  transform: translateX(14px);
}

/* BG dark for panel, white strong borders for full isolation */
.mr-panel, .mr-content, .mr-tabs, .mr-checked, .mr-ul {
  background: none !important;
  box-shadow: none !important;
}
</style>
