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
import type { Mood } from '../data/moods'
import { TEMPLATES, type TemplateRoom } from '../data/templates'
import { decodeState, readHashState } from '../engine/share'

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

const name = ref('Живой Дом')
/* rooms стартует пустым. Заполняется одним из:
 *   - loadTemplate (при выборе шаблона в WelcomeScreen)
 *   - ensureStarterRooms (при «Начать с пустого дома» / возврате после dismiss)
 *   - loadFromHash / deeplinks (shared-сценарии)
 */
const rooms = reactive<Room[]>([])

const picker = ref(false)
const active = ref<string | null>(null)
const firstId = ref<string | null>(null)
const showFirst = ref(false)
const showName = ref(false)
const showStory = ref(false)
const showBuy = ref(false)
const showShare = ref(false)

const fb = ref<string | null>(null)

/* ──────────────── Полноэкранный онбординг настроения ────────────────
 *
 * Когда != null — поверх роутов рендерится MoodDetailModal (5 слайдов).
 * Открывается из RoomDetail (тап на MoodBlock), закрывается «Домой/Пропустить».
 * Должен быть в store (а не локально в RoomDetail), чтобы App.vue мог
 * скрыть StickyBar на время показа — иначе кнопка «Дальше/Пропустить»
 * уезжает под StickyBar и недоступна для тапа.
 */
const showMoodDetail = ref<Mood | null>(null)

/* ──────────────── BuyModal state ──────────────── */

interface DiscountFx {
  roomId: string
  fxIdx: number
}
const discountFx = ref<DiscountFx | null>(null)

/* ──────────────── FxEditor state ──────────────── */

/**
 * Глобальный «открытый светильник». Если не null — поверх всего рендерится
 * страница FxEditor. Открывается из:
 *   - RoomDetail (клик на ZoneCard fixture)
 *   - BuyModal («Настроить»)
 *   - Deeplink #fx=… или ?model=…
 */
const activeFx = ref<{ roomId: string; fxIdx: number } | null>(null)

function openFx(roomId: string, fxIdx: number) {
  activeFx.value = { roomId, fxIdx }
}

function closeFx() {
  activeFx.value = null
}

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

/* ──────────────── Загрузка из URL hash ──────────────── */

/**
 * Читает #s=... из URL и подменяет state, если ссылка валидна.
 * Должно вызываться из App.vue в onMounted — только на клиенте.
 */
function loadFromHash(): boolean {
  const encoded = readHashState()
  if (!encoded) return false
  const decoded = decodeState(encoded, nextId)
  if (!decoded) return false
  if (decoded.name) name.value = decoded.name
  rooms.splice(0, rooms.length, ...decoded.rooms)
  return true
}

/* ──────────────── Welcome screen ──────────────── */

const WELCOME_KEY = 'woodled.welcomeSeen'

/** На клиенте: ?welcome в URL → принудительно показать welcome (для теста). */
function shouldForceWelcome(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('welcome')
}

const welcomeSeen = ref<boolean>(
  typeof window !== 'undefined'
    && !shouldForceWelcome()
    && localStorage.getItem(WELCOME_KEY) === 'true',
)

function dismissWelcome(): void {
  welcomeSeen.value = true
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(WELCOME_KEY, 'true')
    } catch {
      /* private mode / quota exceeded — не критично */
    }
  }
  // «Начать с пустого дома» / ✕ — заполняем стандартными 4 пустыми комнатами,
  // если ничего другого ещё не загружено (loadTemplate сам вызывает dismissWelcome
  // уже после splice — там rooms.length > 0, поэтому ensureStarterRooms ничего
  // не делает).
  ensureStarterRooms()
}

/**
 * Если массив комнат пустой — заполняет стандартным starter-набором.
 * Используется после dismissWelcome и при возврате юзера, который раньше
 * уже видел welcome (welcomeSeen=true в localStorage), но state не сохранился.
 */
function ensureStarterRooms(): void {
  if (rooms.length === 0) {
    rooms.push(...starterRooms())
  }
}

/**
 * Заменяет все комнаты на шаблон.
 * Генерирует новые id, копирует limits из RTS.
 * Также закрывает welcome screen (welcomeSeen=true).
 */
function loadTemplate(templateId: string): void {
  const tpl = TEMPLATES.find((t) => t.id === templateId)
  if (!tpl) return

  const newRooms: Room[] = tpl.rooms.map((tr: TemplateRoom) => {
    const rt = getRT(tr.typeId)
    return {
      id: nextId(),
      typeId: tr.typeId,
      customName: '',
      sizeIndex: tr.sizeIndex,
      customArea: null,
      ceilingH: tr.ceilingH,
      fixtures: tr.fixtures.map((f) => ({
        m: f.m,
        q: f.q,
        wood: f.wood,
        zone: f.zone,
      })),
      furniture: [...tr.furniture],
      limits: { ...rt.limits },
    }
  })

  rooms.splice(0, rooms.length, ...newRooms)
  dismissWelcome()
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
    activeFx,
    showMoodDetail,

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
    openFx,
    closeFx,

    /* toast */
    showFB,
    clearFB,

    /* url state */
    loadFromHash,

    /* welcome / templates */
    welcomeSeen,
    dismissWelcome,
    loadTemplate,
    ensureStarterRooms,
  }
}
