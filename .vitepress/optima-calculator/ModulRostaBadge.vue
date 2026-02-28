<script setup>
</script>

<template>
  <div class="osc-badge-wrapper">
    <a href="https://runscale.ru" target="_blank" rel="noopener noreferrer" class="osc-partner-badge">
      <div class="osc-radar-scan"></div>
      <div class="osc-radar-dot"></div>
      <span class="osc-badge-text">Технологический партнёр | Модуль Роста®</span>
    </a>
  </div>
</template>

<style scoped>
.osc-badge-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  margin-bottom: 24px;
}

.osc-partner-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border: 1px solid #00D9C0;
  border-radius: 8px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 10px rgba(0, 217, 192, 0.3), 0 0 20px rgba(0, 217, 192, 0.1);
}

.osc-partner-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 217, 192, 0.6), 0 0 40px rgba(0, 217, 192, 0.3);
  border-color: #00D9C0;
}

.osc-radar-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 217, 192, 0.2), transparent);
  animation: osc-radar-scan 4s linear infinite;
}

@keyframes osc-radar-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.osc-radar-dot {
  width: 8px;
  height: 8px;
  background: #00D9C0;
  border-radius: 50%;
  animation: osc-radar-dot-pulse 3s ease-in-out infinite;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

@keyframes osc-radar-dot-pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 12px #00D9C0;
  }
  50% {
    opacity: 0.4;
    box-shadow: 0 0 4px #00D9C0;
  }
}

.osc-badge-text {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 11px;
  color: #00D9C0;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}
</style>
