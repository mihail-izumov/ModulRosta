# B-R-E-W

## [Открытая](/brew/protocol) платформа, чтобы масштабировать ваш кофейный бизнес. Бесплатно и навсегда.

![BREW-intro](/brew_intro_ban.svg)

<div class="features-container">
  <div class="feature-card">
    <h3>Клонировать успех</h3>
    <p>Разберите бизнес-модели лидеров на атомы и заберите лучшие решения себе. Изучите стратегии конкурентов и адаптируйте их под свою нишу.</p>
  </div>
  
  <div class="feature-card">
    <h3>Найти точки роста</h3>
    <p>Превратите слабые места в источники силы, а жалобы клиентов — в дополнительную выручку. Найдите скрытые возможности для развития бизнеса.</p>
  </div>
  
  <div class="feature-card">
    <h3>Проверить на любом рынке</h3>
    <p>Узнайте, как ваша кофейня поведет себя в Самаре, Москве или на Луне. Сделайте свою идею неуязвимой и готовой к масштабированию.</p>
  </div>
</div>

<style>
/* Контейнер для карточек */
.features-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 32px 0;
}

/* --- ОБНОВЛЁННЫЕ СТИЛИ КАРТОЧКИ --- */
.feature-card {
  /* 
    Изменено: Установлен конкретный светло-серый фон для светлой темы,
    чтобы карточка была видна на белом фоне страницы без обводки.
  */
  background-color: #f6f6f7;
  /* Изменено: Обводка убрана по вашему запросу. */
  border: none;
  border-radius: 12px;
  padding: 24px 20px;
  height: 100%;
}

/* Стили для ТЁМНОЙ темы */
:root.dark .feature-card {
  /* 
    Для тёмной темы используем стандартную переменную VitePress,
    она создаёт отличный контраст.
  */
  background-color: var(--vp-c-bg-soft);
}

/* --- ОБНОВЛЁННЫЕ СТИЛИ ЗАГОЛОВКА --- */
.feature-card h3 {
  /* 
    Изменено: Цвет для светлой темы теперь тёмный для лучшей читаемости.
    Используем переменную основного текста.
  */
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.3;
  margin-top: 0;
  margin-bottom: 8px;
  font-weight: 600;
}

/* Цвет заголовка для ТЁМНОЙ темы */
:root.dark .feature-card h3 {
  /* Возвращаем ваш яркий цвет для тёмной темы, где он отлично смотрится */
  color: #c5f946;
}

.feature-card p {
  color: var(--vp-c-text-2); 
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .features-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>



## Симулятор Роста

<SimulatorCards />

### Работает Радар
**Сентябрь 2025:** Москва, Санкт-Петербург, Сочи + <br>
→ [Лог Сигналов](/radar/signal/log)

## Видеть больше, угадывать меньше

BREW использует **Кофейный Протокол** — анализ тысяч реальных отзывов, — чтобы давать прямые ответы на ваши вопросы. Вам больше никогда не придется действовать вслепую, теряя время и деньги на гипотезах.

→ [Присоединиться к Кофейному Протоколу](/brew/protocol)

### Ваша Умная Кофейня. Начинается Здесь.

<div class="start-button-container">
  <a href="/brew/about" class="btn btn-primary"  rel="noopener noreferrer">Узнать Больше →</a>
</div>

![[brew_outro_ban.jpg]]


<style>
/* --- ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ КНОПОК --- */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  margin: 10px 0;
}

.btn:hover {
  transform: translateY(-2px);
  text-decoration: none !important;
}

/* --- СТИЛЬ ОСНОВНОЙ КНОПКИ (ЯРКАЯ) --- */
.btn-primary {
  background-color: #C5F946; /* Яркий лаймовый */
  color: #000 !important;
}

.btn-primary:hover {
  background-color: #347b6c; /* Темный при наведении */
  color: white !important;
}

/* --- Контейнер для отдельной кнопки --- */
.start-button-container {
  margin: 20px 0;
  text-align: left;
}

.start-button-container .btn {
  display: inline-block;
  margin: 0;
}
</style>

---

<div class="brew-specs-container">

  <h1 class="main-specs-title">Характеристики <br> B-R-E-W</h1>

  <!-- Ключевые показатели -->
  <div class="specs-section">
    <h2 class="section-title">Ключевые показатели</h2>
    <div class="specs-grid four-cols">
      <div class="spec-item">
        <span class="spec-value">3,000 – 50,000</span>
        <p class="spec-label">Отзывов в базе (зависит от города)</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">20+</span>
        <p class="spec-label">Диалоговых сценариев (для каждого сигнала)</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">5-10 сек</span>
        <p class="spec-label">Среднее время ответа на запрос</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">24/7</span>
        <p class="spec-label">Доступность платформы</p>
      </div>
    </div>
  </div>

  <!-- Платформа B-R-E-W -->
  <div class="specs-section">
    <h2 class="section-title">Платформа B-R-E-W</h2>
    <div class="specs-grid four-cols">
      <div class="spec-item">
        <span class="spec-value">Мета-франшиза</span>
        <p class="spec-label">Тип</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">
          <a href="/brew/protocol">Открытая</a>
          </span>
        <p class="spec-label">Модель доступа</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">Бесплатно, навсегда</span>
        <p class="spec-label">Стоимость</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">(B)aseline, (R)oadmap, (E)xecute, (W)in</span>
        <p class="spec-label">Ключевой принцип</p>
      </div>
    </div>
  </div>

  <!-- Аналитическое ядро: Кофейный Протокол -->
  <div class="specs-section">
    <h2 class="section-title">Аналитическое ядро: Кофейный Протокол</h2>
    <div class="specs-grid three-cols">
      <div class="spec-item">
        <span class="spec-value">Отзывы реальных клиентов</span>
        <p class="spec-label">Источник данных</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">Обработка естественного языка (NLP)</span>
        <p class="spec-label">Метод анализа</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">
          <a href="/radar/who-is-anna">Анна</a>
          </span>
        <p class="spec-label">ИИ-ассистент</p>
      </div>
    </div>
    <div class="criteria-section">
      <span class="spec-value-full">Качество кофе, Атмосфера, Сервис, Скорость, Выпечка, Цена/качество, Дизайн, Локация, Бренд, Чистота</span>
      <p class="spec-label">10 ключевых критериев анализа</p>
    </div>
  </div>

  <!-- Симулятор Роста -->
  <div class="specs-section">
    <h2 class="section-title">Симулятор Роста</h2>
    <div class="specs-grid four-cols">
        <div class="spec-item">
            <span class="spec-value">
            <a href="/radar/signal/log">Сигналы Радара</a>
            </span>
            <p class="spec-label">Инструмент</p>
        </div>
        <div class="spec-item">
            <span class="spec-value">Тестирование бизнес-моделей</span>
            <p class="spec-label">Назначение</p>
        </div>
        <div class="spec-item">
            <span class="spec-value">Самара // Фокус на «Корж»</span>
            <p class="spec-label">Доступные сигналы</p>
        </div>
        <div class="spec-item">
            <span class="spec-value">Новосибирск, Москва, СПб, Сочи +</span>
            <p class="spec-label">Работает Радар</p>
        </div>
    </div>
  </div>

  <!-- Интерфейс и Взаимодействие -->
  <div class="specs-section">
    <h2 class="section-title">Интерфейс и Взаимодействие</h2>
    <div class="specs-grid three-cols">
      <div class="spec-item">
        <span class="spec-value">Диалоговый чат в Perplexity (Web/App)</span>
        <p class="spec-label">Основной интерфейс</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">Обмен ссылками на сессии или их части по выбору пользователя</span>
        <p class="spec-label">Совместная работа</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">Диалог, таблицы, чек-листы</span>
        <p class="spec-label">Формат вывода</p>
      </div>
    </div>
  </div>

  <!-- Расширенные услуги -->
  <div class="specs-section">
    <h2 class="section-title">Расширенные услуги</h2>
    <div class="specs-grid three-cols">
      <div class="spec-item">
        <span class="spec-value">
          <a href="/about/company">Модуль Роста®</a>
          </span>
        <p class="spec-label">Система-партнер</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">
          <a href="/checkup/overview">Чекап</a>, 
          <a href="/system/overview">Система Роста Бизнеса</a>
        </span>
        <p class="spec-label">Доступные услуги</p>
      </div>
      <div class="spec-item">
        <span class="spec-value">По запросу, после работы с платформой</span>
        <p class="spec-label">Условия доступа</p>
      </div>
    </div>
  </div>

</div>

<style>
  .brew-specs-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    background-color: #000;
    color: #fff;
    padding: 64px 24px;
    max-width: 1128px;
    margin: 0 auto;
    border-radius: 16px;
  }
  .main-specs-title {
    font-size: 36px;
    font-weight: 600;
    text-align: left;
    margin: 0 0 56px 0;
  }
  .specs-section {
    margin-bottom: 56px;
  }
  .section-title {
    font-size: 28px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 24px 0;
    padding: 0;
  }
  .specs-grid {
    display: grid;
    gap: 32px;
    padding-left: 0;
  }
  .specs-grid.four-cols {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .specs-grid.three-cols {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  .spec-item .spec-label {
    font-size: 14px;
    font-weight: 500;
    color: #5c5e62;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }
  .spec-item .spec-value {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    line-height: 1.4;
    margin-bottom: 4px;
  }
  .criteria-section {
    margin-top: 32px;
  }
  .criteria-section .spec-label {
    font-size: 14px;
    font-weight: 500;
    color: #5c5e62;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }
  .criteria-section .spec-value-full {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    line-height: 1.4;
    margin-bottom: 4px;
    overflow-wrap: break-word;
    word-break: break-word;
  }
</style>
