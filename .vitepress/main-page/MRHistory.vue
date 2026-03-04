<template>
  <section class="mr-history-section">
    <div class="mr-history-container">
      <div class="mr-history-header">
        <div class="mr-section-label">2010 – 2026</div>
        <h2 class="mr-section-title">Журнал запусков</h2>
      </div>

      <!-- Average Build Time Stats -->
      <div class="mr-history-stats">
        <span class="mr-stats-label">Время запуска, сред.</span>
        <span class="mr-stats-value">{{ averageBuildTime }}дн</span>
      </div>

      <!-- Filters -->
      <div class="mr-history-filters">
        <button :class="['mr-filter-btn', { active: activeFilter === 'all' }]" @click="filterStatus('all')">Все модули <span class="mr-count">({{ allProjects.length }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'soon' }]" @click="filterStatus('soon')"><span class="mr-dot blue"></span>Скоро <span class="mr-count">({{ countByStatus('Скоро запуск') }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'orbit' }]" @click="filterStatus('orbit')"><span class="mr-dot green"></span>Запущен <span class="mr-count">({{ countByStatus('Запущен') }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'grounded' }]" @click="filterStatus('grounded')"><span class="mr-dot gray"></span>Отложен <span class="mr-count">({{ countByStatus('Отложен') }})</span></button>
        <button :class="['mr-identity-btn', { active: identityMode }]" @click="toggleIdentityMode">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/></svg>
          Бренды
        </button>
      </div>
      
      <!-- Table -->
      <div v-show="!identityMode" class="mr-history-table">
        <template v-for="(project, index) in filteredProjects" :key="project.id">
          <div v-if="index < 5" :class="['mr-history-row', { hidden: !isVisible(project) }]">
            <div :class="['mr-history-logo', getStatusClass(project.status), { branded: project.mrBranded }]" @click="openDetails(project.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
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
                  <span class="mr-build-time">{{ project.buildTime }}</span>
                </div>
                <span class="mr-build-details">ДЕТАЛИ</span>
              </div>
            </div>
          </div>
        </template>

        <button v-if="accordionProjects.length > 0" :class="['mr-accordion-toggle', { open: accordionOpen }]" @click="toggleAccordion">
          <span>{{ accordionOpen ? 'Свернуть' : `Ещё ${accordionProjects.length} модулей` }}</span><span class="mr-arrow">↓</span>
        </button>

        <div :class="['mr-accordion-content', { open: accordionOpen }]">
          <template v-for="project in accordionProjects" :key="project.id">
            <div :class="['mr-history-row', { hidden: !isVisible(project) }]">
              <div :class="['mr-history-logo', getStatusClass(project.status), { branded: project.mrBranded }]" @click="openDetails(project.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
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
                    <span class="mr-build-time">{{ project.buildTime }}</span>
                  </div>
                  <span class="mr-build-details">ДЕТАЛИ</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Identity Grid -->
      <div v-show="identityMode" class="mr-identity-grid">
        <div v-for="project in mrBrandedProjects" :key="project.id" class="mr-identity-card" @click="openDetails(project.id)">
          <div class="mr-identity-logo"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>
          <div class="mr-identity-name">{{ project.subtitle }}</div>
          <div class="mr-identity-date">{{ project.launchDate }}</div>
        </div>
      </div>
    </div>

    <!-- Images Modal -->
    <Teleport to="body">
      <div v-if="imagesModalOpen" class="mr-modal-overlay" @click.self="closeImagesModal">
        <button :class="['mr-modal-close', 'mr-desktop-only', currentProjectStatusClass]" @click="closeImagesModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header"><span :class="['mr-modal-title', currentProjectStatusClass]">{{ currentProject?.title }}</span><span :class="['mr-modal-count', currentProjectStatusClass]">{{ currentProject?.images.length }} изображений</span></div>
          <div class="mr-gallery-section">
            <div class="mr-gallery-slider">
              <div v-for="(img, idx) in currentProject?.images" :key="idx" class="mr-gallery-item" @click="expandImage(idx)">
                <div class="mr-image-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
                <span class="mr-image-title">{{ img }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mr-mobile-close"><button class="mr-mobile-close-btn" @click="closeImagesModal">ЗАКРЫТЬ</button></div>
        <div v-if="expandedImageIndex !== null" class="mr-expanded-overlay" @click="closeExpandedImage">
          <div class="mr-expanded-image"><div class="mr-expanded-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>{{ currentProject?.images[expandedImageIndex] }}</span></div></div>
        </div>
      </div>
    </Teleport>

    <!-- Videos Modal -->
    <Teleport to="body">
      <div v-if="videosModalOpen" class="mr-modal-overlay" @click.self="closeVideosModal">
        <button :class="['mr-modal-close', 'mr-desktop-only', currentProjectStatusClass]" @click="closeVideosModal"></button>
        <div class="mr-modal-content mr-video-modal">
          <div class="mr-video-container">
            <div class="mr-video-placeholder" v-if="!videoLoaded"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg><button class="mr-video-play" @click="initVideo">Воспроизвести</button></div>
            <video v-show="videoLoaded" ref="videoEl" controls autoplay @ended="onVideoEnded"><source src="" type="video/mp4"></video>
          </div>
          <div class="mr-video-title">{{ currentProject?.title }} — {{ currentProject?.videos[0] }}</div>
        </div>
        <div class="mr-mobile-close"><button class="mr-mobile-close-btn" @click="closeVideosModal">ЗАКРЫТЬ</button></div>
      </div>
    </Teleport>

    <!-- Details Modal -->
    <Teleport to="body">
      <div v-if="detailsModalOpen" class="mr-modal-overlay" @click.self="closeDetailsModal">
        <button :class="['mr-modal-close', 'mr-desktop-only', currentProjectStatusClass]" @click="closeDetailsModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header"><span :class="['mr-modal-title', currentProjectStatusClass]">{{ currentProject?.title }}</span></div>
          <div :class="['mr-details-meta', currentProjectStatusClass]">
            <div class="mr-details-row"><span class="mr-details-label">Клиент</span><span class="mr-details-value accent">{{ currentProject?.subtitle }}</span></div>
            <div v-if="currentProject?.specialization" class="mr-details-row"><span class="mr-details-label">Специализация</span><span class="mr-details-value">{{ currentProject?.specialization }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Статус</span><span class="mr-details-value accent">{{ currentProject?.status }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Дата запуска</span><span class="mr-details-value">{{ currentProject?.launchDate }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Время сборки</span><span class="mr-details-value">{{ currentProject?.buildTime }}</span></div>
            <div v-if="currentProject?.details" class="mr-details-row mr-details-full"><span class="mr-details-label">Детали</span><span class="mr-details-value description">{{ currentProject?.details }}</span></div>
            <div v-if="currentProject?.images.length" class="mr-details-row"><span class="mr-details-label">Изображений</span><span class="mr-details-value">{{ currentProject?.images.length }}</span></div>
            <div v-if="currentProject?.videos.length" class="mr-details-row"><span class="mr-details-label">Видео</span><span class="mr-details-value">{{ currentProject?.videos.length }}</span></div>
            <div v-if="currentProject?.mrBranded" class="mr-details-row"><span class="mr-details-label">Айдентика</span><span class="mr-details-value accent">Модуль Роста®</span></div>
          </div>
          <div :class="['mr-details-tags', currentProjectStatusClass]"><span v-for="tag in currentProject?.tags" :key="tag" class="mr-tag">{{ tag }}</span></div>
          <div :class="['mr-details-links', currentProjectStatusClass]">
            <a v-if="currentProject?.website" :href="currentProject.website" target="_blank" rel="noopener noreferrer" class="mr-link primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>Открыть сайт</a>
            <a v-if="currentProject?.caseUrl" :href="currentProject.caseUrl" target="_blank" rel="noopener noreferrer" class="mr-link secondary">Кейс</a>
            <a v-if="currentProject?.behanceUrl" :href="currentProject.behanceUrl" target="_blank" rel="noopener noreferrer" class="mr-link secondary">Behance</a>
          </div>
        </div>
        <div class="mr-mobile-close"><button :class="['mr-mobile-close-btn', currentProjectStatusClass]" @click="closeDetailsModal">ЗАКРЫТЬ</button></div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project { id: string; title: string; subtitle: string; specialization: string; website: string | null; images: string[]; videos: string[]; tags: string[]; details: string; caseUrl: string | null; behanceUrl: string | null; launchDate: string; buildTime: string; status: string; mrBranded: boolean }

const activeFilter = ref('all')
const identityMode = ref(false)
const accordionOpen = ref(false)
const imagesModalOpen = ref(false)
const videosModalOpen = ref(false)
const detailsModalOpen = ref(false)
const currentProjectId = ref<string | null>(null)
const videoLoaded = ref(false)
const videoEl = ref<HTMLVideoElement | null>(null)
const expandedImageIndex = ref<number | null>(null)

const allProjects = ref<Project[]>([
  { id: 'proj1', title: 'Приложение-компаньон', subtitle: 'b00m.fun', specialization: 'Аркадные парки', website: 'https://b00m.fun/', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Бренд', 'Веб', 'Стандарты'], details: '', caseUrl: null, behanceUrl: null, launchDate: '18.03.2026', buildTime: '45дн', status: 'Скоро запуск', mrBranded: true },
  { id: 'proj2', title: 'Калькулятор инвестора', subtitle: 'Optima Space', specialization: 'Сервисные офисы', website: 'https://profitrooms.ru/', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Веб', 'Продажи'], details: '', caseUrl: 'https://runscale.ru/optima-space/invest', behanceUrl: null, launchDate: '02.03.2026', buildTime: '10дн', status: 'Запущен', mrBranded: false },
  { id: 'proj3', title: 'Генератор сториз', subtitle: 'Корж', specialization: 'Сеть кофеен', website: 'https://korzhcoffee.ru/', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: 'https://cffx.ru/signal/korzh/gift', behanceUrl: null, launchDate: '25.12.2025', buildTime: '10дн', status: 'Запущен', mrBranded: false },
  { id: 'proj4', title: 'Калькулятор инвестора', subtitle: 'Корж', specialization: 'Сеть кофеен', website: 'https://korzhcoffee.ru/', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: 'https://cffx.ru/signal/korzh/invest.html', behanceUrl: null, launchDate: '15.12.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false },
  { id: 'proj5', title: 'Конструктор Сигнала', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/pro/reserve.html', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: null, behanceUrl: null, launchDate: '15.11.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false },
  { id: 'proj6', title: 'LTV Калькулятор', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/pro/ltvcalc.html', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: null, behanceUrl: null, launchDate: '10.11.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false },
  { id: 'proj7', title: 'Диалоги Сигнала', subtitle: 'Корж', specialization: 'Сеть кофеен', website: 'https://korzhcoffee.ru/', images: [], videos: [], tags: ['ИИ', 'Чекап', 'R&D', 'Автоматизация', 'Веб', 'Видео'], details: '', caseUrl: 'https://cffx.ru/korzh.html', behanceUrl: null, launchDate: '15.10.2025', buildTime: '30дн', status: 'Запущен', mrBranded: false },
  { id: 'proj8', title: 'ИИ-ассистент Анна', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/pro/anna.html', images: [], videos: [], tags: ['ИИ', 'R&D'], details: '', caseUrl: null, behanceUrl: null, launchDate: '26.09.2025', buildTime: '25дн', status: 'Запущен', mrBranded: false },
  { id: 'proj9', title: 'Индекс Роста', subtitle: 'Сигнал – Кофейни', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/invest/smr.html', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: null, behanceUrl: null, launchDate: '31.08.2025', buildTime: '30дн', status: 'Запущен', mrBranded: false },
  { id: 'proj10', title: 'Тикет-система', subtitle: 'Сигнал', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Автоматизация', 'Бренд', 'Веб'], details: '', caseUrl: null, behanceUrl: null, launchDate: '30.08.2025', buildTime: '60дн', status: 'Запущен', mrBranded: true },
  { id: 'proj11', title: 'Прогноз выручки', subtitle: 'Сигнал – Кофейни', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/invest/calc.html', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: null, behanceUrl: null, launchDate: '06.08.2025', buildTime: '5дн', status: 'Запущен', mrBranded: false },
  { id: 'proj12', title: 'Симулятор Самары', subtitle: 'Сигнал – Кофейни', specialization: 'Система обратной связи высокого качества', website: 'https://cffx.ru/invest/sim.html', images: [], videos: [], tags: ['R&D'], details: '', caseUrl: null, behanceUrl: null, launchDate: '30.07.2025', buildTime: '15дн', status: 'Запущен', mrBranded: false },
  { id: 'proj13', title: 'БАД', subtitle: 'Bengal Boost', specialization: 'Корма для диких кошек', website: null, images: [], videos: [], tags: ['Чекап', 'Бренд', 'Упаковка'], details: '', caseUrl: null, behanceUrl: null, launchDate: '20.06.2025', buildTime: '15дн', status: 'Отложен', mrBranded: true },
  { id: 'proj14', title: 'Игристая брассерия', subtitle: 'BRIMS', specialization: 'Ресторан с морской душой', website: 'https://brims63.ru', images: [], videos: [], tags: ['Чекап', 'Бренд', 'Торговая среда'], details: '', caseUrl: null, behanceUrl: null, launchDate: '28.02.2025', buildTime: '150дн', status: 'Запущен', mrBranded: true },
  { id: 'proj15', title: 'Юридический профайл', subtitle: 'ЮрТраст', specialization: 'Юридическая компания', website: 'https://jurtrust.ru', images: [], videos: [], tags: ['Бренд', 'Веб'], details: '', caseUrl: null, behanceUrl: null, launchDate: '23.07.2024', buildTime: '5дн', status: 'Запущен', mrBranded: true },
  { id: 'proj16', title: 'Захват контактов', subtitle: 'Конкордия-Авто', specialization: 'Импорт автомобилей', website: 'https://konkordia-auto.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Стандарты', 'Продажи'], details: 'ИИ-модуль и сценарии для запроса контактов: стандарты формулировок, работа с возражениями и повторные попытки, резюме звонков в Telegram.', caseUrl: 'https://runscale.ru/journal/cases/kak-ii-resheniya-pomogayut-povysit-effektivnost-zaprosa-kontaktov-klientov.html', behanceUrl: null, launchDate: '26.05.2024', buildTime: '20дн', status: 'Отложен', mrBranded: false },
  { id: 'proj17', title: 'ИИ-трекер качества', subtitle: 'Конкордия-Авто', specialization: 'Импорт автомобилей', website: 'https://konkordia-auto.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Продажи'], details: 'ИИ-ассистент анализирует активность менеджеров, фиксирует динамику и даёт персональные рекомендации по развитию навыков и повышению конверсии.', caseUrl: 'https://runscale.ru/journal/cases/kak-ii-assistenty-pomogayut-uluchshat-prodazhi.html', behanceUrl: null, launchDate: '06.05.2024', buildTime: '35дн', status: 'Отложен', mrBranded: false },
  { id: 'proj18', title: 'Автопилот продаж', subtitle: 'Конкордия-Авто', specialization: 'Импорт автомобилей', website: 'https://konkordia-auto.ru', images: [], videos: [], tags: ['ИИ', 'Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Стандарты', 'Продажи'], details: 'CRM-воронка с автозадачами, DISC-типирование, скрипты и регламенты по типам клиентов, аналитика сделок и автоматизированные отчёты.', caseUrl: 'https://runscale.ru/journal/cases/kak-modul-rosta-avtomatiziroval-prodazhi-dlya-konkordiya-avto.html', behanceUrl: null, launchDate: '31.03.2024', buildTime: '30дн', status: 'Отложен', mrBranded: false },
  { id: 'proj19', title: 'Конструктор туров', subtitle: 'Август Глэмпинг', specialization: 'Глэмпинг', website: 'https://augustglamping.ru', images: [], videos: [], tags: ['Чекап', 'R&D', 'Автоматизация', 'Бренд', 'Веб', 'Продажи'], details: '', caseUrl: null, behanceUrl: null, launchDate: '30.09.2023', buildTime: '60дн', status: 'Отложен', mrBranded: true },
  { id: 'proj20', title: 'Архитектурное портфолио', subtitle: 'Tanurkova Arch Design', specialization: 'Архитектурное бюро', website: null, images: [], videos: [], tags: ['Бренд', 'Веб', 'Анимация', 'Видео'], details: '', caseUrl: null, behanceUrl: 'https://www.behance.net/gallery/175565499/Tanurkova-Arch-Design-Identity-Website', launchDate: '09.09.2023', buildTime: '70дн', status: 'Отложен', mrBranded: true },
  { id: 'proj21', title: 'Цифровое наследие', subtitle: 'Фонд Хворостовского', specialization: 'Благотворительный фонд', website: 'https://hvorostovsky.com', images: [], videos: [], tags: ['Автоматизация', 'Бренд', 'Веб', 'Видео'], details: 'Новый сайт с базой событий и историй детей, «Линией времени», медиатекой и приёмом пожертвований через RoboKassa.', caseUrl: 'https://runscale.ru/journal/cases/kak-my-prevratili-nasledie-khvorostovskogo-v-instrument-dlya-pomoshi-detyam.html', behanceUrl: 'https://www.behance.net/gallery/175592297/sajt-fonda-hvorostovskogo', launchDate: '27.06.2023', buildTime: '40дн', status: 'Запущен', mrBranded: true },
  { id: 'proj22', title: 'Бассейн мечты', subtitle: 'Блумкидс', specialization: 'Детский бассейн', website: null, images: [], videos: [], tags: ['Чекап', 'Стратегия', 'R&D', 'Автоматизация', 'Бренд', 'Веб', 'Анимация', 'Видео', 'CJM', 'Лояльность', 'Продажи', 'Торговая среда'], details: 'Воронка продаж абонементов, матрица программ, система лояльности, регламенты персонала и сайт для записи и коммуникаций.', caseUrl: 'https://runscale.ru/journal/cases/sozdayom-bassein-mechty.html', behanceUrl: 'https://www.behance.net/gallery/175530883/blumkids-ajdentika-i-veb-sajt', launchDate: '10.12.2022', buildTime: '235дн', status: 'Отложен', mrBranded: true },
  { id: 'proj23', title: 'Фитнес-экосистема', subtitle: 'FIZ Культура', specialization: 'Сеть из 4 фитнес-клубов, 10+ лет на рынке, Самара', website: 'https://fizkultura63.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'CJM', 'Лояльность', 'Продажи'], details: 'Новый формат «сухой фитнес + SPA», сегментация, CJM, бонусная и реферальная системы, программа адаптации и ТЗ на приложение.', caseUrl: 'https://runscale.ru/journal/cases/delaem-fitnes-personalnym.html', behanceUrl: null, launchDate: '12.05.2022', buildTime: '110дн', status: 'Отложен', mrBranded: false },
  { id: 'proj24', title: 'Платформа события', subtitle: 'World Plastics Summit 2022', specialization: 'Международный саммит по переработке пластика', website: null, images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Бренд', 'Веб', 'Анимация', 'Видео'], details: 'Манифест саммита, логотип, айдентика, бренд-видео и сайт-сервис для участников.', caseUrl: 'https://runscale.ru/journal/cases/kak-obedinit-nauku-iskusstvo-i-kommunikaciyu-dlya-resheniya-globalnoi-problemy.html', behanceUrl: 'https://www.behance.net/gallery/156308617/World-Plastics-Summit-Brand-Identity-Website', launchDate: '24.03.2022', buildTime: '50дн', status: 'Запущен', mrBranded: true },
  { id: 'proj25', title: 'Крафт-франшиза', subtitle: 'Ермолаевъ', specialization: 'Сеть магазинов пивоварни', website: 'https://ermolaev.beer/', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Продажи', 'Торговая среда'], details: 'Новый формат магазинов-баров: зонирование, пивная матрица 25–30 SKU, финмодель с рентабельностью 20%+ и окупаемостью до 1,5 лет, POS и айдентика под франшизу.', caseUrl: 'https://runscale.ru/journal/cases/bolshuyu-svetlyi-lager-khelles.html', behanceUrl: null, launchDate: '27.12.2021', buildTime: '70дн', status: 'Отложен', mrBranded: false },
  { id: 'proj26', title: 'Образовательный профайл', subtitle: 'Modelex Education', specialization: 'Школа', website: 'https://modelex.mc', images: [], videos: [], tags: ['Стратегия', 'Бренд', 'Веб'], details: 'Курсы, преподаватели, расписание, отзывы и айдентика для набора учеников.', caseUrl: null, behanceUrl: 'https://www.behance.net/gallery/175486955/Modelex-Identity-Website', launchDate: '01.06.2021', buildTime: '90дн', status: 'Запущен', mrBranded: true },
  { id: 'proj27', title: 'Культурный профайл', subtitle: 'GALA RUSSE', specialization: 'Организация культурных событий', website: null, images: [], videos: [], tags: ['Стратегия', 'Бренд', 'Веб', 'Видео'], details: '', caseUrl: null, behanceUrl: 'https://www.behance.net/gallery/175498363/GALA-RUSSE-Identity-website', launchDate: '02.04.2021', buildTime: '60дн', status: 'Запущен', mrBranded: true },
  { id: 'proj28', title: 'Новый персонаж', subtitle: 'Желток Белток', specialization: 'Аксайская птицефабрика', website: null, images: [], videos: [], tags: ['Бренд', 'Упаковка'], details: '', caseUrl: null, behanceUrl: null, launchDate: '18.11.2020', buildTime: '55дн', status: 'Запущен', mrBranded: true },
  { id: 'proj29', title: 'Сервисный профайл', subtitle: 'EASYBUSY', specialization: 'Консьерж-сервис', website: 'https://easybusy.fr/', images: [], videos: [], tags: ['Стратегия', 'Бренд', 'Веб'], details: 'Сайт с описанием сервисов, тарифов, кейсов и контактов для онбординга B2B-клиентов.', caseUrl: null, behanceUrl: 'https://behance.net/orxaos', launchDate: '21.09.2020', buildTime: '60дн', status: 'Запущен', mrBranded: true },
  { id: 'proj30', title: 'Маркетинговый контур', subtitle: 'SMSTRETCHING', specialization: 'Сеть студий стретчинга', website: 'https://smstretching.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Автоматизация', 'Веб', 'Продажи'], details: 'Сквозная аналитика, интеграция amoCRM ↔ 1C Фитнес, 12 триггерных email-цепочек, структура адресных книг и концепция SM APP.', caseUrl: 'https://runscale.ru/journal/cases/avtomatiziruem-marketing-fitnesa.html', behanceUrl: null, launchDate: '02.03.2020', buildTime: '30дн', status: 'Отложен', mrBranded: false },
  { id: 'proj31', title: 'Цифровая витрина', subtitle: 'WOODLED', specialization: 'Производитель дизайнерских светильников из дерева', website: 'https://woodled.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Упаковка', 'Веб', 'Продажи'], details: 'Новый сайт-витрина и интернет-магазин, каталог 3D-моделей, упаковка для Rotor и перенос маркетинга бренда в цифру.', caseUrl: 'https://runscale.ru/journal/cases/lakonichnyi-ekodizain-dlya-komfortnoi-zhizni.html', behanceUrl: null, launchDate: '16.02.2020', buildTime: '60дн', status: 'Запущен', mrBranded: false },
  { id: 'proj32', title: 'Новая стратегия', subtitle: 'SMSTRETCHING', specialization: 'Сеть студий стретчинга', website: 'https://smstretching.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Продажи'], details: '', caseUrl: 'https://runscale.ru/journal/cases/trenirovki-kak-v-studii-tolko-doma.html', behanceUrl: null, launchDate: '08.02.2020', buildTime: '130дн', status: 'Запущен', mrBranded: false },
  { id: 'proj33', title: 'Витрина бренда', subtitle: 'RAW BITES', specialization: 'Продукты питания', website: null, images: [], videos: [], tags: ['Бренд', 'Упаковка', 'Веб', 'Продажи'], details: '', caseUrl: null, behanceUrl: null, launchDate: '30.11.2019', buildTime: '90дн', status: 'Запущен', mrBranded: true },
  { id: 'proj34', title: 'Конструктор праздника', subtitle: 'СУПЕРЛЕНД', specialization: 'Сеть детских развлекательных центров', website: 'https://superland.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'R&D', 'CJM'], details: 'Онлайн-калькулятор банкетов, система пакетных предложений и торговые маршруты семьи (CJM).', caseUrl: 'https://runscale.ru/journal/cases/sozdayom-nezabyvaemye-vpechatleniya-dlya-vsei-semi.html', behanceUrl: null, launchDate: '22.08.2018', buildTime: '50дн', status: 'Отложен', mrBranded: false },
  { id: 'proj35', title: 'Фирменный магазин', subtitle: 'Dymicana', specialization: 'GoPro - Казань', website: null, images: [], videos: [], tags: [], details: '', caseUrl: null, behanceUrl: null, launchDate: '18.11.2016', buildTime: '90дн', status: 'Запущен', mrBranded: false },
  { id: 'proj36', title: 'Запуск на полку', subtitle: 'Чишминский', specialization: 'Молочный завод', website: null, images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Бренд', 'Упаковка', 'Веб', 'Лояльность', 'Продажи', 'Торговая среда'], details: 'Ассортиментная матрица ~75 SKU, ценовая стратегия, новая упаковка, система лояльности и план входа в сети.', caseUrl: 'https://runscale.ru/journal/cases/slavim-tradicii-kachestva.html', behanceUrl: null, launchDate: '01.06.2016', buildTime: '150дн', status: 'Запущен', mrBranded: true },
  { id: 'proj37', title: 'Единая доставка', subtitle: 'Milimon', specialization: 'Сеть ресторанов', website: 'https://milimon.ru', images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Автоматизация', 'Веб', 'Стандарты', 'Продажи'], details: 'Объединенить доставку 30 ресторанов: единый колл-центр, карта покрытия, стандарты для курьеров, система оценок и онлайн-магазин.', caseUrl: 'https://runscale.ru/journal/cases/uskoryaem-dostavku-edy.html', behanceUrl: null, launchDate: '01.04.2016', buildTime: '60дн', status: 'Запущен', mrBranded: false },
  { id: 'proj38', title: 'Центр психологической помощи', subtitle: 'Школа Позитивной Психологии', specialization: 'Образовательный проект', website: null, images: [], videos: [], tags: ['Чекап', 'Стратегия', 'Бренд', 'Торговая среда'], details: '', caseUrl: null, behanceUrl: null, launchDate: '01.06.2011', buildTime: '95дн', status: 'Отложен', mrBranded: true },
  { id: 'proj39', title: 'Ресторан и Гриль', subtitle: 'Морошка', specialization: 'Семейный ресторан', website: null, images: [], videos: [], tags: ['Бренд', 'Упаковка', 'Веб', 'Торговая среда'], details: '', caseUrl: null, behanceUrl: null, launchDate: '01.11.2010', buildTime: '125дн', status: 'Запущен', mrBranded: true }
])

const averageBuildTime = computed(() => {
  let total = 0, count = 0
  allProjects.value.forEach(p => {
    const m = p.buildTime.match(/(\d+)/)
    if (m) { total += parseInt(m[1]); count++ }
  })
  return count > 0 ? Math.round(total / count) : 0
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
function getUptimeClass(s: string) { if (s === 'Скоро запуск') return 'soon'; if (s === 'Отложен') return 'grounded'; return '' }

function getUptime(p: Project): string {
  if (p.status === 'Скоро запуск') {
    const m = p.launchDate.match(/(\d{2})\.(\d{2})\.(\d{4})/)
    if (m) {
      const launch = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]))
      const now = new Date(2026, 2, 4)
      const diff = Math.max(0, Math.floor((launch.getTime() - now.getTime()) / 1000))
      const d = Math.floor(diff / 86400), h = Math.floor((diff % 86400) / 3600), min = Math.floor((diff % 3600) / 60)
      return d + 'дн:' + h + 'ч:' + min + 'мин'
    }
    return 'T-30дн'
  }
  if (p.status === 'Отложен') return '--:--'
  const m = p.launchDate.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (m) {
    const launch = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]))
    const now = new Date(2026, 2, 4)
    const months = (now.getFullYear() - launch.getFullYear()) * 12 + (now.getMonth() - launch.getMonth())
    const y = Math.floor(months / 12), mo = months % 12
    const yWord = y === 1 ? 'год' : (y >= 2 && y <= 4) ? 'года' : 'лет'
    if (y >= 1) return mo > 0 ? y + ' ' + yWord + ' ' + mo + ' мес' : y + '+ ' + yWord
    return mo + ' мес'
  }
  return '1+ год'
}

function openImages(id: string) { currentProjectId.value = id; expandedImageIndex.value = null; imagesModalOpen.value = true; document.body.style.overflow = 'hidden' }
function closeImagesModal() { imagesModalOpen.value = false; expandedImageIndex.value = null; document.body.style.overflow = '' }
function expandImage(idx: number) { expandedImageIndex.value = idx }
function closeExpandedImage() { expandedImageIndex.value = null }

function openVideos(id: string) { currentProjectId.value = id; videoLoaded.value = false; videosModalOpen.value = true; document.body.style.overflow = 'hidden' }
function closeVideosModal() { videosModalOpen.value = false; videoLoaded.value = false; document.body.style.overflow = ''; if (videoEl.value) videoEl.value.pause() }
function initVideo() { videoLoaded.value = true }
function onVideoEnded() { videoLoaded.value = false }

function openDetails(id: string) { currentProjectId.value = id; detailsModalOpen.value = true; document.body.style.overflow = 'hidden' }
function closeDetailsModal() { detailsModalOpen.value = false; document.body.style.overflow = '' }
</script>

<style scoped>
.mr-history-section { padding: 80px 24px 130px; overflow-x: hidden; }
.mr-history-container { max-width: 1100px; margin: 0 auto; }
.mr-history-header { margin-bottom: 24px; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px; }
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 600; color: #fff; margin: 0; }

.mr-history-stats { display: inline-flex; align-items: center; gap: 12px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 6px; padding: 10px 16px; margin-bottom: 24px; font-family: 'JetBrains Mono', monospace; }
.mr-stats-label { font-size: 11px; color: rgba(0, 255, 136, 0.7); text-transform: uppercase; letter-spacing: 1px; }
.mr-stats-value { font-size: 18px; color: rgb(0, 255, 136); font-weight: 600; }

.mr-history-filters { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; align-items: center; }
.mr-filter-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 8px; color: #888; font-family: 'JetBrains Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; letter-spacing: 1px; }
.mr-filter-btn:hover { border-color: #555; color: #fff; }
.mr-filter-btn.active { border-color: rgb(0, 255, 136); color: rgb(0, 255, 136); background: rgba(0, 255, 136, 0.05); }
.mr-count { opacity: 0.5; }
.mr-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.mr-dot.blue { background: #58a6ff; box-shadow: 0 0 8px #58a6ff; }
.mr-dot.green { background: rgb(0, 255, 136); box-shadow: 0 0 8px rgb(0, 255, 136); }
.mr-dot.gray { background: #555; }

.mr-identity-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; background: #ff5555 !important; border: none !important; border-radius: 8px; color: #000 !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; margin-left: auto; text-decoration: none !important; box-shadow: 0 4px 15px rgba(255, 85, 85, 0.4); }
.mr-identity-btn:hover, .mr-identity-btn.active { background: #fff !important; color: #ff5555 !important; box-shadow: 0 0 30px rgba(255, 85, 85, 0.6); }
.mr-identity-btn::before, .mr-identity-btn::after { display: none !important; content: none !important; }
.mr-identity-btn svg { flex-shrink: 0; }

@media (max-width: 900px) {
  .mr-history-filters { justify-content: flex-start; }
  .mr-identity-btn { margin-left: 0; width: 100%; justify-content: center; }
}

.mr-history-table { background: rgba(26, 26, 26, 0.8); border: 1px solid #222; border-radius: 8px; overflow: hidden; }
.mr-history-row { display: grid; grid-template-columns: 60px 1fr auto auto; gap: 16px; padding: 16px 20px; border-bottom: 1px solid #222; align-items: center; transition: background 0.2s ease; }
.mr-history-row:last-child { border-bottom: none; }
.mr-history-row:hover { background: rgba(255,255,255,0.02); }
.mr-history-row.hidden { display: none; }

@media (max-width: 900px) {
  .mr-history-row { grid-template-columns: 50px 1fr; gap: 12px; padding: 14px 16px; }
  .mr-history-media, .mr-history-build { grid-column: 1 / -1; }
}

.mr-history-logo { width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
.mr-history-logo.soon { background: rgba(88, 166, 255, 0.1); color: #58a6ff; border: 1px solid rgba(88, 166, 255, 0.3); }
.mr-history-logo.orbit { background: rgba(0, 255, 136, 0.1); color: rgb(0, 255, 136); border: 1px solid rgba(0, 255, 136, 0.3); }
.mr-history-logo.grounded { background: rgba(85, 85, 85, 0.1); color: #555; border: 1px solid rgba(85, 85, 85, 0.3); }
.mr-history-logo.branded { border-width: 2px; }
.mr-history-logo:hover { transform: scale(1.05); }

.mr-history-info { min-width: 0; }
.mr-history-top { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
.mr-history-name { font-weight: 600; color: #fff; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mr-history-subtitle { font-size: 13px; }
.mr-history-subtitle.soon { color: #58a6ff; }
.mr-history-subtitle.orbit { color: rgb(0, 255, 136); }
.mr-history-subtitle.grounded { color: #555; }

.mr-history-uptime-wrap { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.mr-history-uptime { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgb(0, 255, 136); display: flex; align-items: center; gap: 6px; }
.mr-history-uptime.soon { color: #58a6ff; }
.mr-history-uptime.grounded { color: #555; }
.mr-ticker { width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: mr-ticker-pulse 1.5s ease-in-out infinite; }
@keyframes mr-ticker-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.mr-history-date { font-size: 12px; color: #555; }

.mr-history-media { display: flex; gap: 8px; }
.mr-media-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 6px; color: #888; cursor: pointer; transition: all 0.2s ease; }
.mr-media-btn:hover { border-color: rgb(0, 255, 136); color: rgb(0, 255, 136); }
.mr-media-btn svg { width: 16px; height: 16px; }
.mr-media-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; }

.mr-history-build { }
.mr-build-block { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
.mr-build-block.soon { background: rgba(88, 166, 255, 0.1); border: 1px solid rgba(88, 166, 255, 0.3); color: #58a6ff; }
.mr-build-block.orbit { background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.3); color: rgb(0, 255, 136); }
.mr-build-block.grounded { background: rgba(85, 85, 85, 0.1); border: 1px solid rgba(85, 85, 85, 0.3); color: #555; }
.mr-build-block:hover { transform: translateY(-2px); }
.mr-build-info { display: flex; flex-direction: column; gap: 2px; }
.mr-build-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
.mr-build-time { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; }
.mr-build-details { font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-left: auto; opacity: 0.7; }

.mr-accordion-toggle { width: 100%; padding: 16px; background: transparent; border: none; border-top: 1px solid #222; color: rgb(0, 255, 136); font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; }
.mr-accordion-toggle:hover { background: rgba(0, 255, 136, 0.05); }
.mr-accordion-toggle.open .mr-arrow { transform: rotate(180deg); }
.mr-arrow { transition: transform 0.3s ease; }

.mr-accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
.mr-accordion-content.open { max-height: 5000px; }

.mr-identity-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 800px) { .mr-identity-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .mr-identity-grid { grid-template-columns: 1fr; } }

.mr-identity-card { background: rgba(255, 85, 85, 0.05); border: 1px solid rgba(255, 85, 85, 0.2); border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; }
.mr-identity-card:hover { border-color: #ff5555; transform: translateY(-4px); box-shadow: 0 10px 30px rgba(255, 85, 85, 0.2); }
.mr-identity-logo { color: #ff5555; margin-bottom: 16px; }
.mr-identity-name { font-weight: 600; color: #fff; margin-bottom: 8px; }
.mr-identity-date { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; }

.mr-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: flex-start; justify-content: center; padding: 40px; padding-bottom: 100px; overflow-y: auto; }
.mr-modal-close { position: fixed; top: 24px; right: 24px; width: 48px; height: 48px; border-radius: 50%; border: 2px solid; background: transparent; cursor: pointer; z-index: 10001; transition: all 0.3s ease; }
.mr-modal-close::before, .mr-modal-close::after { content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 2px; background: currentColor; }
.mr-modal-close::before { transform: translate(-50%, -50%) rotate(45deg); }
.mr-modal-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
.mr-modal-close.soon { border-color: #58a6ff; color: #58a6ff; }
.mr-modal-close.orbit { border-color: rgb(0, 255, 136); color: rgb(0, 255, 136); }
.mr-modal-close.grounded { border-color: #555; color: #555; }
.mr-modal-close:hover { transform: scale(1.1); }

.mr-modal-content { background: #111; border: 1px solid #222; border-radius: 16px; padding: 32px; max-width: 700px; width: 100%; margin-top: 40px; }
.mr-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.mr-modal-title { font-size: 24px; font-weight: 600; }
.mr-modal-title.soon { color: #58a6ff; }
.mr-modal-title.orbit { color: rgb(0, 255, 136); }
.mr-modal-title.grounded { color: #555; }
.mr-modal-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 12px; border-radius: 4px; }
.mr-modal-count.soon { background: rgba(88, 166, 255, 0.1); color: #58a6ff; }
.mr-modal-count.orbit { background: rgba(0, 255, 136, 0.1); color: rgb(0, 255, 136); }
.mr-modal-count.grounded { background: rgba(85, 85, 85, 0.1); color: #555; }

.mr-gallery-section { overflow: visible; padding: 0 16px; }
.mr-gallery-slider { display: flex; gap: 24px; overflow-x: auto; padding: 16px 0; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
.mr-gallery-slider::-webkit-scrollbar { height: 4px; }
.mr-gallery-slider::-webkit-scrollbar-track { background: #222; border-radius: 2px; }
.mr-gallery-slider::-webkit-scrollbar-thumb { background: rgb(0, 255, 136); border-radius: 2px; }
.mr-gallery-item { flex-shrink: 0; width: 280px; cursor: pointer; transition: transform 0.3s ease; }
.mr-gallery-item:hover { transform: translateY(-8px); }
.mr-image-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg, #1a1a1a 0%, #111 100%); border: 1px solid #333; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #333; margin-bottom: 12px; }
.mr-image-title { font-size: 13px; color: #888; text-align: center; display: block; }

.mr-expanded-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 10002; cursor: zoom-out; }
.mr-expanded-image { max-width: 90%; max-height: 90%; }
.mr-expanded-placeholder { width: 80vw; max-width: 1000px; height: 60vh; background: #111; border: 1px solid #333; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: #555; }
.mr-expanded-placeholder span { font-size: 18px; }

.mr-video-modal { max-width: 900px; }
.mr-video-container { position: relative; width: 100%; padding-bottom: 56.25%; background: #000; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.mr-video-placeholder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; color: #333; }
.mr-video-play { padding: 16px 32px; background: rgb(0, 255, 136); color: #000; border: none; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; }
.mr-video-play:hover { transform: scale(1.05); }
.mr-video-container video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.mr-video-title { font-size: 14px; color: #888; text-align: center; }

.mr-details-meta { border: 1px solid #222; border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
.mr-details-row { display: flex; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #222; }
.mr-details-row:last-child { border-bottom: none; }
.mr-details-row.mr-details-full { flex-direction: column; gap: 8px; }
.mr-details-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 1px; }
.mr-details-value { font-size: 14px; color: #888; }
.mr-details-value.accent { font-weight: 600; }
.mr-details-value.description { font-size: 13px; line-height: 1.6; color: #aaa; }
.mr-details-meta.soon .mr-details-value.accent { color: #58a6ff; }
.mr-details-meta.orbit .mr-details-value.accent { color: rgb(0, 255, 136); }
.mr-details-meta.grounded .mr-details-value.accent { color: #555; }

.mr-details-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.mr-tag { padding: 6px 12px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.mr-details-tags.soon .mr-tag { background: rgba(88, 166, 255, 0.1); color: #58a6ff; }
.mr-details-tags.orbit .mr-tag { background: rgba(0, 255, 136, 0.1); color: rgb(0, 255, 136); }
.mr-details-tags.grounded .mr-tag { background: rgba(85, 85, 85, 0.1); color: #555; }

.mr-details-links { display: flex; gap: 12px; flex-wrap: wrap; }
.mr-link { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none !important; transition: all 0.3s ease; }
.mr-link::before, .mr-link::after { display: none !important; }
.mr-link.primary { background: rgb(0, 255, 136); color: #000 !important; }
.mr-link.primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3); }
.mr-link.secondary { border: 1px solid #333; color: #888 !important; }
.mr-link.secondary:hover { border-color: rgb(0, 255, 136); color: rgb(0, 255, 136) !important; }
.mr-details-links.soon .mr-link.primary { background: #58a6ff; }
.mr-details-links.soon .mr-link.primary:hover { box-shadow: 0 10px 30px rgba(88, 166, 255, 0.3); }
.mr-details-links.grounded .mr-link.primary { background: #555; }

.mr-mobile-close { display: none; position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(to top, #000 0%, transparent 100%); z-index: 10001; }
.mr-mobile-close-btn { width: 100%; padding: 16px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; border: none; background: rgb(0, 255, 136); color: #000; }
.mr-mobile-close-btn.soon { background: #58a6ff; }
.mr-mobile-close-btn.grounded { background: #555; color: #fff; }

@media (max-width: 768px) {
  .mr-modal-overlay { padding: 16px; padding-bottom: 100px; }
  .mr-modal-content { padding: 20px; margin-top: 0; }
  .mr-desktop-only { display: none !important; }
  .mr-mobile-close { display: block; }
}
</style>
