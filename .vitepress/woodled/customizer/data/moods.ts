/**
 * moods.ts — Настроения и шкала яркости
 *
 * Источник: woodled-v42.jsx (MOODS, BRIGHT, autoMood, getBright).
 *
 * ratio = fxLm / baseLm:
 *   ≤ 0       → empty
 *   < 0.6     → dawn   (Рассвет)
 *   < 1.3     → noon   (Ясный день)
 *   ≥ 1.3     → clearing (Поляна)
 */

import { T } from '../theme/tokens'
import type { MoodId } from './rooms'

export type { MoodId } from './rooms'

/* ──────────────── Настроения ──────────────── */

export interface Mood {
  id: MoodId
  name: string
  color: string
  /** Lucide iconKey для MoodDetailModal. */
  iconKey?: string
  quote: string
  desc: string
  /** Полное описание (full slide). */
  full: string
  mult: string
  temp: string
  shadows: string
  feel: string
  visual: string
  when: string
}

export const MOODS: readonly Mood[] = [
  {
    id: 'dawn',
    name: 'Рассвет',
    color: T.dawn,
    iconKey: 'sun',
    quote: 'Первые лучи. Тепло. Тихо.',
    desc: 'Мягкий тёплый свет. Тени длинные. Покой.',
    full: 'Мягкий приглушённый свет. Тёплый, золотистый. Тени длинные и мягкие. Ламели почти в тени — свет в щелях тусклый, но тёплый. Видно ровно столько, сколько нужно для покоя.',
    mult: '×0.5',
    temp: '2700–3000К',
    shadows: 'Мягкие, размытые, длинные',
    feel: 'Уют, покой, интимность, засыпание',
    visual: 'Щели между ламелями светятся тускло-золотым',
    when: 'Вечер, отдых, спальня, романтика',
  },
  {
    id: 'noon',
    name: 'Ясный день',
    color: T.noon,
    iconKey: 'sun',
    quote: 'Середина дня. Всё видно.',
    desc: 'Комфортный свет для жизни. Всё видно.',
    full: 'Полноценный комфортный свет. Нейтральный, чистый. Тени чёткие, но не резкие. Ламели хорошо видны — текстура дерева раскрывается. Свет для жизни: готовить, работать, разговаривать.',
    mult: '×1.0',
    temp: '4000К',
    shadows: 'Чёткие, ровные',
    feel: 'Энергия, ясность, повседневность',
    visual: 'Щели яркие, тёплый белый, текстура видна полностью',
    when: 'Работа, готовка, дневной режим',
  },
  {
    id: 'clearing',
    name: 'Поляна',
    color: T.clearing,
    iconKey: 'leafy',
    quote: 'Солнце в зените. Ничего не прячется.',
    desc: 'Максимум света. Резкие тени. Бодрость.',
    full: 'Максимальная яркость. Свет заливает. Тени резкие, контрастные. Ламели выглядят графично — тёмное дерево, яркие щели. Для ситуаций, где нужно видеть каждую деталь.',
    mult: '×1.5',
    temp: '4000–5000К',
    shadows: 'Резкие, контрастные, графичные',
    feel: 'Бодрость, точность, активность',
    visual: 'Щели ослепительные, максимальный контраст',
    when: 'Мастерская, детская, читальня',
  },
] as const

/** Пустое состояние — не настроение, а отсутствие света. */
export const MOOD_EMPTY: Mood = {
  id: 'empty',
  name: '—',
  color: T.textDim,
  quote: '',
  desc: 'Добавьте свет, чтобы увидеть настроение.',
  full: '',
  mult: '',
  temp: '',
  shadows: '',
  feel: '',
  visual: '',
  when: '',
}

/**
 * Автоматическое определение настроения по ratio.
 */
export function autoMood(ratio: number): Mood {
  if (ratio <= 0) return MOOD_EMPTY
  if (ratio < 0.6) return MOODS[0]
  if (ratio < 1.3) return MOODS[1]
  return MOODS[2]
}

/**
 * Находит mood по id (или MOOD_EMPTY).
 */
export function moodById(id: MoodId): Mood {
  if (id === 'empty') return MOOD_EMPTY
  return MOODS.find((m) => m.id === id) ?? MOOD_EMPTY
}

/* ──────────────── Шкала яркости (BRIGHT) ──────────────── */

export interface Bright {
  max: number
  name: string
  color: string
}

export const BRIGHT: readonly Bright[] = [
  { max: 0.5, name: 'Не хватает', color: T.red },
  { max: 0.8, name: 'Приглушённо', color: T.yellow },
  { max: 2, name: 'Комфортно', color: T.green },
  { max: 4, name: 'С запасом', color: T.neutral },
  { max: 999, name: 'Избыточно', color: T.textSec },
] as const

export function getBright(ratio: number): Bright {
  return BRIGHT.find((b) => ratio <= b.max) ?? BRIGHT[4]
}

/* ──────────────── Слайды MoodDetailModal (5 штук) ──────────────── */

export interface MoodSlide {
  title: string
  iconKey: string
  text: string | null
  blocks: [string, string][] | null
}

/**
 * Собирает 5 слайдов онбординга для конкретного настроения.
 */
export function buildMoodSlides(mood: Mood): MoodSlide[] {
  return [
    {
      title: mood.name,
      iconKey: mood.iconKey ?? 'sun',
      text: mood.full,
      blocks: null,
    },
    {
      title: 'Параметры',
      iconKey: 'fileSliders',
      text: null,
      blocks: [
        ['Температура', mood.temp],
        ['Яркость', mood.mult],
      ],
    },
    {
      title: 'Атмосфера',
      iconKey: 'fan',
      text: null,
      blocks: [
        ['Тени', mood.shadows],
        ['Ощущение', mood.feel],
      ],
    },
    {
      title: 'Когда',
      iconKey: 'clockFading',
      text: `${mood.when}. Идеально для создания нужной атмосферы.`,
      blocks: null,
    },
    {
      title: 'Управление',
      iconKey: 'gitCompare',
      text: 'Добавляйте свет — настроение станет ярче. Убирайте — мягче. Диммер позволит переключаться.',
      blocks: null,
    },
  ]
}
