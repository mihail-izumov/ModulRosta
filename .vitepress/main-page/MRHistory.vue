<template>
  <section class="mr-launches-section">
    <div class="mr-launches-container">
      <div class="mr-launches-header">
        <div class="mr-section-label">Launch History</div>
        <h2 class="mr-section-title">Журнал запусков</h2>
      </div>

      <!-- FILTERS -->
      <div class="mr-status-filters">
        <button :class="['mr-filter-btn', { active: activeFilter === 'all' }]" @click="filterStatus('all')">
          Все модули <span class="mr-count-badge">({{ allProjects.length }})</span>
        </button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'soon' }]" @click="filterStatus('soon')">
          <span class="mr-dot blue"></span>Скоро <span class="mr-count-badge">({{ countByStatus('Скоро запуск') }})</span>
        </button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'orbit' }]" @click="filterStatus('orbit')">
          <span class="mr-dot green"></span>Запущен <span class="mr-count-badge">({{ countByStatus('Запущен') }})</span>
        </button>
        <button :class="['mr-filter-btn', { active: activeFilter === 'grounded' }]" @click="filterStatus('grounded')">
          <span class="mr-dot gray"></span>Отложен <span class="mr-count-badge">({{ countByStatus('Отложен') }})</span>
        </button>
        
        <button :class="['mr-identity-mode-btn', { active: identityMode }]" @click="toggleIdentityMode">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/></svg>
          Айдентика МР
        </button>
      </div>
      
      <!-- TABLE VIEW -->
      <div v-show="!identityMode" class="mr-launch-table-wrap">
        <!-- Main rows (first 5) -->
        <template v-for="(project, index) in filteredProjects" :key="project.id">
          <div v-if="index < 5" :class="['mr-launch-row', { hidden: !isVisible(project) }]">
            <div :class="['mr-launch-logo', getStatusClass(project.status), { 'mr-branded': project.mrBranded }]" @click.stop="openDetails(project.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <div class="mr-launch-info">
              <div class="mr-launch-top">
                <span class="mr-launch-name">{{ project.title }}</span>
                <span :class="['mr-launch-subtitle', getStatusClass(project.status)]">{{ project.subtitle }}</span>
              </div>
              <div class="mr-launch-uptime-wrap">
                <span :class="['mr-launch-uptime', getUptimeClass(project.status)]">
                  <span class="mr-ticker-icon"></span>
                  <span>{{ getUptime(project) }}</span>
                </span>
                <span class="mr-launch-date">Запуск: {{ project.launchDate }}</span>
              </div>
            </div>
            <div class="mr-launch-media">
              <button v-if="project.images.length" class="mr-media-btn" @click.stop="openImages(project.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                <span class="mr-count">{{ project.images.length }}</span>
              </button>
              <button v-if="project.videos.length" class="mr-media-btn" @click.stop="openVideos(project.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span class="mr-count">{{ project.videos.length }}</span>
              </button>
            </div>
            <div class="mr-launch-build">
              <div :class="['mr-build-details-block', getStatusClass(project.status)]" @click.stop="openDetails(project.id)">
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
        </template>

        <!-- Accordion toggle -->
        <button v-if="accordionProjects.length > 0" :class="['mr-accordion-toggle', { open: accordionOpen }]" @click="toggleAccordion">
          <span>{{ accordionOpen ? 'Свернуть' : `Ещё ${accordionProjects.length} модулей` }}</span>
          <span class="mr-arrow">↓</span>
        </button>

        <!-- Accordion content -->
        <div :class="['mr-accordion-content', { open: accordionOpen }]">
          <template v-for="project in accordionProjects" :key="project.id">
            <div :class="['mr-launch-row', { hidden: !isVisible(project) }]">
              <div :class="['mr-launch-logo', getStatusClass(project.status), { 'mr-branded': project.mrBranded }]" @click.stop="openDetails(project.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </div>
              <div class="mr-launch-info">
                <div class="mr-launch-top">
                  <span class="mr-launch-name">{{ project.title }}</span>
                  <span :class="['mr-launch-subtitle', getStatusClass(project.status)]">{{ project.subtitle }}</span>
                </div>
                <div class="mr-launch-uptime-wrap">
                  <span :class="['mr-launch-uptime', getUptimeClass(project.status)]">
                    <span class="mr-ticker-icon"></span>
                    <span>{{ getUptime(project) }}</span>
                  </span>
                  <span class="mr-launch-date">Запуск: {{ project.launchDate }}</span>
                </div>
              </div>
              <div class="mr-launch-media">
                <button v-if="project.images.length" class="mr-media-btn" @click.stop="openImages(project.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <span class="mr-count">{{ project.images.length }}</span>
                </button>
                <button v-if="project.videos.length" class="mr-media-btn" @click.stop="openVideos(project.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span class="mr-count">{{ project.videos.length }}</span>
                </button>
              </div>
              <div class="mr-launch-build">
                <div :class="['mr-build-details-block', getStatusClass(project.status)]" @click.stop="openDetails(project.id)">
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
          </template>
        </div>
      </div>

      <!-- LOGO GRID VIEW (Identity Mode) -->
      <div v-show="identityMode" class="mr-logo-grid">
        <div v-for="project in mrBrandedProjects" :key="project.id" class="mr-logo-card" @click="openDetails(project.id)">
          <div class="mr-logo-card-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div class="mr-logo-card-name">{{ project.subtitle }}</div>
          <div class="mr-logo-card-date">{{ project.launchDate }}</div>
        </div>
      </div>
    </div>

    <!-- IMAGES MODAL -->
    <Teleport to="body">
      <div v-if="imagesModalOpen" class="mr-modal-overlay" @click.self="closeImagesModal">
        <button :class="['mr-modal-close', currentProjectStatusClass]" @click="closeImagesModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header">
            <span :class="['mr-modal-title', currentProjectStatusClass]">{{ currentProject?.title }}</span>
          </div>
          <div class="mr-gallery-section">
            <div class="mr-gallery-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              Изображения
            </div>
            <div class="mr-gallery-slider">
              <div v-for="(img, idx) in currentProject?.images" :key="idx" class="mr-gallery-item">
                <span>{{ img }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- VIDEOS MODAL -->
    <Teleport to="body">
      <div v-if="videosModalOpen" class="mr-modal-overlay" @click.self="closeVideosModal">
        <button :class="['mr-modal-close', currentProjectStatusClass]" @click="closeVideosModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header">
            <span :class="['mr-modal-title', currentProjectStatusClass]">{{ currentProject?.title }}</span>
          </div>
          <div class="mr-gallery-section">
            <div class="mr-gallery-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Видео
            </div>
            <div class="mr-gallery-slider">
              <div v-for="(vid, idx) in currentProject?.videos" :key="idx" class="mr-gallery-item video">
                <span>{{ vid }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- DETAILS MODAL -->
    <Teleport to="body">
      <div v-if="detailsModalOpen" class="mr-modal-overlay" @click.self="closeDetailsModal">
        <button :class="['mr-modal-close', currentProjectStatusClass]" @click="closeDetailsModal"></button>
        <div class="mr-modal-content">
          <div class="mr-modal-header">
            <span :class="['mr-modal-title', currentProjectStatusClass]">{{ currentProject?.title }}</span>
          </div>
          <div :class="['mr-details-meta', currentProjectStatusClass]">
            <div v-if="currentProject?.subtitle" class="mr-details-meta-row">
              <span class="mr-details-meta-label">Клиент</span>
              <span class="mr-details-meta-value" :style="{ color: getValueColor(currentProject?.status) }">{{ currentProject?.subtitle }}</span>
            </div>
            <div class="mr-details-meta-row">
              <span class="mr-details-meta-label">Статус</span>
              <span class="mr-details-meta-value" :style="{ color: getValueColor(currentProject?.status) }">{{ currentProject?.status }}</span>
            </div>
            <div class="mr-details-meta-row">
              <span class="mr-details-meta-label">Дата запуска</span>
              <span class="mr-details-meta-value">{{ currentProject?.launchDate }}</span>
            </div>
            <div class="mr-details-meta-row">
              <span class="mr-details-meta-label">Время сборки</span>
              <span class="mr-details-meta-value">{{ currentProject?.buildTime }}</span>
            </div>
            <div class="mr-details-meta-row">
              <span class="mr-details-meta-label">Изображений</span>
              <span class="mr-details-meta-value">{{ currentProject?.images.length }}</span>
            </div>
            <div v-if="currentProject?.videos.length" class="mr-details-meta-row">
              <span class="mr-details-meta-label">Видео</span>
              <span class="mr-details-meta-value">{{ currentProject?.videos.length }}</span>
            </div>
            <div v-if="currentProject?.mrBranded" class="mr-details-meta-row">
              <span class="mr-details-meta-label">Айдентика</span>
              <span class="mr-details-meta-value" :style="{ color: getValueColor(currentProject?.status) }">Модуль Роста®</span>
            </div>
          </div>
          <div :class="['mr-details-tags', currentProjectStatusClass]">
            <span v-for="tag in currentProject?.tags" :key="tag" class="mr-details-tag">{{ tag }}</span>
          </div>
          <div :class="['mr-details-links', currentProjectStatusClass]">
            <a v-if="currentProject?.website" :href="currentProject.website" target="_blank" class="mr-details-link primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
              Открыть сайт
            </a>
            <a v-if="currentProject?.caseUrl" :href="currentProject.caseUrl" target="_blank" class="mr-details-link">Кейс</a>
            <a v-if="currentProject?.behanceUrl" :href="currentProject.behanceUrl" target="_blank" class="mr-details-link">Behance</a>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
  id: string
  title: string
  subtitle: string
  website: string | null
  images: string[]
  videos: string[]
  tags: string[]
  caseUrl: string | null
  behanceUrl: string | null
  launchDate: string
  buildTime: string
  status: string
  mrBranded: boolean
}

const activeFilter = ref('all')
const identityMode = ref(false)
const accordionOpen = ref(false)
const imagesModalOpen = ref(false)
const videosModalOpen = ref(false)
const detailsModalOpen = ref(false)
const currentProjectId = ref<string | null>(null)

const allProjects = ref<Project[]>([
  { id: 'boom', title: 'Companion App', subtitle: 'b00m.fun', website: 'https://b00m.fun', images: ['Главная страница', 'Каталог аттракционов', 'Карточка аттракциона', 'Система лояльности'], videos: ['Демо приложения', 'Промо ролик'], tags: ['App', 'CRM', 'Payment', 'PWA'], caseUrl: 'https://b00m.fun', behanceUrl: null, launchDate: '01.04.2026', buildTime: '30 дней', status: 'Скоро запуск', mrBranded: false },
  { id: 'yurtrust', title: 'Айдентика и Веб', subtitle: 'ЮрТраст', website: '#', images: ['Главная', 'О компании', 'Услуги'], videos: [], tags: ['Айдентика', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '2024', buildTime: '28 дней', status: 'Запущен', mrBranded: true },
  { id: 'hvorostovsky', title: 'Культурный портал', subtitle: 'Фонд Хворостовского', website: 'https://hvorostovsky.org', images: ['Главная', 'О фонде', 'Проекты', 'Артисты', 'Галерея', 'Партнёры', 'Контакты', 'Мобильная версия'], videos: ['Презентация фонда', 'Документальный фильм', 'Концертное видео'], tags: ['Айдентика', 'Веб', 'БД', 'Видео'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '15.11.2023', buildTime: '45 дней', status: 'Запущен', mrBranded: true },
  { id: 'tanurkova', title: 'Архитектурное бюро', subtitle: 'Tanurkova Arch Design', website: 'https://tanurkova.com', images: ['Портфолио', 'Проект Villa', 'Проект Office', 'Проект Apartment', 'О студии', 'Контакты'], videos: ['Видео тур'], tags: ['Айдентика', 'Веб', 'Видео'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '10.09.2023', buildTime: '30 дней', status: 'Отложен', mrBranded: true },
  { id: 'august', title: 'Театральная студия', subtitle: 'Август', website: 'https://august-theater.ru', images: ['Главная', 'Репертуар', 'Контакты'], videos: [], tags: ['Стратегия', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '22.07.2023', buildTime: '21 день', status: 'Отложен', mrBranded: true },
  { id: 'fizkultura', title: 'Стратегия', subtitle: 'FIZКультура', website: null, images: ['Концепт'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2022', buildTime: '14 дней', status: 'Отложен', mrBranded: false },
  { id: 'bloomkids', title: 'Детский магазин', subtitle: 'Блумкидс', website: 'https://bloomkids.ru', images: ['Главная', 'Каталог', 'О нас', 'Доставка', 'Карточка товара', 'Корзина', 'Личный кабинет', 'Блог', 'Акции', 'Контакты'], videos: ['Презентация бренда', 'Рекламный ролик'], tags: ['Айдентика', 'Веб', 'Видео', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '20.01.2022', buildTime: '35 дней', status: 'Запущен', mrBranded: true },
  { id: 'ermolaev', title: 'Стратегия', subtitle: 'Ермолаевъ', website: null, images: ['Концепт'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2022', buildTime: '14 дней', status: 'Отложен', mrBranded: false },
  { id: 'wps', title: 'Международный саммит', subtitle: 'World Plastics Summit', website: 'https://worldplastics.org', images: ['Главная', 'Спикеры', 'Программа', 'Партнёры', 'Регистрация', 'Галерея 2022', 'Пресс-центр', 'Архив', 'О саммите', 'Контакты', 'FAQ', 'Мобильная версия'], videos: ['Промо ролик', 'Aftermovie 2022', 'Интервью спикеров', 'Highlights'], tags: ['Айдентика', 'Веб', 'Видео', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '15.05.2022', buildTime: '28 дней', status: 'Запущен', mrBranded: true },
  { id: 'modelex', title: 'Школа моделинга', subtitle: 'Modelex Education', website: 'https://modelex.pro', images: ['Главная', 'Курсы', 'О школе', 'Преподаватели', 'Расписание', 'Отзывы', 'Контакты'], videos: [], tags: ['Айдентика', 'Web', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '05.08.2021', buildTime: '30 дней', status: 'Запущен', mrBranded: true },
  { id: 'smstretching1', title: 'Автоматизация маркетинга', subtitle: 'SMSTRETCHING', website: null, images: ['Dashboard'], videos: [], tags: ['Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '2021', buildTime: '21 день', status: 'Отложен', mrBranded: false },
  { id: 'smstretching2', title: 'Стратегия', subtitle: 'SMSTRETCHING', website: null, images: ['Концепт'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2021', buildTime: '14 дней', status: 'Отложен', mrBranded: false },
  { id: 'gala', title: 'Благотворительный бал', subtitle: 'GALA RUSSE', website: 'https://galarusse.com', images: ['Главная', 'О мероприятии', 'Программа', 'Партнёры', 'Галерея'], videos: [], tags: ['Айдентика', 'Веб', 'Видео'], caseUrl: null, behanceUrl: null, launchDate: '18.10.2021', buildTime: '42 дня', status: 'Запущен', mrBranded: false },
  { id: 'easybusy', title: 'Бизнес-сервис', subtitle: 'EASYBUSY', website: 'https://easybusy.ru', images: ['Главная', 'Сервисы', 'Тарифы', 'О компании', 'Кейсы', 'Контакты'], videos: [], tags: ['Айдентика', 'Web', 'Стратегия'], caseUrl: '#', behanceUrl: 'https://behance.net/orxaos', launchDate: '2020', buildTime: '28 дней', status: 'Запущен', mrBranded: true },
  { id: 'rawbites', title: 'Айдентика и Веб', subtitle: 'RAW BITES', website: '#', images: ['Главная', 'Продукция', 'О бренде'], videos: [], tags: ['Айдентика', 'Web', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2020', buildTime: '28 дней', status: 'Запущен', mrBranded: true },
  { id: 'woodled', title: 'Дизайнерские светильники', subtitle: 'WOODLED', website: 'https://woodled.ru', images: ['Главная', 'Каталог', 'О бренде', 'Контакты'], videos: [], tags: ['Стратегия', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '28.02.2020', buildTime: '35 дней', status: 'Запущен', mrBranded: false },
  { id: 'concordia', title: 'Автоматизация продаж', subtitle: 'Конкордия-Авто', website: null, images: ['Dashboard', 'CRM'], videos: [], tags: ['Продажи', 'Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '2020', buildTime: '21 день', status: 'Запущен', mrBranded: false },
  { id: 'superland', title: 'Парк развлечений', subtitle: 'SUPERLAND', website: null, images: ['Концепт главной', 'Wireframes'], videos: [], tags: ['Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '15.11.2018', buildTime: '14 дней', status: 'Отложен', mrBranded: false },
  { id: 'chishminsky', title: 'Айдентика и Веб', subtitle: 'Чишминский', website: '#', images: ['Главная', 'Продукция', 'О компании'], videos: [], tags: ['Айдентика', 'Веб', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2018', buildTime: '35 дней', status: 'Запущен', mrBranded: true },
  { id: 'milimon', title: 'Производитель мебели', subtitle: 'Milimon', website: 'https://milimon.ru', images: ['Главная', 'Услуги', 'Контакты'], videos: [], tags: ['Стратегия', 'Веб'], caseUrl: null, behanceUrl: null, launchDate: '2016', buildTime: '21 день', status: 'Запущен', mrBranded: false },
  { id: 'mindal', title: 'Айдентика и Стратегия', subtitle: 'Миндаль', website: null, images: ['Концепт'], videos: [], tags: ['Айдентика', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2014', buildTime: '21 день', status: 'Отложен', mrBranded: true },
  { id: 'pozpsy', title: 'Концепция и Айдентика', subtitle: 'Школа Позитивной Психологии', website: null, images: ['Концепт'], videos: [], tags: ['Концепция', 'Айдентика', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2011', buildTime: '28 дней', status: 'Отложен', mrBranded: true },
  { id: 'moroshka', title: 'Концепция и Айдентика', subtitle: 'Морошка', website: null, images: ['Концепт'], videos: [], tags: ['Концепция', 'Айдентика', 'Стратегия'], caseUrl: null, behanceUrl: null, launchDate: '2010', buildTime: '28 дней', status: 'Запущен', mrBranded: true },
  { id: 'smonline1', title: 'ИИ для контактов клиентов', subtitle: 'SM Online', website: null, images: ['Dashboard'], videos: [], tags: ['Продажи', 'Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '2021', buildTime: '14 дней', status: 'Отложен', mrBranded: false },
  { id: 'smonline2', title: 'ИИ-ассистенты для продаж', subtitle: 'SM Online', website: null, images: ['Dashboard'], videos: [], tags: ['Продажи', 'Автоматизация'], caseUrl: null, behanceUrl: null, launchDate: '2021', buildTime: '14 дней', status: 'Отложен', mrBranded: false }
])

const currentProject = computed(() => {
  if (!currentProjectId.value) return null
  return allProjects.value.find(p => p.id === currentProjectId.value) || null
})

const currentProjectStatusClass = computed(() => {
  if (!currentProject.value) return ''
  return getStatusClass(currentProject.value.status)
})

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return allProjects.value
  const statusMap: Record<string, string> = { soon: 'Скоро запуск', orbit: 'Запущен', grounded: 'Отложен' }
  return allProjects.value.filter(p => p.status === statusMap[activeFilter.value])
})

const accordionProjects = computed(() => filteredProjects.value.slice(5))

const mrBrandedProjects = computed(() => allProjects.value.filter(p => p.mrBranded))

function countByStatus(status: string): number {
  return allProjects.value.filter(p => p.status === status).length
}

function filterStatus(status: string) {
  if (identityMode.value) {
    identityMode.value = false
  }
  activeFilter.value = status
  accordionOpen.value = false
}

function toggleIdentityMode() {
  identityMode.value = !identityMode.value
  if (identityMode.value) {
    activeFilter.value = 'all'
  }
}

function toggleAccordion() {
  accordionOpen.value = !accordionOpen.value
}

function isVisible(project: Project): boolean {
  if (activeFilter.value === 'all') return true
  const statusMap: Record<string, string> = { soon: 'Скоро запуск', orbit: 'Запущен', grounded: 'Отложен' }
  return project.status === statusMap[activeFilter.value]
}

function getStatusClass(status: string): string {
  if (status === 'Скоро запуск') return 'status-soon'
  if (status === 'Запущен') return 'status-orbit'
  if (status === 'Отложен') return 'status-grounded'
  return ''
}

function getUptimeClass(status: string): string {
  if (status === 'Скоро запуск') return 'soon'
  if (status === 'Отложен') return 'grounded-style'
  return ''
}

function getUptime(project: Project): string {
  if (project.status === 'Скоро запуск') return '00:00:00'
  if (project.status === 'Отложен') return '--:--'
  return '1+ год'
}

function getValueColor(status: string | undefined): string {
  if (status === 'Скоро запуск') return '#58a6ff'
  if (status === 'Отложен') return '#7d8590'
  return '#00ff88'
}

function openImages(id: string) {
  currentProjectId.value = id
  imagesModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeImagesModal() {
  imagesModalOpen.value = false
  document.body.style.overflow = ''
}

function openVideos(id: string) {
  currentProjectId.value = id
  videosModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeVideosModal() {
  videosModalOpen.value = false
  document.body.style.overflow = ''
}

function openDetails(id: string) {
  currentProjectId.value = id
  detailsModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeDetailsModal() {
  detailsModalOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.mr-launches-section { background: #0a0a0a; padding: 80px 24px; }
.mr-launches-container { max-width: 1100px; margin: 0 auto; }
.mr-launches-header { margin-bottom: 24px; }
.mr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00ff88; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 16px; }
.mr-section-title { font-size: clamp(28px, 5vw, 42px); font-weight: 300; color: #fff; }

/* Filters */
.mr-status-filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
.mr-filter-btn { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: #111; border: 1px solid #222; border-radius: 8px; color: #888; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease; }
.mr-filter-btn:hover { border-color: #555; color: #fff; }
.mr-filter-btn.active { border-color: white; color: white; background: rgba(255, 255, 255, 0.1); }
.mr-filter-btn .mr-dot { width: 10px; height: 10px; border-radius: 50%; }
.mr-filter-btn .mr-dot.blue { background: #58a6ff; }
.mr-filter-btn .mr-dot.green { background: #00ff88; }
.mr-filter-btn .mr-dot.gray { background: #7d8590; }
.mr-count-badge { font-size: 10px; color: #555; margin-left: 4px; }

/* Identity Mode Button */
.mr-identity-mode-btn { display: flex; align-items: center; gap: 10px; padding: 12px 24px; background: linear-gradient(135deg, rgba(255, 85, 85, 0.2), rgba(255, 85, 85, 0.05)); border: 2px solid #ff5555; border-radius: 8px; color: #ff5555; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; margin-left: auto; }
.mr-identity-mode-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 85, 85, 0.3), transparent); animation: mr-scan-btn 2s infinite; }
@keyframes mr-scan-btn { 0% { left: -100%; } 100% { left: 100%; } }
.mr-identity-mode-btn:hover, .mr-identity-mode-btn.active { background: #ff5555; color: white; box-shadow: 0 0 30px rgba(255, 85, 85, 0.5); }
.mr-identity-mode-btn svg { width: 18px; height: 18px; }

@media (max-width: 900px) {
  .mr-status-filters { flex-direction: column; align-items: stretch; }
  .mr-filter-btn { justify-content: center; }
  .mr-identity-mode-btn { margin-left: 0; width: 100%; justify-content: center; }
}

/* Table View */
.mr-launch-table-wrap { background: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; }
.mr-launch-row { display: grid; grid-template-columns: 80px 1fr auto 150px; align-items: center; padding: 16px 20px; border-bottom: 1px solid #222; transition: all 0.3s ease; position: relative; gap: 20px; cursor: pointer; }
.mr-launch-row:hover { background: rgba(0, 255, 136, 0.02); }
.mr-launch-row.hidden { display: none; }

@media (max-width: 700px) {
  .mr-launch-row { grid-template-columns: 60px 1fr auto; padding: 12px 16px; gap: 12px; }
  .mr-launch-row .mr-launch-build { display: none; }
}

/* Logo */
.mr-launch-logo { width: 64px; height: 64px; background: #000; border: 2px solid #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.3s ease; position: relative; overflow: visible; cursor: pointer; }
.mr-launch-logo svg { color: #00ff88; transition: color 0.3s ease; }
.mr-launch-row:hover .mr-launch-logo { border-color: #00ff88; box-shadow: 0 0 30px rgba(0, 255, 136, 0.4); }

.mr-launch-logo.status-soon svg { color: #58a6ff; }
.mr-launch-logo.status-soon { border-color: rgba(88, 166, 255, 0.3); }
.mr-launch-row:hover .mr-launch-logo.status-soon { border-color: #58a6ff; box-shadow: 0 0 30px rgba(88, 166, 255, 0.3); }

.mr-launch-logo.status-orbit svg { color: #00ff88; }
.mr-launch-logo.status-orbit { border-color: rgba(0, 255, 136, 0.3); }

.mr-launch-logo.status-grounded svg { color: #7d8590; }
.mr-launch-logo.status-grounded { border-color: rgba(125, 133, 144, 0.3); }
.mr-launch-row:hover .mr-launch-logo.status-grounded { border-color: #7d8590; box-shadow: 0 0 30px rgba(125, 133, 144, 0.3); }

/* MR Branded radar waves */
.mr-launch-logo.mr-branded::before, .mr-launch-logo.mr-branded::after { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; border: 2px solid #00ff88; border-radius: 14px; opacity: 0; pointer-events: none; }
.mr-launch-logo.mr-branded::before { animation: mr-radar-wave 8s ease-out infinite; }
.mr-launch-logo.mr-branded::after { animation: mr-radar-wave 8s ease-out infinite 4s; }
.mr-launch-logo.mr-branded.status-soon::before, .mr-launch-logo.mr-branded.status-soon::after { border-color: #58a6ff; }
.mr-launch-logo.mr-branded.status-grounded::before, .mr-launch-logo.mr-branded.status-grounded::after { border-color: #7d8590; }
@keyframes mr-radar-wave { 0% { transform: scale(1); opacity: 0.4; } 50% { opacity: 0.15; } 100% { transform: scale(1.6); opacity: 0; } }

/* Info */
.mr-launch-info { min-width: 0; flex: 1; }
.mr-launch-top { display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px; }
.mr-launch-name { font-weight: 600; color: #fff; font-size: 16px; white-space: nowrap; }
.mr-launch-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; }
.mr-launch-subtitle.status-soon { color: #58a6ff; }
.mr-launch-subtitle.status-orbit { color: #00ff88; }
.mr-launch-subtitle.status-grounded { color: #7d8590; }

/* Uptime */
.mr-launch-uptime-wrap { display: flex; flex-direction: column; gap: 2px; }
.mr-launch-uptime { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fff; font-weight: 700; background: linear-gradient(90deg, rgba(0, 255, 136, 0.1), transparent); padding: 4px 10px 4px 8px; border-left: 3px solid #00ff88; border-radius: 0 4px 4px 0; }
.mr-launch-uptime .mr-ticker-icon { width: 6px; height: 6px; background: #00ff88; border-radius: 50%; animation: mr-ticker-blink 1s infinite; }
@keyframes mr-ticker-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.mr-launch-uptime.soon { background: linear-gradient(90deg, rgba(88, 166, 255, 0.1), transparent); border-left-color: #58a6ff; }
.mr-launch-uptime.soon .mr-ticker-icon { background: #58a6ff; }
.mr-launch-uptime.grounded-style { background: linear-gradient(90deg, rgba(125, 133, 144, 0.1), transparent); border-left-color: #7d8590; }
.mr-launch-uptime.grounded-style .mr-ticker-icon { background: #7d8590; animation: none; }
.mr-launch-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #555; padding-left: 11px; }

/* Media buttons */
.mr-launch-media { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.mr-media-btn { width: 40px; height: 40px; background: #000; border: 1px solid rgba(255, 85, 85, 0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; position: relative; }
.mr-media-btn:hover { border-color: #ff5555; background: rgba(255, 85, 85, 0.1); transform: scale(1.05); }
.mr-media-btn svg { width: 16px; height: 16px; color: #ff5555; }
.mr-media-btn .mr-count { position: absolute; top: -4px; right: -4px; min-width: 14px; height: 14px; padding: 0 3px; background: #ff5555; color: white; border-radius: 7px; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Build details */
.mr-launch-build { display: flex; align-items: center; justify-content: flex-start; width: 140px; flex-shrink: 0; }
.mr-build-details-block { display: flex; align-items: center; gap: 12px; padding: 8px 14px; background: #000; border: 2px solid #00ff88; border-radius: 8px; height: 44px; cursor: pointer; transition: all 0.3s ease; position: relative; min-width: 120px; }
.mr-build-details-block .mr-build-details-icon, .mr-build-details-block .mr-build-info { transition: opacity 0.3s ease; }
.mr-build-details-block .mr-details-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #00ff88; opacity: 0; transition: opacity 0.3s ease; }
.mr-build-details-block:hover .mr-build-details-icon, .mr-build-details-block:hover .mr-build-info { opacity: 0; }
.mr-build-details-block:hover .mr-details-text { opacity: 1; }
.mr-build-details-block:hover { background: rgba(0, 255, 136, 0.1); box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); }

.mr-build-details-block.status-soon { border-color: #58a6ff; }
.mr-build-details-block.status-soon .mr-details-text { color: #58a6ff; }
.mr-build-details-block.status-soon .mr-build-details-icon svg { color: #58a6ff; }
.mr-build-details-block.status-soon:hover { background: rgba(88, 166, 255, 0.1); box-shadow: 0 0 20px rgba(88, 166, 255, 0.3); }

.mr-build-details-block.status-grounded { border-color: #7d8590; }
.mr-build-details-block.status-grounded .mr-details-text { color: #7d8590; }
.mr-build-details-block.status-grounded .mr-build-details-icon svg { color: #7d8590; }
.mr-build-details-block.status-grounded:hover { background: rgba(125, 133, 144, 0.1); box-shadow: 0 0 20px rgba(125, 133, 144, 0.3); }

.mr-build-details-icon { display: flex; align-items: center; justify-content: center; }
.mr-build-details-icon svg { width: 20px; height: 20px; color: #00ff88; }
.mr-build-info { display: flex; align-items: center; gap: 8px; }
.mr-build-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #555; text-transform: uppercase; letter-spacing: 1px; }
.mr-build-time { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #fff; font-weight: 700; }

/* Accordion */
.mr-accordion-toggle { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px; background: #000; border: none; border-top: 1px solid #222; color: #888; font-family: 'JetBrains Mono', monospace; font-size: 13px; cursor: pointer; width: 100%; transition: all 0.3s ease; }
.mr-accordion-toggle:hover { background: rgba(0, 255, 136, 0.02); color: #00ff88; }
.mr-accordion-toggle .mr-arrow { transition: transform 0.3s ease; }
.mr-accordion-toggle.open .mr-arrow { transform: rotate(180deg); }
.mr-accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
.mr-accordion-content.open { max-height: 3000px; }
.mr-accordion-content .mr-launch-row { background: rgba(0, 0, 0, 0.3); }

/* Logo Grid (Identity Mode) */
.mr-logo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 800px) { .mr-logo-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .mr-logo-grid { grid-template-columns: 1fr; } }

.mr-logo-card { background: linear-gradient(180deg, rgba(255, 85, 85, 0.15), transparent); border: 2px solid rgba(255, 85, 85, 0.3); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.4s ease; cursor: pointer; position: relative; overflow: hidden; }
.mr-logo-card:hover { background: #ff5555; border-color: #ff5555; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(255, 85, 85, 0.3); }
.mr-logo-card-logo { width: 120px; height: 120px; background: #000; border: 3px solid rgba(255, 85, 85, 0.3); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; transition: all 0.3s ease; }
.mr-logo-card-logo svg { width: 60px; height: 60px; color: #ff5555; transition: color 0.3s ease; }
.mr-logo-card:hover .mr-logo-card-logo { background: transparent; border-color: rgba(0, 0, 0, 0.2); }
.mr-logo-card:hover .mr-logo-card-logo svg { color: #000; }
.mr-logo-card-name { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 8px; transition: color 0.3s ease; }
.mr-logo-card:hover .mr-logo-card-name { color: #000; }
.mr-logo-card-date { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #555; transition: color 0.3s ease; }
.mr-logo-card:hover .mr-logo-card-date { color: rgba(0, 0, 0, 0.6); }

/* Modals */
.mr-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 1); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; }
.mr-modal-close { position: fixed; top: 30px; right: 30px; width: 70px; height: 70px; background: #000; border: 2px solid #00ff88; color: #00ff88; cursor: pointer; border-radius: 14px; transition: all 0.3s ease; z-index: 10001; display: flex; align-items: center; justify-content: center; }
.mr-modal-close::before, .mr-modal-close::after { content: ''; position: absolute; width: 36px; height: 2px; background: currentColor; }
.mr-modal-close::before { transform: rotate(45deg); }
.mr-modal-close::after { transform: rotate(-45deg); }
.mr-modal-close:hover { background: #00ff88; color: #000; box-shadow: 0 0 40px rgba(0, 255, 136, 0.4); transform: scale(1.05); }

.mr-modal-close.status-soon { border-color: #58a6ff; color: #58a6ff; }
.mr-modal-close.status-soon:hover { background: #58a6ff; color: #000; box-shadow: 0 0 40px rgba(88, 166, 255, 0.5); }
.mr-modal-close.status-grounded { border-color: #7d8590; color: #7d8590; }
.mr-modal-close.status-grounded:hover { background: #7d8590; color: #000; box-shadow: 0 0 40px rgba(125, 133, 144, 0.5); }

.mr-modal-content { max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; overflow-x: hidden; }
.mr-modal-header { display: flex; align-items: center; justify-content: flex-start; gap: 16px; margin-bottom: 32px; }
.mr-modal-title { font-size: 28px; font-weight: 600; color: #00ff88; }
.mr-modal-title.status-soon { color: #58a6ff; }
.mr-modal-title.status-grounded { color: #7d8590; }

/* Gallery */
.mr-gallery-section { margin-bottom: 32px; overflow: visible; }
.mr-gallery-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ff5555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.mr-gallery-label svg { width: 16px; height: 16px; }
.mr-gallery-slider { display: flex; gap: 16px; overflow-x: auto; padding: 16px 8px; scroll-snap-type: x mandatory; margin: -8px; }
.mr-gallery-slider::-webkit-scrollbar { height: 6px; }
.mr-gallery-slider::-webkit-scrollbar-track { background: #111; border-radius: 3px; }
.mr-gallery-slider::-webkit-scrollbar-thumb { background: #ff5555; border-radius: 3px; }
.mr-gallery-item { min-width: 280px; aspect-ratio: 16/10; background: #111; border: 1px solid rgba(255, 85, 85, 0.3); border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; position: relative; scroll-snap-align: start; flex-shrink: 0; }
.mr-gallery-item:hover { border-color: #ff5555; transform: scale(1.05); box-shadow: 0 10px 30px rgba(255, 85, 85, 0.2); z-index: 10; }
.mr-gallery-item.video::before { content: '▶'; position: absolute; font-size: 40px; color: #ff5555; text-shadow: 0 0 30px rgba(0,0,0,0.8); z-index: 2; }
.mr-gallery-item span { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #ff5555; }

/* Details Meta */
.mr-details-meta { margin-bottom: 24px; background: #000; border-radius: 12px; }
.mr-details-meta-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px; position: relative; }
.mr-details-meta-row:last-child { border-bottom: none; }
.mr-details-meta-row::before { content: '+'; position: absolute; left: -16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #222; }
.mr-details-meta-label { color: #555; }
.mr-details-meta-value { color: #fff; font-weight: 600; text-align: right; }

/* Tags */
.mr-details-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.mr-details-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 8px 16px; background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.2); color: #00ff88; border-radius: 6px; }
.mr-details-tags.status-soon .mr-details-tag { border-color: rgba(88, 166, 255, 0.3); color: #58a6ff; }
.mr-details-tags.status-grounded .mr-details-tag { border-color: rgba(125, 133, 144, 0.3); color: #7d8590; }

/* Links */
.mr-details-links { display: flex; gap: 12px; flex-wrap: wrap; padding-top: 24px; border-top: 1px solid #222; }
.mr-details-link { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: transparent; border: 1px solid #222; color: #fff; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; border-radius: 8px; transition: all 0.3s ease; }
.mr-details-link:hover { border-color: #00ff88; color: #00ff88; }
.mr-details-link.primary { background: #00ff88; border-color: #00ff88; color: #000; }
.mr-details-link.primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4); }

.mr-details-links.status-soon .mr-details-link { border-color: #58a6ff; color: #58a6ff; }
.mr-details-links.status-soon .mr-details-link.primary { background: #58a6ff; border-color: #58a6ff; color: #000; }
.mr-details-links.status-grounded .mr-details-link { border-color: #7d8590; color: #7d8590; }
.mr-details-links.status-grounded .mr-details-link.primary { background: #7d8590; border-color: #7d8590; color: #000; }
</style>
