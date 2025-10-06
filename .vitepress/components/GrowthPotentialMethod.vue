<script setup>
import { ref } from 'vue'
// Устанавливаем первую вкладку активной по умолчанию
const activeTab = ref('vision')
</script>

<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'vision' }" @click="activeTab = 'vision'">
      Сила Видения (25%)
    </button>
    <button :class="{ active: activeTab === 'growth-tension' }" @click="activeTab = 'growth-tension'">
      Напряжение Роста (35%)
    </button>
    <button :class="{ active: activeTab === 'quantum-leap' }" @click="activeTab = 'quantum-leap'">
      Квантовый Скачок (20%)
    </button>
    <button :class="{ active: activeTab === 'human-factor' }" @click="activeTab = 'human-factor'">
      Человеческий Фактор (20%)
    </button>
    <button :class="{ active: activeTab === 'methodology' }" @click="activeTab = 'methodology'">
      Методология
    </button>
  </div>
  
  <div class="panel-mr">
    <!-- Вкладка: Сила Видения Основателя -->
    <div v-show="activeTab === 'vision'" class="content-mr">
      <h3>Сила Видения Основателя</h3>
      <p><em>Мы ищем лидеров, чья мечта больше их текущего бизнеса.</em></p>
      
      <h4>1.1. Масштаб Миссии</h4>
      <p>Выходит ли заявленная миссия за рамки рынка и продукта, затрагивая ценности, образ жизни, будущее?</p>
      
      <h4>1.2. Последовательность Видения</h4>
      <p>Насколько часто и непротиворечиво основатель транслирует одну и ту же большую идею в разных интервью и выступлениях за последние 5 лет?</p>
      
      <h4>1.3. Энергия Коммуникации</h4>
      <p>Анализ языка основателя — он говорит из позиции создателя будущего или менеджера настоящего?</p>
      <ul>
        <li><strong>Создатель будущего:</strong> «наследие», «трансформация», «мечта»</li>
        <li><strong>Менеджер настоящего:</strong> «оптимизация», «квартал», «отчет»</li>
      </ul>
      
      <h4>1.4. Личная Связь с Идеей</h4>
      <p>Прослеживается ли в истории основателя личная, почти мифологическая связь с делом его жизни?</p>
    </div>

    <!-- Вкладка: Напряжение Роста -->
    <div v-show="activeTab === 'growth-tension'" class="content-mr">
      <h3>Напряжение Роста</h3>
      <p><em>Наш Радар реагирует на здоровое противоречие между амбициозными целями и операционной реальностью.</em></p>
      
      <h4>2.1. Амплитуда Разрыва «Обещание/Реальность»</h4>
      <p>Насколько велико расхождение между яркими обещаниями на сайте/в рекламе и системными жалобами в отзывах.</p>
      <p class="index-item">
        <strong>Пример:</strong><br>
        <span>«инновационный продукт» vs «постоянные баги»</span>
      </p>
      
      <h4>2.2. Конструктивность Негатива</h4>
      <p>Жалобы клиентов и сотрудников касаются «болезней роста», а не фундаментальных пороков самой идеи или продукта.</p>
      <ul>
        <li>Логистика и доставка</li>
        <li>Качество сервиса</li>
        <li>Внутренние процессы</li>
      </ul>
      
      <h4>2.3. Осознанность Проблем</h4>
      <p>Проскальзывают ли в интервью CEO намеки на понимание существующих проблем, что говорит об адекватности, а не «слепоте».</p>
      <ul>
        <li>«мы работаем над...»</li>
        <li>«это сложный вызов...»</li>
      </ul>
      
      <h4>2.4. Феномен «Любви Вопреки»</h4>
      <p>Существует ли ядро лояльных клиентов, которые хвалят продукт/идею, но при этом ругают сервис/доставку.</p>
    </div>

    <!-- Вкладка: Готовность к Квантовому Скачку -->
    <div v-show="activeTab === 'quantum-leap'" class="content-mr">
      <h3>Готовность к Квантовому Скачку</h3>
      <p><em>Мы инвестируем свою экспертизу только в те компании, которые готовы к быстрым и фундаментальным изменениям.</em></p>
      
      <h4>3.1. История Смелых Решений</h4>
      <p>Были ли в прошлом компании резкие смены курса, рискованные запуски, пусть даже неудачные, указывающие на отсутствие страха перед переменами.</p>
      
      <h4>3.2. Скорость Реакции на Кризис</h4>
      <p>Как быстро и решительно компания действовала в ответ на публичные кризисы или скандалы.</p>
      
      <h4>3.3. Отсутствие «Бронзы»</h4>
      <p>В коммуникациях преобладает язык поиска, эксперимента, движения, а не язык «лидера рынка», «стабильности» и «достижений».</p>
      <ul>
        <li><strong>Язык движения:</strong> поиск, эксперимент, развитие</li>
        <li><strong>Язык статуса:</strong> лидер рынка, стабильность, достижения</li>
      </ul>
    </div>

    <!-- Вкладка: Человеческий Фактор -->
    <div v-show="activeTab === 'human-factor'" class="content-mr">
      <h3>Человеческий Фактор</h3>
      <p><em>Мы анализируем резонанс между ценностями команды и декларациями бренда.</em></p>
      
      <h4>4.1. Ценностный Конфликт в Команде</h4>
      <p>Отзывы сотрудников показывают, что они верят в продукт и идею, но демотивированы внутренними процессами или менеджментом.</p>
      <p class="index-item">
        <strong>Типичный отзыв:</strong><br>
        <span>«отличный продукт, но ужасная организация»</span>
      </p>
      
      <h4>4.2. Эмоциональный Резонанс с Брендом</h4>
      <p>Вызывает ли бренд сильные эмоции (любовь или ненависть), а не равнодушие.</p>
      
      <h4>4.3. Харизма «Второго эшелона»</h4>
      <p>Есть ли в публичном поле, кроме CEO, другие яркие сотрудники, которые являются носителями культуры.</p>
    </div>

    <!-- Вкладка: Методология -->
    <div v-show="activeTab === 'methodology'" class="content-mr">
      <h3>Методология Расчета</h3>
      
      <h4>Веса критериев</h4>
      <ul>
        <li><strong>Напряжение Роста:</strong> 35% — ключевой индикатор</li>
        <li><strong>Сила Видения Основателя:</strong> 25% — стратегическая основа</li>
        <li><strong>Готовность к Квантовому Скачку:</strong> 20% — способность к изменениям</li>
        <li><strong>Человеческий Фактор:</strong> 20% — внутренняя культура</li>
      </ul>
      
      <h4>Принципы оценки</h4>
      <p>Мы ищем компании с <strong>здоровым противоречием</strong> между амбициями и текущей реальностью. Это признак роста, а не проблема.</p>
      
      <p>Идеальный кандидат — компания с большой мечтой, осознающая свои текущие ограничения и готовая к кардинальным изменениям.</p>
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

.content-mr p:not(:last-child) {
  margin-bottom: 12px;
}

.content-mr p {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,0.88);
  line-height: 1.46;
}

.content-mr em {
  color: rgba(255,255,255,0.7);
  font-style: italic;
}

.content-mr .index-item {
  line-height: 1.5;
  background: rgba(255,255,255,0.03);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #c8ff5a;
}

.content-mr .index-item span {
  color: rgba(255,255,255,0.6);
}

.content-mr h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255,255,255,0.9);
}

.content-mr h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #c8ff5a;
  letter-spacing: 0.01em;
}

.content-mr h4:first-of-type {
  margin-top: 12px;
}

.content-mr strong {
  font-weight: 600;
  color: #fff;
}

.content-mr ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}

.content-mr ul:not(:last-child) {
  margin-bottom: 15px;
}

.content-mr li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
}

.content-mr li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: rgba(255,255,255,0.5);
}
</style>
