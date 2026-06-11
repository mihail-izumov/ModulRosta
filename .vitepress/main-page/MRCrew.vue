<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

/* ═══════════════════════════════════════════════════════════
   MRCrew v3 — «Системы строят люди.»
   Один этап — один цвет. Графит, глянец, крупные органы управления.
   ═══════════════════════════════════════════════════════════ */

const CHEVRON_PATH = 'M6895.66,4460.27L6895.66,4367.25L7170.76,4203.17L7445.87,4369.28L7445.87,4463.27L7609.08,4560.65L7609.08,4661.64L7608.88,4661.52L7608.48,4859.02L7446.82,4762.34L7446.82,4952.95L7171.71,4793.75L6896.61,4950.91L6896.61,4761.4L6732.45,4859.02L6732.45,4658.64C6732.45,4658.64 6732.45,4557.65 6732.45,4557.65L6895.66,4460.27ZM7171.71,4696.96L6982.75,4804.41L6982.75,4710.18L7171.71,4597.82L7360.68,4710.83L7360.68,4805.79L7171.71,4696.96ZM7391.44,4531.16L7170.76,4397.91L6895.66,4561.99L6895.66,4561.27L6814.11,4609.92L6814.14,4709.48L7171.69,4497.69L7171.71,4497.69L7527.73,4711.65L7527.68,4613.08L7391.44,4531.8L7391.44,4531.16Z'

interface Person {
  id: 'm' | 'p'
  name: string
  role: string
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
    role: 'Видит\nи собирает',
    initials: 'МИ',
    photo: '/crew/mikhail-crew.png',
    bubbles: ['Стратегия', 'Аналитика', 'Дизайн', 'Маркетинг'],
    bio: [
      'Заходит первым. За пять дней Разбега собирает то, на что у агентств уходит квартал: аналитику, стратегию, дизайн и прототип первого цифрового продукта.',
      'Дальше держит курс: контроль на Взлёте, аналитика и маркетинг в Полёте. Видит то, что не видят другие — и сразу превращает это в систему.',
    ],
    tg: 'https://t.me/runScale',
    tgLabel: 'Телеграм-канал',
  },
  p: {
    id: 'p',
    name: 'Павел Моторин',
    role: 'Приземляет\nи расширяет',
    initials: 'ПМ',
    photo: '/crew/pavel-crew.png',
    bubbles: ['Внедрение', 'Технологии', 'Обучение', 'Расширение'],
    bio: [
      'Приземляет скорость на технологии. Синхронизирует прототип с реальностью бизнеса: что нужно на самом деле — то и летит.',
      'Ведёт Стыковку, Взлёт и Полёт: внедрение, обучение команды, расширение системы модуль за модулем. С ним хаос не выживает.',
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
    id: 'razbeg', num: '01', label: 'Разбег',
    color: '#ff5555', colorRgb: '255,85,85',
    lead: 'm', supportBadge: 'ГОТОВИТ ПОЛОСУ',
    active: { m: ['Стратегия', 'Аналитика', 'Дизайн'], p: ['Технологии'] },
  },
  {
    id: 'stykovka', num: '02', label: 'Стыковка',
    color: '#58a6ff', colorRgb: '88,166,255',
    lead: 'p', supportBadge: 'ДЕРЖИТ КУРС',
    active: { m: ['Стратегия'], p: ['Технологии', 'Внедрение'] },
  },
  {
    id: 'vzlet', num: '03', label: 'Взлёт',
    color: '#ff8800', colorRgb: '255,136,0',
    lead: 'p', supportBadge: 'КОНТРОЛЬ',
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
  { n: '1', title: 'Наш бизнес —\nэто перемены.', caption: 'Стабильность — самый дорогой риск.' },
  { n: '2', title: 'Мы в атаке. Всё время.', caption: 'Защита — это медленное поражение.' },
  { n: '3', title: 'Сила в действии.', caption: 'Слова не двигают метрики.\nЗапуски двигают.' },
  { n: '4', title: 'Это будет красиво.', caption: 'Работающая система\nне бывает уродливой.' },
]

/* ── State ── */
const stageIdx = ref(0)
const stage = computed(() => STAGES[stageIdx.value])
const swapped = computed(() => stage.value.lead === 'p')
/* Узлы в равных колонках: центры на 12.5% / 37.5% / 62.5% / 87.5%.
   Прогресс — доля пройденного пути (75% ширины контейнера между крайними узлами). */
const routeWidth = computed(() => (stageIdx.value / (STAGES.length - 1)) * 75)

const openValue = ref<string | null>(null)
const toggleValue = (n: string) => { openValue.value = openValue.value === n ? null : n }

/* «Нажатие» карточек при каждой смене этапа — даже без свопа видно обновление */
const pressing = ref(false)
let pressTimer: ReturnType<typeof setTimeout> | null = null
watch(stageIdx, async () => {
  pressing.value = false
  await nextTick()
  requestAnimationFrame(() => { pressing.value = true })
  if (pressTimer) clearTimeout(pressTimer)
  pressTimer = setTimeout(() => { pressing.value = false }, 500)
})

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
  if (pressTimer) clearTimeout(pressTimer)
})

/* ── Helpers ── */
const isLead = (id: 'm' | 'p') => stage.value.lead === id
const isActiveBubble = (id: 'm' | 'p', b: string) => stage.value.active[id].includes(b)
const leadStagesFor = (id: 'm' | 'p') => STAGES.filter(s => s.lead === id)

/* ── Фото всегда смотрят друг на друга ──
   PHOTO_FACES — куда смотрит ИСХОДНОЕ фото (без зеркала).
   Если после загрузки реальных фото кто-то отвернулся — поменяйте
   'right'/'left' у нужного человека, логика пересчитается сама. */
const PHOTO_FACES: Record<'m' | 'p', 'left' | 'right'> = { m: 'right', p: 'right' }
const visualSide = (id: 'm' | 'p'): 'left' | 'right' => {
  if (id === 'm') return swapped.value ? 'right' : 'left'
  return swapped.value ? 'left' : 'right'
}
const photoFlipped = (id: 'm' | 'p') => {
  /* на левой карточке смотрим вправо, на правой — влево */
  const want = visualSide(id) === 'left' ? 'right' : 'left'
  return PHOTO_FACES[id] !== want
}

const bubbleStyle = (id: 'm' | 'p', b: string, ctx: 'card' | 'modal' = 'card') => {
  if (!isActiveBubble(id, b)) {
    if (ctx === 'modal') {
      /* в модалке неактивные почти сливаются с фоном */
      return { background: 'rgba(255,255,255,0.045)', color: 'rgba(255,255,255,0.35)' }
    }
    /* в карточках — ярче, со слабым тоном цвета этапа */
    return { background: `rgba(${stage.value.colorRgb},0.09)`, color: 'rgba(255,255,255,0.68)' }
  }
  if (isLead(id)) return { background: stage.value.color, color: '#06090f' }
  return { background: `rgba(${stage.value.colorRgb},0.18)`, color: stage.value.color }
}
</script>

<template>
  <section class="mr-crew">
    <div class="mr-crew-container">

      <!-- Statement -->
      <h2 class="mr-crew-statement">Системы строят люди.</h2>

      <!-- ═══ Instrument panel ═══ -->
      <div class="mr-crew-panel">

        <!-- LEFT · Values -->
        <aside class="mr-crew-values">
          <div class="mr-crew-values-head" :class="{ engaged: openValue !== null }">
            <svg class="mr-crew-chevron" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1.23199,0,0,1.23199,-8294.3,-5100.12)">
                <path :d="CHEVRON_PATH" fill="rgba(255,255,255,0.88)" />
              </g>
            </svg>
            <span class="mr-crew-values-title">Ценности</span>
          </div>

          <div
            v-for="v in VALUES"
            :key="v.n"
            class="mr-crew-value"
            :class="{ open: openValue === v.n }"
          >
            <button class="mr-crew-value-header" @click="toggleValue(v.n)">
              <span class="mr-crew-value-num">{{ v.n }}</span>
              <span class="mr-crew-value-title">{{ v.title }}</span>
              <span class="mr-crew-value-toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
              </span>
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
                width: routeWidth + '%',
                background: stage.color,
                boxShadow: stageIdx > 0 ? `0 0 12px rgba(${stage.colorRgb},0.6)` : 'none',
                opacity: stageIdx > 0 ? 1 : 0,
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
                :class="{ 'is-lead': isLead(id), pressing }"
                :style="isLead(id) ? {
                  borderColor: stage.color,
                  boxShadow: `0 0 34px rgba(${stage.colorRgb},0.22), 0 14px 40px rgba(0,0,0,0.5)`,
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

                <!-- Profile: avatar · identity · big arrow -->
                <div class="mr-crew-profile">
                  <div
                    class="mr-crew-avatar"
                    :style="isLead(id)
                      ? { borderColor: stage.color, background: `rgba(${stage.colorRgb},0.12)` }
                      : {}"
                  >
                    <img
                      v-if="PEOPLE[id].photo"
                      :src="PEOPLE[id].photo"
                      :alt="PEOPLE[id].name"
                      class="mr-crew-avatar-img"
                      :class="{ flipped: photoFlipped(id) }"
                    />
                    <span
                      v-else
                      class="mr-crew-avatar-initials"
                      :style="isLead(id) ? { color: stage.color } : {}"
                    >{{ PEOPLE[id].initials }}</span>
                    <span class="mr-crew-avatar-tint" :style="{ background: stage.color }"></span>
                  </div>

                  <div class="mr-crew-identity">
                    <div class="mr-crew-name">{{ PEOPLE[id].name }}</div>
                    <div
                      class="mr-crew-role"
                      :style="isLead(id) ? { color: stage.color } : {}"
                    >{{ PEOPLE[id].role }}</div>
                  </div>

                  <div
                    class="mr-crew-arrow"
                    :style="isLead(id) ? { background: stage.color, borderColor: stage.color, color: '#06090f' } : {}"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                    </svg>
                  </div>
                </div>

                <!-- Bubbles -->
                <div class="mr-crew-bubbles">
                  <span
                    v-for="b in PEOPLE[id].bubbles"
                    :key="b"
                    class="mr-crew-bubble"
                    :class="{ on: isActiveBubble(id, b) }"
                    :style="bubbleStyle(id, b)"
                  >{{ b }}</span>
                </div>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div class="mr-crew-modal-top">
              <div
                class="mr-crew-avatar mr-crew-avatar-lg"
                :style="{ borderColor: stage.color, background: `rgba(${stage.colorRgb},0.12)` }"
              >
                <img v-if="modalPerson.photo" :src="modalPerson.photo" :alt="modalPerson.name" class="mr-crew-avatar-img" />
                <span v-else class="mr-crew-avatar-initials mr-crew-avatar-initials-lg" :style="{ color: stage.color }">{{ modalPerson.initials }}</span>
                <span class="mr-crew-avatar-tint" :style="{ background: stage.color }"></span>
              </div>
              <div>
                <div class="mr-crew-modal-name">{{ modalPerson.name }}</div>
                <div class="mr-crew-modal-role" :style="{ color: stage.color }">{{ modalPerson.role }}</div>
              </div>
            </div>

            <div class="mr-crew-modal-lead-row">
              <span class="mr-crew-modal-lead-label">За штурвалом</span>
              <span class="mr-crew-modal-lead-chips">
                <span
                  v-for="s in leadStagesFor(modalPerson.id)"
                  :key="s.id"
                  class="mr-crew-lead-chip"
                  :style="{ color: s.color, background: `rgba(${s.colorRgb},0.12)`, borderColor: `rgba(${s.colorRgb},0.4)` }"
                >{{ s.label }}</span>
              </span>
            </div>

            <p v-for="(line, i) in modalPerson.bio" :key="i" class="mr-crew-modal-bio">{{ line }}</p>

            <div class="mr-crew-bubbles mr-crew-modal-bubbles">
              <span
                v-for="b in modalPerson.bubbles"
                :key="b"
                class="mr-crew-bubble"
                :class="{ on: isActiveBubble(modalPerson.id, b) }"
                :style="bubbleStyle(modalPerson.id, b, 'modal')"
              >{{ b }}</span>
            </div>

            <a
              class="mr-crew-tg"
              :href="modalPerson.tg"
              target="_blank"
              rel="noopener"
              :style="{ background: stage.color }"
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
.mr-crew-statement {
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  text-align: center;
  margin: 0 0 52px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* ═══ Instrument panel frame ═══
   Высоту рамки задаёт ТОЛЬКО правая колонка — раскрытие ценностей
   слева не меняет габарит панели (левая колонка абсолютная). */
.mr-crew-panel {
  position: relative;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 12, 16, 0.65);
}

/* ═══ LEFT · Values ═══ */
.mr-crew-values {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 33%;
  min-width: 280px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 30px 24px 26px;
  background: rgba(8, 10, 14, 0.55);
  overflow-y: auto;
  /* скроллбар скрыт полностью — никаких миганий при раскрытии */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.mr-crew-values::-webkit-scrollbar { display: none; width: 0; }
.mr-crew-values-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding-left: 2px;
}
.mr-crew-chevron {
  width: 27px;
  height: 27px;
  flex-shrink: 0;
  transition: transform 0.35s ease;
}
.mr-crew-values-head.engaged .mr-crew-chevron { transform: rotate(90deg); }
.mr-crew-values-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
  transition: transform 0.35s ease;
}
.mr-crew-values-head.engaged .mr-crew-values-title { transform: translateX(5px); }

/* Плашки вместо разделителей */
.mr-crew-value {
  background: #15171c;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  margin-bottom: 10px;
  padding: 0 16px;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.mr-crew-value:last-child { margin-bottom: 0; }
.mr-crew-value:hover { background: #191c22; }
.mr-crew-value.open { border-color: rgba(255, 255, 255, 0.14); }

.mr-crew-value-header {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  padding: 15px 0;
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
  color: rgba(255, 255, 255, 0.35);
  width: 13px;
  flex-shrink: 0;
  transition: color 0.25s ease;
}
.mr-crew-value.open .mr-crew-value-num { color: #fff; }
.mr-crew-value-title {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: pre-line;
}

/* Тумблер — крупный, не промахнёшься. Плюс поворачивается в крест. */
.mr-crew-value-toggle {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.25s ease;
}
.mr-crew-value-toggle svg {
  width: 21px;
  height: 21px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.mr-crew-value-header:hover .mr-crew-value-toggle {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.07);
}
.mr-crew-value.open .mr-crew-value-toggle {
  background: #fff;
  border-color: #fff;
  color: #06090f;
}
.mr-crew-value.open .mr-crew-value-toggle svg { transform: rotate(45deg); }

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
  padding: 0 0 16px 26px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
  white-space: pre-line;
}

/* ═══ RIGHT · Main ═══ */
.mr-crew-main {
  flex: 1;
  min-width: 0;
  margin-left: max(33%, 280px);
  min-height: 505px;
  padding: 34px 34px 34px;
  display: flex;
  flex-direction: column;
}

/* ═══ Route — равные колонки, точная геометрия ═══ */
.mr-crew-route {
  position: relative;
  display: flex;
  margin-bottom: 36px;
}
.mr-crew-route-track {
  position: absolute;
  top: 15.5px;
  left: 12.5%;
  right: 12.5%;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
}
.mr-crew-route-progress {
  position: absolute;
  top: 15.5px;
  left: 12.5%;
  height: 3px;
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease;
}
.mr-crew-waypoint {
  flex: 1;
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
  min-width: 0;
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

/* Графит + глянец на углу — как панель Ferrari Luce */
.mr-crew-card {
  height: 100%;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 24%, rgba(255, 255, 255, 0) 48%),
    #16181d;
  border: 2px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 18px 20px 18px;
  cursor: pointer;
  transition: border-color 0.45s ease, box-shadow 0.45s ease, transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}
.mr-crew-card:hover { transform: translateY(-3px); }
.mr-crew-card:hover .mr-crew-arrow svg { transform: translateX(3px); }

/* «Нажатие» при смене этапа: ужалась → вернулась */
.mr-crew-card.pressing {
  animation: mr-crew-press 0.45s cubic-bezier(0.34, 1.3, 0.64, 1);
}
@keyframes mr-crew-press {
  0% { transform: scale(1); }
  35% { transform: scale(0.96); }
  100% { transform: scale(1); }
}

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
  color: rgba(255, 255, 255, 0.5);
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
}

/* Profile */
.mr-crew-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
}
.mr-crew-avatar {
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.4s ease, background 0.4s ease;
}
/* Лёгкая тонировка фото в цвет активного этапа */
.mr-crew-avatar-tint {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  mix-blend-mode: color;
  opacity: 0.18;
  pointer-events: none;
  transition: background 0.4s ease, opacity 0.4s ease;
}
.mr-crew-card.is-lead .mr-crew-avatar-tint { opacity: 0.32; }
.mr-crew-modal .mr-crew-avatar-tint { opacity: 0.3; }
.mr-crew-avatar-lg { width: 80px; height: 80px; }
.mr-crew-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.mr-crew-avatar-img.flipped { transform: scaleX(-1); }
.mr-crew-avatar-initials {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 19px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.4s ease;
}
.mr-crew-avatar-initials-lg { font-size: 25px; }
.mr-crew-identity { min-width: 0; flex: 1; }
.mr-crew-name {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
}
.mr-crew-role {
  font-size: 13px;
  font-weight: 700;
  margin-top: 3px;
  letter-spacing: 0.2px;
  line-height: 1.3;
  white-space: pre-line;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.4s ease;
}

/* Крупная стрелка — как на штурвале. Непрозрачная. */
.mr-crew-arrow {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: 2px solid #454b56;
  background: #1d2026;
  color: #f2f4f7;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
}
.mr-crew-arrow svg {
  width: 26px;
  height: 26px;
  transition: transform 0.25s ease;
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
  background: #22252c;
  color: #8a919c;
  transition: all 0.4s ease;
  white-space: nowrap;
}

/* ═══ Modal — графит с глянцем ═══ */
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
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 26%, rgba(255, 255, 255, 0) 50%),
    #15171c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 30px 28px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}
.mr-crew-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.18) !important;
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
.mr-crew-modal-close:hover { background: rgba(255, 255, 255, 0.12) !important; color: #fff !important; }

.mr-crew-modal-top {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}
.mr-crew-modal-name {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
}
.mr-crew-modal-role {
  font-size: 14px;
  font-weight: 700;
  margin-top: 4px;
  line-height: 1.3;
  white-space: pre-line;
}
.mr-crew-modal-lead-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 18px;
}
.mr-crew-modal-lead-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}
.mr-crew-modal-lead-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.mr-crew-lead-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 5px 11px;
  border-radius: 6px;
  border: 1px solid;
  white-space: nowrap;
}
.mr-crew-modal-bio {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
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
.mr-crew-tg:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35); }
.mr-crew-tg:hover .mr-crew-tg-arrow { transform: translateX(3px); }
.mr-crew-tg-arrow { display: inline-block; transition: transform 0.25s ease; }

/* Modal transition */
.mr-crew-modal-enter-active { transition: opacity 0.25s ease; }
.mr-crew-modal-leave-active { transition: opacity 0.2s ease; }
.mr-crew-modal-enter-from, .mr-crew-modal-leave-to { opacity: 0; }

/* ═══ Reduced motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .mr-crew-card-slot, .mr-crew-card, .mr-crew-badge, .mr-crew-bubble, .mr-crew-route-progress, .mr-crew-avatar-img { transition: none !important; }
  .mr-crew-badge-dot, .mr-crew-node-ring { animation: none !important; }
  .mr-crew-card.pressing { animation: none !important; }
}

/* ═══ Tablet / Mobile ═══ */
@media (max-width: 1000px) {
  .mr-crew-panel { flex-direction: column; }
  .mr-crew-values {
    position: static;
    width: 100%;
    min-width: 0;
    order: 2;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    overflow-y: visible;
  }
  .mr-crew-main { order: 1; margin-left: 0; min-height: 0; }
}

@media (max-width: 700px) {
  .mr-crew { padding: 64px 16px; }
  .mr-crew-statement { margin-bottom: 36px; }
  .mr-crew-panel { border-radius: 14px; }
  .mr-crew-main { padding: 24px 14px 20px; }
  .mr-crew-values { padding: 24px 16px 20px; }
  .mr-crew-values-title { font-size: 19px; }
  .mr-crew-chevron { width: 23px; height: 23px; }
  .mr-crew-value { border-radius: 12px; padding: 0 13px; }
  .mr-crew-value-title { font-size: 14px; }
  .mr-crew-value-toggle { width: 33px; height: 33px; border-radius: 9px; }
  .mr-crew-value-toggle svg { width: 18px; height: 18px; }
  .mr-crew-value-caption { font-size: 13px; padding-left: 24px; }

  .mr-crew-route { margin-bottom: 28px; }
  .mr-crew-node { width: 28px; height: 28px; font-size: 10px; }
  .mr-crew-route-track, .mr-crew-route-progress { top: 12.5px; }
  .mr-crew-waypoint { gap: 8px; }
  .mr-crew-waypoint-name { font-size: 8px; letter-spacing: 1px; }

  /* Колонка: ведущий сверху */
  .mr-crew-cards { flex-direction: column; gap: 12px; }
  .mr-crew-card-slot { width: 100%; transform: none !important; }
  .mr-crew-card-slot.lead { order: -1; }
  .mr-crew-card { padding: 16px 16px 14px; }
  .mr-crew-profile { gap: 12px; }
  .mr-crew-avatar { width: 52px; height: 52px; }
  .mr-crew-avatar-initials { font-size: 16px; }
  .mr-crew-arrow { width: 52px; height: 52px; }
  .mr-crew-arrow svg { width: 22px; height: 22px; }
  .mr-crew-name { font-size: 16px; }

  .mr-crew-modal { padding: 26px 20px 22px; border-radius: 16px; }
  .mr-crew-avatar-lg { width: 66px; height: 66px; }
  .mr-crew-modal-name { font-size: 19px; }
}
</style>
