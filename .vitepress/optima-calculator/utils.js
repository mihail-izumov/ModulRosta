// utils.js
// Утилиты форматирования для калькулятора

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)} млн ₽`
  if (num >= 1000) return `${Math.round(num / 1000)} тыс ₽`
  return `${Math.round(num)} ₽`
}

export const formatPercent = (value) => `${Number(value).toFixed(1)}%`

export const formatNumber = (value) => {
  return Number(value).toLocaleString('ru-RU')
}

// Безопасное преобразование к числу
export const toNumber = (value) => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}
