/**
 * configurator.ts — Состояние конфигуратора
 *
 * Источник: woodled-v42.jsx (useState хуки в компоненте App).
 * Экспортирует composable useConfigurator() — singleton для всего приложения.
 *
 * Использование:
 *   const cfg = useConfigurator()
 *   cfg.rooms.value        // массив комнат
 *   cfg.showFB('Привет')   // тост
 *   cfg.add('bedroom')     // добавить комнату
 */

import { ref, computed, reactive } from 'vue'
import { getRT, STARTER_ROOM_TYPES, type Room, type RoomTypeId } from '../data/rooms'
import type { Fixture } from '../data/catalog'

/* ──────────────── Счётчик ID ──────────────── */

let _id = 1
function nextId(): string {
  return `r${_id++}`
}

/* ──────────────── Конструктор комнаты ──────────────── */

function makeRoom(typeId: RoomTypeId): Room {
  const rt = getRT(typeId)
  return {
    id: nextId(),
    typeId,
    customName: '',
    sizeIndex: 1,
    customArea: null,
    ceilingH: 2.7,
    fixtures: [],
    furniture: [],
    limits: { ...rt.limits },
  }
}

/** Стартовый набор: 4 типовые комнаты. */
function starterRooms(): Room[] {
  return STARTER_ROOM_TYPES.map((tid) => makeRoom(tid))
}

/* ──────────────── State (singleton) ──────────────── */

/* Названию и фидбеку хватает ref, но для массивов используем reactive —
   так мутации (push/splice) сразу реактивны без особых правил. */

const name = ref('Дом с WOODLED ROTOR')
const rooms = reactive<Room[]>(starterRooms())

const picker = ref(false)
const active = ref<string | null>(null)
const firstId = ref<string | null>(null)
const showFirst = ref(false)
const showName = ref(false)
const showStory = ref(false)
const showBuy = ref(false)
const showShare = ref(false)

const fb = ref<string | null>(null)

/* ──────────────── BuyModal state ──────────────── */

interface DiscountFx {
  roomId: string
  fxIdx: number
}
const discountFx = ref<DiscountFx | null>(null)

/* ──────────────── Производные значения ──────────────── */

const activeRoom = computed<Room | null>(() => {
  if (!active.value) return null
  return rooms.find((r) => r.id === active.value) ?? null
})

const hasFixtures = computed<boolean>(() =>
  rooms.some((r) => r.fixtures.length > 0),
)

/* ──────────────── Мутации ──────────────── */

function setName(v: string) {
  name.value = v
}

function add(typeId: RoomTypeId): string {
  const nr = makeRoom(typeId)
  rooms.push(nr)
  picker.value = false
  const rt = getRT(typeId)
  showFB(`${rt.name} — добавьте свет`)
  setTimeout(() => {
    active.value = nr.id
  }, 80)
  return nr.id
}

function removeRoom(id: string) {
  const idx = rooms.findIndex((r) => r.id === id)
  if (idx === -1) return
  rooms.splice(idx, 1)
  if (firstId.value === id) firstId.value = null
  if (active.value === id) active.value = null
}

function updateRoom(next: Room) {
  const idx = rooms.findIndex((r) => r.id === next.id)
  if (idx === -1) return
  rooms[idx] = next
}

/**
 * Мутирует поле комнаты, опционально показывает тост.
 */
function patchRoom<K extends keyof Room>(id: string, key: K, value: Room[K], toast?: string) {
  const room = rooms.find((r) => r.id === id)
  if (!room) return
  ;(room as Room)[key] = value
  if (toast) showFB(toast)
}

/**
 * Добавить светильник в конкретную комнату, проверяя лимит зоны.
 */
function addFixture(roomId: string, fx: Fixture): boolean {
  const room = rooms.find((r) => r.id === roomId)
  if (!room) return false

  const rt = getRT(room.typeId)
  const limit = (room.limits ?? rt.limits)?.[fx.zone] ?? 99
  const current = room.fixtures
    .filter((f) => (f.zone ?? 'ceiling') === fx.zone)
    .reduce((s, f) => s + (f.q ?? 1), 0)

  if (current >= limit) return false

  room.fixtures.push(fx)
  return true
}

function removeFixture(roomId: string, idx: number) {
  const room = rooms.find((r) => r.id === roomId)
  if (!room) return
  room.fixtures.splice(idx, 1)
}

function updateFixture(roomId: string, idx: number, next: Fixture) {
  const room = rooms.find((r) => r.id === roomId)
  if (!room) return
  room.fixtures[idx] = next
}

/* ──────────────── Toast ──────────────── */

/**
 * Устанавливает текст тоста. Сам Toast-компонент отвечает за setTimeout → clearFB.
 */
function showFB(msg: string | null) {
  fb.value = msg
}

function clearFB() {
  fb.value = null
}

/* ──────────────── Экспорт singleton ──────────────── */

/**
 * Глобальный store конфигуратора.
 * Все компоненты импортируют `useConfigurator()` и получают одно и то же состояние.
 */
export function useConfigurator() {
  return {
    /* state */
    name,
    rooms,
    picker,
    active,
    firstId,
    showFirst,
    showName,
    showStory,
    showBuy,
    showShare,
    fb,
    discountFx,

    /* computed */
    activeRoom,
    hasFixtures,

    /* mutations */
    setName,
    add,
    removeRoom,
    updateRoom,
    patchRoom,
    addFixture,
    removeFixture,
    updateFixture,

    /* toast */
    showFB,
    clearFB,
  }
}
