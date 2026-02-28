<script setup>
</script>

<template>
  <div class="osc-partner-badge">
    <span class="osc-badge-label">Технологический партнёр</span>
    <a href="https://runscale.ru" target="_blank" class="osc-badge-link">
      Модуль Роста®
    </a>
  </div>
</template>

<style scoped>
.osc-partner-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  margin-top: 24px;
}

.osc-badge-label {
  font-size: 12px;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.osc-badge-link {
  padding: 8px 20px;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.osc-badge-link:hover {
  border-color: #00D9C0;
  color: #00D9C0;
  background: rgba(0,217,192,0.1);
}
</style>
