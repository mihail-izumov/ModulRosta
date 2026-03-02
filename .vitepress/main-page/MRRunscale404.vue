<template>
  <section class="mr-rs404-section">
    <div class="mr-rs404-scanner mr-rs404-scanner-top"></div>
    <div class="mr-rs404-scanner mr-rs404-scanner-bottom"></div>
    <div class="mr-rs404-container">
      <div class="mr-rs404-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        PROTOCOL_404 // RED TEAM OFFENSIVE
      </div>
      <h2 class="mr-rs404-title">РАНСКЕЙЛ_404</h2>
      <p class="mr-rs404-subtitle">Стресс-тест бизнеса за 5 дней. Находим уязвимости в маркетинге, бренде и продукте до того, как вы потратите бюджет.</p>
      
      <div class="mr-rs404-stats">
        <div class="mr-rs404-stat-item">
          <div class="mr-rs404-stat-value">5</div>
          <div class="mr-rs404-stat-label">ДНЕЙ</div>
        </div>
        <div class="mr-rs404-stat-divider"></div>
        <div class="mr-rs404-stat-item">
          <div class="mr-rs404-stat-value">8/10</div>
          <div class="mr-rs404-stat-label">NO-GO</div>
        </div>
        <div class="mr-rs404-stat-divider"></div>
        <div class="mr-rs404-stat-item">
          <div class="mr-rs404-stat-value">GO</div>
          <div class="mr-rs404-stat-label">ВЕРДИКТ</div>
        </div>
      </div>

      <a href="#" class="mr-rs404-cta">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        ЗАПУСТИТЬ ДИАГНОСТИКУ
      </a>
      
      <div class="mr-rs404-terminal">
        <div class="mr-rs404-terminal-block mr-rs404-terminal-input">
          Ранскейл_404: 5 дней<span class="mr-rs404-cursor"></span>
        </div>
        <span class="mr-rs404-terminal-arrow">→</span>
        <div class="mr-rs404-terminal-block mr-rs404-terminal-output">
          Go / No-Go решение
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

.mr-rs404-section {
  position: relative;
  padding: 100px 24px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid rgba(255, 85, 85, 0.3);
  border-bottom: 1px solid rgba(255, 85, 85, 0.3);
}

.mr-rs404-section::before {
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

.mr-rs404-scanner {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff5555, transparent);
}

.mr-rs404-scanner-top { top: 0; animation: mr-rs404-scan-right 4s linear infinite; }
.mr-rs404-scanner-bottom { bottom: 0; animation: mr-rs404-scan-left 4s linear infinite; }

@keyframes mr-rs404-scan-right { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes mr-rs404-scan-left { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

.mr-rs404-container { position: relative; max-width: 800px; margin: 0 auto; z-index: 1; }

.mr-rs404-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #ff5555;
  letter-spacing: 3px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 4px;
  margin-bottom: 32px;
  animation: mr-rs404-badge-pulse 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 85, 85, 0.5);
}
.mr-rs404-badge svg { flex-shrink: 0; }

@keyframes mr-rs404-badge-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

.mr-rs404-title {
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 700;
  color: #ff5555;
  margin-bottom: 48px;
  letter-spacing: 4px;
  text-shadow: 0 0 30px rgba(255, 85, 85, 0.6), 0 0 60px rgba(255, 85, 85, 0.3);
}

.mr-rs404-subtitle {
  font-size: 18px;
  color: #fff;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 48px;
}

/* LED Stats - like screenshot */
.mr-rs404-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.mr-rs404-stat-item { text-align: center; }

.mr-rs404-stat-value {
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-size: clamp(48px, 10vw, 72px);
  font-weight: 700;
  color: #ff5555;
  line-height: 1;
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(255, 85, 85, 0.8), 0 0 40px rgba(255, 85, 85, 0.4);
  letter-spacing: 2px;
}

.mr-rs404-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.mr-rs404-stat-divider {
  width: 1px;
  height: 80px;
  background: rgba(255, 85, 85, 0.3);
}

.mr-rs404-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 48px;
  background: transparent !important;
  border: 2px solid #ff5555 !important;
  color: #ff5555 !important;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.mr-rs404-cta::before, .mr-rs404-cta::after { display: none !important; content: none !important; }
.mr-rs404-cta svg { flex-shrink: 0; }

.mr-rs404-cta:hover {
  background: #ff5555 !important;
  color: #000 !important;
  box-shadow: 0 0 30px rgba(255, 85, 85, 0.5);
  transform: translateY(-2px);
}

.mr-rs404-terminal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.mr-rs404-terminal-block {
  background: rgba(17, 17, 17, 0.8);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

.mr-rs404-terminal-input { color: #888; }
.mr-rs404-terminal-input::before { content: '> '; color: #ff5555; }

.mr-rs404-terminal-output {
  border-color: #ff5555;
  background: rgba(255, 85, 85, 0.1);
  color: #ff5555;
}

.mr-rs404-terminal-arrow { color: #ff5555; font-size: 18px; }

.mr-rs404-cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: #ff5555;
  margin-left: 4px;
  vertical-align: middle;
  animation: mr-rs404-blink 1s step-end infinite;
}

@keyframes mr-rs404-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

@media (max-width: 700px) {
  .mr-rs404-stats { flex-direction: row; gap: 24px; }
  .mr-rs404-stat-divider { width: 1px; height: 60px; }
  .mr-rs404-stat-value { font-size: 36px; }
  .mr-rs404-cta { width: 100%; padding: 16px 24px; }
  .mr-rs404-terminal { flex-direction: column; }
}
</style>
