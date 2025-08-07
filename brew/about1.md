# 123

---

<script setup>
import { ref } from 'vue'

const activeTab = ref('problem')

const tabs = [
  {
    id: 'problem',
    label: '🎯 Исправить проблему',
    title: 'Превратите жалобы клиентов в точки кратного роста.',
    data: [
      {
        dialog: 'Увеличить скорость обслуживания',
        task: 'Устраняете потерю выручки в самые прибыльные часы.',
        example: '31% жалоб на медлительность — системная проблема распределения персонала в пики.'
      },
      {
        dialog: 'Стабилизировать продукт',
        task: 'Преодолеваете «плавающее» качество, разрушающее доверие.',
        example: '«Корж» страдал от нестабильного кофе (18% критики). Нужны стандарты, как у Skuratov.'
      },
      {
        dialog: 'Найти правильную цену',
        task: 'Решаете дилемму «дорого vs справедливо».',
        example: '37% считают «Корж» дорогим. Требуется гибкая стратегия для разных сегментов.'
      }
    ],
    result: 'Мгновенная диагностика того, что забирает ваши деньги прямо сейчас.'
  },
  {
    id: 'advantage',
    label: '💪 Усилить преимущество',
    title: 'Превратите магию в технологию.',
    data: [
      {
        dialog: 'Масштабировать атмосферу',
        task: 'Превращаете неуловимый «уют» в воспроизводимый чек-лист.',
        example: '«Корж» — лидер по атмосфере (9/10). Декомпозиция от тактичности персонала до дизайна.'
      },
      {
        dialog: 'Построить систему',
        task: 'Внедряете процессы для предсказуемого качества.',
        example: 'Skuratov — эталон системности (9/10 кофе). Строгие стандарты плюс стабильность.'
      },
      {
        dialog: 'Создать культ бренда',
        task: 'Строите преданное «племя» через уникальную эстетику.',
        example: 'Surf Coffee — культ «серф-вайба». Не для всех, но с невероятной лояльностью ядра.'
      }
    ],
    result: 'Деконструируете чужие успехи. Делаете интуицию управляемой.'
  },
  {
    id: 'competitors',
    label: '🔍 Изучить конкурентов',
    title: 'Получить объективную карту поля боя.',
    data: [
      {
        dialog: 'Реальный лидер по продукту',
        task: 'Видите, кто действительно выигрывает, а кто создает видимость.',
        example: 'Skuratov — объективный лидер по качеству кофе (9/10) vs атмосферные лидеры.'
      },
      {
        dialog: 'Экономика впечатлений',
        task: 'Понимаете, кто побеждает за эмоции и за счет чего.',
        example: '«Корж», Surf, White Cup делят лидерство по атмосфере, но разными путями.'
      },
      {
        dialog: 'Цена и скорость',
        task: 'Определяете стратегию: эффективность или премиальность.',
        example: 'Coffee Balance — лидер по цене/качеству (8/10), жертвуя другими параметрами.'
      }
    ],
    result: 'Конец «туману войны». Четкое понимание, где вы и куда двигаться.'
  },
  {
    id: 'growth',
    label: '🚀 Найти рост',
    title: 'Обнаружить скрытые сокровища.',
    data: [
      {
        dialog: 'Монетизировать главное УТП',
        task: 'Превращаете лучший продукт в генератор прибыли.',
        example: 'Выпечка «Коржа» (9/10) — недоиспользованная суперсила для роста среднего чека.'
      },
      {
        dialog: 'Найти новые ниши',
        task: 'Находите сегменты для обслуживания существующими активами.',
        example: 'Готовый сегмент «цифровых кочевников» = B2B-продукт «кофейня как офис».'
      },
      {
        dialog: 'Подготовиться к экспансии',
        task: 'Используете один город как модель для системного входа в другие.',
        example: 'Самарский кейс — типичная структура для десятков городов России.'
      }
    ],
    result: 'Новые источники дохода без огромных инвестиций.'
  }
]

const currentTab = computed(() => {
  return tabs.find(tab => tab.id === activeTab.value)
})
</script>

<ClientOnly>
  <div class="custom-tabs">
    <div class="tabs-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="tab-content">
      <p><strong>{{ currentTab.title }}</strong></p>
      
      <table class="custom-table">
        <thead>
          <tr>
            <th>Диалог с Сигналом</th>
            <th>Какую задачу решаете</th>
            <th>Пример из Самары</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in currentTab.data" :key="row.dialog">
            <td><strong>{{ row.dialog }}</strong></td>
            <td>{{ row.task }}</td>
            <td>{{ row.example }}</td>
          </tr>
        </tbody>
      </table>
      
      <p><strong>Результат:</strong> {{ currentTab.result }}</p>
    </div>
  </div>
</ClientOnly>

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
.custom-tabs {
  margin: 1.5rem 0;
}

.tabs-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.tab-button:hover,
.tab-button.active {
  background-color: #C5F946 !important;
  color: #1a2a00 !important;
  border-color: #C5F946 !important;
  font-weight: 700;
  transform: translateY(-2px);
}

.tab-button.active {
  transform: none;
}

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
