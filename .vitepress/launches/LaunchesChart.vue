<template>
  <div class="mr-chart-section">
    <div class="mr-chart-container">
    <!-- ── Header ── -->
    <div class="mr-header">
      <div class="mr-label">Статистика запусков</div>
      <h2 class="mr-title">Сборки по направлениям</h2>
      <p class="mr-subtitle">Один модуль может иметь несколько сборок</p>

      <div class="mr-badges">
        <div class="mr-badge" v-for="b in badges" :key="b.label">
          <span class="mr-badge-label">{{ b.label }}</span>
          <span class="mr-badge-value">{{ b.value }}</span>
        </div>
      </div>
    </div>

    <!-- ── Main grid ── -->
    <div class="mr-grid">

      <!-- LEFT — bar table -->
      <div class="mr-table">
        <div class="mr-table-head">
          <span class="mr-th mr-th-rank">#</span>
          <span class="mr-th">Направление</span>
          <span class="mr-th mr-th-bar"></span>
          <span class="mr-th mr-th-right">N</span>
          <span class="mr-th mr-th-right">%</span>
        </div>

        <div class="mr-rows">
          <div
            v-for="(item, i) in DIRECTIONS"
            :key="item.name"
            class="mr-row"
            :class="{ 'mr-row--active': activeIndex === i }"
            :style="rowStyle(item, i)"
            @mouseenter="hovered = i"
            @mouseleave="hovered = null"
            @click="toggleSelected(i)"
          >
            <span class="mr-rank" :style="{ color: activeIndex === i ? COLORS[i] : '#666' }">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="mr-name" :style="{ color: activeIndex === i ? '#fff' : '#ddd' }">
              {{ item.name }}
            </span>
            <div class="mr-bar-track">
              <div
                class="mr-bar-fill"
                :style="barFillStyle(item, i)"
              />
            </div>
            <span class="mr-count" :style="{ color: activeIndex === i ? COLORS[i] : '#fff' }">
              {{ animatedCounts[i] }}
            </span>
            <span class="mr-pct" :style="{ color: activeIndex === i ? COLORS[i] + 'cc' : '#888' }">
              {{ realPct(item) }}%
            </span>
          </div>
        </div>

        <div class="mr-table-foot">
          <span class="mr-ticker-dot" />
          <span>Полоска = относительно лидера (Чекап, 22 сборки = 100%)</span>
        </div>
      </div>

      <!-- RIGHT — donut + info -->
      <div class="mr-right">

        <!-- Donut -->
        <div class="mr-donut-card">
          <div class="mr-card-label">Структура</div>
          <svg
            :width="DONUT_SIZE" :height="DONUT_SIZE"
            :viewBox="`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`"
            class="mr-donut-svg"
          >
            <defs>
              <filter id="mr-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <path
              v-for="(s, i) in slices"
              :key="i"
              :d="s.d"
              :fill="s.color"
              :opacity="activeIndex !== null ? (activeIndex === i ? 1 : 0.2) : 0.9"
              :filter="activeIndex === i ? 'url(#mr-glow)' : 'none'"
              class="mr-slice"
              @mouseenter="hovered = i"
              @mouseleave="hovered = null"
              @click="toggleSelected(i)"
            />
            <circle :cx="CX" :cy="CY" :r="R_INNER - 1" fill="#0d0d0d"/>
            <circle :cx="CX" :cy="CY" :r="R_INNER - 1" fill="none" stroke="#333" stroke-width="1"/>

            <!-- Center text: active item -->
            <template v-if="activeIndex !== null">
              <text :x="CX" :y="CY - 10" text-anchor="middle"
                :fill="COLORS[activeIndex]"
                font-family="'JetBrains Mono',monospace" font-size="22" font-weight="700">
                {{ DIRECTIONS[activeIndex].count }}
              </text>
              <text :x="CX" :y="CY + 7" text-anchor="middle"
                fill="#aaa" font-family="'JetBrains Mono',monospace" font-size="9" letter-spacing="1.5">
                СБОРОК
              </text>
              <text :x="CX" :y="CY + 21" text-anchor="middle"
                fill="#888" font-family="'JetBrains Mono',monospace" font-size="8" letter-spacing="1">
                {{ realPct(DIRECTIONS[activeIndex]) }}%
              </text>
            </template>
            <!-- Center text: total -->
            <template v-else>
              <text :x="CX" :y="CY - 4" text-anchor="middle"
                fill="rgb(0,255,136)" font-family="'JetBrains Mono',monospace" font-size="28" font-weight="700">
                {{ animatedTotal }}
              </text>
              <text :x="CX" :y="CY + 16" text-anchor="middle"
                fill="#aaa" font-family="'JetBrains Mono',monospace" font-size="9" letter-spacing="2">
                СБОРОК
              </text>
            </template>
          </svg>
          <div class="mr-donut-hint">
            {{ selected === null ? 'НАЖМИ НА СЕКТОР' : 'ЕЩЁ РАЗ — СБРОС' }}
          </div>
        </div>

        <!-- Info card -->
        <div
          class="mr-info-card"
          :style="infoCardStyle"
        >
          <template v-if="activeIndex !== null">
            <div class="mr-info-top">
              <span class="mr-info-dir-label" :style="{ color: COLORS[activeIndex] }">Направление</span>
              <span class="mr-info-rank" :style="infoRankStyle">
                #{{ String(activeIndex + 1).padStart(2, '0') }}
              </span>
            </div>
            <div class="mr-info-name">{{ DIRECTIONS[activeIndex].name }}</div>
            <div class="mr-info-meta">
              <div
                v-for="(row, ri) in infoRows"
                :key="row.label"
                class="mr-meta-row"
                :style="{ borderBottom: ri < 2 ? `1px solid ${COLORS[activeIndex]}18` : 'none' }"
              >
                <span class="mr-meta-label">{{ row.label }}</span>
                <span class="mr-meta-value" :style="{ color: row.accent ? COLORS[activeIndex] : '#ddd', fontWeight: row.accent ? 700 : 400 }">
                  {{ row.value }}
                </span>
              </div>
            </div>
            <div class="mr-info-bar-track">
              <div class="mr-info-bar-fill" :style="infoBarStyle" />
            </div>
          </template>
          <template v-else>
            <div class="mr-info-empty">
              ВЫБЕРИТЕ НАПРАВЛЕНИЕ<br/>В СПИСКЕ ИЛИ ДИАГРАММЕ
            </div>
          </template>
        </div>

      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const DIRECTIONS = [
  { name: 'Чекап',          count: 22 },
  { name: 'Стратегия',      count: 20 },
  { name: 'Веб',            count: 19 },
  { name: 'Бренд',          count: 18 },
  { name: 'R&D',            count: 15 },
  { name: 'Продажи',        count: 15 },
  { name: 'Автоматизация',  count: 11 },
  { name: 'ИИ',             count:  6 },
  { name: 'Упаковка',       count:  6 },
  { name: 'Видео',          count:  6 },
  { name: 'Торговая среда', count:  6 },
  { name: 'Стандарты',      count:  4 },
  { name: 'Анимация',       count:  3 },
  { name: 'CJM',            count:  3 },
  { name: 'Лояльность',     count:  3 },
]

const TOTAL_WORKS    = DIRECTIONS.reduce((s, d) => s + d.count, 0) // 157
const TOTAL_PROJECTS = 39
const MAX            = Math.max(...DIRECTIONS.map(d => d.count))    // 22

const COLORS = [
  '#00ff88','#00f5a0','#00e8b4','#00d8c4','#00c8d0',
  '#00b5dc','#00a0e8','#58a6ff','#7a9fff','#9b97ff',
  '#b88fff','#d484ff','#e87fd4','#f07eb0','#f58090',
]

// Donut constants
const DONUT_SIZE = 220
const CX = DONUT_SIZE / 2
const CY = DONUT_SIZE / 2
const R_OUTER = 88
const R_INNER = 54

// State
const hovered  = ref(null)
const selected = ref(null)
const visible  = ref(false)

const activeIndex = computed(() =>
  hovered.value !== null ? hovered.value : selected.value
)

function toggleSelected(i) {
  selected.value = selected.value === i ? null : i
}

// ── Animated counters ──
const animatedCounts = ref(DIRECTIONS.map(() => 0))
const animatedTotal  = ref(0)
const animatedProjects = ref(0)
const animatedDirs   = ref(0)

function countUp(setter, target, duration, delay) {
  setTimeout(() => {
    const start = performance.now()
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const v = Math.round((1 - Math.pow(1 - p, 3)) * target)
      setter(v)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, delay)
}

onMounted(() => {
  setTimeout(() => {
    visible.value = true
    // Individual row counters
    DIRECTIONS.forEach((item, i) => {
      countUp(v => { animatedCounts.value[i] = v }, item.count, 800, i * 50)
    })
    countUp(v => { animatedTotal.value = v },    TOTAL_WORKS,    1000, 300)
    countUp(v => { animatedProjects.value = v }, TOTAL_PROJECTS, 900,  100)
    countUp(v => { animatedDirs.value = v },     DIRECTIONS.length, 600, 250)
  }, 150)
})

// ── Badges ──
const badges = computed(() => [
  { label: 'Запуски',     value: animatedProjects.value },
  { label: 'Сборки',      value: animatedTotal.value    },
  { label: 'Направления', value: animatedDirs.value     },
])

// ── Helpers ──
function realPct(item) {
  return ((item.count / TOTAL_WORKS) * 100).toFixed(1)
}

function rowStyle(item, i) {
  const active = activeIndex.value === i
  return {
    background:  active ? `${COLORS[i]}14` : 'rgba(255,255,255,0.04)',
    border:      `1px solid ${active ? COLORS[i] + '55' : 'rgba(255,255,255,0.09)'}`,
    transform:   active ? 'translateX(4px)' : 'none',
  }
}

function barFillStyle(item, i) {
  const barPct = (item.count / MAX) * 100
  const active = activeIndex.value === i
  return {
    width:     visible.value ? `${barPct}%` : '0%',
    background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}99)`,
    boxShadow: active ? `0 0 8px ${COLORS[i]}90` : 'none',
    transitionDelay: `${i * 50}ms`,
  }
}

// ── Donut slices ──
const slices = computed(() => {
  const TAU = Math.PI * 2
  let angle = -Math.PI / 2
  return DIRECTIONS.map((item, i) => {
    const span = (item.count / TOTAL_WORKS) * TAU
    const end  = angle + span
    const isActive = activeIndex.value === i
    const ro = isActive ? R_OUTER + 8 : R_OUTER
    const cos0 = Math.cos(angle), sin0 = Math.sin(angle)
    const cos1 = Math.cos(end),   sin1 = Math.sin(end)
    const large = span > Math.PI ? 1 : 0
    const d = [
      `M ${CX + ro*cos0} ${CY + ro*sin0}`,
      `A ${ro} ${ro} 0 ${large} 1 ${CX + ro*cos1} ${CY + ro*sin1}`,
      `L ${CX + R_INNER*cos1} ${CY + R_INNER*sin1}`,
      `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${CX + R_INNER*cos0} ${CY + R_INNER*sin0}`,
      'Z',
    ].join(' ')
    angle = end
    return { d, color: COLORS[i] }
  })
})

// ── Info card ──
const infoCardStyle = computed(() => {
  const ai = activeIndex.value
  if (ai === null) return {
    background: 'rgba(17,17,17,0.85)',
    border: '1px solid rgba(255,255,255,0.1)',
  }
  return {
    background:  `${COLORS[ai]}0e`,
    border:      `1px solid ${COLORS[ai]}50`,
  }
})

const infoRankStyle = computed(() => {
  const ai = activeIndex.value
  if (ai === null) return {}
  return {
    background: `${COLORS[ai]}20`,
    color:      COLORS[ai],
    border:     `1px solid ${COLORS[ai]}45`,
  }
})

const infoRows = computed(() => {
  const ai = activeIndex.value
  if (ai === null) return []
  const item = DIRECTIONS[ai]
  return [
    { label: 'Сборок',   value: item.count,                                           accent: true  },
    { label: 'Доля',     value: `${realPct(item)}%`,                                  accent: false },
    { label: 'Запусков', value: `${TOTAL_PROJECTS} всего`,                             accent: false },
  ]
})

const infoBarStyle = computed(() => {
  const ai = activeIndex.value
  if (ai === null) return { width: '0%' }
  const item = DIRECTIONS[ai]
  return {
    width:      `${(item.count / MAX) * 100}%`,
    background: `linear-gradient(90deg, ${COLORS[ai]}, ${COLORS[ai]}80)`,
    boxShadow:  `0 0 8px ${COLORS[ai]}80`,
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

.mr-chart-section {
  padding: 80px 24px 130px;
}
.mr-chart-container {
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'JetBrains Mono', monospace;
  background: transparent;
  color: #fff;
}

/* ── Header ── */
.mr-header { margin-bottom: 32px; animation: mr-fade-up .5s ease both; }

.mr-label {
  font-size: 11px; color: rgb(0,255,136);
  text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px;
}

.mr-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(28px, 5vw, 42px); font-weight: 600;
  color: #fff; margin: 0 0 18px; line-height: 1.15; letter-spacing: -0.5px;
}

.mr-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px; color: rgba(255,255,255,0.7);
  margin: 0 0 18px; line-height: 1.5;
}

.mr-badges { display: flex; gap: 12px; flex-wrap: wrap; }

.mr-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(0,255,136,0.07); border: 1px solid rgba(0,255,136,0.25);
  border-radius: 6px; padding: 10px 16px;
}

.mr-badge-label {
  font-size: 11px; color: rgba(0,255,136,0.8);
  text-transform: uppercase; letter-spacing: 1px;
}

.mr-badge-value { font-size: 20px; color: rgb(0,255,136); font-weight: 700; line-height: 1; }

/* ── Grid ── */
.mr-grid {
  display: grid;
  grid-template-columns: 1fr 296px;
  gap: 24px;
  align-items: start;
  animation: mr-fade-up .55s ease .1s both;
}

/* ── Table ── */
.mr-table {
  background: rgba(20,20,20,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; overflow: hidden;
}

.mr-table-head {
  display: grid;
  grid-template-columns: 28px 1fr 120px 36px 50px;
  gap: 14px; padding: 11px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.mr-th {
  font-size: 10px; color: #888;
  text-transform: uppercase; letter-spacing: 1.5px;
}
.mr-th-rank { text-align: right; }
.mr-th-bar  { }
.mr-th-right { text-align: right; }

.mr-rows { padding: 10px; display: flex; flex-direction: column; gap: 6px; }

.mr-row {
  display: grid;
  grid-template-columns: 28px 1fr 120px 36px 50px;
  align-items: center;
  gap: 14px; padding: 12px 16px;
  border-radius: 8px; cursor: pointer;
  transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
}

.mr-rank {
  font-size: 11px; text-align: right;
  transition: color 0.2s; user-select: none;
}

.mr-name {
  font-size: 14px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color 0.2s;
}

.mr-bar-track {
  height: 6px; border-radius: 3px;
  background: rgba(255,255,255,0.1); overflow: hidden;
}

.mr-bar-fill {
  height: 100%; border-radius: 3px;
  transition: width 0.85s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
}

.mr-count {
  font-size: 16px; font-weight: 700;
  text-align: right; transition: color 0.2s;
}

.mr-pct {
  font-size: 11px; text-align: right; transition: color 0.2s;
}

.mr-table-foot {
  padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888;
}

.mr-ticker-dot {
  width: 6px; height: 6px; flex-shrink: 0;
  background: rgb(0,255,136); border-radius: 50%;
  animation: mr-ticker 1.5s ease-in-out infinite;
}

/* ── Right column ── */
.mr-right {
  display: flex; flex-direction: column; gap: 16px;
  position: sticky; top: 24px;
}

.mr-donut-card {
  background: rgba(17,17,17,0.85);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 24px;
  display: flex; flex-direction: column; align-items: center;
}

.mr-card-label {
  font-size: 10px; color: #999; letter-spacing: 3px;
  text-transform: uppercase; margin-bottom: 16px; align-self: flex-start;
}

.mr-donut-svg { overflow: visible; flex-shrink: 0; }

.mr-slice {
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
}

.mr-donut-hint {
  font-size: 10px; color: #666; letter-spacing: 2px;
  margin-top: 14px; text-align: center;
}

.mr-info-card {
  border-radius: 10px; padding: 20px; min-height: 140px;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.mr-info-top {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 14px;
}

.mr-info-dir-label {
  font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
}

.mr-info-rank {
  border-radius: 4px; padding: 3px 8px;
  font-size: 10px; letter-spacing: 1px;
}

.mr-info-name {
  font-family: 'Inter', sans-serif;
  font-size: 22px; font-weight: 600; color: #fff; margin-bottom: 16px;
}

.mr-info-meta { border-radius: 8px; overflow: hidden; }

.mr-meta-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
}

.mr-meta-label {
  font-size: 10px; color: #999; letter-spacing: 1px; text-transform: uppercase;
}

.mr-meta-value { font-size: 14px; }

.mr-info-bar-track {
  margin-top: 14px; height: 3px;
  background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
}

.mr-info-bar-fill {
  height: 100%; border-radius: 2px;
  transition: width .5s ease;
}

.mr-info-empty {
  height: 100%; min-height: 100px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #666; letter-spacing: 2px;
  text-align: center; line-height: 2;
}

/* ── Animations ── */
@keyframes mr-fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes mr-ticker {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .mr-grid { grid-template-columns: 1fr; }
  .mr-right { position: static; flex-direction: row; flex-wrap: wrap; }
  .mr-donut-card { flex: 1 1 240px; }
  .mr-info-card  { flex: 1 1 200px; }
}

@media (max-width: 520px) {
  .mr-table-head,
  .mr-row {
    grid-template-columns: 22px 1fr 70px 28px 42px;
    gap: 8px; padding: 10px 10px;
  }
  .mr-right { flex-direction: column; }
  .mr-badges { gap: 8px; }
  .mr-badge  { padding: 8px 10px; }
}
</style>
