<script setup>
import { ref } from 'vue'

const activeTab = ref('why-not-promise')

const openAccordions = ref({
  commitment1: false,
  commitment2: false,
  commitment3: false,
  // группы внутри
  commitment1a: false,
  commitment2a: false,
  commitment3a: false
})
const toggleAccordion = (key) => {
  openAccordions.value[key] = !openAccordions.value[key]
}
</script>

<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'why-not-promise' }" @click="activeTab = 'why-not-promise'">
      Почему не обещаем X2 рост
    </button>
    <button :class="{ active: activeTab === 'commitment' }" @click="activeTab = 'commitment'">
      Наше обязательство
    </button>
    <button :class="{ active: activeTab === 'guarantee-details' }" @click="activeTab = 'guarantee-details'">
      Как это работает
    </button>
    <button :class="{ active: activeTab === 'cause' }" @click="activeTab = 'cause'">
      Что значит «по нашей вине»
    </button>
    <button :class="{ active: activeTab === 'comparison' }" @click="activeTab = 'comparison'">
      Сравнение с рынком
    </button>
    <button :class="{ active: activeTab === 'for-whom' }" @click="activeTab = 'for-whom'">
      Для кого это
    </button>
    <button :class="{ active: activeTab === 'how-to-start' }" @click="activeTab = 'how-to-start'">
      Как начать
    </button>
  </div>
  <div class="panel-mr">
    <!-- Вкладка: Почему не обещаем X2 рост -->
    <div v-show="activeTab === 'why-not-promise'" class="content-mr">
      <h3>Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
      <p>
        Рынок бизнес-аналитики наводнен <strong>пустыми обещаниями</strong>: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:
      </p>
      <ul>
        <li><strong>Проценты легко манипулировать</strong> — 30% от чего и за какой период?</li>
        <li><strong>Возврат денег</strong> означает, что аналитик <strong>не несет ответственности</strong> за внедрение</li>
        <li><strong>Красивые цифры</strong> отвлекают от главного — <strong>реальных изменений</strong> в бизнесе</li>
      </ul>
      <div class="custom-dark-block">
        <p>
          <strong>Мы выбрали другой путь</strong><br>
          Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство</strong> — <strong>работать до получения результата</strong>.<br>
          Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.
        </p>
      </div>
    </div>

    <!-- Вкладка: Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3>Как работает наше обязательство</h3>

      <!-- Аккордеон 1 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span :class="{'arrow-open': openAccordions.commitment1}">▸</span> Карту системных узких мест
        </button>
        <div v-show="openAccordions.commitment1" class="accordion-content">
          <button class="accordion-sub-btn" @click="toggleAccordion('commitment1a')">
            <span :class="{'arrow-open': openAccordions.commitment1a}">▸</span> Подробнее
          </button>
          <ul v-show="openAccordions.commitment1a">
            <li>Конкретные данные о потерях эффективности</li>
            <li>Измеримые показатели каждой проблемы</li>
            <li>Приоритизация по влиянию на результат</li>
            <li>Валидация командой — не теоретические выводы, а подтверждённые факты</li>
          </ul>
        </div>
      </div>
      <!-- Аккордеон 2 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment2')">
          <span :class="{'arrow-open': openAccordions.commitment2}">▸</span> Три готовых к внедрению решения
        </button>
        <div v-show="openAccordions.commitment2" class="accordion-content">
          <button class="accordion-sub-btn" @click="toggleAccordion('commitment2a')">
            <span :class="{'arrow-open': openAccordions.commitment2a}">▸</span> Подробнее
          </button>
          <ul v-show="openAccordions.commitment2a">
            <li>Согласованные с командой планы действий</li>
            <li>Назначенные ответственные за каждое направление</li>
            <li>Чёткие критерии успеха по каждому решению</li>
            <li>Ресурсы и инструменты для реализации</li>
          </ul>
        </div>
      </div>
      <!-- Аккордеон 3 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment3')">
          <span :class="{'arrow-open': openAccordions.commitment3}">▸</span> Запущенные пилотные проекты
        </button>
        <div v-show="openAccordions.commitment3" class="accordion-content">
          <button class="accordion-sub-btn" @click="toggleAccordion('commitment3a')">
            <span :class="{'arrow-open': openAccordions.commitment3a}">▸</span> Подробнее
          </button>
          <ul v-show="openAccordions.commitment3a">
            <li>Работающие процессы по каждому из решений</li>
            <li>Первые измеримые результаты пилотов</li>
            <li>Обратная связь от команды по каждому нововведению</li>
            <li>План масштабирования успешных пилотов</li>
          </ul>
        </div>
      </div>
      <div class="mini-prompt">
        <strong>Что происходит, если мы не выполняем обязательство</strong><br>
        Если по истечении 30 дней <strong>хотя бы один</strong> из трёх пунктов не выполнен <strong>по нашей вине</strong>, мы продолжаем работать до его выполнения <strong>без дополнительной оплаты</strong>.<br>
        <strong>Ключевое условие:</strong> "по нашей вине" означает, что мы не переносим ответственность на клиента за <strong>наши</strong> методологические ошибки или <strong>нашу</strong> неспособность найти решения.
      </div>
    </div>

    <!-- Вкладка: Как это работает -->
    <div v-show="activeTab === 'guarantee-details'" class="content-mr">
      <h3>Почему это работает лучше традиционных гарантий</h3>
      <ul>
        <li>
          <strong>Конкретность вместо абстракций</strong><br>
          <span>Традиционный подход: "Увеличим эффективность на 30%"<br>
          Наш подход: "Запустим 3 пилота с назначенными ответственными"</span>
        </li>
        <li>
          <strong>Фокус на внедрении, а не на анализе</strong><br>
          <span>Традиционный подход: Дают рекомендации и уходят<br>
          Наш подход: Запускаем изменения и сопровождаем процесс</span>
          <br>80% провалов аналитических проектов происходит на этапе внедрения. Мы берём ответственность за этот этап.
        </li>
        <li>
          <strong>Совместная ответственность</strong><br>
          <span>Традиционный подход: "Если не сработает — вернём деньги"<br>
          Наш подход: "Если не работает — работаем дальше"</span>
        </li>
        <li>
          <strong>Измеримость с первых дней</strong><br>
          <span>Традиционный подход: Результат через 6–12 месяцев<br>
          Наш подход: Движение видно через 30 дней</span>
        </li>
      </ul>
    </div>

    <!-- Вкладка: Что значит "по нашей вине" -->
    <div v-show="activeTab === 'cause'" class="content-mr">
      <h3>Что значит «по нашей вине»</h3>
      <p>Мы несём <strong>полную ответственность</strong> за:</p>
      <ul>
        <li>Качество аналитики и точность выводов</li>
        <li>Готовность решений к внедрению в вашей среде</li>
        <li>Вовлечение команды и преодоление сопротивления</li>
        <li>Методологическую поддержку запуска пилотов</li>
      </ul>
      <p>Мы <strong>НЕ</strong> отвечаем за:</p>
      <ul>
        <li>Форс-мажорные обстоятельства (кризисы, изменения законодательства)</li>
        <li>Кардинальные изменения в команде или стратегии во время проекта</li>
        <li>Отказ руководства выполнять согласованные ранее решения</li>
      </ul>
      <h4>Как мы можем это гарантировать</h4>
      <ul>
        <li><strong>Опыт 15+ лет системной аналитики</strong></li>
        <li><strong>Фокус на быстрых победах</strong> — решения с быстрой реализацией для первого месяца</li>
        <li><strong>Работа только с готовыми компаниями</strong> — жесткая система отбора</li>
        <li><strong>Проверенная команда</strong> — каждый участник лично проверен на проектах</li>
      </ul>
    </div>

    <!-- Вкладка: Сравнение с рынком -->
    <div v-show="activeTab === 'comparison'" class="content-mr">
      <h3>Сравнение с рынком</h3>
      <table>
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

    <!-- Вкладка: Для кого это -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3>Для кого это обязательство</h3>
      <div class="for-whom-cards">
        <div class="forwhom-card positive">
          <h4>✅ Подходит, если вы:</h4>
          <ul>
            <li>Устали от красивых отчётов без реальных изменений</li>
            <li>Готовы вкладываться в системные улучшения</li>
            <li>Хотите видеть прогресс с первого месяца</li>
            <li>Готовы работать с нашей командой как партнёры</li>
          </ul>
        </div>
        <div class="forwhom-card negative">
          <h4>❌ Не подходит, если вы:</h4>
          <ul>
            <li>Ищете советы, которые подкрепляют вашу картину бизнеса</li>
            <li>Не готовы вовлекать команду в изменения</li>
            <li>Хотите только анализ без внедрения</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Вкладка: Как начать -->
    <div v-show="activeTab === 'how-to-start'" class="content-mr">
      <h3>Начать работу с обязательством</h3>
      <ol>
        <li>Подайте <strong>заявку на чекап</strong></li>
        <li><strong>Пройдите подготовительный чекап</strong>, чтобы оценить готовность к изменениям</li>
        <li><strong>Подпишите договор</strong> с зафиксированным обязательством</li>
        <li><strong>Получите результат</strong> в течение 30 дней или продолжение работы бесплатно</li>
      </ol>
      <div class="result-block result-block-equal">
        <p><strong>Готовы работать на результат?</strong></p>
        <p>
          Платите только за движение вперед. Обязательство включено в каждый проект.<br>
          Если вы готовы к системным изменениям, наше обязательство превратит ваш потенциал в <strong>измеримые результаты</strong> уже через месяц.
        </p>
        <a href="/apply" class="calc-button">Подать заявку на бизнес-чекап →</a>
      </div>
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
.content-mr p,
.content-mr ul,
.content-mr li,
.content-mr ol {
  font-size: 13px;
}
.content-mr p {
  margin: 0;
  color: rgba(255,255,255,0.88);
  line-height: 1.46;
}
.content-mr p:not(.intro-p):not(:last-child) {
  margin-bottom: 12px;
}
.content-mr .intro-p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 14px;
}
.content-mr h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255,255,255,0.9);
}
.content-mr h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  font-weight: 600;
}
.content-mr strong {
  font-weight: 600;
  color: #fff;
}

/* --- Плашки/блоки --- */
.result-block,
.custom-dark-block,
.mini-prompt {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 12px 14px;
  border-radius: 8px;
  margin-top: 20px;
}
.custom-dark-block {
  margin-bottom: 0;
  margin-top: 18px;
}
.mini-prompt {
  margin-top: 24px;
  font-size: 13px;
}

/* Одинаковый размер текста и стиля для итоговой плашки */
.result-block-equal p {
  font-size: 13px;
}

/* --- Аккордеоны --- */
.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 9px 0 9px 2px;
  text-align: left;
  color: #c8ff5a;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-size: 15px;
  cursor: pointer;
  position: relative;
  transition: background .2s;
}
.accordion-btn .arrow-open {
  display: inline-block;
  transform: rotate(90deg);
  transition: transform 0.18s;
  margin-right: 5px;
}
.accordion-btn span {
  margin-right: 5px;
}
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 2px solid #c8ff5a;
  margin-bottom: 8px;
  margin-left: 0.5em;
  border-radius: 6px;
  padding: 4px 0 6px 12px;
}
.accordion-sub-btn {
  background: none;
  border: none;
  color: #dbff75;
  font-size: 13px;
  margin: 3px 0 4px 0;
  cursor: pointer;
  padding: 2px 0 2px 9px;
}
.accordion-sub-btn .arrow-open {
  transform: rotate(90deg);
}
.accordion-sub-btn span { margin-right: 4px; }
.accordion-content ul {
  margin: 0 0 7px 0.3em;
  padding: 0 0 0 15px;
}

/* --- Карточки Для Кого --- */
.for-whom-cards {
  display: flex;
  gap: 24px;
  margin: 16px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap; /* Чтобы уходило вниз на мобилке */
}
.forwhom-card {
  flex: 1;
  min-width: 260px;
  background: rgba(0,0,0,0.25);
  border: 1.8px solid #c8ff5a;
  border-radius: 11px;
  padding: 20px 14px 18px 14px;
  margin-bottom: 12px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.09);
  transition: box-shadow .22s, transform .22s;
}
.forwhom-card.positive {
  border: 1.8px solid #55e74d;
}
.forwhom-card.negative {
  border: 1.8px solid #f05555;
}
.forwhom-card h4 {
  color: #fff;
  margin-bottom: 1em;
  font-size: 14px;
  text-align: left;
}
.forwhom-card ul {
  margin: 0;
  padding-left: 15px;
}
.forwhom-card ul li {
  color: #fff;
  font-size: 13px;
  margin-bottom: 7px;
  line-height: 1.5;
}

@media (max-width: 720px) {
  .for-whom-cards {
    flex-direction: column;
    gap: 13px;
  }
  .forwhom-card {
    min-width: 0;
    width: 100%;
  }
}

/* --- Таблица сравнения --- */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
th, td {
  padding: 7px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.11);
  font-size: 13px;
}
th {
  background: rgba(255,255,255,0.05);
  color: #c8ff5a;
  font-weight: 600;
  text-align: left;
}
tr:last-child td {
  border-bottom: none;
}
</style>
