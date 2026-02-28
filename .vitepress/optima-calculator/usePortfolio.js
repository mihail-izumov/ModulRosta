// usePortfolio.js
import { ref, computed } from 'vue'
import { ASSET_CLASSES, STRATEGIES, OPTIMA_SPACE } from './constants.js'
import { toNumber } from './utils.js'

export function usePortfolio() {
  // State
  const totalCapital = ref(10000000)
  const allocations = ref({
    optima: 20,
    warehouse: 25,
    streetretail: 15,
    bonds: 15,
    dividends: 15,
    deposits: 10,
  })
  const activeStrategy = ref('balanced')
  const inputMode = ref('percent')

  // Computed
  const portfolioMetrics = computed(() => {
    let totalYield = 0
    let totalRisk = 0
    let totalAllocation = 0
    
    ASSET_CLASSES.forEach(asset => {
      const alloc = toNumber(allocations.value[asset.id])
      totalAllocation += alloc
      totalYield += ((asset.minYield + asset.maxYield) / 2) * (alloc / 100)
      totalRisk += asset.risk * (alloc / 100)
    })
    
    return { 
      yield: totalYield, 
      risk: totalRisk, 
      totalAllocation: Math.round(totalAllocation)
    }
  })

  const optimaInvestment = computed(() => {
    const alloc = toNumber(allocations.value.optima)
    return Math.round(toNumber(totalCapital.value) * (alloc / 100))
  })

  const optimaShares = computed(() => {
    return Math.floor(optimaInvestment.value / OPTIMA_SPACE.shareNominal)
  })

  const isOptimaValid = computed(() => {
    return optimaInvestment.value === 0 || optimaInvestment.value >= OPTIMA_SPACE.minInvestment
  })

  const chartData = computed(() => {
    return ASSET_CLASSES
      .filter(a => toNumber(allocations.value[a.id]) > 0)
      .map(a => ({
        name: a.name,
        value: toNumber(allocations.value[a.id]),
        color: a.color,
        amount: Math.round(toNumber(totalCapital.value) * toNumber(allocations.value[a.id]) / 100)
      }))
  })

  const goalStatus = computed(() => {
    if (portfolioMetrics.value.totalAllocation === 0) {
      return { text: 'Распределите капитал', color: '#888', isSuccess: false }
    }
    if (portfolioMetrics.value.yield >= 20) {
      return { text: '✓ Цель 20%+ достигнута', color: '#00D9C0', isSuccess: true }
    }
    return { text: '↑ Добавьте доходные активы', color: '#F5C542', isSuccess: false }
  })

  // Methods
  const updateAllocation = (assetId, value) => {
    allocations.value[assetId] = toNumber(value)
    activeStrategy.value = null
  }

  const loadStrategy = (key) => {
    const strategyAllocations = STRATEGIES[key].allocations
    allocations.value = {
      optima: toNumber(strategyAllocations.optima),
      warehouse: toNumber(strategyAllocations.warehouse),
      streetretail: toNumber(strategyAllocations.streetretail),
      bonds: toNumber(strategyAllocations.bonds),
      dividends: toNumber(strategyAllocations.dividends),
      deposits: toNumber(strategyAllocations.deposits),
    }
    activeStrategy.value = key
    inputMode.value = 'percent'
  }

  const autoDistribute = () => {
    const currentTotal = portfolioMetrics.value.totalAllocation
    if (currentTotal === 100) return
    
    const strategy = activeStrategy.value ? STRATEGIES[activeStrategy.value].allocations : STRATEGIES.balanced.allocations
    const strategyTotal = Object.values(strategy).reduce((a, b) => toNumber(a) + toNumber(b), 0)
    const newAllocations = {}
    
    if (currentTotal > 100) {
      const ratio = 100 / currentTotal
      Object.keys(allocations.value).forEach(assetId => {
        newAllocations[assetId] = Math.round(toNumber(allocations.value[assetId]) * ratio)
      })
    } else {
      const remaining = 100 - currentTotal
      Object.keys(strategy).forEach(assetId => {
        const toAdd = Math.round(remaining * (toNumber(strategy[assetId]) / strategyTotal))
        newAllocations[assetId] = (toNumber(allocations.value[assetId]) || 0) + toAdd
      })
    }
    
    const newTotal = Object.values(newAllocations).reduce((a, b) => toNumber(a) + toNumber(b), 0)
    if (newTotal !== 100) {
      newAllocations.deposits = (toNumber(newAllocations.deposits) || 0) + (100 - newTotal)
    }
    
    allocations.value = newAllocations
    inputMode.value = 'percent'
  }

  return {
    // State
    totalCapital,
    allocations,
    activeStrategy,
    inputMode,
    // Computed
    portfolioMetrics,
    optimaInvestment,
    optimaShares,
    isOptimaValid,
    chartData,
    goalStatus,
    // Methods
    updateAllocation,
    loadStrategy,
    autoDistribute,
  }
}
