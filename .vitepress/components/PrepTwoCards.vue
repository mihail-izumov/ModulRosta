<template>
  <div class="user-coffee-cards-container">
    <div class="user-coffee-card">
      <div class="user-card-content">
        <h3 class="user-card-title">5-дневный план подготовки</h3>
        <p class="user-card-description">
          <strong>Ваши отзывы меняют всё.</strong>
        </p>
        <p class="user-card-highlight">
          Карта подготовки к работе с нами. Изучите их, чтобы понять, как мы работаем, и приходите на чекап готовыми к быстрым изменениям.
        </p>
      </div>
      <a href="/checkup/prep/overview.html" class="user-card-button">
        <strong>Отправить ⚡ Сигнал</strong>
      </button>
    </div>
    
    <div class="user-coffee-card">
      <div class="user-card-content">
        <h3 class="user-card-title">Для Бизнеса</h3>
        <p class="user-card-description">
          <strong>Подготовьтесь к чекапу за 5 дней: лёгкий старт к системному росту</strong>
        </p>
        <p class="user-card-highlight">
          Вот простой 5-дневный план подготовки, который даст ключевое ощущение нашего подхода и создаст почву для серьёзных изменений.
        </p>
      </div>
      <a href="/checkup/checklist" class="user-card-button">
        <strong>Чек-лист подготовки к чекапу →</strong>
      </a>
    </div>
  </div>
</template>

<script setup>
const openModal = () => {
  if (window.openSignalModal) {
    window.openSignalModal()
  } else {
    console.error('Modal function not available')
  }
}
</script>

<style scoped>
.user-coffee-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.user-coffee-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
}

.user-coffee-card:hover {
  border-color: #c5f946;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(197, 249, 70, 0.15);
}

.user-card-content {
  flex: 1;
  margin-bottom: 1.5rem;
}

.user-card-title {
  color: #c5f946 !important;
  margin: 0 0 1.2rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.3;
}

.user-card-description {
  margin: 0 0 1.2rem 0;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  font-size: 1.05rem;
}

.user-card-highlight {
  margin: 0;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  font-size: 1.05rem;
}

.user-card-button {
  background: #c5f946;
  color: #1a1a1a !important;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  margin-top: auto;
  display: block;
  width: 100%;
}

.user-card-button:hover {
  background: #b8e63f;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(197, 249, 70, 0.3);
}

.user-card-button:active {
  transform: translateY(0);
}

/* Светлая тема */
:root:not(.dark) .user-coffee-card {
  background: #f6f6f7;
  border: 2px solid transparent;
}

:root:not(.dark) .user-coffee-card:hover {
  border-color: #c5f946;
}

:root:not(.dark) .user-card-title {
  color: #2d5016 !important;
}

:root:not(.dark) .user-card-button {
  background: #2d5016;
  color: #ffffff !important;
}

:root:not(.dark) .user-card-button:hover {
  background: #1f3a0f;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .user-coffee-cards-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  
  .user-coffee-card {
    padding: 24px;
  }
  
  .user-card-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .user-card-description,
  .user-card-highlight {
    font-size: 1rem;
  }
  
  .user-card-button {
    padding: 16px 24px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .user-coffee-cards-container {
    margin: 1rem 0;
  }
  
  .user-coffee-card {
    padding: 20px;
  }
  
  .user-card-title {
    font-size: 1.2rem;
  }
  
  .user-card-description,
  .user-card-highlight {
    font-size: 0.95rem;
  }
  
  .user-card-button {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
}
</style>
