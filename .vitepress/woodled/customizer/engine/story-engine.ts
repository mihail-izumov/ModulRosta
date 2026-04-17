/**
 * story-engine.ts — Генерация слайдов «Посмотрите на свой лес»
 *
 * Источник: woodled-v42.jsx (StoryModal slides-builder).
 * Формат: Spotify Wrapped, 9 слайдов (7 всегда + 2 условных).
 */

import { FURN } from '../data/furniture'
import { MATS } from '../data/materials'
import { MOODS, autoMood, type Mood } from '../data/moods'
import { T } from '../theme/tokens'
import { getArea, baseLm, fxLm, fxLamps } from './brightness'
import { zoneLm } from './zone-engine'
import { woodNames, lw, tw, rw } from './i18n'
import { getRT, type Room } from '../data/rooms'

/* ──────────────── Типы ──────────────── */

export type StoryBlock = [string, string, string?] // [label, value, unit?]

export interface StorySlide {
  title: string
  sub: string | null
  iconKey: string
  color: string
  blocks?: StoryBlock[] | null
  /** Вывести карту настроений (слайд 4). */
  moodMap?: boolean
  /** Вывести сетку зон (слайд 6). */
  zoneMap?: boolean
  /** Показывать sub крупнее заголовка. */
  bigSub?: boolean
}

export interface MoodMapEntry {
  name: string
  mood: Mood
}

export interface StoryContext {
  name: string
  rooms: Room[]
  filledRooms: Room[]
  totalLm: number
  totalLamps: number
  totalArea: number
  totalTrees: number
  allWoods: string
  lmPerM2: number
  dominantWood: string
  moodMap: MoodMapEntry[]
  dominantMood: Mood
  avgKelvin: string
  furnPctAvg: number
  hasMirror: boolean
  contrastPair: { soft: string; bright: string } | null
  zoneShare: (zid: 'ceiling' | 'wall' | 'floor' | 'table') => number
}

/* ──────────────── Построение контекста ──────────────── */

export function buildStoryContext(rooms: Room[], name: string): StoryContext {
  const filledRooms = rooms.filter((r) => r.fixtures.length > 0)

  const totalLm = rooms.reduce((s, r) => s + fxLm(r.fixtures), 0)
  const totalLamps = rooms.reduce((s, r) => s + fxLamps(r.fixtures), 0)
  const totalArea = rooms.reduce((s, r) => {
    const rt = getRT(r.typeId)
    return s + getArea(rt, r)
  }, 0)
  const totalTrees = rooms.reduce(
    (s, r) => s + r.fixtures.reduce((a, f) => a + (f.q ?? 1), 0),
    0,
  )

  const allFx = rooms.flatMap((r) => r.fixtures)
  const allWoods = woodNames(allFx)
  const lmPerM2 = totalArea > 0 ? Math.round(totalLm / totalArea) : 0

  /* Доминирующее дерево */
  const woodCounts: Record<string, number> = {}
  for (const f of allFx) {
    const w = f.wood ?? 'oak'
    woodCounts[w] = (woodCounts[w] ?? 0) + (f.q ?? 1)
  }
  const topWoodId = Object.entries(woodCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const dominantWood = topWoodId ? (MATS.find((m) => m.id === topWoodId)?.name ?? '—') : '—'

  /* Карта настроений */
  const moodMap: MoodMapEntry[] = filledRooms.map((r) => {
    const rt = getRT(r.typeId)
    const base = baseLm(rt, r)
    const actual = fxLm(r.fixtures)
    const ratio = base > 0 ? actual / base : 0
    return { name: r.customName || rt.name, mood: autoMood(ratio) }
  })

  /* Доминирующее настроение */
  const moodCounts: Record<string, number> = {}
  for (const m of moodMap) {
    moodCounts[m.mood.id] = (moodCounts[m.mood.id] ?? 0) + 1
  }
  const topMoodId = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const dominantMood = topMoodId ? (MOODS.find((m) => m.id === topMoodId) ?? MOODS[1]) : MOODS[1]

  /* zoneShare */
  const zoneShare = (zid: 'ceiling' | 'wall' | 'floor' | 'table'): number => {
    const lm = rooms.reduce((s, r) => s + zoneLm(r.fixtures, zid), 0)
    return totalLm > 0 ? Math.round((lm / totalLm) * 100) : 0
  }

  /* Средняя температура */
  let avgKelvin = '—'
  if (filledRooms.length > 0) {
    const denom = Math.max(1, totalTrees)
    const sum = filledRooms
      .flatMap((r) => r.fixtures)
      .reduce((s, f) => {
        const k = parseInt(f.opts?.btemp ?? '4000К') || 4000
        return s + k * (f.q ?? 1)
      }, 0)
    avgKelvin = '~' + Math.round(sum / denom) + 'К'
  }

  /* Средний процент потерь от мебели */
  const furnPctAvg =
    filledRooms.length > 0
      ? Math.round(
          filledRooms.reduce(
            (s, r) => s + r.furniture.reduce((a, f) => a + (FURN[f]?.ab ?? 0) * 100, 0),
            0,
          ) / filledRooms.length,
        )
      : 0

  const hasMirror = rooms.some((r) => r.furniture.includes('mirror'))

  /* Контрастная пара (dawn + clearing) */
  let contrastPair: { soft: string; bright: string } | null = null
  if (moodMap.length >= 2) {
    const dawn = moodMap.find((m) => m.mood.id === 'dawn')
    const clear = moodMap.find((m) => m.mood.id === 'clearing')
    if (dawn && clear) contrastPair = { soft: dawn.name, bright: clear.name }
  }

  return {
    name,
    rooms,
    filledRooms,
    totalLm,
    totalLamps,
    totalArea,
    totalTrees,
    allWoods,
    lmPerM2,
    dominantWood,
    moodMap,
    dominantMood,
    avgKelvin,
    furnPctAvg,
    hasMirror,
    contrastPair,
    zoneShare,
  }
}

/* ──────────────── Построение слайдов ──────────────── */

function totalLmSub(totalLm: number): string {
  if (totalLm > 20000) return 'Как солнечный день внутри дома'
  if (totalLm > 10000) return 'Яркий, наполненный светом дом'
  if (totalLm > 5000) return 'Уютный, обжитой свет'
  return 'Мягкий, камерный свет'
}

function treesSub(ctx: StoryContext): string {
  if (ctx.dominantWood === ctx.allWoods) {
    return `Единый ${ctx.dominantWood.toLowerCase()}овый лес`
  }
  return `Смешанный лес: ${ctx.allWoods}`
}

function moodPhrase(ctx: StoryContext): string {
  const counts: Record<string, number> = {}
  for (const m of ctx.moodMap) {
    counts[m.mood.id] = (counts[m.mood.id] ?? 0) + 1
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (entries.length === 1) {
    const m = MOODS.find((x) => x.id === entries[0][0])
    return m ? `Везде ${m.name.toLowerCase()} — целостное настроение` : ''
  }
  if (entries.length === 2) {
    const m1 = MOODS.find((x) => x.id === entries[0][0])?.name
    const m2 = MOODS.find((x) => x.id === entries[1][0])?.name
    return `Смешение ${m1} и ${m2}`
  }
  return 'Все три настроения живут вместе'
}

function temperatureSub(avgKelvin: string): string {
  const k = parseInt(avgKelvin.replace(/[^\d]/g, '')) || 0
  if (k < 3500) return 'Тёплый дом — золотистый свет, длинные тени'
  if (k < 4200) return 'Баланс уюта и ясности'
  return 'Чистый нейтральный свет для активной жизни'
}

/**
 * Основная функция — собирает 7–9 слайдов в зависимости от данных.
 */
export function buildStorySlides(rooms: Room[], name: string): StorySlide[] {
  const ctx = buildStoryContext(rooms, name)
  const slides: StorySlide[] = []

  /* 1. Intro */
  slides.push({
    title: ctx.name,
    sub: `${ctx.totalTrees} ${tw(ctx.totalTrees)} в ${ctx.filledRooms.length} ${rw(ctx.filledRooms.length)}`,
    iconKey: 'house',
    color: T.neutral,
    blocks: null,
  })

  /* 2. Мощность света */
  slides.push({
    title: `${ctx.totalLm.toLocaleString('ru-RU')} лм`,
    sub: totalLmSub(ctx.totalLm),
    iconKey: 'sun',
    color: T.noon,
    blocks: [
      ['Площадь', String(ctx.totalArea), 'м²'],
      ['Плотность', String(ctx.lmPerM2), 'лм/м²'],
    ],
  })

  /* 3. Деревья */
  slides.push({
    title:
      ctx.totalTrees > 3
        ? `Целый лес — ${ctx.totalTrees} деревьев`
        : `${ctx.totalTrees} ${tw(ctx.totalTrees)}`,
    sub: treesSub(ctx),
    iconKey: 'trees',
    color: T.oak,
    blocks: null,
  })

  /* 4. Ваш дом живёт (+ moodMap) */
  slides.push({
    title: 'Ваш дом живёт',
    sub: moodPhrase(ctx),
    iconKey: 'dotDashed',
    color: ctx.dominantMood.color,
    blocks: null,
    moodMap: true,
  })

  /* 5. Ваш дом дышит (условный) */
  if (ctx.contrastPair) {
    slides.push({
      title: 'Ваш дом дышит',
      sub: `${ctx.contrastPair.soft} в Рассвете для отдыха → ${ctx.contrastPair.bright} в Поляне для работы`,
      iconKey: 'wind',
      color: T.dawn,
      blocks: null,
    })
  }

  /* 6. Где живёт свет (+ zoneMap) */
  slides.push({
    title: 'Где живёт свет',
    sub: null,
    iconKey: 'grid',
    color: T.noon,
    blocks: null,
    zoneMap: true,
  })

  /* 7. Теплота */
  const k = parseInt(ctx.avgKelvin.replace(/[^\d]/g, '')) || 0
  slides.push({
    title: `Теплота ${ctx.avgKelvin}`,
    sub: temperatureSub(ctx.avgKelvin),
    iconKey: 'thermo',
    color: k < 3500 ? T.dawn : T.noon,
    blocks: null,
  })

  /* 8. Мебель (условный) */
  if (ctx.furnPctAvg > 0) {
    slides.push({
      title: `Мебель забирает ${ctx.furnPctAvg}%`,
      sub: ctx.hasMirror
        ? 'Зеркала возвращают часть — единственная мебель, которая добавляет свет'
        : 'Тени от мебели делают свет живым — не плоским, а объёмным',
      iconKey: 'grid',
      color: T.neutral,
      blocks: null,
    })
  }

  /* 9. Финал */
  slides.push({
    title: `${ctx.totalLamps} ${lw(ctx.totalLamps)}`,
    sub: 'Каждая ждёт, когда вы щёлкнете выключатель',
    iconKey: 'bulb',
    color: T.clearing,
    blocks: null,
  })

  return slides
}
