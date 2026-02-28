// usePortfolio.js
import { ref, computed } from 'vue'
import { ASSET_CLASSES, STRATEGIES, OPTIMA_SPACE, ADVISOR_COMMENTS, COVERAGE_COMMENTS } from './constants.js'
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
    let assetCount = 0
    
    ASSET_CLASSES.forEach(asset => {
      const alloc = toNumber(allocations.value[asset.id])
      totalAllocation += alloc
      if (alloc > 0) {
        assetCount++
        totalYield += ((asset.minYield + asset.maxYield) / 2) * (alloc / 100)
        totalRisk += asset.risk * (alloc / 100)
      }
    })
    
    // Дополнительный риск концентрации (если всё в одном активе)
    let concentrationRisk = 0
    const optimaAlloc = toNumber(allocations.value.optima)
    
    // Если весь портфель в одном активе - добавляем риск концентрации
    if (assetCount === 1 && totalAllocation > 0) {
      // Для Optima Space риск концентрации ниже из-за залога и гарантий
      if (optimaAlloc === 100) {
        concentrationRisk = 2 // Добавляем 2 балла риска за концентрацию (итого 6/10)
      } else {
        concentrationRisk = 3 // Для других активов выше
      }
    } else if (assetCount === 2 && totalAllocation > 0) {
      concentrationRisk = 1 // Небольшой риск при 2 активах
    }
    
    // Максимальный риск 10
    const finalRisk = Math.min(10, totalRisk + concentrationRisk)
    
    return { 
      yield: totalYield, 
      risk: finalRisk, 
      baseRisk: totalRisk, // Базовый риск без концентрации
      concentrationRisk,
      totalAllocation: Math.round(totalAllocation),
      assetCount
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

  // Комментарий консультанта
  const advisorComment = computed(() => {
    const metrics = portfolioMetrics.value
    const alloc = allocations.value
    
    // Проверяем все сценарии по порядку приоритета
    const scenarios = [
      'error_over_distributed',
      'error_empty',
      'optima_only_full',
      'optima_only_high',
      'error_not_distributed',
      'excellent_balanced',
      'excellent_with_optima',
      'good_diversified',
      'good_conservative',
      'warning_high_risk',
      'warning_no_reserve',
      'warning_low_optima',
      'warning_below_goal',
      'too_much_deposits',
      'only_deposits',
      'good_with_bonds',
      'default'
    ]
    
    for (const scenarioKey of scenarios) {
      const scenario = ADVISOR_COMMENTS[scenarioKey]
      if (scenario && scenario.condition(metrics, alloc)) {
        return {
          text: scenario.text,
          type: scenario.type
        }
      }
    }
    
    return ADVISOR_COMMENTS.default
  })

  // Оценка покрытия залогом
  const collateralCoverage = computed(() => {
    if (optimaInvestment.value === 0) return { ratio: 0, text: '', type: 'neutral' }
    
    const ratio = OPTIMA_SPACE.collateralValue / optimaInvestment.value
    
    if (ratio >= COVERAGE_COMMENTS.excellent.min) {
      return { ratio, text: COVERAGE_COMMENTS.excellent.text, type: 'excellent' }
    } else if (ratio >= COVERAGE_COMMENTS.good.min) {
      return { ratio, text: COVERAGE_COMMENTS.good.text, type: 'good' }
    } else if (ratio >= COVERAGE_COMMENTS.normal.min) {
      return { ratio, text: COVERAGE_COMMENTS.normal.text, type: 'normal' }
    } else {
      return { ratio, text: COVERAGE_COMMENTS.minimum.text, type: 'minimum' }
    }
  })

  // Расчёт дохода от Optima Space
  const optimaIncome = computed(() => {
    return optimaInvestment.value * (OPTIMA_SPACE.rounds[0].roi / 100) * 4.5
  })

  // Общий доход за 4.5 года
  const totalIncome = computed(() => {
    if (portfolioMetrics.value.totalAllocation === 0) return 0
    return totalCapital.value * (portfolioMetrics.value.yield / 100) * 4.5
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
    advisorComment,
    collateralCoverage,
    optimaIncome,
    totalIncome,
    // Methods
    updateAllocation,
    loadStrategy,
    autoDistribute,
  }
}
