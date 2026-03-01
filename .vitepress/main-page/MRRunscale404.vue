<template>
  <section class="mr-runscale-404-section">
    <div class="mr-runscale-404-scanner mr-scanner-top"></div>
    <div class="mr-runscale-404-scanner mr-scanner-bottom"></div>
    
    <div class="mr-runscale-404-container">
      <div class="mr-runscale-404-badge">⚠ PROTOCOL_404 // RED TEAM OFFENSIVE</div>
      <h2 class="mr-runscale-404-title">РАНСКЕЙЛ-404</h2>
      <p class="mr-runscale-404-subtitle">Стресс-тест бизнеса за 5 дней. Находим уязвимости в маркетинге, бренде и продукте до того, как вы потратите бюджет.</p>
      
      <div class="mr-runscale-404-stats">
        <div class="mr-stat-item">
          <div class="mr-stat-value">5</div>
          <div class="mr-stat-label">дней диагностика</div>
        </div>
        <div class="mr-stat-divider"></div>
        <div class="mr-stat-item">
          <div class="mr-stat-value">8/10</div>
          <div class="mr-stat-label">проектов — No-Go</div>
        </div>
        <div class="mr-stat-divider"></div>
        <div class="mr-stat-item">
          <div class="mr-stat-value">Go / No-Go</div>
          <div class="mr-stat-label">честный вердикт</div>
        </div>
      </div>

      <a href="/runscale-404" class="mr-runscale-404-cta">ЗАПУСТИТЬ ДИАГНОСТИКУ →</a>
      
      <div class="mr-runscale-404-terminal">
        <div class="mr-terminal-block mr-terminal-input mr-terminal-red">
          Ранскейл-404: 5 дней<span class="mr-typing-cursor mr-cursor-red"></span>
        </div>
        <span class="mr-terminal-arrow mr-arrow-red">→</span>
        <div class="mr-terminal-block mr-terminal-output-red">
          Go / No-Go решение
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Runscale-404 component
</script>

<style scoped>
.mr-runscale-404-section {
  position: relative;
  padding: 100px 24px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid rgba(255, 85, 85, 0.3);
  border-bottom: 1px solid rgba(255, 85, 85, 0.3);
}

.mr-runscale-404-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 85, 85, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.mr-runscale-404-scanner {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff5555, transparent);
}

.mr-scanner-top {
  top: 0;
  animation: mr-scanner-move-right 4s linear infinite;
}

.mr-scanner-bottom {
  bottom: 0;
  animation: mr-scanner-move-left 4s linear infinite;
}

@keyframes mr-scanner-move-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes mr-scanner-move-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.mr-runscale-404-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  z-index: 1;
}

.mr-runscale-404-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #ff5555;
  letter-spacing: 2px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 4px;
  margin-bottom: 24px;
  animation: mr-badge-pulse 2s ease-in-out infinite;
}

@keyframes mr-badge-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.mr-runscale-404-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 700;
  color: #ff5555;
  margin-bottom: 24px;
  letter-spacing: 4px;
}

.mr-runscale-404-subtitle {
  font-size: 18px;
  color: #fff;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 48px;
}

.mr-runscale-404-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.mr-stat-item {
  text-align: center;
}

.mr-stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  color: #ff5555;
  margin-bottom: 8px;
}

.mr-stat-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mr-stat-divider {
  width: 1px;
  height: 50px;
  background: rgba(255, 85, 85, 0.3);
}

.mr-runscale-404-cta {
  display: inline-block;
  padding: 18px 48px;
  background: transparent;
  border: 2px solid #ff5555;
  color: #ff5555;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

.mr-runscale-404-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 85, 85, 0.3), transparent);
  animation: mr-scan-btn 3s linear infinite;
}

@keyframes mr-scan-btn {
  0% { left: -100%; }
  100% { left: 100%; }
}

.mr-runscale-404-cta:hover {
  background: #ff5555;
  color: #000;
  box-shadow: 0 0 30px rgba(255, 85, 85, 0.5);
  transform: translateY(-2px);
}

.mr-runscale-404-terminal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.mr-terminal-block {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mr-terminal-red::before {
  content: '>';
  color: #ff5555;
  font-weight: 700;
}

.mr-terminal-output-red {
  border-color: #ff5555;
  background: rgba(255, 85, 85, 0.1);
  color: #ff5555;
}

.mr-cursor-red {
  background: #ff5555;
}

.mr-arrow-red {
  color: #ff5555;
}

.mr-typing-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  margin-left: 4px;
  animation: mr-blink 1s step-end infinite;
}

@keyframes mr-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.mr-terminal-arrow {
  font-size: 20px;
  animation: mr-arrow-pulse 1.5s ease-in-out infinite;
}

@keyframes mr-arrow-pulse {
  0%, 100% { opacity: 0.5; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(4px); }
}

@media (max-width: 700px) {
  .mr-runscale-404-stats {
    flex-direction: column;
    gap: 24px;
  }
  .mr-stat-divider {
    width: 60px;
    height: 1px;
  }
  .mr-runscale-404-cta {
    width: 100%;
    padding: 16px 24px;
  }
  .mr-runscale-404-terminal {
    flex-direction: column;
    gap: 12px;
  }
  .mr-terminal-arrow {
    transform: rotate(90deg);
  }
}
</style>
