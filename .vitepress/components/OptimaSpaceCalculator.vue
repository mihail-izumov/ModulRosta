<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

// ═══════════════════════════════════════════════════════════════════════════════
// КОНСУЛЬТАНТ ПО ДОЛЕВЫМ ИНВЕСТИЦИЯМ В ОФИСНУЮ НЕДВИЖИМОСТЬ
// Vue 3 версия для VitePress — Модуль Роста®
// v3.0 — ИСПРАВЛЕННАЯ ВЕРСИЯ: числа, тултипы, слайдеры
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
  }
}

const ASSET_CLASSES = [
  { id: 'optima', name: 'Optima Space', minYield: 31, maxYield: 38, risk: 4, color: COLORS.primary, tag: 'РЕКОМЕНДУЕМ', tagColor: COLORS.primary, description: 'Сервисные офисы с обратным выкупом', tooltip: 'Долевые инвестиции в сервисный офис. Минимум 600 000₽. Обратный выкуп через 4,5 года.' },
  { id: 'warehouse', name: 'Складская логистика', minYield: 11, maxYield: 13, risk: 3, color: '#3B82F6', tag: 'СТАБИЛЬНО', tagColor: '#3B82F6', description: 'ЗПИФ, дефицит 1.5%', tooltip: 'Инвестиции в склады через ЗПИФ.' },
  { id: 'streetretail', name: 'Street-retail', minYield: 9, maxYield: 16, risk: 3, color: '#06B6D4', tag: 'ЛИКВИДНО', tagColor: '#06B6D4', description: 'Первые этажи, вакансия 4-5%', tooltip: 'Торговые помещения на первых этажах.' },
  { id: 'bonds', name: 'Облигации', minYield: 10, maxYield: 13, risk: 2, color: '#8B5CF6', tag: 'УМЕРЕННО', tagColor: '#8B5CF6', description: 'Корпоративные и ОФЗ', tooltip: 'Долговые ценные бумаги.' },
  { id: 'dividends', name: 'Дивидендные акции', minYield: 12, maxYield: 15, risk: 5, color: '#FF7A45', tag: 'ДОХОДНО', tagColor: '#FF7A45', description: 'Голубые фишки', tooltip: 'Акции с дивидендами.' },
  { id: 'deposits', name: 'Резерв (депозиты)', minYield: 18, maxYield: 20, risk: 1, color: '#10B981', tag: 'ЗАЩИТА', tagColor: '#10B981', description: 'АСВ до 1.4 млн', tooltip: 'Банковские вклады.' },
]

const STRATEGIES = {
  conservative: { name: 'Консервативная', target: '14-16%', description: 'Минимальный риск', allocations: { optima: 10, warehouse: 25, streetretail: 15, bonds: 20, dividends: 15, deposits: 15 }, tooltip: 'Приоритет — сохранение капитала.\n\n✓ Горизонт 3-5 лет\n✓ Просадка до 10%\n✓ Стабильность важнее' },
  balanced: { name: 'Сбалансированная', target: '18-22%', description: 'Баланс риска и доходности', allocations: { optima: 20, warehouse: 25, streetretail: 15, bonds: 15, dividends: 15, deposits: 10 }, tooltip: 'Оптимальное соотношение риск/доход.\n\n✓ Горизонт 5-10 лет\n✓ Просадка 15-20%\n✓ Доход выше депозитов' },
  growth: { name: 'Рост капитала', target: '22-28%', description: 'Максимальная доходность', allocations: { optima: 30, warehouse: 20, streetretail: 20, bonds: 10, dividends: 15, deposits: 5 }, tooltip: 'Агрессивный рост.\n\n✓ Горизонт 10+ лет\n✓ Волатильность 25-30%\n✓ Другие источники дохода' }
}

const QA_CATEGORIES = [
  { id: 'financial', name: 'Финансы', icon: '💰' },
  { id: 'legal', name: 'Юридическое', icon: '📜' },
  { id: 'operational', name: 'Операционное', icon: '⚙️' },
  { id: 'risks', name: 'Риски', icon: '⚠️' },
  { id: 'exit', name: 'Выход', icon: '🚪' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// REACTIVE STATE
// ═══════════════════════════════════════════════════════════════════════════════

const isMobile = ref(false)
const totalCapital = ref(10000000)
// ВАЖНО: Инициализируем числами явно
const allocations = ref({
  optima: 20,
  warehouse: 25,
  streetretail: 15,
  bonds: 15,
  dividends: 15,
  deposits: 10
})
const amounts = ref({})
const activeStrategy = ref('balanced')
const inputMode = ref('percent')
const activeQACategory = ref('financial')
const openQuestion = ref(null)
const occupancy = ref(75)
const isGeneratingPDF = ref(false)

// Tooltip states
const tooltipVisible = ref({})
const hoveredPieSegment = ref(null)

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Ensure number
// ═══════════════════════════════════════════════════════════════════════════════
const ensureNumber = (val) => {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTED - ВСЕ С ПРИНУДИТЕЛЬНЫМ ПРЕОБРАЗОВАНИЕМ В ЧИСЛА
// ═══════════════════════════════════════════════════════════════════════════════

const portfolioMetrics = computed(() => {
  let totalYield = 0
  let totalRisk = 0
  let totalAllocation = 0
  
  ASSET_CLASSES.forEach(asset => {
    // КРИТИЧНО: Всегда преобразуем в число!
    const alloc = ensureNumber(allocations.value[asset.id])
    totalAllocation += alloc
    totalYield += ((asset.minYield + asset.maxYield) / 2) * (alloc / 100)
    totalRisk += asset.risk * (alloc / 100)
  })
  
  return { 
    yield: totalYield, 
    risk: totalRisk, 
    totalAllocation: Math.round(totalAllocation) // Округляем для точности
  }
})

const optimaInvestment = computed(() => {
  const alloc = ensureNumber(allocations.value.optima)
  const capital = ensureNumber(totalCapital.value)
  return Math.round(capital * (alloc / 100))
})

const optimaShares = computed(() => Math.floor(optimaInvestment.value / 500))

const isOptimaValid = computed(() => {
  return optimaInvestment.value === 0 || optimaInvestment.value >= OPTIMA_SPACE.minInvestment
})

const chartData = computed(() => {
  return ASSET_CLASSES
    .filter(a => ensureNumber(allocations.value[a.id]) > 0)
    .map(a => ({
      name: a.name,
      value: ensureNumber(allocations.value[a.id]),
      color: a.color,
      amount: Math.round(ensureNumber(totalCapital.value) * ensureNumber(allocations.value[a.id]) / 100)
    }))
})

const scenarios = computed(() => {
  const calc = (occ) => {
    const inv = optimaInvestment.value
    const shares = optimaShares.value
    if (inv === 0 || shares === 0) return { dividends: 0, buyback: 0, total: 0, roi: 0 }
    
    const adjROI = (occ / 90) * OPTIMA_SPACE.rounds[0].roi
    const divs = inv * (adjROI / 100) * 4.5
    const divPerShare = divs / shares
    const buyback = Math.max(0, shares * Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare))
    return { 
      dividends: divs, 
      buyback, 
      total: divs + buyback, 
      roi: Math.round((divs / inv) * 100) 
    }
  }
  return {
    optimistic: { label: 'Оптимистичный', occupancy: 95, ...calc(95), color: COLORS.gold },
    base: { label: 'Базовый', occupancy: 90, ...calc(90), color: COLORS.primary },
    worst: { label: 'Худший', occupancy: 50, ...calc(50), color: COLORS.error }
  }
})

const currentScenario = computed(() => {
  const inv = optimaInvestment.value
  const shares = optimaShares.value
  const occ = ensureNumber(occupancy.value)
  
  if (inv === 0 || shares === 0) {
    return { adjROI: 0, yearlyDiv: 0, totalDivs: 0, payback: Infinity, buybackPrice: 500, buybackTotal: 0 }
  }
  
  const adjROI = (occ / 90) * OPTIMA_SPACE.rounds[0].roi
  const yearlyDiv = inv * (adjROI / 100)
  const totalDivs = yearlyDiv * 4.5
  const payback = yearlyDiv > 0 ? Math.round((inv / yearlyDiv) * 12) : Infinity
  const divPerShare = totalDivs / shares
  const buybackPrice = Math.max(OPTIMA_SPACE.buybackMinPrice, OPTIMA_SPACE.buybackPrice - divPerShare)
  return { adjROI, yearlyDiv, totalDivs, payback, buybackPrice, buybackTotal: shares * buybackPrice }
})

const collateralCoverage = computed(() => {
  const inv = optimaInvestment.value
  return inv > 0 ? (OPTIMA_SPACE.collateralValue / inv).toFixed(0) : '∞'
})

const goalStatus = computed(() => {
  const total = portfolioMetrics.value.totalAllocation
  const yld = portfolioMetrics.value.yield
  
  if (total === 0) return { text: 'Распределите капитал', color: COLORS.textMuted, isSuccess: false }
  if (yld >= 20) return { text: '✓ Цель 20%+ достигнута', color: COLORS.primary, isSuccess: true }
  return { text: '↑ Добавьте доходные активы', color: COLORS.warning, isSuccess: false }
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

// ═══════════════════════════════════════════════════════════════════════════════
// METHODS
// ═══════════════════════════════════════════════════════════════════════════════

const formatCurrency = (amount) => {
  const num = ensureNumber(amount)
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)} млн ₽`
  if (num >= 1000) return `${Math.round(num / 1000)} тыс ₽`
  return `${Math.round(num)} ₽`
}

const formatPercent = (value) => `${ensureNumber(value).toFixed(1)}%`

const loadStrategy = (key) => {
  // ВАЖНО: Создаём новый объект с числами
  const newAlloc = {}
  Object.entries(STRATEGIES[key].allocations).forEach(([k, v]) => {
    newAlloc[k] = ensureNumber(v)
  })
  allocations.value = newAlloc
  activeStrategy.value = key
  inputMode.value = 'percent'
}

// КРИТИЧНО: Обработчик изменения процента с явным преобразованием
const updateAllocation = (assetId, value) => {
  allocations.value[assetId] = ensureNumber(value)
  activeStrategy.value = null
}

const autoDistribute = () => {
  const currentTotal = portfolioMetrics.value.totalAllocation
  if (currentTotal === 100) return
  
  const strategy = activeStrategy.value ? STRATEGIES[activeStrategy.value].allocations : STRATEGIES.balanced.allocations
  const strategyTotal = Object.values(strategy).reduce((a, b) => ensureNumber(a) + ensureNumber(b), 0)
  const newAllocations = {}
  
  if (currentTotal > 100) {
    const ratio = 100 / currentTotal
    Object.keys(allocations.value).forEach(assetId => {
      newAllocations[assetId] = Math.round(ensureNumber(allocations.value[assetId]) * ratio)
    })
  } else {
    const remaining = 100 - currentTotal
    Object.keys(strategy).forEach(assetId => {
      const toAdd = Math.round(remaining * (ensureNumber(strategy[assetId]) / strategyTotal))
      newAllocations[assetId] = ensureNumber(allocations.value[assetId] || 0) + toAdd
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

const showTooltip = (key) => {
  tooltipVisible.value[key] = true
}

const hideTooltip = (key) => {
  tooltipVisible.value[key] = false
}

// Slider gradient computation
const getSliderGradient = (value, min, max, color) => {
  const percent = ((ensureNumber(value) - min) / (max - min)) * 100
  return `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, #1a1a1a ${percent}%, #1a1a1a 100%)`
}

// PDF Generation
const generatePDF = async () => {
  isGeneratingPDF.value = true
  
  const shares = optimaShares.value
  const totalIncome = optimaInvestment.value * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5
  
  const printWindow = window.open('', '_blank')
  
  printWindow.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Инвестиционный отчёт — Optima Space</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@page { size: A4; margin: 15mm; }
@media print { body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .no-print { display: none !important; } }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a1a; line-height: 1.5; }
.container { max-width: 800px; margin: 0 auto; padding: 40px; }
.header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #00D9C0; }
.header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.section { margin-bottom: 32px; }
.section h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #eee; }
.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.metric { background: #f8f9fa; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #e9ecef; }
.metric-label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 6px; }
.metric-value { font-size: 22px; font-weight: 700; }
.metric-value.hl { color: #00D9C0; }
.info-block { background: rgba(0,217,192,0.08); padding: 20px 24px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #00D9C0; }
.info-block h3 { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.info-block p { font-size: 13px; color: #444; }
.footer { margin-top: 48px; padding-top: 24px; border-top: 2px solid #eee; text-align: center; font-size: 11px; color: #888; }
.print-btn { display: block; width: 300px; margin: 0 auto 30px; padding: 16px; background: linear-gradient(135deg, #00D9C0, #00a67d); color: #000; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; }
</style></head><body>
<div class="container">
<button class="print-btn no-print" onclick="window.print()">📄 Сохранить как PDF (Ctrl+P)</button>
<div class="header">
<h1>Персональный инвестиционный отчёт</h1>
<p>Консультант по долевым инвестициям в офисную недвижимость</p>
<p style="font-size:12px;color:#999;margin-top:8px">Сформирован: ${new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>

<div class="section">
<h2>Ваш инвестиционный портфель</h2>
<div class="metric-grid">
<div class="metric"><div class="metric-label">Общий капитал</div><div class="metric-value">${formatCurrency(totalCapital.value)}</div></div>
<div class="metric"><div class="metric-label">Доходность</div><div class="metric-value hl">${portfolioMetrics.value.yield.toFixed(1)}%</div></div>
<div class="metric"><div class="metric-label">Риск</div><div class="metric-value">${portfolioMetrics.value.risk.toFixed(1)}/10</div></div>
<div class="metric"><div class="metric-label">Доход 4,5г</div><div class="metric-value hl">${formatCurrency(totalCapital.value * (portfolioMetrics.value.yield / 100) * 4.5)}</div></div>
</div>
<div class="info-block">
<h3>Распределение активов</h3>
${chartData.value.map(item => `<p><strong>${item.name}:</strong> ${item.value}% — ${formatCurrency(item.amount)}</p>`).join('')}
</div>
</div>

${optimaInvestment.value >= OPTIMA_SPACE.minInvestment ? `
<div class="section">
<h2>Инвестиция в Optima Space</h2>
<div class="metric-grid">
<div class="metric"><div class="metric-label">Сумма</div><div class="metric-value hl">${formatCurrency(optimaInvestment.value)}</div></div>
<div class="metric"><div class="metric-label">Акции</div><div class="metric-value">${shares.toLocaleString()}</div></div>
<div class="metric"><div class="metric-label">ROI</div><div class="metric-value hl">${OPTIMA_SPACE.rounds[0].roi}%</div></div>
<div class="metric"><div class="metric-label">Доход 4,5г</div><div class="metric-value hl">${formatCurrency(totalIncome)}</div></div>
</div>
<div class="info-block">
<h3>🛡️ Гарантия обратного выкупа</h3>
<p>Через 4,5 года основатель обязан выкупить акции: <strong>1000₽ − дивиденды</strong> (мин 500₽).</p>
<p>Залог: ${OPTIMA_SPACE.collateral} кв.м (~${formatCurrency(OPTIMA_SPACE.collateralValue)}). Покрытие: <strong>${collateralCoverage.value}×</strong></p>
</div>
</div>
` : ''}

<div class="footer">
<p><strong>Важно:</strong> Данный отчёт не является публичной офертой. Инвестиции связаны с рисками.</p>
<p style="margin-top:12px">© 2026 Optima Space • Технологический партнёр: Модуль Роста®</p>
</div>
</div>
</body></html>`)
  
  printWindow.document.close()
  isGeneratingPDF.value = false
}

// ═══════════════════════════════════════════════════════════════════════════════
// WATCHERS
// ═══════════════════════════════════════════════════════════════════════════════

watch([allocations, totalCapital], () => {
  if (inputMode.value === 'percent') {
    const newAmounts = {}
    ASSET_CLASSES.forEach(a => {
      newAmounts[a.id] = Math.round(ensureNumber(totalCapital.value) * ensureNumber(allocations.value[a.id]) / 100)
    })
    amounts.value = newAmounts
  }
}, { deep: true, immediate: true })

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

onMounted(() => {
  const check = () => { isMobile.value = window.innerWidth < 1024 }
  check()
  window.addEventListener('resize', check)
})

// ═══════════════════════════════════════════════════════════════════════════════
// PIE CHART
// ═══════════════════════════════════════════════════════════════════════════════

const pieChartGradient = computed(() => {
  if (chartData.value.length === 0) return '#1a1a1a'
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
  <div class="optima-wrapper">
    <!-- Mobile Warning -->
    <div v-if="isMobile" class="mobile-warning">
      <div class="mobile-card">
        <div class="mobile-icon">📱</div>
        <h2>Откройте на компьютере</h2>
        <p>Консультант оптимизирован для экранов от 1024px.</p>
      </div>
    </div>

    <!-- Main Calculator -->
    <div v-else class="calculator">
      <!-- Header -->
      <header class="header">
        <div class="subtitle">Стратегический инструмент для инвесторов</div>
        <h1 class="title">Консультант по долевым инвестициям<br>в офисную недвижимость</h1>
        <p class="desc">
          Рассчитайте структуру портфеля для достижения 
          <span class="tooltip-trigger" @mouseenter="showTooltip('target')" @mouseleave="hideTooltip('target')">
            <span class="hl">цели 20%+ годовой доходности</span>
            <span class="tooltip-icon">?</span>
            <span v-if="tooltipVisible['target']" class="tooltip-box">{{ TOOLTIPS.targetYield }}</span>
          </span>.
        </p>
      </header>

      <!-- How It Works -->
      <section class="how-section">
        <div class="badge-center">
          <span class="top-badge">Умные инвестиции в Optima Space</span>
        </div>
        <div class="steps-row">
          <div class="step-item">
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="step-title">Ваш капитал</div>
            <div class="step-sub">Сколько готовы инвестировать</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step-item">
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
            </div>
            <div class="step-title">Распределите активы</div>
            <div class="step-sub">Офисы, склады, ритейл, резерв</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step-item">
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><circle cx="12" cy="10" r="2"/></svg>
            </div>
            <div class="step-title">Детали Optima Space</div>
            <div class="step-sub">Акции, дивиденды, гарантии</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step-item">
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>
            </div>
            <div class="step-title">Скачайте отчёт</div>
            <div class="step-sub">Персональная стратегия</div>
          </div>
        </div>
      </section>

      <!-- Step 1: Capital -->
      <section class="card-section">
        <div class="card-header">
          <span class="num">1</span>
          <span class="card-title">Ваш инвестиционный капитал</span>
        </div>
        <div class="capital-row">
          <span class="capital-label">Сумма для инвестирования</span>
          <span class="capital-value">{{ formatCurrency(totalCapital) }}</span>
        </div>
        <input 
          type="range" 
          :value="totalCapital" 
          @input="e => totalCapital = Number(e.target.value)"
          :min="1000000" 
          :max="100000000" 
          :step="500000" 
          class="main-slider"
          :style="{ background: getSliderGradient(totalCapital, 1000000, 100000000, COLORS.primary) }"
        />
        <div class="slider-labels">
          <span>1 млн ₽</span>
          <span>100 млн ₽</span>
        </div>
        <div class="quick-btns">
          <button 
            v-for="v in [3000000, 5000000, 10000000, 20000000, 50000000]" 
            :key="v" 
            @click="totalCapital = v" 
            :class="{ active: totalCapital === v }"
          >
            {{ formatCurrency(v) }}
          </button>
        </div>
      </section>

      <!-- Step 2: Strategy -->
      <section class="card-section">
        <div class="card-header">
          <span class="num">2</span>
          <span class="card-title">Выберите стратегию</span>
        </div>

        <div class="strategies-row">
          <button 
            v-for="(strategy, key) in STRATEGIES" 
            :key="key" 
            @click="loadStrategy(key)" 
            :class="['strategy-card', { active: activeStrategy === key }]"
          >
            <div class="strat-name tooltip-trigger" @mouseenter="showTooltip('strat-'+key)" @mouseleave="hideTooltip('strat-'+key)">
              {{ strategy.name }}
              <span class="tooltip-icon">?</span>
              <span v-if="tooltipVisible['strat-'+key]" class="tooltip-box strat-tooltip">{{ strategy.tooltip }}</span>
            </div>
            <div class="strat-desc">{{ strategy.description }}</div>
            <div class="strat-target">{{ strategy.target }}</div>
          </button>
        </div>

        <div class="mode-toggle">
          <button @click="inputMode = 'percent'" :class="{ active: inputMode === 'percent' }">Ввод в %</button>
          <button @click="inputMode = 'amount'" :class="{ active: inputMode === 'amount' }">Ввод в ₽</button>
        </div>

        <div class="alloc-grid">
          <div class="alloc-list">
            <div class="alloc-list-header">
              Распределение активов
              <span v-if="!activeStrategy" class="manual-tag">• вручную</span>
            </div>

            <div v-for="asset in ASSET_CLASSES" :key="asset.id" class="asset-block">
              <div class="asset-top">
                <div class="asset-left">
                  <span class="asset-dot" :style="{ background: asset.color }"></span>
                  <span class="asset-name tooltip-trigger" @mouseenter="showTooltip('asset-'+asset.id)" @mouseleave="hideTooltip('asset-'+asset.id)">
                    {{ asset.name }}
                    <span class="tooltip-icon">?</span>
                    <span v-if="tooltipVisible['asset-'+asset.id]" class="tooltip-box">{{ asset.tooltip }}</span>
                  </span>
                  <span class="asset-tag" :style="{ background: asset.tagColor + '20', color: asset.tagColor, borderColor: asset.tagColor + '40' }">{{ asset.tag }}</span>
                </div>
                <div class="asset-right">
                  <span class="asset-amount">{{ formatCurrency(totalCapital * ensureNumber(allocations[asset.id]) / 100) }}</span>
                  <span class="asset-pct">{{ ensureNumber(allocations[asset.id]) }}%</span>
                </div>
              </div>
              <div class="asset-desc" :class="{ 'error-text': asset.id === 'optima' && ensureNumber(allocations[asset.id]) > 0 && totalCapital * ensureNumber(allocations[asset.id]) / 100 < OPTIMA_SPACE.minInvestment }">
                {{ asset.id === 'optima' && ensureNumber(allocations[asset.id]) > 0 && totalCapital * ensureNumber(allocations[asset.id]) / 100 < OPTIMA_SPACE.minInvestment ? `Минимум ${formatCurrency(OPTIMA_SPACE.minInvestment)}` : asset.description }}
              </div>
              <input 
                v-if="inputMode === 'percent'" 
                type="range" 
                :value="ensureNumber(allocations[asset.id])"
                @input="e => updateAllocation(asset.id, e.target.value)"
                :min="0" 
                :max="asset.id === 'optima' ? 35 : 50" 
                class="asset-slider"
                :style="{ background: getSliderGradient(allocations[asset.id], 0, asset.id === 'optima' ? 35 : 50, asset.color) }"
              />
              <div class="asset-meta">
                <span>Доходность: {{ asset.minYield }}–{{ asset.maxYield }}%</span>
                <span>Риск: {{ asset.risk }}/10</span>
              </div>
            </div>

            <div class="total-row" :class="{ success: portfolioMetrics.totalAllocation === 100, error: portfolioMetrics.totalAllocation > 100, warning: portfolioMetrics.totalAllocation < 100 && portfolioMetrics.totalAllocation > 0 }">
              <span>Итого распределено</span>
              <span class="total-pct">{{ portfolioMetrics.totalAllocation }}%</span>
            </div>

            <div v-if="portfolioMetrics.totalAllocation !== 100" class="auto-block">
              <div class="auto-hint" :class="{ error: portfolioMetrics.totalAllocation > 100 }">
                {{ portfolioMetrics.totalAllocation > 100 ? `Превышение на ${portfolioMetrics.totalAllocation - 100}%` : `Не распределено: ${formatCurrency(totalCapital * (100 - portfolioMetrics.totalAllocation) / 100)}` }}
              </div>
              <button @click="autoDistribute" class="auto-btn tooltip-trigger" @mouseenter="showTooltip('auto')" @mouseleave="hideTooltip('auto')">
                {{ portfolioMetrics.totalAllocation > 100 ? 'Выровнять до 100%' : `+ Добавить доходные активы` }}
                <span v-if="tooltipVisible['auto']" class="tooltip-box auto-tooltip">{{ TOOLTIPS.autoDistribute }}</span>
              </button>
            </div>
          </div>

          <div class="chart-col">
            <div class="pie-wrapper">
              <div class="pie-chart" :style="{ background: pieChartGradient }">
                <div class="pie-hole"></div>
              </div>
              <!-- Hover tooltip for pie -->
              <div v-if="hoveredPieSegment" class="pie-tooltip">
                <div class="pie-tooltip-name">{{ hoveredPieSegment.name }}</div>
                <div class="pie-tooltip-value" :style="{ color: hoveredPieSegment.color }">{{ hoveredPieSegment.value }}%</div>
                <div class="pie-tooltip-amount">{{ formatCurrency(hoveredPieSegment.amount) }}</div>
              </div>
            </div>
            <div class="metrics-row">
              <div class="metric-box">
                <div class="m-label">Доходность</div>
                <div class="m-value" :class="{ hl: portfolioMetrics.yield >= 20 }">{{ portfolioMetrics.totalAllocation > 0 ? formatPercent(portfolioMetrics.yield) : '—' }}</div>
              </div>
              <div class="metric-box">
                <div class="m-label">Риск</div>
                <div class="m-value" :class="{ warn: portfolioMetrics.risk > 4 }">{{ portfolioMetrics.totalAllocation > 0 ? `${portfolioMetrics.risk.toFixed(1)}/10` : '—' }}</div>
              </div>
            </div>
            <div class="goal-box" :class="{ success: goalStatus.isSuccess }">
              {{ goalStatus.text }}
            </div>
          </div>
        </div>
      </section>

      <!-- Step 3: Optima Details -->
      <section v-if="ensureNumber(allocations.optima) > 0 && isOptimaValid" class="card-section">
        <div class="card-header">
          <span class="num">3</span>
          <span class="card-title">Детали инвестиции в Optima Space</span>
        </div>

        <div class="optima-metrics">
          <div class="o-metric hl-bg">
            <div class="o-label">Ваша инвестиция</div>
            <div class="o-value">{{ formatCurrency(optimaInvestment) }}</div>
            <div class="o-sub">{{ optimaShares.toLocaleString() }} акций</div>
          </div>
          <div class="o-metric">
            <div class="o-label">ROI годовых</div>
            <div class="o-value">{{ OPTIMA_SPACE.rounds[0].roi }}%</div>
            <div class="o-sub">I раунд</div>
          </div>
          <div class="o-metric">
            <div class="o-label">Окупаемость</div>
            <div class="o-value">{{ OPTIMA_SPACE.paybackMonths }} мес</div>
            <div class="o-sub">возврат дивидендами</div>
          </div>
          <div class="o-metric">
            <div class="o-label">Доход за 4,5 года</div>
            <div class="o-value hl">{{ formatCurrency(optimaInvestment * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5) }}</div>
            <div class="o-sub">ROI {{ ((OPTIMA_SPACE.rounds[0].roi / 100) * 4.5 * 100).toFixed(0) }}%</div>
          </div>
        </div>

        <!-- Guarantee -->
        <div class="guarantee-box">
          <div class="g-header">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span>Гарантия обратного выкупа</span>
          </div>

          <!-- Timeline -->
          <div class="timeline-wrap">
            <div class="timeline-title">Timeline проекта</div>
            <div class="timeline">
              <div class="tl-line"></div>
              <div class="tl-progress"></div>
              <div v-for="(step, i) in [{ label: 'Покупка', sub: 'акций', done: true }, { label: 'Запуск', sub: '+6 мес', done: false }, { label: 'Окупаемость', sub: '+29 мес', done: false }, { label: 'Опцион', sub: '+55 мес', done: false }]" :key="i" class="tl-step">
                <div class="tl-dot" :class="{ done: step.done, current: i === 1 }">{{ step.done ? '✓' : i + 1 }}</div>
                <div class="tl-label" :class="{ done: step.done }">{{ step.label }}</div>
                <div class="tl-sub">{{ step.sub }}</div>
              </div>
            </div>
          </div>

          <!-- Scenarios -->
          <div class="scenarios-title">Сценарии выкупа (ваши {{ formatCurrency(optimaInvestment) }})</div>
          <div class="scenarios-row">
            <div v-for="(s, key) in scenarios" :key="key" class="scenario-box" :class="{ base: key === 'base', worst: key === 'worst' }">
              <div class="sc-dot" :style="{ background: s.color }"></div>
              <div class="sc-label">{{ s.label }}</div>
              <div class="sc-occ">Загрузка {{ s.occupancy }}%</div>
              <div class="sc-divs">Дивиденды: <span>{{ formatCurrency(s.dividends) }}</span></div>
              <div v-if="s.buyback > 0" class="sc-buyback">Выкуп: <span>{{ formatCurrency(s.buyback) }}</span></div>
              <div class="sc-total">{{ formatCurrency(s.total) }}</div>
              <div class="sc-roi">ROI: {{ s.roi }}%</div>
            </div>
          </div>
          <div class="g-note">✓ Даже при загрузке 50% вы получаете доход</div>

          <!-- Interactive -->
          <div class="interactive-box">
            <div class="int-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.95 16.95l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.95 7.05l1.42-1.42"/></svg>
              <span>Интерактивный расчёт: Что если загрузка = <strong>{{ occupancy }}%</strong>?</span>
            </div>
            <input 
              type="range" 
              :value="occupancy"
              @input="e => occupancy = Number(e.target.value)"
              :min="30" 
              :max="100" 
              class="int-slider"
              :style="{ background: getSliderGradient(occupancy, 30, 100, COLORS.primary) }"
            />
            <div class="int-labels">
              <span>30%</span><span>50%</span><span>90% (план)</span><span>100%</span>
            </div>
            <div class="int-metrics">
              <div class="int-m">
                <div class="int-m-label">ROI годовых</div>
                <div class="int-m-value" :class="{ hl: currentScenario.adjROI >= 20 }">{{ currentScenario.adjROI.toFixed(1) }}%</div>
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

          <!-- Formula -->
          <div class="formula-box">
            <div class="f-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>
              <span>Ваша персональная формула</span>
            </div>
            <div class="f-grid">
              <div class="f-col">
                <div><span class="dim">Акции:</span> <strong>{{ optimaShares.toLocaleString() }}</strong> шт</div>
                <div><span class="dim">× Номинал:</span> <span class="hl">{{ OPTIMA_SPACE.buybackPrice }}₽</span></div>
                <div><span class="dim">− Дивиденды/акция:</span> <span class="hl">{{ optimaShares > 0 ? (currentScenario.totalDivs / optimaShares).toFixed(0) : 0 }}₽</span></div>
              </div>
              <div class="f-col bordered">
                <div><span class="dim">Выкуп:</span> <strong>{{ formatCurrency(currentScenario.buybackTotal) }}</strong></div>
                <div><span class="dim">+ Дивиденды:</span> <span class="hl">{{ formatCurrency(currentScenario.totalDivs) }}</span></div>
                <div class="f-total"><span class="dim">ИТОГО:</span> <span class="hl big">{{ formatCurrency(currentScenario.totalDivs + currentScenario.buybackTotal) }}</span></div>
              </div>
            </div>
          </div>

          <!-- Collateral -->
          <div class="collateral-box">
            <div class="c-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D9C0" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
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
                <div class="c-value hl">{{ collateralCoverage }}×</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Warning -->
      <section v-if="ensureNumber(allocations.optima) > 0 && !isOptimaValid" class="warning-box">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8192C" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        <div>
          <div class="w-title">Минимальная инвестиция в Optima Space — {{ formatCurrency(OPTIMA_SPACE.minInvestment) }}</div>
          <div class="w-desc">Текущая сумма: {{ formatCurrency(optimaInvestment) }}. Добавьте ещё {{ formatCurrency(OPTIMA_SPACE.minInvestment - optimaInvestment) }} или выберите 0%.</div>
        </div>
      </section>

      <!-- Step 4: Comparison -->
      <section class="card-section">
        <div class="card-header">
          <span class="num">4</span>
          <span class="card-title">Сравнение инструментов</span>
        </div>
        <div class="table-wrap">
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
              <tr class="hl-row">
                <td><strong>● Optima Space (I раунд)</strong></td>
                <td class="hl">38%</td>
                <td class="hl">Обратный выкуп</td>
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
                <td class="hl">АСВ 1.4М</td>
                <td>1/10</td>
                <td>{{ formatCurrency(2000000 * 0.72) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="table-note">* Ставки депозитов снизятся в 2026-2027</div>
        </div>
      </section>

      <!-- Step 5: Q&A -->
      <section class="card-section">
        <div class="card-header">
          <span class="num">5</span>
          <span class="card-title">Вопросы инвестора</span>
        </div>
        <div class="qa-layout">
          <div class="qa-cats">
            <button v-for="cat in QA_CATEGORIES" :key="cat.id" @click="activeQACategory = cat.id; openQuestion = null" :class="{ active: activeQACategory === cat.id }">
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ questions[cat.id]?.length || 0 }}</span>
            </button>
          </div>
          <div class="qa-list">
            <div v-for="(item, i) in questions[activeQACategory]" :key="i" class="qa-item">
              <div class="qa-q" @click="handleQuestionClick(activeQACategory, i)">
                <span class="qa-arrow" :class="{ open: openQuestion === `${activeQACategory}-${i}` }">›</span>
                {{ item.q }}
              </div>
              <div v-if="openQuestion === `${activeQACategory}-${i}`" class="qa-a">{{ item.a }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-box">
        <div class="cta-label">Ваша персональная рекомендация</div>
        <div class="cta-layout">
          <div class="cta-portfolio">
            <h3>Портфель {{ formatCurrency(totalCapital) }}</h3>
            <div v-for="item in chartData" :key="item.name" class="p-item" :class="{ optima: item.name === 'Optima Space' }">
              <div class="p-name">
                <span class="p-dot" :style="{ background: item.color }"></span>
                <span :class="{ 'optima-name': item.name === 'Optima Space' }">{{ item.name }}</span>
              </div>
              <span :class="{ 'optima-amt': item.name === 'Optima Space' }">{{ formatCurrency(item.amount) }}</span>
            </div>
          </div>
          <div class="cta-income">
            <div class="inc-label">Ожидаемый доход за 4,5 года</div>
            <div class="inc-value">{{ portfolioMetrics.totalAllocation > 0 ? formatCurrency(totalCapital * (portfolioMetrics.yield / 100) * 4.5) : '—' }}</div>
            <div v-if="portfolioMetrics.totalAllocation > 0" class="inc-note">при доходности <strong>{{ formatPercent(portfolioMetrics.yield) }}</strong></div>
          </div>
        </div>
        <div class="cta-btns">
          <button class="btn-primary" @click="handleInvest" :disabled="!isOptimaValid || optimaInvestment < OPTIMA_SPACE.minInvestment">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
            Инвестировать в Optima Space
          </button>
          <button class="btn-secondary" @click="generatePDF" :disabled="isGeneratingPDF">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>
            {{ isGeneratingPDF ? 'Генерация...' : 'Скачать PDF-отчёт' }}
          </button>
        </div>
      </section>

      <!-- Partner -->
      <div class="partner-wrap">
        <a href="https://runscale.ru" target="_blank" class="partner-link">
          <span class="radar-dot"></span>
          <span>Технологический партнёр | Модуль Роста®</span>
        </a>
      </div>

      <!-- Footer -->
      <footer class="calc-footer">
        <p>Калькулятор предоставляет ориентировочные расчёты. Инвестиции связаны с рисками.</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════════
   OPTIMA SPACE CALCULATOR v3.0 — FIXED VERSION
   ═══════════════════════════════════════════════════════════════════════════════ */

.optima-wrapper {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: #000;
  min-height: 100vh;
}

.calculator {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 64px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

/* Mobile */
.mobile-warning { display: flex; align-items: center; justify-content: center; min-height: 80vh; padding: 40px 24px; }
.mobile-card { text-align: center; padding: 48px 32px; background: rgba(0,217,192,0.08); border: 1px solid rgba(0,217,192,0.3); border-radius: 20px; max-width: 360px; }
.mobile-icon { font-size: 48px; margin-bottom: 20px; }
.mobile-card h2 { font-size: 22px; font-weight: 600; margin: 0 0 12px; color: #fff; border: none !important; }
.mobile-card p { font-size: 15px; color: #888; line-height: 1.6; margin: 0; }

/* Header */
.header { text-align: center; margin-bottom: 48px; }
.subtitle { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #00D9C0; margin-bottom: 20px; }
.title { font-size: 48px; font-weight: 600; letter-spacing: -0.03em; margin: 0 0 20px !important; line-height: 1.1; border: none !important; padding: 0 !important; color: #fff !important; }
.desc { font-size: 17px; color: #888; margin: 0; max-width: 720px; margin-inline: auto; line-height: 1.6; }
.desc .hl { color: #00D9C0; font-weight: 500; }

/* Tooltip */
.tooltip-trigger { position: relative; display: inline-flex; align-items: center; gap: 4px; }
.tooltip-icon { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; border-radius: 50%; background: #222; color: #666; font-size: 10px; cursor: help; }
.tooltip-box { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; padding: 12px 14px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; font-size: 11px; color: #aaa; line-height: 1.6; width: 280px; z-index: 1000; white-space: pre-line; text-align: left; font-weight: normal; }
.strat-tooltip { width: 220px; }
.auto-tooltip { width: 260px; bottom: auto; top: 100%; margin-top: 8px; margin-bottom: 0; }

/* How Section */
.how-section { background: linear-gradient(135deg, rgba(0,217,192,0.1) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(0,217,192,0.25); border-radius: 20px; padding: 36px 48px; margin-bottom: 48px; }
.badge-center { display: flex; justify-content: center; margin-bottom: 28px; }
.top-badge { background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%); color: #000; font-size: 12px; font-weight: 700; padding: 12px 28px; border-radius: 24px; text-transform: uppercase; letter-spacing: 1px; }
.steps-row { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: start; gap: 24px; }
.step-item { text-align: center; }
.step-icon { margin-bottom: 14px; display: flex; justify-content: center; }
.step-title { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 6px; }
.step-sub { font-size: 12px; color: #666; }
.step-arrow { font-size: 28px; color: #333; padding-top: 16px; }

/* Card Section */
.card-section { background: rgba(255,255,255,0.02); border: 1px solid #1a1a1a; border-radius: 20px; padding: 48px; margin-bottom: 32px; }
.card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 36px; }
.num { background: #00D9C0; color: #000; font-size: 15px; font-weight: 700; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.card-title { font-size: 17px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #fff; }

/* Capital */
.capital-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.capital-label { font-size: 16px; color: #888; }
.capital-value { font-size: 42px; font-weight: 600; color: #fff; }

/* Sliders */
.main-slider, .asset-slider, .int-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}
.main-slider::-webkit-slider-thumb, .asset-slider::-webkit-slider-thumb, .int-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.slider-labels { display: flex; justify-content: space-between; margin-top: 12px; font-size: 13px; color: #555; }

.quick-btns { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
.quick-btns button { padding: 12px 24px; background: transparent; border: 1px solid #333; border-radius: 10px; color: #888; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.quick-btns button:hover { border-color: #555; color: #fff; }
.quick-btns button.active { background: #00D9C0; border-color: #00D9C0; color: #000; font-weight: 600; }

/* Strategies */
.strategies-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
.strategy-card { padding: 28px; background: #0a0a0a; border: 2px solid #1a1a1a; border-radius: 16px; text-align: left; cursor: pointer; transition: all 0.2s; }
.strategy-card:hover { border-color: #333; }
.strategy-card.active { background: rgba(0,217,192,0.1); border-color: #00D9C0; }
.strat-name { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.strategy-card.active .strat-name { color: #00D9C0; }
.strat-desc { font-size: 13px; color: #666; margin-bottom: 16px; }
.strat-target { font-size: 28px; font-weight: 600; color: #00D9C0; }

/* Mode Toggle */
.mode-toggle { display: flex; gap: 12px; margin-bottom: 28px; }
.mode-toggle button { padding: 12px 24px; background: transparent; border: 1px solid #333; border-radius: 10px; color: #666; font-size: 14px; cursor: pointer; }
.mode-toggle button.active { background: #222; color: #fff; border-color: #444; }

/* Allocation Grid */
.alloc-grid { display: grid; grid-template-columns: 1fr 360px; gap: 48px; }
.alloc-list-header { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-bottom: 28px; }
.manual-tag { color: #F5C542; margin-left: 8px; }

.asset-block { margin-bottom: 28px; }
.asset-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.asset-left { display: flex; align-items: center; gap: 12px; }
.asset-dot { width: 14px; height: 14px; border-radius: 4px; }
.asset-name { font-size: 15px; font-weight: 600; color: #fff; }
.asset-tag { font-size: 10px; padding: 4px 12px; border-radius: 6px; font-weight: 600; border: 1px solid; }
.asset-right { display: flex; align-items: center; gap: 20px; }
.asset-amount { font-size: 14px; color: #aaa; }
.asset-pct { font-size: 20px; font-weight: 600; color: #fff; min-width: 50px; text-align: right; }
.asset-desc { font-size: 12px; color: #666; margin-bottom: 12px; margin-left: 26px; }
.asset-desc.error-text { color: #E8192C; }
.asset-meta { display: flex; justify-content: space-between; font-size: 11px; color: #555; margin-top: 8px; }

/* Total Row */
.total-row { padding: 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center; margin-top: 28px; }
.total-row.success { background: rgba(0,217,192,0.1); border: 1px solid rgba(0,217,192,0.3); }
.total-row.warning { background: rgba(245,197,66,0.1); border: 1px solid rgba(245,197,66,0.3); }
.total-row.error { background: rgba(232,25,44,0.1); border: 1px solid rgba(232,25,44,0.3); }
.total-row span:first-child { font-size: 15px; color: #888; }
.total-pct { font-size: 32px; font-weight: 600; }
.total-row.success .total-pct { color: #00D9C0; }
.total-row.warning .total-pct { color: #F5C542; }
.total-row.error .total-pct { color: #E8192C; }

/* Auto Block */
.auto-block { margin-top: 16px; }
.auto-hint { font-size: 13px; color: #F5C542; margin-bottom: 12px; }
.auto-hint.error { color: #E8192C; }
.auto-btn { width: 100%; padding: 16px 24px; background: rgba(0,217,192,0.1); border: 1px solid rgba(0,217,192,0.3); border-radius: 12px; color: #00D9C0; font-size: 15px; font-weight: 500; cursor: pointer; position: relative; }
.auto-btn:hover { background: rgba(0,217,192,0.2); }

/* Chart Column */
.chart-col { display: flex; flex-direction: column; align-items: center; }
.pie-wrapper { position: relative; margin-bottom: 32px; }
.pie-chart { width: 220px; height: 220px; border-radius: 50%; position: relative; }
.pie-hole { position: absolute; width: 130px; height: 130px; background: #0a0a0a; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.pie-tooltip { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; }

.metrics-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; }
.metric-box { background: #0a0a0a; border-radius: 14px; padding: 24px; text-align: center; }
.m-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
.m-value { font-size: 32px; font-weight: 600; color: #fff; }
.m-value.hl { color: #00D9C0; }
.m-value.warn { color: #F5C542; }

.goal-box { margin-top: 20px; padding: 16px; background: rgba(245,197,66,0.1); border: 1px solid rgba(245,197,66,0.3); border-radius: 12px; text-align: center; font-size: 14px; font-weight: 600; color: #F5C542; width: 100%; }
.goal-box.success { background: rgba(0,217,192,0.1); border-color: rgba(0,217,192,0.3); color: #00D9C0; }

/* Optima Metrics */
.optima-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }
.o-metric { background: #0a0a0a; border: 1px solid #111; border-radius: 14px; padding: 28px; text-align: center; }
.o-metric.hl-bg { background: rgba(0,217,192,0.1); border-color: rgba(0,217,192,0.2); }
.o-label { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 10px; }
.o-value { font-size: 36px; font-weight: 600; color: #fff; }
.o-value.hl { color: #00D9C0; }
.o-sub { font-size: 13px; color: #666; margin-top: 6px; }

/* Guarantee Box */
.guarantee-box { background: #0a0a0a; border-radius: 20px; padding: 36px; border: 1px solid #111; }
.g-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; font-size: 20px; font-weight: 600; color: #fff; }

/* Timeline */
.timeline-wrap { margin-bottom: 36px; padding: 24px; background: #111; border-radius: 14px; }
.timeline-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #555; margin-bottom: 20px; }
.timeline { display: flex; align-items: flex-start; justify-content: space-between; position: relative; }
.tl-line { position: absolute; top: 14px; left: 28px; right: 28px; height: 2px; background: #333; }
.tl-progress { position: absolute; top: 14px; left: 28px; width: calc(25% - 14px); height: 2px; background: #00D9C0; }
.tl-step { display: flex; flex-direction: column; align-items: center; z-index: 1; }
.tl-dot { width: 28px; height: 28px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; }
.tl-dot.done { background: #00D9C0; color: #000; }
.tl-dot.current { border: 2px solid #00D9C0; }
.tl-label { margin-top: 12px; font-size: 13px; font-weight: 500; color: #888; }
.tl-label.done { color: #00D9C0; }
.tl-sub { font-size: 11px; color: #555; }

/* Scenarios */
.scenarios-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #555; margin-bottom: 16px; }
.scenarios-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
.scenario-box { padding: 24px; background: #111; border: 1px solid #222; border-radius: 14px; text-align: center; }
.scenario-box.base { background: rgba(0,217,192,0.1); border-color: rgba(0,217,192,0.3); }
.scenario-box.worst { border-color: rgba(232,25,44,0.3); }
.sc-dot { width: 16px; height: 16px; border-radius: 50%; margin: 0 auto 12px; }
.sc-label { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #fff; }
.sc-occ { font-size: 12px; color: #666; margin-bottom: 16px; }
.sc-divs, .sc-buyback { font-size: 12px; color: #888; }
.sc-divs span, .sc-buyback span { color: #00D9C0; }
.sc-total { margin-top: 12px; padding-top: 12px; border-top: 1px solid #222; font-size: 18px; font-weight: 600; color: #00D9C0; }
.scenario-box.worst .sc-total { color: #E8192C; }
.sc-roi { font-size: 11px; color: #555; margin-top: 4px; }
.g-note { margin-top: 16px; padding: 16px; background: rgba(0,217,192,0.08); border: 1px solid rgba(0,217,192,0.2); border-radius: 12px; font-size: 14px; color: #00D9C0; text-align: center; }

/* Interactive Box */
.interactive-box { margin: 36px 0; padding: 28px; background: linear-gradient(135deg, rgba(0,217,192,0.15) 0%, rgba(0,217,192,0.05) 100%); border: 2px solid #00D9C0; border-radius: 20px; }
.int-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; font-size: 20px; font-weight: 600; color: #fff; }
.int-header strong { color: #00D9C0; }
.int-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #888; }
.int-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 24px; }
.int-m { text-align: center; }
.int-m-label { font-size: 11px; color: #aaa; }
.int-m-value { font-size: 24px; font-weight: 600; color: #fff; }
.int-m-value.hl { color: #00D9C0; }

/* Formula Box */
.formula-box { margin: 36px 0; padding: 24px; background: rgba(0,217,192,0.05); border: 1px solid rgba(0,217,192,0.2); border-radius: 14px; }
.f-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; font-size: 15px; font-weight: 600; color: #00D9C0; }
.f-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; }
.f-col { font-family: monospace; font-size: 14px; line-height: 2.2; color: #fff; }
.f-col.bordered { border-left: 1px solid rgba(0,217,192,0.2); padding-left: 36px; }
.f-col .dim { color: #aaa; }
.f-col .hl { color: #00D9C0; }
.f-total { padding-top: 12px; border-top: 1px solid rgba(0,217,192,0.2); margin-top: 12px; }
.f-total .big { font-size: 20px; font-weight: 700; }

/* Collateral Box */
.collateral-box { padding: 24px; background: rgba(0,217,192,0.05); border: 1px solid rgba(0,217,192,0.2); border-radius: 14px; }
.c-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; font-size: 15px; font-weight: 600; color: #00D9C0; }
.c-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; text-align: center; }
.c-label { font-size: 11px; color: #aaa; }
.c-value { font-size: 24px; font-weight: 600; color: #fff; }
.c-value.hl { color: #00D9C0; }

/* Warning Box */
.warning-box { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; padding: 32px; background: rgba(232,25,44,0.1); border: 1px solid rgba(232,25,44,0.3); border-radius: 20px; }
.w-title { font-size: 16px; font-weight: 600; color: #E8192C; }
.w-desc { font-size: 14px; color: #888; margin-top: 6px; }

/* Table */
.table-wrap { overflow-x: auto; }
.table-wrap table { width: 100%; border-collapse: collapse; font-size: 15px; }
.table-wrap th { text-align: left; padding: 18px; border-bottom: 1px solid #222; color: #666; font-size: 11px; text-transform: uppercase; }
.table-wrap th:last-child { text-align: right; }
.table-wrap td { padding: 20px 18px; border-bottom: 1px solid #111; color: #fff; }
.table-wrap td:last-child { text-align: right; }
.table-wrap .hl-row { background: rgba(0,217,192,0.05); }
.table-wrap .hl { color: #00D9C0; }
.table-wrap .dim { color: #555; }
.table-note { margin-top: 16px; font-size: 12px; color: #555; }

/* Q&A */
.qa-layout { display: grid; grid-template-columns: 240px 1fr; gap: 36px; }
.qa-cats { display: flex; flex-direction: column; gap: 8px; }
.qa-cats button { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: transparent; border: none; border-left: 3px solid transparent; border-radius: 0 12px 12px 0; cursor: pointer; text-align: left; transition: all 0.2s; }
.qa-cats button:hover { background: rgba(255,255,255,0.02); }
.qa-cats button.active { background: rgba(0,217,192,0.1); border-left-color: #00D9C0; }
.cat-icon { font-size: 18px; }
.cat-name { font-size: 15px; color: #888; }
.qa-cats button.active .cat-name { color: #00D9C0; font-weight: 600; }
.cat-count { margin-left: auto; font-size: 12px; color: #555; }
.qa-list { max-height: 450px; overflow-y: auto; padding-right: 12px; }
.qa-item { margin-bottom: 16px; border-bottom: 1px solid #111; padding-bottom: 16px; }
.qa-q { display: flex; align-items: center; gap: 14px; font-size: 16px; font-weight: 500; padding: 14px 0; cursor: pointer; color: #fff; transition: color 0.2s; }
.qa-q:hover { color: #00D9C0; }
.qa-arrow { color: #00D9C0; font-size: 20px; font-weight: 600; transition: transform 0.2s; }
.qa-arrow.open { transform: rotate(90deg); }
.qa-a { font-size: 15px; color: #888; line-height: 1.7; margin: 12px 0 0; padding-left: 34px; }

/* CTA */
.cta-box { background: linear-gradient(135deg, rgba(0,217,192,0.1) 0%, rgba(0,0,0,0) 100%); border: 1px solid rgba(0,217,192,0.3); border-radius: 24px; padding: 48px; }
.cta-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #00D9C0; margin-bottom: 28px; }
.cta-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 40px; }
.cta-portfolio h3 { font-size: 28px; font-weight: 600; margin: 0 0 28px !important; border: none !important; padding: 0 !important; color: #fff !important; }
.p-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #111; }
.p-item.optima { background: rgba(0,217,192,0.05); border-radius: 12px; padding: 14px 18px; margin: -14px -18px; border-bottom: none; margin-bottom: 8px; animation: optima-glow 2s ease-in-out infinite; }
@keyframes optima-glow { 0%, 100% { box-shadow: 0 0 0 1px rgba(0,217,192,0.3), 0 0 12px rgba(0,217,192,0.1); } 50% { box-shadow: 0 0 0 1px rgba(0,217,192,0.6), 0 0 24px rgba(0,217,192,0.2); } }
.p-name { display: flex; align-items: center; gap: 14px; }
.p-dot { width: 14px; height: 14px; border-radius: 4px; }
.p-name span:not(.p-dot) { font-size: 15px; color: #888; }
.p-name .optima-name { color: #00D9C0; font-weight: 600; }
.p-item span:last-child { font-size: 16px; font-weight: 500; color: #888; }
.p-item .optima-amt { color: #fff; }

.cta-income { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: #0a0a0a; border-radius: 20px; padding: 48px; }
.inc-label { font-size: 14px; color: #888; margin-bottom: 12px; }
.inc-value { font-size: 56px; font-weight: 600; color: #00D9C0; }
.inc-note { font-size: 15px; color: #666; margin-top: 16px; }
.inc-note strong { color: #fff; }

.cta-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.btn-primary, .btn-secondary { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 24px 40px; border-radius: 14px; font-size: 17px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.btn-primary { background: linear-gradient(135deg, #00D9C0 0%, #00a67d 100%); border: none; color: #000; }
.btn-primary:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,217,192,0.4); filter: brightness(1.1); }
.btn-primary:disabled { background: #333; color: #666; cursor: not-allowed; }
.btn-secondary { background: transparent; border: 2px solid #00D9C0; color: #00D9C0; }
.btn-secondary:hover:not(:disabled) { background: rgba(0,217,192,0.1); transform: translateY(-3px); }
.btn-secondary:disabled { border-color: #333; color: #555; cursor: not-allowed; }

/* Partner */
.partner-wrap { display: flex; justify-content: center; margin-top: 64px; margin-bottom: 36px; }
.partner-link { display: inline-flex; align-items: center; gap: 16px; padding: 16px 32px; border: 1px solid #00D9C0; border-radius: 12px; text-decoration: none; animation: radar-glow 3s ease-in-out infinite; }
@keyframes radar-glow { 0%, 100% { box-shadow: 0 0 12px rgba(0,217,192,0.3), 0 0 24px rgba(0,217,192,0.1); } 50% { box-shadow: 0 0 24px rgba(0,217,192,0.6), 0 0 48px rgba(0,217,192,0.3); } }
.radar-dot { width: 10px; height: 10px; background: #00D9C0; border-radius: 50%; animation: radar-dot-pulse 3s ease-in-out infinite; }
@keyframes radar-dot-pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 14px #00D9C0; } 50% { opacity: 0.4; } }
.partner-link span:last-child { font-family: monospace; font-size: 12px; color: #00D9C0; text-transform: uppercase; letter-spacing: 1px; }

/* Footer */
.calc-footer { text-align: center; padding-top: 32px; border-top: 1px solid #111; font-size: 13px; color: #666; }
.calc-footer p { margin: 0; }

/* Responsive */
@media (max-width: 1200px) {
  .calculator { padding: 40px 32px; }
  .alloc-grid { grid-template-columns: 1fr; }
  .chart-col { order: -1; margin-bottom: 36px; }
  .optima-metrics { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .steps-row { grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .step-arrow { display: none; }
  .scenarios-row { grid-template-columns: 1fr; }
  .int-metrics { grid-template-columns: repeat(2, 1fr); }
  .f-grid { grid-template-columns: 1fr; }
  .f-col.bordered { border-left: none; border-top: 1px solid rgba(0,217,192,0.2); padding-left: 0; padding-top: 20px; }
  .qa-layout { grid-template-columns: 1fr; }
  .qa-cats { flex-direction: row; flex-wrap: wrap; gap: 12px; }
  .qa-cats button { border-left: none; border-bottom: 2px solid transparent; border-radius: 12px; padding: 12px 16px; }
  .qa-cats button.active { border-bottom-color: #00D9C0; }
  .cta-layout { grid-template-columns: 1fr; }
  .cta-btns { grid-template-columns: 1fr; }
  .strategies-row { grid-template-columns: 1fr; }
}
</style>
