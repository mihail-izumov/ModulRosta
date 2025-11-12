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
      <h3 style="margin-top:8px;">Почему мы не обещаем X2 рост и не возвращаем деньги</h3>
      <p>
        Рынок бизнес-аналитики наводнен <strong>пустыми обещаниями</strong>: "+30% прибыли", "ROI 300%", "гарантия возврата денег". Эти формулировки ничего не гарантируют, потому что:
      </p>
      <ul>
        <li><strong>Проценты легко манипулировать</strong> — 30% от чего и за какой период?</li>
        <li><strong>Возврат денег</strong> означает, что аналитик <strong>не несет ответственности</strong> за внедрение</li>
        <li><strong>Красивые цифры</strong> отвлекают от главного — <strong>реальных изменений</strong> в бизнесе</li>
      </ul>
      <div class="custom-dark-block compact-block">
        <p>
          <strong>Мы выбрали другой путь</strong><br>
          Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство</strong> — <strong>работать до получения результата</strong>.<br>
          Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.
        </p>
      </div>
    </div>
    <!-- Вкладка: Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3 style="margin-top:8px;">Как работает наше обязательство</h3>
      <!-- Аккордеон 1 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span :class="{'arrow-open': openAccordions.commitment1}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                 style="vertical-align:middle;">
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
      <!-- Аккордеон 2 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment2')">
          <span :class="{'arrow-open': openAccordions.commitment2}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                 style="vertical-align:middle;">
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
      <!-- Аккордеон 3 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment3')">
          <span :class="{'arrow-open': openAccordions.commitment3}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                 style="vertical-align:middle;">
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
    <!-- ...В остальные вкладки стили не вмешивался... -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3 style="margin-top:8px;">Для кого это обязательство</h3>
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
    <!-- ... остальное без изменений ... -->
  </div>
</template>

<style scoped>
.panel-mr {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 8px 18px 16px 18px;
}
.content-mr {
  color: rgba(255,255,255,0.92);
  font-size: 13px;
  line-height: 1.46;
}

.custom-dark-block.compact-block {
  padding: 8px 10px;
  margin-top: 12px;
}
.custom-dark-block p { margin-bottom: 9px; }

.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 9px 0 9px 0;
  text-align: left;
  color: #c8ff5a;
  font-weight: 700;
  margin-top: 14px;
  margin-bottom: 10px;
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.accordion-btn .arrow-open {
  display: flex;
  align-items: center;
  margin-right: 7px;
  transition: transform 0.18s;
}
.arrow-open svg {
  transform: rotate(90deg);
  transition: transform 0.18s;
}
.accordion-btn .arrow-open:not(.active) svg {
  transform: rotate(0deg);
}
.acc-title {
  font-size: 17px;
  font-weight: 700;
  color: #dafe55;
  margin-left: 1px;
}
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 2.5px solid #c8ff5a;
  margin-left: 20px;
  margin-bottom: 18px;
  border-radius: 7px;
  padding: 8px 0 8px 18px;
}

.mini-prompt {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-top: 16px;
  padding: 13px 15px 13px 15px;
  font-size: 15px;
  line-height: 1.44;
}
.mini-prompt p { margin-bottom: 13px; }
.mini-prompt p:last-child { margin-bottom: 0; }

.for-whom-cards {
  display: flex;
  gap: 24px;
  margin: 13px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.forwhom-card {
  flex: 1;
  min-width: 260px;
  background: rgba(0,0,0,0.25);
  border: 1.8px solid #c8ff5a;
  border-radius: 13px;
  padding: 18px 13px 17px 13px;
  margin-bottom: 10px;
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
  font-size: 15px;
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
  .panel-mr { padding-left: 7px; padding-right: 7px;}
  .for-whom-cards { flex-direction: column; gap: 11px; }
  .forwhom-card { min-width: 0; width: 100%; }
}

.gray-compare {
  color: #a1a1a1;
  font-weight: 500;
  font-size: 13px;
}
</style>
