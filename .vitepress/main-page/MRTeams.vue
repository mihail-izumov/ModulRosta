<template>
  <section class="mr-teams-section">
    <div class="mr-teams-container">
      <div class="mr-section-label">Mission Control</div>
      <h2 class="mr-section-title">Оперативные команды</h2>
      <p class="mr-section-description">Четыре специализированных подразделения. Каждое закрывает свой фронт.</p>
      
      <div class="mr-teams-grid">
        <div class="mr-team-card mr-team-red">
          <div class="mr-team-header">
            <span class="mr-team-code">КОМАНДА R-404</span>
          </div>
          <h3 class="mr-team-title">Red Team</h3>
          <div class="mr-team-role">Offensive / Stress Testing</div>
          <p class="mr-team-description">Имитация критических сбоев и конкурентных атак. Мы ломаем вашу систему до того, как это сделает рынок.</p>
          <ul class="mr-team-features">
            <li v-for="(feature, index) in redTeamFeatures" :key="index">
              <svg class="mr-feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
          <a href="/runscale-404" class="mr-team-cta-red">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
              <path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
            АКТИВИРОВАТЬ ПРОТОКОЛ 404 →
          </a>
        </div>

        <div class="mr-team-card mr-team-blue">
          <div class="mr-team-header">
            <span class="mr-team-code">КОМАНДА B-100</span>
          </div>
          <h3 class="mr-team-title">Blue Team</h3>
          <div class="mr-team-role">Engineering / Launch Pad</div>
          <p class="mr-team-description">Проектирование и развёртывание цифровых систем. Архитектура, которая выдерживает нагрузку. Запуск MVP за 30 дней.</p>
          <ul class="mr-team-features">
            <li v-for="(feature, index) in blueTeamFeatures" :key="index">
              <svg class="mr-feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="mr-team-card mr-team-black">
          <div class="mr-team-header">
            <span class="mr-team-code">КОМАНДА X-000</span>
          </div>
          <h3 class="mr-team-title">Black Team</h3>
          <div class="mr-team-role">Intelligence / Radar Terminal</div>
          <p class="mr-team-description">Глубокий анализ рынков и конкурентной среды. Мониторинг угроз и возможностей. Подготовка данных для стратегических решений.</p>
          <ul class="mr-team-features">
            <li v-for="(feature, index) in blackTeamFeatures" :key="index">
              <svg class="mr-feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="mr-team-card mr-team-gold">
          <div class="mr-team-header">
            <span class="mr-team-code">КОМАНДА G-200</span>
          </div>
          <h3 class="mr-team-title">Gold Team</h3>
          <div class="mr-team-role">Maintenance / Growth</div>
          <p class="mr-team-description">Интеграция патчей после краш-тестов. Реализация найденных возможностей. Устранение уязвимостей и подготовка к росту.</p>
          <ul class="mr-team-features">
            <li v-for="(feature, index) in goldTeamFeatures" :key="index">
              <svg class="mr-feature-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const redTeamFeatures = [
  'Симуляция кризисных сценариев',
  'Стресс-тест команды под давлением',
  'Поиск уязвимостей в операционной модели',
  'Протокол РАДАР-404: диагностика за 90 минут'
]

const blueTeamFeatures = [
  'Проектирование системной архитектуры',
  'Разработка MVP с core функционалом',
  'Интеграция с существующими системами',
  '30-дневный спринт до работающего продукта'
]

const blackTeamFeatures = [
  'Картирование конкурентной среды',
  'Анализ трендов и возможностей',
  'Изучение поведенческих паттернов аудитории',
  'Ежемесячные отчёты и брифинги'
]

const goldTeamFeatures = [
  'Внедрение рекомендаций Red Team',
  'Ежемесячные апдейты и доработки',
  'Мониторинг метрик и аналитика',
  'Масштабирование под нагрузку'
]
</script>

<style scoped>
.mr-teams-section {
  padding: 80px 24px;
}

.mr-teams-container {
  max-width: 1200px;
  margin: 0 auto;
}

.mr-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 16px;
}

.mr-section-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 300;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}

.mr-section-description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  max-width: 500px;
  margin-bottom: 48px;
}

.mr-teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.mr-team-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 32px;
  position: relative;
  transition: all 0.3s ease;
}

.mr-team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 12px 12px 0 0;
}

.mr-team-card:hover {
  transform: translateY(-4px);
}

.mr-team-red { border-color: rgba(255, 85, 85, 0.3); }
.mr-team-red::before { background: #ff5555; }
.mr-team-red:hover { border-color: #ff5555; box-shadow: 0 10px 40px rgba(255, 85, 85, 0.2); }

.mr-team-blue { border-color: rgba(88, 166, 255, 0.3); }
.mr-team-blue::before { background: #58a6ff; }
.mr-team-blue:hover { border-color: #58a6ff; box-shadow: 0 10px 40px rgba(88, 166, 255, 0.2); }

.mr-team-black { border-color: rgba(125, 133, 144, 0.3); }
.mr-team-black::before { background: #7d8590; }
.mr-team-black:hover { border-color: #7d8590; box-shadow: 0 10px 40px rgba(125, 133, 144, 0.2); }

.mr-team-gold { border-color: rgba(255, 215, 0, 0.3); }
.mr-team-gold::before { background: #ffd700; }
.mr-team-gold:hover { border-color: #ffd700; box-shadow: 0 10px 40px rgba(255, 215, 0, 0.2); }

.mr-team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mr-team-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 4px;
  letter-spacing: 2px;
  font-weight: 600;
}

.mr-team-red .mr-team-code { background: rgba(255, 85, 85, 0.1); border: 1px solid rgba(255, 85, 85, 0.3); color: #ff5555; }
.mr-team-blue .mr-team-code { background: rgba(88, 166, 255, 0.1); border: 1px solid rgba(88, 166, 255, 0.3); color: #58a6ff; }
.mr-team-black .mr-team-code { background: rgba(125, 133, 144, 0.1); border: 1px solid rgba(125, 133, 144, 0.3); color: #7d8590; }
.mr-team-gold .mr-team-code { background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); color: #ffd700; }

.mr-team-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.mr-team-red .mr-team-title { color: #ff5555; }
.mr-team-blue .mr-team-title { color: #58a6ff; }
.mr-team-black .mr-team-title { color: #7d8590; }
.mr-team-gold .mr-team-title { color: #ffd700; }

.mr-team-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.mr-team-description {
  font-size: 14px;
  color: #fff;
  line-height: 1.8;
  margin-bottom: 24px;
}

.mr-team-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mr-team-features li {
  font-size: 13px;
  color: #fff;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 12px;
}

.mr-team-features li:last-child {
  border-bottom: none;
}

.mr-feature-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.mr-team-red .mr-feature-arrow { color: #ff5555; }
.mr-team-blue .mr-feature-arrow { color: #58a6ff; }
.mr-team-black .mr-feature-arrow { color: #7d8590; }
.mr-team-gold .mr-feature-arrow { color: #ffd700; }

.mr-team-red .mr-team-features li span { color: rgba(255, 85, 85, 0.9); }
.mr-team-blue .mr-team-features li span { color: rgba(88, 166, 255, 0.9); }
.mr-team-black .mr-team-features li span { color: rgba(125, 133, 144, 0.9); }
.mr-team-gold .mr-team-features li span { color: rgba(255, 215, 0, 0.9); }

.mr-team-cta-red {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid #ff5555;
  color: #ff5555;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

.mr-team-cta-red::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 85, 85, 0.2), transparent);
  animation: mr-scan-btn 3s linear infinite;
}

@keyframes mr-scan-btn {
  0% { left: -100%; }
  100% { left: 100%; }
}

.mr-team-cta-red:hover {
  background: #ff5555;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 85, 85, 0.4);
}

.mr-team-cta-red:hover svg {
  stroke: #000;
}
</style>
