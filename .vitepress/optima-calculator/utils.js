// utils.js
// Вспомогательные функции

export const formatCurrency = (value) => {
  if (value >= 1000000) {
    const millions = value / 1000000
    if (millions === Math.floor(millions)) {
      return `${millions.toFixed(0)} млн ₽`
    }
    return `${millions.toFixed(1)} млн ₽`
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)} тыс ₽`
  }
  return `${value.toLocaleString('ru-RU')} ₽`
}

export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`
}

export const toNumber = (value) => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

export const formatNumberWithSpaces = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const parseFormattedNumber = (str) => {
  return parseInt(str.replace(/\s/g, ''), 10)
}
