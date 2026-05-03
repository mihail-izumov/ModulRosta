/**
 * rooms.ts — Типы комнат и их параметры
 *
 * Источник: woodled-v42.jsx (RTS, SZ, starterRooms, hints).
 * Справочные данные: rooms.md.
 */

import type { ZoneId, Fixture } from './catalog'

/* ──────────────── Типы ──────────────── */

export type RoomTypeId =
  | 'living'
  | 'kitchen'
  | 'bedroom'
  | 'kids'
  | 'office'
  | 'hallway'
  | 'bathroom'
  | 'stairs'

export type FurnId =
  | 'sofa'
  | 'armchair'
  | 'bookshelf'
  | 'dtable'
  | 'jtable'
  | 'island'
  | 'bar'
  | 'bed'
  | 'wardrobe'
  | 'dresser'
  | 'nightstand'
  | 'desk'
  | 'mirror'
  | 'bathtub'
  | 'shower'
  | 'sink'
  | 'washer'
  | 'fridge'
  | 'kitchen_set'
  | 'stove'
  | 'tv_stand'
  | 'shoe_rack'
  | 'coat_rack'

export type MoodId = 'empty' | 'dawn' | 'noon' | 'clearing'

export type ZoneLimits = Partial<Record<ZoneId, number>>

export interface RoomType {
  id: RoomTypeId
  name: string
  /** Норма освещённости в люксах (СНиП + практика). */
  lux: number
  /** Три типовых размера в м² (Малая / Средняя / Большая). */
  sizes: readonly [number, number, number]
  /** Диапазоны-подписи в UI. */
  ranges: readonly [string, string, string]
  /** Настроение по умолчанию (справочно, autoMood его не использует). */
  def: MoodId
  /** Доступные зоны в этой комнате. */
  zones: readonly ZoneId[]
  /** Лимиты точек по зонам. */
  limits: ZoneLimits
  /** Мебель, доступная для toggle в UI. */
  furn: readonly FurnId[]
}

export interface Room {
  id: string
  typeId: RoomTypeId
  customName: string
  /** 0=Малая, 1=Средняя, 2=Большая, 3=Своя. */
  sizeIndex: 0 | 1 | 2 | 3
  /** Используется при sizeIndex === 3. */
  customArea: number | null
  /** Высота потолка в метрах (2.2–4.5). */
  ceilingH: number
  fixtures: Fixture[]
  furniture: FurnId[]
  /** Копия rt.limits — может быть изменена пользователем. */
  limits: ZoneLimits
  /** Цвет фона карточки (Hue-style). */
  cardColor?: string
}

/* ──────────────── Размеры ──────────────── */

export const SZ = ['Малая', 'Средняя', 'Большая', 'Своя'] as const

/* ──────────────── Справочник типов комнат ──────────────── */

export const RTS: readonly RoomType[] = [
  {
    id: 'living',
    name: 'Гостиная',
    lux: 150,
    sizes: [18, 25, 35],
    ranges: ['12–20', '20–30', '30–40'],
    def: 'noon',
    zones: ['ceiling', 'wall', 'floor', 'table'],
    limits: { ceiling: 1, wall: 2, floor: 2, table: 1 },
    furn: ['sofa', 'armchair', 'bookshelf', 'dtable', 'jtable', 'wardrobe', 'tv_stand'],
  },
  {
    id: 'kitchen',
    name: 'Кухня',
    lux: 200,
    sizes: [10, 15, 20],
    ranges: ['6–12', '12–18', '18–25'],
    def: 'noon',
    zones: ['ceiling', 'wall', 'table'],
    limits: { ceiling: 1, wall: 3, table: 1 },
    furn: ['dtable', 'island', 'bar', 'fridge', 'kitchen_set', 'stove'],
  },
  {
    id: 'bedroom',
    name: 'Спальня',
    lux: 100,
    sizes: [12, 16, 20],
    ranges: ['8–14', '14–18', '18–24'],
    def: 'dawn',
    zones: ['ceiling', 'wall', 'floor', 'table'],
    limits: { ceiling: 1, wall: 2, floor: 1, table: 2 },
    furn: ['bed', 'wardrobe', 'dresser', 'nightstand', 'armchair'],
  },
  {
    id: 'kids',
    name: 'Детская',
    lux: 200,
    sizes: [10, 14, 18],
    ranges: ['6–12', '12–16', '16–20'],
    def: 'clearing',
    zones: ['ceiling', 'wall', 'table'],
    limits: { ceiling: 1, wall: 2, table: 1 },
    furn: ['bed', 'desk', 'wardrobe', 'bookshelf', 'dresser', 'nightstand'],
  },
  {
    id: 'office',
    name: 'Кабинет',
    lux: 250,
    sizes: [8, 12, 16],
    ranges: ['5–10', '10–14', '14–20'],
    def: 'noon',
    zones: ['ceiling', 'wall', 'floor', 'table'],
    limits: { ceiling: 1, wall: 2, floor: 1, table: 1 },
    furn: ['desk', 'armchair', 'bookshelf', 'wardrobe'],
  },
  {
    id: 'hallway',
    name: 'Коридор',
    lux: 80,
    sizes: [4, 8, 12],
    ranges: ['2–6', '6–10', '10–15'],
    def: 'dawn',
    zones: ['ceiling', 'wall'],
    limits: { ceiling: 3, wall: 2 },
    furn: ['wardrobe', 'dresser', 'mirror', 'shoe_rack', 'coat_rack'],
  },
  {
    id: 'bathroom',
    name: 'Ванная',
    lux: 200,
    sizes: [4, 6, 8],
    ranges: ['3–5', '5–7', '7–10'],
    def: 'noon',
    zones: ['ceiling', 'wall'],
    limits: { ceiling: 2, wall: 2 },
    furn: ['bathtub', 'shower', 'sink', 'washer', 'mirror'],
  },
  {
    id: 'stairs',
    name: 'Лестница',
    lux: 50,
    sizes: [4, 6, 8],
    ranges: ['2–5', '5–7', '7–10'],
    def: 'dawn',
    zones: ['ceiling', 'wall'],
    limits: { ceiling: 1, wall: 3 },
    furn: [],
  },
] as const

/* ──────────────── Подсказки пустых комнат ──────────────── */

export const ROOM_HINTS: Record<RoomTypeId, string> = {
  living: 'Люстра + бра',
  kitchen: 'Люстра или споты',
  bedroom: 'Мягкий свет',
  kids: 'Яркий свет',
  office: 'Свет для работы',
  hallway: 'Споты или бра',
  bathroom: 'Влагозащитный свет',
  stairs: 'Бра на стены',
}

/* ──────────────── Стартовый набор ──────────────── */

/** Последовательность комнат при открытии конфигуратора. */
export const STARTER_ROOM_TYPES: readonly RoomTypeId[] = [
  'living',
  'kitchen',
  'bedroom',
  'hallway',
] as const

/* ──────────────── Helpers ──────────────── */

/** Находит описание типа комнаты по id. */
export function getRT(id: RoomTypeId): RoomType {
  const rt = RTS.find((r) => r.id === id)
  if (!rt) throw new Error(`Unknown room type: ${id}`)
  return rt
}
