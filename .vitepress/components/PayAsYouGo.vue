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
      <h3 class="main-title">Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
      <p>
        Рынок бизнес-аналитики наводнен <strong>пустыми обещаниями</strong>: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:
      </p>
      <ul>
        <li><strong>Проценты легко манипулировать</strong> — 30% от чего и за какой период?</li>
        <li><strong>Возврат денег</strong> означает, что аналитик <strong>не несет ответственности</strong> за внедрение</li>
        <li><strong>Красивые цифры</strong> отвлекают от главного — <strong>реальных изменений</strong> в бизнесе</li>
      </ul>
      <div class="custom-dark-block tight-block">
        <p><strong>Мы выбрали другой путь</strong></p>
        <p>
          Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство — работать до получения результата</strong>.<br>
          Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.
        </p>
      </div>
    </div>
    <!-- Вкладка: Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3 class="main-title">Как работает наше обязательство</h3>
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span class="chevron-col">
            <svg :class="{ 'chevron-svg': true, 'chevron-open': openAccordions.commitment1 }" width="22" height="22" fill="none" stroke="currentColor"
                 stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <span class="acc-title">Карту системных узких мест</span>
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
                 stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <span class="acc-title">Три готовых к внедрению решения</span>
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
                 stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                 viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <span class="acc-title">Запущенные пилотные проекты</span>
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
        <p>
          Если по истечении 30 дней <strong>хотя бы один</strong> из трёх пунктов не выполнен <strong>по нашей вине</strong>, мы продолжаем работать до его выполнения <strong>без дополнительной оплаты</strong>.
        </p>
        <p>
          <strong>Ключевое условие:</strong> "по нашей вине" означает, что мы не переносим ответственность на клиента за <strong>наши</strong> методологические ошибки или <strong>нашу</strong> неспособность найти решения.
        </p>
      </div>
    </div>
    <!-- ...Остальные вкладки без изменений... -->
    <!-- Вкладка: Для кого это обязательство -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3 class="main-title">Для кого это обязательство</h3>
      <div class="for-whom-cards new-cards-layout">
        <div class="forwhom-card positive big-card">
          <h4><span class="card-ico">✅</span> Подходит, если вы:</h4>
          <ul>
            <li>Устали от красивых отчётов без реальных изменений</li>
            <li>Готовы вкладываться в системные улучшения</li>
            <li>Хотите видеть прогресс с первого месяца</li>
            <li>Готовы работать с нашей командой как партнёры</li>
          </ul>
        </div>
        <div class="forwhom-card negative big-card">
          <h4><span class="card-ico red">❌</span> Не подходит, если вы:</h4>
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
      <h3 class="main-title">Начать работу с обязательством</h3>
      <ol class="steps-list">
        <li>Подайте <strong>заявку на чекап</strong>.</li>
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
  </div>
</template>

<style scoped>
/* --- Базовые отступы и размеры --- */
.panel-mr {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 22px 30px 24px 32px;
}
.main-title { /* 1) уменьшили отступ сверху — 22/2=11 */
  margin-top: 11px;
  margin-bottom: 23px;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #fff;
  line-height: 1.13;
}

/* --- Steps list instruction --- */
.steps-list {
  margin-bottom: 24px;
  line-height: 1.46;
  padding-left: 22px;
}
.steps-list li {
  margin-bottom: 9px;
  font-size: 18px;
}
.steps-list strong { font-weight: 700; }

/* --- Темная плашка (блок "другой путь") --- */
.custom-dark-block {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-top: 28px;
  margin-bottom: 0;
  padding: 15px 22px 11px 26px; /* 2) сверху и снизу в 2 раза меньше */
  line-height: 1.46;
}
.tight-block p { margin-bottom: 12px; }

/* --- Выпадающие списки с chevron --- */
.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 12px 0 12px 0;
  text-align: left;
  color: #c8ff5a;
  font-weight: 700;
  margin: 0 0 5px 0;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.chevron-col {
  display: flex;
  align-items: center;
  min-width: 38px;
  height: 29px;
  justify-content: center;
}
.chevron-svg {
  transition: transform 0.22s;
  color: #c8ff5a;
  width: 22px;
  height: 22px;
}
.chevron-open {
  transform: rotate(180deg);
}
.acc-title {
  font-size: 24px;
  font-weight: 700;
  color: #dafe55;
  margin-left: 6px;
}

/* Оформление выпадающего блока */
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 3px solid #c8ff5a;
  margin-left: 32px;
  margin-bottom: 18px;
  border-radius: 7px;
  padding: 18px 0 18px 22px;
  font-size: 20px;
}
.accordion-content ul,
.accordion-content li {
  padding-left: 0;
  margin-left: 0;
}
.accordion-content li {
  margin-bottom: 7px;
}

/* --- mini-prompt и его абзацы --- */
.mini-prompt {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-top: 18px;
  padding: 15px 20px 15px 24px;
  font-size: 19px;
  line-height: 1.44;
}
.mini-prompt p {
  margin-bottom: 15px; /* 4) межстрочные между параграфами */
  font-size: 19px;
  line-height: 1.44;
}
.mini-prompt p:last-child { margin-bottom: 0; }

/* --- Для карточек подхода/неподхода --- */
.for-whom-cards {
  display: flex;
  gap: 34px;
  margin: 22px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.big-card {
  padding: 26px 24px 26px 24px;
}
.forwhom-card {
  flex: 1;
  min-width: 260px;
  background: rgba(0,0,0,0.25);
  border: 2.5px solid #c8ff5a;
  border-radius: 17px;
  margin-bottom: 8px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.09);
  transition: box-shadow .22s, transform .22s;
}
.forwhom-card.positive { border: 2.5px solid #38e13c; }
.forwhom-card.negative { border: 2.5px solid #fe6060; }
.forwhom-card h4 {
  color: #fff;
  margin-bottom: 1.2em;
  font-size: 20px;
  text-align: left;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.card-ico {
  font-size: 26px;
  margin-right: 9px;
  vertical-align: middle;
}
.card-ico.red { color: #fe6060; }
.forwhom-card ul {
  margin: 0;
  padding-left: 24px;
}
.forwhom-card ul li {
  color: #fff;
  font-size: 17px;
  margin-bottom: 12px;
  line-height: 1.5;
  padding-left: 0;
}

@media (max-width: 900px) {
  .main-title { font-size: 1.7rem; }
  .accordion-btn { font-size: 18px;}
  .acc-title { font-size: 18px; }
  .accordion-content { font-size: 15px; padding: 13px 0 13px 13px; }
  .mini-prompt { font-size: 15px; padding: 12px 8px 12px 13px;}
  .steps-list li { font-size: 14px; }
}
@media (max-width: 720px) {
  .panel-mr { padding-left: 8px; padding-right: 8px;}
  .for-whom-cards { flex-direction: column; gap: 16px; }
  .forwhom-card { min-width: 0; width: 100%; }
}
.gray-compare {
  color: #a1a1a1;
  font-weight: 500;
  font-size: 13px;
}
</style>
