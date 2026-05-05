<script setup lang="ts">
/**
 * WelcomeScreen.vue — Первая страница «План вашего леса».
 *
 * Концепция: garden planner вместо аналитики.
 * Каждая карточка шаблона = мини-схема дома с пропорциональными
 * блоками комнат, как сетка грядок в garden planning app.
 *
 * Структура карточки:
 *
 *   ┌────┐  [───Гостиная──][──Спальня──][Дет]   ← значимые комнаты
 *   │~65 │   ●●●●           ●●            ●●     (ширина пропорциональна
 *   └────┘   12–20          8–14          5–10    площади)
 *           + Кухня ● · Коридор ●●               ← сервис мелким текстом
 *
 * Принципы:
 *   1. Значимые комнаты (Спальня, Гостиная, Детская, Кабинет) —
 *      крупные плашки в ROOM_TINTS, ширина по площади. Внутри
 *      название + кружочки деревьев (oak/walnut/black).
 *
 *   2. Сервисные (Кухня, Коридор, Ванная) — компактная строка
 *      снизу. Это снимает повторение «Кухня · Коридор» в каждой
 *      карточке, освобождает место для значимых комнат.
 *
 *   3. Под значимыми комнатами — диапазон м² мелким текстом
 *      (rt.ranges[sizeIndex]). Юзер видит «откуда складывается»
 *      общая площадь шаблона.
 *
 *   4. Все 3 шаблона помещаются на одном экране мобильного:
 *      ~110px на карточку × 3 + заголовок + кнопка пустого ≈ 600px.
 *
 *   5. Бренд WOODLED намеренно убран — на первом экране это
 *      мостик из онбординга, не приложение.
 */

import { computed } from 'vue'
import { T, ROOM_TINTS, WCOL } from '../theme/tokens'
import { TEMPLATES, type HomeTemplate, type TemplateRoom } from '../data/templates'
import { getRT, type RoomTypeId } from '../data/rooms'
import type { Wood } from '../data/materials'
import { useConfigurator } from '../store/configurator'

const cfg = useConfigurator()

/* ────────── Категории комнат ────────── */

/** Значимые жилые комнаты — отображаются крупными плашками. */
const MAIN_ROOMS: ReadonlySet<RoomTypeId> = new Set([
  'living',
  'bedroom',
  'kids',
  'office',
])

/** Сервисные/общие — отображаются мелкой строкой снизу. */
function isMain(typeId: RoomTypeId): boolean {
  return MAIN_ROOMS.has(typeId)
}

/* ────────── Структуры данных ────────── */

interface MainRoomBlock {
  name: string
  tint: string
  range: string
  sizeArea: number
  trees: string[]
}

interface ServiceRoomBlock {
  name: string
  trees: string[]
}

interface TplCard {
  id: string
  areaLabel: string
  mainRooms: MainRoomBlock[]
  serviceRooms: ServiceRoomBlock[]
}

/* ────────── Helpers ────────── */

function collectTrees(tr: TemplateRoom): string[] {
  const trees: string[] = []
  for (const fx of tr.fixtures) {
    const wood: Wood = fx.wood
    const color = WCOL[wood]
    const q = fx.q ?? 1
    for (let i = 0; i < q; i++) trees.push(color)
  }
  return trees
}

function buildCard(tpl: HomeTemplate): TplCard {
  const mainRooms: MainRoomBlock[] = []
  const serviceRooms: ServiceRoomBlock[] = []

  for (const tr of tpl.rooms) {
    const rt = getRT(tr.typeId as RoomTypeId)
    const sizeIdx = (tr.sizeIndex ?? 1) as 0 | 1 | 2
    const trees = collectTrees(tr)

    if (isMain(tr.typeId as RoomTypeId)) {
      mainRooms.push({
        name: rt.name,
        tint: ROOM_TINTS[tr.typeId as RoomTypeId],
        range: rt.ranges[sizeIdx],
        sizeArea: rt.sizes[sizeIdx],
        trees,
      })
    } else {
      serviceRooms.push({
        name: rt.name,
        trees,
      })
    }
  }

  return {
    id: tpl.id,
    areaLabel: tpl.areaLabel,
    mainRooms,
    serviceRooms,
  }
}

const cards = computed<TplCard[]>(() =>
  TEMPLATES.map(buildCard),
)

/** Сумма «единиц» по основным комнатам — для расчёта flex-basis. */
function mainTotal(card: TplCard): number {
  return card.mainRooms.reduce((s, r) => s + r.sizeArea, 0) || 1
}

function pickTemplate(id: string) {
  cfg.loadTemplate(id)
}

function startEmpty() {
  cfg.dismissWelcome()
}
</script>

<template>
  <div
    :style="{
      maxWidth: '560px',
      margin: '0 auto',
      padding: '32px 16px 20px',
      fontFamily: `'Segoe UI', system-ui, sans-serif`,
      color: T.text,
      background: T.bg,
      minHeight: '100vh',
      boxSizing: 'border-box',
    }"
  >
    <!-- Заголовок-мостик из онбординга -->
    <div
      :style="{
        fontSize: '24px',
        fontWeight: 700,
        color: T.text,
        marginBottom: '8px',
        lineHeight: 1.2,
      }"
    >
      Спроектируйте свой лес
    </div>
    <div
      :style="{
        fontSize: '13px',
        color: T.textSec,
        lineHeight: 1.5,
        marginBottom: '20px',
        maxWidth: '480px',
      }"
    >
      Каждая комната — своё дерево. Выберите формат — мы расставим свет
      по реальной статистике WOODLED. Дальше всё под себя.
    </div>

    <!-- Карточки шаблонов -->
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '10px',
      }"
    >
      <button
        v-for="c in cards"
        :key="c.id"
        :style="{
          display: 'flex',
          alignItems: 'stretch',
          gap: '12px',
          width: '100%',
          padding: '12px',
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          cursor: 'pointer',
          textAlign: 'left',
          color: T.text,
          fontFamily: 'inherit',
        }"
        @click="pickTemplate(c.id)"
      >
        <!-- Слева: плашка с метражом -->
        <div
          :style="{
            flexShrink: 0,
            width: '64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: T.neutral + '15',
            border: `1px solid ${T.neutral}28`,
            borderRadius: '8px',
            padding: '8px 4px',
          }"
        >
          <div
            :style="{
              fontSize: '15px',
              fontWeight: 700,
              color: T.neutral,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }"
          >
            {{ c.areaLabel }}
          </div>
        </div>

        <!-- Правая часть -->
        <div
          :style="{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '6px',
            minWidth: 0,
          }"
        >
          <!-- Лента значимых комнат — пропорциональные ширины -->
          <div
            :style="{
              display: 'flex',
              gap: '4px',
              minHeight: '54px',
            }"
          >
            <div
              v-for="(r, ri) in c.mainRooms"
              :key="ri"
              :style="{
                flex: r.sizeArea,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: r.tint,
                borderRadius: '6px',
                padding: '6px 8px',
                gap: '4px',
                overflow: 'hidden',
              }"
            >
              <!-- Название -->
              <div
                :style="{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: T.bg,
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }"
              >
                {{ r.name }}
              </div>
              <!-- Деревья -->
              <div
                :style="{
                  display: 'flex',
                  gap: '3px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }"
              >
                <span
                  v-for="(treeColor, ti) in r.trees"
                  :key="ti"
                  :style="{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: treeColor,
                    border: treeColor === WCOL.black
                      ? `1px solid rgba(19,17,14,0.4)`
                      : 'none',
                    flexShrink: 0,
                  }"
                />
              </div>
              <!-- Диапазон м² -->
              <div
                :style="{
                  fontSize: '9px',
                  color: 'rgba(19,17,14,0.55)',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }"
              >
                {{ r.range }} м²
              </div>
            </div>
          </div>

          <!-- Сервисные комнаты — компактная строка -->
          <div
            v-if="c.serviceRooms.length > 0"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              color: T.textDim,
              flexWrap: 'wrap',
            }"
          >
            <span
              v-for="(r, ri) in c.serviceRooms"
              :key="ri"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }"
            >
              <span v-if="ri > 0" :style="{ color: T.border }">·</span>
              <span>{{ r.name }}</span>
              <span
                :style="{
                  display: 'flex',
                  gap: '2px',
                }"
              >
                <span
                  v-for="(treeColor, ti) in r.trees"
                  :key="ti"
                  :style="{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: treeColor,
                    flexShrink: 0,
                  }"
                />
              </span>
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- Начать с пустого дома -->
    <button
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '14px',
        background: T.cardAlt,
        border: `1px solid ${T.border}`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        color: T.text,
        fontFamily: 'inherit',
      }"
      @click="startEmpty"
    >
      Начать с пустого дома
    </button>

    <!-- Легенда деревьев — компактная -->
    <div
      :style="{
        marginTop: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        fontSize: '10px',
        color: T.textDim,
      }"
    >
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span
          :style="{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: WCOL.oak,
          }"
        />
        Дуб
      </span>
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span
          :style="{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: WCOL.walnut,
          }"
        />
        Орех
      </span>
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span
          :style="{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: WCOL.black,
            border: `1px solid ${T.textDim}`,
          }"
        />
        Чёрный
      </span>
    </div>
  </div>
</template>
