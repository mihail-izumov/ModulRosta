<template>
  <div class="pricing-grid">
    <!-- КАРТОЧКА 1: СИМУЛЯТОР -->
    <div class="pricing-card">
      <h3 class="card-title card-title--simulator">СИМУЛЯТОР</h3>
      <p class="card-subtitle">Где конкуренты зарабатывают ваши деньги</p>
      <div class="card-image-wrapper">
        <!-- Убедитесь, что путь к изображению верный -->
        <img
          src="/sim-ban.svg"
          alt="Симулятор"
          class="card-image"
        />
      </div>
      <div class="card-price">
        <strong>Кофейни Самары</strong>
        <div class="payment-type">Аналитика и разборы</div>
      </div>
      <ul class="feature-list">
        <li class="feature-item"><CheckIcon /><span>29,600+ уникальных отзывов</span></li>
        <li class="feature-item"><CheckIcon /><span>20 готовых диалогов</span></li>
        <li class="feature-item"><CheckIcon /><span>Мгновенный доступ к инсайтам</span></li>
        <li class="feature-item"><CheckIcon /><span>ИИ-ассистент Анна</span></li>
      </ul>
      <a href="https://cffx.ru/invest/sim" class="card-button card-button--secondary" target="_blank">
        Тест-драйв
      </a>
    </div>

    <!-- КАРТОЧКА 2: ИНДЕКС РОСТА -->
    <div class="pricing-card pricing-card--featured">
      <h3 class="card-title card-title--insider">ИНДЕКС РОСТА</h3>
      <p class="card-subtitle">Находим то, что не видят другие</p>
      <div class="card-image-wrapper">
        <!-- Я оставил старое изображение, но возможно, вы захотите его поменять на что-то связанное с калькулятором -->
        <img
          src="/calc-ban.svg" 
          alt="Калькулятор"
          class="card-image"
        />
      </div>
      <div class="card-price">
        <strong>ТОП-50 кофеен</strong>
        <div class="payment-type">Самара → Сигнал</div>
      </div>
      <p class="includes-all"><strong>Потенциал роста:</strong></p>
      <ul class="feature-list">
        <li class="feature-item"><CheckIcon /><span>↑ Выручка ₽/год</span></li>
        <li class="feature-item"><CheckIcon /><span>Время на захват X/мес.</span></li>
        <li class="feature-item"><CheckIcon /><span>Целевые конкуренты</span></li>
      </ul>
      <a href="https://cffx.ru/invest/smr.html" class="card-button" target="_blank">Смотреть Индекс</a>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

/* Простая SVG-галочка */
const CheckIcon = () =>
  h(
    'svg',
    {
      class: 'checkmark-icon',
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    [
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01' })
    ]
  )
</script>

<style scoped>
/* СЕТКА ------------------------------------------------------------------- */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

/* КАРТОЧКИ ---------------------------------------------------------------- */
.pricing-card {
  background: #2d2d30;
  border: 2px solid #444;
  border-radius: 18px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-6px);
  border-color: #c5f946;
  box-shadow: 0 12px 35px rgba(197, 249, 70, 0.15);
  background: #353538;
}

/* Выделяем вторую карточку зелёной рамкой */
.pricing-card--featured {
  border-color: #c5f946;
}

/* ЗАГОЛОВКИ --------------------------------------------------------------- */
.card-title {
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.25em;
  margin: 0 0 8px 0;
  color: #fff;
  border: none;
  text-transform: uppercase;
}

.card-title--insider { font-size: 1.38rem; } 
.card-title--simulator { font-size: 1.38rem; }

/* ПОДЗАГОЛОВОК ------------------------------------------------------------ */
.card-subtitle {
  font-size: 1.125rem;
  color: #c0c0c0;
  text-align: center;
  margin: 0 0 32px 0;
  line-height: 1.4;
  font-weight: 400;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
  min-height: 50px; /* Добавил минимальную высоту для выравнивания */
}

/* ИЗОБРАЖЕНИЕ ------------------------------------------------------------- */
.card-image-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 22px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ЦЕНА -------------------------------------------------------------------- */
.card-price {
  text-align: center;
  margin-bottom: 24px;
}

.card-price strong {
  font-weight: 600;
  font-size: 1.425rem;
  color: #fff;
  display: block;
}

.payment-type {
  font-size: 0.925rem;
  color: #a8a8a8;
  margin-top: 4px;
}

/* ДОПОЛНИТЕЛЬНЫЙ ТЕКСТ ---------------------------------------------------- */
.includes-all {
  font-size: 1.025rem;
  color: #a8a8a8;
  margin: 0 0 16px 4px;
}

/* СПИСОК ------------------------------------------------------------------ */
.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.938rem;
  line-height: 1.2;
  color: #e0e0e0;
}

.checkmark-icon {
  width: 18px;
  height: 18px;
  color: #c5f946;
  flex-shrink: 0;
}

/* КНОПКИ ------------------------------------------------------------------ */
.card-button {
  margin-top: 48px;
  display: block;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 1.065rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: all 0.25s ease;
  border: 2px solid #c5f946;
  box-sizing: border-box;
}

.card-button {
  background: #c5f946;
  color: #000;
}

.card-button:hover {
  background: #fff;
  border-color: #fff;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
}

/* «СИМУЛЯТОР» — вторичная кнопка */
.card-button--secondary {
  background: transparent;
  color: #c5f946;
}

.card-button--secondary:hover {
  background: #c5f946;
  color: #000;
}

/* МОБИЛЬНАЯ ВЕРСИЯ -------------------------------------------------------- */
@media (max-width: 768px) {
  .feature-item {
    font-size: 1.125rem !important;
    line-height: 1.4 !important;
  }
  .checkmark-icon {
    width: 20px !important;
    height: 20px !important;
  }
  .pricing-card {
    padding: 32px 20px !important;
  }
  .card-subtitle {
    font-size: 1.125rem !important;
    max-width: none !important;
    min-height: auto; /* Сбрасываем высоту на мобильных */
  }
}
@media (max-width: 480px) {
  .feature-item {
    font-size: 1.075rem !important;
    line-height: 1.35 !important;
  }
}
</style>
