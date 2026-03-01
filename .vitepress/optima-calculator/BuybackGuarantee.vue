<script setup>
import { ref, computed } from 'vue'
import { ShieldCheck, Settings2, Sigma, BrickWall } from './icons.js'
import { OPTIMA_SPACE, COLORS, TIMELINE_TOOLTIPS, COVERAGE_COMMENTS } from './constants.js'
import { formatCurrency } from './utils.js'
import CustomSlider from './CustomSlider.vue'
import InfoTooltip from './InfoTooltip.vue'

const props = defineProps({
  investment: { type: Number, required: true },
  shares: { type: Number, required: true }
})

const emit = defineEmits(['scrollToStrategy'])

// Начальное значение 90% (соответствует плану)
const occupancy = ref(90)

const scenarios = computed(() => {
  const calc = (occ) => {
    const adjROI = (occ / 90) * OPTIMA_SPACE.rounds[0].roi
    const divs = props.investment * (adjROI / 100) * 4.5
    const divPerShare = props.shares > 0 ? divs / props.shares : 0
    const buyback = Math.max(0, props.shares * Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare))
    return { 
      dividends: divs, 
      buyback, 
      total: divs + buyback, 
      roi: props.investment > 0 ? Math.round((divs / props.investment) * 100) : 0 
    }
  }
  // Порядок: Худший, Базовый, Оптимистичный
  return [
    { key: 'worst', label: 'Худший', occupancy: 50, ...calc(50), color: '#888888', bgColor: 'rgba(136,136,136,0.12)', borderColor: 'rgba(136,136,136,0.5)' },
    { key: 'base', label: 'Базовый', occupancy: 90, ...calc(90), color: '#00FFCC', bgColor: 'rgba(0,255,204,0.12)', borderColor: 'rgba(0,255,204,0.5)' },
    { key: 'optimistic', label: 'Оптимистичный', occupancy: 95, ...calc(95), color: '#00D9C0', bgColor: 'rgba(0,217,192,0.08)', borderColor: 'rgba(0,217,192,0.4)' }
  ]
})

const currentScenario = computed(() => {
  const occ = Number(occupancy.value) || 90
  const adjROI = (occ / 90) * OPTIMA_SPACE.rounds[0].roi
  const yearlyDiv = props.investment * (adjROI / 100)
  const totalDivs = yearlyDiv * 4.5
  const payback = yearlyDiv > 0 ? Math.round((props.investment / yearlyDiv) * 12) : Infinity
  const divPerShare = props.shares > 0 ? totalDivs / props.shares : 0
  // Округляем цену выкупа до 10₽
  const rawBuybackPrice = Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare)
  const buybackPrice = Math.round(rawBuybackPrice / 10) * 10
  return { 
    adjROI, 
    yearlyDiv, 
    totalDivs, 
    payback, 
    buybackPrice, 
    buybackTotal: props.shares * buybackPrice 
  }
})

const collateralCoverage = computed(() => {
  if (props.investment === 0) return { ratio: '∞', text: '', type: 'neutral' }
  
  const ratio = OPTIMA_SPACE.collateralValue / props.investment
  const ratioText = ratio.toFixed(0)
  
  if (ratio >= COVERAGE_COMMENTS.excellent.min) {
    return { ratio: ratioText, text: COVERAGE_COMMENTS.excellent.text, type: 'excellent' }
  } else if (ratio >= COVERAGE_COMMENTS.good.min) {
    return { ratio: ratioText, text: COVERAGE_COMMENTS.good.text, type: 'good' }
  } else if (ratio >= COVERAGE_COMMENTS.normal.min) {
    return { ratio: ratioText, text: COVERAGE_COMMENTS.normal.text, type: 'normal' }
  } else {
    return { ratio: ratioText, text: COVERAGE_COMMENTS.minimum.text, type: 'minimum' }
  }
})

// Timeline steps
const timelineSteps = [
  { label: 'Покупка акций', sub: 'Сейчас', current: true },
  { label: 'Запуск', sub: '+6 мес', current: false },
  { label: 'Окупаемость', sub: '+29 мес', current: false },
  { label: 'Опцион', sub: '+55 мес', current: false }
]

const handleInvestmentClick = () => {
  emit('scrollToStrategy')
}
</script>

<template>
  <div class="osc-buyback-guarantee">
    <div class="osc-g-header">
      <ShieldCheck :size="28" :color="COLORS.primary" />
      <span class="osc-g-title">Гарантия обратного выкупа</span>
    </div>

    <!-- Timeline / Process -->
    <div class="osc-timeline-section">
      <div class="osc-timeline-title">ПРОЦЕСС ВЫКУПА</div>
      <div class="osc-timeline">
        <div class="osc-tl-track"></div>
        <div class="osc-tl-progress"></div>
        <div class="osc-tl-steps">
          <div 
            v-for="(step, i) in timelineSteps" 
            :key="i"
            class="osc-tl-step"
          >
            <InfoTooltip :text="TIMELINE_TOOLTIPS[i]" :maxWidth="300">
              <div class="osc-tl-dot" :class="{ current: step.current }">
                {{ i + 1 }}
              </div>
            </InfoTooltip>
            <div class="osc-tl-label" :class="{ current: step.current }">{{ step.label }}</div>
            <div class="osc-tl-sub" :class="{ current: step.current }">{{ step.sub }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scenarios -->
    <div class="osc-scenarios-section">
      <div class="osc-section-sub-title">
        Сценарии выкупа 
        <span class="osc-investment-link" @click="handleInvestmentClick">
          (ваши {{ formatCurrency(investment) }})
        </span>
      </div>
      <div class="osc-scenarios-grid">
        <div 
          v-for="scenario in scenarios" 
          :key="scenario.key"
          class="osc-scenario-card"
          :style="{ 
            background: scenario.bgColor,
            borderColor: scenario.borderColor 
          }"
        >
          <div class="osc-sc-badge" :style="{ background: scenario.color }">
            {{ scenario.label }}
          </div>
          <div class="osc-sc-occ" :style="{ color: scenario.color }">
            Загрузка {{ scenario.occupancy }}%
          </div>
          <div class="osc-sc-details">
            <div class="osc-sc-divs">Дивиденды: <span :style="{ color: scenario.color }">{{ formatCurrency(scenario.dividends) }}</span></div>
            <div v-if="scenario.buyback > 0" class="osc-sc-buyback">Выкуп: <span :style="{ color: scenario.color }">{{ formatCurrency(scenario.buyback) }}</span></div>
          </div>
          <div class="osc-sc-total" :style="{ color: scenario.color }">{{ formatCurrency(scenario.total) }}</div>
          <div class="osc-sc-roi">ROI: {{ scenario.roi }}%</div>
        </div>
      </div>
      <div class="osc-scenarios-note">✓ Даже при загрузке 50% вы получаете доход</div>
    </div>

    <!-- Interactive Slider -->
    <div class="osc-interactive-section">
      <div class="osc-int-header">
        <Settings2 :size="24" :color="COLORS.primary" />
        <span>Интерактивный расчёт: Что если загрузка = <strong>{{ occupancy }}%</strong>?</span>
      </div>
      <CustomSlider 
        v-model="occupancy" 
        :min="30" 
        :max="100" 
        :color="COLORS.primary"
      />
      <div class="osc-int-labels">
        <span>30%</span>
        <span>50%</span>
        <span>90% (план)</span>
        <span>100%</span>
      </div>
      <div class="osc-int-metrics">
        <div class="osc-int-m">
          <div class="osc-int-m-label">ROI годовых</div>
          <div class="osc-int-m-value" :class="{ highlight: currentScenario.adjROI >= 20 }">
            {{ currentScenario.adjROI.toFixed(1) }}%
          </div>
        </div>
        <div class="osc-int-m">
          <div class="osc-int-m-label">Дивиденды/год</div>
          <div class="osc-int-m-value">{{ formatCurrency(currentScenario.yearlyDiv) }}</div>
        </div>
        <div class="osc-int-m">
          <div class="osc-int-m-label">Окупаемость</div>
          <div class="osc-int-m-value">{{ currentScenario.payback < 100 ? `${currentScenario.payback} мес` : '—' }}</div>
        </div>
        <div class="osc-int-m">
          <div class="osc-int-m-label">Цена выкупа</div>
          <div class="osc-int-m-value">{{ currentScenario.buybackPrice.toFixed(0) }}₽</div>
        </div>
      </div>
    </div>

    <!-- Formula -->
    <div class="osc-formula-section">
      <div class="osc-f-header">
        <Sigma :size="20" :color="COLORS.primary" />
        <span>Ваша персональная формула</span>
      </div>
      <div class="osc-f-grid">
        <div class="osc-f-col">
          <div><span class="osc-dim">Акции:</span> <strong>{{ shares.toLocaleString() }}</strong> шт</div>
          <div><span class="osc-dim">× Номинал:</span> <span class="osc-hl">{{ OPTIMA_SPACE.buybackPrice }}₽</span></div>
          <div><span class="osc-dim">− Дивиденды/акция:</span> <span class="osc-hl">{{ shares > 0 ? (currentScenario.totalDivs / shares).toFixed(0) : 0 }}₽</span></div>
        </div>
        <div class="osc-f-col bordered">
          <div><span class="osc-dim">Выкуп:</span> <strong>{{ formatCurrency(currentScenario.buybackTotal) }}</strong></div>
          <div><span class="osc-dim">+ Дивиденды:</span> <span class="osc-hl">{{ formatCurrency(currentScenario.totalDivs) }}</span></div>
          <div class="osc-f-total">
            <span class="osc-dim">ИТОГО:</span> 
            <span class="osc-hl osc-big">{{ formatCurrency(currentScenario.totalDivs + currentScenario.buybackTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Collateral -->
    <div class="osc-collateral-section">
      <div class="osc-c-header">
        <BrickWall :size="20" :color="COLORS.primary" />
        <span>Залоговое обеспечение</span>
      </div>
      <div class="osc-c-grid">
        <div class="osc-c-item">
          <div class="osc-c-label">Площадь</div>
          <div class="osc-c-value">{{ OPTIMA_SPACE.collateral }} кв.м</div>
        </div>
        <div class="osc-c-item">
          <div class="osc-c-label">Оценка</div>
          <div class="osc-c-value">~{{ formatCurrency(OPTIMA_SPACE.collateralValue) }}</div>
        </div>
        <div class="osc-c-item">
          <div class="osc-c-label">Покрытие</div>
          <div class="osc-c-value osc-highlight">{{ collateralCoverage.ratio }}×</div>
        </div>
      </div>
      <div class="osc-c-comment" :class="collateralCoverage.type">
        {{ collateralCoverage.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.osc-buyback-guarantee {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.1);
}

.osc-g-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.osc-g-title { 
  font-size: 16px; 
  font-weight: 600; 
  color: #fff; 
}

/* Timeline */
.osc-timeline-section {
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
}

.osc-timeline-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
}

.osc-timeline {
  position: relative;
  padding-top: 12px;
}

.osc-tl-track {
  position: absolute;
  top: 24px;
  left: 40px;
  right: 40px;
  height: 3px;
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
}

.osc-tl-progress {
  position: absolute;
  top: 24px;
  left: 40px;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #00D9C0, #00FFCC);
  border-radius: 2px;
  animation: osc-progress-fill 2s ease-out forwards;
  box-shadow: 0 0 10px rgba(0,217,192,0.5);
}

.osc-tl-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  animation: osc-shimmer 1.5s infinite;
}

@keyframes osc-progress-fill {
  0% { width: 0; opacity: 0; }
  20% { opacity: 1; }
  100% { width: 60px; opacity: 1; }
}

@keyframes osc-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.osc-tl-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.osc-tl-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.osc-tl-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2a2a2a;
  border: 2px solid rgba(255,255,255,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  cursor: help;
  transition: all 0.2s;
}

.osc-tl-dot.current { 
  border-color: #00D9C0;
  color: #000;
  background: #00D9C0;
  box-shadow: 0 0 16px rgba(0,217,192,0.5);
}

.osc-tl-dot:hover {
  border-color: #00D9C0;
  color: #00D9C0;
}

.osc-tl-label {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #aaa;
}

.osc-tl-label.current { color: #00D9C0; }
.osc-tl-sub { font-size: 11px; color: #666; margin-top: 2px; }
.osc-tl-sub.current { color: #00D9C0; }

/* Scenarios */
.osc-scenarios-section { margin-bottom: 24px; }

.osc-section-sub-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 12px;
}

.osc-investment-link {
  color: #00D9C0;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: color 0.2s;
}

.osc-investment-link:hover {
  color: #fff;
}

.osc-scenarios-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.osc-scenario-card {
  padding: 16px;
  border: 2px solid;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
}

.osc-scenario-card:hover { 
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.osc-sc-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #000;
  margin-bottom: 10px;
}

.osc-sc-occ { 
  font-size: 20px; 
  font-weight: 700; 
  margin-bottom: 12px; 
}

.osc-sc-details {
  margin-bottom: 12px;
}

.osc-sc-divs, .osc-sc-buyback { 
  font-size: 12px; 
  color: #aaa;
  margin-bottom: 4px;
}

.osc-sc-total {
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 18px;
  font-weight: 700;
}

.osc-sc-roi { 
  font-size: 11px; 
  color: #888; 
  margin-top: 4px;
}

.osc-scenarios-note {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #00D9C0;
  text-align: center;
}

/* Interactive Section */
.osc-interactive-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0,217,192,0.2) 0%, rgba(0,217,192,0.08) 100%);
  border: 2px solid #00D9C0;
  border-radius: 12px;
}

.osc-int-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.osc-int-header strong { color: #00D9C0; }

.osc-int-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  color: #aaa;
}

.osc-int-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.osc-int-m { text-align: center; }
.osc-int-m-label { font-size: 11px; color: #bbb; }
.osc-int-m-value { font-size: 18px; font-weight: 600; color: #fff; }
.osc-int-m-value.highlight { color: #00D9C0; }

/* Formula */
.osc-formula-section {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 8px;
}

.osc-f-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.osc-f-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.osc-f-col {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 12px;
  line-height: 2;
  color: #fff;
}

.osc-f-col.bordered {
  border-left: 1px solid rgba(0,217,192,0.3);
  padding-left: 24px;
}

.osc-dim { color: #bbb; }
.osc-hl { color: #00D9C0; }

.osc-f-total {
  padding-top: 8px;
  border-top: 1px solid rgba(0,217,192,0.3);
  margin-top: 8px;
}

.osc-big { font-size: 16px; font-weight: 700; }

/* Collateral */
.osc-collateral-section {
  padding: 16px;
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 8px;
}

.osc-c-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.osc-c-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  text-align: center;
}

.osc-c-label { font-size: 11px; color: #bbb; }
.osc-c-value { font-size: 18px; font-weight: 600; color: #fff; }
.osc-c-value.osc-highlight { color: #00D9C0; }

.osc-c-comment {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
}

.osc-c-comment.excellent,
.osc-c-comment.good {
  background: rgba(0,217,192,0.1);
  color: #00D9C0;
}

.osc-c-comment.normal {
  background: rgba(59,130,246,0.1);
  color: #3B82F6;
}

.osc-c-comment.minimum {
  background: rgba(245,197,66,0.1);
  color: #F5C542;
}

@media (max-width: 768px) {
  .osc-scenarios-grid { grid-template-columns: 1fr; }
  .osc-int-metrics { grid-template-columns: repeat(2, 1fr); }
  .osc-f-grid { grid-template-columns: 1fr; }
  .osc-f-col.bordered {
    border-left: none;
    border-top: 1px solid rgba(0,217,192,0.3);
    padding-left: 0;
    padding-top: 16px;
  }
}
</style>
