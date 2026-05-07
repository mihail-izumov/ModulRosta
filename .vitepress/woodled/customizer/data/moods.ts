/**
 * moods.ts — Настроения и шкала яркости
 *
 * Источник: woodled-v42.jsx (MOODS, BRIGHT, autoMood, getBright).
 *
 * === ТЗ-1: новые id, name, color, iconKey ===
 * === ТЗ-2: финальные тексты + buildMoodSlides (слайды 4, 5) ===
 * === v7: порядок на MoodArc слева направо — Утро → Полдень → Сумерки (дуга дня) ===
 *
 * autoMood() переназначает mood по ratio:
 *   ≤ 0           → empty
 *   < 0.8         → morning  (Утро в лесу — мало источников, утренний минимализм)
 *   0.8 ≤ r < 1.4 → zenith   (Ясный полдень — норма, день в разгаре)
 *   ≥ 1.4         → dusk     (Тёплые сумерки — обилие нижних источников, вечер)
 *
 * Mood — атмосферная категория, не индикатор яркости.
 * Для яркости — отдельный слой BRIGHT в LumenDashboard.
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
    id: 'dusk',
    name: 'Тёплые сумерки',
    color: T.dawn,
    iconKey: 'arrowDownRight',

    quote: 'Час, когда не нужно решений.',

    desc: 'Свет собрался в нижних источниках. Время убрать день.',

    full: 'Час, когда не нужно никаких решений. Свет собрался в нижних источниках — торшерах, настольных, бра у изголовья. Ламели на стене почти неразличимы, между ними мягкие золотистые щели. В комнате остаётся ровно столько света, чтобы дочитать страницу — и не больше.',

    mult: '×0.5',

    temp: '2700K · тёплый',

    shadows: 'Длинные, мягкие, глубокие. У каждой вещи своя тень с расплывчатым краем.',

    feel: 'Покой, замедление, согревание. Тело понимает: сейчас не время решать.',

    visual: 'Щели между ламелями светятся тускло-золотым, как угли в почти потухшем камине.',

    when: 'Когда хочется убрать день. Спальня после ужина. Кабинет с книгой перед сном. Гостиная после кино, когда ещё не хочется уходить.',
  },
  {
    id: 'morning',
    name: 'Утро в лесу',
    color: T.noon,
    iconKey: 'arrowRight',

    quote: 'Свет уже в комнате, но ничего не вынуждает.',

    desc: 'Видно лица, страницы, чашку. День идёт своим ходом.',

    full: 'Свет уже в комнате, но ничего не вынуждает. Видно лица, страницы, чашку, узор на ламелях. Через щели между планками падают мягкие ровные полосы — как солнце через крону, когда оно ещё не в зените. По комнате легко двигаться, не задумываясь о том, где что лежит.',

    mult: '×1.0',

    temp: '3000–4000K · тёплый-нейтральный',

    shadows: 'Чёткие, но не резкие. Видно очертания, но не «вырезано из бумаги». Тёплые края.',

    feel: 'Спокойствие, ровность, присутствие. День идёт, и идти ему ещё долго.',

    visual: 'Ламели читаются — текстура дерева раскрывается, но не «звенит».',

    when: 'Когда жизнь идёт своим ходом. Гостиная при гостях. Кухня при готовке. Кабинет при разговорах. Спальня, когда в ней не спят, а живут.',
  },
  {
    id: 'zenith',
    name: 'Ясный полдень',
    color: T.clearing,
    iconKey: 'arrowUpRight',

    quote: 'Полная сила света. Никаких компромиссов.',

    desc: 'Тени резкие, контуры точные, цвета насыщенные.',

    full: 'Полная сила света. Никаких компромиссов. Тени резкие, контуры точные, цвета насыщенные. Ламели становятся графичными — тёмное дерево, ослепительные щели. Лучший свет для тех моментов, когда нужно видеть всё точно: уроки за столом, разделочную доску, лицо в зеркале.',

    mult: '×1.5',

    temp: '4000K · нейтральный',

    shadows: 'Резкие, контрастные, графичные. Угольные на светлых стенах.',

    feel: 'Бодрость, концентрация, точность. Тело понимает: сейчас работаем.',

    visual: 'Ламели графичные — резкий контраст между тёмным деревом и яркими щелями.',

    when: 'Когда нужно видеть точно. Кухня при работе с ножом. Кабинет при отчёте. Детская при уроках. Ванная при утренних сборах.',
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
 * Порядок на MoodArc слева направо: Утро → Полдень → Сумерки (дуга дня).
 */
export function autoMood(ratio: number): Mood {
  if (ratio <= 0)    return MOOD_EMPTY
  if (ratio < 0.8)   return MOODS[1]   // morning  — Утро в лесу    (low ratio)
  if (ratio < 1.4)   return MOODS[2]   // zenith   — Ясный полдень  (middle ratio)
  return MOODS[0]                       // dusk     — Тёплые сумерки (high ratio)
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
 *
 * ТЗ-2 изменения:
 *   - Слайд 4 («Когда»): убран суффикс «Идеально для создания нужной атмосферы»
 *   - Слайд 5 («Управление»): текст про MoodArc вместо общей фразы про диммер
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
      text: mood.when,
      blocks: null,
    },
    {
      title: 'Управление',
      iconKey: 'gitCompare',
      text: 'Каждое действие двигает точку на дуге настроения. Добавляйте свет — точка идёт по дуге дня. Убирайте — возвращается. Так же работают высота потолка и площадь комнаты.',
      blocks: null,
    },
  ]
}
