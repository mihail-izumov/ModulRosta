/**
 * price-engine.ts — Расчёт цен
 *
 * Источник: woodled-v42.jsx (itemPrice, fxPrice).
 *
 * itemPrice = p[wood] + (l − lamps) × sur + options × flags
 *                        ^^^^^^^^^^^^^^^^
 *                        доплата только если l > lamps
 */

import { MD, type Fixture } from '../data/catalog'
import { DEF_OPT, OPT_PRICE } from '../data/materials'

/**
 * Цена одного размещённого светильника с учётом всех опций.
 */
export function itemPrice(it: Fixture): number {
  const m = MD[it.m]
  if (!m) return 0

  const wood = it.wood ?? 'oak'
  const l = it.l ?? m.lamps
  let price = m.p[wood] ?? 0

  // Сверхкомплектные патроны
  if (l > m.lamps) price += (l - m.lamps) * m.sur

  const opts = { ...DEF_OPT, ...(it.opts ?? {}) }
  if (opts.diffuser) price += OPT_PRICE.diffuser
  if (opts.moisture) price += OPT_PRICE.moisture
  if (opts.bulbs) price += OPT_PRICE.bulbsPerLamp * l

  return price * (it.q ?? 1)
}

/**
 * Суммарная цена массива светильников.
 */
export function fxPrice(fixtures: Fixture[]): number {
  return fixtures.reduce((s, it) => s + itemPrice(it), 0)
}

/**
 * Доплата за дополнительный патрон относительно стандарта (₽).
 * Используется в тосте «+1 патрон — ярче свет, +1000 ₽».
 */
export function lampSurcharge(modelId: Fixture['m']): number {
  return MD[modelId]?.sur ?? 0
}
