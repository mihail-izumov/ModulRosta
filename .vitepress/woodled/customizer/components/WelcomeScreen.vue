<script setup lang="ts">
/**
 * WelcomeScreen.vue — Welcome-страница «7 185 деревьев продолжают светить».
 *
 * batch11 #8 v5:
 *   - SVG-иконки листьев: height 90px (oak/walnut), 76px (black),
 *     center + 9px right, 0px vertical.
 *   - «Как рождается свет»: title 15px/600, subtitle 13px,
 *     убрано «4 главы —».
 */

import { computed } from 'vue'
import { T, WCOL, ROOM_TINTS } from '../theme/tokens'
import { TEMPLATES, type HomeTemplate } from '../data/templates'
import { getRT, type RoomTypeId } from '../data/rooms'
import type { Wood } from '../data/materials'
import { useConfigurator } from '../store/configurator'
import { pillStyle, treeStyle } from '../theme/styles'

const cfg = useConfigurator()

const WOOD_COUNTS: Record<Wood, number> = { oak: 4674, walnut: 1960, black: 551 }
const WOOD_TOTAL = 7185
const WOOD_ORDER: readonly Wood[] = ['oak', 'walnut', 'black'] as const
const WOOD_NAMES: Record<Wood, string> = { oak: 'Дуб', walnut: 'Орех', black: 'Чёрный дуб' }

const LEAF_ICONS: Record<Wood, string> = {
  oak: '/woodled/customizer/oak-sphere.svg',
  walnut: '/woodled/customizer/walnut-sphere.svg',
  black: '/woodled/customizer/black-oak-sphere.svg',
}
/** batch11 #8 v5: per-icon height — black oak визуально крупнее, компенсируем */
const LEAF_H: Record<Wood, number> = { oak: 90, walnut: 90, black: 76 }

const ROOM_DISPLAY_ORDER: readonly RoomTypeId[] = ['bedroom', 'living', 'kids', 'office', 'kitchen', 'hallway', 'bathroom', 'stairs'] as const
const LOGO_URL = 'https://runscale.ru/woodled/customizer/woodled-logo.svg'

interface PillRoom { type: RoomTypeId; name: string; trees: Wood[]; tint: string }
interface TplCard { id: string; areaLabel: string; rooms: PillRoom[]; woodCounts: Record<Wood, number>; totalTrees: number }

function buildCard(tpl: HomeTemplate): TplCard {
  const rooms: PillRoom[] = tpl.rooms
    .map((r): PillRoom => { const rt = getRT(r.typeId); const trees: Wood[] = []; for (const fx of r.fixtures) { const q = fx.q ?? 1; for (let i = 0; i < q; i++) trees.push(fx.wood) }; return { type: r.typeId, name: rt.name, trees, tint: ROOM_TINTS[r.typeId] } })
    .sort((a, b) => ROOM_DISPLAY_ORDER.indexOf(a.type) - ROOM_DISPLAY_ORDER.indexOf(b.type))
  const woodCounts: Record<Wood, number> = { oak: 0, walnut: 0, black: 0 }; for (const r of rooms) for (const w of r.trees) woodCounts[w]++
  return { id: tpl.id, areaLabel: tpl.areaLabel, rooms, woodCounts, totalTrees: woodCounts.oak + woodCounts.walnut + woodCounts.black }
}
const cards = computed<TplCard[]>(() => TEMPLATES.map(buildCard))

function pickTemplate(id: string) { cfg.loadTemplate(id) }
function startEmpty() { cfg.dismissWelcome() }
function formatNum(n: number): string { return n.toLocaleString('ru-RU') }
function hexToRgb(hex: string) { return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) } }
const TEXT_RGB = hexToRgb(T.text)

function darkGlassCard(extra: Record<string, string | number> = {}) { return { background: `radial-gradient(ellipse 90% 70% at 20% 0%, rgba(255,255,255,0.07), transparent 65%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(255,255,255,0.025), transparent 70%), rgba(255,255,255,0.012)`, border: '1px solid rgba(255,255,255,0.07)', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.25)`, ...extra } }
function honorBoardStyle() { const { r, g, b } = TEXT_RGB; return { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '32px', padding: '26px 16px 22px', borderRadius: '12px', marginBottom: '12px', background: `radial-gradient(ellipse 80% 70% at 25% 15%, rgba(${r},${g},${b},0.22), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(${r},${g},${b},0.10), transparent 75%), rgba(${r},${g},${b},0.04)`, border: `1px solid rgba(${r},${g},${b},0.18)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 22px rgba(0,0,0,0.3)` } }
function templateCardStyle() { return darkGlassCard({ width: '100%', padding: '0', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', marginBottom: '8px', fontFamily: 'inherit', color: T.text, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }) }
function onboardingLinkStyle() { return darkGlassCard({ textDecoration: 'none', marginTop: '16px', width: '100%', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', boxSizing: 'border-box' }) }

function orbStyle(wood: Wood, delay: number): Record<string, string> {
  const color = WCOL[wood]; const { r, g, b } = hexToRgb(color)
  return { width: '56px', height: '56px', borderRadius: '50%', background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(circle at 70% 78%, rgba(0,0,0,0.22), transparent 60%), ${color}`, flexShrink: '0', display: 'inline-block', border: wood === 'black' ? '1px solid rgba(19,17,14,0.55)' : 'none', boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.22), inset 0 2px 2px rgba(255,255,255,0.18), 0 0 22px rgba(${r},${g},${b},0.45), 0 0 44px rgba(${r},${g},${b},0.18), 0 6px 18px rgba(0,0,0,0.45)`, animation: `orbPulse 4.5s ease-in-out ${delay}s infinite`, '--orb-glow': `rgba(${r},${g},${b},0.45)`, '--orb-glow-soft': `rgba(${r},${g},${b},0.18)`, '--orb-glow-peak': `rgba(${r},${g},${b},0.55)`, '--orb-glow-peak-soft': `rgba(${r},${g},${b},0.22)` }
}
const ORB_DELAYS: Record<Wood, number> = { oak: 0, walnut: 1.5, black: 3 }
const SECTION_LABEL = 'Какой размер ближе?'
</script>

<template>
  <div :style="{ maxWidth: '480px', margin: '0 auto', padding: '32px 16px 96px', fontFamily: `'Segoe UI', system-ui, sans-serif`, color: T.text, background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }">
    <div :style="{ marginBottom: '24px', display: 'flex', justifyContent: 'center', opacity: 0.55 }">
      <div :style="{ width: '130px', height: '22px', background: T.neutral, maskImage: `url(${LOGO_URL})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: `url(${LOGO_URL})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }" />
    </div>

    <div :style="{ textAlign: 'center', fontSize: '22px', fontWeight: 700, color: T.text, marginBottom: '10px', lineHeight: 1.25 }">{{ formatNum(WOOD_TOTAL) }} деревьев<br />продолжают светить<br />в&nbsp;ваших домах</div>
    <div :style="{ textAlign: 'center', fontSize: '13px', color: T.textSec, lineHeight: 1.55, marginBottom: '20px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }">Каждое дерево здесь уже светит в чьём-то доме. <span :style="{ color: '#fff', fontWeight: 700 }">Делитесь с друзьями. Возвращайтесь когда удобно.</span></div>

    <!-- Блок с тремя шарами + иконки листьев -->
    <div :style="honorBoardStyle()">
      <div v-for="w in WOOD_ORDER" :key="w" :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }">
        <!-- batch11 #8 v5: шар + SVG-иконка, height по LEAF_H, offset +9px right -->
        <div :style="{ position: 'relative', width: '56px', height: '56px', flexShrink: 0, overflow: 'visible' }">
          <span :style="orbStyle(w, ORB_DELAYS[w])" />
          <img :src="LEAF_ICONS[w]" alt="" :style="{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(calc(-50% + 9px), -50%)', height: LEAF_H[w] + 'px', width: 'auto', pointerEvents: 'none' }" />
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }">
          <span :style="{ fontSize: '20px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }">{{ formatNum(WOOD_COUNTS[w]) }}</span>
          <span :style="{ fontSize: '11px', fontWeight: 600, color: T.textSec, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }">{{ WOOD_NAMES[w] }}</span>
        </div>
      </div>
    </div>

    <!-- batch11 #8 v5: title 15/600, subtitle 13, убрано «4 главы —» -->
    <a href="https://runscale.ru/woodled/onboarding" :style="onboardingLinkStyle()">
      <div :style="{ flex: 1 }">
        <div :style="{ fontSize: '15px', fontWeight: 600, color: T.text, marginBottom: '2px', lineHeight: 1.2 }">Как рождается свет</div>
        <div :style="{ fontSize: '13px', color: T.textSec, lineHeight: 1.45 }">От ламели до теней на стене</div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="T.textSec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ flexShrink: 0 }"><polyline points="9 18 15 12 9 6" /></svg>
    </a>

    <div :style="{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: T.text, marginTop: '32px', marginBottom: '8px', lineHeight: 1.25 }">Пространство для света</div>
    <div :style="{ textAlign: 'center', fontSize: '13px', color: T.textSec, lineHeight: 1.55, marginBottom: '16px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }">Подобрали для вас самые частые сочетания параметров светильников и их расположение в доме. Начните с выбора площади – остальное настроете под себя дальше.</div>
    <div :style="{ fontSize: '10px', fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', textAlign: 'center' }">{{ SECTION_LABEL }}</div>

    <div :style="{ display: 'flex', flexDirection: 'column' }">
      <button v-for="c in cards" :key="c.id" :style="templateCardStyle()" @click="pickTemplate(c.id)">
        <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0, padding: '14px' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }">
            <div :style="{ fontSize: '15px', fontWeight: 700, color: T.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }">{{ c.areaLabel }}</div>
            <div :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px 4px 4px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '999px', lineHeight: 1, background: 'rgba(255,255,255,0.025)' }">
              <span :style="{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '20px', height: '20px', padding: '0 7px', background: T.text, color: T.bg, borderRadius: '999px', fontSize: '11px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }">{{ c.totalTrees }}</span>
              <span v-for="ww in WOOD_ORDER.filter((x) => c.woodCounts[x] > 0)" :key="ww" :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', lineHeight: 1 }">
                <span :style="{ width: '9px', height: '9px', borderRadius: '50%', background: WCOL[ww], border: ww === 'black' ? `1px solid ${T.textDim}` : 'none' }" />
                <span :style="{ fontSize: '10px', fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }">{{ c.woodCounts[ww] }}</span>
              </span>
            </div>
          </div>
          <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '6px' }">
            <div v-for="(r, ri) in c.rooms" :key="ri" :style="pillStyle(r.tint)">
              <span :style="{ fontSize: '11px', fontWeight: 700, color: T.text, whiteSpace: 'nowrap', lineHeight: 1 }">{{ r.name }}</span>
              <div :style="{ display: 'flex', alignItems: 'center', lineHeight: 1, paddingLeft: '3px' }"><span v-for="(wt, ti) in r.trees" :key="ti" :style="treeStyle(wt, ti)" /></div>
            </div>
          </div>
        </div>
        <div :style="{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '16px', paddingRight: '16px' }">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="T.textSec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
      </button>
    </div>

    <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }">
      <div :style="{ flex: 1, height: '1px', background: T.border }" />
      <span :style="{ fontSize: '10px', color: T.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }">или</span>
      <div :style="{ flex: 1, height: '1px', background: T.border }" />
    </div>

    <button :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '16px', background: T.text, color: T.bg, border: `1px solid ${T.text}`, borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 14px rgba(0,0,0,0.25)' }" @click="startEmpty">
      <div class="welcome-rotor" :style="{ '--rc': T.bg }" aria-hidden="true"><div v-for="i in 10" :key="i" class="welcome-rotor-l" :style="{ '--rot': ((i - 1) / 10 * 360) + 'deg', animationDelay: ((i - 1) * 30) + 'ms' }" /></div>
      Создать с чистого листа
    </button>
  </div>
</template>

<style>
@keyframes orbPulse {
  0%, 100% { box-shadow: inset 0 -2px 4px rgba(0,0,0,0.22), inset 0 2px 2px rgba(255,255,255,0.18), 0 0 18px var(--orb-glow, rgba(196,164,108,0.35)), 0 0 36px var(--orb-glow-soft, rgba(196,164,108,0.12)), 0 6px 18px rgba(0,0,0,0.45); }
  50% { box-shadow: inset 0 -2px 4px rgba(0,0,0,0.22), inset 0 2px 2px rgba(255,255,255,0.18), 0 0 28px var(--orb-glow-peak, rgba(196,164,108,0.55)), 0 0 56px var(--orb-glow-peak-soft, rgba(196,164,108,0.22)), 0 6px 18px rgba(0,0,0,0.45); }
}
</style>

<style scoped>
.welcome-rotor { width: 20px; height: 20px; position: relative; flex-shrink: 0; }
.welcome-rotor-l { position: absolute; top: 50%; left: 50%; width: 1.5px; height: 5px; margin: -2.5px 0 0 -.75px; border-radius: 1px; background: var(--rc, #b4915a); transform-origin: 50% 50%; animation: welcomeRotorCycle 5000ms ease-in-out infinite; opacity: 0; }
@keyframes welcomeRotorCycle {
  0%   { transform: rotate(var(--rot)) translateY(-14px) scale(0.3); opacity: 0; }
  5%   { transform: rotate(var(--rot)) translateY(-7px)  scale(1);   opacity: 0.85; }
  80%  { transform: rotate(var(--rot)) translateY(-7px)  scale(1);   opacity: 0.85; }
  90%  { transform: rotate(var(--rot)) translateY(-14px) scale(0.3); opacity: 0; }
  100% { transform: rotate(var(--rot)) translateY(-14px) scale(0.3); opacity: 0; }
}
</style>
