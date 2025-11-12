<script setup>
import { ref } from 'vue'
const activeTab = ref('checkup')
const openLink = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
const goTo = (url) => {
  window.location.href = url
}
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
    <!-- 1. Чекап в 2 этапа -->
    <div v-show="activeTab === 'checkup'" class="mr-content">
      <h3>Чекап в 2 этапа</h3>
      <p>80% компаний не готовы к глубокому анализу — у них нет данных, дисциплины или полномочий. Наша система <strong>двухэтапного чекапа</strong> быстро показывает, готовы ли вы к трансформации или сначала нужен подготовительный этап.</p>
      <div class="mr-linkbox">
        <button @click="openLink('/checkup/roadmap')" class="mr-lime-link">
          Перейти к Карте Чекапа
          <span class="mr-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
    <!-- 2. 10 разделов бизнеса -->
    <div v-show="activeTab === 'system'" class="mr-content">
      <h3>10 разделов бизнеса</h3>
      <ul class="mr-ul">
        <li><strong>Системный подход:</strong> анализ ~180 связанных метрик и изучение влияния изменений в одной сфере на остальные.</li>
        <li><strong>Конкретика:</strong> только точные цифры потенциала и сроки результата — никаких абстрактных советов.</li>
        <li><strong>Фокус на тотальной эффективности:</strong> выявление скрытых потерь, неэффективных процессов, лишних затрат и потерь времени/ресурсов.</li>
      </ul>
      <div class="mr-linkbox">
        <button @click="openLink('/checkup/deep')" class="mr-lime-link">
          Подробнее о Глубоком Чекапе
          <span class="mr-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
    <!-- 3. Методология DMAIC -->
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
        <button @click="openLink('/technology/analytics-360')" class="mr-lime-link">
          Аналитика 360°
          <span class="mr-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
    <!-- 4. Результаты чекапа -->
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="м9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Детальный отчёт —</strong><br>
            анализ ~180 ключевых метрик и пошаговый план внедрения с временными рамками
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="м9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Система контроля —</strong><br>
            трекинг результатов и регулярные чекапы
          </div>
        </li>
      </ul>
    </div>
    <!-- 5. Что получает собственник -->
    <div v-show="activeTab === 'owner'" class="mr-content">
      <h3>Что получает собственник</h3>
      <ul class="mr-checked">
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="м9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Новый уровень стратегического мышления —</strong><br>
            применение фрейм-менеджмента к своему бизнесу
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="м9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Готовые инструменты —</strong><br>
            конкретный план изменений для решения задач
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="м9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Структуризация и систематизация —</strong><br>
            аудита существующего опыта
          </div>
        </li>
        <li>
          <span class="mr-lime-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="м9 11 3 3L22 4"/></svg>
          </span>
          <div>
            <strong>Профессиональная поддержка —</strong><br>
            сопровождение экспертов на этапе внедрения
          </div>
        </li>
      </ul>
    </div>
    <!-- 6. Точность и контроль -->
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
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  margin-bottom: 16px !important;
}
.mr-tabs button {
  appearance: none !important;
  border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
  background: rgba(255, 255, 255, 0.04) !important;
  color: rgba(255, 255, 255, 0.92) !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  line-height: 1 !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  outline: none !important;
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
  border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 20px !important;
  background: rgba(24, 24, 28, 1) !important;
  padding: 32px !important;
  color: #fff !important;
  box-sizing: border-box !important;
}
/* === КОНТЕНТ === */
.mr-content {
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
}
.mr-content h3 {
  margin: 0 0 18px !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #fff !important;
  line-height: 1.2 !important;
}
.mr-content strong {
  font-weight: 800 !important;
  color: #fff !important;
}
.mr-content p {
  margin: 0 0 16px 0 !important;
  line-height: 1.45 !important;
}
/* === СПИСОК С ДЭШЕМ === */
.mr-ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 0 20px 0 !important;
}
.mr-ul li {
  position: relative !important;
  padding-left: 22px !important;
  margin-bottom: 10px !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
  color: #fff !important;
}
.mr-ul li::before {
  content: '–' !important;
  position: absolute !important;
  left: 0 !important;
  top: -2px !important;
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 24px !important;
  font-weight: 400 !important;
  line-height: 1 !important;
}
/* === ЧЕК-ЛИСТ === */
.mr-checked {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
.mr-checked li {
  display: flex !important;
  align-items: flex-start !important;
  gap: 16px !important;
  margin-bottom: 14px !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
}
.mr-checked li > div {
  flex: 1 !important;
}
.mr-lime-check {
  flex-shrink: 0 !important;
  margin-top: 1px !important;
  color: #c8ff5a !important;
}
/* === ССЫЛКА — ЛАЙМОВАЯ, ЖИРНАЯ, С АНИМАЦИЕЙ === */
.mr-linkbox {
  margin-top: 20px !important;
}
.mr-lime-link {
  display: inline-block !important;
  text-align: left !important;
  margin-top: 0 !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  color: #c8ff5a !important;
  text-decoration: none !important;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  letter-spacing: normal !important;
  padding: 0 !important;
  position: relative !important;
  z-index: 2 !important;
  cursor: pointer !important;
  transition: color 0.22s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1) !important;
}
.mr-lime-link:hover {
  color: #e8ff8a !important;
  transform: translateX(2px) !important;
}
.mr-arrow {
  display: inline-block !important;
  vertical-align: middle !important;
  transition: transform 0.22s cubic-bezier(.4,0,.2,1) !important;
  margin-left: 7px !important;
}
.mr-lime-link:hover .mr-arrow,
.mr-lime-link:focus .mr-arrow {
  transform: translateX(8px) !important;
}
.mr-arrow svg {
  stroke: #c8ff5a !important;
  display: block !important;
  width: 18px !important;
  height: 18px !important;
}
.mr-lime-link:hover .mr-arrow svg {
  stroke: #e8ff8a !important;
}
/* МОБИЛЬНАЯ АДАПТАЦИЯ */
@media (max-width: 768px) {
  .mr-tabs {
    justify-content: center !important;
  }
  .mr-panel {
    padding: 24px !important;
  }
  .mr-content h3 {
    font-size: 20px !important;
  }
}
</style>
