<template>
  <section class="mr-rs404-section">
    <div class="mr-rs404-scanner mr-rs404-scanner-top"></div>
    <div class="mr-rs404-container">
      <div class="mr-rs404-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        90 минут. Одна сессия. Один вердикт.
      </div>
      <h2 class="mr-rs404-title">РЕЖИМ РАНСКЕЙЛ</h2>

      <div class="mr-rs404-terminal">
        <div class="mr-rs404-terminal-block mr-rs404-terminal-input">
          Чекап системы и процессов<span class="mr-rs404-cursor"></span>
        </div>
        <span class="mr-rs404-terminal-arrow">→</span>
        <div class="mr-rs404-terminal-block mr-rs404-terminal-output">
          Резюме на 1 странице
        </div>
      </div>

      <div class="mr-rs404-description">
        <p>Находим что тормозит рост прямо сейчас. Выбираем один цифровой продукт, который решает это.</p>
        <p>Документ на одной странице: <span class="mr-rs404-go">GO</span> или <span class="mr-rs404-nogo">NO GO</span>.</p>
        <p><span class="mr-rs404-go">GO</span> — запускаем. <span class="mr-rs404-nogo">NO GO</span> — документ показывает что устранить, чтобы запуск стал возможным.</p>
      </div>

      <div class="mr-rs404-stats">
        <div class="mr-rs404-stat-item">
          <div class="mr-rs404-stat-value">90</div>
          <div class="mr-rs404-stat-label">МИН.</div>
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
    </div>
    <MRLaunchPanel />
    <div class="mr-rs404-scanner mr-rs404-scanner-bottom"></div>
  </section>
</template>

<script setup lang="ts">
import MRLaunchPanel from '../.vitepress/main-page/MRLaunchPanel.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

.mr-rs404-section {
  position: relative;
  padding: 100px 24px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid rgba(255, 136, 0, 0.3);
  border-bottom: 1px solid rgba(255, 136, 0, 0.3);
}

.mr-rs404-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 136, 0, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.mr-rs404-scanner {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f80, transparent);
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
  color: #f80;
  letter-spacing: 3px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 136, 0, 0.3);
  border-radius: 4px;
  margin-bottom: 32px;
  animation: mr-rs404-badge-pulse 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 136, 0, 0.5);
}
.mr-rs404-badge svg { flex-shrink: 0; }

@keyframes mr-rs404-badge-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

.mr-rs404-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 700;
  color: #f80;
  margin-bottom: 32px;
  letter-spacing: 4px;
  text-shadow: 0 0 30px rgba(255, 136, 0, 0.6), 0 0 60px rgba(255, 136, 0, 0.3);
  text-transform: uppercase;
}

/* Description block */
.mr-rs404-description {
  max-width: 620px;
  margin: 32px auto 48px;
  text-align: left;
}

.mr-rs404-description p {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.8;
  margin: 0 0 12px;
}

.mr-rs404-description p:last-child { margin-bottom: 0; }

.mr-rs404-go {
  color: #00ff88;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
}

.mr-rs404-nogo {
  color: rgba(255, 255, 255, 0.35);
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  font-weight: 700;
}

/* LED Stats */
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
  font-weight: 500;
  color: #f80;
  line-height: 1;
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(255, 136, 0, 0.8), 0 0 40px rgba(255, 136, 0, 0.4);
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
  background: rgba(255, 136, 0, 0.3);
}

.mr-rs404-terminal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
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
.mr-rs404-terminal-input::before { content: '> '; color: #f80; }

.mr-rs404-terminal-output {
  border-color: #f80;
  background: rgba(255, 136, 0, 0.1);
  color: #f80;
}

.mr-rs404-terminal-arrow { color: #f80; font-size: 18px; }

.mr-rs404-cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: #f80;
  margin-left: 4px;
  vertical-align: middle;
  animation: mr-rs404-blink 1s step-end infinite;
}

@keyframes mr-rs404-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

@media (max-width: 700px) {
  .mr-rs404-stats { flex-direction: row; gap: 24px; }
  .mr-rs404-stat-divider { width: 1px; height: 60px; }
  .mr-rs404-stat-value { font-size: 36px; }
  .mr-rs404-terminal { flex-direction: column; }
  .mr-rs404-terminal-arrow { transform: rotate(90deg); animation: mr-rs404-arrow-bounce 1.5s ease-in-out infinite; }
  .mr-rs404-description { text-align: left; padding: 0 8px; }
}

@keyframes mr-rs404-arrow-bounce {
  0%, 100% { transform: rotate(90deg) translateX(0); }
  50% { transform: rotate(90deg) translateX(4px); }
}
</style>
