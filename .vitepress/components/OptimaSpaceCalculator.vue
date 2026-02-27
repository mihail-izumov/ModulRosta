<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// ═══════════════════════════════════════════════════════════════════════════════
// КОНСУЛЬТАНТ ПО ДОЛЕВЫМ ИНВЕСТИЦИЯМ В ОФИСНУЮ НЕДВИЖИМОСТЬ
// Vue 3 версия для VitePress — Модуль Роста®
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: '#00D9C0',
  primaryDark: '#00a67d',
  secondary: '#3B82F6',
  accent: '#8B5CF6',
  warning: '#F5C542',
  error: '#E8192C',
  success: '#10B981',
  gold: '#FFD700',
  text: '#fff',
  textMuted: '#888',
  textDim: '#555',
  bg: '#000',
  bgCard: '#0a0a0a',
  border: '#1a1a1a',
}

const TOOLTIPS = {
  targetYield: 'Цель 20%+ годовых — ориентир для сбалансированного портфеля коммерческой недвижимости. Optima Space позволяет достичь этой цели за счёт доходности 38% с гарантией обратного выкупа.',
  diversification: 'Диверсификация — распределение капитала между разными активами для снижения риска. Правило: не более 15-20% в один актив.',
  autoDistribute: 'Авто-распределение автоматически распределит средства по выбранной стратегии до 100%.',
}

const OPTIMA_SPACE = {
  name: 'Optima Space',
  minInvestment: 600000,
  totalShares: 288000,
  shareNominal: 500,
  totalBudget: 144000000,
  rounds: [
    { id: 1, price: 500, date: 'окт 2025', volume: 30000000, roi: 38, shares: 60000 },
    { id: 2, price: 550, date: 'дек 2025', volume: 39600000, roi: 34.5, shares: 72000 },
    { id: 3, price: 600, date: 'фев 2026', volume: 50400000, roi: 31.7, shares: 84000 }
  ],
  buybackPrice: 1000,
  buybackMinPrice: 500,
  buybackMonths: 55,
  paybackMonths: 29,
  collateral: 1044,
  collateralValue: 104000000,
  monthlyRevenue: 10748430,
  monthlyExpenses: 4751000,
  monthlyProfit: 5997000,
  workplaces: { min: 371, max: 408 },
  pricePerWorkplace: 27500,
  area: 1880,
  rentPerSqm: 1000,
  team: [
    { name: 'Виталий Паймуков', role: 'Основатель', exp: '16 лет инвестиций в офисы' },
    { name: 'Павел Залогин', role: 'Соучредитель', exp: '11 лет руководства ГК "Аник"' },
    { name: 'Дмитрий Мелихов', role: 'Руководитель проекта', exp: '5+ лет запуска объектов' },
  ],
  marketAnalytics: {
    totalOfficeArea: 594429,
    classAArea: 72474,
    classBArea: 521955,
    classAVacancy: 4,
    classBVacancy: 28,
    projectShare: 2.6,
    medianRentClassA: 287880,
    competitors: [
      { name: 'Profit Rooms', city: 'Самара', class: 'В+', rent: 276000, vacancy: 10 },
      { name: 'SOK', city: 'Екатеринбург', class: 'А', rent: 287880, vacancy: 0 },
      { name: 'SOK Казань', city: 'Казань', class: 'А', rent: 287880, vacancy: 0 },
    ]
  }
}

const ASSET_CLASSES = [
  { id: 'optima', name: 'Optima Space', minYield: 31, maxYield: 38, risk: 4, color: COLORS.primary, tag: 'РЕКОМЕНДУЕМ', tagColor: COLORS.primary, description: 'Сервисные офисы с обратным выкупом', tooltip: 'Долевые инвестиции в сервисный офис. Минимум 600 000₽. Обратный выкуп через 4,5 года.' },
  { id: 'warehouse', name: 'Складская логистика', minYield: 11, maxYield: 13, risk: 3, color: '#3B82F6', tag: 'СТАБИЛЬНО', tagColor: '#3B82F6', description: 'ЗПИФ, дефицит 1.5%', tooltip: 'Инвестиции в склады через ЗПИФ.' },
  { id: 'streetretail', name: 'Street-retail', minYield: 9, maxYield: 16, risk: 3, color: '#06B6D4', tag: 'ЛИКВИДНО', tagColor: '#06B6D4', description: 'Первые этажи, вакансия 4-5%', tooltip: 'Торговые помещения.' },
  { id: 'bonds', name: 'Облигации', minYield: 10, maxYield: 13, risk: 2, color: '#8B5CF6', tag: 'УМЕРЕННО', tagColor: '#8B5CF6', description: 'Корпоративные и ОФЗ', tooltip: 'Долговые ценные бумаги.' },
  { id: 'dividends', name: 'Дивидендные акции', minYield: 12, maxYield: 15, risk: 5, color: '#FF7A45', tag: 'ДОХОДНО', tagColor: '#FF7A45', description: 'Голубые фишки', tooltip: 'Акции с дивидендами.' },
  { id: 'deposits', name: 'Резерв (депозиты)', minYield: 18, maxYield: 20, risk: 1, color: '#10B981', tag: 'ЗАЩИТА', tagColor: '#10B981', description: 'АСВ до 1.4 млн', tooltip: 'Банковские вклады.' },
]

const STRATEGIES = {
  conservative: { name: 'Консервативная', target: '14-16%', description: 'Минимальный риск', allocations: { optima: 10, warehouse: 25, streetretail: 15, bonds: 20, dividends: 15, deposits: 15 }, tooltip: 'Приоритет — сохранение капитала.\n\n✓ Горизонт инвестирования 3-5 лет\n✓ Не готовы к просадке более 10%\n✓ Важнее стабильность' },
  balanced: { name: 'Сбалансированная', target: '18-22%', description: 'Баланс риска и доходности', allocations: { optima: 20, warehouse: 25, streetretail: 15, bonds: 15, dividends: 15, deposits: 10 }, tooltip: 'Оптимальное соотношение риск/доход.\n\n✓ Горизонт инвестирования 5-10 лет\n✓ Готовы к просадкам 15-20%\n✓ Хотите доход выше депозитов' },
  growth: { name: 'Рост капитала', target: '22-28%', description: 'Максимальная доходность', allocations: { optima: 30, warehouse: 20, streetretail: 20, bonds: 10, dividends: 15, deposits: 5 }, tooltip: 'Агрессивный рост капитала.\n\n✓ Горизонт инвестирования 10+ лет\n✓ Готовы к волатильности 25-30%\n✓ Есть другие источники дохода' }
}

const QA_CATEGORIES = [
  { id: 'financial', name: 'Финансы', icon: 'wallet' },
  { id: 'legal', name: 'Юридическое', icon: 'scroll' },
  { id: 'operational', name: 'Операционное', icon: 'cog' },
  { id: 'risks', name: 'Риски', icon: 'alert' },
  { id: 'exit', name: 'Выход', icon: 'exit' },
]

// Reactive State
const isMobile = ref(false)
const totalCapital = ref(10000000)
const allocations = ref({ ...STRATEGIES.balanced.allocations })
const amounts = ref({})
const activeStrategy = ref('balanced')
const inputMode = ref('percent')
const activeQACategory = ref('financial')
const openQuestion = ref(null)
const occupancy = ref(75)
const showTimelineTooltip = ref(false)

// Computed
const portfolioMetrics = computed(() => {
  let totalYield = 0, totalRisk = 0, totalAllocation = 0
  ASSET_CLASSES.forEach(asset => {
    const alloc = allocations.value[asset.id] || 0
    totalAllocation += alloc
    totalYield += ((asset.minYield + asset.maxYield) / 2) * (alloc / 100)
    totalRisk += asset.risk * (alloc / 100)
  })
  return { yield: totalYield, risk: totalRisk, totalAllocation }
})

const optimaInvestment = computed(() => Math.round(totalCapital.value * (allocations.value.optima / 100)))
const optimaShares = computed(() => Math.floor(optimaInvestment.value / 500))
const isOptimaValid = computed(() => optimaInvestment.value === 0 || optimaInvestment.value >= OPTIMA_SPACE.minInvestment)

const chartData = computed(() => {
  return ASSET_CLASSES.filter(a => allocations.value[a.id] > 0).map(a => ({
    name: a.name,
    value: allocations.value[a.id],
    color: a.color,
    amount: Math.round(totalCapital.value * allocations.value[a.id] / 100)
  }))
})

const scenarios = computed(() => {
  const calc = (occ) => {
    const adjROI = (occ / 90) * OPTIMA_SPACE.rounds[0].roi
    const divs = optimaInvestment.value * (adjROI / 100) * 4.5
    const divPerShare = divs / optimaShares.value
    const buyback = Math.max(0, optimaShares.value * Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare))
    return { dividends: divs, buyback, total: divs + buyback, roi: Math.round((divs / optimaInvestment.value) * 100) }
  }
  return {
    optimistic: { label: 'Оптимистичный', occupancy: 95, ...calc(95), color: COLORS.gold },
    base: { label: 'Базовый', occupancy: 90, ...calc(90), color: COLORS.primary },
    worst: { label: 'Худший', occupancy: 50, ...calc(50), color: COLORS.error }
  }
})

const currentScenario = computed(() => {
  const adjROI = (occupancy.value / 90) * OPTIMA_SPACE.rounds[0].roi
  const yearlyDiv = optimaInvestment.value * (adjROI / 100)
  const totalDivs = yearlyDiv * 4.5
  const payback = yearlyDiv > 0 ? Math.round((optimaInvestment.value / yearlyDiv) * 12) : Infinity
  const divPerShare = totalDivs / optimaShares.value
  const buybackPrice = Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare)
  return { adjROI, yearlyDiv, totalDivs, payback, buybackPrice, buybackTotal: optimaShares.value * buybackPrice }
})

const collateralCoverage = computed(() => (OPTIMA_SPACE.collateralValue / optimaInvestment.value).toFixed(0))

const goalStatus = computed(() => {
  if (portfolioMetrics.value.totalAllocation === 0) return { text: 'Распределите капитал', color: COLORS.textMuted }
  if (portfolioMetrics.value.yield >= 20) return { text: '✓ Цель 20%+ достигнута', color: COLORS.primary }
  return { text: '↑ Добавьте доходные активы', color: COLORS.warning }
})

const questions = computed(() => ({
  financial: [
    { q: `Откуда доходность 38%?`, a: `Бизнес-модель: аренда ${OPTIMA_SPACE.area} кв.м по ${OPTIMA_SPACE.rentPerSqm}₽/кв.м, сдача по ~6000₽/кв.м. При загрузке 90% прибыль ${formatCurrency(OPTIMA_SPACE.monthlyProfit)}/мес.` },
    { q: `Мой доход с ${formatCurrency(optimaInvestment.value)}?`, a: optimaInvestment.value >= 600000 ? `${optimaShares.value.toLocaleString()} акций. Дивиденд: ~${formatCurrency(optimaInvestment.value * 0.38 / 12)}/мес. Окупаемость 29 мес. За 4,5 года: ~${formatCurrency(optimaInvestment.value * 0.38 * 4.5)}.` : `Минимальная инвестиция — 600 000₽.` },
    { q: 'Распределение прибыли?', a: `100% на дивиденды до окупаемости (29 мес), затем 44% на привилегированные акции.` },
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
  ],
  exit: [
    { q: 'Выйти раньше?', a: `Продажа инвесторам, раунды по высокой цене, дивиденды (окупаемость 29 мес).` },
    { q: 'Ограничения продажи?', a: `В любое время. Преимущественное право 30 дней.` },
    { q: 'Частичная продажа?', a: `Да, любое количество. Минимума нет.` },
  ],
}))

// Methods
const formatCurrency = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} млн ₽`
  if (amount >= 1000) return `${Math.round(amount / 1000)} тыс ₽`
  return `${Math.round(amount)} ₽`
}

const formatPercent = (value) => `${value.toFixed(1)}%`

const loadStrategy = (key) => {
  allocations.value = { ...STRATEGIES[key].allocations }
  activeStrategy.value = key
  inputMode.value = 'percent'
}

const updateAllocationByPercent = (assetId, value) => {
  allocations.value[assetId] = value
  activeStrategy.value = null
  inputMode.value = 'percent'
}

const updateAllocationByAmount = (assetId, amount) => {
  if (assetId === 'optima' && amount > 0 && amount < OPTIMA_SPACE.minInvestment) {
    amount = OPTIMA_SPACE.minInvestment
  }
  const percent = totalCapital.value > 0 ? Math.round((amount / totalCapital.value) * 100) : 0
  allocations.value[assetId] = Math.min(percent, 100)
  amounts.value[assetId] = amount
  activeStrategy.value = null
  inputMode.value = 'amount'
}

const autoDistribute = () => {
  const currentTotal = portfolioMetrics.value.totalAllocation
  if (currentTotal === 100) return
  
  const strategy = activeStrategy.value ? STRATEGIES[activeStrategy.value].allocations : STRATEGIES.balanced.allocations
  const strategyTotal = Object.values(strategy).reduce((a, b) => a + b, 0)
  const newAllocations = {}
  
  if (currentTotal > 100) {
    const ratio = 100 / currentTotal
    Object.keys(allocations.value).forEach(assetId => {
      newAllocations[assetId] = Math.round(allocations.value[assetId] * ratio)
    })
  } else {
    const remaining = 100 - currentTotal
    Object.keys(strategy).forEach(assetId => {
      const toAdd = Math.round(remaining * (strategy[assetId] / strategyTotal))
      newAllocations[assetId] = (allocations.value[assetId] || 0) + toAdd
    })
  }
  
  const newTotal = Object.values(newAllocations).reduce((a, b) => a + b, 0)
  if (newTotal !== 100) {
    newAllocations.deposits = (newAllocations.deposits || 0) + (100 - newTotal)
  }
  
  allocations.value = newAllocations
  inputMode.value = 'percent'
}

const handleQuestionClick = (categoryId, index) => {
  const key = `${categoryId}-${index}`
  openQuestion.value = openQuestion.value === key ? null : key
}

const handleInvest = () => {
  const text = encodeURIComponent(`Хочу инвестировать в Optima Space ${formatCurrency(optimaInvestment.value)}`)
  window.open(`https://t.me/paimukov?text=${text}`, '_blank')
}

const generatePDF = () => {
  const ma = OPTIMA_SPACE.marketAnalytics
  const shares = optimaShares.value
  const totalIncome = optimaInvestment.value * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5
  
  const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Инвестиционный отчёт</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#fff;color:#000;line-height:1.6;padding:40px;max-width:800px;margin:0 auto}
.header{text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:2px solid #000}
.header h1{font-size:24px;font-weight:600;margin-bottom:8px}
.section{margin-bottom:32px}
.section h2{font-size:16px;font-weight:600;color:#000;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #ccc}
.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.metric{background:#f5f5f5;padding:16px;border-radius:8px;text-align:center;border:1px solid #ddd}
.metric-label{font-size:10px;color:#666;text-transform:uppercase;margin-bottom:4px}
.metric-value{font-size:20px;font-weight:600}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th,td{padding:12px;text-align:left;border:1px solid #ccc;font-size:13px}
th{background:#f0f0f0;font-weight:600;font-size:11px;text-transform:uppercase}
.highlight-row{background:#f5f5f5}
.info-block{background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:24px;border-left:4px solid #000}
.info-block h3{font-size:14px;font-weight:600;margin-bottom:8px}
.info-block p{font-size:13px;color:#333}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ccc;text-align:center;font-size:11px;color:#666}
.partner-badge{display:inline-block;padding:10px 20px;border:2px solid #000;border-radius:6px;font-size:12px;font-weight:600;margin-top:16px}
</style></head><body>
<div class="header">
<h1>Персональный инвестиционный отчёт</h1>
<p>Консультант по долевым инвестициям в офисную недвижимость</p>
<p style="font-size:12px;color:#888;margin-top:8px">Сформирован: ${new Date().toLocaleDateString('ru-RU')}</p>
</div>
<div class="section">
<h2>Ваш инвестиционный портфель</h2>
<div class="metric-grid">
<div class="metric"><div class="metric-label">Общий капитал</div><div class="metric-value">${formatCurrency(totalCapital.value)}</div></div>
<div class="metric"><div class="metric-label">Доходность</div><div class="metric-value">${portfolioMetrics.value.yield.toFixed(1)}%</div></div>
<div class="metric"><div class="metric-label">Риск</div><div class="metric-value">${portfolioMetrics.value.risk.toFixed(1)}/10</div></div>
<div class="metric"><div class="metric-label">Доход 4,5г</div><div class="metric-value">${formatCurrency(totalCapital.value * (portfolioMetrics.value.yield / 100) * 4.5)}</div></div>
</div>
</div>
<div class="section">
<h2>Инвестиция в Optima Space</h2>
<div class="metric-grid">
<div class="metric"><div class="metric-label">Сумма</div><div class="metric-value">${formatCurrency(optimaInvestment.value)}</div></div>
<div class="metric"><div class="metric-label">Акции</div><div class="metric-value">${shares.toLocaleString()}</div></div>
<div class="metric"><div class="metric-label">ROI</div><div class="metric-value">${OPTIMA_SPACE.rounds[0].roi}%</div></div>
<div class="metric"><div class="metric-label">Доход 4,5г</div><div class="metric-value">${formatCurrency(totalIncome)}</div></div>
</div>
<div class="info-block">
<h3>Гарантия обратного выкупа</h3>
<p>Через 4,5 года основатель обязан выкупить акции: <strong>1000₽ − дивиденды</strong> (минимум 500₽).</p>
<p style="margin-top:8px">Залог: ${OPTIMA_SPACE.collateral} кв.м (~${formatCurrency(OPTIMA_SPACE.collateralValue)}). Покрытие: <strong>${collateralCoverage.value}×</strong></p>
</div>
</div>
<div class="section">
<h2>Аналитика рынка офисной недвижимости г. Самара</h2>
<div class="info-block" style="border-left-color:#333">
<h3>Ключевые показатели рынка</h3>
<p><strong>Общая площадь офисов класса А и В:</strong> ${(ma.totalOfficeArea / 1000).toFixed(0)} тыс. кв.м</p>
<p><strong>Класс А:</strong> ${(ma.classAArea / 1000).toFixed(0)} тыс. кв.м (12%) — вакантность ${ma.classAVacancy}%</p>
<p><strong>Класс В:</strong> ${(ma.classBArea / 1000).toFixed(0)} тыс. кв.м (88%) — вакантность ${ma.classBVacancy}%</p>
<p style="margin-top:12px"><strong>Доля Optima Space на рынке класса А:</strong> ${ma.projectShare}%</p>
</div>
</div>
<div class="footer">
<p><strong>Важно:</strong> Данный отчёт не является публичной офертой. Инвестиции связаны с рисками.</p>
<p style="margin-top:12px">© 2026 Optima Space • Консультант по долевым инвестициям</p>
<div class="partner-badge">Технологический партнёр | Модуль Роста®</div>
</div>
</body></html>`

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Инвестиционный_отчёт_${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Watchers
watch([allocations, totalCapital], () => {
  if (inputMode.value === 'percent') {
    const newAmounts = {}
    ASSET_CLASSES.forEach(a => {
      newAmounts[a.id] = Math.round(totalCapital.value * (allocations.value[a.id] || 0) / 100)
    })
    amounts.value = newAmounts
  }
}, { deep: true, immediate: true })

// Lifecycle
onMounted(() => {
  const check = () => { isMobile.value = window.innerWidth < 1024 }
  check()
  window.addEventListener('resize', check)
})

// Pie Chart CSS Gradient
const pieChartGradient = computed(() => {
  let gradient = ''
  let currentAngle = 0
  chartData.value.forEach((item, index) => {
    const angle = (item.value / 100) * 360
    gradient += `${item.color} ${currentAngle}deg ${currentAngle + angle}deg`
    if (index < chartData.value.length - 1) gradient += ', '
    currentAngle += angle
  })
  return `conic-gradient(${gradient})`
})
</script>

<template>
  <!-- Mobile Warning -->
  <div v-if="isMobile" class="mobile-warning">
    <div class="mobile-warning-card">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2">
        <path d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272"/>
        <path d="M22 2 2 22"/>
        <path d="M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473"/>
      </svg>
      <h2>Откройте на компьютере</h2>
      <p>Консультант оптимизирован для экрана от 1024px.</p>
    </div>
  </div>

  <!-- Main Calculator -->
  <div v-else class="calculator-container">
    <!-- Header -->
    <header class="calc-header">
      <div class="calc-subtitle">Стратегический инструмент для инвесторов</div>
      <h1 class="calc-title">Консультант по долевым инвестициям<br />в офисную недвижимость</h1>
      <p class="calc-description">
        Рассчитайте структуру портфеля для достижения <span class="highlight">цели 20%+ годовой доходности</span>.
      </p>
    </header>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="badge-center">
        <span class="top-badge">Умные инвестиции в Optima Space</span>
      </div>
      <div class="steps-grid">
        <div class="step">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <div class="step-title">Ваш капитал</div>
          <div class="step-sub">Сколько готовы инвестировать</div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
          <div class="step-title">Распределите активы</div>
          <div class="step-sub">Офисы, склады, ритейл, резерв</div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
          <div class="step-title">Детали Optima Space</div>
          <div class="step-sub">Акции, дивиденды, гарантии</div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>
          <div class="step-title">Скачайте отчёт</div>
          <div class="step-sub">Персональная стратегия в PDF</div>
        </div>
      </div>
    </section>

    <!-- Step 1: Capital -->
    <section class="section-card">
      <div class="section-header">
        <span class="step-number">1</span>
        <span class="section-title">Ваш инвестиционный капитал</span>
      </div>
      <div class="capital-display">
        <span class="capital-label">Сумма для инвестирования</span>
        <span class="capital-value">{{ formatCurrency(totalCapital) }}</span>
      </div>
      <input type="range" v-model="totalCapital" :min="1000000" :max="100000000" :step="500000" class="slider" />
      <div class="slider-labels">
        <span>1 млн ₽</span>
        <span>100 млн ₽</span>
      </div>
      <div class="quick-amounts">
        <button v-for="v in [3000000, 5000000, 10000000, 20000000, 50000000]" :key="v" @click="totalCapital = v" :class="{ active: totalCapital === v }">
          {{ formatCurrency(v) }}
        </button>
      </div>
    </section>

    <!-- Step 2: Strategy -->
    <section class="section-card">
      <div class="section-header">
        <span class="step-number">2</span>
        <span class="section-title">Выберите стратегию</span>
      </div>

      <div class="strategies-grid">
        <button v-for="(strategy, key) in STRATEGIES" :key="key" @click="loadStrategy(key)" :class="['strategy-btn', { active: activeStrategy === key }]">
          <div class="strategy-name">{{ strategy.name }}</div>
          <div class="strategy-desc">{{ strategy.description }}</div>
          <div class="strategy-target">{{ strategy.target }}</div>
        </button>
      </div>

      <div class="input-mode-toggle">
        <button @click="inputMode = 'percent'" :class="{ active: inputMode === 'percent' }">Ввод в %</button>
        <button @click="inputMode = 'amount'" :class="{ active: inputMode === 'amount' }">Ввод в ₽</button>
      </div>

      <div class="allocation-grid">
        <div class="allocation-list">
          <div class="allocation-header">
            Распределение активов
            <span v-if="!activeStrategy" class="manual-badge">• вручную</span>
          </div>

          <div v-for="asset in ASSET_CLASSES" :key="asset.id" class="asset-row">
            <div class="asset-info">
              <div class="asset-name-row">
                <span class="asset-dot" :style="{ background: asset.color }"></span>
                <span class="asset-name">{{ asset.name }}</span>
                <span class="asset-tag" :style="{ background: asset.tagColor + '20', color: asset.tagColor, borderColor: asset.tagColor + '40' }">{{ asset.tag }}</span>
              </div>
              <div class="asset-desc" :class="{ 'error-text': asset.id === 'optima' && allocations[asset.id] > 0 && totalCapital * allocations[asset.id] / 100 < OPTIMA_SPACE.minInvestment }">
                {{ asset.id === 'optima' && allocations[asset.id] > 0 && totalCapital * allocations[asset.id] / 100 < OPTIMA_SPACE.minInvestment ? `Минимум ${formatCurrency(OPTIMA_SPACE.minInvestment)}` : asset.description }}
              </div>
            </div>
            <div class="asset-controls">
              <span class="asset-amount">{{ formatCurrency(totalCapital * allocations[asset.id] / 100) }}</span>
              <span class="asset-percent">{{ allocations[asset.id] }}%</span>
            </div>
            <input v-if="inputMode === 'percent'" type="range" v-model="allocations[asset.id]" :min="0" :max="asset.id === 'optima' ? 35 : 50" class="asset-slider" :style="{ '--slider-color': asset.color }" @input="activeStrategy = null" />
            <div class="asset-meta">
              <span>Доходность: {{ asset.minYield }}–{{ asset.maxYield }}%</span>
              <span>Риск: {{ asset.risk }}/10</span>
            </div>
          </div>

          <div class="total-allocation" :class="{ success: portfolioMetrics.totalAllocation === 100, error: portfolioMetrics.totalAllocation > 100, warning: portfolioMetrics.totalAllocation < 100 && portfolioMetrics.totalAllocation > 0 }">
            <span>Итого распределено</span>
            <span class="total-value">{{ portfolioMetrics.totalAllocation }}%</span>
          </div>

          <div v-if="portfolioMetrics.totalAllocation !== 100" class="auto-distribute">
            <div class="auto-hint" :class="{ error: portfolioMetrics.totalAllocation > 100 }">
              {{ portfolioMetrics.totalAllocation > 100 ? `Превышение на ${portfolioMetrics.totalAllocation - 100}%` : `Не распределено: ${formatCurrency(totalCapital * (100 - portfolioMetrics.totalAllocation) / 100)}` }}
            </div>
            <button @click="autoDistribute" class="auto-btn">
              {{ portfolioMetrics.totalAllocation > 100 ? 'Выровнять до 100%' : `Авто-распределение (${100 - portfolioMetrics.totalAllocation}%)` }}
            </button>
          </div>
        </div>

        <div class="allocation-chart">
          <div class="pie-chart" :style="{ background: pieChartGradient }">
            <div class="pie-hole"></div>
          </div>
          <div class="metrics-grid">
            <div class="metric-box">
              <div class="metric-label">Доходность</div>
              <div class="metric-value" :class="{ highlight: portfolioMetrics.yield >= 20 }">{{ portfolioMetrics.totalAllocation > 0 ? formatPercent(portfolioMetrics.yield) : '—' }}</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Риск</div>
              <div class="metric-value" :class="{ warning: portfolioMetrics.risk > 4 }">{{ portfolioMetrics.totalAllocation > 0 ? `${portfolioMetrics.risk.toFixed(1)}/10` : '—' }}</div>
            </div>
          </div>
          <div class="goal-status" :class="{ success: goalStatus.color === COLORS.primary }">
            {{ goalStatus.text }}
          </div>
        </div>
      </div>
    </section>

    <!-- Step 3: Optima Details -->
    <section v-if="allocations.optima > 0 && isOptimaValid" class="section-card">
      <div class="section-header">
        <span class="step-number">3</span>
        <span class="section-title">Детали инвестиции в Optima Space</span>
      </div>

      <div class="optima-metrics">
        <div class="optima-metric highlight">
          <div class="metric-label">Ваша инвестиция</div>
          <div class="metric-value">{{ formatCurrency(optimaInvestment) }}</div>
          <div class="metric-sub">{{ optimaShares.toLocaleString() }} акций</div>
        </div>
        <div class="optima-metric">
          <div class="metric-label">ROI годовых</div>
          <div class="metric-value">{{ OPTIMA_SPACE.rounds[0].roi }}%</div>
          <div class="metric-sub">I раунд</div>
        </div>
        <div class="optima-metric">
          <div class="metric-label">Окупаемость</div>
          <div class="metric-value">{{ OPTIMA_SPACE.paybackMonths }} мес</div>
          <div class="metric-sub">возврат дивидендами</div>
        </div>
        <div class="optima-metric">
          <div class="metric-label">Доход за 4,5 года</div>
          <div class="metric-value highlight">{{ formatCurrency(optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5) }}</div>
          <div class="metric-sub">ROI {{ ((OPTIMA_SPACE.rounds[0].roi / 100) * 4.5 * 100).toFixed(0) }}%</div>
        </div>
      </div>

      <!-- Buyback Guarantee -->
      <div class="guarantee-card">
        <div class="guarantee-header">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span>Гарантия обратного выкупа</span>
        </div>

        <!-- Timeline -->
        <div class="timeline-block">
          <div class="timeline-title">Timeline проекта</div>
          <div class="timeline">
            <div class="timeline-line"></div>
            <div class="timeline-progress"></div>
            <div v-for="(step, i) in [{ label: 'Покупка', sub: 'акций', done: true }, { label: 'Запуск', sub: '+6 мес', done: false, tooltip: 'Сейчас вы здесь: после покупки акций, до запуска проекта' }, { label: 'Окупаемость', sub: '+29 мес', done: false }, { label: 'Опцион', sub: '+55 мес', done: false }]" :key="i" class="timeline-step" @mouseenter="i === 1 && (showTimelineTooltip = true)" @mouseleave="showTimelineTooltip = false">
              <div class="timeline-dot" :class="{ done: step.done, current: i === 1 }">{{ step.done ? '✓' : i + 1 }}</div>
              <div class="timeline-label" :class="{ done: step.done }">{{ step.label }}</div>
              <div class="timeline-sub">{{ step.sub }}</div>
              <div v-if="i === 1 && showTimelineTooltip" class="timeline-tooltip">{{ step.tooltip }}</div>
            </div>
          </div>
        </div>

        <!-- Scenarios -->
        <div class="scenarios-title">Сценарии выкупа (ваши {{ formatCurrency(optimaInvestment) }})</div>
        <div class="scenarios-grid">
          <div v-for="(s, key) in scenarios" :key="key" class="scenario-card" :class="{ base: key === 'base' }">
            <div class="scenario-dot" :style="{ background: s.color }"></div>
            <div class="scenario-label">{{ s.label }}</div>
            <div class="scenario-occupancy">Загрузка {{ s.occupancy }}%</div>
            <div class="scenario-divs">Дивиденды: <span>{{ formatCurrency(s.dividends) }}</span></div>
            <div v-if="s.buyback > 0" class="scenario-buyback">Выкуп: <span>{{ formatCurrency(s.buyback) }}</span></div>
            <div class="scenario-total">{{ formatCurrency(s.total) }}</div>
            <div class="scenario-roi">ROI: {{ s.roi }}%</div>
          </div>
        </div>
        <div class="guarantee-note">✓ Даже при загрузке 50% вы получаете доход</div>

        <!-- Interactive Slider -->
        <div class="interactive-block">
          <div class="interactive-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Интерактивный расчёт: Что если загрузка = <strong>{{ occupancy }}%</strong>?</span>
          </div>
          <input type="range" v-model="occupancy" :min="30" :max="100" class="interactive-slider" />
          <div class="interactive-labels">
            <span>30%</span><span>50%</span><span>90% (план)</span><span>100%</span>
          </div>
          <div class="interactive-metrics">
            <div class="int-metric">
              <div class="int-label">ROI годовых</div>
              <div class="int-value" :class="{ highlight: currentScenario.adjROI >= 20 }">{{ currentScenario.adjROI.toFixed(1) }}%</div>
            </div>
            <div class="int-metric">
              <div class="int-label">Дивиденды/год</div>
              <div class="int-value">{{ formatCurrency(currentScenario.yearlyDiv) }}</div>
            </div>
            <div class="int-metric">
              <div class="int-label">Окупаемость</div>
              <div class="int-value">{{ currentScenario.payback < 100 ? `${currentScenario.payback} мес` : '—' }}</div>
            </div>
            <div class="int-metric">
              <div class="int-label">Цена выкупа</div>
              <div class="int-value">{{ currentScenario.buybackPrice.toFixed(0) }}₽</div>
            </div>
          </div>
        </div>

        <!-- Formula -->
        <div class="formula-block">
          <div class="formula-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>
            <span>Ваша персональная формула</span>
          </div>
          <div class="formula-grid">
            <div class="formula-col">
              <div><span class="dim">Акции:</span> <strong>{{ optimaShares.toLocaleString() }}</strong> шт</div>
              <div><span class="dim">× Номинал:</span> <span class="hl">{{ OPTIMA_SPACE.buybackPrice }}₽</span></div>
              <div><span class="dim">− Дивиденды/акция:</span> <span class="hl">{{ (currentScenario.totalDivs / optimaShares).toFixed(0) }}₽</span></div>
            </div>
            <div class="formula-col bordered">
              <div><span class="dim">Выкуп:</span> <strong>{{ formatCurrency(currentScenario.buybackTotal) }}</strong></div>
              <div><span class="dim">+ Дивиденды:</span> <span class="hl">{{ formatCurrency(currentScenario.totalDivs) }}</span></div>
              <div class="formula-total"><span class="dim">ИТОГО:</span> <span class="hl big">{{ formatCurrency(currentScenario.totalDivs + currentScenario.buybackTotal) }}</span></div>
            </div>
          </div>
        </div>

        <!-- Collateral -->
        <div class="collateral-block">
          <div class="collateral-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <span>Залоговое обеспечение</span>
          </div>
          <div class="collateral-grid">
            <div class="coll-item">
              <div class="coll-label">Площадь</div>
              <div class="coll-value">{{ OPTIMA_SPACE.collateral }} кв.м</div>
            </div>
            <div class="coll-item">
              <div class="coll-label">Оценка</div>
              <div class="coll-value">~{{ formatCurrency(OPTIMA_SPACE.collateralValue) }}</div>
            </div>
            <div class="coll-item">
              <div class="coll-label">Покрытие</div>
              <div class="coll-value highlight">{{ collateralCoverage }}×</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Warning if Optima < 600k -->
    <section v-if="allocations.optima > 0 && !isOptimaValid" class="warning-card">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8192C" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
      <div>
        <div class="warning-title">Минимальная инвестиция в Optima Space — {{ formatCurrency(OPTIMA_SPACE.minInvestment) }}</div>
        <div class="warning-desc">Текущая сумма: {{ formatCurrency(optimaInvestment) }}. Добавьте ещё {{ formatCurrency(OPTIMA_SPACE.minInvestment - optimaInvestment) }} или выберите 0%.</div>
      </div>
    </section>

    <!-- Step 4: Comparison -->
    <section class="section-card">
      <div class="section-header">
        <span class="step-number">4</span>
        <span class="section-title">Сравнение инструментов</span>
      </div>
      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Инструмент</th>
              <th>ROI</th>
              <th>Защита</th>
              <th>Риск</th>
              <th>Доход 4,5г</th>
            </tr>
          </thead>
          <tbody>
            <tr class="highlight-row">
              <td><strong>● Optima Space (I раунд)</strong></td>
              <td class="highlight">38%</td>
              <td class="highlight">Обратный выкуп</td>
              <td>4/10</td>
              <td><strong>{{ formatCurrency(2000000 * 1.71) }}</strong></td>
            </tr>
            <tr>
              <td>ЗПИФ офисы</td>
              <td>12–15%</td>
              <td class="dim">Нет</td>
              <td>3/10</td>
              <td>{{ formatCurrency(2000000 * 0.60) }}</td>
            </tr>
            <tr>
              <td>ЗПИФ склады</td>
              <td>11–13%</td>
              <td class="dim">Нет</td>
              <td>3/10</td>
              <td>{{ formatCurrency(2000000 * 0.55) }}</td>
            </tr>
            <tr>
              <td>Депозиты</td>
              <td>18–20%*</td>
              <td class="highlight">АСВ 1.4М</td>
              <td>1/10</td>
              <td>{{ formatCurrency(2000000 * 0.72) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="table-note">* Ставки депозитов снизятся в 2026-2027</div>
      </div>
    </section>

    <!-- Step 5: Q&A -->
    <section class="section-card">
      <div class="section-header">
        <span class="step-number">5</span>
        <span class="section-title">Вопросы инвестора</span>
      </div>
      <div class="qa-grid">
        <div class="qa-categories">
          <button v-for="cat in QA_CATEGORIES" :key="cat.id" @click="activeQACategory = cat.id; openQuestion = null" :class="{ active: activeQACategory === cat.id }">
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-count">{{ questions[cat.id]?.length || 0 }}</span>
          </button>
        </div>
        <div class="qa-questions">
          <div v-for="(item, i) in questions[activeQACategory]" :key="i" class="qa-item">
            <div class="qa-q" @click="handleQuestionClick(activeQACategory, i)">
              <svg :class="{ open: openQuestion === `${activeQACategory}-${i}` }" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              {{ item.q }}
            </div>
            <div v-if="openQuestion === `${activeQACategory}-${i}`" class="qa-a">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-label">Ваша персональная рекомендация</div>
      <div class="cta-grid">
        <div class="cta-portfolio">
          <h3>Портфель {{ formatCurrency(totalCapital) }}</h3>
          <div v-for="item in chartData" :key="item.name" class="portfolio-item" :class="{ optima: item.name === 'Optima Space' }">
            <div class="portfolio-name">
              <span class="dot" :style="{ background: item.color }"></span>
              <span :class="{ 'optima-name': item.name === 'Optima Space' }">{{ item.name }}</span>
            </div>
            <span :class="{ 'optima-amount': item.name === 'Optima Space' }">{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
        <div class="cta-income">
          <div class="income-label">Ожидаемый доход за 4,5 года</div>
          <div class="income-value">{{ portfolioMetrics.totalAllocation > 0 ? formatCurrency(totalCapital * (portfolioMetrics.yield / 100) * 4.5) : '—' }}</div>
          <div v-if="portfolioMetrics.totalAllocation > 0" class="income-note">при доходности <strong>{{ formatPercent(portfolioMetrics.yield) }}</strong></div>
        </div>
      </div>
      <div class="cta-buttons">
        <button class="btn-primary" @click="handleInvest" :disabled="!isOptimaValid || optimaInvestment < OPTIMA_SPACE.minInvestment">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
          Инвестировать в Optima Space
        </button>
        <button class="btn-secondary" @click="generatePDF">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>
          Скачать PDF-отчёт
        </button>
      </div>
    </section>

    <!-- Partner Badge -->
    <div class="partner-badge-container">
      <a href="https://runscale.ru" target="_blank" rel="noopener noreferrer" class="partner-badge-link">
        <span class="radar-dot"></span>
        <span>Технологический партнёр | Модуль Роста®</span>
      </a>
    </div>

    <!-- Footer -->
    <footer class="calc-footer">
      <p>Калькулятор предоставляет ориентировочные расчёты. Инвестиции связаны с рисками.</p>
    </footer>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════════
   OPTIMA SPACE CALCULATOR STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */

.calculator-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #000;
  color: #fff;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
}

/* Mobile Warning */
.mobile-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 24px;
  text-align: center;
  background: #000;
  color: #fff;
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

.mobile-warning-card h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 12px;
  border: none;
}

.mobile-warning-card p {
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  margin: 0;
}

/* Header */
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
  margin: 0 0 16px;
  line-height: 1.15;
  border: none;
  padding: 0;
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

/* How It Works */
.how-it-works {
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

.step {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step svg {
  margin-bottom: 8px;
}

.step-title {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.step-sub {
  font-size: 10px;
  color: #666;
}

.step-arrow {
  font-size: 20px;
  color: #333;
  padding-top: 8px;
}

/* Section Card */
.section-card {
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

.step-number {
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

/* Capital Section */
.capital-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.capital-label {
  font-size: 14px;
  color: #888;
}

.capital-value {
  font-size: 32px;
  font-weight: 600;
}

.slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: linear-gradient(to right, #00D9C0 0%, #00D9C0 var(--progress, 50%), #1a1a1a var(--progress, 50%), #1a1a1a 100%);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 11px;
  color: #555;
}

.quick-amounts {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.quick-amounts button {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-amounts button:hover {
  border-color: #555;
  color: #fff;
}

.quick-amounts button.active {
  background: #00D9C0;
  border-color: #00D9C0;
  color: #000;
  font-weight: 600;
}

/* Strategies */
.strategies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.strategy-btn {
  padding: 20px;
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.strategy-btn:hover {
  border-color: #333;
}

.strategy-btn.active {
  background: rgba(0,217,192,0.1);
  border-color: #00D9C0;
}

.strategy-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.strategy-btn.active .strategy-name {
  color: #00D9C0;
}

.strategy-desc {
  font-size: 11px;
  color: #666;
  margin-bottom: 12px;
}

.strategy-target {
  font-size: 22px;
  font-weight: 600;
  color: #00D9C0;
}

/* Input Mode Toggle */
.input-mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.input-mode-toggle button {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.input-mode-toggle button.active {
  background: #222;
  color: #fff;
}

/* Allocation Grid */
.allocation-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

.allocation-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #555;
  margin-bottom: 20px;
}

.manual-badge {
  color: #F5C542;
  margin-left: 8px;
}

.asset-row {
  margin-bottom: 20px;
}

.asset-info {
  margin-bottom: 8px;
}

.asset-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.asset-name {
  font-size: 13px;
  font-weight: 600;
}

.asset-tag {
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid;
}

.asset-desc {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
  margin-left: 18px;
}

.asset-desc.error-text {
  color: #E8192C;
}

.asset-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.asset-amount {
  font-size: 12px;
  color: #aaa;
}

.asset-percent {
  font-size: 16px;
  font-weight: 600;
  width: 40px;
  text-align: right;
}

.asset-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #1a1a1a;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.asset-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.asset-meta {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #888;
  margin-top: 4px;
}

/* Total Allocation */
.total-allocation {
  padding: 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.total-allocation.success {
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.3);
}

.total-allocation.warning {
  background: rgba(245,197,66,0.08);
  border: 1px solid rgba(245,197,66,0.3);
}

.total-allocation.error {
  background: rgba(232,25,44,0.08);
  border: 1px solid rgba(232,25,44,0.3);
}

.total-allocation span:first-child {
  font-size: 13px;
  color: #888;
}

.total-value {
  font-size: 24px;
  font-weight: 600;
}

.total-allocation.success .total-value { color: #00D9C0; }
.total-allocation.warning .total-value { color: #F5C542; }
.total-allocation.error .total-value { color: #E8192C; }

/* Auto Distribute */
.auto-distribute {
  margin-top: 12px;
}

.auto-hint {
  font-size: 11px;
  color: #F5C542;
  margin-bottom: 8px;
}

.auto-hint.error {
  color: #E8192C;
}

.auto-btn {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0,217,192,0.1);
  border: 1px solid rgba(0,217,192,0.3);
  border-radius: 8px;
  color: #00D9C0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

/* Pie Chart */
.allocation-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
  margin-bottom: 24px;
}

.pie-hole {
  position: absolute;
  width: 110px;
  height: 110px;
  background: #0a0a0a;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.metric-box {
  background: #0a0a0a;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.metric-box .metric-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.metric-box .metric-value {
  font-size: 26px;
  font-weight: 600;
}

.metric-box .metric-value.highlight {
  color: #00D9C0;
}

.metric-box .metric-value.warning {
  color: #F5C542;
}

.goal-status {
  margin-top: 16px;
  padding: 12px;
  background: rgba(245,197,66,0.1);
  border: 1px solid rgba(245,197,66,0.3);
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #F5C542;
  width: 100%;
}

.goal-status.success {
  background: rgba(0,217,192,0.1);
  border-color: rgba(0,217,192,0.3);
  color: #00D9C0;
}

/* Optima Metrics */
.optima-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.optima-metric {
  background: #0a0a0a;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.optima-metric.highlight {
  background: rgba(0,217,192,0.1);
  border-color: rgba(0,217,192,0.2);
}

.optima-metric .metric-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.optima-metric .metric-value {
  font-size: 28px;
  font-weight: 600;
}

.optima-metric .metric-value.highlight {
  color: #00D9C0;
}

.optima-metric .metric-sub {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

/* Guarantee Card */
.guarantee-card {
  background: #0a0a0a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #111;
}

.guarantee-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

/* Timeline */
.timeline-block {
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
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
}

.timeline-line {
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #333;
}

.timeline-progress {
  position: absolute;
  top: 10px;
  left: 20px;
  width: calc(25% - 10px);
  height: 2px;
  background: #00D9C0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  position: relative;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666;
}

.timeline-dot.done {
  background: #00D9C0;
  color: #000;
}

.timeline-dot.current {
  border: 2px solid #00D9C0;
}

.timeline-label {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #888;
}

.timeline-label.done {
  color: #00D9C0;
}

.timeline-sub {
  font-size: 10px;
  color: #555;
}

.timeline-tooltip {
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

/* Scenarios */
.scenarios-title {
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
  margin-bottom: 12px;
}

.scenario-card {
  padding: 16px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  text-align: center;
}

.scenario-card.base {
  background: rgba(0,217,192,0.1);
  border-color: rgba(0,217,192,0.3);
}

.scenario-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 auto 8px;
}

.scenario-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.scenario-occupancy {
  font-size: 10px;
  color: #666;
  margin-bottom: 12px;
}

.scenario-divs, .scenario-buyback {
  font-size: 10px;
  color: #888;
}

.scenario-divs span, .scenario-buyback span {
  color: #00D9C0;
}

.scenario-total {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #222;
  font-size: 14px;
  font-weight: 600;
  color: #00D9C0;
}

.scenario-card:last-child .scenario-total {
  color: #fff;
}

.scenario-roi {
  font-size: 10px;
  color: #555;
}

.guarantee-note {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0,217,192,0.08);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 8px;
  font-size: 12px;
  color: #00D9C0;
  text-align: center;
}

/* Interactive Block */
.interactive-block {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0,217,192,0.15) 0%, rgba(0,217,192,0.05) 100%);
  border: 2px solid #00D9C0;
  border-radius: 12px;
}

.interactive-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
}

.interactive-header strong {
  color: #00D9C0;
}

.interactive-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: linear-gradient(to right, #00D9C0 0%, #00D9C0 var(--progress, 50%), #1a1a1a var(--progress, 50%), #1a1a1a 100%);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.interactive-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.interactive-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10px;
  color: #888;
}

.interactive-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.int-metric {
  text-align: center;
}

.int-label {
  font-size: 10px;
  color: #aaa;
}

.int-value {
  font-size: 18px;
  font-weight: 600;
}

.int-value.highlight {
  color: #00D9C0;
}

/* Formula */
.formula-block {
  margin: 24px 0;
  padding: 16px;
  background: rgba(0,217,192,0.05);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 8px;
}

.formula-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.formula-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.formula-col {
  font-family: monospace;
  font-size: 12px;
  line-height: 2;
}

.formula-col.bordered {
  border-left: 1px solid rgba(0,217,192,0.2);
  padding-left: 24px;
}

.formula-col .dim {
  color: #aaa;
}

.formula-col .hl {
  color: #00D9C0;
}

.formula-total {
  padding-top: 8px;
  border-top: 1px solid rgba(0,217,192,0.2);
  margin-top: 8px;
}

.formula-total .big {
  font-size: 16px;
  font-weight: 700;
}

/* Collateral */
.collateral-block {
  padding: 16px;
  background: rgba(0,217,192,0.05);
  border: 1px solid rgba(0,217,192,0.2);
  border-radius: 8px;
}

.collateral-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #00D9C0;
}

.collateral-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  text-align: center;
}

.coll-label {
  font-size: 10px;
  color: #aaa;
}

.coll-value {
  font-size: 18px;
  font-weight: 600;
}

.coll-value.highlight {
  color: #00D9C0;
}

/* Warning Card */
.warning-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 24px;
  background: rgba(232,25,44,0.1);
  border: 1px solid rgba(232,25,44,0.3);
  border-radius: 12px;
}

.warning-title {
  font-size: 14px;
  font-weight: 600;
  color: #E8192C;
}

.warning-desc {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* Comparison Table */
.comparison-table {
  overflow-x: auto;
}

.comparison-table table {
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

.comparison-table th:last-child {
  text-align: right;
}

.comparison-table td {
  padding: 16px 14px;
  border-bottom: 1px solid #111;
}

.comparison-table td:last-child {
  text-align: right;
}

.comparison-table .highlight-row {
  background: rgba(0,217,192,0.05);
}

.comparison-table .highlight {
  color: #00D9C0;
}

.comparison-table .dim {
  color: #555;
}

.table-note {
  margin-top: 12px;
  font-size: 10px;
  color: #555;
}

/* Q&A */
.qa-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.qa-categories {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qa-categories button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  text-align: left;
}

.qa-categories button.active {
  background: rgba(0,217,192,0.1);
  border-left-color: #00D9C0;
}

.cat-name {
  font-size: 13px;
  color: #888;
}

.qa-categories button.active .cat-name {
  color: #00D9C0;
  font-weight: 600;
}

.cat-count {
  font-size: 10px;
  color: #555;
}

.qa-questions {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.qa-item {
  margin-bottom: 12px;
  border-bottom: 1px solid #111;
  padding-bottom: 12px;
}

.qa-q {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0;
  cursor: pointer;
}

.qa-q svg {
  transition: transform 0.2s ease;
}

.qa-q svg.open {
  transform: rotate(90deg);
}

.qa-a {
  font-size: 13px;
  color: #888;
  line-height: 1.7;
  margin: 8px 0 0;
  padding-left: 28px;
}

/* CTA */
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

.cta-portfolio h3 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px;
  border: none;
  padding: 0;
}

.portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #111;
}

.portfolio-item.optima {
  background: rgba(0,217,192,0.05);
  border-radius: 8px;
  padding: 10px 12px;
  margin: -10px -12px;
  border-bottom: none;
  margin-bottom: 4px;
  animation: optima-glow 2s ease-in-out infinite;
}

@keyframes optima-glow {
  0%, 100% { box-shadow: 0 0 0 1px rgba(0,217,192,0.3), 0 0 10px rgba(0,217,192,0.1); }
  50% { box-shadow: 0 0 0 1px rgba(0,217,192,0.6), 0 0 20px rgba(0,217,192,0.2); }
}

.portfolio-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.portfolio-name .dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.portfolio-name span:not(.dot) {
  font-size: 13px;
  color: #888;
}

.portfolio-name .optima-name {
  color: #00D9C0;
  font-weight: 600;
}

.portfolio-item span:last-child {
  font-size: 14px;
  font-weight: 500;
  color: #888;
}

.portfolio-item .optima-amount {
  color: #fff;
}

.cta-income {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #0a0a0a;
  border-radius: 12px;
  padding: 32px;
}

.income-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.income-value {
  font-size: 42px;
  font-weight: 600;
  color: #00D9C0;
}

.income-note {
  font-size: 13px;
  color: #666;
  margin-top: 12px;
}

.income-note strong {
  color: #fff;
}

.cta-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 32px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%);
  border: none;
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,217,192,0.4);
  filter: brightness(1.1);
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

.btn-secondary:hover {
  background: rgba(0,217,192,0.1);
  transform: translateY(-2px);
}

/* Partner Badge */
.partner-badge-container {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  margin-bottom: 24px;
}

.partner-badge-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border: 1px solid #00D9C0;
  border-radius: 8px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  animation: radar-glow 3s ease-in-out infinite;
  cursor: pointer;
}

@keyframes radar-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(0,217,192,0.3), 0 0 20px rgba(0,217,192,0.1); }
  50% { box-shadow: 0 0 20px rgba(0,217,192,0.6), 0 0 40px rgba(0,217,192,0.3); }
}

.radar-dot {
  width: 8px;
  height: 8px;
  background: #00D9C0;
  border-radius: 50%;
  animation: radar-dot-pulse 3s ease-in-out infinite;
}

@keyframes radar-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 12px #00D9C0; }
  50% { opacity: 0.4; }
}

.partner-badge-link span:last-child {
  font-family: monospace;
  font-size: 11px;
  color: #00D9C0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Footer */
.calc-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #111;
  font-size: 11px;
  color: #444;
}

.calc-footer p {
  margin: 0;
  color: #666;
}

/* Responsive */
@media (max-width: 1024px) {
  .steps-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  
  .step-arrow {
    display: none;
  }
  
  .allocation-grid {
    grid-template-columns: 1fr;
  }
  
  .allocation-chart {
    order: -1;
    margin-bottom: 24px;
  }
  
  .optima-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .interactive-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .formula-grid {
    grid-template-columns: 1fr;
  }
  
  .formula-col.bordered {
    border-left: none;
    border-top: 1px solid rgba(0,217,192,0.2);
    padding-left: 0;
    padding-top: 16px;
  }
  
  .qa-grid {
    grid-template-columns: 1fr;
  }
  
  .qa-categories {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .qa-categories button {
    border-left: none;
    border-bottom: 2px solid transparent;
    border-radius: 8px;
    padding: 8px 12px;
  }
  
  .qa-categories button.active {
    border-bottom-color: #00D9C0;
    background: rgba(0,217,192,0.1);
  }
  
  .cta-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
