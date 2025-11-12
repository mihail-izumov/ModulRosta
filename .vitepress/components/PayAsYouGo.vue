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
      <div class="custom-dark-block alt-padding">
        <p><strong>Мы выбрали другой путь</strong></p>
        <p>Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство — работать до получения результата.</strong>
        <br>Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.</p>
      </div>
    </div>

    <!-- Вкладка: Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3 class="main-title">Как работает наше обязательство</h3>
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span :class="['accordion-icon', {open: openAccordions.commitment1}]">▸</span>
          <span class="accordion-head">Карту системных узких мест</span>
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
          <span :class="['accordion-icon', {open: openAccordions.commitment2}]">▸</span>
          <span class="accordion-head">Три готовых к внедрению решения</span>
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
          <span :class="['accordion-icon', {open: openAccordions.commitment3}]">▸</span>
          <span class="accordion-head">Запущенные пилотные проекты</span>
        </button>
        <ul v-show="openAccordions.commitment3" class="accordion-content">
          <li>Работающие процессы по каждому из решений</li>
          <li>Первые измеримые результаты пилотов</li>
          <li>Обратная связь от команды по каждому нововведению</li>
          <li>План масштабирования успешных пилотов</li>
        </ul>
      </div>
      <div class="mini-prompt mini-dist">
        <p><strong>Что происходит, если мы не выполняем обязательство</strong></p>
        <p>Если по истечении 30 дней <strong>хотя бы один</strong> из трёх пунктов не выполнен <strong>по нашей вине</strong>, мы продолжаем работать до его выполнения <strong>без дополнительной оплаты</strong>.</p>
        <p><strong>Ключевое условие:</strong> "по нашей вине" означает, что мы не переносим ответственность на клиента за <strong>наши</strong> методологические ошибки или <strong>нашу</strong> неспособность найти решения.</p>
      </div>
    </div>

    <!-- Вкладка: Как это работает -->
    <!-- ... без изменений ... -->

    <!-- Вкладка: Для кого это -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3 class="main-title">Для кого это обязательство</h3>
      <div class="for-whom-cards">
        <div class="forwhom-card positive better-border">
          <div class="card-label-icon">✅</div>
          <div class="card-label"><strong>Подходит, если вы:</strong></div>
          <ul>
            <li>Устали от красивых отчётов без реальных изменений</li>
            <li>Готовы вкладываться в системные улучшения</li>
            <li>Хотите видеть прогресс с первого месяца</li>
            <li>Готовы работать с нашей командой как партнёры</li>
          </ul>
        </div>
        <div class="forwhom-card negative better-border">
          <div class="card-label-icon neg">❌</div>
          <div class="card-label"><strong>Не подходит, если вы:</strong></div>
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
/* 1. Меньше отступ сверху для главных заголовков */
.main-title {
  margin-top: 12px !important;
  margin-bottom: 20px !important;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: 0.01em;
}

/* 2. Блок "Мы выбрали другой путь" — половинные паддинги */
.custom-dark-block.alt-padding {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

/* 3. Вкладка "Как работает..." — классические аккордеоны как в референсе */
.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 14px 0 14px 0;
  text-align: left;
  color: #c8ff5a;
  margin: 0 0 8px 0;
  cursor: pointer;
  transition: background .2s;
  display: flex;
  align-items: center;
}
.accordion-icon {
  display: flex;
  align-items: center;
  font-size: 30px;
  margin-right: 14px;
  font-weight: 700;
  color: #c8ff5a;
  transition: transform 0.22s;
}
.accordion-icon.open {
  transform: rotate(90deg);
}
.accordion-head {
  font-size: 22px;
  color: #dafe55;
  font-weight: 800;
  line-height: 1.12;
}
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 3px solid #c8ff5a;
  margin-left: 44px;
  margin-bottom: 24px;
  border-radius: 9px;
  padding: 17px 0 17px 26px;
  font-size: 18px;
  color: #fff;
}

/* 4. Межстрочные расстояния в "Что происходит, если мы не выполняем обязательство" */
.mini-prompt.mini-dist p {
  margin-bottom: 17px;
  line-height: 1.46;
}
.mini-prompt.mini-dist p:last-child { margin-bottom: 0; }

/* 5. Карточки "Для кого это обязательство" — увеличенный паддинг, заметная рамка и разные иконки */
.for-whom-cards {
  display: flex;
  gap: 40px;
  margin: 28px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.forwhom-card.better-border {
  background: rgba(0,0,0,0.21);
  border: 3px solid;
  border-radius: 22px;
  padding: 36px 30px 28px 38px;
  margin-bottom: 16px;
  box-shadow: 0 6px 36px rgba(0,0,0,0.07);
}
.forwhom-card.positive.better-border {
  border-color: #35e935;
}
.forwhom-card.negative.better-border {
  border-color: #fb5353;
}
.card-label {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 17px;
  line-height: 1.2;
}
.card-label-icon {
  font-size: 29px;
  margin-bottom: 3px;
  line-height: 1;
  color: #39fa63;
  font-weight: 800;
}
.card-label-icon.neg { color: #fb5353; }
.forwhom-card ul { margin: 0; padding-left: 19px; }
.forwhom-card ul li {
  color: #fff;
  font-size: 18px;
  margin-bottom: 11px;
  line-height: 1.46;
  font-weight: 400;
}

/* --- Базовые стили, корректируемые при необходимости --- */
.tabs-mr, .panel-mr, .content-mr, table, th, td, .custom-dark-block, .mini-prompt, .result-block {
  /* ... оставить ваши стили ... */
}
/* Главный фон и прочие элементы не трогаем */

.steps-list {
  margin-bottom: 18px;
  line-height: 1.46;
  padding-left: 22px;
}
.steps-list li { margin-bottom: 6px; }

.result-block,
.mini-prompt {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 16px 18px;
  border-radius: 8px;
  margin-top: 20px;
  line-height: 1.46;
}
.result-block p, .mini-prompt p {
  margin-bottom: 12px;
  line-height: 1.46;
}
.result-block-equal p { font-size: 13px; }
/* Остальной базовый стиль, как был */
</style>
