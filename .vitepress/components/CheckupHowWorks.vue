<template>
  <div class="features-container-pro">
    <div 
      v-for="(card, index) in cards" 
      :key="card.title" 
      class="feature-card-pro"
    >
      <div class="card-image-wrapper">
        <img :src="card.imgSrc" :alt="card.imgAlt" class="card-image">
      </div>
      <div class="card-content">
        <h3>{{ card.title }}</h3>
        <p v-if="index === 0">{{ descriptionWithMonth }}</p>
        <p v-else>{{ card.description }}</p>
        <a
          v-if="index === 0"
          href="/apply"
          class="card-link-custom"
        >
          Подать заявку <br>на Чекап
          <span class="arrow-icon-custom" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const MONTHS = [
  'Январе', 'Феврале', 'Марте', 'Апреле', 'Мае', 'Июне',
  'Июле', 'Августе', 'Сентябре', 'Октябре', 'Ноябре', 'Декабре'
];
const nowMonth = MONTHS[new Date().getMonth()];

const cards = [
  {
    title: 'Показываем, где именно нужно действовать',
    // description заменить ниже!
    description: '', 
    imgSrc: '/checkup-ban-1.jpg',
    imgAlt: 'Показываем, где именно нужно действовать'
  },
  {
    title: 'Запускаем изменения, пока другие готовят отчёты',
    description: 'Быстро и точно против долго и сложно — как GPT против классического поиска: вместо сотен ссылок получаете готовый ответ.',
    imgSrc: '/checkup-ban-2.jpg',
    imgAlt: 'Запускаем изменения, пока другие готовят отчёты'
  },
  {
    title: 'Платите за движение, а не за презентации',
    description: 'Если за 30 дней не запустили 3 реальных улучшения — продолжаем бесплатно.',
    imgSrc: '/checkup-ban-3.jpg',
    imgAlt: 'Платите за движение, а не за презентации'
  }
];

// Формируем автоматическую подстановку названия месяца для первой карточки
const descriptionWithMonth = `Результаты Чекапа в ${nowMonth}. Не гадаем по симптомам, а получаем объективную картину всех 10 разделов бизнеса за месяц.`;
</script>

<style scoped>
.features-container-pro {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 16px !important;
  margin: 32px 0 !important;
}
.feature-card-pro {
  background-color: #f6f6f7 !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  border: none !important;
}
:root.dark .feature-card-pro {
  background-color: var(--vp-c-bg-soft) !important;
}
.card-image-wrapper {
  width: 100% !important;
  aspect-ratio: 16 / 9 !important;
  background-color: #e0e0e0 !important;
}
:root.dark .card-image-wrapper {
    background-color: #2c2c2f !important;
}
.card-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}
.card-content {
  padding: 16px 20px 24px !important;
  flex-grow: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  text-align: left !important;
}

/* Межстрочное расстояние title и увеличенный отступ вниз */
.feature-card-pro h3 {
  color: var(--vp-c-text-1) !important;
  font-size: 17px !important;
  line-height: 1.2 !important;
  margin-top: 0 !important;
  margin-bottom: 14px !important;
  font-weight: 600 !important;
}

/* Описание */
.feature-card-pro p {
  color: var(--vp-c-text-2) !important; 
  font-size: 13px !important;
  line-height: 1.54 !important;
  margin: 0 !important;
  flex-grow: 1 !important;
}

.card-link-custom {
  display: inline-block !important;
  text-align: left !important;
  margin-top: 18px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  color: #c5f946 !important;
  text-decoration: none !important;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  letter-spacing: normal !important;
  padding: 0 !important;
  position: relative !important;
  z-index: 2 !important;
  cursor: pointer !important;
}
.card-link-custom br {
  display: block !important;
  content: "" !important;
  margin-bottom: -4px !important;
}
.arrow-icon-custom {
  display: inline-block !important;
  vertical-align: middle !important;
  transition: transform 0.22s cubic-bezier(.4,0,.2,1) !important;
  margin-left: 7px !important;
}
.card-link-custom:hover .arrow-icon-custom,
.card-link-custom:focus .arrow-icon-custom {
  transform: translateX(8px) !important;
}
.arrow-icon-custom svg {
  stroke: #c5f946 !important;
  display: block !important;
}
@media (max-width: 768px) {
  .features-container-pro {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
}
</style>
