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
      <h3>Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
      <p>
        Рынок бизнес-аналитики наводнен <strong>пустыми обещаниями</strong>: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:
      </p>
      <ul>
        <li><strong>Проценты легко манипулировать</strong> — 30% от чего и за какой период?</li>
        <li><strong>Возврат денег</strong> означает, что аналитик <strong>не несет ответственности</strong> за внедрение</li>
        <li><strong>Красивые цифры</strong> отвлекают от главного — <strong>реальных изменений</strong> в бизнесе</li>
      </ul>
      <div class="custom-dark-block compact">
        <p>
          <strong>Мы выбрали другой путь</strong><br>
          Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство — работать до получения результата</strong>.<br>
          Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.
        </p>
      </div>
    </div>

    <!-- Вкладка: Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3>Как работает наше обязательство</h3>
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span class="chevron-green" :class="{ 'open': openAccordions.commitment1 }">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#dafe55" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5.7 8.8 5.3 5.4 5.3-5.4"/></svg>
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
          <span class="chevron-green" :class="{ 'open': openAccordions.commitment2 }">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#dafe55" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5.7 8.8 5.3 5.4 5.3-5.4"/></svg>
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
          <span class="chevron-green" :class="{ 'open': openAccordions.commitment3 }">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#dafe55" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5.7 8.8 5.3 5.4 5.3-5.4"/></svg>
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
      <div class="mini-prompt spaced">
        <p><strong>Что происходит, если мы не выполняем обязательство</strong></p>
        <p>
          Если по истечении 30 дней <strong>хотя бы один</strong> из трёх пунктов не выполнен <strong>по нашей вине</strong>, мы продолжаем работать до его выполнения <strong>без дополнительной оплаты</strong>.
        </p>
        <p>
          <strong>Ключевое условие:</strong> "по нашей вине" означает, что мы не переносим ответственность на клиента за <strong>наши</strong> методологические ошибки или <strong>нашу</strong> неспособность найти решения.
        </p>
      </div>
    </div>

    <!-- Вкладка: Для кого это обязательство -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3>Для кого это обязательство</h3>
      <div class="for-whom-cards for-whom-sphere">
        <div class="forwhom-card positive sphere">
          <h4>✅ Подходит, если вы:</h4>
          <ul>
            <li>Устали от красивых отчётов без реальных изменений</li>
            <li>Готовы вкладываться в системные улучшения</li>
            <li>Хотите видеть прогресс с первого месяца</li>
            <li>Готовы работать с нашей командой как партнёры</li>
          </ul>
        </div>
        <div class="forwhom-card negative sphere">
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
    <!-- Остальные вкладки без изменений -->
  </div>
</template>

<style scoped>
/* PANEL и TAB */
.panel-mr {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 8px 16px 15px 16px; /* Уменьшен отступ сверху до заголовка */
}
.content-mr {
  color: rgba(255,255,255,0.92);
  font-size: 13px;
  line-height: 1.46;
}

/* ----- АККОРДЕОН ----- */
.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 18px 0 8px 0; /* сверху больше, снизу меньше */
  text-align: left;
  color: #c8ff5a;
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  transition: background .2s;
  margin-left: -4px;
}
.accordion-btn .chevron-green {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 26px;
  margin-right: 2px;
  transition: transform 0.18s;
}
.chevron-green.open svg {
  transform: rotate(180deg);
  transition: transform 0.22s;
}
.acc-title {
  font-size: 20px;
  font-weight: 700;
  color: #dafe55;
  margin-left: 7px;
  line-height: 1.2;
}
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 3px solid #dafe55;
  margin-bottom: 18px;
  margin-left: 34px;
  border-radius: 7px;
  padding: 14px 0 12px 20px;
  text-align: left;
}
.accordion-content ul, .accordion-content li {
  padding-left: 0;
  margin-left: 0;
}

/* --- Карточки Для Кого --- */
.for-whom-cards {
  display: flex;
  gap: 24px;
  margin: 36px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.for-whom-sphere {
  margin-top: 34px;
}
.forwhom-card {
  flex: 1;
  min-width: 260px;
  background: rgba(0,0,0,0.25);
  border: 1.8px solid #c8ff5a;
  border-radius: 16px;
  padding: 27px 17px 23px 22px;
  margin-bottom: 12px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.09);
  transition: box-shadow .22s, transform .22s;
}
.forwhom-card.positive {
  border: 2px solid #3aff2a;
}
.forwhom-card.negative {
  border: 2px solid #ff5555;
}
.forwhom-card.sphere {
  margin-top: 0;
}
.forwhom-card h4 {
  color: #fff;
  margin-bottom: 1em;
  font-size: 17px;
  text-align: left;
  font-weight: 700;
}
.forwhom-card ul {
  margin: 0;
  padding-left: 15px;
}
.forwhom-card ul li {
  color: #fff;
  font-size: 15px;
  margin-bottom: 9px;
  line-height: 1.5;
  padding-left: 0;
}

/* Рамка плашки - уменьшены паддинги в compact */
.custom-dark-block {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 18px 18px;
  border-radius: 8px;
  margin-top: 20px;
  line-height: 1.46;
}
.custom-dark-block.compact {
  padding-top: 9px;
  padding-bottom: 9px;
}

/* Мини-подсказка — межстрочные отступы между параграфами */
.mini-prompt {
  margin-top: 24px;
  font-size: 15px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 18px 21px;
  line-height: 1.46;
}
.mini-prompt.spaced p {
  margin-bottom: 15px;
}
.mini-prompt.spaced p:last-child {
  margin-bottom: 0;
}

/* Итоговый блок */
.result-block, .result-block-equal {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 16px 18px;
  border-radius: 8px;
  margin-top: 20px;
  line-height: 1.46;
}
.result-block-equal p {
  font-size: 15px;
  margin-bottom: 12px;
  line-height: 1.46;
}

.steps-list {
  margin-bottom: 18px;
  line-height: 1.46;
  padding-left: 26px;
}
.steps-list li {
  margin-bottom: 9px;
  font-size: 18px;
}

@media (max-width: 720px) {
  .for-whom-cards {
    flex-direction: column;
    gap: 13px;
  }
  .forwhom-card {
    min-width: 0;
    width: 100%;
    margin-top: 0!important;
  }
}

/* --- Остальные таблицы, тексты, серый текст и прочее без изменений --- */
.gray-compare { color: #a1a1a1; font-weight: 500; font-size: 13px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 16px;}
th, td { padding: 7px 10px; border-bottom: 1px solid rgba(255,255,255,0.11); font-size: 13px;}
th { background: rgba(255,255,255,0.05); color: #c8ff5a; font-weight: 600; text-align: left;}
tr:last-child td { border-bottom: none;}
</style>
