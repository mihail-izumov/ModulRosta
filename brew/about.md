# 123

<script setup>
import { ref } from 'vue'
// Устанавливаем первую вкладку активной по умолчанию
const activeTab = ref('problem')
</script>

<!-- Блок с кнопками для переключения вкладок -->
<div class="tabs">
  <button :class="{ active: activeTab === 'problem' }" @click="activeTab = 'problem'">
    🎯 Исправить проблему
  </button>
  <button :class="{ active: activeTab === 'advantage' }" @click="activeTab = 'advantage'">
    💪 Усилить преимущество
  </button>
  <button :class="{ active: activeTab === 'competitors' }" @click="activeTab = 'competitors'">
    🗺️ Изучить конкурентов
  </button>
  <button :class="{ active: activeTab === 'growth' }" @click="activeTab = 'growth'">
    🚀 Найти рост
  </button>
</div>

<!-- Контент для вкладок -->
<div class="tab-content">

  <!-- Вкладка 1: Исправить проблему -->
  <div v-if="activeTab === 'problem'">
    <p><strong>Превратите жалобы клиентов в точки кратного роста.</strong> Система вскрывает проблемы, которые прямо сейчас забирают ваши деньги, и показывает, как их решить.</p>
    <table class="custom-table">
      <thead>
        <tr>
          <th>Диалог с Сигналом</th>
          <th>Какую задачу вы решаете</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Как увеличить скорость в 2 раза →</strong></td>
          <td>Устраняете потерю выручки в часы пик, анализируя причины очередей (31% жалоб в кейсе).</td>
        </tr>
        <tr>
          <td><strong>Как стандартизировать качество →</strong></td>
          <td>Преодолеваете «плавающее» качество кофе (18% критики в кейсе), создавая доверие к бренду.</td>
        </tr>
        <tr>
          <td><strong>Как найти правильную цену →</strong></td>
          <td>Решаете ценовую дилемму, когда часть клиентов считает цены высокими (37% в кейсе).</td>
        </tr>
      </tbody>
    </table>
    <p class="visual-element-note"><em>Визуальный элемент: Анимация, где красная зона графика (жалобы на скорость) превращается в зеленую (рост выручки).</em></p>
  </div>

  <!-- Вкладка 2: Усилить преимущество -->
  <div v-if="activeTab === 'advantage'">
    <p><strong>Деконструируйте «магию» лидеров и сделайте ее своей технологией.</strong> Поймите, за счет чего побеждают лучшие, и заберите их приемы в свой арсенал.</p>
    <table class="custom-table">
      <thead>
        <tr>
          <th>Диалог с Сигналом</th>
          <th>Какую задачу вы решаете</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Как масштабировать уют →</strong></td>
          <td>Превращаете интуитивную «атмосферу» в четкий чек-лист для новых точек, создавая эмоциональную связь.</td>
        </tr>
        <tr>
          <td><strong>Как построить систему →</strong></td>
          <td>Внедряете системный подход к продукту, обеспечивая эталонную стабильность и предсказуемость.</td>
        </tr>
        <tr>
          <td><strong>Как создать культ бренда →</strong></td>
          <td>Строите «племя» вокруг своего бренда, отстраиваясь от массового рынка через нишевый брендинг.</td>
        </tr>
      </tbody>
    </table>
    <p class="visual-element-note"><em>Визуальный элемент: Слева — разбор «атмосферы» на составляющие (свет, музыка, сервис). Справа — готовый чек-лист.</em></p>
  </div>

  <!-- Вкладка 3: Изучить конкурентов -->
  <div v-if="activeTab === 'competitors'">
    <p><strong>Получите объективную карту рынка, чтобы найти на ней свое уникальное место.</strong> Перестаньте сравнивать себя с другими интуитивно. Увидьте реальную расстановку сил.</p>
    <table class="custom-table">
      <thead>
        <tr>
          <th>Диалог с Сигналом</th>
          <th>Какую задачу вы решаете</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Сравнить по качеству кофе →</strong></td>
          <td>Видите, кто из игроков — реальный лидер по продукту (оценка 9/10), а кто только кажется таковым.</td>
        </tr>
        <tr>
          <td><strong>Сравнить по атмосфере и сервису →</strong></td>
          <td>Понимаете, кто выигрывает в «экономике впечатлений» и за счет каких именно элементов.</td>
        </tr>
        <tr>
          <td><strong>Сравнить по скорости и цене →</strong></td>
          <td>Определяете свою стратегию: конкурировать по эффективности операций или по ценовому позиционированию.</td>
        </tr>
      </tbody>
    </table>
    <p class="visual-element-note"><em>Визуальный элемент: Динамическая карта, где логотипы кофеен (обезличенные иконки) двигаются по осям «Эмоции vs Система» и «Цена vs Качество».</em></p>
  </div>

  <!-- Вкладка 4: Найти рост -->
  <div v-if="activeTab === 'growth'">
    <p><strong>Обнаружьте скрытые источники дохода в вашем текущем бизнесе.</strong> Данные показывают неочевидные возможности, которые лежат прямо перед вами.</p>
    <table class="custom-table">
      <thead>
        <tr>
          <th>Диалог с Сигналом</th>
          <th>Какую задачу вы решаете</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Монетизация УТП →</strong></td>
          <td>Превращаете ваш лучший продукт (например, выпечку) из приятного бонуса в мощный генератор прибыли.</td>
        </tr>
        <tr>
          <td><strong>B2B-возможности →</strong></td>
          <td>Запускаете новые продукты для бизнеса (например, «кофейня как офис»), используя уже существующие активы.</td>
        </tr>
        <tr>
          <td><strong>Региональная экспансия →</strong></td>
          <td>Используете анализ одного города как модель для системного и предсказуемого входа на любой другой рынок.</td>
        </tr>
      </tbody>
    </table>
    <p class="visual-element-note"><em>Визуальный элемент: Из иконки кофейни вырастают новые ветки: «B2B», «Доставка», «Франшиза».</em></p>
  </div>
</div>

## FAQ

::: details Что такое BREW?
Это мета-франшиза — открытая платформа и бизнес-симулятор для владельцев кофеен. Она дает вам инструменты и данные, чтобы строить и масштабировать бизнес по своим правилам, а не по чужим лекалам.
:::

::: details Как работает «бизнес-симулятор»?
Вы получаете доступ к **Сигналам Радара** — глубокому анализу рынков разных городов (пока доступна Самара). Через **Диалоги с Сигналом** вы можете «проиграть» разные сценарии: как бы ваша модель работала там? Что нужно усилить? Это репетиция вашего роста на чужом опыте.
:::

::: details Что такое Кофейный Протокол?
Это технологическое ядро BREW. Открытая, постоянно обновляемая база знаний о кофейном рынке РФ, с которой можно вести диалог. Это ваш «центр правды», который питает все Сигналы Радара.
:::

::: details Это бесплатно?
Фундамент системы — **Кофейный Протокол** и демо-версия **Сигнала Радара** по Самаре — открыты для всех. Это наш вклад в развитие рынка. Персональный стратегический разбор и доступ к закрытым данным — это следующий шаг для тех, кто готов к партнерству с **Модулем Роста®**.
:::

## Ваша Умная Кофейня. Начинается Здесь.

**Новый способ строить и масштабировать кофейный бизнес.**

**[Начать диалог с Анной →](https://t.me/Anna_runScale)**


<style>
/* --- ОБЩИЕ СТИЛИ ДЛЯ ПЕРЕКЛЮЧАТЕЛЕЙ (ТЭБОВ) --- */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0 1rem;
}

.tabs button {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

/* --- СТИЛИ ДЛЯ СВЕТЛОЙ ТЕМЫ (ПО УМОЛЧАНИЮ) --- */
:root {
  --tabs-button-bg: #f2f2f2;
  --tabs-button-text: #333;
  --tabs-button-border: #e2e2e2;
}
.tabs button {
  background-color: var(--tabs-button-bg);
  color: var(--tabs-button-text);
  border-color: var(--tabs-button-border);
}

/* --- СТИЛИ ДЛЯ ТЕМНОЙ ТЕМЫ --- */
:root.dark {
  --tabs-button-bg: #2a2a2a;
  --tabs-button-text: #adadad;
  --tabs-button-border: #444;
}

/* --- СТИЛИ ДЛЯ АКТИВНОЙ/HOVER КНОПКИ (УНИВЕРСАЛЬНЫЕ) --- */
.tabs button:hover,
.tabs button.active {
  background-color: #C5F946 !important;
  color: #1a2a00 !important;
  border-color: #C5F946 !important;
  font-weight: 700;
  transform: translateY(-2px);
}

.tabs button.active {
  transform: none;
}

/* --- СТИЛИ ДЛЯ КОНТЕНТА --- */
.tab-content {
  padding: 1.25rem;
  border-radius: 12px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
}

.tab-content p {
  margin: 0 0 1rem;
}

.tab-content p:last-of-type {
  margin-bottom: 0;
}

.visual-element-note {
  margin-top: 1rem;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

/* Стили для таблицы */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.custom-table th, .custom-table td {
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.custom-table th {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.custom-table td {
  color: var(--vp-c-text-2);
}

.custom-table tr:last-child td {
  border-bottom: none;
}
</style>
