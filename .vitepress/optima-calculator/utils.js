// utils.js

export const formatCurrency = (value) => {
  const num = toNumber(value)
  if (num >= 1000000) {
    const millions = num / 1000000
    return millions % 1 === 0 
      ? `${millions.toFixed(0)} млн ₽` 
      : `${millions.toFixed(1)} млн ₽`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)} тыс ₽`
  }
  return `${num.toLocaleString('ru-RU')} ₽`
}

export const formatPercent = (value) => {
  const num = toNumber(value)
  return num % 1 === 0 ? `${num}%` : `${num.toFixed(1)}%`
}

export const toNumber = (value) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''))
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export const formatNumberWithSpaces = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const parseFormattedNumber = (str) => {
  return parseInt(str.replace(/\s/g, ''), 10)
}

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}
