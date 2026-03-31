<template>
  <div class="mr-radar-wrapper">
    <div class="mr-radar-badge">
      <svg class="mr-radar-hexagon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
      <span class="mr-radar-text">Цифровые модульные системы</span>
    </div>
  </div>
</template>

<style scoped>
.mr-radar-wrapper {
  padding: 0;
  margin: 0 0 64px 0;
  display: flex;
  justify-content: center;
  background: transparent;
}

.mr-radar-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border: 1px solid rgb(0, 255, 136);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  animation: mr-radar-glow 3s ease-in-out infinite;
}

@keyframes mr-radar-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 136, 0.3), 0 0 20px rgba(0, 255, 136, 0.1); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.6), 0 0 40px rgba(0, 255, 136, 0.3); }
}

.mr-radar-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.2), transparent);
  animation: mr-radar-scan 4s linear infinite;
}

@keyframes mr-radar-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.mr-radar-hexagon {
  color: rgb(0, 255, 136);
  flex-shrink: 0;
  animation: mr-radar-spin 8s linear infinite;
  filter: drop-shadow(0 0 6px rgb(0, 255, 136));
}

@keyframes mr-radar-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mr-radar-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgb(0, 255, 136);
  text-transform: uppercase;
  letter-spacing: 2px;
}
</style>
