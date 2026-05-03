/**
 * templates.ts — Шаблоны домов
 *
 * 3 готовых конфигурации на основе аналитики рынка жилья Москвы 2025.
 * Каждый шаблон = массив комнат с fixtures и мебелью.
 *
 * Используется при первом запуске для preheat-старта.
 */

import type { RoomTypeId, FurnId } from './rooms'
import type { ModelId, ZoneId } from './catalog'
import type { Wood } from './materials'

export interface TemplateFixture {
  m: ModelId
  q: number
  wood: Wood
  zone: ZoneId
}

export interface TemplateRoom {
  typeId: RoomTypeId
  sizeIndex: 0 | 1 | 2
  ceilingH: number
  fixtures: TemplateFixture[]
  furniture: FurnId[]
}

export interface HomeTemplate {
  id: string
  /** Площадь для отображения в плашке: '~45 м²' */
  areaLabel: string
  rooms: TemplateRoom[]
}

export const TEMPLATES: readonly HomeTemplate[] = [
  /* ───────── Шаблон ~45 м² ───────── */
  {
    id: 'home_45',
    areaLabel: '~45 м²',
    rooms: [
      {
        typeId: 'kitchen',
        sizeIndex: 0,
        ceilingH: 2.7,
        fixtures: [
          { m: 'rotor_s', q: 1, wood: 'oak', zone: 'ceiling' },
        ],
        furniture: ['dtable', 'fridge', 'kitchen_set', 'stove'],
      },
      {
        typeId: 'bedroom',
        sizeIndex: 0,
        ceilingH: 2.7,
        fixtures: [
          { m: 'bra_h', q: 1, wood: 'walnut', zone: 'wall' },
          { m: 'table_lamp', q: 1, wood: 'oak', zone: 'table' },
        ],
        furniture: ['bed', 'wardrobe', 'dresser', 'nightstand'],
      },
      {
        typeId: 'hallway',
        sizeIndex: 0,
        ceilingH: 2.7,
        fixtures: [
          { m: 'spot_s', q: 1, wood: 'oak', zone: 'ceiling' },
          { m: 'spot_s', q: 1, wood: 'oak', zone: 'ceiling' },
        ],
        furniture: ['wardrobe', 'dresser', 'shoe_rack', 'coat_rack', 'mirror'],
      },
    ],
  },

  /* ───────── Шаблон ~65 м² ───────── */
  {
    id: 'home_65',
    areaLabel: '~65 м²',
    rooms: [
      {
        typeId: 'living',
        sizeIndex: 1,
        ceilingH: 2.7,
        fixtures: [
          { m: 'rotor_m', q: 1, wood: 'oak', zone: 'ceiling' },
          { m: 'bra_h', q: 2, wood: 'oak', zone: 'wall' },
          { m: 'floor_lamp_s', q: 1, wood: 'oak', zone: 'floor' },
        ],
        furniture: ['sofa', 'bookshelf', 'jtable', 'tv_stand'],
      },
      {
        typeId: 'bedroom',
        sizeIndex: 1,
        ceilingH: 2.7,
        fixtures: [
          { m: 'rotor_s', q: 1, wood: 'walnut', zone: 'ceiling' },
          { m: 'table_lamp', q: 1, wood: 'walnut', zone: 'table' },
        ],
        furniture: ['bed', 'wardrobe', 'dresser', 'nightstand'],
      },
      {
        typeId: 'kitchen',
        sizeIndex: 1,
        ceilingH: 2.7,
        fixtures: [
          { m: 'elliptical_s', q: 1, wood: 'black', zone: 'ceiling' },
        ],
        furniture: ['dtable', 'fridge', 'kitchen_set', 'stove'],
      },
      {
        typeId: 'hallway',
        sizeIndex: 0,
        ceilingH: 2.7,
        fixtures: [
          { m: 'spot_s', q: 1, wood: 'black', zone: 'ceiling' },
        ],
        furniture: ['wardrobe', 'dresser', 'shoe_rack', 'coat_rack', 'mirror'],
      },
    ],
  },

  /* ───────── Шаблон ~85 м² ───────── */
  {
    id: 'home_85',
    areaLabel: '~85 м²',
    rooms: [
      {
        typeId: 'living',
        sizeIndex: 2,
        ceilingH: 3.0,
        fixtures: [
          { m: 'rotor_l', q: 1, wood: 'walnut', zone: 'ceiling' },
          { m: 'bra_v_l', q: 2, wood: 'walnut', zone: 'wall' },
          { m: 'floor_lamp', q: 1, wood: 'oak', zone: 'floor' },
        ],
        furniture: ['sofa', 'bookshelf', 'dtable', 'jtable', 'tv_stand'],
      },
      {
        typeId: 'bedroom',
        sizeIndex: 1,
        ceilingH: 3.0,
        fixtures: [
          { m: 'rotor_s', q: 1, wood: 'oak', zone: 'ceiling' },
          { m: 'table_lamp', q: 2, wood: 'oak', zone: 'table' },
        ],
        furniture: ['bed', 'wardrobe', 'dresser', 'nightstand', 'armchair'],
      },
      {
        typeId: 'kids',
        sizeIndex: 1,
        ceilingH: 3.0,
        fixtures: [
          { m: 'rotor_m', q: 1, wood: 'oak', zone: 'ceiling' },
          { m: 'unit', q: 1, wood: 'oak', zone: 'wall' },
        ],
        furniture: ['bed', 'desk', 'wardrobe', 'bookshelf'],
      },
      {
        typeId: 'kitchen',
        sizeIndex: 1,
        ceilingH: 3.0,
        fixtures: [
          { m: 'elliptical_s', q: 1, wood: 'black', zone: 'ceiling' },
        ],
        furniture: ['dtable', 'fridge', 'kitchen_set', 'stove'],
      },
      {
        typeId: 'hallway',
        sizeIndex: 1,
        ceilingH: 3.0,
        fixtures: [
          { m: 'spot_s', q: 2, wood: 'black', zone: 'ceiling' },
        ],
        furniture: ['wardrobe', 'dresser', 'shoe_rack', 'coat_rack', 'mirror'],
      },
    ],
  },
] as const
