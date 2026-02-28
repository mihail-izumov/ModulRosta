<script setup>
import { ref, computed, markRaw } from 'vue'
import { Wallet, ScrollText, Cog, TriangleAlert, DoorOpen, ChevronRight } from './icons.js'
import { OPTIMA_SPACE } from './constants.js'
import { formatCurrency } from './utils.js'

const props = defineProps({
  totalCapital: { type: Number, required: true },
  allocations: { type: Object, required: true },
  optimaInvestment: { type: Number, required: true },
  portfolioMetrics: { type: Object, required: true }
})

const activeCategory = ref('financial')
const openQuestion = ref(null)

const shares = computed(() => Math.floor(props.optimaInvestment / 500))
const monthlyDiv = computed(() => props.optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) / 12)

const categories = [
  { id: 'financial', name: 'Финансы', icon: markRaw(Wallet) },
  { id: 'legal', name: 'Юридическое', icon: markRaw(ScrollText) },
  { id: 'operational', name: 'Операционное', icon: markRaw(Cog) },
  { id: 'risks', name: 'Риски', icon: markRaw(TriangleAlert) },
  { id: 'exit', name: 'Выход', icon: markRaw(DoorOpen) },
]

const questions = computed(() => ({
  financial: [
    { q: `Откуда доходность 38%?`, a: `Бизнес-модель: аренда ${OPTIMA_SPACE.area} кв.м по ${OPTIMA_SPACE.rentPerSqm}₽/кв.м, сдача по ~6000₽/кв.м. При загрузке 90% прибыль ${formatCurrency(OPTIMA_SPACE.monthlyProfit)}/мес.` },
    { q: `Мой доход с ${formatCurrency(props.optimaInvestment)}?`, a: props.optimaInvestment >= 600000 ? `${shares.value.toLocaleString()} акций. Дивиденд: ~${formatCurrency(monthlyDiv.value)}/мес. Окупаемость 29 мес. За 4,5 года: ~${formatCurrency(props.optimaInvestment * 0.38 * 4.5)}.` : `Минимальная инвестиция — 600 000₽.` },
    { q: 'Распределение прибыли?', a: `100% на дивиденды до окупаемости (29 мес), затем 44% на привилегированные акции.` },
    ...(props.portfolioMetrics.yield < 20 ? [{ q: `Как достичь 20%+?`, a: `Сейчас ${props.portfolioMetrics.yield.toFixed(1)}%. Добавьте Optima до 20-25%.` }] : [])
  ],
  legal: [
    { q: 'Какие документы?', a: `Договор купли-продажи, выписка ВТБ Регистратор, опционный договор, акционерное соглашение.` },
    { q: 'Права миноритария?', a: `Голос по ключевым вопросам, обязательный выкуп при <100% за 4 года, преимущественное право.` },
    { q: 'Юрисдикция?', a: `АО "Оптима" РФ (Самара). ФЗ "Об АО". Арбитражный суд Самарской области.` },
  ],
  operational: [
    { q: 'Кто управляет?', a: `УК 15+ лет опыта. ${OPTIMA_SPACE.team.map(t => t.name).join(', ')}.` },
    { q: 'Отчётность?', a: `Ежемесячно: план-факт. Ежеквартально: бухгалтерская. Telegram, онлайн-встречи.` },
    { q: 'Арендаторы?', a: `Pipeline 700+ мест. Корпоративные клиенты, долгосрочные договоры.` },
  ],
  risks: [
    { q: 'Загрузка ниже 90%?', a: `При 70% — ~22%. При 50% — ~12%. Есть сдача без сервиса (8-10%).` },
    { q: 'Проект не запустится?', a: `Опцион: 1000₽ − дивиденды (мин 500₽). Залог ${OPTIMA_SPACE.collateral} кв.м.` },
    ...(props.allocations.optima > 20 ? [{ q: `${props.allocations.optima}% много?`, a: `Рекомендация 15-20%. Обратный выкуп компенсирует концентрацию.` }] : [])
  ],
  exit: [
    { q: 'Выйти раньше?', a: `Продажа инвесторам, раунды по высокой цене, дивиденды (окупаемость 29 мес).` },
    { q: 'Ограничения продажи?', a: `В любое время. Преимущественное право 30 дней.` },
    { q: 'Частичная продажа?', a: `Да, любое количество. Минимума нет.` },
  ],
}))

const handleQuestionClick = (categoryId, index) => {
  const key = `${categoryId}-${index}`
  openQuestion.value = openQuestion.value === key ? null : key
}

const handleCategoryChange = (catId) => {
  activeCategory.value = catId
  openQuestion.value = null
}
</script>

<template>
  <section class="osc-qa-module">
    <div class="osc-qa-header">
      <span class="osc-qa-num">5</span>
      <span class="osc-qa-title">Вопросы инвестора</span>
    </div>
    
    <div class="osc-qa-layout">
      <div class="osc-qa-categories">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="osc-qa-cat-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="handleCategoryChange(cat.id)"
        >
          <component :is="cat.icon" :size="16" class="osc-cat-icon" />
          <span class="osc-cat-name">{{ cat.name }}</span>
          <span class="osc-cat-count">{{ questions[cat.id]?.length || 0 }}</span>
        </button>
      </div>
      
      <div class="osc-qa-questions">
        <div v-for="(item, i) in questions[activeCategory]" :key="i" class="osc-qa-item">
          <div class="osc-qa-question" @click="handleQuestionClick(activeCategory, i)">
            <ChevronRight :size="18" class="osc-qa-arrow" :class="{ open: openQuestion === `${activeCategory}-${i}` }" />
            {{ item.q }}
          </div>
          <Transition name="osc-answer">
            <p v-if="openQuestion === `${activeCategory}-${i}`" class="osc-qa-answer">{{ item.a }}</p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.osc-qa-module {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.osc-qa-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.osc-qa-num {
  background: #00D9C0;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.osc-qa-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  line-height: 28px;
}

.osc-qa-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.osc-qa-categories {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.osc-qa-cat-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  color: #aaa;
}

.osc-qa-cat-btn:hover { background: rgba(255,255,255,0.03); }
.osc-qa-cat-btn.active { background: rgba(0,217,192,0.15); border-left-color: #00D9C0; }

.osc-cat-icon { flex-shrink: 0; opacity: 0.7; }
.osc-qa-cat-btn.active .osc-cat-icon { color: #00D9C0; opacity: 1; }

.osc-cat-name { flex: 1; font-size: 13px; transition: color 0.2s; }
.osc-qa-cat-btn.active .osc-cat-name { color: #00D9C0; font-weight: 600; }
.osc-cat-count { font-size: 11px; color: #777; }

.osc-qa-questions { max-height: 400px; overflow-y: auto; padding-right: 8px; }
.osc-qa-questions::-webkit-scrollbar { width: 4px; }
.osc-qa-questions::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
.osc-qa-questions::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

.osc-qa-item { margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; }

.osc-qa-question {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  padding: 10px 0;
  cursor: pointer;
  transition: color 0.2s;
}
.osc-qa-question:hover { color: #00D9C0; }

.osc-qa-arrow { color: #00D9C0; flex-shrink: 0; transition: transform 0.2s; }
.osc-qa-arrow.open { transform: rotate(90deg); }
.osc-qa-answer { font-size: 13px; color: #aaa; line-height: 1.7; margin: 8px 0 0; padding-left: 28px; }

.osc-answer-enter-active, .osc-answer-leave-active { transition: all 0.2s ease; }
.osc-answer-enter-from, .osc-answer-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 768px) {
  .osc-qa-layout { grid-template-columns: 1fr; }
  .osc-qa-categories { flex-direction: row; flex-wrap: wrap; gap: 8px; }
  .osc-qa-cat-btn { border-left: none; border-bottom: 2px solid transparent; border-radius: 8px; padding: 10px 14px; }
  .osc-qa-cat-btn.active { border-bottom-color: #00D9C0; }
}
</style>
