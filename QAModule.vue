<script setup>
import { ref, computed } from 'vue'
import { HelpCircle, ChevronDown, ChevronRight, Wallet, ScrollText, Cog, TriangleAlert, SquareArrowRight } from './icons.js'
import { OPTIMA_SPACE, QA_CATEGORIES, COLORS } from './constants.js'
import { formatCurrency } from './utils.js'

const props = defineProps({
  totalCapital: { type: Number, required: true },
  allocations: { type: Object, required: true },
  optimaInvestment: { type: Number, required: true },
  portfolioMetrics: { type: Object, required: true }
})

const activeCategory = ref('financial')
const expandedQuestion = ref(null) // Только один открытый

const categoryIcons = {
  financial: Wallet,
  legal: ScrollText,
  operational: Cog,
  risks: TriangleAlert,
  exit: SquareArrowRight
}

const questions = computed(() => ({
  financial: [
    { q: 'Откуда доходность 38%?', a: `Бизнес-модель «офис как сервис»: аренда помещения по ${formatCurrency(OPTIMA_SPACE.rentPerSqm * 12)}/кв.м/год, сдача рабочих мест по ~${formatCurrency(OPTIMA_SPACE.pricePerWorkplace * 12)}/место/год. При загрузке 90% чистая прибыль ${formatCurrency(OPTIMA_SPACE.monthlyProfit)}/месяц. Это распределяется среди акционеров.` },
    { q: 'Как распределяется прибыль?', a: `100% чистой прибыли распределяется на дивиденды до полной окупаемости (${OPTIMA_SPACE.paybackMonths} месяцев). После окупаемости — 44% на привилегированные акции. Выплаты ежеквартально.` },
    { q: 'Какая минимальная инвестиция?', a: `Минимальная сумма — ${formatCurrency(OPTIMA_SPACE.minInvestment)}. Это ${OPTIMA_SPACE.minInvestment / OPTIMA_SPACE.shareNominal} акций по ${OPTIMA_SPACE.shareNominal}₽ каждая.` }
  ],
  legal: [
    { q: 'Какие документы оформляются?', a: 'Договор купли-продажи акций, выписка из ВТБ Регистратора (подтверждение владения), опционный договор на обратный выкуп, акционерное соглашение. Все документы имеют юридическую силу.' },
    { q: 'Как защищены инвестиции?', a: `Залог ${OPTIMA_SPACE.collateral} кв.м недвижимости (~${formatCurrency(OPTIMA_SPACE.collateralValue)}). Опционный договор обязывает основателя выкупить акции через ${OPTIMA_SPACE.buybackMonths} месяцев по формуле: 1000₽ − дивиденды (минимум ${OPTIMA_SPACE.buybackMinPrice}₽).` },
    { q: 'Кто регистрирует акции?', a: 'ВТБ Регистратор — один из крупнейших регистраторов России. Вы получаете официальную выписку о владении акциями АО "Оптима".' }
  ],
  operational: [
    { q: 'Когда запуск проекта?', a: `Сдача здания — январь 2026. Ремонт и оснащение — 5 месяцев. Открытие Optima Space — ${new Date(OPTIMA_SPACE.launchDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}. Первые дивиденды — Q3 2026.` },
    { q: 'Кто управляет проектом?', a: `Команда основателей: ${OPTIMA_SPACE.team.map(t => `${t.name} (${t.role}, ${t.exp})`).join('; ')}.` },
    { q: 'Сколько рабочих мест?', a: `От ${OPTIMA_SPACE.workplaces.min} до ${OPTIMA_SPACE.workplaces.max} мест на площади ${OPTIMA_SPACE.area} кв.м. Ставка ${formatCurrency(OPTIMA_SPACE.pricePerWorkplace)}/месяц при 100% загрузке.` }
  ],
  risks: [
    { q: 'Что если загрузка ниже плана?', a: `При 70% загрузки — ROI ~22% годовых. При 50% — ~12%. В худшем случае вы получите ${OPTIMA_SPACE.buybackMinPrice}₽/акция через опцион (гарантированный минимум).` },
    { q: 'Риск превышения сметы?', a: 'Смета зафиксирована, работа через аукционы с проверенными поставщиками. Резерв на непредвиденные расходы заложен в бюджет.' },
    { q: 'Риск роста арендной ставки?', a: 'Договор аренды фиксирует ставку на 5 лет. Рост возможен только по индексу инфляции (ограничен договором).' }
  ],
  exit: [
    { q: 'Как выйти раньше срока?', a: `Варианты: 1) Продажа другим инвесторам (есть спрос на раунды 2-3); 2) Получение дивидендов (окупаемость за ${OPTIMA_SPACE.paybackMonths} мес); 3) Дождаться опциона через ${OPTIMA_SPACE.buybackMonths} мес.` },
    { q: 'Как работает обратный выкуп?', a: `Через ${OPTIMA_SPACE.buybackMonths} месяцев основатель обязан выкупить акции: ${OPTIMA_SPACE.buybackPrice}₽ − полученные дивиденды (минимум ${OPTIMA_SPACE.buybackMinPrice}₽). Гарантия — залог ${OPTIMA_SPACE.collateral} кв.м.` },
    { q: 'Можно ли продать акции на бирже?', a: 'Акции АО "Оптима" не торгуются на бирже. Продажа возможна напрямую другим инвесторам или через участие в следующих раундах.' }
  ]
}))

const toggleQuestion = (index) => {
  const key = `${activeCategory.value}-${index}`
  // Если кликнули на открытый — закрываем, иначе открываем новый
  expandedQuestion.value = expandedQuestion.value === key ? null : key
}

const isExpanded = (index) => {
  return expandedQuestion.value === `${activeCategory.value}-${index}`
}

// Сбрасываем при смене категории
const setCategory = (cat) => {
  activeCategory.value = cat
  expandedQuestion.value = null
}
</script>

<template>
  <section class="osc-card-section osc-qa-section">
    <div class="osc-section-header">
      <span class="osc-step-num">5</span>
      <span class="osc-section-title">Вопросы и ответы</span>
    </div>

    <!-- Categories -->
    <div class="osc-qa-categories">
      <button
        v-for="cat in QA_CATEGORIES"
        :key="cat.id"
        :class="['osc-qa-cat', { active: activeCategory === cat.id }]"
        @click="setCategory(cat.id)"
      >
        <component :is="categoryIcons[cat.id]" :size="18" :color="activeCategory === cat.id ? COLORS.primary : '#888'" />
        <span>{{ cat.name }}</span>
      </button>
    </div>

    <!-- Questions -->
    <div class="osc-qa-list">
      <div 
        v-for="(item, index) in questions[activeCategory]"
        :key="index"
        class="osc-qa-item"
        :class="{ expanded: isExpanded(index) }"
      >
        <div class="osc-qa-question" @click="toggleQuestion(index)">
          <HelpCircle :size="20" :color="COLORS.primary" />
          <span>{{ item.q }}</span>
          <component 
            :is="isExpanded(index) ? ChevronDown : ChevronRight" 
            :size="20" 
            color="#888" 
            class="osc-qa-chevron"
          />
        </div>
        <Transition name="osc-expand">
          <div v-if="isExpanded(index)" class="osc-qa-answer">
            {{ item.a }}
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.osc-qa-section {
  margin-bottom: 24px;
}

.osc-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.osc-step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #00D9C0;
  color: #000;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.osc-section-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
}

.osc-qa-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.osc-qa-cat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-qa-cat:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.osc-qa-cat.active {
  background: rgba(0,217,192,0.15);
  border-color: rgba(0,217,192,0.5);
  color: #00D9C0;
}

.osc-qa-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.osc-qa-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.osc-qa-item:hover {
  border-color: rgba(255,255,255,0.2);
}

.osc-qa-item.expanded {
  background: rgba(0,217,192,0.08);
  border-color: rgba(0,217,192,0.3);
}

.osc-qa-question {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}

.osc-qa-question span {
  flex: 1;
}

.osc-qa-chevron {
  transition: transform 0.2s;
}

.osc-qa-item.expanded .osc-qa-chevron {
  transform: rotate(180deg);
}

.osc-qa-answer {
  padding: 0 20px 20px 52px;
  font-size: 14px;
  line-height: 1.7;
  color: #fff;
}

.osc-expand-enter-active,
.osc-expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.osc-expand-enter-from,
.osc-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.osc-expand-enter-to,
.osc-expand-leave-from {
  opacity: 1;
  max-height: 250px;
}

.osc-card-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
}
</style>
