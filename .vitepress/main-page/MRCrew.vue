<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ═══════════════════════════════════════════════════════════
   MRCrew — «Два человека. Вся система.»
   Экипаж: карточки, штурвал, ценности.
   ═══════════════════════════════════════════════════════════ */

interface Person {
  id: 'm' | 'p'
  name: string
  firstName: string
  role: string
  color: string
  colorRgb: string
  initials: string
  photo: string | null   // путь к фото; null = плейсхолдер с инициалами
  bubbles: string[]
  bio: string[]
  tg: string
  tgLabel: string
}

const PEOPLE: Record<'m' | 'p', Person> = {
  m: {
    id: 'm',
    name: 'Михаил Изюмов',
    firstName: 'Михаил',
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
    firstName: 'Павел',
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
  desc: string
  active: { m: string[]; p: string[] }
}

const STAGES: Stage[] = [
  {
    id: 'forsazh',
    num: '01',
    label: 'Форсаж',
    color: '#ff5555',
    colorRgb: '255,85,85',
    lead: 'm',
    supportBadge: 'ГОТОВИТ ПОЛОСУ',
    desc: '5 дней — всё сразу: аналитика, стратегия, дизайн, прототип первого продукта.',
    active: { m: ['Стратегия', 'Аналитика', 'Дизайн'], p: ['Технологии'] },
  },
  {
    id: 'prep',
    num: '02',
    label: 'Предполётная',
    color: '#58a6ff',
    colorRgb: '88,166,255',
    lead: 'p',
    supportBadge: 'ДЕРЖИТ КУРС',
    desc: 'Синхронизация: что реально нужно бизнесу — и приземление прототипа на технологии.',
    active: { m: ['Стратегия'], p: ['Технологии', 'Внедрение'] },
  },
  {
    id: 'vzlet',
    num: '03',
    label: 'Взлёт',
    color: '#ff8800',
    colorRgb: '255,136,0',
    lead: 'p',
    supportBadge: 'РЕВЬЮ',
    desc: 'Доработка и запуск. Павел ведёт сборку, Михаил закрывает ревью.',
    active: { m: ['Дизайн'], p: ['Внедрение', 'Технологии'] },
  },
  {
    id: 'polet',
    num: '04',
    label: 'Полёт',
    color: '#00ff88',
    colorRgb: '0,255,136',
    lead: 'p',
    supportBadge: 'АНАЛИТИКА',
    desc: 'Система в бою: статистика, обучение команды, расширение модулей.',
    active: { m: ['Аналитика', 'Маркетинг'], p: ['Обучение', 'Расширение', 'Внедрение'] },
  },
]

const VALUES = [
  { n: '1', title: 'Наш бизнес — это перемены.', caption: 'Вчера — не аргумент.' },
  { n: '2', title: 'Мы в атаке. Всё время.', caption: 'Первый ход — всегда наш.' },
  { n: '3', title: 'Сила в действии.', caption: 'Слова не двигают метрики. Запуски двигают.' },
  { n: '4', title: 'Это будет красиво.', caption: 'Работающая система не бывает уродливой.' },
]

/* ── State ── */
const stageIdx = ref(0)
const stage = computed(() => STAGES[stageIdx.value])
const swapped = computed(() => stage.value.lead === 'p')

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
      <h2 class="mr-crew-statement">Два человека.<br>Вся система.</h2>
      <p class="mr-crew-sub">Вы всегда знаете, кто за штурвалом.</p>

      <!-- Stage selector -->
      <div class="mr-crew-stages" role="tablist" aria-label="Этапы запуска">
        <button
          v-for="(s, i) in STAGES"
          :key="s.id"
          class="mr-crew-stage"
          :class="{ active: stageIdx === i }"
          :style="stageIdx === i ? {
            color: s.color,
            borderColor: `rgba(${s.colorRgb},0.5)`,
            boxShadow: `0 0 16px rgba(${s.colorRgb},0.12), inset 0 0 12px rgba(${s.colorRgb},0.04)`,
          } : {}"
          role="tab"
          :aria-selected="stageIdx === i"
          @click="stageIdx = i"
        >
          <span class="mr-crew-stage-num">{{ s.num }}</span>
          <span class="mr-crew-stage-name">{{ s.label }}</span>
        </button>
      </div>

      <!-- Stage description -->
      <div class="mr-crew-stage-desc">
        <span class="mr-crew-stage-desc-marker" :style="{ background: stage.color, boxShadow: `0 0 8px rgba(${stage.colorRgb},0.6)` }"></span>
        <Transition name="mr-crew-fade" mode="out-in">
          <span :key="stage.id" class="mr-crew-stage-desc-text">{{ stage.desc }}</span>
        </Transition>
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
              borderColor: `rgba(${stage.colorRgb},0.45)`,
              boxShadow: `0 0 28px rgba(${stage.colorRgb},0.12), inset 0 0 24px rgba(${stage.colorRgb},0.03)`,
            } : {}"
            @click="openModal(id)"
          >
            <!-- Badge -->
            <div class="mr-crew-badge-row">
              <span
                v-if="isLead(id)"
                class="mr-crew-badge mr-crew-badge-lead"
                :style="{ color: stage.color, borderColor: `rgba(${stage.colorRgb},0.4)`, background: `rgba(${stage.colorRgb},0.07)` }"
              >
                <span class="mr-crew-badge-dot" :style="{ background: stage.color, boxShadow: `0 0 6px rgba(${stage.colorRgb},0.8)` }"></span>
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
                :style="{ borderColor: `rgba(${PEOPLE[id].colorRgb},0.4)`, boxShadow: isLead(id) ? `0 0 18px rgba(${PEOPLE[id].colorRgb},0.2)` : 'none' }"
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
                :style="isActiveBubble(id, b) ? {
                  color: PEOPLE[id].color,
                  borderColor: `rgba(${PEOPLE[id].colorRgb},0.45)`,
                  background: `rgba(${PEOPLE[id].colorRgb},0.07)`,
                  boxShadow: `0 0 10px rgba(${PEOPLE[id].colorRgb},0.12)`,
                } : {}"
              >{{ b }}</span>
            </div>

            <div class="mr-crew-more">профайл →</div>
          </div>
        </div>
      </div>

      <!-- Values -->
      <div class="mr-crew-values">
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
      </div>

    </div>

    <!-- ═══ Modal ═══ -->
    <Teleport to="body">
      <Transition name="mr-crew-modal">
        <div v-if="modalPerson" class="mr-crew-overlay" @click.self="closeModal">
          <div
            class="mr-crew-modal"
            :style="{ borderColor: `rgba(${modalPerson.colorRgb},0.2)`, boxShadow: `0 0 60px rgba(0,0,0,0.5), 0 0 40px rgba(${modalPerson.colorRgb},0.06)` }"
          >
            <button class="mr-crew-modal-close" @click="closeModal" aria-label="Закрыть">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div class="mr-crew-modal-top">
              <div
                class="mr-crew-avatar mr-crew-avatar-lg"
                :style="{ borderColor: `rgba(${modalPerson.colorRgb},0.45)`, boxShadow: `0 0 24px rgba(${modalPerson.colorRgb},0.2)` }"
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
              <span class="mr-crew-modal-lead-stages" :style="{ color: modalPerson.color }">{{ leadStagesFor(modalPerson.id) }}</span>
            </div>

            <p v-for="(line, i) in modalPerson.bio" :key="i" class="mr-crew-modal-bio">{{ line }}</p>

            <div class="mr-crew-bubbles mr-crew-modal-bubbles">
              <span
                v-for="b in modalPerson.bubbles"
                :key="b"
                class="mr-crew-bubble on"
                :style="{
                  color: modalPerson.color,
                  borderColor: `rgba(${modalPerson.colorRgb},0.45)`,
                  background: `rgba(${modalPerson.colorRgb},0.07)`,
                }"
              >{{ b }}</span>
            </div>

            <a
              class="mr-crew-tg"
              :href="modalPerson.tg"
              target="_blank"
              rel="noopener"
              :style="{ color: modalPerson.color, borderColor: `rgba(${modalPerson.colorRgb},0.4)` }"
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
  padding: 100px 24px;
  font-family: 'Inter', -apple-system, sans-serif;
}
.mr-crew-container {
  max-width: 900px;
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
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
  text-align: center;
  margin: 0 0 14px;
  letter-spacing: 0.5px;
}
.mr-crew-sub {
  text-align: center;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 48px;
}

/* ═══ Stage selector ═══ */
.mr-crew-stages {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.mr-crew-stage {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.35s ease;
  font-family: 'Inter', sans-serif;
  text-decoration: none !important;
}
.mr-crew-stage::before, .mr-crew-stage::after { display: none !important; content: none !important; }
.mr-crew-stage:hover { color: rgba(255, 255, 255, 0.75); border-color: rgba(255, 255, 255, 0.18) !important; }
.mr-crew-stage.active { background: rgba(255, 255, 255, 0.015) !important; }
.mr-crew-stage-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  opacity: 0.55;
  letter-spacing: 1px;
}
.mr-crew-stage-name {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* ═══ Stage description ═══ */
.mr-crew-stage-desc {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 26px;
  margin-bottom: 36px;
}
.mr-crew-stage-desc-marker {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.4s ease, box-shadow 0.4s ease;
}
.mr-crew-stage-desc-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  line-height: 1.5;
}
.mr-crew-fade-enter-active, .mr-crew-fade-leave-active { transition: opacity 0.25s ease; }
.mr-crew-fade-enter-from, .mr-crew-fade-leave-to { opacity: 0; }

/* ═══ Cards + swap ═══ */
.mr-crew-cards {
  display: flex;
  gap: 24px;
  margin-bottom: 72px;
}
.mr-crew-card-slot {
  width: calc(50% - 12px);
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
.mr-crew-cards.swapped .slot-m { transform: translateX(calc(100% + 24px)); }
.mr-crew-cards.swapped .slot-p { transform: translateX(calc(-100% - 24px)); }

.mr-crew-card {
  height: 100%;
  background: rgba(14, 16, 22, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 20px 22px 18px;
  cursor: pointer;
  transition: border-color 0.45s ease, box-shadow 0.45s ease, transform 0.3s ease, opacity 0.45s ease;
  opacity: 0.82;
  display: flex;
  flex-direction: column;
}
.mr-crew-card.is-lead { opacity: 1; }
.mr-crew-card:hover { transform: translateY(-2px); opacity: 1; }

/* Badges */
.mr-crew-badge-row { min-height: 26px; margin-bottom: 16px; }
.mr-crew-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 5px 12px;
  border-radius: 5px;
  border: 1px solid transparent;
  transition: all 0.4s ease;
  white-space: nowrap;
}
.mr-crew-badge-lead { /* colors inline */ }
.mr-crew-badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: mr-crew-blink 1.6s ease-in-out infinite;
}
@keyframes mr-crew-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.mr-crew-badge-support {
  color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

/* Profile (iOS-style) */
.mr-crew-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}
.mr-crew-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  transition: box-shadow 0.45s ease;
}
.mr-crew-avatar-lg { width: 84px; height: 84px; }
.mr-crew-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.mr-crew-avatar-initials {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 1px;
}
.mr-crew-avatar-initials-lg { font-size: 26px; }
.mr-crew-name {
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}
.mr-crew-role {
  font-size: 13px;
  font-weight: 500;
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
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 6px 13px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.35);
  background: transparent;
  transition: all 0.4s ease;
  white-space: nowrap;
}

.mr-crew-more {
  margin-top: auto;
  padding-top: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.22);
  transition: color 0.3s ease;
}
.mr-crew-card:hover .mr-crew-more { color: rgba(255, 255, 255, 0.5); }

/* ═══ Values ═══ */
.mr-crew-values {
  max-width: 700px;
  margin: 0 auto;
}
.mr-crew-value {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.mr-crew-value:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.mr-crew-value-header {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  padding: 22px 4px;
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
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  width: 16px;
  flex-shrink: 0;
  transition: color 0.25s ease;
}
.mr-crew-value-title {
  flex: 1;
  font-size: clamp(17px, 2.6vw, 22px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: 0.2px;
  transition: color 0.25s ease;
}
.mr-crew-value-icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  width: 20px;
  text-align: center;
  transition: color 0.25s ease;
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
  max-height: 120px;
  opacity: 1;
}
.mr-crew-value-caption {
  margin: 0;
  padding: 0 4px 24px 34px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
}

/* ═══ Modal ═══ */
.mr-crew-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.78);
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
  background: rgba(12, 14, 20, 0.92);
  border: 1px solid;
  border-radius: 18px;
  padding: 32px 30px 28px;
}
.mr-crew-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  text-decoration: none !important;
  padding: 0;
}
.mr-crew-modal-close::before, .mr-crew-modal-close::after { display: none !important; content: none !important; }
.mr-crew-modal-close:hover { background: rgba(255, 255, 255, 0.1) !important; color: #fff !important; }

.mr-crew-modal-top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}
.mr-crew-modal-name {
  font-size: 21px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}
.mr-crew-modal-role {
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
}
.mr-crew-modal-lead-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  margin-bottom: 20px;
}
.mr-crew-modal-lead-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
}
.mr-crew-modal-lead-stages {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.mr-crew-modal-bio {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  margin: 0 0 12px;
}
.mr-crew-modal-bubbles { margin: 18px 0 24px; }
.mr-crew-tg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border: 1.5px solid;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none !important;
  background: transparent !important;
  transition: all 0.3s ease;
}
.mr-crew-tg::before, .mr-crew-tg::after { display: none !important; content: none !important; }
.mr-crew-tg:hover { filter: brightness(1.25); }
.mr-crew-tg:hover .mr-crew-tg-arrow { transform: translateX(3px); }
.mr-crew-tg-arrow { display: inline-block; transition: transform 0.25s ease; }

/* Modal transition */
.mr-crew-modal-enter-active { transition: opacity 0.25s ease; }
.mr-crew-modal-leave-active { transition: opacity 0.2s ease; }
.mr-crew-modal-enter-from, .mr-crew-modal-leave-to { opacity: 0; }

/* ═══ Reduced motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .mr-crew-card-slot, .mr-crew-card, .mr-crew-badge, .mr-crew-bubble { transition: none !important; }
  .mr-crew-badge-dot { animation: none !important; }
}

/* ═══ Mobile ═══ */
@media (max-width: 700px) {
  .mr-crew { padding: 64px 16px; }
  .mr-crew-sub { font-size: 15px; margin-bottom: 32px; }

  .mr-crew-stages { gap: 6px; }
  .mr-crew-stage { padding: 8px 12px; gap: 7px; }
  .mr-crew-stage-name { font-size: 11px; letter-spacing: 1px; }
  .mr-crew-stage-desc { margin-bottom: 24px; padding: 0 8px; }
  .mr-crew-stage-desc-text { font-size: 13px; }

  /* На мобильном — колонка: ведущий всегда сверху (без сдвига, через order) */
  .mr-crew-cards { flex-direction: column; gap: 14px; margin-bottom: 56px; }
  .mr-crew-card-slot { width: 100%; transform: none !important; }
  .mr-crew-card-slot.lead { order: -1; }
  .mr-crew-card { padding: 18px 18px 16px; }
  .mr-crew-avatar { width: 54px; height: 54px; }
  .mr-crew-avatar-initials { font-size: 17px; }
  .mr-crew-name { font-size: 16px; }

  .mr-crew-value-header { padding: 18px 2px; gap: 14px; }
  .mr-crew-value-caption { padding-left: 30px; font-size: 14px; }

  .mr-crew-modal { padding: 26px 20px 22px; border-radius: 14px; }
  .mr-crew-modal-top { gap: 14px; }
  .mr-crew-avatar-lg { width: 68px; height: 68px; }
  .mr-crew-modal-name { font-size: 18px; }
}
</style>
