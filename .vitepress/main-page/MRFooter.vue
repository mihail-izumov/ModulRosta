<template>
  <footer class="mr-footer">
    <div class="mr-footer-brand">Расти по своим правилам</div>
    
    <div class="mr-footer-links">
      <a href="https://t.me/runScale" target="_blank">Телеграм: @runScale</a>
      <a href="mailto:hello@runscale.ru">hello@runscale.ru</a>
      <a href="/journal/contents/overview">Журнал</a>
    </div>
    
    <p class="mr-footer-copy">© 2026 Модуль Роста®</p>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>

<style scoped>
.mr-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 60px 24px;
  text-align: center;
}

.mr-footer-brand {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
  letter-spacing: 1px;
}

.mr-footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.mr-footer-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.3s ease;
}

.mr-footer-links a:hover {
  color: var(--vp-c-brand-1);
}

.mr-footer-copy {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
