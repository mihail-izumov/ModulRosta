<template>
  <section class="mr-history-section">
    <div class="mr-history-container">
      <div class="mr-history-header">
        <div class="mr-section-label">2010 – 2026</div>
        <h2 class="mr-section-title">Журнал запусков</h2>
      </div>

      <!-- Average Build Time -->
      <div class="mr-avg-time">
        <span class="mr-avg-label">Среднее время запуска</span>
        <span class="mr-avg-value">{{ averageBuildTime }}дн</span>
      </div>

      <!-- Filters -->
      <div class="mr-history-filters">
        <button :class="['mr-filter-btn', { active: activeFilter === 'all' }]" @click="filterStatus('all')">Все модули <span class="mr-count">({{ allProjects.length }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'soon' }]" @click="filterStatus('soon')"><span class="mr-dot blue"></span>Скоро <span class="mr-count">({{ countByStatus('Скоро запуск') }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'orbit' }]" @click="filterStatus('orbit')"><span class="mr-dot green"></span>Запущен <span class="mr-count">({{ countByStatus('Запущен') }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'grounded' }]" @click="filterStatus('grounded')"><span class="mr-dot gray"></span>Отложен <span class="mr-count">({{ countByStatus('Отложен') }})</span></button>
        <button :class="['mr-identity-btn', { active: identityMode }]" @click="toggleIdentityMode">
          <span class="mr-identity-btn-icon" style="-webkit-mask-image: url(/icons/orxaos-icon.svg); mask-image: url(/icons/orxaos-icon.svg);"></span>
          ORXAOS
        </button>
      </div>
      
      <!-- Table -->
      <div v-show="!identityMode" class="mr-history-table">
        <template v-for="(project, index) in filteredProjects" :key="project.id">
          <div v-if="index < 5" :class="['mr-history-row', { hidden: !isVisible(project) }]">
            <div :class="['mr-history-logo', getStatusClass(project.status), { branded: project.logo }]" @click="openDetails(project.id)">
              <div v-if="project.logo" class="mr-logo-mask" :style="{ '-webkit-mask-image': `url(${project.logo})`, 'mask-image': `url(${project.logo})` }"></div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <div class="mr-history-info">
              <div class="mr-history-top"><span class="mr-history-name">{{ project.title }}</span><span :class="['mr-history-subtitle', getStatusClass(project.status)]">{{ project.subtitle }}</span></div>
              <div class="mr-history-uptime-wrap">
                <span :class="['mr-history-uptime', getUptimeClass(project.status)]"><span class="mr-ticker"></span><span v-html="getUptime(project)"></span></span>
                <span class="mr-history-date">Запуск: {{ project.launchDate }}</span>
              </div>
            </div>
            <div class="mr-history-media">
              <button v-if="project.images.length" class="mr-media-btn" @click.stop="openImages(project.id)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span class="mr-media-count">{{ project.images.length }}</span></button>
              <button v-if="project.videos.length" class="mr-media-btn" @click.stop="openVideos(project.id)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span class="mr-media-count">{{ project.videos.length }}</span></button>
            </div>
            <div class="mr-history-build">
              <div :class="['mr-build-block', getStatusClass(project.status)]" @click.stop="openDetails(project.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
                <div class="mr-build-info">
                  <span class="mr-build-label">СБОРКА</span>
                  <span class="mr-build-time">{{ project.buildTime || '--' }}</span>
                </div>
                <span class="mr-build-details">ДЕТАЛИ</span>
              </div>
            </div>
          </div>
        </template>

        <button v-if="accordionProjects.length > 0" :class="['mr-accordion-toggle', { open: accordionOpen }]" @click="toggleAccordion">
          <span>{{ accordionOpen ? 'Свернуть' : `Ещё ${accordionProjects.length} ${pluralize(accordionProjects.length, 'модуль', 'модуля', 'модулей')}` }}</span><span class="mr-arrow">↓</span>
        </button>

        <div :class="['mr-accordion-content', { open: accordionOpen }]">
          <template v-for="project in accordionProjects" :key="project.id">
            <div :class="['mr-history-row', { hidden: !isVisible(project) }]">
              <div :class="['mr-history-logo', getStatusClass(project.status), { branded: project.logo }]" @click="openDetails(project.id)">
                <div v-if="project.logo" class="mr-logo-mask" :style="{ '-webkit-mask-image': `url(${project.logo})`, 'mask-image': `url(${project.logo})` }"></div>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </div>
              <div class="mr-history-info">
                <div class="mr-history-top"><span class="mr-history-name">{{ project.title }}</span><span :class="['mr-history-subtitle', getStatusClass(project.status)]">{{ project.subtitle }}</span></div>
                <div class="mr-history-uptime-wrap">
                  <span :class="['mr-history-uptime', getUptimeClass(project.status)]"><span class="mr-ticker"></span><span v-html="getUptime(project)"></span></span>
                  <span class="mr-history-date">Запуск: {{ project.launchDate }}</span>
                </div>
              </div>
              <div class="mr-history-media">
                <button v-if="project.images.length" class="mr-media-btn" @click.stop="openImages(project.id)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span class="mr-media-count">{{ project.images.length }}</span></button>
                <button v-if="project.videos.length" class="mr-media-btn" @click.stop="openVideos(project.id)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span class="mr-media-count">{{ project.videos.length }}</span></button>
              </div>
              <div class="mr-history-build">
                <div :class="['mr-build-block', getStatusClass(project.status)]" @click.stop="openDetails(project.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v8"/><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/><path d="M8 12h8"/></svg>
                  <div class="mr-build-info">
                    <span class="mr-build-label">СБОРКА</span>
                    <span class="mr-build-time">{{ project.buildTime || '--' }}</span>
                  </div>
                  <span class="mr-build-details">ДЕТАЛИ</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Identity Section -->
      <div v-show="identityMode" class="mr-identity-section">
        <!-- Glass Banner -->
        <div class="mr-glass-banner">
          <div class="mr-glass-glow"></div>
          <div class="mr-glass-content">
            <h3 class="mr-glass-title">ДНК бренда в сайте, вывеске и интерьере.</h3>
            <p class="mr-glass-text">Меняет не просто восприятие, а саму реальность вашего бизнеса. Помогает притянуть нужных людей и воплотить смелые идеи.</p>
            <a href="https://orxaos.sbs/ars/" target="_blank" class="mr-glass-btn">Дьявол в деталях</a>
          </div>
        </div>

        <!-- Identity Grid -->
        <div class="mr-identity-grid">
          <div v-for="project in mrBrandedProjects" :key="project.id" class="mr-identity-card" @click="openDetails(project.id)">
            <div class="mr-identity-logo">
              <div v-if="project.logo" class="mr-identity-logo-mask" :style="{ '-webkit-mask-image': `url(${project.logo})`, 'mask-image': `url(${project.logo})` }"></div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <div class="mr-identity-name">{{ project.subtitle }}</div>
            <div class="mr-identity-date">{{ project.launchDate }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Images Modal -->
    <Teleport to="body">
      <div v-if="imagesModalOpen" class="mr-modal-overlay mr-details-overlay" @click.self="closeImagesModal">
        <button class="mr-modal-close mr-desktop-only" @click="closeImagesModal"></button>
        <div class="mr-modal-content mr-gallery-modal">
          <div class="mr-modal-header"><span class="mr-modal-title">{{ currentProject?.title }}</span></div>
          <div class="mr-gallery-section">
            <div class="mr-gallery-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Изображения</div>
            <div class="mr-gallery-slider">
              <div v-for="(img, idx) in currentProject?.images" :key="idx" class="mr-gallery-item" @click="expandImage(idx)">
                <span v-if="!isMediaLoaded(img.src)" class="mr-media-loading">Загрузка...</span>
                <img :src="img.src" :alt="currentProject?.title" :class="['mr-gallery-img', { loaded: isMediaLoaded(img.src) }]" @load="onMediaLoad(img.src)" />
              </div>
            </div>
          </div>
        </div>
        <!-- Expanded image overlay -->
        <div v-if="expandedImageIndex !== null" class="mr-expanded-overlay" @click.self="closeExpandedImage">
          <div class="mr-expanded-content">
            <div class="mr-expanded-image">
              <span v-if="!isMediaLoaded('exp_' + currentProject?.images[expandedImageIndex]?.src)" class="mr-media-loading">Загрузка...</span>
              <img :src="currentProject?.images[expandedImageIndex]?.src" :alt="currentProject?.title" :class="['mr-expanded-img', { loaded: isMediaLoaded('exp_' + currentProject?.images[expandedImageIndex]?.src) }]" @load="onMediaLoad('exp_' + currentProject?.images[expandedImageIndex]?.src)" />
            </div>
            <button class="mr-expanded-back" @click="closeExpandedImage">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Назад к галерее
            </button>
          </div>
        </div>
        <div class="mr-mobile-close"><button class="mr-mobile-close-btn" @click="closeImagesModal">ЗАКРЫТЬ</button></div>
      </div>
    </Teleport>

    <!-- Videos Modal -->
    <Teleport to="body">
      <div v-if="videosModalOpen" class="mr-modal-overlay mr-details-overlay" @click.self="closeVideosModal">
        <button class="mr-modal-close mr-desktop-only" @click="closeVideosModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header"><span class="mr-modal-title">{{ currentProject?.title }}</span></div>
          <div class="mr-details-gallery">
            <div class="mr-details-gallery-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>Видео</div>
            <div class="mr-details-gallery-grid">
              <div v-for="(vid, idx) in currentProject?.videos" :key="'mv'+idx" :class="['mr-details-gallery-item', 'mr-details-gallery-video', { active: modalVideoIdx === idx }]" @click="modalVideoIdx = modalVideoIdx === idx ? null : idx">
                <span v-if="vid.poster && !isMediaLoaded('mv_' + vid.poster)" class="mr-media-loading">Загрузка...</span>
                <img v-if="vid.poster" :src="vid.poster" :alt="currentProject?.title" :class="['mr-details-gallery-thumb', { loaded: isMediaLoaded('mv_' + vid.poster) }]" @load="onMediaLoad('mv_' + vid.poster)" />
                <div v-if="modalVideoIdx !== idx" class="mr-details-gallery-play"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="rgba(255,85,85,0.6)"/><path d="M13 10L22 16L13 22V10Z" fill="#fff"/></svg></div>
                <span v-else class="mr-details-gallery-close-label">Закрыть</span>
              </div>
            </div>
            <div :class="['mr-details-accordion', { open: modalVideoIdx !== null }]">
              <div class="mr-details-accordion-inner">
                <div class="mr-details-video-player">
                  <video v-if="modalVideoIdx !== null" :key="modalVideoIdx" :src="currentProject?.videos[modalVideoIdx]?.src" :poster="currentProject?.videos[modalVideoIdx]?.poster" controls playsinline class="mr-details-video-el"></video>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mr-mobile-close"><button class="mr-mobile-close-btn" @click="closeVideosModal">ЗАКРЫТЬ</button></div>
      </div>
    </Teleport>

    <!-- Details Modal -->
    <Teleport to="body">
      <div v-if="detailsModalOpen" class="mr-modal-overlay mr-details-overlay" @click.self="closeDetailsModal">
        <button :class="['mr-modal-close', 'mr-desktop-only', currentProjectStatusClass]" @click="closeDetailsModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header"><span :class="['mr-modal-title', currentProjectStatusClass]">{{ currentProject?.title }}</span></div>
          <div :class="['mr-details-meta', currentProjectStatusClass]">
            <div class="mr-details-row"><span class="mr-details-label">Клиент</span><span class="mr-details-value accent">{{ currentProject?.subtitle }}</span></div>
            <div v-if="currentProject?.specialization" class="mr-details-row"><span class="mr-details-label">Специализация</span><span class="mr-details-value">{{ currentProject?.specialization }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Статус</span><span class="mr-details-value accent">{{ currentProject?.status }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Дата запуска</span><span class="mr-details-value">{{ currentProject?.launchDate }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Время сборки</span><span class="mr-details-value">{{ currentProject?.buildTime }}</span></div>
            <div v-if="currentProject?.mrBranded" class="mr-details-row"><span class="mr-details-label">Айдентика</span><span class="mr-details-value accent">Модуль Роста®</span></div>
          </div>
          <div v-if="currentProject?.details" :class="['mr-details-description', currentProjectStatusClass]">
            <div class="mr-details-description-label">Детали</div>
            <p class="mr-details-description-text">{{ currentProject?.details }}</p>
          </div>
          <div :class="['mr-details-tags', currentProjectStatusClass]"><span v-for="tag in currentProject?.tags" :key="tag" class="mr-tag">{{ tag }}</span></div>
          <div :class="['mr-details-links', currentProjectStatusClass]">
            <a v-if="currentProject?.website" :href="currentProject.website" target="_blank" class="mr-link primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>{{ currentProject.websiteLabel || 'Открыть сайт' }}</a>
            <a v-if="currentProject?.moduleUrl" :href="currentProject.moduleUrl" target="_blank" class="mr-link secondary">Модуль</a>
            <a v-if="currentProject?.caseUrl" :href="currentProject.caseUrl" target="_blank" class="mr-link secondary">Кейс</a>
            <a v-if="currentProject?.behanceUrl" :href="currentProject.behanceUrl" target="_blank" class="mr-link secondary">Behance</a>
          </div>

          <!-- Inline Gallery -->
          <div v-if="currentProject?.videos.length || currentProject?.images.length" :class="['mr-details-gallery', currentProjectStatusClass]">
            <div class="mr-details-gallery-title">Галерея</div>

            <div v-if="currentProject?.videos.length" class="mr-details-gallery-section">
              <div class="mr-details-gallery-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>Видео</div>
              <div class="mr-details-gallery-grid">
                <div v-for="(vid, idx) in currentProject?.videos" :key="'v'+idx" :class="['mr-details-gallery-item', 'mr-details-gallery-video', { active: detailsVideoIdx === idx }]" @click="detailsVideoIdx = detailsVideoIdx === idx ? null : idx; detailsExpandedIdx = null">
                  <span v-if="vid.poster && !isMediaLoaded(vid.poster)" class="mr-media-loading">Загрузка...</span>
                  <img v-if="vid.poster" :src="vid.poster" :alt="currentProject?.title" :class="['mr-details-gallery-thumb', { loaded: isMediaLoaded(vid.poster) }]" @load="onMediaLoad(vid.poster)" />
                  <div v-if="detailsVideoIdx !== idx" class="mr-details-gallery-play"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="rgba(255,85,85,0.6)"/><path d="M13 10L22 16L13 22V10Z" fill="#fff"/></svg></div>
                  <span v-else class="mr-details-gallery-close-label">Закрыть</span>
                </div>
              </div>
              <div :class="['mr-details-accordion', { open: detailsVideoIdx !== null }]">
                <div class="mr-details-accordion-inner">
                  <div class="mr-details-video-player">
                    <video v-if="detailsVideoIdx !== null" :key="detailsVideoIdx" :src="currentProject?.videos[detailsVideoIdx]?.src" :poster="currentProject?.videos[detailsVideoIdx]?.poster" controls playsinline class="mr-details-video-el"></video>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentProject?.images.length" class="mr-details-gallery-section">
              <div class="mr-details-gallery-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Изображения</div>
              <div class="mr-details-gallery-grid">
                <div v-for="(img, idx) in currentProject?.images" :key="'i'+idx" :class="['mr-details-gallery-item', { active: detailsExpandedIdx === idx }]" @click="detailsExpandedIdx = detailsExpandedIdx === idx ? null : idx; detailsVideoIdx = null">
                  <span v-if="!isMediaLoaded(img.src)" class="mr-media-loading">Загрузка...</span>
                  <img :src="img.src" :alt="currentProject?.title" :class="['mr-details-gallery-thumb', { loaded: isMediaLoaded(img.src) }]" @load="onMediaLoad(img.src)" />
                </div>
              </div>
              <div :class="['mr-details-accordion', { open: detailsExpandedIdx !== null }]">
                <div class="mr-details-accordion-inner">
                  <div class="mr-details-expanded-image">
                    <span v-if="detailsExpandedIdx !== null && !isMediaLoaded('d_' + currentProject?.images[detailsExpandedIdx]?.src)" class="mr-media-loading">Загрузка...</span>
                    <img v-if="detailsExpandedIdx !== null" :key="detailsExpandedIdx" :src="currentProject?.images[detailsExpandedIdx]?.src" :alt="currentProject?.title" :class="['mr-details-expanded-img', { loaded: isMediaLoaded('d_' + currentProject?.images[detailsExpandedIdx]?.src) }]" @load="onMediaLoad('d_' + currentProject?.images[detailsExpandedIdx]?.src)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mr-mobile-close"><button :class="['mr-mobile-close-btn', currentProjectStatusClass]" @click="closeDetailsModal">ЗАКРЫТЬ</button></div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface MediaImage { src: string }
interface MediaVideo { src: string; poster: string }
interface Project { id: string; title: string; subtitle: string; specialization: string; website: string | null; websiteLabel?: string; images: MediaImage[]; videos: MediaVideo[]; tags: string[]; caseUrl: string | null; moduleUrl: string | null; behanceUrl: string | null; launchDate: string; buildTime: string; status: string; mrBranded: boolean; details: string; logo: string | null }

const activeFilter = ref('all')
const loadedMedia = reactive(new Set<string>())
function onMediaLoad(src: string) { loadedMedia.add(src) }
function isMediaLoaded(src: string) { return loadedMedia.has(src) }
const identityMode = ref(false)
const accordionOpen = ref(false)
const imagesModalOpen = ref(false)
const videosModalOpen = ref(false)
const detailsModalOpen = ref(false)
const currentProjectId = ref<string | null>(null)
const videoLoaded = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)
const expandedImageIndex = ref<number | null>(null)
const detailsExpandedIdx = ref<number | null>(null)
const detailsVideoIdx = ref<number | null>(null)
const modalVideoIdx = ref<number | null>(null)

const allProjects = ref<Project[]>([
  { id: 'proj40', title: 'Игровая система для кран-машин', subtitle: 'b00m.fun', specialization: 'Аркадные парки', website: 'https://b00m.fun/', images: [], videos: [], tags: ['Стратегия', 'R&D', 'Автоматизация', 'Бренд', 'Упаковка', 'Веб', 'Анимация', 'CJM', 'Лояльность', 'Стандарты', 'Продажи', 'Торговая среда'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '01.05.2026', buildTime: '', status: 'Скоро запуск', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_01_03_2026.svg' },
  { id: 'proj1', title: 'Б00М! Призотека', subtitle: 'b00m.fun', specialization: 'Аркадные парки', website: 'https://b00m.fun/', images: [{ src: '/gallery/proj1/images/run_b00m.fun_ban_1.jpg' }], videos: [], tags: ['Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Бренд', 'Веб', 'Анимация', 'Видео', 'CJM', 'Лояльность', 'Стандарты', 'Продажи', 'Торговая среда'], caseUrl: '/journal/cases/cifrovaya-prizoteka-dlya-bumastic', moduleUrl: null, behanceUrl: null, launchDate: '30.03.2026', buildTime: '57дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_01_03_2026.svg' },
  { id: 'proj2', title: 'Терминал инвестора', subtitle: 'Optima Space', specialization: 'Сервисные офисы', website: '/optima-space/invest', websiteLabel: 'Смотреть модуль', images: [{ src: '/gallery/proj2/images/run_optima_ban_1.jpg' }], videos: [], tags: ['Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Веб', 'Продажи'], caseUrl: '/journal/cases/kalkulyator-investiciy-dlya-optima-space', moduleUrl: 'https://runscale.ru/optima-space/invest', moduleUrl: null, behanceUrl: null, launchDate: '02.03.2026', buildTime: '10дн', status: 'Запущен', mrBranded: false, details: '', logo: null },
  { id: 'proj3', title: 'Генератор сториз', subtitle: 'Корж', specialization: 'Сеть кофеен', website: 'https://korzhcoffee.ru/', images: [], videos: [], tags: ['R&D'], caseUrl: 'https://cffx.ru/signal/korzh/gift', moduleUrl: null, behanceUrl: null, launchDate: '25.12.2025', buildTime: '10дн', status: 'Запущен', mrBranded: false, details: '', logo: null },
  { id: 'proj4', title: 'Ранний доступ к инвестициям', subtitle: 'Корж', specialization: 'Сеть кофеен', website: 'https://korzhcoffee.ru/', images: [], videos: [], tags: ['R&D'], caseUrl: 'https://cffx.ru/signal/korzh/invest.html', moduleUrl: null, behanceUrl: null, launchDate: '15.12.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false, details: '', logo: null },
  { id: 'proj5', title: 'Конструктор Сигнала', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/pro/reserve.html', images: [], videos: [], tags: ['R&D'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '15.11.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj6', title: 'LTV Калькулятор', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/pro/ltvcalc.html', images: [], videos: [], tags: ['R&D'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '10.11.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj7', title: 'Диалоги Сигнала', subtitle: 'Корж', specialization: 'Сеть кофеен', website: 'https://korzhcoffee.ru/', images: [], videos: [], tags: ['ИИ', 'Чекап', 'R&D', 'Автоматизация', 'Веб', 'Видео'], caseUrl: 'https://cffx.ru/korzh.html', moduleUrl: null, behanceUrl: null, launchDate: '15.10.2025', buildTime: '30дн', status: 'Запущен', mrBranded: false, details: '', logo: null },
  { id: 'proj8', title: 'ИИ-ассистент Анна', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/pro/anna.html', images: [], videos: [], tags: ['ИИ', 'R&D'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '26.09.2025', buildTime: '25дн', status: 'Запущен', mrBranded: false, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj9', title: 'Индекс Роста', subtitle: 'Сигнал – Кофейни', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/invest/smr.html', images: [], videos: [], tags: ['R&D'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '31.08.2025', buildTime: '30дн', status: 'Запущен', mrBranded: false, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj10', title: 'Тикет-система', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Автоматизация', 'Бренд', 'Веб'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '30.08.2025', buildTime: '60дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj11', title: 'Прогноз выручки', subtitle: 'Сигнал – Кофейни', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/invest/calc.html', images: [], videos: [], tags: ['R&D'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '06.08.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj12', title: 'Симулятор Самары', subtitle: 'Сигнал – Кофейни', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/invest/sim.html', images: [], videos: [], tags: ['R&D'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '30.07.2025', buildTime: '15дн', status: 'Запущен', mrBranded: false, details: '', logo: '/ars/id-icons/id_icon_30_08_2025.svg' },
  { id: 'proj13', title: 'БАД', subtitle: 'Bengal Boost', specialization: 'Корма для диких кошек', website: null, images: [], videos: [], tags: ['Чекап', 'Бренд', 'Упаковка'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '20.06.2025', buildTime: '15дн', status: 'Отложен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_20_06_2025.svg' },
  { id: 'proj14', title: 'Игристая брассерия', subtitle: 'BRIMS', specialization: 'Ресторан с морской душой', website: 'https://brims63.ru', images: [], videos: [], tags: ['Чекап', 'Бренд', 'Торговая среда'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '28.02.2025', buildTime: '150дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_28_02_2025.svg' },
  { id: 'proj15', title: 'Юридический профайл', subtitle: 'ЮрТраст', specialization: 'Юридическая компания', website: 'https://jurtrust.ru', images: [], videos: [], tags: ['Бренд', 'Веб'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '23.07.2024', buildTime: '5дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_23_07_2024.svg' },
  { id: 'proj16', title: 'Захват контактов', subtitle: 'Конкордия-Авто', specialization: 'Импорт автомобилей', website: 'https://konkordia-auto.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Стандарты', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/kak-ii-resheniya-pomogayut-povysit-effektivnost-zaprosa-kontaktov-klientov.html', moduleUrl: null, behanceUrl: null, launchDate: '26.05.2024', buildTime: '20дн', status: 'Отложен', mrBranded: false, details: 'ИИ-модуль и сценарии для запроса контактов: стандарты формулировок, работа с возражениями и повторные попытки, резюме звонков в Telegram.', logo: null },
  { id: 'proj17', title: 'ИИ-трекер качества', subtitle: 'Конкордия-Авто', specialization: 'Импорт автомобилей', website: 'https://konkordia-auto.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/kak-ii-assistenty-pomogayut-uluchshat-prodazhi.html', moduleUrl: null, behanceUrl: null, launchDate: '06.05.2024', buildTime: '35дн', status: 'Отложен', mrBranded: false, details: 'ИИ-ассистент анализирует активность менеджеров, фиксирует динамику и даёт персональные рекомендации по развитию навыков и повышению конверсии.', logo: null },
  { id: 'proj18', title: 'Автопилот продаж', subtitle: 'Конкордия-Авто', specialization: 'Импорт автомобилей', website: 'https://konkordia-auto.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Стандарты', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/kak-modul-rosta-avtomatiziroval-prodazhi-dlya-konkordiya-avto.html', moduleUrl: null, behanceUrl: null, launchDate: '31.03.2024', buildTime: '30дн', status: 'Отложен', mrBranded: false, details: 'CRM-воронка с автозадачами, DISC-типирование, скрипты и регламенты по типам клиентов, аналитика сделок и автоматизированные отчёты.', logo: null },
  { id: 'proj19', title: 'Конструктор туров', subtitle: 'Август Глэмпинг', specialization: 'Глэмпинг', website: 'https://augustglamping.ru', images: [], videos: [], tags: ['Чекап', 'R&D', 'Автоматизация', 'Бренд', 'Веб', 'Продажи'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '30.09.2023', buildTime: '60дн', status: 'Отложен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_30_09_2023.svg' },
  { id: 'proj20', title: 'Архитектурное портфолио', subtitle: 'Tanurkova Arch Design', specialization: 'Архитектурное бюро', website: null, images: [{ src: '/gallery/proj20/images/tanurkova-main-desktop.jpg' }, { src: '/gallery/proj20/images/tanurkova-insta-profile-pack.jpg' }], videos: [{ src: '/gallery/proj20/videos/buroarchdesign_com.mp4', poster: '/gallery/proj20/videos/buroarchdesign_com.jpg' }, { src: '/gallery/proj20/videos/tanurkova-logo-reveal.mp4', poster: '/gallery/proj20/videos/tanurkova-logo-reveal.jpg' }], tags: ['Бренд', 'Веб', 'Анимация', 'Видео'], caseUrl: null, moduleUrl: null, behanceUrl: 'https://www.behance.net/gallery/175565499/Tanurkova-Arch-Design-Identity-Website', launchDate: '09.09.2023', buildTime: '70дн', status: 'Отложен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_09_09_2023.svg' },
  { id: 'proj21', title: 'Цифровое наследие', subtitle: 'Фонд Хворостовского', specialization: 'Благотворительный фонд', website: 'https://hvorostovsky.com', images: [{ src: '/gallery/proj21/images/dhf_main_desktop.jpg' }, { src: '/gallery/proj21/images/hvorostovsky_main_desktop.jpg' }], videos: [{ src: '/gallery/proj21/videos/intro_hvorostovsky_foundation.mp4', poster: '/gallery/proj21/videos/intro_hvorostovsky_foundation.jpg' }, { src: '/gallery/proj21/videos/hvorostovsky-timeline.mp4', poster: '/gallery/proj21/videos/hvorostovsky-timeline.jpg' }], tags: ['Автоматизация', 'Бренд', 'Веб', 'Видео'], caseUrl: 'https://runscale.ru/journal/cases/kak-my-prevratili-nasledie-khvorostovskogo-v-instrument-dlya-pomoshi-detyam.html', moduleUrl: null, behanceUrl: 'https://www.behance.net/gallery/175592297/sajt-fonda-hvorostovskogo', launchDate: '27.06.2023', buildTime: '40дн', status: 'Запущен', mrBranded: true, details: 'Новый сайт с базой событий и историй детей, «Линией времени», медиатекой и приёмом пожертвований через RoboKassa.', logo: '/ars/id-icons/id_icon_27_06_2023.svg' },
  { id: 'proj22', title: 'Бассейн мечты', subtitle: 'Блумкидс', specialization: 'Детский бассейн', website: null, images: [], videos: [{ src: '/gallery/proj22/videos/bloomkids_video.mp4', poster: '/gallery/proj22/videos/bloomkids_video.jpg' }], tags: ['Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Бренд', 'Веб', 'Анимация', 'Видео', 'CJM', 'Лояльность', 'Продажи', 'Торговая среда'], caseUrl: 'https://runscale.ru/journal/cases/sozdayom-bassein-mechty.html', moduleUrl: null, behanceUrl: 'https://www.behance.net/gallery/175530883/blumkids-ajdentika-i-veb-sajt', launchDate: '10.12.2022', buildTime: '235дн', status: 'Отложен', mrBranded: true, details: 'Воронка продаж абонементов, матрица программ, система лояльности, регламенты персонала и сайт для записи и коммуникаций.', logo: '/ars/id-icons/id_icon_10_12_2022.svg' },
  { id: 'proj23', title: 'Фитнес-экосистема', subtitle: 'FIZ Культура', specialization: 'Сеть фитнес-клубов', website: 'https://fizkultura63.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'CJM', 'Лояльность', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/delaem-fitnes-personalnym.html', moduleUrl: null, behanceUrl: null, launchDate: '12.05.2022', buildTime: '110дн', status: 'Отложен', mrBranded: false, details: 'Новый формат «сухой фитнес + SPA», сегментация, CJM, бонусная и реферальная системы, программа адаптации и ТЗ на приложение.', logo: null },
  { id: 'proj24', title: 'Платформа события', subtitle: 'World Plastics Summit 2022', specialization: 'Международный саммит', website: null, images: [{ src: '/gallery/proj24/images/wps-web.jpg' }], videos: [{ src: '/gallery/proj24/videos/wps-website.mp4', poster: '/gallery/proj24/videos/wps-website.jpg' }, { src: '/gallery/proj24/videos/wps22-main-movie_sd.mp4', poster: '/gallery/proj24/videos/wps22-main-movie_sd.jpg' }], tags: ['Чекап', 'Стратегия', 'Бренд', 'Веб', 'Анимация', 'Видео'], caseUrl: 'https://runscale.ru/journal/cases/kak-obedinit-nauku-iskusstvo-i-kommunikaciyu-dlya-resheniya-globalnoi-problemy.html', moduleUrl: null, behanceUrl: 'https://www.behance.net/gallery/156308617/World-Plastics-Summit-Brand-Identity-Website', launchDate: '24.03.2022', buildTime: '50дн', status: 'Запущен', mrBranded: true, details: 'Манифест саммита, логотип, айдентика, бренд-видео и сайт-сервис для участников.', logo: '/ars/id-icons/id_icon_24_03_2022.svg' },
  { id: 'proj25', title: 'Крафт-франшиза', subtitle: 'Ермолаевъ', specialization: 'Сеть магазинов пивоварни', website: 'https://ermolaev.beer/', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Продажи', 'Торговая среда'], caseUrl: 'https://runscale.ru/journal/cases/bolshuyu-svetlyi-lager-khelles.html', moduleUrl: null, behanceUrl: null, launchDate: '27.12.2021', buildTime: '70дн', status: 'Отложен', mrBranded: false, details: 'Новый формат магазинов-баров: зонирование, пивная матрица 25–30 SKU, финмодель с рентабельностью 20%+ и окупаемостью до 1,5 лет.', logo: null },
  { id: 'proj26', title: 'Образовательный профайл', subtitle: 'Modelex Education', specialization: 'Школа', website: 'https://modelex.mc', images: [{ src: '/gallery/proj26/images/modelex-web.jpg' }], videos: [], tags: ['Стратегия', 'Бренд', 'Веб'], caseUrl: null, moduleUrl: null, behanceUrl: 'https://www.behance.net/gallery/175486955/Modelex-Identity-Website', launchDate: '01.06.2021', buildTime: '90дн', status: 'Запущен', mrBranded: true, details: 'Курсы, преподаватели, расписание, отзывы и айдентика для набора учеников.', logo: '/ars/id-icons/id_icon_01_06_2021.svg' },
  { id: 'proj27', title: 'Культурный профайл', subtitle: 'GALA RUSSE', specialization: 'Организация культурных событий', website: null, images: [{ src: '/gallery/proj27/images/gala-russe-main-desktop.jpg' }, { src: '/gallery/proj27/images/galarusse-web.jpg' }], videos: [{ src: '/gallery/proj27/videos/gala_russe_icon_reveal.mp4', poster: '/gallery/proj27/videos/gala_russe_icon_reveal.jpg' }], tags: ['Стратегия', 'Бренд', 'Веб', 'Видео'], caseUrl: null, moduleUrl: null, behanceUrl: 'https://www.behance.net/gallery/175498363/GALA-RUSSE-Identity-website', launchDate: '02.04.2021', buildTime: '60дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_02_04_2021.svg' },
  { id: 'proj28', title: 'Новый персонаж', subtitle: 'Желток Белток', specialization: 'Аксайская птицефабрика', website: null, images: [], videos: [], tags: ['Бренд', 'Упаковка'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '18.11.2020', buildTime: '55дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_18_11_2020.svg' },
  { id: 'proj29', title: 'Сервисный профайл', subtitle: 'EASYBUSY', specialization: 'Консьерж-сервис', website: 'https://easybusy.fr/', images: [{ src: '/gallery/proj29/images/easyhome-main-desktop.jpg' }], videos: [], tags: ['Стратегия', 'Бренд', 'Веб'], caseUrl: null, moduleUrl: null, behanceUrl: 'https://behance.net/orxaos', launchDate: '21.09.2020', buildTime: '60дн', status: 'Запущен', mrBranded: true, details: 'Сайт с описанием сервисов, тарифов, кейсов и контактов для онбординга B2B-клиентов.', logo: '/ars/id-icons/id_icon_21_09_2020.svg' },
  { id: 'proj30', title: 'Маркетинговый контур', subtitle: 'SMSTRETCHING', specialization: 'Сеть студий стретчинга', website: 'https://smstretching.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Автоматизация', 'Веб', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/avtomatiziruem-marketing-fitnesa.html', moduleUrl: null, behanceUrl: null, launchDate: '02.03.2020', buildTime: '30дн', status: 'Отложен', mrBranded: false, details: 'Сквозная аналитика, интеграция amoCRM ↔ 1C Фитнес, 12 триггерных email-цепочек.', logo: null },
  { id: 'proj31', title: 'Цифровая витрина', subtitle: 'WOODLED', specialization: 'Производитель дизайнерских светильников', website: 'https://woodled.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Упаковка', 'Веб', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/lakonichnyi-ekodizain-dlya-komfortnoi-zhizni.html', moduleUrl: null, behanceUrl: null, launchDate: '16.02.2020', buildTime: '60дн', status: 'Запущен', mrBranded: false, details: 'Новый сайт-витрина и интернет-магазин, каталог 3D-моделей, упаковка для Rotor.', logo: null },
  { id: 'proj32', title: 'Новая стратегия', subtitle: 'SMSTRETCHING', specialization: 'Сеть студий стретчинга', website: 'https://smstretching.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/trenirovki-kak-v-studii-tolko-doma.html', moduleUrl: null, behanceUrl: null, launchDate: '08.02.2020', buildTime: '130дн', status: 'Запущен', mrBranded: false, details: '', logo: null },
  { id: 'proj33', title: 'Витрина бренда', subtitle: 'RAW BITES', specialization: 'Продукты питания', website: null, images: [], videos: [], tags: ['Бренд', 'Упаковка', 'Веб', 'Продажи'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '30.11.2019', buildTime: '90дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_30_11_2019.svg' },
  { id: 'proj34', title: 'Конструктор праздника', subtitle: 'СУПЕРЛЕНД', specialization: 'Сеть детских развлекательных центров', website: 'https://superland.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'R&D', 'CJM'], caseUrl: 'https://runscale.ru/journal/cases/sozdayom-nezabyvaemye-vpechatleniya-dlya-vsei-semi.html', moduleUrl: null, behanceUrl: null, launchDate: '22.08.2018', buildTime: '50дн', status: 'Отложен', mrBranded: false, details: 'Онлайн-калькулятор банкетов, система пакетных предложений и торговые маршруты семьи (CJM).', logo: null },
  { id: 'proj35', title: 'Фирменный магазин', subtitle: 'Dymicana', specialization: 'GoPro - Казань', website: null, images: [], videos: [], tags: [], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '18.11.2016', buildTime: '90дн', status: 'Запущен', mrBranded: false, details: '', logo: null },
  { id: 'proj36', title: 'Запуск на полку', subtitle: 'Чишминский', specialization: 'Молочный завод', website: null, images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Бренд', 'Упаковка', 'Веб', 'Лояльность', 'Продажи', 'Торговая среда'], caseUrl: 'https://runscale.ru/journal/cases/slavim-tradicii-kachestva.html', moduleUrl: null, behanceUrl: null, launchDate: '01.06.2016', buildTime: '150дн', status: 'Запущен', mrBranded: true, details: 'Ассортиментная матрица ~75 SKU, ценовая стратегия, новая упаковка, система лояльности и план входа в сети.', logo: '/ars/id-icons/id_icon_01_06_2016.svg' },
  { id: 'proj37', title: 'Единая доставка', subtitle: 'Milimon', specialization: 'Сеть ресторанов', website: 'https://milimon.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Автоматизация', 'Веб', 'Стандарты', 'Продажи'], caseUrl: 'https://runscale.ru/journal/cases/uskoryaem-dostavku-edy.html', moduleUrl: null, behanceUrl: null, launchDate: '01.04.2016', buildTime: '60дн', status: 'Запущен', mrBranded: false, details: 'Единый колл-центр, карта покрытия, стандарты для курьеров, система оценок и онлайн-магазин.', logo: null },
  { id: 'proj38', title: 'Центр психологической помощи', subtitle: 'Школа Позитивной Психологии', specialization: 'Образовательный проект', website: null, images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Бренд', 'Торговая среда'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '01.06.2011', buildTime: '95дн', status: 'Отложен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_01_06_2011.svg' },
  { id: 'proj39', title: 'Ресторан и Гриль', subtitle: 'Морошка', specialization: 'Семейный ресторан', website: null, images: [], videos: [], tags: ['Бренд', 'Упаковка', 'Веб', 'Торговая среда'], caseUrl: null, moduleUrl: null, behanceUrl: null, launchDate: '01.11.2010', buildTime: '125дн', status: 'Запущен', mrBranded: true, details: '', logo: '/ars/id-icons/id_icon_01_11_2010.svg' }
])

const averageBuildTime = computed(() => {
  const times = allProjects.value.map(p => parseInt(p.buildTime)).filter(t => !isNaN(t))
  return times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
})

const currentProject = computed(() => currentProjectId.value ? allProjects.value.find(p => p.id === currentProjectId.value) : null)
const currentProjectStatusClass = computed(() => currentProject.value ? getStatusClass(currentProject.value.status) : '')
const filteredProjects = computed(() => { if (activeFilter.value === 'all') return allProjects.value; const m: Record<string, string> = { soon: 'Скоро запуск', orbit: 'Запущен', grounded: 'Отложен' }; return allProjects.value.filter(p => p.status === m[activeFilter.value]) })
const accordionProjects = computed(() => filteredProjects.value.slice(5))
const mrBrandedProjects = computed(() => allProjects.value.filter(p => p.mrBranded))

function countByStatus(s: string) { return allProjects.value.filter(p => p.status === s).length }
function filterStatus(s: string) { if (identityMode.value) identityMode.value = false; activeFilter.value = s; accordionOpen.value = false }
function toggleIdentityMode() { identityMode.value = !identityMode.value; if (identityMode.value) activeFilter.value = 'all' }
function toggleAccordion() { accordionOpen.value = !accordionOpen.value }
function isVisible(p: Project) { if (activeFilter.value === 'all') return true; const m: Record<string, string> = { soon: 'Скоро запуск', orbit: 'Запущен', grounded: 'Отложен' }; return p.status === m[activeFilter.value] }
function getStatusClass(s: string) { if (s === 'Скоро запуск') return 'soon'; if (s === 'Запущен') return 'orbit'; return 'grounded' }
function pluralize(n: number, one: string, few: string, many: string) { const mod100 = Math.abs(n) % 100; const mod10 = mod100 % 10; if (mod100 >= 11 && mod100 <= 19) return many; if (mod10 === 1) return one; if (mod10 >= 2 && mod10 <= 4) return few; return many }
function getUptimeClass(s: string) { if (s === 'Скоро запуск') return 'soon'; if (s === 'Отложен') return 'grounded'; return '' }

function getUptime(p: Project): string {
  if (p.status === 'Скоро запуск') {
    const m = p.launchDate.match(/(\d{2})\.(\d{2})\.(\d{4})/)
    if (m) {
      const launch = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]))
      const now = new Date()
      const diff = Math.max(0, Math.floor((launch.getTime() - now.getTime()) / 1000))
      const d = Math.floor(diff / 86400), h = Math.floor((diff % 86400) / 3600), min = Math.floor((diff % 3600) / 60)
      return `${d}дн:${h}ч:${min}мин`
    }
    return 'T-30дн'
  }
  if (p.status === 'Отложен') return '--:--'
  const m = p.launchDate.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (m) {
    const launch = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]))
    const now = new Date()
    let months = (now.getFullYear() - launch.getFullYear()) * 12 + (now.getMonth() - launch.getMonth())
    if (now.getDate() < parseInt(m[1])) months--
    const y = Math.floor(months / 12), mo = months % 12
    const yWord = y === 1 ? 'год' : (y >= 2 && y <= 4) ? 'года' : 'лет'
    if (y >= 1) return mo > 0 ? `${y} ${yWord} ${mo} мес` : `${y}+ ${yWord}`
    if (mo > 0) return `${mo} мес`
    const days = Math.floor((now.getTime() - launch.getTime()) / 86400000)
    return `${days} дн`
  }
  return '1+ год'
}

function openImages(id: string) { currentProjectId.value = id; expandedImageIndex.value = null; imagesModalOpen.value = true; document.body.style.overflow = 'hidden' }
function closeImagesModal() { imagesModalOpen.value = false; expandedImageIndex.value = null; document.body.style.overflow = '' }
function expandImage(idx: number) { expandedImageIndex.value = idx }
function closeExpandedImage() { expandedImageIndex.value = null }

function openVideos(id: string) { currentProjectId.value = id; videoLoaded.value = false; modalVideoIdx.value = null; videosModalOpen.value = true; document.body.style.overflow = 'hidden' }
function closeVideosModal() { videosModalOpen.value = false; videoLoaded.value = false; modalVideoIdx.value = null; document.body.style.overflow = ''; if (videoEl.value) videoEl.value.pause() }
function initVideo() { videoLoaded.value = true }
function onVideoEnded() { videoLoaded.value = false }

function openDetails(id: string) { currentProjectId.value = id; detailsExpandedIdx.value = null; detailsVideoIdx.value = null; detailsModalOpen.value = true; document.body.style.overflow = 'hidden' }
function closeDetailsModal() { detailsModalOpen.value = false; detailsExpandedIdx.value = null; detailsVideoIdx.value = null; document.body.style.overflow = '' }
</script>

<style scoped>
.mr-history-section { padding: 80px 24px 130px; overflow-x: hidden; }
.mr-history-container { max-width: 1100px; margin: 0 auto; }
.mr-history-header { margin-bottom: 24px; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 500; color: #fff; }

/* Average Build Time */
.mr-avg-time { display: inline-flex; align-items: center; gap: 12px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 6px; padding: 10px 16px; margin-bottom: 24px; font-family: 'JetBrains Mono', monospace; }
.mr-avg-label { font-size: 11px; color: rgba(0, 255, 136, 0.7); text-transform: uppercase; letter-spacing: 1px; }
.mr-avg-value { font-size: 18px; color: rgb(0, 255, 136); font-weight: 600; }

/* Filters */
.mr-history-filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
.mr-filter-btn { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: rgba(17, 17, 17, 0.5) !important; border: 1px solid #222 !important; border-radius: 8px; color: #888 !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease; text-decoration: none !important; }
.mr-filter-btn:hover { border-color: #555 !important; color: #fff !important; }
.mr-filter-btn::before, .mr-filter-btn::after { display: none !important; content: none !important; }
.mr-filter-btn.active { border-color: white !important; color: white !important; background: rgba(255, 255, 255, 0.1) !important; }
.mr-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.mr-dot.blue { background: #58a6ff; }
.mr-dot.green { background: rgb(0, 255, 136); }
.mr-dot.gray { background: #7d8590; }
.mr-count { font-size: 10px; color: #555; }

.mr-identity-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; background: #ff5555 !important; border: none !important; border-radius: 8px; color: #000 !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; margin-left: auto; text-decoration: none !important; box-shadow: 0 4px 15px rgba(255, 85, 85, 0.4); }
.mr-identity-btn:hover, .mr-identity-btn.active { background: #fff !important; color: #ff5555 !important; box-shadow: 0 0 30px rgba(255, 85, 85, 0.6); }
.mr-identity-btn::before, .mr-identity-btn::after { display: none !important; content: none !important; }
.mr-identity-btn svg { flex-shrink: 0; }
.mr-identity-btn-icon { width: 24px; height: 24px; flex-shrink: 0; background-color: currentColor; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }

@media (max-width: 900px) {
  .mr-history-filters { flex-direction: column; align-items: stretch; }
  .mr-identity-btn { margin-left: 0; width: 100%; justify-content: center; }
}

/* Table */
.mr-history-table { background: rgba(26, 26, 26, 0.8); border: 1px solid #222; border-radius: 8px; overflow: hidden; }
.mr-history-row { display: grid; grid-template-columns: 90px 1fr auto 160px; align-items: center; padding: 16px 32px; border-bottom: 1px solid #222; transition: all 0.3s ease; gap: 20px; cursor: pointer; }
.mr-history-row:hover { background: rgba(0, 255, 136, 0.02); }
.mr-history-row.hidden { display: none; }

@media (max-width: 900px) {
  .mr-history-row { grid-template-columns: 70px 1fr auto; padding: 12px 20px; gap: 16px; }
  .mr-history-row .mr-history-build { display: none; }
}

@media (max-width: 600px) {
  .mr-history-row { grid-template-columns: 56px 1fr auto; padding: 12px 16px; gap: 14px; }
  .mr-history-logo { width: 48px !important; height: 48px !important; }
  .mr-history-logo svg { width: 22px !important; height: 22px !important; }
  .mr-history-name { font-size: 14px !important; }
}

/* Logo */
.mr-history-logo { width: 64px; height: 64px; border: 2px solid #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease; position: relative; cursor: pointer; color: rgb(0, 255, 136); }
.mr-history-logo svg { color: rgb(0, 255, 136); }
.mr-logo-mask { width: 100%; height: 100%; background-color: currentColor; -webkit-mask-size: 80%; mask-size: 80%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }
.mr-history-row:hover .mr-history-logo { border-color: rgb(0, 255, 136); box-shadow: 0 0 30px rgba(0, 255, 136, 0.4); }
.mr-history-logo.soon { border-color: rgba(88, 166, 255, 0.3); color: #58a6ff; }
.mr-history-logo.soon svg { color: #58a6ff; }
.mr-history-row:hover .mr-history-logo.soon { border-color: #58a6ff; box-shadow: 0 0 30px rgba(88, 166, 255, 0.3); }
.mr-history-logo.grounded { border-color: rgba(125, 133, 144, 0.3); color: #7d8590; }
.mr-history-logo.grounded svg { color: #7d8590; }
.mr-history-row:hover .mr-history-logo.grounded { border-color: #7d8590; box-shadow: 0 0 30px rgba(125, 133, 144, 0.3); }
.mr-history-logo.branded::before, .mr-history-logo.branded::after { content: ''; position: absolute; inset: -2px; border: 2px solid rgb(0, 255, 136); border-radius: 14px; opacity: 0; animation: mr-radar 8s ease-out infinite; pointer-events: none; }
.mr-history-logo.branded::after { animation-delay: 4s; }
.mr-history-logo.branded.soon::before, .mr-history-logo.branded.soon::after { border-color: #58a6ff; }
.mr-history-logo.branded.grounded::before, .mr-history-logo.branded.grounded::after { border-color: #7d8590; }
@keyframes mr-radar { 0% { transform: scale(1); opacity: 0; } 10% { transform: scale(1.05); opacity: 0.4; } 100% { transform: scale(1.6); opacity: 0; } }

/* Info */
.mr-history-info { min-width: 0; flex: 1; }
.mr-history-top { display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px; }
.mr-history-name { font-weight: 600; color: #fff; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mr-history-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; }
.mr-history-subtitle.soon { color: #58a6ff; }
.mr-history-subtitle.orbit { color: rgb(0, 255, 136); }
.mr-history-subtitle.grounded { color: #7d8590; }

/* Uptime */
.mr-history-uptime-wrap { display: flex; flex-direction: column; gap: 2px; }
.mr-history-uptime { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fff; font-weight: 700; background: linear-gradient(90deg, rgba(0, 255, 136, 0.1), transparent); padding: 4px 10px 4px 8px; border-left: 3px solid rgb(0, 255, 136); border-radius: 0 4px 4px 0; white-space: nowrap; }
.mr-ticker { width: 6px; height: 6px; background: rgb(0, 255, 136); border-radius: 50%; animation: mr-ticker-blink 1s infinite; flex-shrink: 0; }
@keyframes mr-ticker-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.mr-history-uptime.soon { background: linear-gradient(90deg, rgba(88, 166, 255, 0.1), transparent); border-left-color: #58a6ff; }
.mr-history-uptime.soon .mr-ticker { background: #58a6ff; }
.mr-history-uptime.grounded { background: linear-gradient(90deg, rgba(125, 133, 144, 0.1), transparent); border-left-color: #7d8590; }
.mr-history-uptime.grounded .mr-ticker { background: #7d8590; animation: none; }
.mr-history-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #555; padding-left: 11px; }

/* Media buttons */
.mr-history-media { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.mr-media-btn { width: 40px; height: 40px; background: transparent !important; border: 1px solid rgba(255, 85, 85, 0.3) !important; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; position: relative; flex-shrink: 0; text-decoration: none !important; }
.mr-media-btn:hover { border-color: #ff5555 !important; background: rgba(255, 85, 85, 0.1) !important; transform: scale(1.05); }
.mr-media-btn::before, .mr-media-btn::after { display: none !important; content: none !important; }
.mr-media-btn svg { width: 16px; height: 16px; color: #ff5555; }
.mr-media-count { position: absolute; top: -4px; right: -4px; min-width: 14px; height: 14px; padding: 0 3px; background: #ff5555; color: white; border-radius: 7px; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Build block */
.mr-history-build { display: flex; align-items: center; flex-shrink: 0; min-width: 140px; }
.mr-build-block { display: flex; align-items: center; gap: 10px; padding: 8px 14px; background: transparent !important; border: 2px solid rgb(0, 255, 136) !important; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; text-decoration: none !important; position: relative; min-width: 140px; }
.mr-build-block::before, .mr-build-block::after { display: none !important; content: none !important; }
.mr-build-block svg { color: rgb(0, 255, 136); flex-shrink: 0; width: 16px; height: 16px; }
.mr-build-info { display: flex; flex-direction: column; gap: 0; transition: opacity 0.2s ease; }
.mr-build-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #555; text-transform: uppercase; line-height: 1.2; }
.mr-build-time { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #fff; font-weight: 700; line-height: 1.2; }
.mr-build-details { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; color: rgb(0, 255, 136); opacity: 0; transition: opacity 0.2s ease; }
.mr-build-block:hover .mr-build-info { opacity: 0; }
.mr-build-block:hover .mr-build-details { opacity: 1; }
.mr-build-block:hover { background: rgba(0, 255, 136, 0.1) !important; box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }
.mr-build-block.soon { border-color: #58a6ff !important; }
.mr-build-block.soon svg { color: #58a6ff; }
.mr-build-block.soon .mr-build-details { color: #58a6ff; }
.mr-build-block.soon:hover { background: rgba(88, 166, 255, 0.1) !important; box-shadow: 0 0 20px rgba(88, 166, 255, 0.3); }
.mr-build-block.grounded { border-color: #7d8590 !important; }
.mr-build-block.grounded svg { color: #7d8590; }
.mr-build-block.grounded .mr-build-details { color: #7d8590; }
.mr-build-block.grounded:hover { background: rgba(125, 133, 144, 0.1) !important; box-shadow: 0 0 20px rgba(125, 133, 144, 0.3); }

/* Accordion */
.mr-accordion-toggle { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px; background: transparent !important; border: none !important; border-top: 1px solid #222 !important; color: #888 !important; font-family: 'JetBrains Mono', monospace; font-size: 13px; cursor: pointer; width: 100%; transition: all 0.3s ease; text-decoration: none !important; }
.mr-accordion-toggle:hover { background: rgba(0, 255, 136, 0.02) !important; color: rgb(0, 255, 136) !important; }
.mr-accordion-toggle::before, .mr-accordion-toggle::after { display: none !important; content: none !important; }
.mr-arrow { transition: transform 0.3s ease; }
.mr-accordion-toggle.open .mr-arrow { transform: rotate(180deg); }
.mr-accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
.mr-accordion-content.open { max-height: 10000px; }

/* Identity Section */
.mr-identity-section { display: flex; flex-direction: column; gap: 32px; }

/* Glass Banner */
.mr-glass-banner { position: relative; border-radius: 16px; padding: 2px; overflow: hidden; background: rgba(255, 85, 85, 0.12); }
.mr-glass-glow { position: absolute; top: 50%; left: 50%; width: 120vmax; height: 120vmax; background: conic-gradient(from 0deg, transparent 0%, rgba(255, 85, 85, 0.5) 8%, transparent 18%, transparent 48%, rgba(255, 85, 85, 0.3) 55%, transparent 65%, transparent 100%); animation: mr-glow-spin 6s linear infinite; z-index: 0; pointer-events: none; }
@keyframes mr-glow-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
.mr-glass-content { position: relative; z-index: 1; background: rgba(17, 17, 17, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 14px; padding: 40px 48px; }
.mr-glass-title { font-size: clamp(20px, 3vw, 26px); font-weight: 600; color: #fff; margin: 0 0 16px; line-height: 1.3; }
.mr-glass-text { font-size: 15px; line-height: 1.7; color: rgba(255, 85, 85, 0.7); margin: 0 0 28px; max-width: 640px; }
.mr-glass-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: #ff5555 !important; border: none !important; border-radius: 10px; color: #000 !important; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; text-decoration: none !important; box-shadow: 0 4px 20px rgba(255, 85, 85, 0.4); }
.mr-glass-btn:hover { background: #fff !important; color: #ff5555 !important; box-shadow: 0 0 40px rgba(255, 85, 85, 0.6); transform: translateY(-2px); }
.mr-glass-btn::before, .mr-glass-btn::after { display: none !important; content: none !important; }

@media (max-width: 600px) {
  .mr-glass-content { padding: 28px 24px; }
  .mr-glass-text { font-size: 14px; }
  .mr-glass-btn { width: 100%; justify-content: center; }
}

/* Identity Grid */
.mr-identity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 800px) { .mr-identity-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .mr-identity-grid { grid-template-columns: 1fr; } }
.mr-identity-card { background: linear-gradient(180deg, rgba(255, 85, 85, 0.15), transparent); border: 2px solid rgba(255, 85, 85, 0.3); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.4s ease; cursor: pointer; }
.mr-identity-card:hover { background: #ff5555; border-color: #ff5555; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(255, 85, 85, 0.3); }
.mr-identity-logo { width: 120px; height: 120px; border: 3px solid rgba(255, 85, 85, 0.3); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; transition: all 0.3s ease; overflow: hidden; color: #ff5555; }
.mr-identity-logo svg { color: #ff5555; transition: color 0.3s ease; }
.mr-identity-logo-mask { width: 100%; height: 100%; background-color: currentColor; -webkit-mask-size: 96%; mask-size: 96%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; transition: background-color 0.3s ease; }
.mr-identity-card:hover .mr-identity-logo-mask { background-color: #000; }
.mr-identity-card:hover .mr-identity-logo { border-color: rgba(0, 0, 0, 0.2); color: #000; }
.mr-identity-card:hover .mr-identity-logo svg { color: #000; }
.mr-identity-name { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 8px; transition: color 0.3s ease; }
.mr-identity-card:hover .mr-identity-name { color: #000; }
.mr-identity-date { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #555; transition: color 0.3s ease; }
.mr-identity-card:hover .mr-identity-date { color: rgba(0, 0, 0, 0.6); }

/* Modals */
.mr-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: flex-start; justify-content: center; padding: 40px; padding-bottom: 100px; overflow-y: auto; }
.mr-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: transparent !important; border: 2px solid #ff5555 !important; color: #ff5555 !important; cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; }
.mr-details-overlay { backdrop-filter: none; -webkit-backdrop-filter: none; }
.mr-details-overlay::before { content: ''; position: fixed; inset: 0; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: -1; }
.mr-modal-close::before, .mr-modal-close::after { content: ''; position: absolute; top: 50%; left: 50%; width: 36px; height: 2px; background: currentColor; }
.mr-modal-close::before { transform: translate(-50%, -50%) rotate(45deg); }
.mr-modal-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
.mr-modal-close:hover { background: #ff5555 !important; color: #000 !important; }
.mr-modal-close.soon { border-color: #58a6ff !important; color: #58a6ff !important; }
.mr-modal-close.soon:hover { background: #58a6ff !important; color: #000 !important; }
.mr-modal-close.orbit { border-color: rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; }
.mr-modal-close.orbit:hover { background: rgb(0, 255, 136) !important; color: #000 !important; }
.mr-modal-close.grounded { border-color: #7d8590 !important; color: #7d8590 !important; }
.mr-modal-close.grounded:hover { background: #7d8590 !important; color: #000 !important; }

.mr-modal-content { max-width: 900px; width: 100%; margin-top: 60px; }
.mr-modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.mr-modal-title { font-size: 28px; font-weight: 600; color: #ff5555; }
.mr-modal-title.soon { color: #58a6ff; }
.mr-modal-title.orbit { color: rgb(0, 255, 136); }
.mr-modal-title.grounded { color: #7d8590; }

/* Mobile close */
.mr-mobile-close { display: none; }
@media (max-width: 768px) {
  .mr-desktop-only { display: none !important; }
  .mr-modal-overlay { padding: 20px; padding-bottom: 80px; }
  .mr-modal-content { margin-top: 20px; }
  .mr-details-gallery { padding-bottom: 60px; }
  .mr-mobile-close { display: block; position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: #000; z-index: 10002; }
  .mr-mobile-close-btn { width: 100%; padding: 16px; background: #000 !important; border: 2px solid #ff5555 !important; color: #ff5555 !important; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 2px; border-radius: 8px; cursor: pointer; text-decoration: none !important; }
  .mr-mobile-close-btn:hover { background: #ff5555 !important; color: #000 !important; }
  .mr-mobile-close-btn::before, .mr-mobile-close-btn::after { display: none !important; content: none !important; }
  .mr-mobile-close-btn.soon { border-color: #58a6ff !important; color: #58a6ff !important; }
  .mr-mobile-close-btn.soon:hover { background: #58a6ff !important; color: #000 !important; }
  .mr-mobile-close-btn.orbit { border-color: rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; }
  .mr-mobile-close-btn.orbit:hover { background: rgb(0, 255, 136) !important; color: #000 !important; }
  .mr-mobile-close-btn.grounded { border-color: #7d8590 !important; color: #7d8590 !important; }
  .mr-mobile-close-btn.grounded:hover { background: #7d8590 !important; color: #000 !important; }
}

/* Details Inline Gallery */
.mr-details-gallery { margin-top: 40px; }
.mr-details-gallery-title { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: #ff5555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
.mr-details-gallery-section { margin-bottom: 24px; }
.mr-details-gallery-section:last-child { margin-bottom: 0; }
.mr-details-gallery-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ff5555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.mr-details-gallery-label svg { width: 16px; height: 16px; }
.mr-details-gallery.soon .mr-details-gallery-label { color: #58a6ff; }
.mr-details-gallery.grounded .mr-details-gallery-label { color: #7d8590; }
.mr-details-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.mr-details-gallery-item { height: 120px; background: rgba(17, 17, 17, 0.5); border: 1px solid rgba(255, 85, 85, 0.3); border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; position: relative; }
.mr-details-gallery-item:hover { border-color: #ff5555; box-shadow: 0 6px 20px rgba(255, 85, 85, 0.2); transform: translateY(-2px); }
.mr-details-gallery-item span { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #ff5555; }
.mr-details-gallery.soon .mr-details-gallery-item { border-color: rgba(88, 166, 255, 0.3); }
.mr-details-gallery.soon .mr-details-gallery-item:hover { border-color: #58a6ff; box-shadow: 0 6px 20px rgba(88, 166, 255, 0.2); }
.mr-details-gallery.soon .mr-details-gallery-item span { color: #58a6ff; }
.mr-details-gallery.grounded .mr-details-gallery-item { border-color: rgba(125, 133, 144, 0.3); }
.mr-details-gallery.grounded .mr-details-gallery-item:hover { border-color: #7d8590; box-shadow: 0 6px 20px rgba(125, 133, 144, 0.2); }
.mr-details-gallery.grounded .mr-details-gallery-item span { color: #7d8590; }
.mr-details-gallery-video { flex-direction: column; gap: 8px; }
.mr-details-gallery-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 2; pointer-events: none; }
.mr-details-gallery-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 9px; opacity: 0; transition: opacity 0.3s ease; }
.mr-details-gallery-thumb.loaded { opacity: 1; }

/* Media loading */
.mr-media-loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; letter-spacing: 1px; z-index: 1; }
.mr-gallery-img, .mr-video-poster-img, .mr-expanded-img, .mr-details-expanded-img { opacity: 0; transition: opacity 0.3s ease; }
.mr-gallery-img.loaded, .mr-video-poster-img.loaded, .mr-expanded-img.loaded, .mr-details-expanded-img.loaded { opacity: 1; }
.mr-details-gallery-item { position: relative; }
.mr-details-gallery-item.active { border-color: #ff5555; background: rgba(255, 85, 85, 0.1); }
.mr-details-gallery-item.active .mr-details-gallery-thumb { opacity: 0.3; }
.mr-details-gallery-close-label { position: relative; z-index: 2; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #ff5555; text-transform: uppercase; letter-spacing: 1px; }
.mr-details-gallery.soon .mr-details-gallery-item.active { border-color: #58a6ff; background: rgba(88, 166, 255, 0.1); }
.mr-details-gallery.grounded .mr-details-gallery-item.active { border-color: #7d8590; background: rgba(125, 133, 144, 0.1); }

/* Details Accordion */
.mr-details-accordion { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.mr-details-accordion.open { max-height: 600px; }
.mr-details-accordion-inner { padding: 16px 0 8px; }
.mr-details-expanded-image { width: 100%; aspect-ratio: 16/9; background: rgba(17, 17, 17, 0.8); border: 2px solid rgba(255, 85, 85, 0.4); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.mr-details-expanded-img { width: 100%; height: 100%; object-fit: contain; }
.mr-details-video-player { width: 100%; aspect-ratio: 16/9; background: #000; border: 2px solid rgba(255, 85, 85, 0.4); border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.mr-details-video-el { width: 100%; height: 100%; object-fit: contain; border-radius: 10px; }
.mr-details-gallery.soon .mr-details-expanded-image, .mr-details-gallery.soon .mr-details-video-player { border-color: rgba(88, 166, 255, 0.4); }
.mr-details-gallery.soon .mr-details-expanded-image span, .mr-details-gallery.soon .mr-details-video-poster span { color: #58a6ff; }
.mr-details-gallery.grounded .mr-details-expanded-image, .mr-details-gallery.grounded .mr-details-video-player { border-color: rgba(125, 133, 144, 0.4); }
.mr-details-gallery.grounded .mr-details-expanded-image span, .mr-details-gallery.grounded .mr-details-video-poster span { color: #7d8590; }
@media (max-width: 600px) { .mr-details-gallery-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 400px) { .mr-details-gallery-grid { grid-template-columns: 1fr; } }

/* Gallery */
.mr-gallery-modal { max-width: 100%; }
.mr-gallery-section { overflow: visible; padding: 0 16px; }
.mr-gallery-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ff5555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.mr-gallery-label svg { width: 16px; height: 16px; }
.mr-gallery-slider { display: flex; gap: 24px; overflow-x: auto; padding: 16px 0; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
.mr-gallery-slider::-webkit-scrollbar { height: 6px; }
.mr-gallery-slider::-webkit-scrollbar-track { background: rgba(17, 17, 17, 0.5); border-radius: 3px; }
.mr-gallery-slider::-webkit-scrollbar-thumb { background: #ff5555; border-radius: 3px; }
.mr-gallery-item { min-width: 400px; height: 260px; background: rgba(17, 17, 17, 0.5); border: 1px solid rgba(255, 85, 85, 0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.4s ease; flex-shrink: 0; overflow: hidden; position: relative; }
.mr-gallery-item:hover { border-color: #ff5555; box-shadow: 0 10px 30px rgba(255, 85, 85, 0.2); }
.mr-gallery-img { width: 100%; height: 100%; object-fit: cover; }
.mr-video-poster-img { width: 100%; height: 100%; object-fit: cover; }
.mr-gallery-item span { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #ff5555; }

/* Expanded image */
.mr-expanded-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 1); z-index: 10010; display: flex; align-items: center; justify-content: center; }
.mr-expanded-content { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 20px; max-width: 90vw; }
.mr-expanded-image { width: 80vw; height: 70vh; background: rgba(17, 17, 17, 0.8); border: 2px solid #ff5555; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
.mr-expanded-img { width: 100%; height: 100%; object-fit: contain; }
.mr-expanded-image span { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #ff5555; }
.mr-expanded-back { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: transparent !important; border: 2px solid #ff5555 !important; color: #ff5555 !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 1px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-decoration: none !important; }
.mr-expanded-back:hover { background: #ff5555 !important; color: #000 !important; }
.mr-expanded-back::before, .mr-expanded-back::after { display: none !important; content: none !important; }

@media (max-width: 640px) {
  .mr-gallery-slider { gap: 12px; padding: 12px 0; }
  .mr-gallery-item { min-width: 200px; max-width: 70vw; height: 180px; }
  .mr-gallery-img { object-fit: contain; }
  .mr-expanded-content { padding: 12px; max-width: 100vw; }
  .mr-expanded-image { width: 92vw; height: 60vh; border-width: 1px; border-radius: 8px; }
  .mr-expanded-back { padding: 10px 20px; font-size: 11px; }
}

/* Video modal */
.mr-video-overlay { align-items: center; justify-content: center; }
.mr-video-container { max-width: 900px; width: 100%; }
.mr-video-wrapper { position: relative; background: #000; border-radius: 12px; overflow: hidden; aspect-ratio: 16/9; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); }
.mr-video-poster { position: absolute; inset: 0; background: linear-gradient(135deg, #1a1a1a, #0a0a0a); display: flex; align-items: center; justify-content: center; }
.mr-video-poster span { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #ff5555; }
.mr-play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 15; }
.mr-play-overlay:hover { background: rgba(0, 0, 0, 0.2); }
.mr-play-btn { transition: transform 0.3s ease; }
.mr-play-overlay:hover .mr-play-btn { transform: scale(1.05); }
.mr-video-el { width: 100%; height: 100%; object-fit: contain; }
.mr-video-title { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #888; text-align: center; margin-top: 16px; }

/* Details */
.mr-details-meta { margin-bottom: 24px; }
.mr-details-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px; }
.mr-details-row:last-child { border-bottom: none; }
.mr-details-label { color: #555; }
.mr-details-value { color: #fff; font-weight: 600; }
.mr-details-value.accent { color: rgb(0, 255, 136); }
.mr-details-meta.soon .mr-details-value.accent { color: #58a6ff; }
.mr-details-meta.grounded .mr-details-value.accent { color: #7d8590; }

.mr-details-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.mr-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 8px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); color: rgb(0, 255, 136); border-radius: 6px; }
.mr-details-tags.soon .mr-tag { border-color: rgba(88, 166, 255, 0.3); color: #58a6ff; background: rgba(88, 166, 255, 0.05); }
.mr-details-tags.grounded .mr-tag { border-color: rgba(125, 133, 144, 0.3); color: #7d8590; background: rgba(125, 133, 144, 0.05); }

/* Details Description */
.mr-details-description { margin-bottom: 24px; padding: 16px; background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 8px; }
.mr-details-description-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.mr-details-description-text { font-size: 14px; line-height: 1.6; color: #fff; margin: 0; }
.mr-details-description.soon { background: rgba(88, 166, 255, 0.1); border-color: rgba(88, 166, 255, 0.3); }
.mr-details-description.soon .mr-details-description-label { color: #58a6ff; }
.mr-details-description.grounded { background: rgba(125, 133, 144, 0.1); border-color: rgba(125, 133, 144, 0.3); }
.mr-details-description.grounded .mr-details-description-label { color: #7d8590; }

.mr-details-links { display: flex; gap: 12px; flex-wrap: wrap; padding-top: 24px; border-top: 1px solid #222; }
.mr-link { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; text-decoration: none !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease; }
.mr-link::before, .mr-link::after { display: none !important; content: none !important; }
.mr-link.primary { background: rgb(0, 255, 136) !important; border: 1px solid rgb(0, 255, 136) !important; color: #000 !important; }
.mr-link.primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }
.mr-link.secondary { background: transparent !important; border: 1px solid rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; }
.mr-link.secondary:hover { background: rgba(0, 255, 136, 0.1) !important; transform: translateY(-2px); }
/* Soon status */
.mr-details-links.soon .mr-link.primary { background: #58a6ff !important; border-color: #58a6ff !important; }
.mr-details-links.soon .mr-link.primary:hover { box-shadow: 0 10px 30px rgba(88, 166, 255, 0.4); }
.mr-details-links.soon .mr-link.secondary { border-color: #58a6ff !important; color: #58a6ff !important; }
.mr-details-links.soon .mr-link.secondary:hover { background: rgba(88, 166, 255, 0.1) !important; }
/* Grounded status */
.mr-details-links.grounded .mr-link.primary { background: #7d8590 !important; border-color: #7d8590 !important; }
.mr-details-links.grounded .mr-link.primary:hover { box-shadow: 0 10px 30px rgba(125, 133, 144, 0.4); }
.mr-details-links.grounded .mr-link.secondary { border-color: #7d8590 !important; color: #7d8590 !important; }
.mr-details-links.grounded .mr-link.secondary:hover { background: rgba(125, 133, 144, 0.1) !important; }
</style>
