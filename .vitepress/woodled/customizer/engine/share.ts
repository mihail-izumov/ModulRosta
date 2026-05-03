/**
 * share.ts — Сериализация конфигурации в URL-hash для шаринга.
 *
 * Формат: https://site/customizer#s=<base64url>
 * Где base64url — URL-safe base64 от JSON с минимальным набором полей.
 *
 * Минимизируем имена полей (t вместо typeId и т.п.) — ссылка короче.
 * Работает без бэкенда, без истории, без сторонних сервисов.
 */

import type { Room } from '../data/rooms'
import type { Fixture } from '../data/catalog'

/* ──────────────── Сериализация ──────────────── */

/**
 * Компактная запись fixture: опциональные поля опускаются.
 */
interface PackedFixture {
  m: string
  q?: number
  w?: string     // wood
  z?: string     // zone
  l?: number     // lamps override
  o?: Partial<{  // options (только изменённые относительно DEF_OPT — ужмётся ещё)
    bowl: string
    mount: string
    wire: string
    btemp: string
    diffuser: boolean
    moisture: boolean
    bulbs: boolean
  }>
  d?: string[]   // done — выполненные шаги чек-листа
}

interface PackedRoom {
  t: string            // typeId
  n?: string           // customName
  si?: number          // sizeIndex (если !==1)
  ca?: number          // customArea
  h?: number           // ceilingH (если !==2.7)
  fx?: PackedFixture[] // fixtures
  fu?: string[]        // furniture ids
  lim?: Record<string, number> // limits
}

interface PackedState {
  n?: string           // name
  r: PackedRoom[]      // rooms
}

function packFixture(fx: Fixture): PackedFixture {
  const out: PackedFixture = { m: fx.m }
  if ((fx.q ?? 1) !== 1) out.q = fx.q
  if (fx.wood && fx.wood !== 'oak') out.w = fx.wood
  if (fx.zone && fx.zone !== 'ceiling') out.z = fx.zone
  if (fx.l != null) out.l = fx.l
  if (fx.opts && Object.keys(fx.opts).length > 0) out.o = fx.opts
  if (fx.done && fx.done.length > 0) out.d = fx.done
  return out
}

function unpackFixture(p: PackedFixture): Fixture {
  return {
    m: p.m as Fixture['m'],
    q: p.q ?? 1,
    wood: (p.w ?? 'oak') as Fixture['wood'],
    zone: (p.z ?? 'ceiling') as Fixture['zone'],
    l: p.l,
    opts: p.o,
    done: p.d,
  }
}

function packRoom(r: Room): PackedRoom {
  const out: PackedRoom = { t: r.typeId }
  if (r.customName) out.n = r.customName
  if (r.sizeIndex !== 1) out.si = r.sizeIndex
  if (r.customArea != null) out.ca = r.customArea
  if (r.ceilingH !== 2.7) out.h = r.ceilingH
  if (r.fixtures.length > 0) out.fx = r.fixtures.map(packFixture)
  if (r.furniture.length > 0) out.fu = [...r.furniture]
  if (r.limits && Object.keys(r.limits).length > 0) {
    out.lim = { ...r.limits } as Record<string, number>
  }
  return out
}

function unpackRoom(p: PackedRoom, id: string): Room {
  return {
    id,
    typeId: p.t as Room['typeId'],
    customName: p.n ?? '',
    sizeIndex: ((p.si ?? 1) as 0 | 1 | 2 | 3),
    customArea: p.ca ?? null,
    ceilingH: p.h ?? 2.7,
    fixtures: (p.fx ?? []).map(unpackFixture),
    furniture: (p.fu ?? []) as Room['furniture'],
    limits: (p.lim ?? {}) as Room['limits'],
  }
}

/* ──────────────── URL-safe base64 ──────────────── */

/** atob/btoa работают с латиницей; сперва encode/decode UTF-8 через URI. */
function utf8ToBase64(s: string): string {
  // encodeURIComponent → %XX; затем мы декодируем каждый %XX в байт.
  const utf8 = encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  )
  return btoa(utf8)
}

function base64ToUtf8(b: string): string {
  const utf8 = atob(b)
  let hex = ''
  for (let i = 0; i < utf8.length; i++) {
    const c = utf8.charCodeAt(i).toString(16).padStart(2, '0')
    hex += '%' + c
  }
  return decodeURIComponent(hex)
}

function toUrlSafe(b: string): string {
  return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromUrlSafe(b: string): string {
  let s = b.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return s
}

/* ──────────────── Публичный API ──────────────── */

/**
 * Сериализует state в компактную строку для URL.
 */
export function encodeState(name: string, rooms: Room[]): string {
  const packed: PackedState = {
    r: rooms.map(packRoom),
  }
  if (name && name !== 'Живой Дом') packed.n = name
  const json = JSON.stringify(packed)
  return toUrlSafe(utf8ToBase64(json))
}

/**
 * Декодирует строку обратно в state.
 * Генерирует id'шники через функцию nextId (store передаёт свою).
 * Возвращает null при любой ошибке разбора.
 */
export function decodeState(
  encoded: string,
  nextId: () => string,
): { name: string | null; rooms: Room[] } | null {
  try {
    const json = base64ToUtf8(fromUrlSafe(encoded))
    const packed = JSON.parse(json) as PackedState
    if (!packed || !Array.isArray(packed.r)) return null
    return {
      name: packed.n ?? null,
      rooms: packed.r.map((p) => unpackRoom(p, nextId())),
    }
  } catch {
    return null
  }
}

/**
 * Формирует полную ссылку с текущим origin + pathname + hash.
 */
export function buildShareUrl(name: string, rooms: Room[]): string {
  const enc = encodeState(name, rooms)
  const base = window.location.origin + window.location.pathname
  return `${base}#s=${enc}`
}

/**
 * Читает hash из window.location — возвращает encoded-часть или null.
 */
export function readHashState(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash
  if (!hash) return null
  const match = hash.match(/[#&]s=([^&]+)/)
  return match ? match[1] : null
}

/* ──────────────── Fixture sharing (#fx=...) ──────────────── */

/**
 * Кодирует один светильник в строку для URL.
 */
export function encodeFixture(fx: Fixture): string {
  const packed = packFixture(fx)
  const json = JSON.stringify(packed)
  return toUrlSafe(utf8ToBase64(json))
}

/**
 * Декодирует строку обратно в Fixture.
 */
export function decodeFixture(encoded: string): Fixture | null {
  try {
    const json = base64ToUtf8(fromUrlSafe(encoded))
    const packed = JSON.parse(json)
    return unpackFixture(packed)
  } catch {
    return null
  }
}

/**
 * Формирует ссылку на один светильник.
 */
export function buildFixtureShareUrl(fx: Fixture): string {
  const enc = encodeFixture(fx)
  const base = window.location.origin + window.location.pathname
  return `${base}#fx=${enc}`
}

/**
 * Читает #fx=... из URL.
 */
export function readHashFixture(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash
  if (!hash) return null
  const match = hash.match(/[#&]fx=([^&]+)/)
  return match ? match[1] : null
}
