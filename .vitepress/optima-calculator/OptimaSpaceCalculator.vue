<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { 
  PhoneOff, Vault, Scale, Building2, FileText, 
  Rocket, ChevronRight 
} from 'lucide-vue-next'
import { COLORS, TOOLTIPS, OPTIMA_SPACE, ASSET_CLASSES, STRATEGIES } from './constants.js'
import { formatCurrency, formatPercent, toNumber } from './utils.js'
import { usePortfolio } from './usePortfolio.js'
import { usePDFGenerator } from './usePDFGenerator.js'

import InfoTooltip from './InfoTooltip.vue'
import CustomSlider from './CustomSlider.vue'
import CurrencyInput from './CurrencyInput.vue'
import PortfolioChart from './PortfolioChart.vue'
import BuybackGuarantee from './BuybackGuarantee.vue'
import QAModule from './QAModule.vue'
import ModulRostaBadge from './ModulRostaBadge.vue'

// Portfolio composable
const {
  totalCapital,
  allocations,
  activeStrategy,
  inputMode,
  portfolioMetrics,
  optimaInvestment,
  optimaShares,
  isOptimaValid,
  chartData,
  goalStatus,
  updateAllocation,
  loadStrategy,
  autoDistribute,
} = usePortfolio()

// PDF Generator
const { generatePDF } = usePDFGenerator()

// Local state
const isMobile = ref(false)
const isGeneratingPDF = ref(false)

// How It Works steps
const howItWorksSteps = [
  { icon: Vault, title: 'Ваш капитал', sub: 'Сколько готовы инвестировать' },
  { icon: Scale, title: 'Распределите активы', sub: 'Офисы, склады, ритейл, резерв' },
  { icon: Building2, title: 'Детали Optima Space', sub: 'Акции, дивиденды, гарантии' },
  { icon: FileText, title: 'Скачайте отчёт', sub: 'Персональная стратегия в PDF' },
]

// Methods
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const handleInvest = () => {
  const text = encodeURIComponent(`Хочу инвестировать в Optima Space ${formatCurrency(optimaInvestment.value)}`)
  window.open(`https://t.me/paimukov?text=${text}`, '_blank')
}

const handleDownloadPDF = () => {
  isGeneratingPDF.value = true
  generatePDF({
    totalCapital: totalCapital.value,
    allocations: allocations.value,
    portfolioMetrics: portfolioMetrics.value,
    optimaInvestment: optimaInvestment.value,
    chartData: chartData.value
  })
  setTimeout(() => {
    isGeneratingPDF.value = false
  }, 1000)
}

const getSliderProgress = (assetId, max) => {
  const value = toNumber(allocations.value[assetId])
  return (value / max) * 100
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="optima-calculator-wrapper">
    <!-- Mobile Warning -->
    <div v-if="isMobile" class="mobile-warning">
      <div class="mobile-warning-card">
        <PhoneOff :size="48" :color="COLORS.primary" class="mobile-icon" />
        <h2>Откройте на компьютере</h2>
        <p>Консультант оптимизирован для экрана от 1024px.</p>
      </div>
    </div>

    <!-- Main Calculator -->
    <div v-else class="calculator-container">
      <!-- Global Styles -->
      <component :is="'style'">
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; background:#fff; border-radius:50%; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.5) }
        * { box-sizing:border-box }
        .btn-primary { transition: all 0.3s ease; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,217,192,0.4); filter: brightness(1.1); }
        .btn-secondary { transition: all 0.3s ease; }
        .btn-secondary:hover:not(:disabled) { background: rgba(0,217,192,0.1); transform: translateY(-2px); }
        @keyframes optima-glow { 0%,100%{box-shadow:0 0 0 1px rgba(0,217,192,0.3), 0 0 10px rgba(0,217,192,0.1)} 50%{box-shadow:0 0 0 1px rgba(0,217,192,0.6), 0 0 20px rgba(0,217,192,0.2)} }
        .optima-row { animation: optima-glow 2s ease-in-out infinite; border-radius: 8px; }
      </component>

      <!-- Header -->
      <header class="calc-header">
        <div class="calc-subtitle">Стратегический инструмент для инвесторов</div>
        <h1 class="calc-title">
          Консультант по долевым инвестициям<br>в офисную недвижимость
        </h1>
        <p class="calc-description">
          Рассчитайте структуру портфеля для достижения 
          <InfoTooltip :text="TOOLTIPS.targetYield">
            <span class="highlight">цели 20%+ годовой доходности</span>
          </InfoTooltip>.
        </p>
      </header>

      <!-- How It Works -->
      <section class="how-section">
        <div class="badge-center">
          <span class="top-badge">Умные инвестиции в Optima Space</span>
        </div>
        <div class="steps-grid">
          <template v-for="(step, index) in howItWorksSteps" :key="index">
            <div class="step-item">
              <component :is="step.icon" :size="28" color="#fff" class="step-icon-svg" />
              <div class="step-title">{{ step.title }}</div>
              <div class="step-sub">{{ step.sub }}</div>
            </div>
            <div v-if="index < howItWorksSteps.length - 1" class="step-arrow">→</div>
          </template>
        </div>
      </section>

      <!-- STEP 1: Capital -->
      <section class="card-section">
        <div class="section-header">
          <span class="step-num">1</span>
          <span class="section-title">Ваш инвестиционный капитал</span>
        </div>
        
        <div class="capital-row">
          <span class="capital-label">Сумма для инвестирования</span>
          <span class="capital-value">{{ formatCurrency(totalCapital) }}</span>
        </div>
        
        <CustomSlider 
          v-model="totalCapital"
          :min="1000000"
          :max="100000000"
          :step="500000"
          :color="COLORS.primary"
        />
        
        <div class="slider-labels">
          <span>1 млн ₽</span>
          <span>100 млн ₽</span>
        </div>
        
        <div class="quick-buttons">
          <button 
            v-for="amount in [3000000, 5000000, 10000000, 20000000, 50000000]"
            :key="amount"
            :class="{ active: totalCapital === amount }"
            @click="totalCapital = amount"
          >
            {{ formatCurrency(amount) }}
          </button>
        </div>
      </section>

      <!-- STEP 2: Strategy -->
      <section class="card-section">
        <div class="section-header">
          <span class="step-num">2</span>
          <span class="section-title">Выберите стратегию</span>
        </div>

        <!-- Strategy Cards -->
        <div class="strategies-grid">
          <button 
            v-for="(strategy, key) in STRATEGIES"
            :key="key"
            :class="['strategy-card', { active: activeStrategy === key }]"
            @click="loadStrategy(key)"
          >
            <InfoTooltip :text="strategy.tooltip">
              <div class="strat-name">{{ strategy.name }}</div>
            </InfoTooltip>
            <div class="strat-desc">{{ strategy.description }}</div>
            <div class="strat-target">{{ strategy.target }}</div>
          </button>
        </div>

        <!-- Input Mode Toggle -->
        <div class="mode-toggle">
          <button :class="{ active: inputMode === 'percent' }" @click="inputMode = 'percent'">
            Ввод в %
          </button>
          <button :class="{ active: inputMode === 'amount' }" @click="inputMode = 'amount'">
            Ввод в ₽
          </button>
        </div>

        <!-- Allocation Grid -->
        <div class="allocation-grid">
          <!-- Assets List -->
          <div class="assets-list">
            <div class="list-header">
              Распределение активов
              <span v-if="!activeStrategy" class="manual-tag">• вручную</span>
            </div>

            <!-- Asset Items -->
            <div v-for="asset in ASSET_CLASSES" :key="asset.id" class="asset-item">
              <div class="asset-top">
                <div class="asset-left">
                  <span class="asset-dot" :style="{ background: asset.color }"></span>
                  <InfoTooltip :text="asset.tooltip">
                    <span class="asset-name">{{ asset.name }}</span>
                  </InfoTooltip>
                  <span 
                    class="asset-tag" 
                    :style="{ 
                      background: asset.tagColor + '20', 
                      color: asset.tagColor, 
                      borderColor: asset.tagColor + '40' 
                    }"
                  >
                    {{ asset.tag }}
                  </span>
                </div>
                <div class="asset-right">
                  <span class="asset-amount">{{ formatCurrency(totalCapital * allocations[asset.id] / 100) }}</span>
                  <span class="asset-percent">{{ allocations[asset.id] }}%</span>
                </div>
              </div>
              
              <div 
                class="asset-desc"
                :class="{ 
                  'error-text': asset.id === 'optima' && allocations[asset.id] > 0 && totalCapital * allocations[asset.id] / 100 < OPTIMA_SPACE.minInvestment 
                }"
              >
                {{ asset.id === 'optima' && allocations[asset.id] > 0 && totalCapital * allocations[asset.id] / 100 < OPTIMA_SPACE.minInvestment 
                  ? `Минимум ${formatCurrency(OPTIMA_SPACE.minInvestment)}` 
                  : asset.description 
                }}
              </div>
              
              <div v-if="inputMode === 'percent'" class="slider-wrapper">
                <input 
                  type="range"
                  :value="allocations[asset.id]"
                  :min="0"
                  :max="asset.id === 'optima' ? 35 : 50"
                  :style="{
                    background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${getSliderProgress(asset.id, asset.id === 'optima' ? 35 : 50)}%, #1a1a1a ${getSliderProgress(asset.id, asset.id === 'optima' ? 35 : 50)}%, #1a1a1a 100%)`
                  }"
                  @input="updateAllocation(asset.id, $event.target.value)"
                />
              </div>
              <div v-else class="input-wrapper">
                <CurrencyInput 
                  :modelValue="totalCapital * allocations[asset.id] / 100"
                  :max="totalCapital"
                  @update:modelValue="val => updateAllocation(asset.id, Math.round(val / totalCapital * 100))"
                />
              </div>
              
              <div class="asset-meta">
                <span>Доходность: {{ asset.minYield }}–{{ asset.maxYield }}%</span>
                <span>Риск: {{ asset.risk }}/10</span>
              </div>
            </div>

            <!-- Total Row -->
            <div 
              class="total-row"
              :class="{
                success: portfolioMetrics.totalAllocation === 100,
                error: portfolioMetrics.totalAllocation > 100,
                warning: portfolioMetrics.totalAllocation < 100 && portfolioMetrics.totalAllocation > 0
              }"
            >
              <span>Итого распределено</span>
              <span class="total-percent">{{ portfolioMetrics.totalAllocation }}%</span>
            </div>

            <!-- Auto Distribute -->
            <div v-if="portfolioMetrics.totalAllocation !== 100" class="auto-block">
              <div class="auto-hint" :class="{ error: portfolioMetrics.totalAllocation > 100 }">
                {{ portfolioMetrics.totalAllocation > 100 
                  ? `Превышение на ${portfolioMetrics.totalAllocation - 100}%` 
                  : `Не распределено: ${formatCurrency(totalCapital * (100 - portfolioMetrics.totalAllocation) / 100)}` 
                }}
              </div>
              <button class="auto-btn" @click="autoDistribute">
                <InfoTooltip :text="TOOLTIPS.autoDistribute">
                  {{ portfolioMetrics.totalAllocation > 100 
                    ? 'Выровнять до 100%' 
                    : `Авто-распределение (${100 - portfolioMetrics.totalAllocation}%)` 
                  }}
                </InfoTooltip>
              </button>
            </div>
          </div>

          <!-- Chart Column -->
          <div class="chart-column">
            <PortfolioChart :data="chartData" />
            
            <div class="metrics-row">
              <div class="metric-box">
                <div class="m-label">Доходность</div>
                <div class="m-value" :class="{ highlight: portfolioMetrics.yield >= 20 }">
                  {{ portfolioMetrics.totalAllocation > 0 ? formatPercent(portfolioMetrics.yield) : '—' }}
                </div>
              </div>
              <div class="metric-box">
                <div class="m-label">Риск</div>
                <div class="m-value" :class="{ warning: portfolioMetrics.risk > 4 }">
                  {{ portfolioMetrics.totalAllocation > 0 ? `${portfolioMetrics.risk.toFixed(1)}/10` : '—' }}
                </div>
              </div>
            </div>
            
            <div class="goal-status" :class="{ success: goalStatus.isSuccess }">
              {{ goalStatus.text }}
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 3: Optima Details -->
      <section v-if="allocations.optima > 0 && isOptimaValid" class="card-section">
        <div class="section-header">
          <span class="step-num">3</span>
          <span class="section-title">Детали инвестиции в Optima Space</span>
        </div>

        <!-- Metrics Grid -->
        <div class="optima-metrics">
          <div class="o-metric highlight-bg">
            <div class="o-label">Ваша инвестиция</div>
            <div class="o-value primary">{{ formatCurrency(optimaInvestment) }}</div>
            <div class="o-sub">{{ optimaShares.toLocaleString() }} акций</div>
          </div>
          <div class="o-metric">
            <div class="o-label">ROI годовых</div>
            <div class="o-value primary">{{ OPTIMA_SPACE.rounds[0].roi }}%</div>
            <div class="o-sub">I раунд</div>
          </div>
          <div class="o-metric">
            <div class="o-label">Окупаемость</div>
            <div class="o-value">{{ OPTIMA_SPACE.paybackMonths }} мес</div>
            <div class="o-sub">возврат дивидендами</div>
          </div>
          <div class="o-metric">
            <div class="o-label">Доход за 4,5 года</div>
            <div class="o-value primary">{{ formatCurrency(optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5) }}</div>
            <div class="o-sub">ROI {{ ((OPTIMA_SPACE.rounds[0].roi / 100) * 4.5 * 100).toFixed(0) }}%</div>
          </div>
        </div>

        <!-- Buyback Guarantee Component -->
        <BuybackGuarantee :investment="optimaInvestment" :shares="optimaShares" />
      </section>

      <!-- Warning if Optima < 600k -->
      <section v-if="allocations.optima > 0 && !isOptimaValid" class="warning-section">
        <div class="warning-content">
          <span class="warning-icon">⚠️</span>
          <div>
            <div class="warning-title">Минимальная инвестиция в Optima Space — {{ formatCurrency(OPTIMA_SPACE.minInvestment) }}</div>
            <div class="warning-desc">
              Текущая сумма: {{ formatCurrency(optimaInvestment) }}. 
              Добавьте ещё {{ formatCurrency(OPTIMA_SPACE.minInvestment - optimaInvestment) }} или выберите 0%.
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 4: Comparison -->
      <section class="card-section">
        <div class="section-header">
          <span class="step-num">4</span>
          <span class="section-title">Сравнение инструментов</span>
        </div>
        
        <div class="table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Инструмент</th>
                <th class="center">ROI</th>
                <th class="center">Защита</th>
                <th class="center">Риск</th>
                <th class="right">Доход 4,5г</th>
              </tr>
            </thead>
            <tbody>
              <tr class="highlight-row">
                <td class="primary bold">● Optima Space (I раунд)</td>
                <td class="center primary">38%</td>
                <td class="center primary">Обратный выкуп</td>
                <td class="center">4/10</td>
                <td class="right bold">{{ formatCurrency(2000000 * 1.71) }}</td>
              </tr>
              <tr>
                <td>ЗПИФ офисы</td>
                <td class="center muted">12–15%</td>
                <td class="center dim">Нет</td>
                <td class="center primary">3/10</td>
                <td class="right muted">{{ formatCurrency(2000000 * 0.60) }}</td>
              </tr>
              <tr>
                <td>ЗПИФ склады</td>
                <td class="center muted">11–13%</td>
                <td class="center dim">Нет</td>
                <td class="center primary">3/10</td>
                <td class="right muted">{{ formatCurrency(2000000 * 0.55) }}</td>
              </tr>
              <tr>
                <td>Депозиты</td>
                <td class="center muted">18–20%*</td>
                <td class="center primary">АСВ 1.4М</td>
                <td class="center primary">1/10</td>
                <td class="right muted">{{ formatCurrency(2000000 * 0.72) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-note">* Ставки депозитов снизятся в 2026-2027</div>
      </section>

      <!-- STEP 5: Q&A -->
      <QAModule 
        :totalCapital="totalCapital"
        :allocations="allocations"
        :optimaInvestment="optimaInvestment"
        :portfolioMetrics="portfolioMetrics"
      />

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-label">Ваша персональная рекомендация</div>
        
        <div class="cta-grid">
          <!-- Portfolio Summary -->
          <div class="portfolio-summary">
            <h3>Портфель {{ formatCurrency(totalCapital) }}</h3>
            <div 
              v-for="item in chartData" 
              :key="item.name"
              class="portfolio-item"
              :class="{ 'optima-row': item.name === 'Optima Space' }"
            >
              <div class="item-name">
                <span class="item-dot" :style="{ background: item.color }"></span>
                <span :class="{ primary: item.name === 'Optima Space', bold: item.name === 'Optima Space' }">
                  {{ item.name }}
                </span>
              </div>
              <span :class="{ bold: item.name === 'Optima Space' }">
                {{ formatCurrency(item.amount) }}
              </span>
            </div>
          </div>
          
          <!-- Expected Income -->
          <div class="income-box">
            <div class="income-label">Ожидаемый доход за 4,5 года</div>
            <div class="income-value">
              {{ portfolioMetrics.totalAllocation > 0 
                ? formatCurrency(totalCapital * (portfolioMetrics.yield / 100) * 4.5) 
                : '—' 
              }}
            </div>
            <div v-if="portfolioMetrics.totalAllocation > 0" class="income-note">
              при доходности <span class="bold">{{ formatPercent(portfolioMetrics.yield) }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="cta-buttons">
          <button 
            class="btn-primary"
            :disabled="!isOptimaValid || optimaInvestment < OPTIMA_SPACE.minInvestment"
            @click="handleInvest"
          >
            <Rocket :size="20" />
            Инвестировать в Optima Space
          </button>
          <button 
            class="btn-secondary"
            :disabled="isGeneratingPDF"
            @click="handleDownloadPDF"
          >
            <FileText :size="20" />
            {{ isGeneratingPDF ? 'Генерация...' : 'Скачать PDF-отчёт' }}
          </button>
        </div>
      </section>

      <!-- Partner Badge -->
      <ModulRostaBadge />

      <!-- Footer -->
      <footer class="calc-footer">
        <p>Калькулятор предоставляет ориентировочные расчёты. Инвестиции связаны с рисками.</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.optima-calculator-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: #000;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

.calculator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.mobile-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
  text-align: center;
}

.mobile-warning-card {
  padding: 32px;
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 16px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mobile-icon { margin-bottom: 16px; }
.mobile-warning-card h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; border: none !important; }
.mobile-warning-card p { font-size: 14px; color: #888; line-height: 1.6; margin: 0; }

.calc-header {
  text-align: center;
  margin-bottom: 32px;
}

.calc-subtitle {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #00D9C0;
  margin-bottom: 16px;
}

.calc-title {
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0 0 16px !important;
  line-height: 1.15;
  border: none !important;
  padding: 0 !important;
}

.calc-description {
  font-size: 15px;
  color: #888;
  margin: 0;
  max-width: 700px;
  margin-inline: auto;
  line-height: 1.6;
}

.calc-description .highlight {
  color: #00D9C0;
  font-weight: 500;
}

.how-section {
  background: linear-gradient(135deg, rgba(0,217,192,0.08) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 32px;
}

.badge-center {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.top-badge {
  background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%);
  color: #000;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: start;
  gap: 16px;
}

.step-item { 
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-icon-svg { margin-bottom: 8px; }
.step-title { font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.step-sub { font-size: 10px; color: #666; }
.step-arrow { font-size: 20px; color: #333; padding-top: 8px; }

.card-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.step-num {
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
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.capital-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.capital-label { font-size: 14px; color: #888; }
.capital-value { font-size: 32px; font-weight: 600; }

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.quick-buttons button {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 8px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-buttons button:hover {
  border-color: #555;
  color: #fff;
}

.quick-buttons button.active {
  background: #00D9C0;
  border-color: #00D9C0;
  color: #000;
  font-weight: 600;
}

.strategies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.strategy-card {
  padding: 20px;
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.strategy-card:hover { border-color: #333; }
.strategy-card.active { background: rgba(0,217,192,0.1); border-color: #00D9C0; }

.strat-name { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 6px; }
.strategy-card.active .strat-name { color: #00D9C0; }
.strat-desc { font-size: 12px; color: #666; margin-bottom: 12px; }
.strat-target { font-size: 24px; font-weight: 600; color: #00D9C0; }

.mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.mode-toggle button {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 8px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-toggle button.active {
  background: #222;
  color: #fff;
  border-color: #444;
}

.allocation-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

.list-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #555;
  margin-bottom: 20px;
}

.manual-tag { color: #F5C542; margin-left: 8px; }

.asset-item { margin-bottom: 20px; }

.asset-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.asset-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.asset-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.asset-name { font-size: 14px; font-weight: 600; }

.asset-tag {
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid;
}

.asset-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.asset-amount { font-size: 13px; color: #888; }
.asset-percent { font-size: 18px; font-weight: 600; min-width: 45px; text-align: right; }

.asset-desc { font-size: 11px; color: #666; margin-bottom: 10px; margin-left: 22px; }
.asset-desc.error-text { color: #E8192C; }

.slider-wrapper input[type="range"] {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.asset-meta {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #555;
  margin-top: 6px;
}

.total-row {
  padding: 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.total-row.success { background: rgba(0,217,192,0.1); border: 1px solid rgba(0,217,192,0.3); }
.total-row.warning { background: rgba(245,197,66,0.1); border: 1px solid rgba(245,197,66,0.3); }
.total-row.error { background: rgba(232,25,44,0.1); border: 1px solid rgba(232,25,44,0.3); }

.total-row span:first-child { font-size: 14px; color: #888; }
.total-percent { font-size: 28px; font-weight: 600; }

.total-row.success .total-percent { color: #00D9C0; }
.total-row.warning .total-percent { color: #F5C542; }
.total-row.error .total-percent { color: #E8192C; }

.auto-block { margin-top: 12px; }
.auto-hint { font-size: 12px; color: #F5C542; margin-bottom: 10px; }
.auto-hint.error { color: #E8192C; }

.auto-btn {
  width: 100%;
  padding: 14px;
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 10px;
  color: #00D9C0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.auto-btn:hover { background: rgba(0,217,192,0.2); }

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
}

.metric-box {
  background: #0a0a0a;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.m-label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 6px; }
.m-value { font-size: 24px; font-weight: 600; }
.m-value.highlight { color: #00D9C0; }
.m-value.warning { color: #F5C542; }

.goal-status {
  margin-top: 16px;
  padding: 12px;
  background: rgba(245,197,66,0.1);
  border: 1px solid rgba(245,197,66,0.3);
  border-radius: 10px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #F5C542;
  width: 100%;
}

.goal-status.success {
  background: rgba(0,217,192,0.1);
  border-color: rgba(0,217,192,0.3);
  color: #00D9C0;
}

.optima-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.o-metric {
  background: #0a0a0a;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.o-metric.highlight-bg {
  background: rgba(0,217,192,0.1);
  border-color: rgba(0,217,192,0.2);
}

.o-label { font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 6px; }
.o-value { font-size: 28px; font-weight: 600; }
.o-value.primary { color: #00D9C0; }
.o-sub { font-size: 11px; color: #666; margin-top: 4px; }

.warning-section {
  margin-bottom: 24px;
  padding: 24px;
  background: rgba(232,25,44,0.1);
  border: 1px solid rgba(232,25,44,0.3);
  border-radius: 12px;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warning-icon { font-size: 24px; }
.warning-title { font-size: 14px; font-weight: 600; color: #E8192C; }
.warning-desc { font-size: 12px; color: #888; margin-top: 4px; }

.table-wrapper { overflow-x: auto; }

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.comparison-table th {
  text-align: left;
  padding: 14px;
  border-bottom: 1px solid #222;
  color: #666;
  font-size: 10px;
  text-transform: uppercase;
}

.comparison-table th.center { text-align: center; }
.comparison-table th.right { text-align: right; }

.comparison-table td {
  padding: 16px 14px;
  border-bottom: 1px solid #111;
}

.comparison-table td.center { text-align: center; }
.comparison-table td.right { text-align: right; }

.highlight-row { background: rgba(0,217,192,0.05); }
.primary { color: #00D9C0; }
.muted { color: #888; }
.dim { color: #555; }
.bold { font-weight: 600; }

.table-note { margin-top: 12px; font-size: 10px; color: #555; }

.cta-section {
  background: linear-gradient(135deg, rgba(0,217,192,0.1) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 16px;
  padding: 32px;
}

.cta-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #00D9C0;
  margin-bottom: 20px;
}

.cta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.portfolio-summary h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px !important;
  border: none !important;
  padding: 0 !important;
}

.portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #111;
}

.portfolio-item.optima-row {
  background: rgba(0,217,192,0.05);
  border-radius: 8px;
  padding: 10px 12px;
  margin: -10px -12px;
  border-bottom: none;
  margin-bottom: 4px;
}

.item-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.item-name span:not(.item-dot) { font-size: 13px; color: #888; }
.portfolio-item span:last-child { font-size: 14px; font-weight: 500; color: #888; }

.income-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #0a0a0a;
  border-radius: 12px;
  padding: 32px;
}

.income-label { font-size: 12px; color: #888; margin-bottom: 8px; }
.income-value { font-size: 42px; font-weight: 600; color: #00D9C0; }
.income-note { font-size: 13px; color: #666; margin-top: 12px; }

.cta-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 32px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%);
  border: none;
  color: #000;
}

.btn-primary:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 2px solid #00D9C0;
  color: #00D9C0;
}

.btn-secondary:disabled {
  border-color: #333;
  color: #555;
  cursor: not-allowed;
}

.calc-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #111;
  font-size: 11px;
  color: #444;
  margin-top: 24px;
}

.calc-footer p { margin: 0; color: #666; }

@media (max-width: 1024px) {
  .steps-grid { grid-template-columns: repeat(4, 1fr); }
  .step-arrow { display: none; }
  .allocation-grid { grid-template-columns: 1fr; }
  .chart-column { order: -1; margin-bottom: 24px; }
  .optima-metrics { grid-template-columns: repeat(2, 1fr); }
  .strategies-grid { grid-template-columns: 1fr; }
  .cta-grid { grid-template-columns: 1fr; }
  .cta-buttons { grid-template-columns: 1fr; }
}
</style>
