// usePortfolio.js
import { ref, computed, watch } from 'vue'
import { ASSET_CLASSES, STRATEGIES, ADVISOR_COMMENTS } from './constants.js'

export function usePortfolio(totalCapital) {
  const allocations = ref({
    optima: 0,
    warehouse: 0,
    streetretail: 0,
    bonds: 0,
    dividends: 0,
    deposits: 0
  })

  const selectedStrategy = ref(null)

  const totalAllocation = computed(() => {
    return Object.values(allocations.value).reduce((sum, val) => sum + val, 0)
  })

  const portfolioMetrics = computed(() => {
    let weightedYield = 0
    let weightedRisk = 0
    let totalWeight = 0
    let nonZeroAssets = 0
    let maxAllocation = 0
    let maxAssetId = null

    for (const asset of ASSET_CLASSES) {
      const alloc = allocations.value[asset.id] || 0
      if (alloc > 0) {
        const weight = alloc / 100
        const avgYield = (asset.minYield + asset.maxYield) / 2
        weightedYield += avgYield * weight
        weightedRisk += asset.risk * weight
        totalWeight += weight
        nonZeroAssets++
        
        if (alloc > maxAllocation) {
          maxAllocation = alloc
          maxAssetId = asset.id
        }
      }
    }

    // Корректировка риска за концентрацию
    let concentrationPenalty = 0
    if (maxAllocation === 100) {
      // 100% в одном активе
      if (maxAssetId === 'optima') {
        concentrationPenalty = 2 // Optima имеет гарантии
      } else {
        concentrationPenalty = 3 // Другие активы — выше риск
      }
    } else if (nonZeroAssets <= 2 && totalAllocation === 100) {
      concentrationPenalty = 1
    }

    const finalRisk = Math.min(10, weightedRisk + concentrationPenalty)

    return {
      yield: weightedYield,
      risk: finalRisk,
      totalAllocation: totalAllocation.value,
      nonZeroAssets,
      concentrationPenalty
    }
  })

  const advisorComment = computed(() => {
    const m = portfolioMetrics.value
    const a = allocations.value

    // Проверяем условия в порядке приоритета
    const scenarios = [
      'error_over_distributed',
      'error_empty',
      'optima_only_full',
      'optima_only_high',
      'excellent_balanced',
      'excellent_with_optima',
      'good_diversified',
      'good_conservative',
      'warning_high_risk',
      'warning_no_reserve',
      'warning_low_optima',
      'warning_below_goal',
      'error_not_distributed',
      'default'
    ]

    for (const key of scenarios) {
      const comment = ADVISOR_COMMENTS[key]
      if (comment && comment.condition(m, a)) {
        return { key, ...comment }
      }
    }

    return ADVISOR_COMMENTS.default
  })

  const chartData = computed(() => {
    return ASSET_CLASSES
      .filter(asset => allocations.value[asset.id] > 0)
      .map(asset => ({
        name: asset.name,
        value: allocations.value[asset.id],
        amount: (totalCapital.value * allocations.value[asset.id]) / 100,
        color: asset.color
      }))
  })

  const applyStrategy = (strategyKey) => {
    selectedStrategy.value = strategyKey
    const strategy = STRATEGIES[strategyKey]
    if (strategy) {
      Object.keys(allocations.value).forEach(key => {
        allocations.value[key] = strategy.allocations[key] || 0
      })
    }
  }

  const autoDistribute = () => {
    const currentTotal = totalAllocation.value
    
    // Если уже 100% - ничего не делаем
    if (currentTotal === 100) return
    
    // Если больше 100% - пропорционально уменьшаем
    if (currentTotal > 100) {
      const ratio = 100 / currentTotal
      Object.keys(allocations.value).forEach(key => {
        allocations.value[key] = Math.round(allocations.value[key] * ratio)
      })
      
      // Корректировка округления
      let total = Object.values(allocations.value).reduce((a, b) => a + b, 0)
      if (total !== 100) {
        const diff = 100 - total
        const maxKey = Object.keys(allocations.value).reduce((a, b) => 
          allocations.value[a] > allocations.value[b] ? a : b
        )
        allocations.value[maxKey] += diff
      }
      return
    }
    
    // Если меньше 100% - добавляем
    const remaining = 100 - currentTotal

    // Если есть выбранная стратегия, используем её пропорции
    if (selectedStrategy.value && STRATEGIES[selectedStrategy.value]) {
      const strategy = STRATEGIES[selectedStrategy.value]
      const targetAllocations = strategy.allocations
      
      // Находим активы, которые можно увеличить
      const adjustable = Object.keys(targetAllocations).filter(key => {
        return allocations.value[key] < targetAllocations[key]
      })

      if (adjustable.length > 0) {
        const perAsset = remaining / adjustable.length
        adjustable.forEach(key => {
          const maxAdd = targetAllocations[key] - allocations.value[key]
          allocations.value[key] += Math.min(perAsset, maxAdd)
        })
      }
    } else {
      // Распределяем равномерно между всеми
      const perAsset = remaining / 6
      Object.keys(allocations.value).forEach(key => {
        allocations.value[key] += perAsset
      })
    }

    // Округляем и корректируем до 100%
    let total = 0
    Object.keys(allocations.value).forEach(key => {
      allocations.value[key] = Math.round(allocations.value[key])
      total += allocations.value[key]
    })

    // Корректировка
    if (total !== 100) {
      const diff = 100 - total
      const firstNonZero = Object.keys(allocations.value).find(k => allocations.value[k] > 0)
      if (firstNonZero) {
        allocations.value[firstNonZero] += diff
      }
    }
  }

  const setAllocation = (assetId, value) => {
    allocations.value[assetId] = Math.max(0, Math.min(100, value))
  }

  const resetAllocations = () => {
    Object.keys(allocations.value).forEach(key => {
      allocations.value[key] = 0
    })
    selectedStrategy.value = null
  }

  return {
    allocations,
    selectedStrategy,
    totalAllocation,
    portfolioMetrics,
    advisorComment,
    chartData,
    applyStrategy,
    autoDistribute,
    setAllocation,
    resetAllocations
  }
}
