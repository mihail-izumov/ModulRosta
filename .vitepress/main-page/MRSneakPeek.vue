<template>
  <div
    :class="['mr-sneak-block', { hovered: isHovered }]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="goToLaunches"
  >
    <!-- Cards -->
    <div class="mr-sneak-cards">
      <!-- Left: Last launched -->
      <div v-if="lastLaunched" :class="['mr-sneak-card', 'mr-sneak-filled']">
        <div class="mr-sneak-label" style="color: #00ff88">В полёте</div>
        <div class="mr-sneak-row">
          <div class="mr-sneak-icon" style="border-color: #00ff8830">
            <div v-if="lastLaunched.icon" class="mr-sneak-icon-img mr-sneak-icon-green" :style="{ '--icon-src': `url(${lastLaunched.icon})` }"></div>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
            <template v-if="lastLaunched.mrBranded">
              <div class="mr-sneak-radar" style="border-color: #00ff88"></div>
              <div class="mr-sneak-radar mr-sneak-radar-delay" style="border-color: #00ff88"></div>
            </template>
          </div>
          <div class="mr-sneak-info">
            <div class="mr-sneak-title">{{ lastLaunched.title }}</div>
            <div class="mr-sneak-subtitle" style="color: #00ff88">{{ lastLaunched.subtitle }}</div>
            <div class="mr-sneak-timer mr-sneak-timer-green">
              <span class="mr-sneak-dot" style="background: #00ff88"></span>
              <span v-html="getUptime(lastLaunched)"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Next launch -->
      <div v-if="nextLaunch" :class="['mr-sneak-card', isOverdue(nextLaunch) ? 'mr-sneak-filled' : 'mr-sneak-outline']">
        <div class="mr-sneak-label" :style="{ color: isOverdue(nextLaunch) ? '#00ff88' : '#58a6ff' }">
          {{ isOverdue(nextLaunch) ? 'В полёте' : 'Следующий запуск' }}
        </div>
        <div class="mr-sneak-row">
          <div class="mr-sneak-icon" :style="{ borderColor: isOverdue(nextLaunch) ? '#00ff8830' : '#58a6ff30' }">
            <div v-if="nextLaunch.icon" :class="['mr-sneak-icon-img', isOverdue(nextLaunch) ? 'mr-sneak-icon-green' : 'mr-sneak-icon-blue']" :style="{ '--icon-src': `url(${nextLaunch.icon})` }"></div>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="isOverdue(nextLaunch) ? '#00ff88' : '#58a6ff'" stroke-width="2">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
            <template v-if="nextLaunch.mrBranded">
              <div class="mr-sneak-radar" :style="{ borderColor: isOverdue(nextLaunch) ? '#00ff88' : '#58a6ff' }"></div>
              <div class="mr-sneak-radar mr-sneak-radar-delay" :style="{ borderColor: isOverdue(nextLaunch) ? '#00ff88' : '#58a6ff' }"></div>
            </template>
          </div>
          <div class="mr-sneak-info">
            <div class="mr-sneak-title">{{ nextLaunch.title }}</div>
            <div class="mr-sneak-subtitle" :style="{ color: isOverdue(nextLaunch) ? '#00ff88' : '#58a6ff' }">{{ nextLaunch.subtitle }}</div>
            <div :class="['mr-sneak-timer', isOverdue(nextLaunch) ? 'mr-sneak-timer-green' : 'mr-sneak-timer-blue']">
              <span class="mr-sneak-dot" :style="{ background: isOverdue(nextLaunch) ? '#00ff88' : '#58a6ff' }"></span>
              <span v-html="getUptime(nextLaunch)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Launches link -->
    <div :class="['mr-sneak-launches', { 'mr-sneak-launches-hover': isHovered }]">
      <span class="mr-sneak-launches-text">Запуски</span>
      <span :class="['mr-sneak-launches-arrow', { 'mr-sneak-arrow-hover': isHovered }]">→</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Project {
  id: string
  title: string
  subtitle: string
  status: string
  launchDate: string
  buildTime: string
  mrBranded: boolean
  icon: string | null
}

const allProjects = ref<Project[]>([
  { id: 'proj1', title: 'Б00М! Призотека', subtitle: 'b00m.fun', status: 'Запущен', launchDate: '31.03.2026', buildTime: '45дн', mrBranded: true, icon: '/ars/id-icons/id_icon_01_03_2026.svg' },
  { id: 'proj2', title: 'Калькулятор инвестора', subtitle: 'Optima Space', status: 'Запущен', launchDate: '02.03.2026', buildTime: '10дн', mrBranded: false, icon: 'https://runscale.ru/icons/optima_space_icon.svg' },
  { id: 'proj3', title: 'Генератор сториз', subtitle: 'Корж', status: 'Запущен', launchDate: '25.12.2025', buildTime: '10дн', mrBranded: false, icon: null },
  { id: 'proj4', title: 'Дом для WOODLED Rotor', subtitle: 'WOODLED', status: 'Скоро запуск', launchDate: '01.05.2026', buildTime: '', mrBranded: false, icon: null },
])

const isHovered = ref(false)
const tick = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => { tick.value++ }, 60000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function parseDate(str: string): Date {
  const m = str.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!m) return new Date()
  return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]))
}

function formatDHM(totalSeconds: number): string {
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const min = Math.floor((totalSeconds % 3600) / 60)
  return `${d}дн:${h}ч:${min}мин`
}

function isOverdue(project: Project): boolean {
  if (project.status !== 'Скоро запуск') return false
  return parseDate(project.launchDate).getTime() < new Date().getTime()
}

function getUptime(project: Project): string {
  // force reactivity
  void tick.value

  const launch = parseDate(project.launchDate)
  const now = new Date()

  if (project.status === 'Отложен') return '--:--'

  if (project.status === 'Скоро запуск') {
    const diffMs = launch.getTime() - now.getTime()
    return formatDHM(Math.floor(Math.abs(diffMs) / 1000))
  }

  const diffMs = now.getTime() - launch.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return formatDHM(Math.floor(diffMs / 1000))
  }

  const months = (now.getFullYear() - launch.getFullYear()) * 12 + (now.getMonth() - launch.getMonth())
  const y = Math.floor(months / 12)
  const mo = months % 12
  if (y >= 1) {
    const w = y === 1 ? 'год' : y >= 2 && y <= 4 ? 'года' : 'лет'
    return mo > 0 ? `${y} ${w} ${mo} мес` : `${y}+ ${w}`
  }
  return `${mo} мес`
}

const lastLaunched = computed(() => {
  void tick.value
  return allProjects.value
    .filter(p => p.status === 'Запущен')
    .sort((a, b) => parseDate(b.launchDate).getTime() - parseDate(a.launchDate).getTime())[0] || null
})

const nextLaunch = computed(() => {
  void tick.value
  return allProjects.value.find(p => p.status === 'Скоро запуск') || null
})

function goToLaunches() {
  window.location.href = '/launches'
}
</script>

<style scoped>
.mr-sneak-block {
  max-width: 1100px;
  width: calc(100% - 48px);
  margin: 24px auto 0;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid #1a1a1a;
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
}
.mr-sneak-block.hovered {
  background: rgba(255, 136, 0, 0.02);
  border-color: rgba(255, 136, 0, 0.12);
}

/* Cards container */
.mr-sneak-cards {
  display: flex;
  align-items: stretch;
  gap: 6px;
  padding: 6px 6px 0;
}

/* Card base */
.mr-sneak-card {
  border-radius: 10px;
  padding: 14px 20px 16px;
  flex: 1;
  min-width: 0;
  transition: all 0.3s ease;
}
.mr-sneak-filled {
  background: #00ff880f;
  border: 1px solid #00ff8826;
}
.mr-sneak-outline {
  background: transparent;
  border: 1px solid #58a6ff40;
}

/* Label */
.mr-sneak-label {
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 10px;
  opacity: 0.8;
}

/* Row: icon + info */
.mr-sneak-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Icon */
.mr-sneak-icon {
  width: 48px;
  height: 48px;
  border: 2px solid;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.mr-sneak-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.mr-sneak-icon-green {
  -webkit-mask-image: var(--icon-src);
  mask-image: var(--icon-src);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  background-color: rgb(0, 255, 136);
}
.mr-sneak-icon-blue {
  -webkit-mask-image: var(--icon-src);
  mask-image: var(--icon-src);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  background-color: #58a6ff;
}

/* Radar pulse for branded */
.mr-sneak-radar {
  position: absolute;
  inset: -2px;
  border: 2px solid;
  border-radius: 12px;
  animation: mr-sneak-radar-anim 8s ease-out infinite;
  pointer-events: none;
}
.mr-sneak-radar-delay {
  animation-delay: 4s;
}
@keyframes mr-sneak-radar-anim {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* Info block */
.mr-sneak-info {
  min-width: 0;
  flex: 1;
}
.mr-sneak-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.mr-sneak-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
}

/* Timer */
.mr-sneak-timer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #fff;
  font-weight: 700;
  padding: 2px 8px 2px 7px;
  border-left: 3px solid;
  border-radius: 0 4px 4px 0;
  white-space: nowrap;
  margin-top: 3px;
}
.mr-sneak-timer-green {
  background: linear-gradient(90deg, #00ff8818, transparent);
  border-left-color: #00ff88;
}
.mr-sneak-timer-blue {
  background: linear-gradient(90deg, #58a6ff18, transparent);
  border-left-color: #58a6ff;
}
.mr-sneak-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: mr-sneak-blink 1s infinite;
}
@keyframes mr-sneak-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Launches button */
.mr-sneak-launches {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  margin: 6px 6px 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
}
.mr-sneak-launches-hover {
  background: rgba(255, 136, 0, 0.08);
  border-color: rgba(255, 136, 0, 0.2);
}
.mr-sneak-launches-text {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
  transition: color 0.4s ease;
}
.mr-sneak-launches-hover .mr-sneak-launches-text {
  color: rgb(255, 136, 0);
}
.mr-sneak-launches-arrow {
  font-size: 14px;
  color: #333;
  transition: color 0.4s, transform 0.3s;
  display: inline-block;
}
.mr-sneak-arrow-hover {
  color: rgb(255, 136, 0);
  transform: translateX(3px);
}

/* ═══ MOBILE ═══ */
@media (max-width: 640px) {
  .mr-sneak-block {
    width: calc(100% - 32px);
    margin: 16px auto 0;
    border-radius: 12px;
  }
  .mr-sneak-cards {
    flex-direction: column;
    gap: 4px;
    padding: 4px 4px 0;
  }
  .mr-sneak-card {
    padding: 12px 16px 14px;
  }
  .mr-sneak-label {
    margin-bottom: 8px;
  }
  .mr-sneak-row {
    gap: 16px;
  }
  .mr-sneak-icon {
    width: 42px;
    height: 42px;
  }
  .mr-sneak-icon svg {
    width: 20px;
    height: 20px;
  }
  .mr-sneak-icon-img {
    width: 100%;
    height: 100%;
  }
  .mr-sneak-title {
    font-size: 12px;
  }
  .mr-sneak-subtitle {
    font-size: 10px;
  }
  .mr-sneak-timer {
    font-size: 11px;
  }
  .mr-sneak-launches {
    margin: 4px 4px 4px;
    padding: 10px 16px;
  }
  .mr-sneak-launches-text {
    font-size: 10px;
    letter-spacing: 2px;
  }
}
</style>
