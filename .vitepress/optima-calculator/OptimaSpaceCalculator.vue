<script setup>
import { ref, computed, onMounted } from 'vue'
import { Wallet, Building2, FileText, Rocket, ShieldCheck, Scale, Target, TrendingUp, PieChart, Clock } from './icons.js'
import { OPTIMA_SPACE, ASSET_CLASSES, STRATEGIES, COLORS, TOOLTIPS, COMPARISON_COMMENTS, ANIK_GROUP, PROFIT_ROOMS } from './constants.js'
import { formatCurrency, formatPercent } from './utils.js'
import { usePortfolio } from './usePortfolio.js'
import { usePDFGenerator } from './usePDFGenerator.js'

import InfoTooltip from './InfoTooltip.vue'
import CustomSlider from './CustomSlider.vue'
import CurrencyInput from './CurrencyInput.vue'
import PortfolioChart from './PortfolioChart.vue'
import BuybackGuarantee from './BuybackGuarantee.vue'
import QAModule from './QAModule.vue'
import AccessModal from './AccessModal.vue'
import ModulRostaBadge from './ModulRostaBadge.vue'

// State
const totalCapital = ref(4000000)
const inputMode = ref('percent')
const showModal = ref(false)
const modalAction = ref(null)

const { generatePDF } = usePDFGenerator()

const {
  allocations,
  selectedStrategy,
  isManualMode,
  optimaValidationError,
  totalAllocation,
  portfolioMetrics,
  advisorComment,
  chartData,
  applyStrategy,
  autoDistribute,
  setAllocation
} = usePortfolio(totalCapital)

// Computed
const capitalSliderProgress = computed(() => {
  const min = 1000000
  const max = 100000000
  return ((totalCapital.value - min) / (max - min)) * 100
})

const optimaInvestment = computed(() => (totalCapital.value * allocations.value.optima) / 100)
const optimaShares = computed(() => Math.floor(optimaInvestment.value / OPTIMA_SPACE.shareNominal))
const totalExpectedIncome = computed(() => totalCapital.value * (portfolioMetrics.value.yield / 100) * 4.5)
const optimaIncome = computed(() => optimaInvestment.value * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5)

// Countdown to launch - flip clock style
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
  const launch = new Date(OPTIMA_SPACE.launchDate)
  const now = new Date()
  const diff = launch - now
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, launched: true }
  
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return { 
    days: totalDays, 
    hours, 
    minutes, 
    launched: false,
    daysText: pluralize(totalDays, ['ДЕНЬ', 'ДНЯ', 'ДНЕЙ']),
    hoursText: pluralize(hours, ['ЧАС', 'ЧАСА', 'ЧАСОВ']),
    minutesText: pluralize(minutes, ['МИНУТА', 'МИНУТЫ', 'МИНУТ'])
  }
})

const capitalButtons = [
  { label: '> 3 млн', value: 3000000 },
  { label: '> 5 млн', value: 5000000 },
  { label: '> 10 млн', value: 10000000 },
  { label: '> 30 млн', value: 30000000 },
  { label: '> 50 млн', value: 50000000 },
  { label: '> 100 млн', value: 100000000 }
]

const isCapitalButtonActive = (btnValue) => {
  return totalCapital.value >= btnValue
}

const setCapital = (value) => {
  totalCapital.value = value
}

const handleStrategyClick = (key) => {
  applyStrategy(key)
}

const handleSliderChange = (assetId, value) => {
  setAllocation(assetId, value)
}

const handleAmountChange = (assetId, amount) => {
  const percent = totalCapital.value > 0 ? (amount / totalCapital.value) * 100 : 0
  setAllocation(assetId, Math.round(percent))
}

const getAssetAmount = (assetId) => {
  return (totalCapital.value * allocations.value[assetId]) / 100
}

// Modal & Actions
const checkUserData = () => {
  try {
    const saved = sessionStorage.getItem('osc_user_data')
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    return null
  }
}

const handleInvestClick = () => {
  const userData = checkUserData()
  if (userData) {
    openTelegram(userData)
  } else {
    modalAction.value = 'invest'
    showModal.value = true
  }
}

const handlePDFClick = () => {
  const userData = checkUserData()
  if (userData) {
    downloadPDF(userData)
  } else {
    modalAction.value = 'pdf'
    showModal.value = true
  }
}

const handleModalSubmit = (userData) => {
  showModal.value = false
  if (modalAction.value === 'invest') {
    openTelegram(userData)
  } else if (modalAction.value === 'pdf') {
    downloadPDF(userData)
  }
}

const openTelegram = (userData) => {
  const message = encodeURIComponent(
    `Заявка № ${userData.applicationNumber}\n` +
    `Имя: ${userData.fullName}\n` +
    `Телефон: ${userData.phone}\n` +
    `Капитал: ${formatCurrency(totalCapital.value)}\n` +
    `Optima Space: ${allocations.value.optima}% (${formatCurrency(optimaInvestment.value)})`
  )
  window.open(`https://t.me/paimukov?text=${message}`, '_blank')
}

const downloadPDF = async (userData) => {
  await generatePDF({
    totalCapital: totalCapital.value,
    allocations: allocations.value,
    portfolioMetrics: portfolioMetrics.value,
    optimaInvestment: optimaInvestment.value,
    chartData: chartData.value,
    userName: userData.fullName,
    applicationNumber: userData.applicationNumber,
    applicationDate: userData.applicationDate
  })
}

const scrollToStrategy = () => {
  document.querySelector('.osc-strategy-section')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  applyStrategy('balanced')
})
</script>

<template>
  <div class="osc-calculator">
    <!-- Header -->
    <header class="osc-header">
      <p class="osc-header-subtitle">Инвестиции в офисную недвижимость</p>
      <h1 class="osc-header-title">Расчёт инвестиций в Optima Space</h1>
    </header>

    <!-- Countdown Block - Flip Clock Style -->
    <section class="osc-countdown-section">
      <div class="osc-countdown-heading">До запуска Optima Space в Самаре</div>
      <div class="osc-countdown-content">
        <div class="osc-countdown-timer">
          <div class="osc-flip-card">
            <div class="osc-flip-value">{{ String(countdown.days).padStart(2, '0') }}</div>
            <div class="osc-flip-label">{{ countdown.daysText }}</div>
          </div>
          <div class="osc-flip-card">
            <div class="osc-flip-value">{{ String(countdown.hours).padStart(2, '0') }}</div>
            <div class="osc-flip-label">{{ countdown.hoursText }}</div>
          </div>
          <div class="osc-flip-card">
            <div class="osc-flip-value">{{ String(countdown.minutes).padStart(2, '0') }}</div>
            <div class="osc-flip-label">{{ countdown.minutesText }}</div>
          </div>
        </div>
        <div class="osc-countdown-status">
          <Clock :size="16" color="#00D9C0" />
          <span>Дата запуска: 1 июня 2026</span>
          <span class="osc-status-badge">Стройка идёт по плану</span>
        </div>
      </div>
    </section>

    <!-- Intro + Features Block -->
    <section class="osc-intro-features-block">
      <p class="osc-intro-text">
        Этот калькулятор фокусируется на 
        <InfoTooltip text="Сервисные офисы — готовые к работе рабочие места с мебелью, интернетом и сервисами. Арендатор платит только за место, без забот об инфраструктуре." :maxWidth="480">
          <span class="osc-highlight-text">Optima Space</span>
        </InfoTooltip>
         — сервисных офисах 
        <InfoTooltip text="Класс А — высший стандарт офисной недвижимости: современное здание, престижная локация, профессиональное управление, высокое качество отделки." :maxWidth="480">
          <span class="osc-highlight-text">класса А</span>
        </InfoTooltip>
         в Самаре с 
        <InfoTooltip :text="TOOLTIPS.buybackGuarantee" :html="true" :maxWidth="520">
          <span class="osc-highlight-text">гарантией обратного выкупа</span>
        </InfoTooltip>. 
        Мы помогаем инвесторам рассчитать оптимальную долю Optima Space в их портфеле для достижения 
        <InfoTooltip text="20%+ годовых — целевая доходность портфеля, достижимая при включении Optima Space (36% годовых) в сочетании с более консервативными активами." :maxWidth="480">
          <span class="osc-highlight-text">целевой доходности 20%+ годовых</span>
        </InfoTooltip>.
      </p>

      <div class="osc-features">
        <div class="osc-feature">
          <InfoTooltip text="Укажите общую сумму, которую готовы инвестировать. Минимальный порог для Optima Space — 500 000 ₽ (1000 акций)." :maxWidth="420">
            <div class="osc-feature-icon-wrap">
              <Wallet :size="28" color="#00D9C0" />
            </div>
          </InfoTooltip>
          <span class="osc-feature-title">Ваш капитал</span>
          <span class="osc-feature-sub">Сколько готовы инвестировать</span>
        </div>
        <div class="osc-feature-arrow">→</div>
        <div class="osc-feature">
          <InfoTooltip text="Распределите капитал между классами активов: офисы, склады, ритейл, облигации, акции. Калькулятор рассчитает доходность и риск." :maxWidth="420">
            <div class="osc-feature-icon-wrap">
              <Scale :size="28" color="#00D9C0" />
            </div>
          </InfoTooltip>
          <span class="osc-feature-title">Распределите активы</span>
          <span class="osc-feature-sub">Офисы, склады, ритейл, резерв</span>
        </div>
        <div class="osc-feature-arrow">→</div>
        <div class="osc-feature">
          <InfoTooltip text="Узнайте детали инвестиции в Optima Space: количество акций, ожидаемые дивиденды, гарантии выкупа, покрытие залогом." :maxWidth="420">
            <div class="osc-feature-icon-wrap">
              <Building2 :size="28" color="#00D9C0" />
            </div>
          </InfoTooltip>
          <span class="osc-feature-title">Детали Optima Space</span>
          <span class="osc-feature-sub">Акции, дивиденды, гарантии</span>
        </div>
        <div class="osc-feature-arrow">→</div>
        <div class="osc-feature">
          <InfoTooltip text="Скачайте персональный PDF-отчёт с вашей инвестиционной стратегией, расчётами доходности и всеми деталями проекта." :maxWidth="420">
            <div class="osc-feature-icon-wrap">
              <FileText :size="28" color="#00D9C0" />
            </div>
          </InfoTooltip>
          <span class="osc-feature-title">Скачайте отчёт</span>
          <span class="osc-feature-sub">Персональная стратегия в PDF</span>
        </div>
      </div>
    </section>

    <!-- Project Passport -->
    <section class="osc-passport-section">
      <div class="osc-passport-header">
        <span class="osc-passport-title">Паспорт проекта Optima Space</span>
        <span class="osc-passport-badge">{{ OPTIMA_SPACE.buildingClass }} класс</span>
      </div>
      
      <div class="osc-passport-grid">
        <div class="osc-passport-block">
          <div class="osc-pp-title">Основные параметры</div>
          <div class="osc-pp-row">
            <span>Локация</span>
            <span>{{ OPTIMA_SPACE.location }}</span>
          </div>
          <div class="osc-pp-row">
            <span>Площадь</span>
            <span>{{ OPTIMA_SPACE.area.toLocaleString() }} кв.м</span>
          </div>
          <div class="osc-pp-row">
            <span>Рабочих мест</span>
            <span>{{ OPTIMA_SPACE.workplaces }}</span>
          </div>
          <div class="osc-pp-row">
            <span>Срок строительства</span>
            <span>{{ OPTIMA_SPACE.constructionMonths }} мес</span>
          </div>
        </div>
        
        <div class="osc-passport-block">
          <div class="osc-pp-title">Финансы</div>
          <div class="osc-pp-row">
            <span>Общие инвестиции</span>
            <span>{{ formatCurrency(OPTIMA_SPACE.totalBudget) }}</span>
          </div>
          <div class="osc-pp-row">
            <span>От инвесторов</span>
            <span>{{ formatCurrency(OPTIMA_SPACE.investorsShare) }}</span>
          </div>
          <div class="osc-pp-row">
            <span>ROI (I раунд)</span>
            <span class="osc-pp-highlight">{{ OPTIMA_SPACE.rounds[0].roi }}% годовых</span>
          </div>
          <div class="osc-pp-row">
            <span>Окупаемость</span>
            <span class="osc-pp-highlight">{{ OPTIMA_SPACE.paybackMonths }} мес</span>
          </div>
        </div>
        
        <div class="osc-passport-block">
          <div class="osc-pp-title">Гарантии</div>
          <div class="osc-pp-row">
            <span>Обратный выкуп</span>
            <span>через {{ (OPTIMA_SPACE.buybackMonths / 12).toFixed(1) }} года</span>
          </div>
          <div class="osc-pp-row">
            <span>Мин. цена выкупа</span>
            <span>{{ OPTIMA_SPACE.buybackMinPrice }}₽/акция</span>
          </div>
          <div class="osc-pp-row">
            <span>Залог</span>
            <span>{{ OPTIMA_SPACE.collateral }} кв.м</span>
          </div>
          <div class="osc-pp-row">
            <span>Стоимость залога</span>
            <span>~{{ formatCurrency(OPTIMA_SPACE.collateralValue) }}</span>
          </div>
        </div>
        
        <div class="osc-passport-block">
          <div class="osc-pp-title">Компания</div>
          <div class="osc-pp-row">
            <span>ГК "Аник"</span>
            <span>{{ ANIK_GROUP.yearsOnMarket }} лет на рынке</span>
          </div>
          <div class="osc-pp-row">
            <span>Объектов</span>
            <span>{{ ANIK_GROUP.objects }} в управлении</span>
          </div>
          <div class="osc-pp-row">
            <span>Выручка 2024</span>
            <span>{{ formatCurrency(ANIK_GROUP.revenue2024) }}</span>
          </div>
          <div class="osc-pp-row">
            <span>Прибыль 2024</span>
            <span>{{ formatCurrency(ANIK_GROUP.profit2024) }}</span>
          </div>
        </div>
      </div>
      
      <div class="osc-passport-proof">
        <div class="osc-pp-proof-title">✓ Успешный кейс: {{ PROFIT_ROOMS.name }}</div>
        <div class="osc-pp-proof-metrics">
          <span>Площадь: {{ PROFIT_ROOMS.area }} кв.м</span>
          <span>Заполняемость: {{ PROFIT_ROOMS.occupancy }}%</span>
          <span>Прибыль: {{ formatCurrency(PROFIT_ROOMS.monthlyProfit) }}/мес</span>
        </div>
      </div>
    </section>

    <!-- Step 1: Capital -->
    <section class="osc-card-section">
      <div class="osc-section-header">
        <span class="osc-step-num">1</span>
        <span class="osc-section-title">ВАШ ИНВЕСТИЦИОННЫЙ КАПИТАЛ</span>
      </div>
      
      <div class="osc-capital-row">
        <span class="osc-capital-label">Сумма для инвестирования</span>
        <CurrencyInput v-model="totalCapital" :max="500000000" class="osc-capital-input" />
      </div>
      
      <div class="osc-capital-slider-wrap">
        <input 
          type="range" 
          :value="totalCapital" 
          @input="totalCapital = Number($event.target.value)"
          min="1000000"
          max="100000000"
          step="100000"
          class="osc-capital-slider"
          :style="{ '--progress': capitalSliderProgress + '%' }"
        />
        <div class="osc-slider-labels">
          <span>1 млн ₽</span>
          <span>100 млн ₽</span>
        </div>
      </div>
      
      <div class="osc-capital-buttons">
        <button 
          v-for="btn in capitalButtons" 
          :key="btn.value"
          class="osc-cap-btn"
          :class="{ active: isCapitalButtonActive(btn.value) }"
          @click="setCapital(btn.value)"
        >
          {{ btn.label }}
        </button>
      </div>
    </section>

    <!-- Step 2: Strategy -->
    <section class="osc-card-section osc-strategy-section">
      <div class="osc-section-header">
        <span class="osc-step-num">2</span>
        <span class="osc-section-title">Выберите стратегию</span>
      </div>
      
      <div class="osc-strategy-grid">
        <InfoTooltip 
          v-for="(strategy, key) in STRATEGIES" 
          :key="key"
          :text="strategy.tooltip || strategy.description"
          :maxWidth="450"
        >
          <div 
            class="osc-strategy-card"
            :class="{ active: selectedStrategy === key }"
            @click="handleStrategyClick(key)"
          >
            <div class="osc-str-name">{{ strategy.name }}</div>
            <div class="osc-str-target">{{ strategy.target }}</div>
            <div class="osc-str-desc">{{ strategy.description }}</div>
          </div>
        </InfoTooltip>
      </div>

      <!-- Mode Toggle -->
      <div class="osc-mode-toggle">
        <button 
          :class="{ active: inputMode === 'percent' }"
          @click="inputMode = 'percent'"
        >%</button>
        <button 
          :class="{ active: inputMode === 'amount' }"
          @click="inputMode = 'amount'"
        >₽</button>
      </div>

      <!-- Asset Allocation -->
      <div class="osc-allocation-section">
        <div class="osc-alloc-label">
          РАСПРЕДЕЛИТЕ АКТИВЫ ({{ inputMode === 'percent' ? 'в процентах' : 'в рублях' }})
          <span v-if="isManualMode" class="osc-manual-badge">Ручной режим</span>
        </div>
        
        <div class="osc-allocation-grid">
          <div class="osc-alloc-list">
            <div v-for="asset in ASSET_CLASSES" :key="asset.id" class="osc-alloc-item">
              <div class="osc-alloc-header">
                <span class="osc-asset-name">{{ asset.name }}</span>
                <span class="osc-asset-tag" :style="{ background: asset.tagColor }">{{ asset.tag }}</span>
                <span class="osc-asset-value" :style="{ color: asset.color }">
                  <template v-if="inputMode === 'percent'">{{ allocations[asset.id] }}%</template>
                  <template v-else>{{ formatCurrency(getAssetAmount(asset.id)) }}</template>
                </span>
              </div>
              
              <div class="osc-alloc-controls">
                <CustomSlider 
                  v-if="inputMode === 'percent'"
                  :modelValue="allocations[asset.id]"
                  @update:modelValue="handleSliderChange(asset.id, $event)"
                  :max="100"
                  :color="asset.color"
                />
                <CurrencyInput 
                  v-else
                  :modelValue="getAssetAmount(asset.id)"
                  @update:modelValue="handleAmountChange(asset.id, $event)"
                  :max="totalCapital"
                />
              </div>
              
              <!-- Предупреждение о минимуме для Optima Space -->
              <div v-if="asset.id === 'optima' && optimaValidationError" class="osc-optima-warning">
                ⚠️ {{ optimaValidationError }}
              </div>
              
              <div class="osc-alloc-meta" :style="{ color: asset.color + '99' }">
                <span>Доходность: {{ asset.minYield }}-{{ asset.maxYield }}%</span>
                <span>Риск: {{ asset.risk }}/10</span>
              </div>
            </div>
          </div>

          <div class="osc-alloc-summary">
            <PortfolioChart :data="chartData" :size="180" />
            
            <div class="osc-metrics-grid">
              <div class="osc-metric">
                <div class="osc-metric-label">Доходность</div>
                <div class="osc-metric-value" :class="{ highlight: portfolioMetrics.yield >= 20 }">
                  {{ portfolioMetrics.yield.toFixed(1) }}%
                </div>
              </div>
              <div class="osc-metric">
                <div class="osc-metric-label">Риск</div>
                <div class="osc-metric-value">{{ portfolioMetrics.risk.toFixed(1) }}/10</div>
              </div>
            </div>

            <InfoTooltip :text="TOOLTIPS.targetYield" :maxWidth="400">
              <div class="osc-target-badge" :class="{ achieved: portfolioMetrics.yield >= 20 }">
                <Target :size="16" />
                <span>Цель 20%+ доходности</span>
              </div>
            </InfoTooltip>
          </div>
        </div>

        <!-- Total & Auto-distribute -->
        <div class="osc-alloc-footer">
          <div class="osc-total-row">
            <span>Итого распределено:</span>
            <span class="osc-total-value" :class="{ over: totalAllocation > 100, under: totalAllocation < 100 }">
              {{ totalAllocation }}%
            </span>
          </div>
          
          <!-- Advisor Comment -->
          <div class="osc-advisor-comment" :class="advisorComment.type">
            {{ advisorComment.text }}
          </div>
          
          <button class="osc-auto-btn" @click="autoDistribute">
            Авто-распределение ({{ 100 - totalAllocation }}%)
          </button>
        </div>
      </div>
    </section>

    <!-- Step 3: Optima Details -->
    <section v-if="allocations.optima > 0" class="osc-card-section">
      <div class="osc-section-header">
        <span class="osc-step-num">3</span>
        <span class="osc-section-title">Детали инвестиции в Optima Space</span>
      </div>

      <div class="osc-optima-metrics">
        <div class="osc-opt-metric">
          <div class="osc-opt-label">Ваша инвестиция</div>
          <div class="osc-opt-value primary">{{ formatCurrency(optimaInvestment) }}</div>
        </div>
        <div class="osc-opt-metric">
          <div class="osc-opt-label">Доходность (I раунд)</div>
          <div class="osc-opt-value">{{ OPTIMA_SPACE.rounds[0].roi }}%</div>
        </div>
        <div class="osc-opt-metric">
          <div class="osc-opt-label">Окупаемость</div>
          <div class="osc-opt-value">{{ OPTIMA_SPACE.paybackMonths }} мес</div>
        </div>
        <div class="osc-opt-metric">
          <div class="osc-opt-label">Доход за 4,5 года</div>
          <div class="osc-opt-value primary">{{ formatCurrency(optimaIncome) }}</div>
        </div>
      </div>

      <BuybackGuarantee 
        :investment="optimaInvestment" 
        :shares="optimaShares"
        @scrollToStrategy="scrollToStrategy"
      />
    </section>

    <!-- Step 4: Comparison Table -->
    <section class="osc-card-section">
      <div class="osc-section-header">
        <span class="osc-step-num">4</span>
        <span class="osc-section-title">Сравнение инструментов</span>
      </div>

      <div class="osc-comparison-table-wrap">
        <table class="osc-comparison-table">
          <thead>
            <tr>
              <th>Инструмент</th>
              <th>Доля</th>
              <th>Доходность</th>
              <th>Риск</th>
              <th>Ликвидность</th>
              <th>Гарантии</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="asset in ASSET_CLASSES" :key="asset.id" :class="{ highlight: asset.id === 'optima' }">
              <td>
                <span class="osc-tbl-asset-dot" :style="{ background: asset.color }"></span>
                {{ asset.name }}
              </td>
              <td>{{ allocations[asset.id] }}%</td>
              <td>{{ asset.minYield }}-{{ asset.maxYield }}%</td>
              <td>{{ asset.risk }}/10</td>
              <td>{{ asset.id === 'deposits' ? 'Высокая' : asset.id === 'bonds' ? 'Средняя' : 'Низкая' }}</td>
              <td :class="{ negative: asset.id !== 'optima' && asset.id !== 'deposits' }">
                {{ asset.id === 'optima' ? 'Выкуп + Залог' : asset.id === 'deposits' ? 'АСВ 1.4 млн' : 'Нет' }}
              </td>
              <td class="osc-tbl-comment">{{ COMPARISON_COMMENTS[asset.id] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Step 5: Q&A -->
    <QAModule 
      :totalCapital="totalCapital"
      :allocations="allocations"
      :optimaInvestment="optimaInvestment"
      :portfolioMetrics="portfolioMetrics"
    />

    <!-- Final Summary - Two columns: Portfolio | Income -->
    <section class="osc-summary-section">
      <div class="osc-summary-grid">
        <!-- Left: Portfolio -->
        <div class="osc-portfolio-block">
          <h3 class="osc-block-title">Портфель {{ formatCurrency(totalCapital) }}</h3>
          <div class="osc-portfolio-list">
            <div 
              v-for="item in chartData" 
              :key="item.name" 
              class="osc-portfolio-row"
              :class="{ 'osc-optima-highlight': item.name === 'Optima Space' }"
            >
              <span class="osc-row-dot" :style="{ background: item.color }"></span>
              <span class="osc-row-name">{{ item.name }}</span>
              <span class="osc-row-amount">{{ formatCurrency(item.amount) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Right: Income -->
        <div class="osc-income-block">
          <h3 class="osc-block-title">Ожидаемый доход за 4,5 года</h3>
          <div class="osc-income-value">{{ formatCurrency(totalExpectedIncome) }}</div>
          <div v-if="allocations.optima > 0" class="osc-optima-income">
            <span class="osc-optima-glow"></span>
            <span>Из них Optima Space: <strong>{{ formatCurrency(optimaIncome) }}</strong></span>
          </div>
          <div class="osc-income-yield">
            при доходности <strong>{{ portfolioMetrics.yield.toFixed(1) }}%</strong>
          </div>
        </div>
      </div>

      <div class="osc-action-buttons">
        <button class="osc-btn-primary" @click="handleInvestClick">
          <Rocket :size="20" />
          Инвестировать в Optima Space
        </button>
        <button class="osc-btn-secondary" @click="handlePDFClick">
          <FileText :size="20" />
          Скачать PDF-отчёт
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="osc-footer">
      <p>Данный расчёт носит информационный характер. Инвестиции связаны с рисками.</p>
    </footer>

    <ModulRostaBadge />

    <!-- Access Modal -->
    <AccessModal 
      :show="showModal"
      @close="showModal = false"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<style>
/* Main Container */
.osc-calculator {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #fff;
}

/* Header */
.osc-header {
  text-align: center;
  margin-bottom: 32px;
}

.osc-header-subtitle {
  font-size: 14px;
  color: #00D9C0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.osc-header-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

/* Countdown - Flip Clock Style */
.osc-countdown-section {
  position: relative;
  margin-bottom: 32px;
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid transparent;
  background-image: linear-gradient(#2a2a2a, #1a1a1a), linear-gradient(135deg, rgba(0,217,192,0.3), rgba(0,217,192,0.05));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

/* Защита от VitePress стилей */
.osc-countdown-section .osc-countdown-heading {
  all: unset;
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin-bottom: 16px;
}

.osc-countdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  margin-bottom: 24px;
}

.osc-countdown-content {
  text-align: center;
}

.osc-countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.osc-flip-card {
  background: linear-gradient(180deg, rgba(0,217,192,0.15) 0%, rgba(0,217,192,0.08) 50%, rgba(0,217,192,0.05) 50%, rgba(0,217,192,0.02) 100%);
  border-radius: 12px;
  padding: 20px 24px;
  min-width: 100px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,217,192,0.2);
  border: 1px solid rgba(0,217,192,0.3);
  position: relative;
}

.osc-flip-card::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: rgba(0,0,0,0.3);
}

.osc-flip-value {
  font-family: 'SF Mono', Monaco, 'Inconsolata', monospace;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  text-align: center;
}

.osc-flip-label {
  font-size: 11px;
  color: #00D9C0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 12px;
  font-weight: 600;
  text-align: center;
}

.osc-countdown-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
  font-size: 13px;
  color: #aaa;
}

.osc-status-badge {
  padding: 4px 12px;
  background: rgba(0,217,192,0.15);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 20px;
  color: #00D9C0;
  font-size: 11px;
  font-weight: 600;
}

/* Intro Section */
/* Intro + Features Block */
.osc-intro-features-block {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  text-align: center;
}

.osc-intro-features-block .osc-intro-text {
  font-size: 15px;
  line-height: 1.8;
  color: #bbb;
  max-width: 800px;
  margin: 0 auto 24px;
}

.osc-intro-features-block .osc-features {
  margin-bottom: 0;
}

.osc-intro-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 0 20px;
}

.osc-intro-text {
  font-size: 15px;
  line-height: 1.8;
  color: #bbb;
  max-width: 800px;
  margin: 0 auto;
}

.osc-highlight-text {
  color: #00D9C0;
  font-weight: 500;
  border-bottom: 1px dashed rgba(0,217,192,0.4);
  cursor: help;
}

/* Features with Arrows */
.osc-features {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.osc-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  text-align: center;
  flex: 0 0 180px;
  min-height: 130px;
}

.osc-feature-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(0,217,192,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.osc-feature-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.osc-feature-sub {
  font-size: 11px;
  color: #888;
  line-height: 1.4;
}

.osc-feature-arrow {
  font-size: 24px;
  color: #00D9C0;
  font-weight: 300;
  padding-top: 40px;
}

/* Project Passport */
.osc-passport-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.osc-passport-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.osc-passport-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.osc-passport-badge {
  padding: 4px 12px;
  background: rgba(0,217,192,0.15);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 20px;
  font-size: 12px;
  color: #00D9C0;
  font-weight: 600;
}

.osc-passport-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.osc-passport-block {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 16px;
}

.osc-pp-title {
  font-size: 12px;
  font-weight: 600;
  color: #00D9C0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.osc-pp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.osc-pp-row:last-child {
  border-bottom: none;
}

.osc-pp-row span:first-child {
  color: #888;
}

.osc-pp-row span:last-child {
  color: #fff;
  font-weight: 500;
  text-align: right;
}

.osc-pp-highlight {
  color: #00D9C0 !important;
}

.osc-passport-proof {
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 10px;
  padding: 16px;
}

.osc-pp-proof-title {
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
  margin-bottom: 10px;
}

.osc-pp-proof-metrics {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #aaa;
}

/* Card Sections */
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
  color: #fff;
}

/* Capital Section */
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

.osc-capital-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.osc-cap-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-cap-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}

.osc-cap-btn.active {
  background: rgba(0,217,192,0.15);
  border-color: #00D9C0;
  color: #00D9C0;
}

/* Capital Slider */
.osc-capital-slider-wrap {
  margin-bottom: 20px;
}

.osc-capital-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #00D9C0 0%, #00D9C0 var(--progress, 10%), #444 var(--progress, 10%), #444 100%);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.osc-capital-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #00D9C0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.osc-capital-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #00D9C0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.osc-slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.osc-capital-input {
  font-size: 24px !important;
  font-weight: 600;
  text-align: right;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #00D9C0;
}

/* Strategy Grid */
.osc-strategy-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

/* Убеждаемся что InfoTooltip не ломает grid */
.osc-strategy-grid > * {
  min-width: 0;
  width: 100%;
  display: flex;
}

.osc-strategy-card {
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  height: 100%;
  width: 100%;
  flex: 1;
}

.osc-strategy-card:hover {
  border-color: rgba(255,255,255,0.2);
}

.osc-strategy-card.active {
  background: rgba(0,217,192,0.1);
  border-color: #00D9C0;
}

.osc-str-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.osc-str-target {
  font-size: 18px;
  font-weight: 700;
  color: #00D9C0;
  margin-bottom: 4px;
}

.osc-str-desc {
  font-size: 11px;
  color: #888;
}

/* Mode Toggle */
.osc-mode-toggle {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
}

.osc-mode-toggle button {
  padding: 8px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #888;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-mode-toggle button:first-child {
  border-radius: 6px 0 0 6px;
}

.osc-mode-toggle button:last-child {
  border-radius: 0 6px 6px 0;
}

.osc-mode-toggle button.active {
  background: #00D9C0;
  border-color: #00D9C0;
  color: #000;
}

/* Allocation */
.osc-alloc-label {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.osc-allocation-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
}

.osc-alloc-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.osc-alloc-item {
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
}

.osc-alloc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.osc-asset-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  color: #000;
}

.osc-asset-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.osc-asset-value {
  font-size: 14px;
  font-weight: 600;
  color: #00D9C0;
  font-family: 'SF Mono', Monaco, monospace;
}

.osc-alloc-controls {
  margin-bottom: 8px;
}

.osc-alloc-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #666;
}

/* Предупреждение о минимуме Optima Space */
.osc-optima-warning {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(245,197,66,0.1);
  border: 1px solid rgba(245,197,66,0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #F5C542;
}

/* Индикатор ручного режима */
.osc-manual-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(139,92,246,0.2);
  border: 1px solid rgba(139,92,246,0.4);
  border-radius: 12px;
  font-size: 10px;
  color: #8B5CF6;
  margin-left: 12px;
  text-transform: uppercase;
  font-weight: 600;
}

/* Summary Sidebar */
.osc-alloc-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
}

.osc-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.osc-metric {
  text-align: center;
}

.osc-metric-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
}

.osc-metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.osc-metric-value.highlight {
  color: #00D9C0;
}

.osc-target-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  font-size: 12px;
  color: #888;
  cursor: help;
}

.osc-target-badge.achieved {
  background: rgba(0,217,192,0.15);
  border-color: #00D9C0;
  color: #00D9C0;
}

/* Allocation Footer */
.osc-alloc-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.osc-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #aaa;
  margin-bottom: 12px;
}

.osc-total-value {
  font-size: 18px;
  font-weight: 700;
  color: #00D9C0;
}

.osc-total-value.over {
  color: #E8192C;
}

.osc-total-value.under {
  color: #F5C542;
}

.osc-advisor-comment {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.osc-advisor-comment.success {
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  color: #00D9C0;
}

.osc-advisor-comment.info {
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.3);
  color: #3B82F6;
}

.osc-advisor-comment.warning {
  background: rgba(245,197,66,0.1);
  border: 1px solid rgba(245,197,66,0.3);
  color: #F5C542;
}

.osc-advisor-comment.error {
  background: rgba(232,25,44,0.1);
  border: 1px solid rgba(232,25,44,0.3);
  color: #E8192C;
}

.osc-advisor-comment.neutral {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #888;
}

.osc-auto-btn {
  width: 100%;
  padding: 14px;
  background: #00D9C0;
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.osc-auto-btn:hover {
  background: #00FFCC;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,217,192,0.4);
}

/* Optima Metrics */
.osc-optima-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.osc-opt-metric {
  padding: 20px;
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 12px;
  text-align: center;
}

.osc-opt-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.osc-opt-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.osc-opt-value.primary {
  color: #00D9C0;
}

/* Comparison Table */
.osc-comparison-table-wrap {
  overflow-x: auto;
}

.osc-comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.osc-comparison-table th,
.osc-comparison-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-size: 13px;
  color: #fff;
}

.osc-comparison-table th {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
}

.osc-comparison-table tr.highlight {
  background: rgba(0,217,192,0.1);
}

.osc-comparison-table tr.highlight td {
  color: #00D9C0;
}

.osc-comparison-table td.negative {
  color: #666;
}

.osc-tbl-asset-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.osc-tbl-comment {
  font-size: 12px;
  color: #fff;
  max-width: 200px;
}

/* Summary Section - Two Columns */
.osc-summary-section {
  background: linear-gradient(135deg, rgba(0,217,192,0.15) 0%, rgba(0,217,192,0.05) 100%);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 16px;
  padding: 32px;
  margin-top: 40px;
  margin-bottom: 24px;
}

.osc-summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
}

.osc-portfolio-block,
.osc-income-block {
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 24px;
}

.osc-block-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px;
}

.osc-portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 4px;
}

.osc-portfolio-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.osc-portfolio-row:hover {
  background: rgba(255,255,255,0.05);
}

.osc-portfolio-row.osc-optima-highlight {
  background: rgba(0,217,192,0.15);
  border: 1px solid rgba(0,217,192,0.3);
}

.osc-row-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.osc-row-name {
  flex: 1;
  font-size: 14px;
  color: #ccc;
}

.osc-optima-highlight .osc-row-name {
  color: #00D9C0;
  font-weight: 500;
}

.osc-row-amount {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.osc-income-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.osc-income-value {
  font-size: 48px;
  font-weight: 700;
  color: #00D9C0;
  line-height: 1;
  margin: 16px 0;
}

.osc-optima-income {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(0,217,192,0.2);
  border: 1px solid #00D9C0;
  border-radius: 25px;
  margin: 16px auto;
  font-size: 14px;
  color: #fff;
  position: relative;
  overflow: hidden;
  animation: osc-income-pulse 2s ease-in-out infinite;
}

@keyframes osc-income-pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(0,217,192,0.3); }
  50% { box-shadow: 0 0 25px rgba(0,217,192,0.6); }
}

.osc-optima-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: osc-glow-sweep 3s ease-in-out infinite;
}

@keyframes osc-glow-sweep {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.osc-income-yield {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
}

.osc-income-yield strong {
  color: #fff;
}

@keyframes osc-badge-shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.osc-badge-text {
  font-size: 14px;
  font-weight: 600;
  color: #00D9C0;
  position: relative;
  z-index: 1;
}

/* Action Buttons */
.osc-action-buttons {
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
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.osc-btn-primary {
  background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%);
  border: none;
  color: #000;
}

.osc-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,217,192,0.4);
}

.osc-btn-secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
}

.osc-btn-secondary:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.3);
}

/* Footer */
.osc-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  font-size: 13px;
  color: #666;
}

.osc-footer a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.osc-footer a:hover {
  color: #00D9C0;
}

.osc-disclaimer {
  text-align: center;
  font-size: 11px;
  color: #555;
  padding: 16px;
}

/* Responsive */
@media (max-width: 900px) {
  .osc-features { flex-wrap: wrap; }
  .osc-feature-arrow { display: none; }
  .osc-strategy-grid { grid-template-columns: repeat(2, 1fr); }
  .osc-allocation-grid { grid-template-columns: 1fr; }
  .osc-optima-metrics { grid-template-columns: repeat(2, 1fr); }
  .osc-summary-grid { grid-template-columns: 1fr; }
  .osc-action-buttons { grid-template-columns: 1fr; }
  .osc-passport-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .osc-calculator { padding: 20px 16px; }
  .osc-header-title { font-size: 24px; }
  .osc-flip-value { font-size: 36px; }
  .osc-flip-card { min-width: 80px; padding: 16px; }
  .osc-features { gap: 8px; }
  .osc-feature { flex: 0 0 calc(50% - 8px); min-height: auto; padding: 16px 12px; }
  .osc-strategy-grid { grid-template-columns: 1fr; }
  .osc-capital-buttons { flex-wrap: wrap; }
  .osc-income-value { font-size: 36px; }
  .osc-passport-grid { grid-template-columns: 1fr; }
  .osc-pp-proof-metrics { flex-direction: column; gap: 8px; }
}
</style>
