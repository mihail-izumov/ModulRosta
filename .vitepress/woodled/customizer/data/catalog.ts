/**
 * catalog.ts — Каталог светильников WOODLED ROTOR
 *
 * Источник правды: woodled-v42.jsx (MD, FAMILIES, ALL_ZONES).
 * Данные сверены с rotor_models_map.md и catalog.md.
 * 17 моделей · 4 зоны · 5 семейств.
 */

import type { Wood } from './materials'

/* ──────────────── Типы ──────────────── */

export type FxType = 'люстра' | 'спот' | 'бра' | 'настольная' | 'торшер'
export type ZoneId = 'ceiling' | 'wall' | 'floor' | 'table'
export type FamilyId = 'rotor' | 'rotor_x' | 'elliptical' | 'spot' | 'bra_v'

export type ModelId =
  | 'rotor_s'
  | 'rotor_m'
  | 'rotor_l'
  | 'rotor_1000'
  | 'rotor_x_m'
  | 'rotor_x_l'
  | 'elliptical_s'
  | 'elliptical_l'
  | 'spot_s'
  | 'spot_l'
  | 'unit'
  | 'bra_h'
  | 'bra_v_s'
  | 'bra_v_l'
  | 'table_lamp'
  | 'floor_lamp'
  | 'floor_lamp_s'

export interface ModelPrice {
  oak: number
  walnut: number
  black: number
}

export interface Model {
  name: string
  /** Короткая буква для чипа размера (S/M/L/1000/U/H/T/F/Fs). */
  letter: string
  type: FxType
  /** Семейство (для переключения размеров). Одиночные модели без поля. */
  family?: FamilyId
  /** Количество ламп по умолчанию. */
  lamps: number
  /** Минимум патронов (слайдер). */
  minL: number
  /** Максимум патронов. Если minL === maxL — слайдер не показывается. */
  maxL: number
  /** Люмен на лампу. */
  lmPer: number
  /** Доплата за +1 патрон (₽). */
  sur: number
  /** Рекомендованный диапазон площади (м²). Не блокирующий. */
  sqMin: number
  sqMax: number
  /** Цены в ₽ по трём деревьям. */
  p: ModelPrice
}

/* ──────────────── Каталог моделей ──────────────── */

export const MD: Record<ModelId, Model> = {
  /* Потолок — ROTOR Celing (S/M/L = 4 ламп, 1000 = 6 ламп) */
  rotor_s: {
    name: 'Rotor S',
    letter: 'S',
    type: 'люстра',
    family: 'rotor',
    lamps: 4,
    minL: 4,
    maxL: 6,
    lmPer: 1500,
    sur: 1000,
    sqMin: 8,
    sqMax: 10,
    p: { oak: 14900, walnut: 17900, black: 15900 },
  },
  rotor_m: {
    name: 'Rotor M',
    letter: 'M',
    type: 'люстра',
    family: 'rotor',
    lamps: 4,
    minL: 4,
    maxL: 6,
    lmPer: 1500,
    sur: 1000,
    sqMin: 10,
    sqMax: 12,
    p: { oak: 19900, walnut: 22900, black: 20900 },
  },
  rotor_l: {
    name: 'Rotor L',
    letter: 'L',
    type: 'люстра',
    family: 'rotor',
    lamps: 4,
    minL: 4,
    maxL: 6,
    lmPer: 1500,
    sur: 1000,
    sqMin: 12,
    sqMax: 15,
    p: { oak: 26900, walnut: 30900, black: 27900 },
  },
  rotor_1000: {
    name: 'Rotor 1000',
    letter: '1000',
    type: 'люстра',
    family: 'rotor',
    lamps: 6,
    minL: 6,
    maxL: 8,
    lmPer: 1500,
    sur: 1000,
    sqMin: 15,
    sqMax: 20,
    p: { oak: 39900, walnut: 45900, black: 41900 },
  },

  /* Потолок — ROTOR X (расширенный абажур, 60W E27 → 2000 лм/лампа) */
  rotor_x_m: {
    name: 'Rotor X M',
    letter: 'M',
    type: 'люстра',
    family: 'rotor_x',
    lamps: 3,
    minL: 3,
    maxL: 5,
    lmPer: 2000,
    sur: 1500,
    sqMin: 10,
    sqMax: 14,
    p: { oak: 27900, walnut: 30900, black: 28900 },
  },
  rotor_x_l: {
    name: 'Rotor X L',
    letter: 'L',
    type: 'люстра',
    family: 'rotor_x',
    lamps: 3,
    minL: 3,
    maxL: 5,
    lmPer: 2000,
    sur: 1500,
    sqMin: 14,
    sqMax: 18,
    p: { oak: 34900, walnut: 36900, black: 35900 },
  },

  /* Потолок — Elliptical */
  elliptical_s: {
    name: 'Elliptical S',
    letter: 'S',
    type: 'люстра',
    family: 'elliptical',
    lamps: 4,
    minL: 4,
    maxL: 6,
    lmPer: 900,
    sur: 800,
    sqMin: 5,
    sqMax: 15,
    p: { oak: 25900, walnut: 28900, black: 26900 },
  },
  elliptical_l: {
    name: 'Elliptical L',
    letter: 'L',
    type: 'люстра',
    family: 'elliptical',
    lamps: 6,
    minL: 6,
    maxL: 8,
    lmPer: 900,
    sur: 800,
    sqMin: 15,
    sqMax: 20,
    p: { oak: 38900, walnut: 43900, black: 40900 },
  },

  /* Потолок — Spot (подвесной точечный) */
  spot_s: {
    name: 'Spot S',
    letter: 'S',
    type: 'спот',
    family: 'spot',
    lamps: 1,
    minL: 1,
    maxL: 1,
    lmPer: 900,
    sur: 0,
    sqMin: 3,
    sqMax: 5,
    p: { oak: 8900, walnut: 9900, black: 8900 },
  },
  spot_l: {
    name: 'Spot L',
    letter: 'L',
    type: 'спот',
    family: 'spot',
    lamps: 1,
    minL: 1,
    maxL: 1,
    lmPer: 900,
    sur: 0,
    sqMin: 3,
    sqMax: 5,
    p: { oak: 10900, walnut: 11900, black: 10900 },
  },

  /* Стена — Unit (настенный спот) */
  unit: {
    name: 'Unit',
    letter: 'U',
    type: 'спот',
    lamps: 1,
    minL: 1,
    maxL: 1,
    lmPer: 900,
    sur: 0,
    sqMin: 3,
    sqMax: 5,
    p: { oak: 8900, walnut: 9900, black: 8900 },
  },

  /* Стена — Wall Lamp Horizontal */
  bra_h: {
    name: 'Бра Horizontal',
    letter: 'H',
    type: 'бра',
    lamps: 2,
    minL: 2,
    maxL: 3,
    lmPer: 900,
    sur: 600,
    sqMin: 4,
    sqMax: 6,
    p: { oak: 12900, walnut: 13900, black: 12900 },
  },

  /* Стена — Wall Lamp Vertical */
  bra_v_s: {
    name: 'Бра Vertical S',
    letter: 'S',
    type: 'бра',
    family: 'bra_v',
    lamps: 2,
    minL: 2,
    maxL: 3,
    lmPer: 900,
    sur: 600,
    sqMin: 4,
    sqMax: 6,
    p: { oak: 17900, walnut: 20900, black: 18900 },
  },
  bra_v_l: {
    name: 'Бра Vertical L',
    letter: 'L',
    type: 'бра',
    family: 'bra_v',
    lamps: 2,
    minL: 2,
    maxL: 3,
    lmPer: 900,
    sur: 600,
    sqMin: 4,
    sqMax: 6,
    p: { oak: 21900, walnut: 24900, black: 22900 },
  },

  /* Стол */
  table_lamp: {
    name: 'Настольная',
    letter: 'T',
    type: 'настольная',
    lamps: 1,
    minL: 1,
    maxL: 1,
    lmPer: 1500,
    sur: 0,
    sqMin: 2,
    sqMax: 4,
    p: { oak: 10900, walnut: 11900, black: 10900 },
  },

  /* Пол — два разных торшера (не размеры одной модели) */
  floor_lamp: {
    name: 'Торшер',
    letter: 'F',
    type: 'торшер',
    lamps: 1,
    minL: 1,
    maxL: 1,
    lmPer: 1500,
    sur: 0,
    sqMin: 5,
    sqMax: 7,
    p: { oak: 37900, walnut: 42900, black: 39900 },
  },
  floor_lamp_s: {
    name: 'Торшер S',
    letter: 'Fs',
    type: 'торшер',
    lamps: 1,
    minL: 1,
    maxL: 1,
    lmPer: 1500,
    sur: 0,
    sqMin: 5,
    sqMax: 7,
    p: { oak: 26900, walnut: 28900, black: 27900 },
  },
}

/* ──────────────── Семейства ──────────────── */

export const FAMILIES: Record<FamilyId, readonly ModelId[]> = {
  rotor: ['rotor_s', 'rotor_m', 'rotor_l', 'rotor_1000'],
  rotor_x: ['rotor_x_m', 'rotor_x_l'],
  elliptical: ['elliptical_s', 'elliptical_l'],
  spot: ['spot_s', 'spot_l'],
  bra_v: ['bra_v_s', 'bra_v_l'],
}

/* ──────────────── Зоны ──────────────── */

export interface Zone {
  id: ZoneId
  name: string
  models: readonly ModelId[]
  /** Иконка-призрак для пустой зоны. */
  ghost: string
}

export const ALL_ZONES: readonly Zone[] = [
  {
    id: 'ceiling',
    name: 'Потолок',
    models: [
      'rotor_s',
      'rotor_m',
      'rotor_l',
      'rotor_1000',
      'rotor_x_m',
      'rotor_x_l',
      'elliptical_s',
      'elliptical_l',
      'spot_s',
      'spot_l',
    ],
    ghost: 'ceiling',
  },
  {
    id: 'wall',
    name: 'Стены',
    models: ['unit', 'bra_h', 'bra_v_s', 'bra_v_l'],
    ghost: 'bra',
  },
  {
    id: 'floor',
    name: 'Пол',
    models: ['floor_lamp', 'floor_lamp_s'],
    ghost: 'floor',
  },
  {
    id: 'table',
    name: 'Стол',
    models: ['table_lamp'],
    ghost: 'table',
  },
] as const

/* ──────────────── Fixture (размещённый светильник) ──────────────── */

import type { FxOpts } from './materials'

export interface Fixture {
  /** ID модели из MD. */
  m: ModelId
  /** Количество светильников этой модели. */
  q: number
  /** Выбранное дерево. */
  wood: Wood
  /** Зона размещения. */
  zone: ZoneId
  /** Фактическое количество патронов (в диапазоне [minL, maxL]). */
  l?: number
  /** Опции (overrides от DEF_OPT). */
  opts?: Partial<FxOpts>
}
