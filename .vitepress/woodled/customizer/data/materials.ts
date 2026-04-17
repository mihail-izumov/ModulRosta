/**
 * materials.ts — Материалы и опции кастомизации
 *
 * Источник: woodled-v42.jsx (MATS, BOWLS, MOUNTS, BTEMPS, DEF_OPT).
 * Справочные тексты: materials.md.
 */

import { WCOL, type Wood } from '../theme/tokens'

export type { Wood } from '../theme/tokens'

/* ──────────────── Дерево ──────────────── */

export interface Material {
  id: Wood
  name: string
  /** Цвет в UI (тот же, что WCOL[id]). */
  color: string
}

export const MATS: readonly Material[] = [
  { id: 'oak', name: 'Дуб', color: WCOL.oak },
  { id: 'walnut', name: 'Орех', color: WCOL.walnut },
  { id: 'black', name: 'Чёрный дуб', color: WCOL.black },
] as const

/* ──────────────── Чаши, крепления ──────────────── */

export const BOWLS = ['Чёрная', 'Белая', 'Хром', 'Дерево', 'Никель'] as const
export type Bowl = (typeof BOWLS)[number]

export const MOUNTS = ['Потолочный', 'Вплотную', 'Подвесной', 'Шинопровод'] as const
export type Mount = (typeof MOUNTS)[number]

/* ──────────────── Температуры лампочек ──────────────── */

export interface BTemp {
  id: string
  /** Короткий лейбл в UI (напр. «Тёплый»). */
  l: string
  /** Значение Кельвинов как строка («2700К»). */
  k: string
}

export const BTEMPS: readonly BTemp[] = [
  { id: '2700К', l: 'Тёплый', k: '2700К' },
  { id: '3000К', l: 'Тёплый-нейтр.', k: '3000К' },
  { id: '4000К', l: 'Нейтральный', k: '4000К' },
] as const

/* ──────────────── Дефолтные опции ──────────────── */

export interface FxOpts {
  bowl: Bowl
  mount: Mount
  wire: string
  btemp: string
  diffuser: boolean
  moisture: boolean
  bulbs: boolean
}

export const DEF_OPT: FxOpts = {
  bowl: 'Чёрная',
  mount: 'Потолочный',
  wire: 'Чёрный',
  btemp: '4000К',
  diffuser: false,
  moisture: false,
  bulbs: true,
}

/* ──────────────── Цены опций ──────────────── */

export const OPT_PRICE = {
  diffuser: 500,
  moisture: 1000,
  bulbsPerLamp: 250,
} as const

/* ──────────────── Тексты тостов ──────────────── */

export const WOOD_TIPS: Record<Wood, string> = {
  oak: 'Дуб — тёплый, песочный, самый популярный',
  walnut: 'Орех — тёмный, шоколадный, благородный',
  black: 'Чёрный дуб — строгий, графичный, контрастный',
}

export const BOWL_TIPS: Record<Bowl, string> = {
  Чёрная: 'Чёрная чаша — строго, минималистично',
  Белая: 'Белая чаша — свежо, скандинавский стиль',
  Хром: 'Хром — блеск, отражения света',
  Дерево: 'Деревянная накладка — цельный природный образ',
  Никель: 'Никель — мягкий металлический блеск',
}

export const MOUNT_TIPS: Record<Mount, string> = {
  Потолочный: 'Классическое потолочное крепление',
  Вплотную: 'Вплотную к потолку — минимум зазора',
  Подвесной: 'На подвесе — свет ближе к столу',
  Шинопровод: 'Шинопровод — гибкое позиционирование',
}

export const BTEMP_TIPS: Record<string, string> = {
  '2700К': 'Тёплый свет — уютная атмосфера, идеально для вечера',
  '3000К': 'Тёплый нейтральный — баланс уюта и ясности',
  '4000К': 'Нейтральный свет — всё видно чётко, для работы и активности',
}

export const OPT_TIPS = {
  diffuser: {
    on: 'Рассеиватель смягчит свет и уберёт блики',
    off: 'Рассеиватель убран — свет станет направленнее',
  },
  moisture: {
    on: 'Влагозащита — обязательна для ванной',
    off: 'Влагозащита убрана',
  },
  bulbs: {
    on: 'Лампочки в комплекте — готово к включению',
    off: 'Лампочки убраны — подберёте свои',
  },
} as const
