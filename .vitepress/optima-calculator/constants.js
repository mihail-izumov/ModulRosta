// constants.js
// Все константы для калькулятора Optima Space

export const COLORS = {
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

export const TOOLTIPS = {
  targetYield: 'Цель 20%+ годовых — ориентир для сбалансированного портфеля коммерческой недвижимости. Optima Space позволяет достичь этой цели за счёт доходности 38% с гарантией обратного выкупа.',
  diversification: 'Диверсификация — распределение капитала между разными активами для снижения риска. Правило: не более 15-20% в один актив.',
  autoDistribute: 'Авто-распределение автоматически распределит средства по выбранной стратегии до 100%.',
}

export const OPTIMA_SPACE = {
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
  timeline: [
    { date: 'Окт 2025', event: 'I раунд инвестиций' },
    { date: 'Дек 2025', event: 'II раунд инвестиций' },
    { date: 'Янв 2026', event: 'Сдача здания' },
    { date: 'Май 2026', event: 'Открытие Optima Space' },
    { date: 'Окт 2028', event: 'Окупаемость (29 мес)' },
    { date: 'Май 2030', event: 'Опцион на выкуп (55 мес)' },
  ],
  risks: [
    { risk: 'Превышение сметы', solution: 'Аукционы, проверенные поставщики' },
    { risk: 'Низкая заполняемость', solution: 'Pipeline 700+ мест, сдача без сервиса' },
    { risk: 'Рост арендной ставки', solution: 'Фиксация в договоре на 5 лет' },
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

export const ASSET_CLASSES = [
  { id: 'optima', name: 'Optima Space', minYield: 31, maxYield: 38, risk: 4, color: COLORS.primary, tag: 'РЕКОМЕНДУЕМ', tagColor: COLORS.primary, description: 'Сервисные офисы с обратным выкупом', tooltip: 'Долевые инвестиции в сервисный офис. Минимум 600 000₽. Обратный выкуп через 4,5 года.' },
  { id: 'warehouse', name: 'Складская логистика', minYield: 11, maxYield: 13, risk: 3, color: '#3B82F6', tag: 'СТАБИЛЬНО', tagColor: '#3B82F6', description: 'ЗПИФ, дефицит 1.5%', tooltip: 'Инвестиции в склады через ЗПИФ.' },
  { id: 'streetretail', name: 'Street-retail', minYield: 9, maxYield: 16, risk: 3, color: '#06B6D4', tag: 'ЛИКВИДНО', tagColor: '#06B6D4', description: 'Первые этажи, вакансия 4-5%', tooltip: 'Торговые помещения.' },
  { id: 'bonds', name: 'Облигации', minYield: 10, maxYield: 13, risk: 2, color: '#8B5CF6', tag: 'УМЕРЕННО', tagColor: '#8B5CF6', description: 'Корпоративные и ОФЗ', tooltip: 'Долговые ценные бумаги.' },
  { id: 'dividends', name: 'Дивидендные акции', minYield: 12, maxYield: 15, risk: 5, color: '#FF7A45', tag: 'ДОХОДНО', tagColor: '#FF7A45', description: 'Голубые фишки', tooltip: 'Акции с дивидендами.' },
  { id: 'deposits', name: 'Резерв (депозиты)', minYield: 18, maxYield: 20, risk: 1, color: '#10B981', tag: 'ЗАЩИТА', tagColor: '#10B981', description: 'АСВ до 1.4 млн', tooltip: 'Банковские вклады.' },
]

export const STRATEGIES = {
  conservative: { 
    name: 'Консервативная', 
    target: '14-16%', 
    description: 'Минимальный риск', 
    allocations: { optima: 10, warehouse: 25, streetretail: 15, bonds: 20, dividends: 15, deposits: 15 }, 
    tooltip: 'Приоритет — сохранение капитала.\n\n✓ Горизонт инвестирования 3-5 лет\n✓ Не готовы к просадке более 10%\n✓ Важнее стабильность, чем макс. доход' 
  },
  balanced: { 
    name: 'Сбалансированная', 
    target: '18-22%', 
    description: 'Баланс риска и доходности', 
    allocations: { optima: 20, warehouse: 25, streetretail: 15, bonds: 15, dividends: 15, deposits: 10 }, 
    tooltip: 'Оптимальное соотношение риск/доход.\n\n✓ Горизонт инвестирования 5-10 лет\n✓ Готовы к временным просадкам 15-20%\n✓ Хотите доход выше депозитов' 
  },
  growth: { 
    name: 'Рост капитала', 
    target: '22-28%', 
    description: 'Максимальная доходность', 
    allocations: { optima: 30, warehouse: 20, streetretail: 20, bonds: 10, dividends: 15, deposits: 5 }, 
    tooltip: 'Агрессивный рост капитала.\n\n✓ Горизонт инвестирования 10+ лет\n✓ Готовы к волатильности 25-30%\n✓ Есть другие источники дохода' 
  }
}

export const QA_CATEGORIES = [
  { id: 'financial', name: 'Финансы', icon: 'Wallet' },
  { id: 'legal', name: 'Юридическое', icon: 'ScrollText' },
  { id: 'operational', name: 'Операционное', icon: 'Cog' },
  { id: 'risks', name: 'Риски', icon: 'TriangleAlert' },
  { id: 'exit', name: 'Выход', icon: 'SquareArrowRight' },
]
