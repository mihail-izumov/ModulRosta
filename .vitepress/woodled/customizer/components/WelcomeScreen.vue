<script setup lang="ts">
/**
 * WelcomeScreen.vue — Welcome-страница «7 185 деревьев продолжают светить».
 *
 * Концепция: живая доска почёта сообщества WOODLED.
 * Точные цифры из аналитики (customization_report.pdf): 14 353 товарных
 * позиции из 13 899 заказов 2020-2026, материал определён однозначно
 * у 7 185. «10 000+ покупателей» — округление вниз.
 *
 * Структура (сверху вниз):
 *   1. H1 «7 185 деревьев продолжают светить в ваших домах»
 *   2. Подзаголовок-приглашение (10 000+ домов · посадите свой)
 *   3. HonorBoard — три деревянные сферы (oak/walnut/black) с pulse-glow
 *   4. OnboardingLinkCard «Как рождается свет»
 *   5. SectionTitle «Пространство для света»
 *   6. SubLabel «Любимые места»
 *   7. 3 карточки шаблонов с tint-glass pills комнат
 *   8. «или»
 *   9. EmptyButton «Создать с чистого листа»
 *   10. Логотип WOODLED
 *
 * ВАЖНО про стили: каждая визуальная роль вынесена в отдельную
 * style-функцию (pillStyle / templateCardStyle / etc.) и возвращает
 * единый объект. Это надёжнее spread'а внутри :style — Vue template
 * иногда теряет вложенные свойства при `{...base, ...glass}`.
 */

import { computed } from 'vue'
import { T, WCOL, ROOM_TINTS } from '../theme/tokens'
import { TEMPLATES, type HomeTemplate } from '../data/templates'
import { getRT, type RoomTypeId } from '../data/rooms'
import type { Wood } from '../data/materials'
import { useConfigurator } from '../store/configurator'

const cfg = useConfigurator()

/* ─────────── Аналитика (точные цифры из customization_report.pdf) ─────────── */

const WOOD_COUNTS: Record<Wood, number> = { oak: 4674, walnut: 1960, black: 551 }
const WOOD_TOTAL = 7185
const COMMUNITY_TOTAL = '10 000+'
const WOOD_ORDER: readonly Wood[] = ['oak', 'walnut', 'black'] as const
const WOOD_NAMES: Record<Wood, string> = {
  oak: 'Дуб',
  walnut: 'Орех',
  black: 'Чёрный дуб',
}

const ROOM_DISPLAY_ORDER: readonly RoomTypeId[] = [
  'bedroom', 'living', 'kids', 'office',
  'kitchen', 'hallway', 'bathroom', 'stairs',
] as const

const LOGO_URL = 'https://runscale.ru/woodled/customizer/woodled-logo.svg'

/* ─────────── Производные данные карточек ─────────── */

interface PillRoom {
  type: RoomTypeId
  name: string
  trees: Wood[]
  tint: string
}

interface TplCard {
  id: string
  areaLabel: string
  rooms: PillRoom[]
  woodCounts: Record<Wood, number>
  totalTrees: number
}

function buildCard(tpl: HomeTemplate): TplCard {
  const rooms: PillRoom[] = tpl.rooms
    .map((r): PillRoom => {
      const rt = getRT(r.typeId)
      const trees: Wood[] = []
      for (const fx of r.fixtures) {
        const q = fx.q ?? 1
        for (let i = 0; i < q; i++) trees.push(fx.wood)
      }
      return {
        type: r.typeId,
        name: rt.name,
        trees,
        tint: ROOM_TINTS[r.typeId],
      }
    })
    .sort((a, b) =>
      ROOM_DISPLAY_ORDER.indexOf(a.type) - ROOM_DISPLAY_ORDER.indexOf(b.type),
    )

  const woodCounts: Record<Wood, number> = { oak: 0, walnut: 0, black: 0 }
  for (const r of rooms) for (const w of r.trees) woodCounts[w]++
  const totalTrees =
    woodCounts.oak + woodCounts.walnut + woodCounts.black

  return { id: tpl.id, areaLabel: tpl.areaLabel, rooms, woodCounts, totalTrees }
}

const cards = computed<TplCard[]>(() => TEMPLATES.map(buildCard))

/* ─────────── Handlers ─────────── */

function pickTemplate(id: string) {
  cfg.loadTemplate(id)
}

function startEmpty() {
  cfg.dismissWelcome()
}

/* ─────────── Helpers ─────────── */

function formatNum(n: number): string {
  return n.toLocaleString('ru-RU')
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

/* ─────────── Style-функции (полные объекты, без spread в template) ─────────── */

const TEXT_RGB = hexToRgb(T.text)

/** Карточка-шаблон или OnboardingLinkCard на тёмном фоне. */
function darkGlassCard(extra: Record<string, string | number> = {}) {
  return {
    background: `
      radial-gradient(ellipse 90% 70% at 20% 0%, rgba(255,255,255,0.07), transparent 65%),
      radial-gradient(ellipse 70% 50% at 100% 100%, rgba(255,255,255,0.025), transparent 70%),
      rgba(255,255,255,0.012)
    `,
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 2px 12px rgba(0,0,0,0.25)
    `,
    ...extra,
  }
}

/** HonorBoard — тёплое стекло. */
function honorBoardStyle() {
  const { r, g, b } = TEXT_RGB
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '32px',
    padding: '26px 16px 22px',
    borderRadius: '12px',
    marginBottom: '12px',
    background: `
      radial-gradient(ellipse 80% 70% at 25% 15%, rgba(${r},${g},${b},0.22), transparent 70%),
      radial-gradient(ellipse 60% 50% at 90% 90%, rgba(${r},${g},${b},0.10), transparent 75%),
      rgba(${r},${g},${b},0.04)
    `,
    border: `1px solid rgba(${r},${g},${b},0.18)`,
    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.12),
      0 4px 22px rgba(0,0,0,0.3)
    `,
  }
}

/**
 * Pill комнаты — все стили в одном объекте, БЕЗ spread.
 * Это убирает риск что Vue потеряет background/boxShadow при компиляции
 * `{...base, ...tintGlass(...)}` — что и было причиной плоских pills.
 */
function pillStyle(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '11px',
    padding: '8px 14px 8px 12px',
    borderRadius: '999px',
    lineHeight: '1',
    background: `
      radial-gradient(ellipse 100% 80% at 25% 0%, rgba(${r},${g},${b},0.42), transparent 70%),
      radial-gradient(ellipse 80% 60% at 100% 100%, rgba(${r},${g},${b},0.18), transparent 70%),
      rgba(${r},${g},${b},0.10)
    `,
    border: `1px solid rgba(${r},${g},${b},0.32)`,
    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.15),
      0 1px 4px rgba(0,0,0,0.18)
    `,
  }
}

/** Карточка-шаблон. */
function templateCardStyle() {
  return darkGlassCard({
    width: '100%',
    padding: '0',
    borderRadius: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    marginBottom: '8px',
    fontFamily: 'inherit',
    color: T.text,
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden',
  })
}

/** OnboardingLinkCard. */
function onboardingLinkStyle() {
  return darkGlassCard({
    textDecoration: 'none',
    marginTop: '16px',
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: T.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    boxSizing: 'border-box',
  })
}

/**
 * 3D-сфера дерева 56px — оригинальные стили из welcome-orb.jsx
 * + CSS-variables для per-orb pulse glow в keyframes.
 */
function orbStyle(wood: Wood, delay: number): Record<string, string> {
  const color = WCOL[wood]
  const { r, g, b } = hexToRgb(color)
  return {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: `
      radial-gradient(circle at 32% 26%, rgba(255,255,255,0.55), transparent 42%),
      radial-gradient(circle at 70% 78%, rgba(0,0,0,0.22), transparent 60%),
      ${color}
    `,
    flexShrink: '0',
    display: 'inline-block',
    border: wood === 'black' ? '1px solid rgba(19,17,14,0.55)' : 'none',
    boxShadow: `
      inset 0 -2px 4px rgba(0,0,0,0.22),
      inset 0 2px 2px rgba(255,255,255,0.18),
      0 0 22px rgba(${r},${g},${b},0.45),
      0 0 44px rgba(${r},${g},${b},0.18),
      0 6px 18px rgba(0,0,0,0.45)
    `,
    animation: `orbPulse 4.5s ease-in-out ${delay}s infinite`,
    /* Per-orb glow цвета — keyframes использует var(--orb-glow*) */
    '--orb-glow': `rgba(${r},${g},${b},0.45)`,
    '--orb-glow-soft': `rgba(${r},${g},${b},0.18)`,
    '--orb-glow-peak': `rgba(${r},${g},${b},0.55)`,
    '--orb-glow-peak-soft': `rgba(${r},${g},${b},0.22)`,
  }
}

/** Tree — 18px 3D-сфера с radial highlight и micro-glow цвета породы.
 *  Точная копия из welcome-orb.jsx. */
function treeStyle(wood: Wood, idx: number): Record<string, string | number> {
  const color = WCOL[wood]
  const { r, g, b } = hexToRgb(color)
  return {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: `
      radial-gradient(circle at 32% 28%, rgba(255,255,255,0.45), transparent 50%),
      radial-gradient(circle at 65% 70%, rgba(0,0,0,0.15), transparent 55%),
      ${color}
    `,
    flexShrink: '0',
    display: 'inline-block',
    border: wood === 'black' ? '1px solid rgba(19,17,14,0.5)' : 'none',
    boxShadow: `
      inset 0 -1px 1.5px rgba(0,0,0,0.18),
      inset 0 1px 1px rgba(255,255,255,0.15),
      0 0 8px rgba(${r},${g},${b},0.35),
      0 1px 3px rgba(0,0,0,0.35)
    `,
    marginLeft: idx === 0 ? '0' : '-5px',
    zIndex: 100 - idx,
    position: 'relative',
  }
}

const ORB_DELAYS: Record<Wood, number> = { oak: 0, walnut: 1.5, black: 3 }
const SECTION_LABEL = 'Какой размер ближе?'
</script>

<template>
  <div
    :style="{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '32px 16px 32px',
      fontFamily: `'Segoe UI', system-ui, sans-serif`,
      color: T.text,
      background: T.bg,
      minHeight: '100vh',
      boxSizing: 'border-box',
    }"
  >
    <!-- ═══ Логотип WOODLED — наверху ═══ -->
    <div
      :style="{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'center',
        opacity: 0.55,
      }"
    >
      <div
        :style="{
          width: '130px',
          height: '22px',
          background: T.neutral,
          maskImage: `url(${LOGO_URL})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: `url(${LOGO_URL})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }"
      />
    </div>

    <!-- ═══ H1 ═══ -->
    <div
      :style="{
        textAlign: 'center',
        fontSize: '22px',
        fontWeight: 700,
        color: T.text,
        marginBottom: '10px',
        lineHeight: 1.25,
      }"
    >
      {{ formatNum(WOOD_TOTAL) }} деревьев<br />продолжают светить<br />в&nbsp;ваших домах
    </div>

    <!-- ═══ Подзаголовок-приглашение ═══ -->
    <div
      :style="{
        textAlign: 'center',
        fontSize: '13px',
        color: T.textSec,
        lineHeight: 1.55,
        marginBottom: '20px',
        maxWidth: '320px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }"
    >
      Каждый покупатель WOODLED сажает своё дерево.
      <span :style="{ color: T.text, fontWeight: 600 }">
        Присоединяйтесь — посадите свой.
      </span>
    </div>

    <!-- ═══ HonorBoard — три деревянные сферы с цифрами ═══ -->
    <div :style="honorBoardStyle()">
      <div
        v-for="w in WOOD_ORDER"
        :key="w"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }"
      >
        <span :style="orbStyle(w, ORB_DELAYS[w])" />
        <div
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }"
        >
          <span
            :style="{
              fontSize: '20px',
              fontWeight: 700,
              color: T.text,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }"
          >
            {{ formatNum(WOOD_COUNTS[w]) }}
          </span>
          <span
            :style="{
              fontSize: '11px',
              fontWeight: 600,
              color: T.textSec,
              textAlign: 'center',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }"
          >
            {{ WOOD_NAMES[w] }}
          </span>
        </div>
      </div>
    </div>

    <!-- ═══ OnboardingLinkCard «Как рождается свет» — открываем в том же окне ═══ -->
    <a
      href="https://runscale.ru/woodled/onboarding"
      :style="onboardingLinkStyle()"
    >
      <div :style="{ flex: 1 }">
        <div
          :style="{
            fontSize: '13px',
            fontWeight: 700,
            color: T.text,
            marginBottom: '2px',
            lineHeight: 1.2,
          }"
        >
          Как рождается свет
        </div>
        <div :style="{ fontSize: '11px', color: T.textSec, lineHeight: 1.45 }">
          4 главы — от ламели до теней на стене
        </div>
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="T.textSec"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="{ flexShrink: 0 }"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>

    <!-- ═══ SectionTitle ═══ -->
    <div
      :style="{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 700,
        color: T.text,
        marginTop: '32px',
        marginBottom: '8px',
        lineHeight: 1.25,
      }"
    >
      Пространство для света
    </div>

    <!-- ═══ SectionSubtitle ═══ -->
    <div
      :style="{
        textAlign: 'center',
        fontSize: '13px',
        color: T.textSec,
        lineHeight: 1.55,
        marginBottom: '16px',
        maxWidth: '320px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }"
    >
      В тонкой ламели WOODLED остаётся свет настоящего дерева.
      Выберите ближайший формат — настроите под себя на&nbsp;следующем шаге.
    </div>

    <!-- ═══ SubLabel ═══ -->
    <div
      :style="{
        fontSize: '10px',
        fontWeight: 700,
        color: T.textDim,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '12px',
        textAlign: 'center',
      }"
    >
      {{ SECTION_LABEL }}
    </div>

    <!-- ═══ Карточки шаблонов ═══ -->
    <div :style="{ display: 'flex', flexDirection: 'column' }">
      <button
        v-for="c in cards"
        :key="c.id"
        :style="templateCardStyle()"
        @click="pickTemplate(c.id)"
      >
        <div
          :style="{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: 0,
            padding: '14px',
          }"
        >
          <!-- Метраж + капсула с подсчётом пород -->
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }"
          >
            <div
              :style="{
                fontSize: '15px',
                fontWeight: 700,
                color: T.text,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }"
            >
              {{ c.areaLabel }}
            </div>
            <div
              :style="{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 4px',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '999px',
                lineHeight: 1,
                background: 'rgba(255,255,255,0.025)',
              }"
            >
              <span
                :style="{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 7px',
                  background: T.text,
                  color: T.bg,
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }"
              >
                {{ c.totalTrees }}
              </span>
              <span
                v-for="w in WOOD_ORDER.filter((x) => c.woodCounts[x] > 0)"
                :key="w"
                :style="{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  lineHeight: 1,
                }"
              >
                <span
                  :style="{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: WCOL[w],
                    border: w === 'black' ? `1px solid ${T.textDim}` : 'none',
                  }"
                />
                <span
                  :style="{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: T.text,
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }"
                >
                  {{ c.woodCounts[w] }}
                </span>
              </span>
            </div>
          </div>

          <!-- Pills комнат с tint glass + tree-кружки -->
          <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '6px' }">
            <div
              v-for="(r, ri) in c.rooms"
              :key="ri"
              :style="pillStyle(r.tint)"
            >
              <span
                :style="{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: T.text,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }"
              >
                {{ r.name }}
              </span>
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1,
                  paddingLeft: '3px',
                }"
              >
                <span
                  v-for="(w, ti) in r.trees"
                  :key="ti"
                  :style="treeStyle(w, ti)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Стрелка-affordance -->
        <div
          :style="{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            paddingLeft: '16px',
            paddingRight: '16px',
          }"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="T.textSec"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>
    </div>

    <!-- ═══ Симметричный «или» ═══ -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '16px 0',
      }"
    >
      <div :style="{ flex: 1, height: '1px', background: T.border }" />
      <span
        :style="{
          fontSize: '10px',
          color: T.textDim,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
        }"
      >
        или
      </span>
      <div :style="{ flex: 1, height: '1px', background: T.border }" />
    </div>

    <!-- ═══ EmptyButton — primary CTA ═══ -->
    <button
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '16px',
        background: T.text,
        color: T.bg,
        border: `1px solid ${T.text}`,
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.4),
          0 4px 14px rgba(0,0,0,0.25)
        `,
      }"
      @click="startEmpty"
    >
      Создать с чистого листа
    </button>
  </div>
</template>

<style>
/* Pulse-анимация деревянных сфер. Box-shadow с CSS-variables: каждая
   сфера передаёт через inline style свой цвет породы (--orb-glow и
   --orb-glow-peak), поэтому keyframes общая, но glow разный. */
@keyframes orbPulse {
  0%,
  100% {
    box-shadow:
      inset 0 -2px 4px rgba(0, 0, 0, 0.22),
      inset 0 2px 2px rgba(255, 255, 255, 0.18),
      0 0 18px var(--orb-glow, rgba(196, 164, 108, 0.35)),
      0 0 36px var(--orb-glow-soft, rgba(196, 164, 108, 0.12)),
      0 6px 18px rgba(0, 0, 0, 0.45);
  }
  50% {
    box-shadow:
      inset 0 -2px 4px rgba(0, 0, 0, 0.22),
      inset 0 2px 2px rgba(255, 255, 255, 0.18),
      0 0 28px var(--orb-glow-peak, rgba(196, 164, 108, 0.55)),
      0 0 56px var(--orb-glow-peak-soft, rgba(196, 164, 108, 0.22)),
      0 6px 18px rgba(0, 0, 0, 0.45);
  }
}
</style>
