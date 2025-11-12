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
      <div class="custom-dark-block tight-block">
        <p>
          <strong>Мы выбрали другой путь</strong>
        </p>
        <p>
          Вместо маркетинговых обещаний мы взяли на себя <strong>конкретное обязательство</strong> — <strong>работать до получения результата</strong>.<br>
          Это означает, что ваши деньги оплачивают <strong>движение вперед</strong>, а не отчеты.
        </p>
      </div>
    </div>
    <!-- Вкладка: Наше обязательство -->
    <div v-show="activeTab === 'commitment'" class="content-mr">
      <h3 class="main-title">Как работает наше обязательство</h3>
      <!-- Аккордеон 1 -->
      <div>
        <button class="accordion-btn" @click="toggleAccordion('commitment1')">
          <span :class="{'arrow-open': openAccordions.commitment1}">▸</span>
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
          <span :class="{'arrow-open': openAccordions.commitment2}">▸</span>
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
          <span :class="{'arrow-open': openAccordions.commitment3}">▸</span>
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
    <!-- Остальные вкладки без изменений -->
    <div v-show="activeTab === 'for-whom'" class="content-mr">
      <h3>Для кого это обязательство</h3>
      <div class="for-whom-cards">
        <div class="forwhom-card positive effect-card">
          <h4>✅ Подходит, если вы:</h4>
          <ul>
            <li>Устали от красивых отчётов без реальных изменений</li>
            <li>Готовы вкладываться в системные улучшения</li>
            <li>Хотите видеть прогресс с первого месяца</li>
            <li>Готовы работать с нашей командой как партнёры</li>
          </ul>
        </div>
        <div class="forwhom-card negative effect-card">
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
.panel-mr {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 8px 16px 15px 16px;
}
.main-title { margin-top: 7px; }
.custom-dark-block.tight-block { padding: 7px 14px 8px 19px; }

.result-block,
.custom-dark-block,
.mini-prompt {
  background-color: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  margin-top: 20px;
}
.mini-prompt p { margin-bottom: 14px; line-height: 1.42; }
.mini-prompt p:last-child { margin-bottom: 0; }
.mini-prompt { padding: 14px 17px 13px 17px; font-size: 14px;}
.result-block-equal p { font-size: 13px;}

.accordion-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 11px 0 11px 0;
  text-align: left;
  color: #c8ff5a;
  font-weight: 700;
  margin-top: 11px;
  margin-bottom: 9px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.accordion-btn .arrow-open {
  display: inline-block;
  transform: rotate(90deg);
  transition: transform 0.18s;
  font-size: 26px;
  margin-right: 12px;
  font-weight: bold;
  color: #c8ff5a;
}
.acc-title {
  font-size: 17px;
  font-weight: 700;
  color: #dafe55;
  margin-left: 1px;
}
.accordion-content {
  background: rgba(255,255,255,0.02);
  border-left: 3px solid #c8ff5a;
  margin-left: 24px;
  margin-bottom: 18px;
  border-radius: 7px;
  padding: 12px 0 12px 17px;
  font-size: 15px;
  line-height: 1.47;
}
.accordion-content li { margin-bottom: 7px; }

.for-whom-cards {
  display: flex;
  gap: 28px;
  margin: 16px 0 0 0;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.effect-card {
  padding: 20px 18px 18px 26px;
}
.forwhom-card {
  flex: 1;
  min-width: 260px;
  background: rgba(0,0,0,0.25);
  border: 2px solid #c8ff5a;
  border-radius: 14px;
  margin-bottom: 10px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.09);
  transition: box-shadow .22s, transform .22s;
}
.forwhom-card.positive { border: 2.2px solid #55e74d; }
.forwhom-card.negative { border: 2.2px solid #f05555; }
.forwhom-card h4 {
  color: #fff;
  margin-bottom: 18px;
  font-size: 15px;
  text-align: left;
  font-weight: 700;
}
.forwhom-card ul {
  margin: 0;
  padding-left: 20px;
}
.forwhom-card ul li {
  color: #fff;
  font-size: 13px;
  margin-bottom: 7px;
  line-height: 1.46;
  padding-left: 0;
}

/* --- Остальные стили – без изменений --- */
.content-mr { color: rgba(255,255,255,0.92); font-size: 13px; line-height: 1.46;}
.content-mr strong { font-weight: 600; color: #fff;}
.content-mr h3 { margin: 0 0 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.01em; color: rgba(255,255,255,0.9);}
.content-mr h4 { margin: 0 0 6px; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 600;}
.custom-dark-block { margin-bottom: 0; margin-top: 18px;}
.result-block { padding: 12px 14px;}
.gray-compare { color: #a1a1a1; font-weight: 500; font-size: 13px;}
.tabs-mr { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px;}
.tabs-mr button { appearance: none; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.92); padding: 8px 14px; border-radius: 10px; font-weight: 600; font-size: 13px; line-height: 1; cursor: pointer; transition: all .2s ease;}
.tabs-mr button:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18);}
.tabs-mr button.active { color: #0a0a0a; background: #c8ff5a; border-color: #c8ff5a; box-shadow: 0 0 0 2px rgba(200,255,90,0.25) inset;}
@media (max-width: 720px) {
  .for-whom-cards { flex-direction: column; gap: 13px;}
  .forwhom-card { min-width: 0; width: 100%; }
  .effect-card { padding-left: 12px; }
}
</style>
