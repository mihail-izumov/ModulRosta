<template>
  <div class="brew-specs-container">
    <h1 class="main-specs-title">Характеристики <br> Радара</h1>
    
    <!-- Ключевые показатели -->
    <div class="specs-section">
      <h2 class="section-title">Ключевые показатели</h2>
      <div class="specs-grid four-cols">
        <div class="spec-item">
          <span class="spec-value">5,000 – 30,000</span>
          <p class="spec-label">Отзывов в базе (зависит от запроса)</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">20+</span>
          <p class="spec-label">Диалоговых сценариев</p>
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
    
    <!-- Платформа Сигнал -->
    <div class="specs-section">
      <h2 class="section-title">Платформа</h2>
      <div class="specs-grid four-cols">
        <div class="spec-item">
          <span class="spec-value">Проприетарная система оценки</span>
          <p class="spec-label">Тип</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">Закрытая</span>
          <p class="spec-label">Модель доступа</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">По запросу</span>
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
      <h2 class="section-title">Аналитическое ядро</h2>
      <div class="specs-grid three-cols">
        <div class="spec-item">
          <span class="spec-value">Отзывы 2ГИС/Яндекс</span>
          <p class="spec-label">Источник данных</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">Обработка естественного языка (NLP)</span>
          <p class="spec-label">Метод анализа</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">
            <a href="/signals">Анна</a>
          </span>
          <p class="spec-label">ИИ-ассистент</p>
        </div>
      </div>
      <div class="criteria-section">
        <span class="spec-value-full">Качество, Качество, Сервис, Скорость, Продукт, Цена/Качество, Дизайн, Локация, Бренд, Обещания</span>
        <p class="spec-label">10 ключевых критериев анализа</p>
      </div>
    </div>
    
    <!-- Симулятор Роста -->
    <div class="specs-section">
      <h2 class="section-title">Назначение</h2>
      <div class="specs-grid four-cols">
        <div class="spec-item">
          <span class="spec-value">
            <a href="/radar/overview">Сигналы Радара</a>
          </span>
          <p class="spec-label">Инструмент</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">Тестирование бизнес-моделей</span>
          <p class="spec-label">Назначение</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">Самара // Фокус на «Корж»</span>
          <p class="spec-label">Доступные Симуляторы</p>
        </div>
        <div class="spec-item">
          <span class="spec-value">Самара, Москва +</span>
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
            <a href="https://cffx.ru">Сигнал</a>
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
          <span class="spec-value">По запросу</span>
          <p class="spec-label">Условия доступа</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* Стили для ссылок - используем цвета из VitePress конфига */
.spec-value a {
  color: #C5F946; /* --vp-c-brand-2 из конфига */
  text-decoration: none; /* убираем подчеркивание по умолчанию */
  transition: all 0.2s ease;
}

.spec-value a:hover {
  color: #347b6c; /* --vp-c-brand-1 из конфига */
  text-decoration: underline; /* добавляем подчеркивание при ховере */
}

/* Адаптивность */
@media (max-width: 768px) {
  .brew-specs-container {
    padding: 32px 16px;
  }
  
  .main-specs-title {
    font-size: 28px;
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .specs-section {
    margin-bottom: 32px;
  }
  
  .specs-grid {
    gap: 24px;
  }
  
  .specs-grid.four-cols {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  
  .specs-grid.three-cols {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .specs-grid.four-cols,
  .specs-grid.three-cols {
    grid-template-columns: 1fr;
  }
}
</style>
