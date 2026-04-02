<script setup>
import { ref } from 'vue'

const openAccordions = ref(new Set())
const toggle = (key) => {
  const s = new Set(openAccordions.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openAccordions.value = s
}
const isOpen = (key) => openAccordions.value.has(key)
</script>

<template>
  <div class="modal-vidim">
    <h1 class="md-h1 md-h1-blue">ВИДИМ</h1>

    <!-- Checkpoints — aviation / Bell & Ross style -->
    <div class="md-checkpoints">
      <div class="md-checkpoint">
        <span class="md-checkpoint-marker"><span class="md-checkpoint-dot"></span></span>
        <span class="md-checkpoint-text">Архитектуру бизнеса в цифре — до того, как её описал клиент.</span>
      </div>
      <div class="md-checkpoint">
        <span class="md-checkpoint-marker"><span class="md-checkpoint-dot"></span></span>
        <span class="md-checkpoint-text">Куда идут рынки — и как оказаться там первым.</span>
      </div>
      <div class="md-checkpoint">
        <span class="md-checkpoint-marker"><span class="md-checkpoint-dot"></span></span>
        <span class="md-checkpoint-text">Какой модуль запустить первым, чтобы эффект был взрывным.</span>
      </div>
    </div>

    <p class="md-tagline">Видим то, что не видят другие.</p>

    <div class="md-divider"></div>

    <h2 class="md-h2 md-h2-blue">2 этапа</h2>

    <!-- Этап 1 -->
    <h3 class="md-h3">1 — Ранскейл-сессия · <span class="md-color-blue">90</span> минут</h3>
    <h4 class="md-h4">Не аудит. Не диагностика. Не анкета на 50 вопросов.</h4>
    <p class="md-text">Не обязательство. Не контракт на полгода. Один разговор, после которого вы видите свой бизнес иначе.</p>
    <p class="md-text">Это разговор о будущем вашего рынка с командой, которая видит на 2 года вперёд. 45 запусков — от ресторанов до международных саммитов — дают способность видеть паттерны, которые изнутри бизнеса не видны.</p>

    <!-- Аккордион: Что происходит -->
    <div class="md-accordion" :class="{ open: isOpen('1') }">
      <button class="md-accordion-header" @click="toggle('1')">
        <span class="md-accordion-icon">{{ isOpen('1') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Что происходит</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('1') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Мы смотрим на бизнес и видим:</p>
          <p class="md-text-inner md-dash">Какой цифровой модуль нужен первым</p>
          <p class="md-text-inner md-dash">Что даст максимальный эффект при минимальных ресурсах</p>
          <p class="md-text-inner md-dash">Какие модули понадобятся дальше и как они соединяются</p>
          <p class="md-text-inner md-dash">Где узкое горлышко, которое тормозит рост прямо сейчас</p>
        </div>
      </div>
    </div>

    <p class="md-text">Вам не нужно знать, что именно строить. Владелец бизнеса приходит с направлением: «хочу расти», «хочу как у лидеров», «хочу без штата». Этого достаточно. Мы видим за вас — и сразу запускаем.</p>

    <div class="md-divider"></div>

    <!-- Этап 2 -->
    <h3 class="md-h3">2 — RAG Аналитика</h3>
    <p class="md-text">Фирменные методологии и технологии бизнес-аналитики Модуля Роста®. Внутри: Чекап + анализ рынка Радаром.</p>

    <div class="md-divider-thin"></div>

    <!-- Чекап -->
    <h4 class="md-h4-section">Чекап</h4>
    <p class="md-result"><span class="md-result-label">Результат:</span> карта модулей бизнеса в цифре. Порядок запуска. Понимание, что будет через 3, 6, 12 месяцев если начать сейчас.</p>

    <div class="md-accordion" :class="{ open: isOpen('2') }">
      <button class="md-accordion-header" @click="toggle('2')">
        <span class="md-accordion-icon">{{ isOpen('2') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Как устроен Чекап</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('2') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Разбираем бизнес по 10 направлениям и 180 взаимосвязанным метрикам. Не ещё один отчёт — системный подход шаг за шагом: все одинаково видят цель, оценивают как работает бизнес, непрерывно его улучшают и действуют в соответствии с точным и гибким планом.</p>
          <p class="md-text-inner md-method-label">Методология DMAIC + кросс-анализ:</p>
          <p class="md-text-inner md-dash"><strong>Определяем:</strong> проблемы по принципу «есть/нет» и сразу приоритезируем</p>
          <p class="md-text-inner md-dash"><strong>Измеряем:</strong> текущее состояние и строим базовую линию</p>
          <p class="md-text-inner md-dash"><strong>Анализируем:</strong> причины проблем — ищем взаимосвязи между процессами</p>
          <p class="md-text-inner md-dash"><strong>Улучшаем:</strong> точечно, прогнозируя влияние на все соседние области</p>
          <p class="md-text-inner md-dash"><strong>Контролируем:</strong> результаты через систему раннего предупреждения и регулярных чекапов</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('3') }">
      <button class="md-accordion-header" @click="toggle('3')">
        <span class="md-accordion-icon">{{ isOpen('3') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Что получает собственник</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('3') }">
        <div class="md-accordion-content">
          <p class="md-text-inner md-dash">Точные метрики — например, «оптимизация графика закупок высвободит X млн ₽» или «изменение мотивации увеличит выручку на Y%»</p>
          <p class="md-text-inner md-dash">Приоритизированный план действий — что делать сейчас, а что отложить, с оценкой эффекта и сроков</p>
          <p class="md-text-inner md-dash">Пошаговые решения проблем — с учётом взаимосвязей между процессами</p>
          <p class="md-text-inner md-dash">Детальный отчёт — анализ ~180 ключевых метрик и пошаговый план внедрения с временными рамками</p>
          <p class="md-text-inner md-dash">Система контроля — трекинг результатов и регулярные чекапы</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('4') }">
      <button class="md-accordion-header" @click="toggle('4')">
        <span class="md-accordion-icon">{{ isOpen('4') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Обязательство</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('4') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Платите за движение, а не за презентации. Если за 30 дней не завершили 3 основных улучшения — продолжаем бесплатно.</p>
          <p class="md-text-inner">Запускаем изменения, пока другие готовят отчёты. Быстро и точно против долго и сложно.</p>
        </div>
      </div>
    </div>

    <a class="md-btn" href="https://runscale.ru/checkup/overview.html" target="_blank" rel="noopener">Подробнее о Чекапе <span class="md-btn-arrow">→</span></a>

    <div class="md-divider-thin"></div>

    <!-- Радар -->
    <h4 class="md-h4-section">Радар</h4>
    <p class="md-result"><span class="md-result-label">Результат:</span> карта рынка. Используется для симуляций, проверки гипотез, быстрой коррекции всех частей стратегии.</p>

    <div class="md-accordion" :class="{ open: isOpen('5') }">
      <button class="md-accordion-header" @click="toggle('5')">
        <span class="md-accordion-icon">{{ isOpen('5') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Как работает Радар</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('5') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Проприетарная система оценки, созданная для поиска компаний, чей потенциал значительно превышает текущие результаты.</p>
          <p class="md-text-inner">Мы не ищем «проблемные» бизнесы. Мы ищем «спящих гигантов».</p>
          <p class="md-text-inner">Радар рассчитывает Индекс Роста на основе взвешенного анализа четырёх ключевых областей по десяткам публичных и косвенных признаков. Алгоритм анализирует не столько сами факты, сколько разрывы, противоречия и резонансы между ними.</p>
          <p class="md-text-inner md-highlight">Радар не показывает, что в компании «не так».<br/>Он подсвечивает, где скрыт потенциал роста.</p>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('6') }">
      <button class="md-accordion-header" @click="toggle('6')">
        <span class="md-accordion-icon">{{ isOpen('6') ? '−' : '+' }}</span>
        <span class="md-accordion-title">4 области анализа</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('6') }">
        <div class="md-accordion-content">
          <div class="md-analysis-block">
            <p class="md-analysis-title">Напряжение Роста · 35%</p>
            <p class="md-text-inner">Основной драйвер индекса. Здоровое противоречие между амбициозными целями и операционной реальностью — признак потенциала.</p>
          </div>
          <div class="md-analysis-block">
            <p class="md-analysis-title">Сила Видения Основателя · 25%</p>
            <p class="md-text-inner">Стратегический фундамент. Лидеры, чья мечта больше их текущего бизнеса, способны на кратные прорывы.</p>
          </div>
          <div class="md-analysis-block">
            <p class="md-analysis-title">Квантовый Скачок · 20%</p>
            <p class="md-text-inner">Способность к трансформации. История смелых решений и скорость реакции на кризисы определяют готовность к переменам.</p>
          </div>
          <div class="md-analysis-block">
            <p class="md-analysis-title">Человеческий Фактор · 20%</p>
            <p class="md-text-inner">Культурная основа. Резонанс между ценностями команды и декларациями бренда создаёт устойчивый рост.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="md-accordion" :class="{ open: isOpen('7') }">
      <button class="md-accordion-header" @click="toggle('7')">
        <span class="md-accordion-icon">{{ isOpen('7') ? '−' : '+' }}</span>
        <span class="md-accordion-title">Источники данных</span>
      </button>
      <div class="md-accordion-body" :class="{ expanded: isOpen('7') }">
        <div class="md-accordion-content">
          <p class="md-text-inner">Агрегируем сотни источников для полной картины компании:</p>
          <p class="md-text-inner md-dash"><strong>Финансовые данные:</strong> отчётность, СПАРК, динамика выручки, инвестиционные раунды</p>
          <p class="md-text-inner md-dash"><strong>Коммуникации руководства:</strong> интервью, конференции, медиа, соцсети CEO</p>
          <p class="md-text-inner md-dash"><strong>Обратная связь пользователей:</strong> HeadHunter, Хабр, App Store, Отзовик</p>
          <p class="md-text-inner md-dash"><strong>Профессиональные сообщества:</strong> отраслевые медиа, LinkedIn, Telegram, конференции</p>
          <p class="md-text-inner" style="margin-top: 12px;">Система оценивает не только <em>что</em> говорится, но и <em>как</em>: эмоциональный фон, повторяющиеся метафоры, скрытые напряжения, лингвистические паттерны.</p>
        </div>
      </div>
    </div>

    <a class="md-btn" href="https://runscale.ru/radar/overview.html" target="_blank" rel="noopener">Подробнее о Радаре <span class="md-btn-arrow">→</span></a>
  </div>
</template>
