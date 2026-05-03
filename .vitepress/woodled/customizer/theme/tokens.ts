/**
 * tokens.ts — Дизайн-токены WOODLED ROTOR
 *
 * Источник: woodled-v42.jsx (объект T, WCOL).
 * Тёмная тема в тёплых тонах.
 */

export const T = {
  // Фоны
  bg: '#13110E',
  card: '#1E1B16',
  cardAlt: '#1A1714',
  border: '#2E2921',

  // Текст
  text: '#E8E0D4',
  textSec: '#8B8075',
  textDim: '#5C544A',

  // Состояния
  green: '#7BA05B',
  yellow: '#C9A84C',
  red: '#B85C4C',
  neutral: '#A89878',

  // Зарезервирован (не используется в v42)
  blue: '#5B8BA0',

  // Дерево
  oak: '#C4A46C',
  walnut: '#8B6242',
  black: '#5A4E42',

  // Настроения
  dawn: '#D4956B',
  noon: '#C9B86C',
  clearing: '#8BAA6B',
} as const

export type TokenKey = keyof typeof T

/**
 * WCOL — карта дерева на токены.
 * Используется как: WCOL[wood] + "22" для фонов плашек иконок.
 */
export const WCOL = {
  oak: T.oak,
  walnut: T.walnut,
  black: T.black,
} as const

export type Wood = keyof typeof WCOL

/**
 * Стандартные hex-суффиксы прозрачности.
 * Пример: T.neutral + OPACITY.md → '#A8987822'
 */
export const OPACITY = {
  xxxs: '06', // ~2%  glow обёртка
  xxs: '08', // ~3%  выбранная карточка BuyModal
  xs: '11', // ~7%  фон секций
  sm: '15', // ~8%  плашка иконки в зоне
  md: '22', // ~13% плашка иконки, чипы активные
  lg: '33', // ~20% рамка BuyModal
  xl: '44', // ~27% рамка mood
  xxl: '55', // ~33% рамка удаления
  fog: '88', // ~53% полупрозрачные карточки
} as const

/**
 * Готовые rgba-литералы для полупрозрачного белого/чёрного.
 */
export const RGBA = {
  white03: 'rgba(255,255,255,.03)',
  white04: 'rgba(255,255,255,.04)',
  white06: 'rgba(255,255,255,.06)',
  white08: 'rgba(255,255,255,.08)',
  white10: 'rgba(255,255,255,.1)',
  white12: 'rgba(255,255,255,.12)',
  white18: 'rgba(255,255,255,.18)',
  white20: 'rgba(255,255,255,.2)',
  black40: 'rgba(0,0,0,.4)',
  black65: 'rgba(0,0,0,.65)',
} as const

/**
 * Z-index шкала.
 */
export const Z = {
  stickyHeader: 10,
  stickyBar: 41,         // выше roomDetail чтобы виден на странице комнаты
  roomDetail: 40,
  modalOverlay: 50,
  fullscreenModal: 55,
  fxPage: 60,            // выше всего — отдельная страница светильника
  storyOverlay: 65,      // ещё выше — story поверх buy
  toast: 100,
} as const
