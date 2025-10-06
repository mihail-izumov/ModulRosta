<script setup>
import { ref } from 'vue'
// Устанавливаем первую вкладку активной по умолчанию
const activeTab = ref('data-collection')
</script>

<template>
  <div class="tabs-mr">
    <button :class="{ active: activeTab === 'data-collection' }" @click="activeTab = 'data-collection'">
      1️⃣ Сбор данных
    </button>
    <button :class="{ active: activeTab === 'semantic-analysis' }" @click="activeTab = 'semantic-analysis'">
      2️⃣ Семантический анализ
    </button>
    <button :class="{ active: activeTab === 'calculation' }" @click="activeTab = 'calculation'">
      3️⃣ Расчет по критериям
    </button>
    <button :class="{ active: activeTab === 'verification' }" @click="activeTab = 'verification'">
      4️⃣ Верификация
    </button>
    <button :class="{ active: activeTab === 'methodology' }" @click="activeTab = 'methodology'">
      📊 Методология
    </button>
  </div>
  
  <div class="panel-mr">
    <!-- Вкладка: Сбор данных -->
    <div v-show="activeTab === 'data-collection'" class="content-mr">
      <h3>Этап 1: Агрегируем сотни источников для полной картины компании</h3>
      
      <div class="experience-grid">
        <div class="experience-card">
          <div class="card-header">
            <h4>Финансовые данные</h4>
            <span class="card-badge">Объективные показатели</span>
          </div>
          <p class="card-description">Анализируем финансовые отчеты, динамику выручки и прибыли, инвестиционные раунды и структуру затрат для понимания экономической модели.</p>
          <div class="card-highlight">
            <strong>Источники:</strong> Отчетность • СПАРК • Инвестиционные раунды
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Коммуникации руководства</h4>
            <span class="card-badge">Видение и стратегия</span>
          </div>
          <p class="card-description">Собираем интервью с руководством, публичные выступления CEO, стратегические заявления и анализируем последовательность видения компании.</p>
          <div class="card-highlight">
            <strong>Формат:</strong> Интервью • Конференции • Медиа • Соцсети CEO
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Обратная связь пользователей</h4>
            <span class="card-badge">Глубинный анализ</span>
          </div>
          <p class="card-description">Изучаем отзывы клиентов и сотрудников на HR-платформах, социальные сети, форумы и рейтинги для выявления реального восприятия бренда.</p>
          <div class="card-highlight">
            <strong>Платформы:</strong> HeadHunter • Хабр • App Store • Отзовик
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Профессиональные сообщества</h4>
            <span class="card-badge">Экспертное мнение</span>
          </div>
          <p class="card-description">Отслеживаем динамику упоминаний в отраслевых сообществах, специализированных медиа и активность на профессиональных платформах.</p>
          <div class="card-highlight">
            <strong>Охват:</strong> Отраслевые медиа • LinkedIn • Telegram • Конференции
          </div>
        </div>
      </div>
    </div>

    <!-- Вкладка: Семантический анализ -->
    <div v-show="activeTab === 'semantic-analysis'" class="content-mr">
      <h3>Этап 2: Система оценивает не только <em>что</em> говорится, но и <em>как</em></h3>
      
      <div class="experience-grid">
        <div class="experience-card">
          <div class="card-header">
            <h4>Эмоциональный фон</h4>
            <span class="card-badge">Тональность</span>
          </div>
          <p class="card-description">Анализируем эмоциональную окраску высказываний команды и клиентов для выявления внутренней атмосферы и восприятия бренда.</p>
          <div class="card-highlight">
            <strong>Индикаторы:</strong> Энтузиазм • Фрустрация • Энергия • Тревоги
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Повторяющиеся метафоры</h4>
            <span class="card-badge">Культурные коды</span>
          </div>
          <p class="card-description">Выявляем ключевые образы и концепции, которые формируют корпоративную культуру и определяют поведенческие паттерны.</p>
          <div class="card-highlight">
            <strong>Примеры:</strong> «революция» vs «эволюция» • «семья» vs «команда»
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Скрытые напряжения</h4>
            <span class="card-badge">Противоречия</span>
          </div>
          <p class="card-description">Обнаруживаем разрывы между публичными заявлениями и реальностью, выявляя точки роста и потенциальные проблемы.</p>
          <div class="card-highlight">
            <strong>Анализ:</strong> Амбиции vs возможности • Традиции vs инновации
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Лингвистические паттерны</h4>
            <span class="card-badge">Язык лидерства</span>
          </div>
          <p class="card-description">Изучаем языковые особенности коммуникации руководства — создатель будущего или менеджер настоящего.</p>
          <div class="card-highlight">
            <strong>Маркеры:</strong> «наследие» vs «отчет» • «мечта» vs «квартал»
          </div>
        </div>
      </div>
    </div>

    <!-- Вкладка: Расчет по критериям -->
    <div v-show="activeTab === 'calculation'" class="content-mr">
      <h3>Этап 3: Каждая группа имеет свой вес в итоговой формуле</h3>
      
      <div class="experience-grid">
        <div class="experience-card">
          <div class="card-header">
            <h4>Напряжение Роста</h4>
            <span class="card-badge">35%</span>
          </div>
          <p class="card-description">Основной драйвер индекса. Здоровое противоречие между амбициозными целями и операционной реальностью — признак потенциала.</p>
          <div class="card-highlight">
            <strong>Индикатор:</strong> Разрыв «Обещание/Реальность» + Конструктивность
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Сила Видения Основателя</h4>
            <span class="card-badge">25%</span>
          </div>
          <p class="card-description">Стратегический фундамент. Лидеры, чья мечта больше их текущего бизнеса, способны на кратные прорывы.</p>
          <div class="card-highlight">
            <strong>Критерий:</strong> Масштаб миссии + Личная связь с идеей
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Квантовый Скачок</h4>
            <span class="card-badge">20%</span>
          </div>
          <p class="card-description">Способность к трансформации. История смелых решений и скорость реакции на кризисы определяют готовность к переменам.</p>
          <div class="card-highlight">
            <strong>Оценка:</strong> Смелые решения + Отсутствие «бронзы»
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Человеческий Фактор</h4>
            <span class="card-badge">20%</span>
          </div>
          <p class="card-description">Культурная основа. Резонанс между ценностями команды и декларациями бренда создает устойчивый рост.</p>
          <div class="card-highlight">
            <strong>Показатель:</strong> Ценностный конфликт + Эмоциональный резонанс
          </div>
        </div>
      </div>
      
      <div class="index-item" style="margin-top: 20px;">
        <strong>Индекс = (НР × 0.35) + (СВ × 0.25) + (КС × 0.20) + (ЧФ × 0.20)</strong><br>
        <span>Высокий результат (75%+) = редкое сочетание сильного видения и накопленного напряжения</span>
      </div>
    </div>

    <!-- Вкладка: Верификация -->
    <div v-show="activeTab === 'verification'" class="content-mr">
      <h3>Этап 4: Финальный вердикт выносят опытные аналитики Модуля Роста®</h3>
      
      <div class="experience-grid">
        <div class="experience-card">
          <div class="card-header">
            <h4>Контекстуальный анализ</h4>
            <span class="card-badge">Экспертиза</span>
          </div>
          <p class="card-description">Аналитики интерпретируют данные в контексте рынка и отрасли, учитывая внешние факторы и ограничения.</p>
          <div class="card-highlight">
            <strong>Проверка:</strong> Адекватность алгоритма • Рыночный контекст
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Потенциал синергии</h4>
            <span class="card-badge">Совместимость</span>
          </div>
          <p class="card-description">Оцениваем, как наша экспертиза может усилить рост компании и готовность к сотрудничеству.</p>
          <div class="card-highlight">
            <strong>Анализ:</strong> Способность к изменениям • Культурная совместимость
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Качественные факторы</h4>
            <span class="card-badge">Целостная картина</span>
          </div>
          <p class="card-description">Учитываем нюансы, которые не улавливает алгоритм — репутацию, команду, стратегические планы.</p>
          <div class="card-highlight">
            <strong>Оценка:</strong> Репутационные риски • Команда • Планы развития
          </div>
        </div>
        
        <div class="experience-card">
          <div class="card-header">
            <h4>Финальное решение</h4>
            <span class="card-badge">Рекомендация</span>
          </div>
          <p class="card-description">Результат — четкая рекомендация к сотрудничеству или конкретные советы по развитию с объяснением причин.</p>
          <div class="card-highlight">
            <strong>Результат:</strong> GO/NO-GO + Roadmap для роста
          </div>
        </div>
      </div>
    </div>

    <!-- Вкладка: Методология -->
    <div v-show="activeTab === 'methodology'" class="content-mr">
      <h3>Методология расчета индекса</h3>
      
      <h4>Принципы работы</h4>
      <ul>
        <li><strong>Data-driven подход:</strong> решения основаны на данных, а не на предположениях</li>
        <li><strong>Мультисурсный анализ:</strong> сотни источников для полноты картины</li>
        <li><strong>Семантическая глубина:</strong> анализ не только фактов, но и смыслов</li>
        <li><strong>Человеческая экспертиза:</strong> финальная проверка опытными аналитиками</li>
      </ul>
      
      <h4>Технологический стек</h4>
      <p>Комбинация передовых технологий и экспертного анализа:</p>
      <ul>
        <li>Автоматизированный сбор данных из открытых источников</li>
        <li>NLP-алгоритмы для семантического анализа</li>
        <li>Машинное обучение для выявления паттернов</li>
        <li>Экспертная верификация результатов</li>
      </ul>
      
      <h4>Уникальность подхода</h4>
      <p class="index-item">
        <strong>Фокус на потенциал, а не на текущие показатели</strong><br>
        <span>Мы ищем компании с максимальным потенциалом роста, а не просто успешные на данный момент.</span>
      </p>
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
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
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
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 3px solid #c8ff5a;
  margin: 12px 0;
}

.content-mr .index-item span {
  color: rgba(255,255,255,0.6);
  font-size: 12px;
}

.content-mr h3 {
  margin: 0 0 16px;
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

/* Стили для карточек */
.experience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 16px;
}

.experience-card {
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.2s ease;
}

.experience-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: #c8ff5a;
  background: rgba(255,255,255,0.05);
}

.card-header {
  margin-bottom: 0.75rem;
}

.card-header h4 {
  margin: 0 0 0.5rem 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.92);
  line-height: 1.3;
}

.card-badge {
  display: inline-block;
  background: #c8ff5a;
  color: #0a0a0a;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
}

.card-description {
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-size: 13px;
}

.card-highlight {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  padding: 0.6rem;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.card-highlight strong {
  color: rgba(255,255,255,0.9);
}

/* Адаптивность */
@media (max-width: 768px) {
  .experience-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  .experience-card {
    padding: 0.8rem;
  }
}
</style>
