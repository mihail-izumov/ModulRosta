<template>
  <section class="mr-hero">
    <div class="mr-hero-content">
      <div class="mr-hero-radar">
        <div class="mr-hero-radar-dot"></div>
        <span class="mr-hero-radar-text">МОДУЛЬ РОСТА® | R&D ЗАПУСКИ</span>
      </div>
      
      <h1 class="mr-hero-title">Вы знаете, что хотите.<br><strong>Мы делаем это в цифре.</strong></h1>
      
      <div class="mr-hero-terminal">
        <div class="mr-terminal-block mr-terminal-input">
          «Хочу как у лидеров рынка»<span class="mr-typing-cursor"></span>
        </div>
        <span class="mr-terminal-arrow">→</span>
        <div class="mr-terminal-block mr-terminal-output">
          рабочий продукт через 8 недель
        </div>
      </div>
      
      <p class="mr-hero-subtitle">
        <span class="mr-hero-tip" title="Дизайн без инженерии мёртв. Мы проектируем логику и тягу, а не просто перекрашиваем пиксели.">Не рисуем картинки.</span>
        <span class="mr-hero-tip" title="Слайды не запускают. Запуск запускает. Мы строим работающий продукт, а не рассказываем о нём.">Не делаем презентации.</span>
        <span class="mr-hero-tip" title="Сайт — частный случай. Мы строим систему: продукт + аналитика + управление.">Не делаем сайты.</span><br>
        <span class="mr-text-accent"><strong>Строим и запускаем цифровые продукты.</strong></span>
      </p>
      
      <a href="#mr-launch-protocol" class="mr-hero-cta">ЗАБРОНИРОВАТЬ ЗАПУСК →</a>
    </div>
    <div class="mr-scroll-indicator"><span>↓</span></div>
  </section>
</template>

<script setup lang="ts">
// Hero component - no logic needed
</script>

<style scoped>
.mr-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 80px 24px;
  position: relative;
}

.mr-hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.mr-hero-radar {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  animation: mr-radar-glow 3s ease-in-out infinite;
}

@keyframes mr-radar-glow {
  0%, 100% { 
    box-shadow: 0 0 10px rgba(52, 123, 108, 0.3), 0 0 20px rgba(52, 123, 108, 0.1), inset 0 0 10px rgba(52, 123, 108, 0.05);
    border-color: var(--vp-c-brand-1);
  }
  50% { 
    box-shadow: 0 0 20px rgba(52, 123, 108, 0.6), 0 0 40px rgba(52, 123, 108, 0.3), inset 0 0 20px rgba(52, 123, 108, 0.1);
    border-color: var(--vp-c-brand-2);
  }
}

.mr-hero-radar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(52, 123, 108, 0.2), transparent);
  animation: mr-radar-scan 4s linear infinite;
}

@keyframes mr-radar-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.mr-hero-radar-dot {
  width: 8px;
  height: 8px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: mr-radar-dot-pulse 3s ease-in-out infinite;
}

@keyframes mr-radar-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 12px var(--vp-c-brand-1), 0 0 24px var(--vp-c-brand-1); }
  50% { opacity: 0.4; box-shadow: 0 0 4px var(--vp-c-brand-1); }
}

.mr-hero-radar-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: mr-text-glow 3s ease-in-out infinite;
}

@keyframes mr-text-glow {
  0%, 100% { text-shadow: 0 0 10px rgba(52, 123, 108, 0.5); }
  50% { text-shadow: 0 0 20px rgba(52, 123, 108, 0.8), 0 0 30px rgba(52, 123, 108, 0.4); }
}

.mr-hero-title {
  font-size: clamp(32px, 6vw, 56px);
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 32px;
  letter-spacing: -1px;
  color: var(--vp-c-text-1);
}

.mr-hero-title strong {
  font-weight: 600;
  color: #fff;
}

.mr-hero-terminal {
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.mr-terminal-block {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 20px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mr-terminal-input {
  color: var(--vp-c-text-2);
}

.mr-terminal-input::before {
  content: '>';
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.mr-terminal-output {
  background: rgba(52, 123, 108, 0.1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.mr-terminal-arrow {
  color: var(--vp-c-brand-1);
  font-size: 20px;
  animation: mr-arrow-pulse 1.5s ease-in-out infinite;
}

@keyframes mr-arrow-pulse {
  0%, 100% { opacity: 0.5; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(4px); }
}

.mr-typing-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: var(--vp-c-brand-1);
  margin-left: 4px;
  animation: mr-blink 1s step-end infinite;
}

@keyframes mr-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.mr-hero-subtitle {
  font-size: clamp(15px, 2vw, 18px);
  color: var(--vp-c-text-2);
  line-height: 1.9;
  margin-top: 40px;
  margin-bottom: 48px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.mr-hero-subtitle strong {
  color: var(--vp-c-text-1);
}

.mr-hero-tip {
  cursor: help;
  border-bottom: 1px dashed var(--vp-c-text-3);
  transition: all 0.2s ease;
}

.mr-hero-tip:hover {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.mr-text-accent {
  color: var(--vp-c-brand-1);
}

.mr-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 20px 48px;
  background: var(--vp-c-brand-1);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.mr-hero-cta:hover {
  background: var(--vp-c-brand-2);
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(52, 123, 108, 0.3);
}

.mr-scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: mr-bounce 2s ease-in-out infinite;
}

.mr-scroll-indicator span {
  font-size: 24px;
  color: var(--vp-c-text-3);
}

@keyframes mr-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

@media (max-width: 700px) {
  .mr-hero-terminal {
    flex-direction: column;
    gap: 12px;
  }
  .mr-terminal-block {
    padding: 10px 16px;
    font-size: 13px;
  }
  .mr-terminal-arrow {
    transform: rotate(90deg);
  }
}
</style>
