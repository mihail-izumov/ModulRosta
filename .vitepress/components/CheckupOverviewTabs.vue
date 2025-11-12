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
          Перейти к Карте Чекапа
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
          Подробнее о Глубоком Чекапе
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>

    <!-- Методология DMAIC -->
    <div v-show="activeTab === 'dmaic'" class="mr-content">
      <h3>Методология DMAIC + кросс-анализ</h3>
      <ul class="mr-ul">
        <li><strong>Определяем:</strong> проблемы по принципу "есть/нет" и сразу приоритезируем их.</li>
        <li><strong>Измеряем:</strong> текущее состояние и строим базовую линию.</li>
        <li><strong>Анализируем:</strong> причины проблем — ищем взаимосвязи между процессами.</li>
        <li><strong>Улучшаем:</strong> точечно, прогнозируя влияние на все соседние области.</li>
        <li><strong>Контролируем:</strong> результаты через систему раннего предупреждения и регулярных чекапов.</li>
      </ul>
      <div class="mr-linkbox">
        <a href="/technology/analytics-360" class="mr-lime-link" target="_blank" rel="noopener">
          Аналитика 360°
          <span class="mr-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Точные метрики —</strong><br>
            например, "оптимизация графика закупок высвободит X млн ₽" или "изменение мотивации увеличит выручку на Y%"
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Приоритизированный план действий —</strong><br>
            что делать сейчас, а что отложить, с оценкой эффекта и сроков
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Пошаговые решения проблем —</strong><br>
            с учётом взаимосвязей между процессами
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Детальный отчёт —</strong><br>
            анализ ~180 ключевых метрик и пошаговый план внедрения с временными рамками
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Система контроля —</strong><br>
            трекинг результатов и регулярные чекапы
          </div>
        </li>
      </ul>
    </div>

    <!-- Что получает собственник -->
    <div v-show="activeTab === 'owner'" class="mr-content">
      <h3>Что получает собственник</h3>
      <ul class="mr-checked">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Новый уровень стратегического мышления —</strong><br>
            применение фрейм-менеджмента к своему бизнесу
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Готовые инструменты —</strong><br>
            конкретный план изменений для решения задач
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Структуризация и систематизация —</strong><br>
            аудита существующего опыта
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Профессиональная поддержка —</strong><br>
            сопровождение экспертов на этапе внедрения
          </div>
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
/* === ТАБЫ === */
.mr-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.mr-tabs button {
  appearance: none;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.92);
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;
}

.mr-tabs button:hover:not(.mr-active) {
  background: rgba(200, 255, 90, 0.12) !important;
  border-color: #c8ff5a !important;
  color: #fff !important;
}

.mr-tabs .mr-active {
  background: #c8ff5a !important;
  border-color: #c8ff5a !important;
  color: #0a0a0a !important;
  box-shadow: 0 0 0 2px rgba(200, 255, 90, 0.3) inset !important;
}

/* === ПАНЕЛЬ === */
.mr-panel {
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  background: rgba(24, 24, 28, 1);
  padding: 32px;
  color: #fff;
  box-sizing: border-box;
}

/* === КОНТЕНТ === */
.mr-content {
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  line-height: 1.45;
}

.mr-content h3 {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.mr-content strong {
  font-weight: 800;
  color: #fff;
}

.mr-content p {
  margin: 0 0 16px 0;
  line-height: 1.45;
}

/* === СПИСОК С ДЭШЕМ === */
.mr-ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.mr-ul li {
  position: relative;
  padding-left: 22px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.45;
  color: #fff;
}

.mr-ul li::before {
  content: '–';
  position: absolute;
  left: 0;
  top: -2px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
}

/* === ЧЕК-ЛИСТ === */
.mr-checked {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mr-checked li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 14px;
  font-size: 14px;
  line-height: 1.45;
}

.mr-checked li > div {
  flex: 1;
}

.mr-lime-check {
  flex-shrink: 0;
  margin-top: 1px;
  color: #c8ff5a;
}

/* === ССЫЛКА — 100% ЛАЙМОВАЯ, СРЕДНЯЯ ЖИРНОСТЬ, ПЕРЕБИВАЕТ VITEPRESS === */
.mr-linkbox {
  margin-top: 20px;
}

.mr-lime-link {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  color: #c8ff5a !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
  text-decoration: none !important;
  background: none !important;
  border: none !important;
  padding: 0 !important;
  cursor: pointer !important;
  transition: color 0.35s ease, transform 0.35s ease !important;
  position: relative !important;
  z-index: 1 !important;
}

.mr-lime-link:hover {
  color: #e8ff8a !important;
  transform: translateX(2px) !important;
}

.mr-lime-link .mr-arrow {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
  color: #c8ff5a !important;
  stroke: #c8ff5a !important;
  fill: none !important;
}

.mr-lime-link:hover .mr-arrow {
  transform: translateX(12px) !important;
  color: #e8ff8a !important;
}

/* ЖЁСТКОЕ ПЕРЕБИВАНИЕ VITEPRESS */
a.mr-lime-link,
a.mr-lime-link *,
a.mr-lime-link span,
a.mr-lime-link svg,
a.mr-lime-link:hover,
a.mr-lime-link:hover *,
a.mr-lime-link:hover span,
a.mr-lime-link:hover svg {
  color: inherit !important;
  text-decoration: none !important;
  font-weight: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
</style>
