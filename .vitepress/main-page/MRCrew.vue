<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ═══════════════════════════════════════════════════════════
   MRCrew v2 — «Системы строят люди.»
   Панель приборов: ценности слева, маршрут и экипаж справа.
   ═══════════════════════════════════════════════════════════ */

interface Person {
  id: 'm' | 'p'
  name: string
  role: string
  color: string
  colorRgb: string
  initials: string
  photo: string | null
  bubbles: string[]
  bio: string[]
  tg: string
  tgLabel: string
}

const PEOPLE: Record<'m' | 'p', Person> = {
  m: {
    id: 'm',
    name: 'Михаил Изюмов',
    role: 'Видит и собирает',
    color: '#58a6ff',
    colorRgb: '88,166,255',
    initials: 'МИ',
    photo: null, // например: '/ars/crew/mikhail.jpg'
    bubbles: ['Стратегия', 'Аналитика', 'Дизайн', 'Маркетинг'],
    bio: [
      'Заходит первым. За пять дней Форсажа собирает то, на что у агентств уходит квартал: аналитику, стратегию, дизайн и прототип первого цифрового продукта.',
      'Дальше держит курс: ревью на Взлёте, аналитика и маркетинг в Полёте. Видит то, что не видят другие — и сразу превращает это в систему.',
    ],
    tg: 'https://t.me/runScale',
    tgLabel: 'Телеграм-канал',
  },
  p: {
    id: 'p',
    name: 'Павел Моторин',
    role: 'Приземляет и расширяет',
    color: '#00ff88',
    colorRgb: '0,255,136',
    initials: 'ПМ',
    photo: null, // например: '/ars/crew/pavel.jpg'
    bubbles: ['Внедрение', 'Технологии', 'Обучение', 'Расширение'],
    bio: [
      'Приземляет скорость на технологии. Синхронизирует прототип с реальностью бизнеса: что нужно на самом деле — то и летит.',
      'Ведёт Взлёт и Полёт: внедрение, обучение команды, расширение системы модуль за модулем. С ним хаос не выживает.',
    ],
    tg: 'https://t.me/runScale',
    tgLabel: 'Телеграм-канал',
  },
}

interface Stage {
  id: string
  num: string
  label: string
  color: string
  colorRgb: string
  lead: 'm' | 'p'
  supportBadge: string
  active: { m: string[]; p: string[] }
}

const STAGES: Stage[] = [
  {
    id: 'forsazh', num: '01', label: 'Форсаж',
    color: '#ff5555', colorRgb: '255,85,85',
    lead: 'm', supportBadge: 'ГОТОВИТ ПОЛОСУ',
    active: { m: ['Стратегия', 'Аналитика', 'Дизайн'], p: ['Технологии'] },
  },
  {
    id: 'prep', num: '02', label: 'Предполётная',
    color: '#58a6ff', colorRgb: '88,166,255',
    lead: 'p', supportBadge: 'ДЕРЖИТ КУРС',
    active: { m: ['Стратегия'], p: ['Технологии', 'Внедрение'] },
  },
  {
    id: 'vzlet', num: '03', label: 'Взлёт',
    color: '#ff8800', colorRgb: '255,136,0',
    lead: 'p', supportBadge: 'РЕВЬЮ',
    active: { m: ['Дизайн'], p: ['Внедрение', 'Технологии'] },
  },
  {
    id: 'polet', num: '04', label: 'Полёт',
    color: '#00ff88', colorRgb: '0,255,136',
    lead: 'p', supportBadge: 'АНАЛИТИКА',
    active: { m: ['Аналитика', 'Маркетинг'], p: ['Обучение', 'Расширение', 'Внедрение'] },
  },
]

const VALUES = [
  { n: '1', title: 'Наш бизнес — это перемены.', caption: 'Стабильность — самый дорогой риск.' },
  { n: '2', title: 'Мы в атаке. Всё время.', caption: 'Оборона — это медленное поражение.' },
  { n: '3', title: 'Сила в действии.', caption: 'Слова не двигают метрики. Запуски двигают.' },
  { n: '4', title: 'Это будет красиво.', caption: 'Работающая система не бывает уродливой.' },
]

/* ── State ── */
const stageIdx = ref(0)
const stage = computed(() => STAGES[stageIdx.value])
const swapped = computed(() => stage.value.lead === 'p')
const routeProgress = computed(() => (stageIdx.value / (STAGES.length - 1)) * 100)

const openValue = ref<string | null>(null)
const toggleValue = (n: string) => { openValue.value = openValue.value === n ? null : n }

const modalPerson = ref<Person | null>(null)
const openModal = (id: 'm' | 'p') => {
  modalPerson.value = PEOPLE[id]
  document.body.style.overflow = 'hidden'
}
const closeModal = () => {
  modalPerson.value = null
  document.body.style.overflow = ''
}
const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalPerson.value) closeModal() }

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

/* ── Helpers ── */
const isLead = (id: 'm' | 'p') => stage.value.lead === id
const isActiveBubble = (id: 'm' | 'p', b: string) => stage.value.active[id].includes(b)
const leadStagesFor = (id: 'm' | 'p') =>
  STAGES.filter(s => s.lead === id).map(s => s.label).join(' · ')
</script>

<template>
  <section class="mr-crew">
    <div class="mr-crew-container">

      <!-- Statement -->
      <div class="mr-crew-label">ЭКИПАЖ</div>
      <h2 class="mr-crew-statement">Системы строят люди.</h2>

      <!-- ═══ Instrument panel ═══ -->
      <div class="mr-crew-panel">

        <!-- LEFT · Values -->
        <aside class="mr-crew-values">
          <div class="mr-crew-values-title">Ценности</div>
          <div
            v-for="v in VALUES"
            :key="v.n"
            class="mr-crew-value"
            :class="{ open: openValue === v.n }"
          >
            <button class="mr-crew-value-header" @click="toggleValue(v.n)">
              <span class="mr-crew-value-num">{{ v.n }}</span>
              <span class="mr-crew-value-title">{{ v.title }}</span>
              <span class="mr-crew-value-icon">{{ openValue === v.n ? '−' : '+' }}</span>
            </button>
            <div class="mr-crew-value-body" :class="{ expanded: openValue === v.n }">
              <p class="mr-crew-value-caption">{{ v.caption }}</p>
            </div>
          </div>
        </aside>

        <!-- RIGHT · Route + crew -->
        <div class="mr-crew-main">

          <!-- Route -->
          <div class="mr-crew-route" role="tablist" aria-label="Этапы запуска">
            <div class="mr-crew-route-track"></div>
            <div
              class="mr-crew-route-progress"
              :style="{
                width: routeProgress + '%',
                background: stage.color,
                boxShadow: `0 0 12px rgba(${stage.colorRgb},0.6)`,
              }"
            ></div>
            <button
              v-for="(s, i) in STAGES"
              :key="s.id"
              class="mr-crew-waypoint"
              :class="{ active: stageIdx === i, passed: stageIdx > i }"
              role="tab"
              :aria-selected="stageIdx === i"
              @click="stageIdx = i"
            >
              <span
                class="mr-crew-node"
                :style="stageIdx === i ? {
                  background: s.color,
                  borderColor: s.color,
                  color: '#06090f',
                  boxShadow: `0 0 22px rgba(${s.colorRgb},0.55)`,
                } : {}"
              >
                <span v-if="stageIdx === i" class="mr-crew-node-ring" :style="{ borderColor: s.color }"></span>
                {{ s.num }}
              </span>
              <span
                class="mr-crew-waypoint-name"
                :style="stageIdx === i ? { color: s.color } : {}"
              >{{ s.label }}</span>
            </button>
          </div>

          <!-- Cards -->
          <div class="mr-crew-cards" :class="{ swapped }">
            <div
              v-for="id in (['m', 'p'] as const)"
              :key="id"
              class="mr-crew-card-slot"
              :class="[`slot-${id}`, { lead: isLead(id) }]"
            >
              <div
                class="mr-crew-card"
                :class="{ 'is-lead': isLead(id) }"
                :style="isLead(id) ? {
                  borderColor: stage.color,
                  boxShadow: `0 0 34px rgba(${stage.colorRgb},0.28), 0 14px 40px rgba(0,0,0,0.45)`,
                } : {}"
                @click="openModal(id)"
              >
                <!-- Badge -->
                <div class="mr-crew-badge-row">
                  <span
                    v-if="isLead(id)"
                    class="mr-crew-badge mr-crew-badge-lead"
                    :style="{ background: stage.color }"
                  >
                    <span class="mr-crew-badge-dot"></span>
                    ЗА ШТУРВАЛОМ
                  </span>
                  <span v-else class="mr-crew-badge mr-crew-badge-support">
                    {{ stage.supportBadge }}
                  </span>
                </div>

                <!-- Profile -->
                <div class="mr-crew-profile">
                  <div
                    class="mr-crew-avatar"
                    :style="{ borderColor: PEOPLE[id].color, background: `rgba(${PEOPLE[id].colorRgb},0.1)` }"
                  >
                    <img v-if="PEOPLE[id].photo" :src="PEOPLE[id].photo" :alt="PEOPLE[id].name" class="mr-crew-avatar-img" />
                    <span v-else class="mr-crew-avatar-initials" :style="{ color: PEOPLE[id].color }">{{ PEOPLE[id].initials }}</span>
                  </div>
                  <div class="mr-crew-identity">
                    <div class="mr-crew-name">{{ PEOPLE[id].name }}</div>
                    <div class="mr-crew-role" :style="{ color: PEOPLE[id].color }">{{ PEOPLE[id].role }}</div>
                  </div>
                </div>

                <!-- Bubbles -->
                <div class="mr-crew-bubbles">
                  <span
                    v-for="b in PEOPLE[id].bubbles"
                    :key="b"
                    class="mr-crew-bubble"
                    :class="{ on: isActiveBubble(id, b) }"
                    :style="isActiveBubble(id, b) ? { background: PEOPLE[id].color } : {}"
                  >{{ b }}</span>
                </div>

                <div class="mr-crew-more">профайл →</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══ Modal ═══ -->
    <Teleport to="body">
      <Transition name="mr-crew-modal">
        <div v-if="modalPerson" class="mr-crew-overlay" @click.self="closeModal">
          <div class="mr-crew-modal">
            <button class="mr-crew-modal-close" @click="closeModal" aria-label="Закрыть">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div class="mr-crew-modal-top">
              <div
                class="mr-crew-avatar mr-crew-avatar-lg"
                :style="{ borderColor: modalPerson.color, background: `rgba(${modalPerson.colorRgb},0.1)` }"
              >
                <img v-if="modalPerson.photo" :src="modalPerson.photo" :alt="modalPerson.name" class="mr-crew-avatar-img" />
                <span v-else class="mr-crew-avatar-initials mr-crew-avatar-initials-lg" :style="{ color: modalPerson.color }">{{ modalPerson.initials }}</span>
              </div>
              <div>
                <div class="mr-crew-modal-name">{{ modalPerson.name }}</div>
                <div class="mr-crew-modal-role" :style="{ color: modalPerson.color }">{{ modalPerson.role }}</div>
              </div>
            </div>

            <div class="mr-crew-modal-lead-row">
              <span class="mr-crew-modal-lead-label">За штурвалом</span>
              <span class="mr-crew-modal-lead-stages">{{ leadStagesFor(modalPerson.id) }}</span>
            </div>

            <p v-for="(line, i) in modalPerson.bio" :key="i" class="mr-crew-modal-bio">{{ line }}</p>

            <div class="mr-crew-bubbles mr-crew-modal-bubbles">
              <span
                v-for="b in modalPerson.bubbles"
                :key="b"
                class="mr-crew-bubble on"
                :style="{ background: modalPerson.color }"
              >{{ b }}</span>
            </div>

            <a
              class="mr-crew-tg"
              :href="modalPerson.tg"
              target="_blank"
              rel="noopener"
              :style="{ background: modalPerson.color }"
            >
              {{ modalPerson.tgLabel }} <span class="mr-crew-tg-arrow">→</span>
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
/* ═══ Root ═══ */
.mr-crew {
  padding: 90px 24px;
  font-family: 'Inter', -apple-system, sans-serif;
}
.mr-crew-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ═══ Statement ═══ */
.mr-crew-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: rgb(0, 255, 136);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 16px;
  text-align: center;
}
.mr-crew-statement {
  font-size: clamp(36px, 5.5vw, 60px);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  text-align: center;
  margin: 0 0 52px;
  letter-spacing: 0.5px;
}

/* ═══ Instrument panel frame ═══ */
.mr-crew-panel {
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 12, 16, 0.65);
}

/* ═══ LEFT · Values ═══ */
.mr-crew-values {
  width: 33%;
  min-width: 280px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 30px 28px 26px;
  background: rgba(8, 10, 14, 0.55);
}
.mr-crew-values-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
  margin-bottom: 18px;
}
.mr-crew-value {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.mr-crew-value:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.mr-crew-value-header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  width: 100%;
  padding: 17px 0;
  background: none !important;
  border: none !important;
  cursor: pointer;
  text-align: left;
  text-decoration: none !important;
  font-family: 'Inter', sans-serif;
}
.mr-crew-value-header::before, .mr-crew-value-header::after { display: none !important; content: none !important; }
.mr-crew-value-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  width: 14px;
  flex-shrink: 0;
  transition: color 0.25s ease;
}
.mr-crew-value-title {
  flex: 1;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2px;
  line-height: 1.35;
}
.mr-crew-value-icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
  width: 18px;
  text-align: center;
  transition: color 0.25s ease;
  align-self: center;
}
.mr-crew-value-header:hover .mr-crew-value-icon,
.mr-crew-value.open .mr-crew-value-icon,
.mr-crew-value.open .mr-crew-value-num { color: rgb(0, 255, 136); }
.mr-crew-value-body {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.25s ease;
}
.mr-crew-value-body.expanded {
  max-height: 110px;
  opacity: 1;
}
.mr-crew-value-caption {
  margin: 0;
  padding: 0 0 18px 28px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
}

/* ═══ RIGHT · Main ═══ */
.mr-crew-main {
  flex: 1;
  min-width: 0;
  padding: 34px 34px 34px;
  display: flex;
  flex-direction: column;
}

/* ═══ Route ═══ */
.mr-crew-route {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0 6px 38px;
}
.mr-crew-route-track {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
}
.mr-crew-route-progress {
  position: absolute;
  top: 16px;
  left: 16px;
  height: 3px;
  border-radius: 2px;
  max-width: calc(100% - 32px);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, box-shadow 0.4s ease;
}
.mr-crew-waypoint {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  background: none !important;
  border: none !important;
  cursor: pointer;
  padding: 0;
  font-family: 'Inter', sans-serif;
  text-decoration: none !important;
}
.mr-crew-waypoint::before, .mr-crew-waypoint::after { display: none !important; content: none !important; }
.mr-crew-node {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: #0b0d12;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s ease;
}
.mr-crew-waypoint:hover .mr-crew-node {
  border-color: rgba(255, 255, 255, 0.55);
  color: rgba(255, 255, 255, 0.8);
}
.mr-crew-waypoint.passed .mr-crew-node {
  background: #fff;
  border-color: #fff;
  color: #06090f;
}
.mr-crew-node-ring {
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 1.5px solid;
  animation: mr-crew-pulse 2s ease-in-out infinite;
}
@keyframes mr-crew-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.18); }
}
.mr-crew-waypoint-name {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.3s ease;
  white-space: nowrap;
}
.mr-crew-waypoint:hover .mr-crew-waypoint-name { color: rgba(255, 255, 255, 0.75); }
.mr-crew-waypoint.passed .mr-crew-waypoint-name { color: rgba(255, 255, 255, 0.65); }

/* ═══ Cards + swap ═══ */
.mr-crew-cards {
  display: flex;
  gap: 20px;
}
.mr-crew-card-slot {
  width: calc(50% - 10px);
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
.mr-crew-cards.swapped .slot-m { transform: translateX(calc(100% + 20px)); }
.mr-crew-cards.swapped .slot-p { transform: translateX(calc(-100% - 20px)); }

.mr-crew-card {
  height: 100%;
  background: #eef0f3;
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 18px 20px 16px;
  cursor: pointer;
  transition: border-color 0.45s ease, box-shadow 0.45s ease, transform 0.3s ease, background 0.45s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.mr-crew-card.is-lead { background: #fff; }
.mr-crew-card:hover { transform: translateY(-3px); }

/* Badges */
.mr-crew-badge-row { min-height: 28px; margin-bottom: 16px; }
.mr-crew-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 6px 13px;
  border-radius: 6px;
  transition: all 0.4s ease;
  white-space: nowrap;
  color: #06090f;
}
.mr-crew-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #06090f;
  animation: mr-crew-blink 1.6s ease-in-out infinite;
}
@keyframes mr-crew-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
.mr-crew-badge-support {
  color: #5b6471;
  background: transparent;
  border: 1.5px solid #c9ced6;
}

/* Profile */
.mr-crew-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 17px;
}
.mr-crew-avatar {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: 3px solid;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.mr-crew-avatar-lg { width: 80px; height: 80px; }
.mr-crew-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.mr-crew-avatar-initials {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 19px;
  letter-spacing: 1px;
}
.mr-crew-avatar-initials-lg { font-size: 25px; }
.mr-crew-name {
  font-size: 18px;
  font-weight: 800;
  color: #0b0d12;
  line-height: 1.25;
}
.mr-crew-role {
  font-size: 13px;
  font-weight: 700;
  margin-top: 3px;
  letter-spacing: 0.2px;
}

/* Bubbles */
.mr-crew-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mr-crew-bubble {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 9999px;
  background: #dde0e6;
  color: #6b7280;
  transition: all 0.4s ease;
  white-space: nowrap;
}
.mr-crew-bubble.on { color: #06090f; }

.mr-crew-more {
  margin-top: auto;
  padding-top: 15px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #aeb4bd;
  transition: color 0.3s ease;
}
.mr-crew-card:hover .mr-crew-more { color: #3c424c; }

/* ═══ Modal (light sheet) ═══ */
.mr-crew-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.mr-crew-modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: #f4f5f7;
  border-radius: 20px;
  padding: 32px 30px 28px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}
.mr-crew-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #e3e6ea !important;
  border: none !important;
  color: #3c424c !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  text-decoration: none !important;
  padding: 0;
}
.mr-crew-modal-close::before, .mr-crew-modal-close::after { display: none !important; content: none !important; }
.mr-crew-modal-close:hover { background: #d4d8de !important; color: #0b0d12 !important; }

.mr-crew-modal-top {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}
.mr-crew-modal-name {
  font-size: 22px;
  font-weight: 800;
  color: #0b0d12;
  line-height: 1.25;
}
.mr-crew-modal-role {
  font-size: 14px;
  font-weight: 700;
  margin-top: 4px;
}
.mr-crew-modal-lead-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 16px;
  background: #e8eaee;
  border-radius: 12px;
  margin-bottom: 18px;
}
.mr-crew-modal-lead-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #8a919c;
  white-space: nowrap;
}
.mr-crew-modal-lead-stages {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #0b0d12;
}
.mr-crew-modal-bio {
  font-size: 14px;
  font-weight: 500;
  color: #3c424c;
  line-height: 1.65;
  margin: 0 0 12px;
}
.mr-crew-modal-bubbles { margin: 16px 0 24px; }
.mr-crew-tg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  border-radius: 10px;
  border: none !important;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none !important;
  color: #06090f !important;
  transition: all 0.3s ease;
}
.mr-crew-tg::before, .mr-crew-tg::after { display: none !important; content: none !important; }
.mr-crew-tg:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25); }
.mr-crew-tg:hover .mr-crew-tg-arrow { transform: translateX(3px); }
.mr-crew-tg-arrow { display: inline-block; transition: transform 0.25s ease; }

/* Modal transition */
.mr-crew-modal-enter-active { transition: opacity 0.25s ease; }
.mr-crew-modal-leave-active { transition: opacity 0.2s ease; }
.mr-crew-modal-enter-from, .mr-crew-modal-leave-to { opacity: 0; }

/* ═══ Reduced motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .mr-crew-card-slot, .mr-crew-card, .mr-crew-badge, .mr-crew-bubble, .mr-crew-route-progress { transition: none !important; }
  .mr-crew-badge-dot, .mr-crew-node-ring { animation: none !important; }
}

/* ═══ Tablet / Mobile ═══ */
@media (max-width: 1000px) {
  .mr-crew-panel { flex-direction: column; }
  .mr-crew-values {
    width: 100%;
    min-width: 0;
    order: 2;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .mr-crew-main { order: 1; }
}

@media (max-width: 700px) {
  .mr-crew { padding: 64px 16px; }
  .mr-crew-statement { margin-bottom: 36px; }
  .mr-crew-panel { border-radius: 14px; }
  .mr-crew-main { padding: 24px 16px 20px; }
  .mr-crew-values { padding: 24px 20px 20px; }
  .mr-crew-values-title { font-size: 19px; }
  .mr-crew-value-title { font-size: 15px; }
  .mr-crew-value-caption { font-size: 13px; padding-left: 26px; }

  .mr-crew-route { margin: 0 0 28px; }
  .mr-crew-node { width: 28px; height: 28px; font-size: 10px; }
  .mr-crew-route-track, .mr-crew-route-progress { top: 13px; left: 13px; }
  .mr-crew-route-track { right: 13px; }
  .mr-crew-route-progress { max-width: calc(100% - 26px); }
  .mr-crew-waypoint { gap: 8px; }
  .mr-crew-waypoint-name { font-size: 8px; letter-spacing: 1px; }

  /* Колонка: ведущий сверху */
  .mr-crew-cards { flex-direction: column; gap: 12px; }
  .mr-crew-card-slot { width: 100%; transform: none !important; }
  .mr-crew-card-slot.lead { order: -1; }
  .mr-crew-card { padding: 16px 16px 14px; }
  .mr-crew-avatar { width: 52px; height: 52px; }
  .mr-crew-avatar-initials { font-size: 16px; }
  .mr-crew-name { font-size: 16px; }

  .mr-crew-modal { padding: 26px 20px 22px; border-radius: 16px; }
  .mr-crew-avatar-lg { width: 66px; height: 66px; }
  .mr-crew-modal-name { font-size: 19px; }
}
</style>
