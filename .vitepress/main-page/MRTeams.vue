<template>
  <section class="mr-teams-section">
    <div class="mr-teams-container">
      <div class="mr-section-label">ОПЕРАТИВНЫЕ КОМАНДЫ</div>
      <h2 class="mr-teams-subtitle">Четыре специализированных подразделения.<br>Каждое закрывает свой фронт.</h2>

      <div class="mr-teams-grid">
        <!-- Red Team -->
        <div class="mr-team-card mr-team-red">
          <div class="mr-team-card-line"></div>
          <span class="mr-team-code">КОМАНДА R-404</span>
          <h3 class="mr-team-name">Red Team</h3>
          <div class="mr-team-role">OFFENSIVE / STRESS TESTING</div>
          <p class="mr-team-desc">Имитация критических сбоев и конкурентных атак. Мы ломаем вашу систему до того, как это сделает рынок.</p>
          <ul class="mr-team-features">
            <li><span class="mr-feature-arrow">→</span><span>Симуляция кризисных сценариев</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Стресс-тест команды под давлением</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Поиск уязвимостей в операционной модели</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Протокол РАДАР-404: диагностика за 90 минут</span></li>
          </ul>
          <a href="#" class="mr-team-cta mr-team-cta-red">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Запустить стресс-тест
          </a>
        </div>

        <!-- Blue Team -->
        <div class="mr-team-card mr-team-blue">
          <div class="mr-team-card-line"></div>
          <span class="mr-team-code">КОМАНДА B-100</span>
          <h3 class="mr-team-name">Blue Team</h3>
          <div class="mr-team-role">ENGINEERING / LAUNCH PAD</div>
          <p class="mr-team-desc">Проектирование и развёртывание цифровых систем. Архитектура, которая выдерживает нагрузку. Запуск MVP за 30 дней.</p>
          <ul class="mr-team-features">
            <li><span class="mr-feature-arrow">→</span><span>Проектирование системной архитектуры</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Разработка MVP с core функционалом</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Интеграция с существующими системами</span></li>
            <li><span class="mr-feature-arrow">→</span><span>30-дневный спринт до работающего продукта</span></li>
          </ul>
        </div>

        <!-- Black Team -->
        <div class="mr-team-card mr-team-black">
          <div class="mr-team-card-line"></div>
          <span class="mr-team-code">КОМАНДА X-000</span>
          <h3 class="mr-team-name">Black Team</h3>
          <div class="mr-team-role">INTELLIGENCE / RADAR TERMINAL</div>
          <p class="mr-team-desc">Глубокий анализ рынков и конкурентной среды. Мониторинг угроз и возможностей. Подготовка данных для стратегических решений.</p>
          <ul class="mr-team-features">
            <li><span class="mr-feature-arrow">→</span><span>Картирование конкурентной среды</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Анализ трендов и возможностей</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Изучение поведенческих паттернов аудитории</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Ежемесячные отчёты и брифинги</span></li>
          </ul>
        </div>

        <!-- Gold Team -->
        <div class="mr-team-card mr-team-gold">
          <div class="mr-team-card-line"></div>
          <span class="mr-team-code">КОМАНДА G-200</span>
          <h3 class="mr-team-name">Gold Team</h3>
          <div class="mr-team-role">MAINTENANCE / GROWTH</div>
          <p class="mr-team-desc">Интеграция патчей после краш-тестов. Реализация найденных возможностей. Устранение уязвимостей и подготовка к росту.</p>
          <ul class="mr-team-features">
            <li><span class="mr-feature-arrow">→</span><span>Внедрение рекомендаций Red Team</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Ежемесячные апдейты и доработки</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Мониторинг метрик и аналитика</span></li>
            <li><span class="mr-feature-arrow">→</span><span>Масштабирование под нагрузку</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.mr-teams-section { padding: 80px 24px; }
.mr-teams-container { max-width: 1400px; margin: 0 auto; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }

.mr-teams-subtitle {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 500;
  color: #fff;
  margin-bottom: 48px;
  line-height: 1.4;
}

.mr-teams-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; align-items: start; }

@media (max-width: 1200px) { .mr-teams-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .mr-teams-grid { grid-template-columns: 1fr; } }

.mr-team-card {
  background: rgba(17, 17, 17, 0.6);
  border: 1px solid #222;
  border-radius: 12px;
  padding: 28px 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 480px;
}

.mr-team-card-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 12px 12px 0 0;
}

.mr-team-red .mr-team-card-line { background: #ff5555; }
.mr-team-blue .mr-team-card-line { background: #58a6ff; }
.mr-team-black .mr-team-card-line { background: #7d8590; }
.mr-team-gold .mr-team-card-line { background: #ffd700; }

.mr-team-code {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  padding: 6px 12px;
  border-radius: 4px;
  letter-spacing: 1px;
  margin-bottom: 16px;
  width: fit-content;
}

.mr-team-red .mr-team-code { color: #ff5555; border: 1px solid rgba(255, 85, 85, 0.3); }
.mr-team-blue .mr-team-code { color: #58a6ff; border: 1px solid rgba(88, 166, 255, 0.3); }
.mr-team-black .mr-team-code { color: #7d8590; border: 1px solid rgba(125, 133, 144, 0.3); }
.mr-team-gold .mr-team-code { color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.3); }

.mr-team-name { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
.mr-team-red .mr-team-name { color: #ff5555; }
.mr-team-blue .mr-team-name { color: #58a6ff; }
.mr-team-black .mr-team-name { color: #fff; }
.mr-team-gold .mr-team-name { color: #ffd700; }

.mr-team-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  min-height: 28px;
}

.mr-team-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 24px;
  min-height: 88px;
}

.mr-team-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  flex-grow: 1;
}

.mr-team-features li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.mr-feature-arrow { flex-shrink: 0; }
.mr-team-red .mr-feature-arrow { color: #ff5555; }
.mr-team-blue .mr-feature-arrow { color: #58a6ff; }
.mr-team-black .mr-feature-arrow { color: #7d8590; }
.mr-team-gold .mr-feature-arrow { color: #ffd700; }

.mr-team-features li span:last-child { color: var(--vp-c-text-2); }
.mr-team-red .mr-team-features li span:last-child { color: #ff5555; }
.mr-team-blue .mr-team-features li span:last-child { color: #58a6ff; }
.mr-team-black .mr-team-features li span:last-child { color: #7d8590; }
.mr-team-gold .mr-team-features li span:last-child { color: #ffd700; }

.mr-team-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: auto;
}

.mr-team-cta-red {
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid #ff5555;
  color: #ff5555;
}
.mr-team-cta-red::before, .mr-team-cta-red::after { display: none !important; content: none !important; }

.mr-team-cta-red:hover {
  background: #ff5555;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 85, 85, 0.3);
}
</style>
