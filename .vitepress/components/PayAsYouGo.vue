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
  <div class="mr-tabs">
    <button :class="{ 'mr-active': activeTab === 'why-not-promise' }" @click="activeTab = 'why-not-promise'">
      Почему не обещаем X2 рост
    </button>
    <button :class="{ 'mr-active': activeTab === 'commitment' }" @click="activeTab = 'commitment'">
      Наше обязательство
    </button>
    <button :class="{ 'mr-active': activeTab === 'guarantee-details' }" @click="activeTab = 'guarantee-details'">
      Как это работает
    </button>
    <button :class="{ 'mr-active': activeTab === 'cause' }" @click="activeTab = 'cause'">
      Что значит «по нашей вине»
    </button>
    <button :class="{ 'mr-active': activeTab === 'comparison' }" @click="activeTab = 'comparison'">
      Сравнение с рынком
    </button>
    <button :class="{ 'mr-active': activeTab === 'for-whom' }" @click="activeTab = 'for-whom'">
      Для кого это
    </button>
    <button :class="{ 'mr-active': activeTab === 'how-to-start' }" @click="activeTab = 'how-to-start'">
      Как начать
    </button>
  </div>

  <div class="mr-panel">
    <!-- 1. Почему не обещаем X2 -->
    <div v-show="activeTab === 'why-not-promise'" class="mr-content">
      <h3>Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
      <p>Рынок бизнес-аналитики наводнен <strong>пустыми обещаниями</strong>: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:</p>
      <ul class="mr-ul">
        <li><strong>Проценты легко манипулировать</strong> — 30% от чего и за какой период?</li>
        <li><strong>Возврат денег</strong> означает, что аналитик <strong>не несет ответственности</strong> за внедрение</li>
        <li><strong>Красивые цифры</strong> отвлекают от главного — <strong>реальных изменений</strong> в бизнесе</li>
      </ul>
      <div class="mr-highlight">
        <h4>Мы выбрали другой путь</h4>
        <p>Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство</strong> — <strong>работать до получения результата</strong>.<br>Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.</p>
      </div>
    </div>

    <!-- 2. Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="mr-content">
      <h3>Как работает наше обязательство</h3>

      <div class="mr-accordion">
        <button @click="toggleAccordion('commitment1')" class="mr-accordion-btn">
          <span :class="{ 'mr-open': openAccordions.commitment1 }" class="mr-arrow-icon">></span>
          <span class="mr-acc-title">Карту системных узких мест</span>
        </button>
        <div v-show="openAccordions.commitment1" class="mr-accordion-body">
          <ul class="mr-ul">
            <li>Конкретные данные о потерях эффективности</li>
            <li>Измеримые показатели каждой проблемы</li>
            <li>Приоритизация по влиянию на результат</li>
            <li>Валидация командой — не теоретические выводы, а подтверждённые факты</li>
          </ul>
        </div>
      </div>

      <div class="mr-accordion">
        <button @click="toggleAccordion('commitment2')" class="mr-accordion-btn">
          <span :class="{ 'mr-open': openAccordions.commitment2 }" class="mr-arrow-icon">></span>
          <span class="mr-acc-title">Три готовых к внедрению решения</span>
        </button>
        <div v-show="openAccordions.commitment2" class="mr-accordion-body">
          <ul class="mr-ul">
            <li>Согласованные с командой планы действий</li>
            <li>Назначенные ответственные за каждое направление</li>
            <li>Чёткие критерии успеха по каждому решению</li>
            <li>Ресурсы и инструменты для реализации</li>
          </ul>
        </div>
      </div>

      <div class="mr-accordion">
        <button @click="toggleAccordion('commitment3')" class="mr-accordion-btn">
          <span :class="{ 'mr-open': openAccordions.commitment3 }" class="mr-arrow-icon">></span>
          <span class="mr-acc-title">Запущенные пилотные проекты</span>
        </button>
        <div v-show="openAccordions.commitment3" class="mr-accordion-body">
          <ul class="mr-ul">
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

    <!-- 3. Как это работает -->
    <div v-show="activeTab === 'guarantee-details'" class="mr-content">
      <h3>Почему это работает лучше традиционных гарантий</h3>
      <ul class="mr-ul">
        <li>
          <strong>Конкретность вместо абстракций</strong><br>
          <span class="mr-gray">Традиционный подход: "Увеличим эффективность на 30%"</span><br>
          Наш подход: "Запустим 3 пилота с назначенными ответственными"
        </li>
        <li>
          <strong>Фокус на внедрении, а не на анализе</strong><br>
          <span class="mr-gray">Традиционный подход: Дают рекомендации и уходят</span><br>
          Наш подход: Запускаем изменения и сопровождаем процесс<br>
          80% провалов аналитических проектов происходит на этапе внедрения. Мы берём ответственность за этот этап.
        </li>
        <li>
          <strong>Совместная ответственность</strong><br>
          <span class="mr-gray">Традиционный подход: "Если не сработает — вернём деньги"</span><br>
          Наш подход: "Если не работает — работаем дальше"
        </li>
        <li>
          <strong>Измеримость с первых дней</strong><br>
          <span class="mr-gray">Традиционный подход: Результат через 6–12 месяцев</span><br>
          Наш подход: Движение видно через 30 дней
        </li>
      </ul>
    </div>

    <!-- 4. Что значит "по нашей вине" -->
    <div v-show="activeTab === 'cause'" class="mr-content">
      <h3>Что значит «по нашей вине»</h3>
      <p>Мы несём <strong>полную ответственность</strong> за:</p>
      <ul class="mr-ul">
        <li>Качество аналитики и точность выводов</li>
        <li>Готовность решений к внедрению в вашей среде</li>
        <li>Вовлечение команды и преодоление сопротивления</li>
        <li>Методологическую поддержку запуска пилотов</li>
      </ul>
      <p>Мы <strong>НЕ</strong> отвечаем за:</p>
      <ul class="mr-ul">
        <li>Форс-мажорные обстоятельства (кризисы, изменения законодательства)</li>
        <li>Кардинальные изменения в команде или стратегии во время проекта</li>
        <li>Отказ руководства выполнять согласованные ранее решения</li>
      </ul>
      <h4>Как мы можем это гарантировать</h4>
      <ul class="mr-ul">
        <li><strong>Опыт 15+ лет системной аналитики</strong></li>
        <li><strong>Фокус на быстрых победах</strong> — решения с быстрой реализацией для первого месяца</li>
        <li><strong>Работа только с готовыми компаниями</strong> — жесткая система отбора</li>
        <li><strong>Проверенная команда</strong> — каждый участник лично проверен на проектах</li>
      </ul>
    </div>

    <!-- 5. Сравнение с рынком -->
    <div v-show="activeTab === 'comparison'" class="mr-content">
      <h3>Сравнение с рынком</h3>
      <table class="mr-table">
        <thead>
          <tr>
            <th>Критерий</th>
            <th>Традиционные консультанты</th>
            <th>Модуль Роста</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Что обещают</td>
            <td>Абстрактные проценты роста</td>
            <td>Конкретные запущенные изменения</td>
          </tr>
          <tr>
            <td>Когда результат</td>
            <td>Через 6-12 месяцев</td>
            <td>Через 30 дней</td>
          </tr>
          <tr>
            <td>Что делают при неудаче</td>
            <td>Возвращают деньги</td>
            <td>Работаем до результата</td>
          </tr>
          <tr>
            <td>Ответственность</td>
            <td>За качество отчета</td>
            <td>За внедрение решений</td>
          </tr>
          <tr>
            <td>Фокус</td>
            <td>На анализе</td>
            <td>На действии</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 6. Для кого это -->
    <div v-show="activeTab === 'for-whom'" class="mr-content">
      <h3>Для кого это обязательство</h3>
      <div class="mr-for-whom">
        <div class="mr-card mr-positive">
          <h4>Подходит, если вы:</h4>
          <ul class="mr-ul">
            <li>Устали от красивых отчётов без реальных изменений</li>
            <li>Готовы вкладываться в системные улучшения</li>
            <li>Хотите видеть прогресс с первого месяца</li>
            <li>Готовы работать с нашей командой как партнёры</li>
          </ul>
        </div>
        <div class="mr-card mr-negative">
          <h4>Не подходит, если вы:</h4>
          <ul class="mr-ul">
            <li>Ищете советы, которые подкрепляют вашу картину бизнеса</li>
            <li>Не готовы вовлекать команду в изменения</li>
            <li>Хотите только анализ без внедрения</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 7. Как начать -->
    <div v-show="activeTab === 'how-to-start'" class="mr-content">
      <h3>Начать работу с обязательством</h3>
      <ol class="mr-ol">
        <li>Подайте <strong>заявку на чекап</strong></li>
        <li><strong>Пройдите подготовительный чекап</strong>, чтобы оценить готовность к изменениям</li>
        <li><strong>Подпишите договор</strong> с зафиксированным обязательством</li>
        <li><strong>Получите результат</strong> в течение 30 дней или продолжение работы бесплатно</li>
      </ol>
      <div class="mr-highlight">
        <h4>Готовы работать на результат?</h4>
        <p>Платите только за движение вперед. Обязательство включено в каждый проект.<br>Если вы готовы к системным изменениям, наше обязательство превратит ваш потенциал в <strong>измеримые результаты</strong> уже через месяц.</p>
        <button @click="openLink('/apply')" class="mr-lime-link">
          Подать заявку на бизнес-чекап
          <span class="mr-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </button>
      </div>
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
.mr-content h4 {
  margin: 16px 0 8px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #fff !important;
}
.mr-content strong {
  font-weight: 800 !important;
  color: #fff !important;
}
.mr-content p {
  margin: 0 0 16px 0 !important;
  line-height: 1.45 !important;
}

/* === СПИСКИ === */
.mr-ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 0 16px 0 !important;
}
.mr-ul li {
  position: relative !important;
  padding-left: 22px !important;
  margin-bottom: 8px !important;
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

.mr-ol {
  counter-reset: ol-counter !important;
  padding-left: 0 !important;
  margin: 0 0 20px 0 !important;
}
.mr-ol li {
  counter-increment: ol-counter !important;
  position: relative !important;
  padding-left: 32px !important;
  margin-bottom: 8px !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
}
.mr-ol li::before {
  content: counter(ol-counter) "." !important;
  position: absolute !important;
  left: 0 !important;
  color: #c8ff5a !important;
  font-weight: 700 !important;
}

/* === ВЫДЕЛЕННЫЙ БЛОК === */
.mr-highlight {
  background: rgba(200, 255, 90, 0.08) !important;
  border: 1.5px solid #c8ff5a !important;
  border-radius: 16px !important;
  padding: 24px !important;
  margin-top: 24px !important;
  text-align: center !important;
}
.mr-highlight h4 {
  margin: 0 0 12px !important;
  font-size: 18px !important;
  color: #fff !important;
}
.mr-highlight p {
  margin: 0 0 16px !important;
  font-size: 14px !important;
}

/* === АККОРДЕОН === */
.mr-accordion {
  margin-bottom: 16px !important;
}
.mr-accordion-btn {
  width: 100% !important;
  background: none !important;
  border: none !important;
  padding: 12px 0 !important;
  text-align: left !important;
  color: #c8ff5a !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
}
.mr-accordion-btn:hover {
  background: rgba(200, 255, 90, 0.08) !important;
}
.mr-arrow-icon {
  font-size: 32px !important;
  transition: transform 0.25s ease !important;
  color: #c8ff5a !important;
}
.mr-open {
  transform: rotate(90deg) !important;
}
.mr-acc-title {
  color: #dafe55 !important;
}
.mr-accordion-body {
  background: rgba(255, 255, 255, 0.02) !important;
  border-left: 3px solid #c8ff5a !important;
  margin: 8px 0 20px 44px !important;
  padding: 12px 0 12px 24px !important;
  border-radius: 7px !important;
}
.mr-accordion-body .mr-ul li::before {
  content: '•' !important;
  color: #c8ff5a !important;
  font-size: 18px !important;
  top: 0 !important;
}

/* === СЕРЫЙ ТЕКСТ === */
.mr-gray {
  color: #a1a1a1 !important;
  font-size: 13px !important;
  display: block !important;
  margin: 4px 0 !important;
}

/* === ТАБЛИЦА === */
.mr-table {
  width: 100% !important;
  border-collapse: collapse !important;
  margin: 20px 0 !important;
  font-size: 14px !important;
}
.mr-table th,
.mr-table td {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px !important;
  text-align: left !important;
}
.mr-table th {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #c8ff5a !important;
  font-weight: 700 !important;
}
.mr-table td {
  background: rgba(255, 255, 255, 0.02) !important;
}
.mr-table tbody tr:nth-child(odd) td {
  background: rgba(255, 255, 255, 0.03) !important;
}

/* === КАРТОЧКИ ДЛЯ КОГО === */
.mr-for-whom {
  display: flex !important;
  gap: 20px !important;
  margin-top: 20px !important;
  flex-wrap: wrap !important;
}
.mr-card {
  flex: 1 !important;
  min-width: 260px !important;
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1.8px solid #c8ff5a !important;
  border-radius: 11px !important;
  padding: 20px !important;
}
.mr-positive {
  border-color: #55e74d !important;
}
.mr-negative {
  border-color: #f05555 !important;
}
.mr-card h4 {
  margin: 0 0 12px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #fff !important;
}

/* === ССЫЛКА === */
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
.mr-lime-link:hover .mr-arrow {
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
</style>
