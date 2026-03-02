<template>
  <section class="mr-history-section">
    <div class="mr-history-container">
      <div class="mr-history-header">
        <div class="mr-section-label">Launch History</div>
        <h2 class="mr-section-title">Журнал запусков</h2>
      </div>

      <!-- Filters -->
      <div class="mr-history-filters">
        <button :class="['mr-filter-btn', { active: activeFilter === 'all' }]" @click="filterStatus('all')">Все модули <span class="mr-count">({{ allProjects.length }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'soon' }]" @click="filterStatus('soon')"><span class="mr-dot blue"></span>Скоро <span class="mr-count">({{ countByStatus('Скоро запуск') }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'orbit' }]" @click="filterStatus('orbit')"><span class="mr-dot green"></span>Запущен <span class="mr-count">({{ countByStatus('Запущен') }})</span></button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'grounded' }]" @click="filterStatus('grounded')"><span class="mr-dot gray"></span>Отложен <span class="mr-count">({{ countByStatus('Отложен') }})</span></button>
        <button :class="['mr-identity-btn', { active: identityMode }]" @click="toggleIdentityMode">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/></svg>
          Айдентика МР
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
        <button class="mr-modal-close mr-desktop-only" @click="closeImagesModal"></button>
        <div class="mr-modal-content mr-gallery-modal">
          <div class="mr-modal-header"><span class="mr-modal-title">{{ currentProject?.title }}</span></div>
          <div class="mr-gallery-section">
            <div class="mr-gallery-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>Изображения</div>
            <div class="mr-gallery-slider">
              <div v-for="(img, idx) in currentProject?.images" :key="idx" class="mr-gallery-item" @click="expandImage(idx)"><span>{{ img }}</span></div>
            </div>
          </div>
        </div>
        <!-- Expanded image overlay -->
        <div v-if="expandedImageIndex !== null" class="mr-expanded-overlay" @click.self="closeExpandedImage">
          <div class="mr-expanded-content">
            <div class="mr-expanded-image"><span>{{ currentProject?.images[expandedImageIndex] }}</span></div>
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
      <div v-if="videosModalOpen" class="mr-modal-overlay mr-video-overlay" @click.self="closeVideosModal">
        <button class="mr-modal-close mr-desktop-only" @click="closeVideosModal"></button>
        <div class="mr-video-container">
          <div class="mr-video-wrapper">
            <div v-if="!videoLoaded" class="mr-video-poster"><span>{{ currentProject?.videos[0] }}</span></div>
            <div v-if="!videoLoaded" class="mr-play-overlay" @click="initVideo"><div class="mr-play-btn"><svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="rgba(255,85,85,0.8)"/><path d="M32 25L57 40L32 55V25Z" fill="#fff"/><circle cx="40" cy="40" r="39" stroke="#ff5555" stroke-width="2"/></svg></div></div>
            <video v-show="videoLoaded" ref="videoEl" controls class="mr-video-el" @ended="onVideoEnded"><source src="" type="video/mp4" /></video>
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
            <div class="mr-details-row"><span class="mr-details-label">Статус</span><span class="mr-details-value accent">{{ currentProject?.status }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Дата запуска</span><span class="mr-details-value">{{ currentProject?.launchDate }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Время сборки</span><span class="mr-details-value">{{ currentProject?.buildTime }}</span></div>
            <div class="mr-details-row"><span class="mr-details-label">Изображений</span><span class="mr-details-value">{{ currentProject?.images.length }}</span></div>
            <div v-if="currentProject?.videos.length" class="mr-details-row"><span class="mr-details-label">Видео</span><span class="mr-details-value">{{ currentProject?.videos.length }}</span></div>
            <div v-if="currentProject?.mrBranded" class="mr-details-row"><span class="mr-details-label">Айдентика</span><span class="mr-details-value accent">Модуль Роста®</span></div>
          </div>
          <div :class="['mr-details-tags', currentProjectStatusClass]"><span v-for="tag in currentProject?.tags" :key="tag" class="mr-tag">{{ tag }}</span></div>
          <div :class="['mr-details-links', currentProjectStatusClass]">
            <a v-if="currentProject?.website" :href="currentProject.website" target="_blank" class="mr-link primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>Открыть сайт</a>
            <a v-if="currentProject?.caseUrl" :href="currentProject.caseUrl" target="_blank" class="mr-link secondary">Кейс</a>
            <a v-if="currentProject?.behanceUrl" :href="currentProject.behanceUrl" target="_blank" class="mr-link secondary">Behance</a>
          </div>
        </div>
        <div class="mr-mobile-close"><button :class="['mr-mobile-close-btn', currentProjectStatusClass]" @click="closeDetailsModal">ЗАКРЫТЬ</button></div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project { id: string; title: string; subtitle: string; website: string | null; images: string[]; videos: string[]; tags: string[]; caseUrl: string | null; behanceUrl: string | null; launchDate: string; buildTime: string; status: string; mrBranded: boolean }

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
  { id: 'boom', title: 'Companion App', subtitle: 'b00m.fun', website: 'https://b00m.fun', images: ['Главная страница', 'Каталог аттракционов', 'Карточка аттракциона', 'Система лояльности'], videos: ['Демо приложения', 'Промо ролик'], tags: ['App', 'CRM', 'Payment', 'PWA'], caseUrl: 'https://b00m.fun', behanceUrl: null, launchDate: '01.04.2026', buildTime: '30дн', status: 'Скоро запуск', mrBranded: false },
  { id: 'yurtrust', title: 'Айдентика и Веб', subtitle: 'ЮрТраст', website: '#', images: ['Главная', 'О компании', 'Услуги'], videos: [], tags: ['Айдентика', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '01.01.2024', buildTime: '28дн', status: 'Запущен', mrBranded: true },
  { id: 'hvorostovsky', title: 'Культурный портал', subtitle: 'Фонд Хворостовского', website: 'https://hvorostovsky.org', images: ['Главная', 'О фонде', 'Проекты', 'Артисты', 'Галерея', 'Партнёры', 'Контакты', 'Мобильная версия'], videos: ['Презентация фонда', 'Документальный фильм', 'Концертное видео'], tags: ['Айдентика', 'Веб', 'БД', 'Видео'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '15.11.2023', buildTime: '45дн', status: 'Запущен', mrBranded: true },
  { id: 'tanurkova', title: 'Архитектурное бюро', subtitle: 'Tanurkova Arch Design', website: 'https://tanurkova.com', images: ['Портфолио', 'Проект Villa', 'Проект Office', 'Проект Apartment', 'О студии', 'Контакты'], videos: ['Видео тур'], tags: ['Айдентика', 'Веб', 'Видео'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '10.09.2023', buildTime: '30дн', status: 'Отложен', mrBranded: true },
  { id: 'august', title: 'Театральная студия', subtitle: 'Август', website: 'https://august-theater.ru', images: ['Главная', 'Репертуар', 'Контакты'], videos: [], tags: ['Стратегия', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '22.07.2023', buildTime: '21дн', status: 'Отложен', mrBranded: true },
  { id: 'fizkultura', title: 'Стратегия', subtitle: 'FIZКультура', website: null, images: ['Концепт'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.06.2022', buildTime: '14дн', status: 'Отложен', mrBranded: false },
  { id: 'bloomkids', title: 'Детский магазин', subtitle: 'Блумкидс', website: 'https://bloomkids.ru', images: ['Главная', 'Каталог', 'О нас', 'Доставка', 'Карточка товара', 'Корзина', 'Личный кабинет', 'Блог', 'Акции', 'Контакты'], videos: ['Презентация бренда', 'Рекламный ролик'], tags: ['Айдентика', 'Веб', 'Видео', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '20.01.2022', buildTime: '35дн', status: 'Запущен', mrBranded: true },
  { id: 'ermolaev', title: 'Стратегия', subtitle: 'Ермолаевъ', website: null, images: ['Концепт'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.03.2022', buildTime: '14дн', status: 'Отложен', mrBranded: false },
  { id: 'wps', title: 'Международный саммит', subtitle: 'World Plastics Summit', website: 'https://worldplastics.org', images: ['Главная', 'Спикеры', 'Программа', 'Партнёры', 'Регистрация', 'Галерея 2022', 'Пресс-центр', 'Архив', 'О саммите', 'Контакты', 'FAQ', 'Мобильная версия'], videos: ['Промо ролик', 'Aftermovie 2022', 'Интервью спикеров', 'Highlights'], tags: ['Айдентика', 'Веб', 'Видео', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '15.05.2022', buildTime: '28дн', status: 'Запущен', mrBranded: true },
  { id: 'modelex', title: 'Школа моделинга', subtitle: 'Modelex Education', website: 'https://modelex.pro', images: ['Главная', 'Курсы', 'О школе', 'Преподаватели', 'Расписание', 'Отзывы', 'Контакты'], videos: [], tags: ['Айдентика', 'Web', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '05.08.2021', buildTime: '30дн', status: 'Запущен', mrBranded: true },
  { id: 'smstretching1', title: 'Автоматизация маркетинга', subtitle: 'SMSTRETCHING', website: null, images: ['Dashboard'], videos: [], tags: ['Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '01.04.2021', buildTime: '21дн', status: 'Отложен', mrBranded: false },
  { id: 'smstretching2', title: 'Стратегия', subtitle: 'SMSTRETCHING', website: null, images: ['Концепт'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.02.2021', buildTime: '14дн', status: 'Отложен', mrBranded: false },
  { id: 'gala', title: 'Благотворительный бал', subtitle: 'GALA RUSSE', website: 'https://galarusse.com', images: ['Главная', 'О мероприятии', 'Программа', 'Партнёры', 'Галерея'], videos: [], tags: ['Айдентика', 'Веб', 'Видео'], caseUrl: null, behanceUrl: null, launchDate: '18.10.2021', buildTime: '42дн', status: 'Запущен', mrBranded: false },
  { id: 'easybusy', title: 'Бизнес-сервис', subtitle: 'EASYBUSY', website: 'https://easybusy.ru', images: ['Главная', 'Сервисы', 'Тарифы', 'О компании', 'Кейсы', 'Контакты'], videos: [], tags: ['Айдентика', 'Web', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '01.06.2020', buildTime: '28дн', status: 'Запущен', mrBranded: true },
  { id: 'rawbites', title: 'Айдентика и Веб', subtitle: 'RAW BITES', website: '#', images: ['Главная', 'Продукция', 'О бренде'], videos: [], tags: ['Айдентика', 'Web', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.03.2020', buildTime: '28дн', status: 'Запущен', mrBranded: true },
  { id: 'woodled', title: 'Дизайнерские светильники', subtitle: 'WOODLED', website: 'https://woodled.ru', images: ['Главная', 'Каталог', 'О бренде', 'Контакты'], videos: [], tags: ['Стратегия', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '28.02.2020', buildTime: '35дн', status: 'Запущен', mrBranded: false },
  { id: 'concordia', title: 'Автоматизация продаж', subtitle: 'Конкордия-Авто', website: null, images: ['Dashboard', 'CRM'], videos: [], tags: ['Продажи', 'Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '01.01.2020', buildTime: '21дн', status: 'Запущен', mrBranded: false },
  { id: 'superland', title: 'Парк развлечений', subtitle: 'SUPERLAND', website: null, images: ['Концепт главной', 'Wireframes'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '15.11.2018', buildTime: '14дн', status: 'Отложен', mrBranded: false },
  { id: 'chishminsky', title: 'Айдентика и Веб', subtitle: 'Чишминский', website: '#', images: ['Главная', 'Продукция', 'О компании'], videos: [], tags: ['Айдентика', 'Веб', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.06.2018', buildTime: '35дн', status: 'Запущен', mrBranded: true },
  { id: 'milimon', title: 'Производитель мебели', subtitle: 'Milimon', website: 'https://milimon.ru', images: ['Главная', 'Услуги', 'Контакты'], videos: [], tags: ['Стратегия', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '01.01.2016', buildTime: '21дн', status: 'Запущен', mrBranded: false },
  { id: 'mindal', title: 'Айдентика и Стратегия', subtitle: 'Миндаль', website: null, images: ['Концепт'], videos: [], tags: ['Айдентика', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.01.2014', buildTime: '21дн', status: 'Отложен', mrBranded: true },
  { id: 'pozpsy', title: 'Концепция и Айдентика', subtitle: 'Школа Позитивной Психологии', website: null, images: ['Концепт'], videos: [], tags: ['Концепция', 'Айдентика', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.01.2011', buildTime: '28дн', status: 'Отложен', mrBranded: true },
  { id: 'moroshka', title: 'Концепция и Айдентика', subtitle: 'Морошка', website: null, images: ['Концепт'], videos: [], tags: ['Концепция', 'Айдентика', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '01.01.2010', buildTime: '28дн', status: 'Запущен', mrBranded: true },
  { id: 'smonline1', title: 'ИИ для контактов клиентов', subtitle: 'SM Online', website: null, images: ['Dashboard'], videos: [], tags: ['Продажи', 'Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '01.05.2021', buildTime: '14дн', status: 'Отложен', mrBranded: false },
  { id: 'smonline2', title: 'ИИ-ассистенты для продаж', subtitle: 'SM Online', website: null, images: ['Dashboard'], videos: [], tags: ['Продажи', 'Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '01.06.2021', buildTime: '14дн', status: 'Отложен', mrBranded: false }
])

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
      const now = new Date(2026, 2, 2)
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
    const now = new Date(2026, 2, 2)
    const months = (now.getFullYear() - launch.getFullYear()) * 12 + (now.getMonth() - launch.getMonth())
    const y = Math.floor(months / 12), mo = months % 12
    const yWord = y === 1 ? 'год' : (y >= 2 && y <= 4) ? 'года' : 'лет'
    if (y >= 1) return mo > 0 ? `${y} ${yWord} ${mo} мес` : `${y}+ ${yWord}`
    return `${mo} мес`
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
.mr-history-section { padding: 80px 24px 130px; }
.mr-history-container { max-width: 1100px; margin: 0 auto; }
.mr-history-header { margin-bottom: 24px; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgb(0, 255, 136); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 500; color: #fff; }

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

.mr-identity-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; background: linear-gradient(135deg, rgba(255, 85, 85, 0.2), rgba(255, 85, 85, 0.05)) !important; border: 2px solid #ff5555 !important; border-radius: 8px; color: #ff5555 !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; margin-left: auto; text-decoration: none !important; }
.mr-identity-btn:hover, .mr-identity-btn.active { background: #ff5555 !important; color: white !important; box-shadow: 0 0 30px rgba(255, 85, 85, 0.5); }
.mr-identity-btn::before, .mr-identity-btn::after { display: none !important; content: none !important; }
.mr-identity-btn svg { flex-shrink: 0; }

@media (max-width: 900px) {
  .mr-history-filters { flex-direction: column; align-items: stretch; }
  .mr-identity-btn { margin-left: 0; width: 100%; justify-content: center; }
}

/* Table - правка #14: фон ярче */
.mr-history-table { background: rgba(26, 26, 26, 0.8); border: 1px solid #222; border-radius: 8px; overflow: hidden; }
/* Правка #9: одинаковые отступы слева и справа */
.mr-history-row { display: grid; grid-template-columns: 90px 1fr auto 170px; align-items: center; padding: 16px 32px; border-bottom: 1px solid #222; transition: all 0.3s ease; gap: 20px; cursor: pointer; }
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
.mr-history-logo { width: 64px; height: 64px; border: 2px solid #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease; position: relative; cursor: pointer; }
.mr-history-logo svg { color: rgb(0, 255, 136); }
.mr-history-row:hover .mr-history-logo { border-color: rgb(0, 255, 136); box-shadow: 0 0 30px rgba(0, 255, 136, 0.4); }
.mr-history-logo.soon svg { color: #58a6ff; }
.mr-history-logo.soon { border-color: rgba(88, 166, 255, 0.3); }
.mr-history-row:hover .mr-history-logo.soon { border-color: #58a6ff; box-shadow: 0 0 30px rgba(88, 166, 255, 0.3); }
.mr-history-logo.grounded svg { color: #7d8590; }
.mr-history-logo.grounded { border-color: rgba(125, 133, 144, 0.3); }
.mr-history-row:hover .mr-history-logo.grounded { border-color: #7d8590; box-shadow: 0 0 30px rgba(125, 133, 144, 0.3); }
.mr-history-logo.branded::before, .mr-history-logo.branded::after { content: ''; position: absolute; inset: -2px; border: 2px solid rgb(0, 255, 136); border-radius: 14px; opacity: 0; animation: mr-radar 8s ease-out infinite; }
.mr-history-logo.branded::after { animation-delay: 4s; }
.mr-history-logo.branded.soon::before, .mr-history-logo.branded.soon::after { border-color: #58a6ff; }
.mr-history-logo.branded.grounded::before, .mr-history-logo.branded.grounded::after { border-color: #7d8590; }
@keyframes mr-radar { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.6); opacity: 0; } }

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

/* Build block - правка #10, #11, #12 */
.mr-history-build { display: flex; align-items: center; flex-shrink: 0; }
.mr-build-block { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: transparent !important; border: 2px solid rgb(0, 255, 136) !important; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; text-decoration: none !important; position: relative; }
.mr-build-block::before, .mr-build-block::after { display: none !important; content: none !important; }
.mr-build-block svg { color: rgb(0, 255, 136); flex-shrink: 0; }
.mr-build-info { display: flex; flex-direction: column; gap: 1px; transition: opacity 0.2s ease; }
.mr-build-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #555; text-transform: uppercase; }
.mr-build-time { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fff; font-weight: 700; }
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
.mr-accordion-content.open { max-height: 3000px; }

/* Identity Grid */
.mr-identity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 800px) { .mr-identity-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .mr-identity-grid { grid-template-columns: 1fr; } }
.mr-identity-card { background: linear-gradient(180deg, rgba(255, 85, 85, 0.15), transparent); border: 2px solid rgba(255, 85, 85, 0.3); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.4s ease; cursor: pointer; }
.mr-identity-card:hover { background: #ff5555; border-color: #ff5555; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(255, 85, 85, 0.3); }
.mr-identity-logo { width: 120px; height: 120px; border: 3px solid rgba(255, 85, 85, 0.3); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; transition: all 0.3s ease; }
.mr-identity-logo svg { color: #ff5555; transition: color 0.3s ease; }
.mr-identity-card:hover .mr-identity-logo { border-color: rgba(0, 0, 0, 0.2); }
.mr-identity-card:hover .mr-identity-logo svg { color: #000; }
.mr-identity-name { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 8px; transition: color 0.3s ease; }
.mr-identity-card:hover .mr-identity-name { color: #000; }
.mr-identity-date { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #555; transition: color 0.3s ease; }
.mr-identity-card:hover .mr-identity-date { color: rgba(0, 0, 0, 0.6); }

/* Modals */
.mr-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: flex-start; justify-content: center; padding: 40px; padding-bottom: 100px; overflow-y: auto; }
.mr-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: transparent !important; border: 2px solid #ff5555 !important; color: #ff5555 !important; cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; }
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
  .mr-mobile-close { display: block; position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: #000; z-index: 10002; }
  .mr-mobile-close-btn { width: 100%; padding: 16px; background: #000 !important; border: 2px solid #ff5555 !important; color: #ff5555 !important; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: 2px; border-radius: 8px; cursor: pointer; text-decoration: none !important; }
  .mr-mobile-close-btn:hover { background: #ff5555 !important; color: #000 !important; }
  .mr-mobile-close-btn::before, .mr-mobile-close-btn::after { display: none !important; content: none !important; }
  .mr-mobile-close-btn.soon { border-color: #58a6ff !important; color: #58a6ff !important; }
  .mr-mobile-close-btn.soon:hover { background: #58a6ff !important; }
  .mr-mobile-close-btn.orbit { border-color: rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; }
  .mr-mobile-close-btn.orbit:hover { background: rgb(0, 255, 136) !important; }
  .mr-mobile-close-btn.grounded { border-color: #7d8590 !important; color: #7d8590 !important; }
  .mr-mobile-close-btn.grounded:hover { background: #7d8590 !important; }
}

/* Gallery */
.mr-gallery-modal { max-width: 100%; }
.mr-gallery-section { overflow: visible; padding: 0 16px; }
.mr-gallery-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ff5555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.mr-gallery-label svg { width: 16px; height: 16px; }
.mr-gallery-slider { display: flex; gap: 24px; overflow-x: auto; padding: 16px 0; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
.mr-gallery-slider::-webkit-scrollbar { height: 6px; }
.mr-gallery-slider::-webkit-scrollbar-track { background: rgba(17, 17, 17, 0.5); border-radius: 3px; }
.mr-gallery-slider::-webkit-scrollbar-thumb { background: #ff5555; border-radius: 3px; }
.mr-gallery-item { min-width: 400px; height: 260px; background: rgba(17, 17, 17, 0.5); border: 1px solid rgba(255, 85, 85, 0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.4s ease; flex-shrink: 0; }
.mr-gallery-item:hover { border-color: #ff5555; box-shadow: 0 10px 30px rgba(255, 85, 85, 0.2); }
.mr-gallery-item span { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #ff5555; }

/* Expanded image */
.mr-expanded-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 1); z-index: 10010; display: flex; align-items: center; justify-content: center; }
.mr-expanded-content { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 20px; max-width: 90vw; }
.mr-expanded-image { width: 80vw; height: 70vh; background: rgba(17, 17, 17, 0.8); border: 2px solid #ff5555; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.mr-expanded-image span { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #ff5555; }
.mr-expanded-back { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: transparent !important; border: 2px solid #ff5555 !important; color: #ff5555 !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; letter-spacing: 1px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-decoration: none !important; }
.mr-expanded-back:hover { background: #ff5555 !important; color: #000 !important; }
.mr-expanded-back::before, .mr-expanded-back::after { display: none !important; content: none !important; }

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

/* Details - правка #13: цвет кнопок по статусу */
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

.mr-details-links { display: flex; gap: 12px; flex-wrap: wrap; padding-top: 24px; border-top: 1px solid #222; }
.mr-link { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; text-decoration: none !important; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease; }
.mr-link::before, .mr-link::after { display: none !important; content: none !important; }
.mr-link.primary { background: rgb(0, 255, 136) !important; border: 1px solid rgb(0, 255, 136) !important; color: #000 !important; }
.mr-link.primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }
.mr-link.secondary { background: transparent !important; border: 1px solid rgb(0, 255, 136) !important; color: rgb(0, 255, 136) !important; }
.mr-link.secondary:hover { background: rgba(0, 255, 136, 0.1) !important; }
.mr-details-links.soon .mr-link.primary { background: #58a6ff !important; border-color: #58a6ff !important; }
.mr-details-links.soon .mr-link.secondary { border-color: #58a6ff !important; color: #58a6ff !important; }
.mr-details-links.soon .mr-link.secondary:hover { background: rgba(88, 166, 255, 0.1) !important; }
.mr-details-links.grounded .mr-link.primary { background: #7d8590 !important; border-color: #7d8590 !important; }
.mr-details-links.grounded .mr-link.secondary { border-color: #7d8590 !important; color: #7d8590 !important; }
.mr-details-links.grounded .mr-link.secondary:hover { background: rgba(125, 133, 144, 0.1) !important; }
</style>
