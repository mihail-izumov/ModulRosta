<script setup>
import { ref } from 'vue'
// Устанавливаем первую вкладку активной по умолчанию
const activeTab = ref('step-1')
</script>
<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'step-1' }" @click="activeTab = 'step-1'">
      ШАГ 1
    </button>
    <button :class="{ active: activeTab === 'step-2' }" @click="activeTab = 'step-2'">
      ШАГ 2
    </button>
    <button :class="{ active: activeTab === 'step-3' }" @click="activeTab = 'step-3'">
      ШАГ 3
    </button>
    <button :class="{ active: activeTab === 'step-4' }" @click="activeTab = 'step-4'">
      ШАГ 4
    </button>
    <button :class="{ active: activeTab === 'guarantee' }" @click="activeTab = 'guarantee'">
      Гарантия точности
    </button>
    <button :class="{ active: activeTab === 'result' }" @click="activeTab = 'result'">
      Результат
    </button>
  </div>
  <div class="panel-mr">
    <!-- Вкладка: ШАГ 1 -->
    <div v-show="activeTab === 'step-1'" class="content-mr">
      <h3>Находим ваших настоящих конкурентов</h3>
      <p class="intro-p">
        Забудьте о том, кого вы считаете конкурентами. Анализируем тысячи отзывов, чтобы выяснить, с кем <strong>реально сравнивают вас клиенты</strong> в момент выбора. Часто оказывается, что ваш главный конкурент — не тот, о ком вы думали, а компания в другом городе или даже с другой бизнес-моделью.
      </p>
      <div class="result-block">
        <p><strong><span class="result-highlight">Результат</span>:</strong> Вы получаете список из 9 конкурентов, разделенных на три группы — лидеры, средний уровень и аутсайдеры. Это ваше реальное конкурентное поле.</p>
      </div>
    </div>
    <!-- Вкладка: ШАГ 2 -->
    <div v-show="activeTab === 'step-2'" class="content-mr">
      <h3>Изучаем «голос клиента»</h3>
      <p class="intro-p">
        Собираем и изучаем все отзывы о вас и конкурентах с Яндекс/2ГИС и других публичных источников. Затем отсеиваем «мусор» — заказные отзывы, дубликаты, бессодержательные комментарии. Остается только чистая правда.
      </p>
      <div class="result-block">
        <p><strong><span class="result-highlight">Результат</span>:</strong> База из сотен реальных, проверенных отзывов, которые показывают истинное мнение клиентов.</p>
      </div>
    </div>
    <!-- Вкладка: ШАГ 3 -->
    <div v-show="activeTab === 'step-3'" class="content-mr">
      <h3>Выделяем 10 критериев, по которым вас выбирают</h3>
      <p class="intro-p">
        Не используем шаблонные критерии типа «цена/качество». Анализируем, о чем <strong>конкретно говорят ваши клиенты</strong>, и выделяем именно те 10 факторов, которые влияют на их решение прийти к вам или к конкуренту. Формулируются они словами самих клиентов: не «атмосфера», а «можно спокойно посидеть с ноутбуком, никто не торопит».
      </p>
      <div class="result-block">
        <p><strong><span class="result-highlight">Результат</span>:</strong> 10 точных критериев с примерами того, что именно имеют в виду клиенты.</p>
      </div>
    </div>
    <!-- Вкладка: ШАГ 4 -->
    <div v-show="activeTab === 'step-4'" class="content-mr">
      <h3>Ставим честные оценки</h3>
      <p class="intro-p">
        На основе анализа публичной информации выставляем каждому конкуренту (включая вашу компанию) оценки от 1 до 10 по каждому из 10 критериев. Без приукрашивания, без политкорректности — только факты из обратной связи клиентов.
      </p>
      <div class="result-block">
        <p><strong><span class="result-highlight">Результат</span>:</strong> Отчет, где видно, где вы лидируете, где отстаете, и что нужно исправить в первую очередь.</p>
      </div>
    </div>
    <!-- Вкладка: Гарантия точности -->
    <div v-show="activeTab === 'guarantee'" class="content-mr">
      <h3>Проверка достоверности</h3>
      <div class="cards-grid">
        <div class="guarantee-card">
          <div class="card-icon">✓</div>
          <h4>Только реальные отзывы</h4>
          <p>Используем умный анализ с системой защиты от накруток</p>
        </div>
        
        <div class="guarantee-card">
          <div class="card-icon">📊</div>
          <h4>Прозрачность методики</h4>
          <p>Каждая оценка подкреплена прямыми цитатами из отзывов</p>
        </div>
        
        <div class="guarantee-card">
          <div class="card-icon">⏱</div>
          <h4>Актуальные данные</h4>
          <p>Анализируем только свежие отзывы, чтобы показать текущую ситуацию</p>
        </div>
        
        <div class="guarantee-card">
          <div class="card-icon">⚖️</div>
          <h4>Объективность</h4>
          <p>Система анализирует факты, а не мнения</p>
        </div>
      </div>
    </div>
    <!-- Вкладка: Результат -->
    <div v-show="activeTab === 'result'" class="content-mr">
      <h3>Что получаете</h3>
      <div class="cards-grid">
        <div class="result-card">
          <div class="card-icon">🎯</div>
          <h4>Реальную карту конкурентов</h4>
          <p>9 конкурентов в трёх сегментах и понимание, с кем вас сравнивают клиенты при выборе</p>
        </div>
        
        <div class="result-card">
          <div class="card-icon">💬</div>
          <h4>«Голос клиента» без шумов</h4>
          <p>Очищенную базу отзывов, пригодную для регламентов и обучения команды</p>
        </div>
        
        <div class="result-card">
          <div class="card-icon">📝</div>
          <h4>10 клиентских критериев</h4>
          <p>С примерами формулировок и привязкой к операционным действиям</p>
        </div>
        
        <div class="result-card">
          <div class="card-icon">📈</div>
          <h4>Честные оценки 1–10</h4>
          <p>По каждому критерию, приоритеты улучшений и понятная точка роста</p>
        </div>
        
        <div class="result-card">
          <div class="card-icon">📊</div>
          <h4>Ретроспектива</h4>
          <p>Сводный отчет с динамикой изменений</p>
        </div>
        
        <div class="result-card">
          <div class="card-icon">💡</div>
          <h4>Инсайты</h4>
          <p>Профессиональные рекомендации по росту от аналитиков Модуля Роста®</p>
        </div>
      </div>
      
      <div class="result-block">
        <p><strong>Хотите увидеть свой бизнес глазами клиентов?</strong></p>
        <a href="https://cffx.ru/invest/sim.html" target="_blank" class="calc-button">Тест-драйв</a>
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
.content-mr p {
  margin: 0;
  font-size: 13px;
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
.result-block {
  background-color: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 14px;
  border-radius: 8px;
  margin-top: 20px;
}
.result-block p {
  margin: 0 0 12px 0;
  font-size: 16px;
  line-height: 1.5;
}
.result-highlight {
  color: #c8ff5a;
}
.calc-button {
  display: inline-block;
  background: #c8ff5a;
  color: #0a0a0a;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  margin-top: 0;
  transition: all .2s ease;
}
.calc-button:hover {
  background: #b8ef4a;
  transform: translateY(-1px);
}
/* Стили для карточек */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.guarantee-card, .result-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 14px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.guarantee-card::before, .result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #c8ff5a, #a8df3a);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.guarantee-card:hover::before, .result-card:hover::before {
  transform: scaleX(1);
}
.guarantee-card:hover, .result-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.card-icon {
  font-size: 20px;
  margin-bottom: 8px;
  opacity: 0.8;
}
.guarantee-card h4, .result-card h4 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.guarantee-card p, .result-card p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .guarantee-card, .result-card {
    padding: 12px;
  }
}
</style>
