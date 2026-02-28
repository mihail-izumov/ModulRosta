<script setup>
import { ref, computed } from 'vue'
import { OPTIMA_SPACE, COLORS } from './constants.js'
import { formatCurrency } from './utils.js'
import CustomSlider from './CustomSlider.vue'

const props = defineProps({
  investment: { type: Number, required: true },
  shares: { type: Number, required: true }
})

const occupancy = ref(75)
const showTimelineTooltip = ref(false)

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
  return {
    optimistic: { label: 'Оптимистичный', occupancy: 95, ...calc(95), color: COLORS.gold },
    base: { label: 'Базовый', occupancy: 90, ...calc(90), color: COLORS.primary },
    worst: { label: 'Худший', occupancy: 50, ...calc(50), color: COLORS.error }
  }
})

const currentScenario = computed(() => {
  const occ = Number(occupancy.value) || 75
  const adjROI = (occ / 90) * OPTIMA_SPACE.rounds[0].roi
  const yearlyDiv = props.investment * (adjROI / 100)
  const totalDivs = yearlyDiv * 4.5
  const payback = yearlyDiv > 0 ? Math.round((props.investment / yearlyDiv) * 12) : Infinity
  const divPerShare = props.shares > 0 ? totalDivs / props.shares : 0
  const buybackPrice = Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare)
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
  return props.investment > 0 
    ? (OPTIMA_SPACE.collateralValue / props.investment).toFixed(0) 
    : '∞'
})

const timelineSteps = [
  { label: 'Покупка', sub: 'акций', done: true, tooltip: null },
  { label: 'Запуск', sub: '+6 мес', done: false, tooltip: 'Сейчас вы здесь: после покупки акций, до запуска проекта' },
  { label: 'Окупаемость', sub: '+29 мес', done: false, tooltip: null },
  { label: 'Опцион', sub: '+55 мес', done: false, tooltip: null }
]
</script>

<template>
  <div class="buyback-guarantee">
    <div class="g-header">
      <span class="g-icon">🛡️</span>
      <span class="g-title">Гарантия обратного выкупа</span>
    </div>

    <div class="timeline-section">
      <div class="timeline-title">Timeline проекта</div>
      <div class="timeline">
        <div class="tl-line"></div>
        <div class="tl-progress"></div>
        <div 
          v-for="(step, i) in timelineSteps" 
          :key="i"
          class="tl-step"
          @mouseenter="i === 1 && (showTimelineTooltip = true)"
          @mouseleave="showTimelineTooltip = false"
        >
          <div class="tl-dot" :class="{ done: step.done, current: i === 1 }">
            {{ step.done ? '✓' : i + 1 }}
          </div>
          <div class="tl-label" :class="{ done: step.done }">{{ step.label }}</div>
          <div class="tl-sub">{{ step.sub }}</div>
          <Transition name="tooltip">
            <div v-if="i === 1 && showTimelineTooltip" class="tl-tooltip">
              {{ step.tooltip }}
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div class="scenarios-section">
      <div class="section-title">Сценарии выкупа (ваши {{ formatCurrency(investment) }})</div>
      <div class="scenarios-grid">
        <div 
          v-for="(scenario, key) in scenarios" 
          :key="key"
          class="scenario-card"
          :class="{ base: key === 'base', worst: key === 'worst' }"
        >
          <div class="sc-dot" :style="{ background: scenario.color }"></div>
          <div class="sc-label">{{ scenario.label }}</div>
          <div class="sc-occ">Загрузка {{ scenario.occupancy }}%</div>
          <div class="sc-divs">Дивиденды: <span>{{ formatCurrency(scenario.dividends) }}</span></div>
          <div v-if="scenario.buyback > 0" class="sc-buyback">Выкуп: <span>{{ formatCurrency(scenario.buyback) }}</span></div>
          <div class="sc-total" :class="{ worst: key === 'worst' }">{{ formatCurrency(scenario.total) }}</div>
          <div class="sc-roi">ROI: {{ scenario.roi }}%</div>
        </div>
      </div>
      <div class="scenarios-note">✓ Даже при загрузке 50% вы получаете доход</div>
    </div>

    <div class="interactive-section">
      <div class="int-header">
        <span class="int-icon">⚙️</span>
        <span>Интерактивный расчёт: Что если загрузка = <strong>{{ occupancy }}%</strong>?</span>
      </div>
      <CustomSlider 
        v-model="occupancy" 
        :min="30" 
        :max="100" 
        :color="COLORS.primary"
      />
      <div class="int-labels">
        <span>30%</span>
        <span>50%</span>
        <span>90% (план)</span>
        <span>100%</span>
      </div>
      <div class="int-metrics">
        <div class="int-m">
          <div class="int-m-label">ROI годовых</div>
          <div class="int-m-value" :class="{ highlight: currentScenario.adjROI >= 20 }">
            {{ currentScenario.adjROI.toFixed(1) }}%
          </div>
        </div>
        <div class="int-m">
          <div class="int-m-label">Дивиденды/год</div>
          <div class="int-m-value">{{ formatCurrency(currentScenario.yearlyDiv) }}</div>
        </div>
        <div class="int-m">
          <div class="int-m-label">Окупаемость</div>
          <div class="int-m-value">{{ currentScenario.payback < 100 ? `${currentScenario.payback} мес` : '—' }}</div>
        </div>
        <div class="int-m">
          <div class="int-m-label">Цена выкупа</div>
          <div class="int-m-value">{{ currentScenario.buybackPrice.toFixed(0) }}₽</div>
        </div>
      </div>
    </div>

    <div class="formula-section">
      <div class="f-header">
        <span class="f-icon">∑</span>
        <span>Ваша персональная формула</span>
      </div>
      <div class="f-grid">
        <div class="f-col">
          <div><span class="dim">Акции:</span> <strong>{{ shares.toLocaleString() }}</strong> шт</div>
          <div><span class="dim">× Номинал:</span> <span class="hl">{{ OPTIMA_SPACE.buybackPrice }}₽</span></div>
          <div><span class="dim">− Дивиденды/акция:</span> <span class="hl">{{ shares > 0 ? (currentScenario.totalDivs / shares).toFixed(0) : 0 }}₽</span></div>
        </div>
        <div class="f-col bordered">
          <div><span class="dim">Выкуп:</span> <strong>{{ formatCurrency(currentScenario.buybackTotal) }}</strong></div>
          <div><span class="dim">+ Дивиденды:</span> <span class="hl">{{ formatCurrency(currentScenario.totalDivs) }}</span></div>
          <div class="f-total">
            <span class="dim">ИТОГО:</span> 
            <span class="hl big">{{ formatCurrency(currentScenario.totalDivs + currentScenario.buybackTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="collateral-section">
      <div class="c-header">
        <span class="c-icon">🏠</span>
        <span>Залоговое обеспечение</span>
      </div>
      <div class="c-grid">
        <div class="c-item">
          <div class="c-label">Площадь</div>
          <div class="c-value">{{ OPTIMA_SPACE.collateral }} кв.м</div>
        </div>
        <div class="c-item">
          <div class="c-label">Оценка</div>
          <div class="c-value">~{{ formatCurrency(OPTIMA_SPACE.collateralValue) }}</div>
        </div>
        <div class="c-item">
          <div class="c-label">Покрытие</div>
          <div class="c-value highlight">{{ collateralCoverage }}×</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buyback-guarantee {
  background: #0a0a0a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #111;
}

.g-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.g-icon { font-size: 28px; }
.g-title { font-size: 16px; font-weight: 600; color: #fff; }

.timeline-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #111;
  border-radius: 8px;
}

.timeline-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 12px;
}

.timeline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.tl-line {
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #333;
}

.tl-progress {
  position: absolute;
  top: 10px;
  left: 20px;
  width: calc(25% - 10px);
  height: 2px;
  background: #00D9C0;
}

.tl-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  position: relative;
}

.tl-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
  cursor: default;
}

.tl-dot.done { background: #00D9C0; color: #000; }
.tl-dot.current { border: 2px solid #00D9C0; cursor: help; }

.tl-label {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #888;
}

.tl-label.done { color: #00D9C0; }
.tl-sub { font-size: 10px; color: #555; }

.tl-tooltip {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 10px;
  color: #aaa;
  white-space: nowrap;
  z-index: 10;
}

.scenarios-section { margin-bottom: 24px; }

.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 12px;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.scenario-card {
  padding: 16px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
}

.scenario-card:hover { border-color: #333; }
.scenario-card.base { background: rgba(0,217,192,0.1); border-color: rgba(0,217,192,0.3); }
.scenario-card.worst { border-color: rgba(232,25,44,0.3); }

.sc-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 auto 8px;
}

.sc-label { font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.sc-occ { font-size: 10px; color: #666; margin-bottom: 12px; }
.sc-divs, .sc-buyback { font-size: 10px; color: #888; }
.sc-divs span, .sc-buyback span { color: #00D9C0; }

.sc-total {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #222;
  font-size: 14px;
  font-weight: 600;
  color: #00D9C0;
}

.sc-total.worst { color: #fff; }
.sc-roi { font-size: 10px; color: #555; }

.scenarios-note {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 8px;
  font-size: 12px;
  color: #00D9C0;
  text-align: center;
}

.interactive-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0,217,192,0.15) 0%, rgba(0,217,192,0.05) 100%);
  border: 2px solid #00D9C0;
  border-radius: 12px;
}

.int-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.int-icon { font-size: 24px; }
.int-header strong { color: #00D9C0; }

.int-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10px;
  color: #888;
}

.int-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.int-m { text-align: center; }
.int-m-label { font-size: 10px; color: #aaa; }
.int-m-value { font-size: 18px; font-weight: 600; color: #fff; }
.int-m-value.highlight { color: #00D9C0; }

.formula-section {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0,217,192,0.05);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 8px;
}

.f-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.f-icon { font-size: 20px; }

.f-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.f-col {
  font-family: monospace;
  font-size: 12px;
  line-height: 2;
  color: #fff;
}

.f-col.bordered {
  border-left: 1px solid rgba(0,217,192,0.2);
  padding-left: 24px;
}

.f-col .dim { color: #aaa; }
.f-col .hl { color: #00D9C0; }

.f-total {
  padding-top: 8px;
  border-top: 1px solid rgba(0,217,192,0.2);
  margin-top: 8px;
}

.f-total .big { font-size: 16px; font-weight: 700; }

.collateral-section {
  padding: 16px;
  background: rgba(0,217,192,0.05);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 8px;
}

.c-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.c-icon { font-size: 20px; }

.c-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  text-align: center;
}

.c-label { font-size: 10px; color: #aaa; }
.c-value { font-size: 18px; font-weight: 600; color: #fff; }
.c-value.highlight { color: #00D9C0; }

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .scenarios-grid { grid-template-columns: 1fr; }
  .int-metrics { grid-template-columns: repeat(2, 1fr); }
  .f-grid { grid-template-columns: 1fr; }
  .f-col.bordered {
    border-left: none;
    border-top: 1px solid rgba(0,217,192,0.2);
    padding-left: 0;
    padding-top: 16px;
  }
}
</style>
