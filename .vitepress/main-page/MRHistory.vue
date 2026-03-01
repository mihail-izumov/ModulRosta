<template>
  <section class="mr-launches-section">
    <div class="mr-launches-container">
      <div class="mr-launches-header">
        <div class="mr-section-label">Launch History</div>
        <h2 class="mr-section-title">Журнал запусков</h2>
      </div>

      <!-- FILTERS -->
      <div class="mr-status-filters">
        <button 
          :class="['mr-filter-btn', { active: activeFilter === 'all' }]"
          @click="filterStatus('all')"
        >
          Все модули <span class="mr-count-badge">{{ projects.length }}</span>
        </button>
        <button 
          :class="['mr-filter-btn', { active: activeFilter === 'soon' }]"
          @click="filterStatus('soon')"
        >
          <span class="mr-dot blue"></span>Скоро <span class="mr-count-badge">{{ countByStatus('soon') }}</span>
        </button>
        <button 
          :class="['mr-filter-btn', { active: activeFilter === 'orbit' }]"
          @click="filterStatus('orbit')"
        >
          <span class="mr-dot green"></span>Запущен <span class="mr-count-badge">{{ countByStatus('orbit') }}</span>
        </button>
        <button 
          :class="['mr-filter-btn', { active: activeFilter === 'grounded' }]"
          @click="filterStatus('grounded')"
        >
          <span class="mr-dot gray"></span>Отложен <span class="mr-count-badge">{{ countByStatus('grounded') }}</span>
        </button>
        
        <button class="mr-identity-mode-btn" @click="toggleIdentityMode">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/></svg>
          Айдентика МР
        </button>
      </div>
      
      <!-- TABLE VIEW -->
      <div class="mr-launch-table-wrap">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          :class="['mr-launch-row', { hidden: !isVisible(project) }]"
          :data-status="project.status"
        >
          <!-- Logo -->
          <div :class="['mr-launch-logo', `status-${project.status}`, { 'mr-branded': project.mrBranded }]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          
          <!-- Info -->
          <div class="mr-launch-info">
            <div class="mr-launch-top">
              <span class="mr-launch-name">{{ project.name }}</span>
              <span :class="['mr-launch-subtitle', `status-${project.status}`]">{{ project.subtitle }}</span>
            </div>
            <div class="mr-launch-uptime-wrap">
              <span :class="['mr-launch-uptime', getUptimeClass(project)]">
                <span class="mr-ticker-icon"></span>
                <span>{{ project.uptime }}</span>
              </span>
              <span class="mr-launch-date">{{ project.date }}</span>
            </div>
          </div>
          
          <!-- Media buttons -->
          <div class="mr-launch-media">
            <button v-if="project.images" class="mr-media-btn" @click.stop="openImages(project.id)" title="Галерея">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              <span class="mr-count">{{ project.images }}</span>
            </button>
            <button v-if="project.videos" class="mr-media-btn" @click.stop="openVideos(project.id)" title="Видео">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span class="mr-count">{{ project.videos }}</span>
            </button>
          </div>
          
          <!-- Build details -->
          <div class="mr-launch-build">
            <div :class="['mr-build-details-block', `status-${project.status}`]">
              <div class="mr-build-details-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
              </div>
              <div class="mr-build-info">
                <div class="mr-build-label">Сборка</div>
                <div class="mr-build-time">{{ project.buildTime }}</div>
              </div>
              <span class="mr-details-text">ДЕТАЛИ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
  id: string
  name: string
  subtitle: string
  status: 'orbit' | 'soon' | 'grounded'
  uptime: string
  date: string
  buildTime: string
  mrBranded: boolean
  images?: number
  videos?: number
}

const activeFilter = ref('all')
const identityMode = ref(false)

const projects = ref<Project[]>([
  {
    id: 'boom',
    name: 'Companion App',
    subtitle: 'b00m.fun',
    status: 'soon',
    uptime: '00:00:00',
    date: 'Запуск: 01.04.2026',
    buildTime: '30d',
    mrBranded: false,
    images: 4,
    videos: 2
  },
  {
    id: 'yurtrust',
    name: 'Айдентика и Веб',
    subtitle: 'ЮрТраст',
    status: 'orbit',
    uptime: '1 год',
    date: 'Запуск: 2024',
    buildTime: '28d',
    mrBranded: true,
    images: 3
  },
  {
    id: 'hvorostovsky',
    name: 'Культурный портал',
    subtitle: 'Фонд Хворостовского',
    status: 'orbit',
    uptime: '1 год 3 мес',
    date: 'Запуск: 15.11.2023',
    buildTime: '45d',
    mrBranded: true,
    images: 8,
    videos: 3
  },
  {
    id: 'tanurkova',
    name: 'Архитектурное бюро',
    subtitle: 'Tanurkova Arch Design',
    status: 'grounded',
    uptime: '--:--',
    date: 'Запуск: 10.09.2023',
    buildTime: '30d',
    mrBranded: true,
    images: 6,
    videos: 1
  },
  {
    id: 'august',
    name: 'Театральная студия',
    subtitle: 'Август',
    status: 'grounded',
    uptime: '--:--',
    date: 'Запуск: 22.07.2023',
    buildTime: '21d',
    mrBranded: true,
    images: 3
  }
])

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value
  return projects.value.filter(p => p.status === activeFilter.value)
})

function countByStatus(status: string): number {
  return projects.value.filter(p => p.status === status).length
}

function filterStatus(status: string) {
  activeFilter.value = status
}

function isVisible(project: Project): boolean {
  if (activeFilter.value === 'all') return true
  return project.status === activeFilter.value
}

function getUptimeClass(project: Project): string {
  if (project.status === 'soon') return 'soon'
  if (project.status === 'grounded') return 'grounded-style'
  return ''
}

function toggleIdentityMode() {
  identityMode.value = !identityMode.value
}

function openImages(id: string) {
  console.log('Open images for:', id)
}

function openVideos(id: string) {
  console.log('Open videos for:', id)
}
</script>

<style scoped>
.mr-launches-section {
  background: #0a0a0a;
  padding: 80px 24px;
}

.mr-launches-container {
  max-width: 1100px;
  margin: 0 auto;
}

.mr-launches-header {
  margin-bottom: 24px;
}

.mr-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #00ff88;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 16px;
}

.mr-section-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 300;
  color: #fff;
}

/* STATUS FILTERS */
.mr-status-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.mr-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #111111;
  border: 1px solid #222222;
  border-radius: 8px;
  color: #888888;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mr-filter-btn:hover {
  border-color: #555555;
  color: #fff;
}

.mr-filter-btn.active {
  border-color: white;
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.mr-filter-btn .mr-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.mr-filter-btn .mr-dot.blue { background: #58a6ff; }
.mr-filter-btn .mr-dot.green { background: #00ff88; }
.mr-filter-btn .mr-dot.gray { background: #7d8590; }

.mr-filter-btn .mr-count-badge {
  font-size: 10px;
  color: #555555;
  margin-left: 4px;
}

@media (max-width: 900px) {
  .mr-status-filters {
    flex-direction: column;
    align-items: stretch;
  }
  .mr-status-filters .mr-filter-btn {
    justify-content: center;
  }
  .mr-identity-mode-btn {
    margin-left: 0 !important;
    width: 100%;
    justify-content: center;
  }
}

/* Identity Mode Button */
.mr-identity-mode-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(255, 85, 85, 0.2), rgba(255, 85, 85, 0.05));
  border: 2px solid #ff5555;
  border-radius: 8px;
  color: #ff5555;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-left: auto;
}

.mr-identity-mode-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 85, 85, 0.3), transparent);
  animation: mr-scan-btn 2s infinite;
}

@keyframes mr-scan-btn {
  0% { left: -100%; }
  100% { left: 100%; }
}

.mr-identity-mode-btn:hover {
  background: #ff5555;
  color: white;
  box-shadow: 0 0 30px rgba(255, 85, 85, 0.5);
}

.mr-identity-mode-btn svg {
  width: 18px;
  height: 18px;
}

/* TABLE VIEW */
.mr-launch-table-wrap {
  background: #111111;
  border: 1px solid #222222;
  border-radius: 8px;
  overflow: hidden;
}

.mr-launch-row {
  display: grid;
  grid-template-columns: 80px 1fr auto 150px;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #222222;
  transition: all 0.3s ease;
  position: relative;
  gap: 20px;
  cursor: pointer;
}

@media (max-width: 700px) {
  .mr-launch-row {
    grid-template-columns: 60px 1fr auto;
    padding: 12px 16px;
    gap: 12px;
  }
  .mr-launch-row .mr-launch-build { display: none; }
}

.mr-launch-row:last-child { border-bottom: none; }
.mr-launch-row.hidden { display: none; }

.mr-launch-row:hover {
  background: rgba(0, 255, 136, 0.02);
}

/* Logo */
.mr-launch-logo {
  width: 64px;
  height: 64px;
  background: #000000;
  border: 2px solid #222222;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  cursor: pointer;
}

.mr-launch-logo svg {
  color: #00ff88;
  transition: color 0.3s ease;
}

.mr-launch-row:hover .mr-launch-logo {
  border-color: #00ff88;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
}

/* Status-colored logos */
.mr-launch-logo.status-soon svg { color: #58a6ff; }
.mr-launch-logo.status-soon { border-color: rgba(88, 166, 255, 0.3); }
.mr-launch-row:hover .mr-launch-logo.status-soon { border-color: #58a6ff; box-shadow: 0 0 30px rgba(88, 166, 255, 0.3); }

.mr-launch-logo.status-orbit svg { color: #00ff88; }
.mr-launch-logo.status-orbit { border-color: rgba(0, 255, 136, 0.3); }
.mr-launch-row:hover .mr-launch-logo.status-orbit { border-color: #00ff88; box-shadow: 0 0 30px rgba(0, 255, 136, 0.4); }

.mr-launch-logo.status-grounded svg { color: #7d8590; }
.mr-launch-logo.status-grounded { border-color: rgba(125, 133, 144, 0.3); }
.mr-launch-row:hover .mr-launch-logo.status-grounded { border-color: #7d8590; box-shadow: 0 0 30px rgba(125, 133, 144, 0.3); }

/* MR branded logo - Radar wave animation */
.mr-launch-logo.mr-branded::before,
.mr-launch-logo.mr-branded::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #00ff88;
  border-radius: 14px;
  opacity: 0;
  pointer-events: none;
}

.mr-launch-logo.mr-branded::before {
  animation: mr-radar-wave-smooth 8s ease-out infinite;
}

.mr-launch-logo.mr-branded::after {
  animation: mr-radar-wave-smooth 8s ease-out infinite 4s;
}

/* Status-colored radar waves */
.mr-launch-logo.mr-branded.status-soon::before,
.mr-launch-logo.mr-branded.status-soon::after { border-color: #58a6ff; }
.mr-launch-logo.mr-branded.status-grounded::before,
.mr-launch-logo.mr-branded.status-grounded::after { border-color: #7d8590; }

@keyframes mr-radar-wave-smooth {
  0% { 
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    opacity: 0.15;
  }
  100% { 
    transform: scale(1.6);
    opacity: 0;
  }
}

/* Main info */
.mr-launch-info { min-width: 0; flex: 1; }

.mr-launch-top {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 6px;
}

.mr-launch-name {
  font-weight: 600;
  color: #fff;
  font-size: 16px;
  white-space: nowrap;
}

.mr-launch-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
}

.mr-launch-subtitle.status-soon { color: #58a6ff; }
.mr-launch-subtitle.status-orbit { color: #00ff88; }
.mr-launch-subtitle.status-grounded { color: #7d8590; }

/* Uptime counter */
.mr-launch-uptime-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mr-launch-uptime {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(90deg, rgba(0, 255, 136, 0.1), transparent);
  padding: 4px 10px 4px 8px;
  border-left: 3px solid #00ff88;
  border-radius: 0 4px 4px 0;
}

.mr-launch-uptime .mr-ticker-icon {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  animation: mr-ticker-blink 1s infinite;
}

@keyframes mr-ticker-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.mr-launch-uptime.soon {
  background: linear-gradient(90deg, rgba(88, 166, 255, 0.1), transparent);
  border-left-color: #58a6ff;
}

.mr-launch-uptime.soon .mr-ticker-icon {
  background: #58a6ff;
}

.mr-launch-uptime.grounded-style {
  background: linear-gradient(90deg, rgba(125, 133, 144, 0.1), transparent);
  border-left-color: #7d8590;
}

.mr-launch-uptime.grounded-style .mr-ticker-icon {
  background: #7d8590;
  animation: none;
}

.mr-launch-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #555555;
  padding-left: 11px;
}

/* Build details block */
.mr-launch-build {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 140px;
  flex-shrink: 0;
}

.mr-build-details-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: #000000;
  border: 2px solid #00ff88;
  border-radius: 8px;
  height: 44px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 120px;
}

.mr-build-details-block .mr-build-details-icon,
.mr-build-details-block .mr-build-info {
  transition: opacity 0.3s ease;
}

.mr-build-details-block .mr-details-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00ff88;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mr-build-details-block:hover .mr-build-details-icon,
.mr-build-details-block:hover .mr-build-info {
  opacity: 0;
}

.mr-build-details-block:hover .mr-details-text {
  opacity: 1;
}

.mr-build-details-block:hover {
  background: rgba(0, 255, 136, 0.1);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
}

.mr-build-details-block.status-soon {
  border-color: #58a6ff;
}
.mr-build-details-block.status-soon .mr-details-text { color: #58a6ff; }
.mr-build-details-block.status-soon:hover {
  background: rgba(88, 166, 255, 0.1);
  box-shadow: 0 0 20px rgba(88, 166, 255, 0.3);
}

.mr-build-details-block.status-grounded {
  border-color: #7d8590;
}
.mr-build-details-block.status-grounded .mr-details-text { color: #7d8590; }
.mr-build-details-block.status-grounded:hover {
  background: rgba(125, 133, 144, 0.1);
  box-shadow: 0 0 20px rgba(125, 133, 144, 0.3);
}

.mr-build-details-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mr-build-details-icon svg {
  width: 20px;
  height: 20px;
  color: #00ff88;
}

.mr-build-details-block.status-soon .mr-build-details-icon svg { color: #58a6ff; }
.mr-build-details-block.status-grounded .mr-build-details-icon svg { color: #7d8590; }

.mr-build-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mr-build-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #555555;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mr-build-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  color: #fff;
  font-weight: 700;
}

/* Media buttons */
.mr-launch-media {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.mr-media-btn {
  width: 40px;
  height: 40px;
  background: #000000;
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.mr-media-btn:hover {
  border-color: #ff5555;
  background: rgba(255, 85, 85, 0.1);
  transform: scale(1.05);
}

.mr-media-btn svg {
  width: 16px;
  height: 16px;
  color: #ff5555;
  transition: color 0.3s ease;
}

.mr-media-btn:hover svg { color: #ff5555; }

.mr-media-btn .mr-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: #ff5555;
  color: white;
  border-radius: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
