<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { 
  PhoneOff, Vault, Scale, Building2, FileText, Rocket 
} from './icons.js'
import { COLORS, TOOLTIPS, OPTIMA_SPACE, ASSET_CLASSES, STRATEGIES, COMPARISON_COMMENTS } from './constants.js'
import { formatCurrency, formatPercent, toNumber, formatNumberWithSpaces, parseFormattedNumber } from './utils.js'
import { usePortfolio } from './usePortfolio.js'
import { usePDFGenerator } from './usePDFGenerator.js'

import InfoTooltip from './InfoTooltip.vue'
import CustomSlider from './CustomSlider.vue'
import CurrencyInput from './CurrencyInput.vue'
import PortfolioChart from './PortfolioChart.vue'
import BuybackGuarantee from './BuybackGuarantee.vue'
import QAModule from './QAModule.vue'
import ModulRostaBadge from './ModulRostaBadge.vue'
import AccessModal from './AccessModal.vue'

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
  advisorComment,
  collateralCoverage,
  optimaIncome,
  totalIncome,
  updateAllocation,
  loadStrategy,
  autoDistribute,
} = usePortfolio()

// PDF Generator
const { generatePDF } = usePDFGenerator()

// Local state
const isMobile = ref(false)
const isGeneratingPDF = ref(false)
const showAccessModal = ref(false)
const pendingAction = ref(null)
const userData = ref({ fullName: '', phone: '', applicationNumber: '', applicationDate: '' })
const capitalInputValue = ref(formatNumberWithSpaces(totalCapital.value))
const isEditingCapital = ref(false)
const hasSubmittedData = ref(false)

// Таймер до запуска
// Функция склонения для русского языка
const pluralize = (n, forms) => {
  const n10 = n % 10
  const n100 = n % 100
  if (n100 >= 11 && n100 <= 19) return forms[2]
  if (n10 === 1) return forms[0]
  if (n10 >= 2 && n10 <= 4) return forms[1]
  return forms[2]
}

const countdown = computed(() => {
  const launchDate = new Date('2026-06-01')
  const now = new Date()
  const diff = launchDate - now
  
  if (diff <= 0) return { months: 0, days: 0, expired: true, monthsText: '', daysText: '' }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  
  const monthsText = pluralize(months, ['месяц', 'месяца', 'месяцев'])
  const daysText = pluralize(remainingDays, ['день', 'дня', 'дней'])
  
  return { months, days: remainingDays, totalDays: days, expired: false, monthsText, daysText }
})

// How It Works steps
const howItWorksSteps = [
  { icon: Vault, title: 'Ваш капитал', sub: 'Сколько готовы инвестировать' },
  { icon: Scale, title: 'Распределите активы', sub: 'Офисы, склады, ритейл, резерв' },
  { icon: Building2, title: 'Детали Optima Space', sub: 'Акции, дивиденды, гарантии' },
  { icon: FileText, title: 'Скачайте отчёт', sub: 'Персональная стратегия в PDF' },
]

// Таблица сравнения
const comparisonData = computed(() => [
  { 
    name: 'Optima Space (I раунд)', 
    yield: '38%', 
    protection: 'Обратный выкуп', 
    risk: 4, 
    mult: 1.71, 
    highlight: true,
    comment: COMPARISON_COMMENTS.optima
  },
  { 
    name: 'Складская логистика', 
    yield: '11–13%', 
    protection: 'Нет', 
    risk: 3, 
    mult: 0.55,
    comment: COMPARISON_COMMENTS.warehouse
  },
  { 
    name: 'Street-retail', 
    yield: '9–16%', 
    protection: 'Нет', 
    risk: 3, 
    mult: 0.56,
    comment: COMPARISON_COMMENTS.streetretail
  },
  { 
    name: 'Облигации', 
    yield: '10–13%', 
    protection: 'Нет', 
    risk: 2, 
    mult: 0.52,
    comment: COMPARISON_COMMENTS.bonds
  },
  { 
    name: 'Дивидендные акции', 
    yield: '12–15%', 
    protection: 'Нет', 
    risk: 5, 
    mult: 0.61,
    comment: COMPARISON_COMMENTS.dividends
  },
  { 
    name: 'Депозиты', 
    yield: '18–20%', 
    protection: 'АСВ 1.4М', 
    risk: 1, 
    mult: 0.86,
    comment: COMPARISON_COMMENTS.deposits
  },
])

// Проверка сессии при загрузке
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Проверяем сессию
  try {
    const saved = sessionStorage.getItem('osc_user_data')
    if (saved) {
      const data = JSON.parse(saved)
      userData.value = data
      hasSubmittedData.value = true
    }
  } catch (e) {
    // Игнорируем
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Methods
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const handleInvestClick = () => {
  if (hasSubmittedData.value) {
    doInvest()
  } else {
    pendingAction.value = 'invest'
    showAccessModal.value = true
  }
}

const handlePDFClick = () => {
  if (hasSubmittedData.value) {
    doDownloadPDF()
  } else {
    pendingAction.value = 'pdf'
    showAccessModal.value = true
  }
}

const handleModalSubmit = (data) => {
  userData.value = data
  hasSubmittedData.value = true
  showAccessModal.value = false
  
  if (pendingAction.value === 'invest') {
    doInvest()
  } else if (pendingAction.value === 'pdf') {
    doDownloadPDF()
  }
  pendingAction.value = null
}

const doInvest = () => {
  const text = encodeURIComponent(`Хочу инвестировать в Optima Space ${formatCurrency(optimaInvestment.value)}. ${userData.value.fullName}, ${userData.value.phone}`)
  window.open(`https://t.me/paimukov?text=${text}`, '_blank')
}

const doDownloadPDF = async () => {
  isGeneratingPDF.value = true
  
  try {
    await generatePDF({
      totalCapital: totalCapital.value,
      allocations: allocations.value,
      portfolioMetrics: portfolioMetrics.value,
      optimaInvestment: optimaInvestment.value,
      chartData: chartData.value,
      userName: userData.value.fullName,
      applicationNumber: userData.value.applicationNumber,
      applicationDate: userData.value.applicationDate
    })
  } catch (e) {
    console.error('PDF generation error:', e)
  }
  
  setTimeout(() => {
    isGeneratingPDF.value = false
  }, 2000)
}

const getSliderProgress = (assetId, max) => {
  const value = toNumber(allocations.value[assetId])
  return (value / max) * 100
}

// Максимум для слайдера Optima (без ограничения)
const getSliderMax = (assetId) => {
  return assetId === 'optima' ? 100 : 50
}

const handleCapitalInput = (e) => {
  const raw = e.target.value.replace(/\s/g, '')
  const num = parseInt(raw, 10)
  if (!isNaN(num)) {
    capitalInputValue.value = formatNumberWithSpaces(num)
  } else {
    capitalInputValue.value = e.target.value
  }
}

const handleCapitalBlur = () => {
  isEditingCapital.value = false
  const num = parseFormattedNumber(capitalInputValue.value)
  if (!isNaN(num) && num >= 1000000 && num <= 100000000) {
    totalCapital.value = num
  }
  capitalInputValue.value = formatNumberWithSpaces(totalCapital.value)
}

const handleCapitalFocus = () => {
  isEditingCapital.value = true
}

const scrollToStrategy = () => {
  const el = document.getElementById('osc-strategy-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Watch totalCapital to update input
watch(totalCapital, (val) => {
  if (!isEditingCapital.value) {
    capitalInputValue.value = formatNumberWithSpaces(val)
  }
})

// Быстрые кнопки капитала
const capitalButtons = [
  { amount: 3000000, label: '> 3 млн' },
  { amount: 5000000, label: '> 5 млн' },
  { amount: 10000000, label: '> 10 млн' },
  { amount: 20000000, label: '> 20 млн' },
  { amount: 50000000, label: '> 50 млн' },
  { amount: 100000000, label: '> 100 млн' },
]

const isCapitalButtonActive = (amount) => {
  return totalCapital.value >= amount
}
</script>

<template>
  <div class="osc-wrapper">
    <!-- Access Modal -->
    <AccessModal 
      :show="showAccessModal"
      title="Получить доступ"
      @close="showAccessModal = false"
      @submit="handleModalSubmit"
    />

    <!-- Mobile Warning -->
    <div v-if="isMobile" class="osc-mobile-warning">
      <div class="osc-mobile-card">
        <PhoneOff :size="48" :color="COLORS.primary" />
        <h2>Откройте на компьютере</h2>
        <p>Консультант оптимизирован для экрана от 1024px.</p>
      </div>
    </div>

    <!-- Main Calculator -->
    <div v-else class="osc-container">
      <!-- Header -->
      <header class="osc-header">
        <div class="osc-subtitle">Инвестиции в офисную недвижимость</div>
        <h1 class="osc-title">Расчёт инвестиций в Optima Space</h1>
        
        <!-- Countdown Timer -->
        <div class="osc-countdown" v-if="!countdown.expired">
          <div class="osc-countdown-label">До запуска Optima Space</div>
          <div class="osc-countdown-timer">
            <span class="osc-countdown-value">{{ countdown.months }}</span>
            <span class="osc-countdown-unit">{{ countdown.monthsText }}</span>
            <span class="osc-countdown-value">{{ countdown.days }}</span>
            <span class="osc-countdown-unit">{{ countdown.daysText }}</span>
          </div>
          <div class="osc-countdown-date">01.06.2026 • <span class="osc-status-ok">Стройка идёт по плану</span></div>
        </div>
      </header>

      <!-- How It Works -->
      <section class="osc-how-section">
        <div class="osc-badge-center">
          <span class="osc-top-badge">Умные инвестиции в Optima Space</span>
        </div>
        <p class="osc-how-description">
          <InfoTooltip :text="TOOLTIPS.targetYield" html>
            <span class="osc-how-link">Рассчитайте структуру портфеля для достижения цели 20%+ годовой доходности.</span>
          </InfoTooltip>
        </p>
        <p class="osc-how-note">{{ TOOLTIPS.smartInvesting }}</p>
        <div class="osc-steps-grid">
          <template v-for="(step, index) in howItWorksSteps" :key="index">
            <div class="osc-step-item">
              <component :is="step.icon" :size="28" color="#fff" />
              <div class="osc-step-title">{{ step.title }}</div>
              <div class="osc-step-sub">{{ step.sub }}</div>
            </div>
            <div v-if="index < howItWorksSteps.length - 1" class="osc-step-arrow">→</div>
          </template>
        </div>
      </section>

      <!-- STEP 1: Capital -->
      <section class="osc-card-section">
        <div class="osc-section-header">
          <span class="osc-step-num">1</span>
          <span class="osc-section-title">Ваш инвестиционный капитал</span>
        </div>
        
        <div class="osc-capital-row">
          <span class="osc-capital-label">Сумма для инвестирования</span>
          <div class="osc-capital-input-wrap">
            <input 
              type="text"
              :value="capitalInputValue"
              @input="handleCapitalInput"
              @blur="handleCapitalBlur"
              @focus="handleCapitalFocus"
              class="osc-capital-input"
            />
            <span class="osc-capital-currency">₽</span>
          </div>
        </div>
        
        <CustomSlider 
          v-model="totalCapital"
          :min="1000000"
          :max="100000000"
          :step="500000"
          :color="COLORS.primary"
        />
        
        <div class="osc-slider-labels">
          <span>1 млн ₽</span>
          <span>100 млн ₽</span>
        </div>
        
        <div class="osc-quick-buttons">
          <button 
            v-for="btn in capitalButtons"
            :key="btn.amount"
            :class="['osc-quick-btn', { active: isCapitalButtonActive(btn.amount) }]"
            @click="totalCapital = btn.amount"
          >
            {{ btn.label }}
          </button>
        </div>
      </section>

      <!-- STEP 2: Strategy -->
      <section id="osc-strategy-section" class="osc-card-section">
        <div class="osc-section-header">
          <span class="osc-step-num">2</span>
          <span class="osc-section-title">Выберите стратегию</span>
        </div>

        <!-- Strategy Cards -->
        <div class="osc-strategies-grid">
          <button 
            v-for="(strategy, key) in STRATEGIES"
            :key="key"
            :class="['osc-strategy-card', { active: activeStrategy === key, optimaOnly: key === 'optimaOnly' }]"
            @click="loadStrategy(key)"
          >
            <InfoTooltip :text="strategy.tooltip" :maxWidth="320">
              <div class="osc-strat-name">{{ strategy.name }}</div>
            </InfoTooltip>
            <div class="osc-strat-desc">{{ strategy.description }}</div>
            <div class="osc-strat-target">{{ strategy.target }}</div>
          </button>
        </div>

        <!-- Input Mode Toggle -->
        <div class="osc-mode-toggle">
          <button :class="['osc-mode-btn', { active: inputMode === 'percent' }]" @click="inputMode = 'percent'">
            Ввод в %
          </button>
          <button :class="['osc-mode-btn', { active: inputMode === 'amount' }]" @click="inputMode = 'amount'">
            Ввод в ₽
          </button>
        </div>

        <!-- Allocation Grid -->
        <div class="osc-allocation-grid">
          <!-- Assets List -->
          <div class="osc-assets-list">
            <div class="osc-list-header">
              Распределение активов
              <span v-if="!activeStrategy" class="osc-manual-tag">• вручную</span>
            </div>

            <!-- Asset Items -->
            <div v-for="asset in ASSET_CLASSES" :key="asset.id" class="osc-asset-item">
              <div class="osc-asset-top">
                <div class="osc-asset-left">
                  <span class="osc-asset-dot" :style="{ background: asset.color }"></span>
                  <span 
                    class="osc-asset-tag" 
                    :style="{ 
                      background: asset.tagColor + '30', 
                      color: asset.tagColor, 
                      borderColor: asset.tagColor + '50' 
                    }"
                  >
                    {{ asset.tag }}
                  </span>
                  <InfoTooltip :text="asset.tooltip" html :maxWidth="360">
                    <span class="osc-asset-name">{{ asset.name }}</span>
                  </InfoTooltip>
                </div>
                <div class="osc-asset-right">
                  <span class="osc-asset-amount">{{ formatCurrency(totalCapital * allocations[asset.id] / 100) }}</span>
                  <span class="osc-asset-percent">{{ allocations[asset.id] }}%</span>
                </div>
              </div>
              
              <div 
                class="osc-asset-desc"
                :class="{ 
                  'osc-error-text': asset.id === 'optima' && allocations[asset.id] > 0 && totalCapital * allocations[asset.id] / 100 < OPTIMA_SPACE.minInvestment 
                }"
              >
                {{ asset.id === 'optima' && allocations[asset.id] > 0 && totalCapital * allocations[asset.id] / 100 < OPTIMA_SPACE.minInvestment 
                  ? `Минимум ${formatCurrency(OPTIMA_SPACE.minInvestment)}` 
                  : asset.description 
                }}
              </div>
              
              <div v-if="inputMode === 'percent'" class="osc-slider-wrapper">
                <input 
                  type="range"
                  :value="allocations[asset.id]"
                  :min="0"
                  :max="getSliderMax(asset.id)"
                  :style="{
                    background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${getSliderProgress(asset.id, getSliderMax(asset.id))}%, rgba(255,255,255,0.1) ${getSliderProgress(asset.id, getSliderMax(asset.id))}%, rgba(255,255,255,0.1) 100%)`
                  }"
                  @input="updateAllocation(asset.id, $event.target.value)"
                />
              </div>
              <div v-else class="osc-input-wrapper">
                <CurrencyInput 
                  :modelValue="totalCapital * allocations[asset.id] / 100"
                  :max="totalCapital"
                  @update:modelValue="val => updateAllocation(asset.id, Math.round(val / totalCapital * 100))"
                />
              </div>
              
              <div class="osc-asset-meta">
                <span>Доходность: {{ asset.minYield }}–{{ asset.maxYield }}%</span>
                <span>Риск: {{ asset.risk }}/10</span>
              </div>
            </div>

            <!-- Total Row -->
            <div 
              class="osc-total-row"
              :class="{
                success: portfolioMetrics.totalAllocation === 100,
                error: portfolioMetrics.totalAllocation > 100,
                warning: portfolioMetrics.totalAllocation < 100 && portfolioMetrics.totalAllocation > 0
              }"
            >
              <span>Итого распределено</span>
              <span class="osc-total-percent">{{ portfolioMetrics.totalAllocation }}%</span>
            </div>

            <!-- Advisor Comment -->
            <div 
              class="osc-advisor-comment"
              :class="advisorComment.type"
            >
              {{ advisorComment.text }}
            </div>

            <!-- Auto Distribute -->
            <div v-if="portfolioMetrics.totalAllocation !== 100" class="osc-auto-block">
              <div class="osc-auto-hint" :class="{ error: portfolioMetrics.totalAllocation > 100 }">
                {{ portfolioMetrics.totalAllocation > 100 
                  ? `Превышение на ${portfolioMetrics.totalAllocation - 100}%` 
                  : `Не распределено: ${formatCurrency(totalCapital * (100 - portfolioMetrics.totalAllocation) / 100)}` 
                }}
              </div>
              <button class="osc-auto-btn-3d" @click="autoDistribute">
                <InfoTooltip :text="TOOLTIPS.autoDistribute">
                  {{ portfolioMetrics.totalAllocation > 100 
                    ? '⚖️ Выровнять до 100%' 
                    : `🎯 Авто-распределение (${100 - portfolioMetrics.totalAllocation}%)` 
                  }}
                </InfoTooltip>
              </button>
            </div>
          </div>

          <!-- Chart Column -->
          <div class="osc-chart-column">
            <PortfolioChart :data="chartData" />
            
            <div class="osc-metrics-row">
              <div class="osc-metric-box">
                <div class="osc-m-label">Доходность</div>
                <div class="osc-m-value" :class="{ highlight: portfolioMetrics.yield >= 20 }">
                  {{ portfolioMetrics.totalAllocation > 0 ? formatPercent(portfolioMetrics.yield) : '—' }}
                </div>
              </div>
              <div class="osc-metric-box">
                <div class="osc-m-label">Риск</div>
                <div class="osc-m-value" :class="{ warning: portfolioMetrics.risk > 5 }">
                  {{ portfolioMetrics.totalAllocation > 0 ? `${portfolioMetrics.risk.toFixed(1)}/10` : '—' }}
                </div>
                <div v-if="portfolioMetrics.concentrationRisk > 0" class="osc-m-note">
                  +{{ portfolioMetrics.concentrationRisk }} концентрация
                </div>
              </div>
            </div>
            
            <div class="osc-goal-status" :class="{ success: goalStatus.isSuccess }">
              {{ goalStatus.text }}
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 3: Optima Details -->
      <section v-if="allocations.optima > 0 && isOptimaValid" class="osc-card-section">
        <div class="osc-section-header">
          <span class="osc-step-num">3</span>
          <span class="osc-section-title">Детали инвестиции в Optima Space</span>
        </div>

        <!-- Metrics Grid -->
        <div class="osc-optima-metrics">
          <div class="osc-o-metric highlight-bg">
            <div class="osc-o-label">Ваша инвестиция</div>
            <div class="osc-o-value primary">{{ formatCurrency(optimaInvestment) }}</div>
            <div class="osc-o-sub">{{ optimaShares.toLocaleString() }} акций</div>
          </div>
          <div class="osc-o-metric">
            <div class="osc-o-label">ROI годовых</div>
            <div class="osc-o-value primary">{{ OPTIMA_SPACE.rounds[0].roi }}%</div>
            <div class="osc-o-sub">I раунд</div>
          </div>
          <div class="osc-o-metric">
            <div class="osc-o-label">Окупаемость</div>
            <div class="osc-o-value">{{ OPTIMA_SPACE.paybackMonths }} мес</div>
            <div class="osc-o-sub">возврат дивидендами</div>
          </div>
          <div class="osc-o-metric">
            <div class="osc-o-label">Доход за 4,5 года</div>
            <div class="osc-o-value primary">{{ formatCurrency(optimaIncome) }}</div>
            <div class="osc-o-sub">ROI {{ ((OPTIMA_SPACE.rounds[0].roi / 100) * 4.5 * 100).toFixed(0) }}%</div>
          </div>
        </div>

        <!-- Buyback Guarantee Component -->
        <BuybackGuarantee 
          :investment="optimaInvestment" 
          :shares="optimaShares"
          @scrollToStrategy="scrollToStrategy"
        />
      </section>

      <!-- Warning if Optima < 600k -->
      <section v-if="allocations.optima > 0 && !isOptimaValid" class="osc-warning-section">
        <div class="osc-warning-content">
          <span class="osc-warning-icon">⚠️</span>
          <div>
            <div class="osc-warning-title">Минимальная инвестиция в Optima Space — {{ formatCurrency(OPTIMA_SPACE.minInvestment) }}</div>
            <div class="osc-warning-desc">
              Текущая сумма: {{ formatCurrency(optimaInvestment) }}. 
              Добавьте ещё {{ formatCurrency(OPTIMA_SPACE.minInvestment - optimaInvestment) }} или выберите 0%.
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 4: Comparison -->
      <section class="osc-card-section">
        <div class="osc-section-header">
          <span class="osc-step-num">4</span>
          <span class="osc-section-title">Сравнение инструментов</span>
        </div>
        
        <div class="osc-table-wrapper">
          <table class="osc-comparison-table">
            <thead>
              <tr>
                <th>Инструмент</th>
                <th class="osc-th-center">ROI</th>
                <th class="osc-th-center">Защита</th>
                <th class="osc-th-center">Риск</th>
                <th class="osc-th-center">Доход 4,5г</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="row in comparisonData" 
                :key="row.name"
                :class="{ 'osc-highlight-row': row.highlight }"
              >
                <td>
                  <span v-if="row.highlight" class="osc-dot-primary"></span>
                  {{ row.name }}
                </td>
                <td class="osc-td-center" :class="{ 'osc-primary': row.highlight }">{{ row.yield }}</td>
                <td class="osc-td-center" :class="{ 'osc-primary': row.protection !== 'Нет', 'osc-dim': row.protection === 'Нет' }">{{ row.protection }}</td>
                <td class="osc-td-center" :class="{ 'osc-primary': row.risk <= 2 }">{{ row.risk }}/10</td>
                <td class="osc-td-center">{{ formatCurrency(2000000 * row.mult) }}</td>
                <td class="osc-td-comment">{{ row.comment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- STEP 5: Q&A -->
      <QAModule 
        :totalCapital="totalCapital"
        :allocations="allocations"
        :optimaInvestment="optimaInvestment"
        :portfolioMetrics="portfolioMetrics"
      />

      <!-- CTA Section -->
      <section class="osc-cta-section">
        <div class="osc-cta-label">Ваша персональная рекомендация</div>
        
        <div class="osc-cta-grid">
          <!-- Expected Income -->
          <div class="osc-income-box">
            <div class="osc-income-label">Ожидаемый доход за 4,5 года</div>
            <div class="osc-income-value">
              {{ portfolioMetrics.totalAllocation > 0 
                ? formatCurrency(totalIncome) 
                : '—' 
              }}
            </div>
            <div v-if="portfolioMetrics.totalAllocation > 0 && optimaIncome > 0" class="osc-income-optima">
              Из них Optima Space: <strong>{{ formatCurrency(optimaIncome) }}</strong>
            </div>
            <div v-if="portfolioMetrics.totalAllocation > 0" class="osc-income-note">
              при доходности <span class="osc-bold">{{ formatPercent(portfolioMetrics.yield) }}</span>
            </div>
          </div>
          
          <!-- Portfolio Summary -->
          <div class="osc-portfolio-summary">
            <h3>Портфель {{ formatCurrency(totalCapital) }}</h3>
            <div 
              v-for="item in chartData" 
              :key="item.name"
              class="osc-portfolio-item"
              :class="{ 'osc-optima-row': item.name === 'Optima Space' }"
            >
              <div class="osc-item-name">
                <span class="osc-item-dot" :style="{ background: item.color }"></span>
                <span :class="{ 'osc-text-primary': item.name === 'Optima Space' }">
                  {{ item.name }}
                </span>
              </div>
              <span :class="{ 'osc-text-white': item.name === 'Optima Space' }">
                {{ formatCurrency(item.amount) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="osc-cta-buttons">
          <button 
            class="osc-btn-primary"
            :disabled="!isOptimaValid || optimaInvestment < OPTIMA_SPACE.minInvestment"
            @click="handleInvestClick"
          >
            <Rocket :size="20" />
            Инвестировать в Optima Space
          </button>
          <button 
            class="osc-btn-secondary"
            :disabled="isGeneratingPDF"
            @click="handlePDFClick"
          >
            <FileText :size="20" />
            {{ isGeneratingPDF ? 'Генерация...' : 'Скачать PDF-отчёт' }}
          </button>
        </div>
      </section>

      <!-- Partner Badge -->
      <ModulRostaBadge />

      <!-- Footer -->
      <footer class="osc-footer">
        <p>Калькулятор предоставляет ориентировочные расчёты. Инвестиции связаны с рисками.</p>
      </footer>
    </div>
  </div>
</template>
<style scoped>
/* === BASE === */
.osc-wrapper {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #fff;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.osc-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* === MOBILE WARNING === */
.osc-mobile-warning {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.osc-mobile-card {
  text-align: center;
  padding: 48px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
}

.osc-mobile-card h2 {
  font-size: 20px;
  margin: 24px 0 12px;
  font-weight: 600;
}

.osc-mobile-card p {
  color: #888;
  font-size: 14px;
}

/* === HEADER === */
.osc-header {
  text-align: center;
  margin-bottom: 40px;
}

.osc-subtitle {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #00D9C0;
  margin-bottom: 12px;
}

.osc-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 24px !important;
  padding: 0 !important;
  border: none !important;
  line-height: 1.2;
}

/* Countdown Timer */
.osc-countdown {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 32px;
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 12px;
  margin-top: 8px;
}

.osc-countdown-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.osc-countdown-timer {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.osc-countdown-value {
  font-size: 28px;
  font-weight: 700;
  color: #00D9C0;
}

.osc-countdown-unit {
  font-size: 12px;
  color: #888;
  margin-right: 12px;
}

.osc-countdown-date {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.osc-status-ok {
  color: #00D9C0;
}

/* === HOW IT WORKS === */
.osc-how-section {
  margin-bottom: 32px;
  padding: 32px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
}

.osc-badge-center {
  text-align: center;
  margin-bottom: 12px;
}

.osc-top-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(0,217,192,0.15);
  border: 1px solid rgba(0,217,192,0.4);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.osc-how-description {
  text-align: center;
  font-size: 16px;
  color: #aaa;
  margin: 0 0 8px;
}

.osc-how-link {
  color: #00D9C0;
  cursor: help;
  border-bottom: 1px dashed rgba(0,217,192,0.5);
}

.osc-how-note {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin: 0 0 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.osc-steps-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.osc-step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
}

.osc-step-title {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.osc-step-sub {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

.osc-step-arrow {
  font-size: 24px;
  color: #00D9C0;
  font-weight: 300;
}

/* === CARD SECTION === */
.osc-card-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
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
}

/* === CAPITAL INPUT === */
.osc-capital-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.osc-capital-label {
  font-size: 14px;
  color: #aaa;
}

.osc-capital-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
}

.osc-capital-input {
  width: 160px;
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-align: right;
  outline: none;
}

.osc-capital-currency {
  font-size: 16px;
  color: #888;
}

.osc-slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #666;
  margin-top: 4px;
  margin-bottom: 16px;
}

.osc-quick-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.osc-quick-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  color: #aaa;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-quick-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.25);
}

.osc-quick-btn.active {
  background: rgba(0,217,192,0.15);
  border-color: rgba(0,217,192,0.4);
  color: #00D9C0;
}

/* === STRATEGIES === */
.osc-strategies-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.osc-strategy-card {
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-strategy-card:hover {
  border-color: rgba(0,217,192,0.4);
}

.osc-strategy-card.active {
  background: rgba(0,217,192,0.1);
  border-color: #00D9C0;
}

.osc-strategy-card.optimaOnly {
  background: linear-gradient(135deg, rgba(0,217,192,0.1) 0%, rgba(0,217,192,0.05) 100%);
}

.osc-strategy-card.optimaOnly.active {
  background: linear-gradient(135deg, rgba(0,217,192,0.2) 0%, rgba(0,217,192,0.1) 100%);
}

.osc-strat-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.osc-strat-desc {
  font-size: 11px;
  color: #888;
}

.osc-strat-target {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #00D9C0;
}

/* === MODE TOGGLE === */
.osc-mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.osc-mode-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-mode-btn.active {
  background: rgba(0,217,192,0.15);
  border-color: rgba(0,217,192,0.4);
  color: #00D9C0;
}

/* === ALLOCATION GRID === */
.osc-allocation-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
}

.osc-assets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.osc-list-header {
  font-size: 13px;
  font-weight: 600;
  color: #bbb;
  text-transform: uppercase;
}

.osc-manual-tag {
  color: #F5C542;
  font-weight: 400;
}

/* === ASSET ITEM === */
.osc-asset-item {
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
}

.osc-asset-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.osc-asset-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.osc-asset-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.osc-asset-name {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: help;
}

.osc-asset-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
}

.osc-asset-right {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.osc-asset-amount {
  font-size: 14px;
  color: #aaa;
}

.osc-asset-percent {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  min-width: 40px;
  text-align: right;
}

.osc-asset-desc {
  font-size: 11px;
  color: #777;
  margin-bottom: 10px;
}

.osc-error-text {
  color: #E8192C !important;
}

.osc-slider-wrapper input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  appearance: none;
  cursor: pointer;
  margin-bottom: 8px;
}

.osc-slider-wrapper input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.osc-asset-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #666;
}

/* === TOTAL ROW === */
.osc-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.osc-total-row.success {
  background: rgba(0,217,192,0.15);
  border: 1px solid rgba(0,217,192,0.4);
}

.osc-total-row.error {
  background: rgba(232,25,44,0.15);
  border: 1px solid rgba(232,25,44,0.4);
}

.osc-total-row.warning {
  background: rgba(245,197,66,0.15);
  border: 1px solid rgba(245,197,66,0.4);
}

.osc-total-percent {
  font-size: 18px;
  font-weight: 700;
}

.osc-total-row.success .osc-total-percent { color: #00D9C0; }
.osc-total-row.error .osc-total-percent { color: #E8192C; }
.osc-total-row.warning .osc-total-percent { color: #F5C542; }

/* === ADVISOR COMMENT === */
.osc-advisor-comment {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.osc-advisor-comment.success {
  background: rgba(0,217,192,0.1);
  color: #00D9C0;
  border-left: 3px solid #00D9C0;
}

.osc-advisor-comment.info {
  background: rgba(59,130,246,0.1);
  color: #3B82F6;
  border-left: 3px solid #3B82F6;
}

.osc-advisor-comment.warning {
  background: rgba(245,197,66,0.1);
  color: #F5C542;
  border-left: 3px solid #F5C542;
}

.osc-advisor-comment.error {
  background: rgba(232,25,44,0.1);
  color: #E8192C;
  border-left: 3px solid #E8192C;
}

.osc-advisor-comment.neutral {
  background: rgba(255,255,255,0.05);
  color: #888;
  border-left: 3px solid #555;
}

/* === AUTO DISTRIBUTE === */
.osc-auto-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
}

.osc-auto-hint {
  font-size: 12px;
  color: #F5C542;
}

.osc-auto-hint.error {
  color: #E8192C;
}

.osc-auto-btn-3d {
  padding: 10px 20px;
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
}

.osc-auto-btn-3d:hover {
  background: linear-gradient(180deg, #00D9C0 0%, #00a67d 100%);
  color: #000;
  border-color: #00D9C0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,217,192,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
}

/* === CHART COLUMN === */
.osc-chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.osc-metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
}

.osc-metric-box {
  padding: 16px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  text-align: center;
}

.osc-m-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.osc-m-value {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.osc-m-value.highlight { color: #00D9C0; }
.osc-m-value.warning { color: #F5C542; }

.osc-m-note {
  font-size: 10px;
  color: #666;
  margin-top: 4px;
}

.osc-goal-status {
  margin-top: 12px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(245,197,66,0.15);
  color: #F5C542;
  text-align: center;
}

.osc-goal-status.success {
  background: rgba(0,217,192,0.15);
  border-color: rgba(0,217,192,0.4);
  color: #00D9C0;
}

/* === OPTIMA METRICS === */
.osc-optima-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.osc-o-metric {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.osc-o-metric.highlight-bg {
  background: rgba(0,217,192,0.15);
  border-color: rgba(0,217,192,0.3);
}

.osc-o-label { 
  font-size: 11px; 
  color: #aaa; 
  text-transform: uppercase; 
  margin-bottom: 6px; 
}

.osc-o-value { 
  font-size: 28px; 
  font-weight: 600; 
}

.osc-o-value.primary { color: #00D9C0; }

.osc-o-sub { 
  font-size: 11px; 
  color: #888; 
  margin-top: 4px; 
}

/* === WARNING SECTION === */
.osc-warning-section {
  margin-bottom: 24px;
  padding: 24px;
  background: rgba(232,25,44,0.15);
  border: 1px solid rgba(232,25,44,0.4);
  border-radius: 12px;
}

.osc-warning-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.osc-warning-icon { font-size: 24px; }
.osc-warning-title { font-size: 14px; font-weight: 600; color: #E8192C; }
.osc-warning-desc { font-size: 12px; color: #aaa; margin-top: 4px; }

/* === COMPARISON TABLE === */
.osc-table-wrapper { 
  overflow-x: auto; 
}

.osc-comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin: 0 auto;
}

.osc-comparison-table th {
  text-align: left;
  padding: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  color: #888;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
}

.osc-th-center { text-align: center !important; }

.osc-comparison-table td {
  padding: 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  vertical-align: middle;
}

.osc-td-center { text-align: center; }

.osc-td-comment {
  font-size: 11px;
  color: #888;
  max-width: 250px;
}

.osc-highlight-row { 
  background: rgba(0,217,192,0.08); 
}

.osc-highlight-row td:first-child {
  font-weight: 600;
  color: #00D9C0;
}

.osc-dot-primary {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #00D9C0;
  border-radius: 50%;
  margin-right: 8px;
}

.osc-primary { color: #00D9C0; }
.osc-dim { color: #666; }

/* === CTA SECTION === */
.osc-cta-section {
  background: linear-gradient(135deg, rgba(0,217,192,0.15) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid rgba(0,217,192,0.4);
  border-radius: 16px;
  padding: 32px;
}

.osc-cta-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #00D9C0;
  margin-bottom: 20px;
}

.osc-cta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.osc-portfolio-summary h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px !important;
  border: none !important;
  padding: 0 !important;
}

.osc-portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.osc-portfolio-item.osc-optima-row {
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 8px;
  padding: 10px 12px;
  margin: -10px -12px;
  margin-bottom: 4px;
}

.osc-item-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.osc-item-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.osc-item-name span:not(.osc-item-dot) { 
  font-size: 13px; 
  color: #aaa; 
}

.osc-text-primary { 
  color: #00D9C0 !important; 
  font-weight: 600; 
}

.osc-text-white { 
  color: #fff !important; 
  font-weight: 600; 
}

.osc-portfolio-item span:last-child { 
  font-size: 14px; 
  font-weight: 500; 
  color: #aaa; 
}

.osc-income-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 32px;
}

.osc-income-label { 
  font-size: 12px; 
  color: #aaa; 
  margin-bottom: 8px; 
}

.osc-income-value { 
  font-size: 42px; 
  font-weight: 600; 
  color: #00D9C0; 
}

.osc-income-optima {
  font-size: 14px;
  color: #888;
  margin-top: 12px;
}

.osc-income-optima strong {
  color: #00D9C0;
}

.osc-income-note { 
  font-size: 13px; 
  color: #888; 
  margin-top: 8px; 
}

.osc-bold { font-weight: 600; }

/* === CTA BUTTONS === */
.osc-cta-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.osc-btn-primary,
.osc-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 32px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease !important;
}

.osc-btn-primary {
  background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%);
  border: none;
  color: #000;
}

.osc-btn-primary:not(:disabled):hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0,217,192,0.4) !important;
  filter: brightness(1.1);
}

.osc-btn-primary:disabled {
  background: #444;
  color: #888;
  cursor: not-allowed;
}

.osc-btn-secondary {
  background: transparent;
  border: 2px solid #00D9C0;
  color: #00D9C0;
}

.osc-btn-secondary:not(:disabled):hover {
  background: rgba(0,217,192,0.15) !important;
  transform: translateY(-2px) !important;
}

.osc-btn-secondary:disabled {
  border-color: #555;
  color: #666;
  cursor: not-allowed;
}

/* === FOOTER === */
.osc-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 11px;
  margin-top: 24px;
}

.osc-footer p { 
  margin: 0; 
  color: #888; 
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .osc-steps-grid { grid-template-columns: repeat(4, 1fr); }
  .osc-step-arrow { display: none; }
  .osc-allocation-grid { grid-template-columns: 1fr; }
  .osc-chart-column { order: -1; margin-bottom: 24px; }
  .osc-optima-metrics { grid-template-columns: repeat(2, 1fr); }
  .osc-strategies-grid { grid-template-columns: repeat(2, 1fr); }
  .osc-cta-grid { grid-template-columns: 1fr; }
  .osc-cta-buttons { grid-template-columns: 1fr; }
}
</style>
