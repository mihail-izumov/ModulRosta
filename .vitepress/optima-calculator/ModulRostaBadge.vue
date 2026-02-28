<script setup>
</script>

<template>
  <div class="badge-wrapper">
    <a href="https://runscale.ru" target="_blank" rel="noopener noreferrer" class="partner-badge">
      <div class="radar-scan"></div>
      <div class="radar-dot"></div>
      <span class="badge-text">Технологический партнёр | Модуль Роста®</span>
    </a>
  </div>
</template>

<style scoped>
.badge-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  margin-bottom: 24px;
}

.partner-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border: 1px solid #00D9C0;
  border-radius: 8px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  animation: radar-glow 3s ease-in-out infinite;
  cursor: pointer;
  transition: transform 0.2s;
}

.partner-badge:hover {
  transform: translateY(-2px);
}

@keyframes radar-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 217, 192, 0.3), 0 0 20px rgba(0, 217, 192, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 217, 192, 0.6), 0 0 40px rgba(0, 217, 192, 0.3);
  }
}

.radar-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 217, 192, 0.2), transparent);
  animation: radar-scan 4s linear infinite;
}

@keyframes radar-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.radar-dot {
  width: 8px;
  height: 8px;
  background: #00D9C0;
  border-radius: 50%;
  animation: radar-dot-pulse 3s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes radar-dot-pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 12px #00D9C0;
  }
  50% {
    opacity: 0.4;
    box-shadow: 0 0 4px #00D9C0;
  }
}

.badge-text {
  font-family: monospace;
  font-size: 11px;
  color: #00D9C0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
