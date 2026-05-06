/**
 * autosize.ts — Автоподбор размера светильника + рекомендации
 *
 * Чистые функции без побочных эффектов.
 *
 * pickBestSize — выбирает оптимальный размер при добавлении
 * buildSizeRecommendation — строит массив рекомендаций для FxEditor
 *
 * Документация: AUTOSIZE.md
 */

import { MD, type ModelId } from '../data/catalog'

/* ──────────────── Типы ──────────────── */

export type AreaFit = 'ideal' | 'acceptable' | 'poor'

export interface SizeCandidate {
  mid: ModelId
  areaFit: AreaFit
  modelLm: number
  coverageRatio: number
  projectedRatio: number
  recommended: boolean
}

/* ──────────────── Оценка покрытия площади ──────────────── */

/**
 * Попадает ли площадь комнаты в рабочий диапазон модели.
 * Буфер ±20% для acceptable — эмпирический (см. AUTOSIZE.md Р2).
 */
export function evaluateAreaFit(area: number, sqMin: number, sqMax: number): AreaFit {
  if (area >= sqMin && area <= sqMax) return 'ideal'
  if (area >= sqMin * 0.8 && area <= sqMax * 1.2) return 'acceptable'
  return 'poor'
}

/* ──────────────── Автоподбор при добавлении ──────────────── */

/**
 * Выбирает оптимальный размер из семейства.
 *
 * Приоритеты:
 *   1. areaFit = ideal, ближайший к coverageRatio 1.0
 *   2. areaFit = acceptable, ближайший к coverageRatio 1.0
 *   3. fallback — наибольшая модель
 *
 * При дефиците ≤ 0 (света хватает) — наименьшая подходящая.
 */
export function pickBestSize(
  candidates: ModelId[],
  area: number,
  deficit: number,
): ModelId {
  if (candidates.length <= 1) return candidates[0]

  const scored = candidates.map((mid) => {
    const m = MD[mid]
    const areaFit = evaluateAreaFit(area, m.sqMin, m.sqMax)
    const modelLm = m.lmPer * m.lamps
    const coverageRatio = deficit > 0 ? modelLm / deficit : 0
    return { mid, areaFit, modelLm, coverageRatio }
  })

  const ideal = scored.filter((s) => s.areaFit === 'ideal')
  const acceptable = scored.filter((s) => s.areaFit === 'acceptable')
  const pool = ideal.length > 0 ? ideal : acceptable.length > 0 ? acceptable : []

  if (pool.length > 0 && deficit > 0) {
    pool.sort(
      (a, b) => Math.abs(a.coverageRatio - 1.0) - Math.abs(b.coverageRatio - 1.0),
    )
    return pool[0].mid
  }

  if (pool.length > 0) {
    pool.sort((a, b) => a.modelLm - b.modelLm)
    return pool[0].mid
  }

  return candidates[candidates.length - 1]
}

/* ──────────────── Рекомендации для FxEditor ──────────────── */

/**
 * Строит массив рекомендаций для каждого члена семейства.
 * Используется в шаге «Размер» FxEditor для отображения
 * бейджей, прогнозного ratio и подсказок.
 *
 * @param familyMembers — id моделей семейства (отфильтрованные по зоне)
 * @param area — площадь комнаты (м²)
 * @param baseLm — целевые люмены комнаты
 * @param currentLmWithoutThis — текущие люмены без этого светильника
 * @param qty — количество штук этого светильника (fx.q)
 */
export function buildSizeRecommendation(
  familyMembers: ModelId[],
  area: number,
  baseLm: number,
  currentLmWithoutThis: number,
  qty: number,
): SizeCandidate[] {
  return familyMembers.map((mid) => {
    const m = MD[mid]
    const areaFit = evaluateAreaFit(area, m.sqMin, m.sqMax)
    const modelLm = m.lmPer * m.lamps
    const projectedLm = currentLmWithoutThis + modelLm * qty
    const projectedRatio = baseLm > 0 ? projectedLm / baseLm : 0
    const deficit = baseLm - currentLmWithoutThis
    const coverageRatio = deficit > 0 ? (modelLm * qty) / deficit : 0

    const recommended =
      areaFit === 'ideal' && projectedRatio >= 0.8 && projectedRatio <= 2.0

    return { mid, areaFit, modelLm, coverageRatio, projectedRatio, recommended }
  })
}
