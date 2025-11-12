<script setup>
import { ref } from 'vue'

const activeTab = ref('why-not-promise')
const openAccordions = ref({
  commitment1: false,
  commitment2: false,
  commitment3: false
})
const toggleAccordion = (key) => {
  Object.keys(openAccordions.value).forEach(name => {
    openAccordions.value[name] = (name === key) ? !openAccordions.value[name] : false
  })
}
</script>

<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'why-not-promise' }" @click="activeTab = 'why-not-promise'">Почему не обещаем X2 рост</button>
    <button :class="{ active: activeTab === 'commitment' }" @click="activeTab = 'commitment'">Наше обязательство</button>
    <button :class="{ active: activeTab === 'guarantee-details' }" @click="activeTab = 'guarantee-details'">Как это работает</button>
    <button :class="{ active: activeTab === 'cause' }" @click="activeTab = 'cause'">Что значит «по нашей вине»</button>
    <button :class="{ active: activeTab === 'comparison' }" @click="activeTab = 'comparison'">Сравнение с рынком</button>
    <button :class="{ active: activeTab === 'for-whom' }" @click="activeTab = 'for-whom'">Для кого это</button>
    <button :class="{ active: activeTab === 'how-to-start' }" @click="activeTab = 'how-to-start'">Как начать</button>
  </div>

  <div class="panel-mr">
    <!-- Почему не обещаем X2 рост -->
    <div v-show="activeTab === 'why-not-promise'" class="content-mr">
      <h3 class="main-header">Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
      <p>Рынок бизнес-аналитики наводнен <strong>пустыми обещаниями</strong>: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:</p>
      <ul>
        <li><strong>Проценты легко манипулировать</strong> — 30% от чего и за какой период?</li>
        <li><strong>Возврат денег</strong> означает, что аналитик <strong>не несет ответственности</strong> за внедрение</li>
        <li><strong>Красивые цифры</strong> отвлекают от главного — <strong>реальных изменений</strong> в бизнесе</li>
      </ul>
      <div class="custom-dark-block custom-dark-block-compact">
        <p><strong>Мы выбрали другой путь</strong></p>
        <p>Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство — работать до получения результата</strong>.</p>
        <p>Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.</p>
      </div>
    </div>

    <!-- Как работает наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3 class="main-header commitment-header">Как работает наше обязательство</h3>
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span class="chevron-col">
            <svg :class="{ 'chevron-svg': true, 'chevron-open': openAccordions.commitment1 }" width="22" height="22" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <span :class="{ 'acc-title': true, 'acc-title-active': openAccordions.commitment1 }">Карту системных узких мест</span>
        </button>
        <ul v-show="openAccordions.commitment1" class="accordion-content">
          <li>Конкретные данные о потерях эффективности</li>
          <li>Измеримые показатели каждой проблемы</li>
          <li>Приоритизация по влиянию на результат</li>
          <li>Валидация командой — не теоретические выводы, а подтверждённые факты</li>
        </ul>
      </div>
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment2')">
          <span class="chevron-col">
            <svg :class="{ 'chevron-svg': true, 'chevron-open': openAccordions.commitment2 }" width="22" height="22" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <span :class="{ 'acc-title': true, 'acc-title-active': openAccordions.commitment2 }">Три готовых к внедрению решения</span>
        </button>
        <ul v-show="openAccordions.commitment2" class="accordion-content">
          <li>Согласованные с командой планы действий</li>
          <li>Назначенные ответственные за каждое направление</li>
          <li>Чёткие критерии успеха по каждому решению</li>
          <li>Ресурсы и инструменты для реализации</li>
        </ul>
      </div>
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment3')">
          <span class="chevron-col">
            <svg :class="{ 'chevron-svg': true, 'chevron-open': openAccordions.commitment3 }" width="22" height="22" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <span :class="{ 'acc-title': true, 'acc-title-active': openAccordions.commitment3 }">Запущенные пилотные проекты</span>
        </button>
        <ul v-show="openAccordions.commitment3" class="accordion-content">
          <li>Работающие процессы по каждому из решений</li>
          <li>Первые измеримые результаты пилотов</li>
          <li>Обратная связь от команды по каждому нововведению</li>
          <li>План масштабирования успешных пилотов</li>
        </ul>
      </div>
      <div class="mini-prompt">
        <p><strong>Что происходит, если мы не выполняем обязательство</strong></p>
        <p>Если по истечении 30 дней <strong>хотя бы один</strong> из трёх пунктов не выполнен <strong>по нашей вине</strong>, мы продолжаем работать до его выполнения <strong>без дополнительной оплаты</strong>.</p>
        <p><strong>Ключевое условие:</strong> "по нашей вине" означает, что мы не переносим ответственность на клиента за <strong>наши</strong> методологические ошибки или <strong>нашу</strong> неспособность найти решения.</p>
      </div>
    </div>

    <!-- Для кого это обязательство -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3 class="main-header">Для кого это обязательство</h3>
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

    <!-- Как начать -->
    <div v-show="activeTab === 'how-to-start'" class="content-mr">
      <h3 class="main-header">Начать работу с обязательством</h3>
      <ol class="steps-list">
        <li><strong>Подайте заявку на чекап.</strong></li>
        <li><strong>Пройдите подготовительный чекап</strong>, чтобы оценить готовность к изменениям.</li>
        <li><strong>Подпишите договор</strong> с зафиксированным обязательством.</li>
        <li><strong>Получите результат</strong> в течение 30 дней или продолжение работы бесплатно.</li>
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
    <!-- Остальные вкладки не изменялись, как раньше -->
  </div>
</template>

<style scoped>
/* ——— Общий контент и заголовки ——— */
.panel-mr {
  padding: 22px 16px 22px 16px;
}
.main-header {
  margin-top: 12px; /* Было 24px или больше, стало 2 раза меньше */
  margin-bottom: 18px;
  font-size: 2.2em;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #fff;
}
.content-mr p, .content-mr ul, .content-mr li, .content-mr ol {
  font-size: 17px;
  line-height: 1.65;
}
.content-mr ul, .content-mr ol {
  margin: 0 0 24px 18px;
  padding-left: 16px;
}
.content-mr li {
  margin-bottom: 7px;
}
.content-mr strong {
  font-weight: 700;
  color: #fff;
}
.content-mr h4 { font-size: 18px; font-weight: 700; margin: 0 0 11px 0; }

/* ——— Тёмный блок “Мы выбрали другой путь” ——— */
.custom-dark-block {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-top: 28px;
  margin-bottom: 0;
  padding: 16px 26px;
  line-height: 1.65;
}
.custom-dark-block-compact {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}
.custom-dark-block p { margin-bottom: 12px; }

/* ——— Аккордеон/табы “Как работает наше обязательство” ——— */
.commitment-header { margin-top: 12px; }
.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 11px 0 11px 0;
  text-align: left;
  color: #c8ff5a;
  font-weight: 800;
  margin-top: 2px;
  font-size: 23px;
  cursor: pointer;
  transition: background .2s;
  display: flex;
  align-items: center;
  line-height: 1.32;
}
.chevron-col {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 28px;
}
.chevron-svg {
  transition: transform 0.22s;
  color: #c8ff5a;
  width: 22px;
  height: 22px;
}
.chevron-open { transform: rotate(180deg);}
.acc-title {
  font-size: 23px;
  font-weight: 800;
  color: #dafe55;
  margin-left: 6px;
  transition: color .1s;
  line-height: 1;
}
.acc-title-active {
  color: #c8ff5a;
}
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 3px solid #c8ff5a;
  margin-bottom: 25px;
  margin-left: 34px;
  border-radius: 7px;
  padding: 14px 0 14px 28px;
  text-align: left;
  line-height: 1.54;
  font-size: 17px;
}
.accordion-content li { margin-bottom: 6px; }
.accordion-btn + .accordion-btn { margin-top: 0; }
.accordion-btn:last-child { margin-bottom: 0; }
.accordion-content ul, .accordion-content li {
  padding-left: 0;
}

/* ——— Мини-блок “Что происходит, если...” ——— */
.mini-prompt {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-top: 20px;
  margin-bottom: 0;
  padding: 16px 20px;
  font-size: 17px;
  line-height: 1.65;
}
.mini-prompt p:not(:last-child) {
  margin-bottom: 16px !important; /* межстрочный между абзацами */
}
.mini-prompt p:last-child { margin-bottom: 0 !important; }

/* ——— Для кого это — карточки ——— */
.for-whom-cards {
  display: flex;
  gap: 42px;
  margin: 28px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.forwhom-card {
  flex: 1;
  min-width: 260px;
  background: rgba(0,0,0,0.10);
  border: 2px solid #292929;
  border-radius: 16px;
  padding: 26px 28px 22px 28px;
  margin-bottom: 12px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.09);
  transition: box-shadow .22s, transform .22s;
}
.forwhom-card.positive { border: 2px solid #61f061; }
.forwhom-card.negative { border: 2px solid #fd5252; }
.forwhom-card h4 {
  color: #fff;
  margin-bottom: 13px;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.34;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
}
.forwhom-card ul { margin: 0; padding-left: 18px;}
.forwhom-card ul li { color: #fff; font-size: 17px; margin-bottom: 8px; line-height: 1.5; }
@media (max-width: 900px) {
  .for-whom-cards {
    flex-direction: column;
    gap: 18px;
  }
  .forwhom-card {
    min-width: 0;
    width: 100%;
  }
}

/* ——— Блок “перечень шагов” для "Как начать" ——— */
.steps-list {
  margin-bottom: 22px;
  line-height: 1.65;
  padding-left: 24px;
  font-size: 17px;
}
.steps-list li {
  margin-bottom: 10px;
}

.result-block,
.result-block-equal {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 20px 26px 18px 26px;
  margin-top: 22px;
  margin-bottom: 0;
  font-size: 17px;
  line-height: 1.65;
}
.result-block-equal p {
  margin-bottom: 12px;
  font-size: 17px;
}
.result-title {
  margin-bottom: 10px;
  font-size: 17px;
}
.calc-button {
  display: inline-block;
  background: #c8ff5a;
  color: #0a0a0a;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 17px;
  font-weight: 700;
  margin-top: 6px;
  transition: all .2s ease;
}
.calc-button:hover {
  background: #b8ef4a;
  transform: translateY(-1px);
}

.gray-compare {
  color: #a1a1a1;
  font-weight: 600;
  font-size: 17px;
}
</style>
