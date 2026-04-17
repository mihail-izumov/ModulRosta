/**
 * brightness.ts — Расчёт яркости
 *
 * Источник: woodled-v42.jsx (baseLm, fxLm, fxLamps, getArea).
 *
 * baseLm = lux × area × (ceilingH/2.7) × (1 + Σfurniture.ab)
 * fxLm = Σ lmPer × l × q
 */

import { MD, type Fixture } from '../data/catalog'
import { FURN } from '../data/furniture'
import type { Room, RoomType } from '../data/rooms'

/**
 * Площадь комнаты (м²).
 * При sizeIndex === 3 — кастомная площадь, фолбэк на Большую.
 */
export function getArea(rt: RoomType, r: Room): number {
  if (r.sizeIndex === 3) return r.customArea ?? rt.sizes[2]
  return rt.sizes[r.sizeIndex]
}

/**
 * Целевое количество люмен для комнаты.
 * Учитывает норму, площадь, высоту потолка и мебель.
 */
export function baseLm(rt: RoomType, r: Room): number {
  const furnFactor = r.furniture.reduce((s, f) => s + (FURN[f]?.ab ?? 0), 0)
  return Math.round(rt.lux * getArea(rt, r) * (r.ceilingH / 2.7) * (1 + furnFactor))
}

/**
 * Фактическое количество люмен от набора светильников.
 */
export function fxLm(fixtures: Fixture[]): number {
  return fixtures.reduce((sum, it) => {
    const m = MD[it.m]
    if (!m) return sum
    const l = it.l ?? m.lamps
    const q = it.q ?? 1
    return sum + m.lmPer * l * q
  }, 0)
}

/**
 * Общее количество ламп во всех светильниках (с учётом q).
 */
export function fxLamps(fixtures: Fixture[]): number {
  return fixtures.reduce((sum, it) => {
    const m = MD[it.m]
    if (!m) return sum
    const l = it.l ?? m.lamps
    const q = it.q ?? 1
    return sum + l * q
  }, 0)
}

/**
 * Отношение факта к плану.
 * Возвращает 0 если base === 0.
 */
export function ratioOf(base: number, actual: number): number {
  return base > 0 ? actual / base : 0
}

/**
 * Суммарный процент потерь от мебели (округлён до целого).
 */
export function furnPct(furniture: Room['furniture']): number {
  return Math.round(furniture.reduce((s, f) => s + (FURN[f]?.ab ?? 0) * 100, 0))
}
