<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

/* ═══════════════════════════════════════════════════════════
   MRCrew v3 — «Системы строят люди.»
   Один этап — один цвет. Графит, глянец, крупные органы управления.
   ═══════════════════════════════════════════════════════════ */


interface Person {
  id: 'm' | 'p'
  name: string
  role: string
  initials: string
  photo: string | null
  bubbles: string[]
  stat: string
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
    bubbles: ['Стратегия', 'Обучение', 'Аналитика', 'Дизайн', 'Маркетинг'],
    stat: '25+ лет в маркетинге',
    bio: [
      'Заходит первым. За пять дней Разбега собирает то, на что у агентств уходит квартал: аналитику, стратегию, дизайн и прототип первого цифрового продукта.',
      'Дальше держит курс: контроль на Взлёте, аналитика и маркетинг в Полёте. Видит то, что не видят другие — и сразу превращает это в работающую систему.',
    ],
    tg: 'https://t.me/izumov',
    tgLabel: 'Телеграм-канал',
  },
  p: {
    id: 'p',
    name: 'Павел Моторин',
    role: 'Приземляет\nи расширяет',
    initials: 'ПМ',
    photo: '/crew/pavel-crew.png',
    bubbles: ['Стратегия', 'Обучение', 'Внедрение', 'Технологии', 'Расширение'],
    stat: '30+ лет в IT',
    bio: [
      'Приземляет скорость на технологии. Синхронизирует прототип с реальностью бизнеса. Что нужно на самом деле — то и летит.',
      'Ведёт Стыковку, Взлёт и Полёт: внедрение, обучение команды, расширение системы модуль за модулем.',
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
  lead: ('m' | 'p')[]
  /* Текст бейджа лидера для каждого человека. Если ключа нет — fallback 'ЗА ШТУРВАЛОМ'. */
  leadBadge?: { m?: string; p?: string }
  supportBadge: string
  active: { m: string[]; p: string[] }
}

const STAGES: Stage[] = [
  {
    id: 'razbeg', num: '01', label: 'Разбег',
    color: '#ff5555', colorRgb: '255,85,85',
    lead: ['m'], supportBadge: 'ГОТОВИТ ПОЛОСУ',
    active: { m: ['Стратегия', 'Аналитика', 'Дизайн'], p: ['Технологии'] },
  },
  {
    id: 'stykovka', num: '02', label: 'Стыковка',
    color: '#58a6ff', colorRgb: '88,166,255',
    lead: ['m', 'p'],
    leadBadge: { m: 'АРХИТЕКТОР', p: 'КАПИТАН' },
    supportBadge: 'ДЕРЖИТ КУРС',
    active: { m: ['Стратегия', 'Дизайн'], p: ['Технологии', 'Внедрение'] },
  },
  {
    id: 'vzlet', num: '03', label: 'Взлёт',
    color: '#ff8800', colorRgb: '255,136,0',
    lead: ['p'], supportBadge: 'КОНТРОЛЬ',
    active: { m: ['Дизайн'], p: ['Внедрение', 'Технологии'] },
  },
  {
    id: 'polet', num: '04', label: 'Полёт',
    color: '#00ff88', colorRgb: '0,255,136',
    lead: ['m', 'p'],
    leadBadge: { m: 'НАВИГАЦИЯ', p: 'МАСШТАБ' },
    supportBadge: 'АНАЛИТИКА',
    active: { m: ['Аналитика', 'Маркетинг', 'Обучение'], p: ['Обучение', 'Расширение', 'Внедрение'] },
  },
]

const VALUES = [
  { n: '1', title: 'Перемены делают бизнес.', caption: 'Новые времена — новые решения.' },
  { n: '2', title: 'Сила в действии.', caption: 'Изменения дают результаты.' },
  { n: '3', title: 'Это будет красиво.', caption: 'Ясность на кончиках пальцев.' },
]

/* ── State ── */
const stageIdx = ref(0)
const stage = computed(() => STAGES[stageIdx.value])
/* Карточки меняются местами, только когда штурвал передан Павлу ОДНОМУ.
   На совместных этапах порядок сохраняется (Михаил слева, Павел справа). */
const swapped = computed(() => stage.value.lead.length === 1 && stage.value.lead[0] === 'p')

/* ── Геометрия маршрута ──
   Якоря — половины ширин крайних подписей (РАЗБЕГ / ПОЛЁТ):
   первая подпись прижата к левому краю, последняя — к правому,
   узлы центрированы над своим текстом, интервалы между узлами равные. */
const labelRefs: (HTMLElement | null)[] = []
const setLabelRef = (el: unknown, i: number) => { labelRefs[i] = el as HTMLElement | null }
const routeAnchors = ref({ a: 40, b: 34 })
function measureRoute() {
  const first = labelRefs[0]
  const last = labelRefs[STAGES.length - 1]
  if (first && last) {
    routeAnchors.value = {
      a: Math.max(17, Math.round(first.offsetWidth / 2)),
      b: Math.max(17, Math.round(last.offsetWidth / 2)),
    }
  }
}

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

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  nextTick(measureRoute)
  if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
    ;(document as any).fonts.ready.then(() => measureRoute())
  }
  window.addEventListener('resize', measureRoute)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', measureRoute)
  document.body.style.overflow = ''
  if (pressTimer) clearTimeout(pressTimer)
})

/* ── Helpers ── */
const isLead = (id: 'm' | 'p') => stage.value.lead.includes(id)
const isActiveBubble = (id: 'm' | 'p', b: string) => stage.value.active[id].includes(b)
const leadBadgeFor = (id: 'm' | 'p') => stage.value.leadBadge?.[id] ?? 'ЗА ШТУРВАЛОМ'

/* Свечение карточек: только при наведении, плотно к канту.
   Слой лежит ПОД карточками, поэтому на соседа не наезжает.
   Ведущий — плотнее, второй пилот — мягче. */
const hoveredCard = ref<'m' | 'p' | null>(null)
const glowStyle = (side: 'left' | 'right') => {
  const leftId: 'm' | 'p' = swapped.value ? 'p' : 'm'
  const id: 'm' | 'p' = side === 'left' ? leftId : (leftId === 'm' ? 'p' : 'm')
  if (hoveredCard.value !== id) return { boxShadow: 'none' }
  const rgb = stage.value.colorRgb
  return isLead(id)
    ? { boxShadow: `0 0 14px 2px rgba(${rgb},0.55), 0 0 30px 6px rgba(${rgb},0.3)` }
    : { boxShadow: `0 0 12px 1px rgba(${rgb},0.28), 0 0 24px 4px rgba(${rgb},0.15)` }
}

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
    /* почти сливаются с фоном — видны только активные */
    return ctx === 'modal'
      ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)' }
      : { background: 'rgba(255,255,255,0.035)', color: 'rgba(255,255,255,0.22)' }
  }
  /* активные — приглушённый тон цвета этапа, как раньше у второго пилота */
  return { background: `rgba(${stage.value.colorRgb},0.16)`, color: stage.value.color }
}
</script>

<template>
  <section class="mr-crew">
    <div class="mr-crew-container">

      <!-- Statement -->
      <h2 class="mr-crew-statement">Системы строят люди</h2>

      <!-- ═══ Instrument panel ═══ -->
      <div class="mr-crew-panel">

        <!-- LEFT · Values (desktop only) -->
        <aside class="mr-crew-values mr-crew-values-aside">
          <div
            v-for="v in VALUES"
            :key="v.n"
            class="mr-crew-value"
            :class="{ open: openValue === v.n }"
          >
            <button class="mr-crew-value-header" @click="toggleValue(v.n)">
              <span class="mr-crew-value-title">{{ v.title }}</span>
              <span class="mr-crew-value-toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div class="mr-crew-value-body" :class="{ expanded: openValue === v.n }">
              <p class="mr-crew-value-caption">{{ v.caption }}</p>
            </div>
          </div>

          <!-- Смысловая точка ряда -->
          <div class="mr-crew-tagline">
            <span class="mr-crew-tagline-text">И никак иначе.</span>
          </div>
        </aside>

        <!-- RIGHT · Route + crew -->
        <div class="mr-crew-main">

          <!-- Route: ширина = ширина ряда карточек, равные интервалы -->
          <div
            class="mr-crew-route"
            role="tablist"
            aria-label="Этапы запуска"
            :style="{ '--mrc-a': routeAnchors.a + 'px', '--mrc-b': routeAnchors.b + 'px' }"
          >
            <div class="mr-crew-route-track"></div>
            <div
              class="mr-crew-route-progress"
              :style="{
                width: `calc((100% - var(--mrc-a) - var(--mrc-b)) * ${stageIdx / (STAGES.length - 1)})`,
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
              :style="{ left: `calc(var(--mrc-a) + (100% - var(--mrc-a) - var(--mrc-b)) * ${i / (STAGES.length - 1)})` }"
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
                :ref="(el) => setLabelRef(el, i)"
                :style="stageIdx === i ? { color: s.color } : {}"
              >{{ s.label }}</span>
            </button>
          </div>

          <!-- Cards -->
          <div class="mr-crew-cards" :class="{ swapped }">
            <!-- Свечение — отдельный слой ПОД карточками, не наезжает на соседа -->
            <div class="mr-crew-glow mr-crew-glow-left" :style="glowStyle('left')"></div>
            <div class="mr-crew-glow mr-crew-glow-right" :style="glowStyle('right')"></div>
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
                  '--stage-rgb': stage.colorRgb,
                  borderColor: stage.color,
                } : { '--stage-rgb': stage.colorRgb }"
                @click="openModal(id)"
                @mouseenter="hoveredCard = id"
                @mouseleave="hoveredCard = null"
              >
                <!-- Badge -->
                <div class="mr-crew-badge-row">
                  <span
                    v-if="isLead(id)"
                    class="mr-crew-badge mr-crew-badge-lead"
                    :style="{ background: stage.color }"
                  >
                    {{ leadBadgeFor(id) }}
                  </span>
                  <span v-else class="mr-crew-badge mr-crew-badge-support">
                    {{ stage.supportBadge }}
                  </span>
                </div>

                <!-- Profile plate — фото + имя + роль, читается как кнопка -->
                <div
                  class="mr-crew-id-plate"
                  :style="isLead(id) ? { background: `rgba(${stage.colorRgb},0.09)` } : {}"
                >
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
                </div>

                <!-- Bubbles -->
                <div class="mr-crew-bubbles">
                  <span
                    v-for="b in PEOPLE[id].bubbles"
                    :key="b"
                    class="mr-crew-bubble"
                    :class="{ on: isActiveBubble(id, b), shimmer: b === 'Стратегия' }"
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
                <div class="mr-crew-modal-role" :style="{ color: stage.color }">{{ modalPerson.role.replace('\n', ' ') }}</div>
              </div>
            </div>

            <div class="mr-crew-modal-stat">{{ modalPerson.stat }}</div>

            <p v-for="(line, i) in modalPerson.bio" :key="i" class="mr-crew-modal-bio">{{ line }}</p>

            <div class="mr-crew-bubbles mr-crew-modal-bubbles">
              <span
                v-for="b in modalPerson.bubbles"
                :key="b"
                class="mr-crew-bubble"
                :class="{ on: isActiveBubble(modalPerson.id, b), shimmer: b === 'Стратегия' }"
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
  padding: 50px 24px 100px;
  font-family: 'Inter', -apple-system, sans-serif;
}
.mr-crew-container {
  /* в ритме главной: у MRProtocol и MRSneakPeek контейнер 1100px */
  max-width: 1100px;
  margin: 0 auto;
}

/* ═══ Statement ═══ */
.mr-crew-statement {
  font-family: 'Inter', sans-serif;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  text-align: center;
  margin: 0 0 52px;
}

/* ═══ Instrument panel frame ═══ */
.mr-crew-panel {
  position: relative;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 12, 16, 0.65);
}

/* Смысловая точка под ценностями — типографика как у пунктов ряда */
.mr-crew-tagline {
  margin-top: 18px;
  padding: 0 16px;
}
.mr-crew-tagline-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2px;
  line-height: 1.35;
}

/* ═══ LEFT · Values ═══ */
/* ═══ Values — слева на десктопе ═══ */
.mr-crew-values-aside {
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.mr-crew-values-aside::-webkit-scrollbar { display: none; width: 0; }
/* Плашки ценностей — без обводки, фон чуть светлее, подъём на ховере */
.mr-crew-value {
  background: #1a1d23;
  border-radius: 14px;
  margin-bottom: 10px;
  padding: 0 16px;
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.mr-crew-value:last-child { margin-bottom: 0; }
.mr-crew-value:hover {
  background: #22262e;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
}
.mr-crew-value.open { background: #1e222a; }

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
.mr-crew-value-title {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: pre-line;
}

/* Иконка раскрытия — приглушённая стрелка вниз */
.mr-crew-value-toggle {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.mr-crew-value-toggle svg {
  width: 18px;
  height: 18px;
}
.mr-crew-value-header:hover .mr-crew-value-toggle { color: rgba(255, 255, 255, 0.85); }
.mr-crew-value.open .mr-crew-value-toggle {
  color: #fff;
  transform: rotate(180deg);
}

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
  padding: 0 0 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
  white-space: pre-line;
}

/* ═══ Main ═══ */
.mr-crew-main {
  flex: 1;
  min-width: 0;
  margin-left: max(33%, 280px);
  min-height: 480px;
  padding: 34px 34px 34px;
  display: flex;
  flex-direction: column;
}

/* ═══ Route — подписи РАЗБЕГ/ПОЛЁТ прижаты к краям ряда карточек ═══
   --mrc-a / --mrc-b — половины ширин крайних подписей (меряются в рантайме):
   узлы центрированы над своим текстом, интервалы между узлами равные. */
.mr-crew-route {
  --mrc-a: 40px;
  --mrc-b: 34px;
  position: relative;
  height: 64px;
  margin-bottom: 34px;
}
.mr-crew-route-track {
  position: absolute;
  top: 15.5px;
  left: var(--mrc-a);
  right: var(--mrc-b);
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
}
.mr-crew-route-progress {
  position: absolute;
  top: 15.5px;
  left: var(--mrc-a);
  height: 3px;
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease;
}
.mr-crew-waypoint {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
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
  position: relative;
  display: flex;
  gap: 20px;
}
/* Слой свечения — позади обеих карточек */
.mr-crew-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 20px;
  pointer-events: none;
  z-index: 0;
  transition: box-shadow 0.45s ease;
}
.mr-crew-glow-left { left: 0; right: calc(50% + 10px); }
.mr-crew-glow-right { right: 0; left: calc(50% + 10px); }
.mr-crew-card-slot {
  position: relative;
  z-index: 1;
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
  transition: border-color 0.45s ease, transform 0.3s ease, background 0.45s ease;
  display: flex;
  flex-direction: column;
}
.mr-crew-card:hover { transform: scale(1.02); }
.mr-crew-card:hover .mr-crew-id-plate { filter: brightness(1.3); }

/* «Нажатие» при смене этапа: ужалась → вернулась */
.mr-crew-card.pressing {
  animation: mr-crew-press 0.45s cubic-bezier(0.34, 1.3, 0.64, 1);
}
@keyframes mr-crew-press {
  0% { transform: scale(1); }
  35% { transform: scale(0.96); }
  100% { transform: scale(1); }
}

/* Badges — с воздухом от верха карточки */
.mr-crew-badge-row { min-height: 28px; margin: 6px 0 20px; }
.mr-crew-badge {
  display: inline-flex;
  align-items: center;
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
.mr-crew-badge-support {
  color: rgba(255, 255, 255, 0.5);
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
}

/* Профайл-плашка: лёгкая прозрачность, читается как кнопка */
.mr-crew-id-plate {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 16px;
  margin-bottom: 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.4s ease, filter 0.3s ease;
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

/* «Стратегия» — переливается бегущим бликом поверх обычной раскраски */
.mr-crew-bubble.shimmer {
  position: relative;
  overflow: hidden;
}
.mr-crew-bubble.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    110deg,
    transparent 32%,
    rgba(255, 255, 255, 0.16) 48%,
    rgba(255, 255, 255, 0.22) 52%,
    transparent 68%
  );
  background-size: 250% 100%;
  background-position: 130% 0;
  animation: mr-crew-shimmer 3.2s ease-in-out infinite;
}
@keyframes mr-crew-shimmer {
  0% { background-position: 130% 0; }
  55% { background-position: -60% 0; }
  100% { background-position: -60% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .mr-crew-bubble.shimmer::after { animation: none; display: none; }
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
  white-space: normal;
}
.mr-crew-modal-bio {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.65;
  margin: 0 0 12px;
}
.mr-crew-modal-stat {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
  margin: 4px 0 14px;
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
  .mr-crew-card-slot, .mr-crew-card, .mr-crew-badge, .mr-crew-bubble, .mr-crew-route-progress, .mr-crew-avatar-img, .mr-crew-glow { transition: none !important; }
  .mr-crew-node-ring { animation: none !important; }
  .mr-crew-card.pressing { animation: none !important; }
}

/* ═══ Tablet: ценности уходят под карточки ═══ */
@media (max-width: 1000px) {
  .mr-crew-panel { flex-direction: column; }
  .mr-crew-values-aside {
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

/* ═══ Mobile ═══ */
@media (max-width: 700px) {
  .mr-crew { padding: 36px 16px 64px; }
  .mr-crew-statement { font-size: 24px; letter-spacing: 2px; margin-bottom: 32px; }
  .mr-crew-panel { border-radius: 14px; }
  .mr-crew-main { padding: 24px 14px 20px; }
  .mr-crew-values-aside { padding: 24px 16px 20px; }
  .mr-crew-tagline { margin-top: 14px; padding: 0 13px; }
  .mr-crew-tagline-text { font-size: 14px; }
  .mr-crew-value { border-radius: 12px; padding: 0 13px; }
  .mr-crew-value-title { font-size: 14px; }
  .mr-crew-value-toggle svg { width: 16px; height: 16px; }
  .mr-crew-value-caption { font-size: 13px; }

  .mr-crew-route { height: 54px; margin-bottom: 26px; }
  .mr-crew-node { width: 28px; height: 28px; font-size: 10px; }
  .mr-crew-route-track, .mr-crew-route-progress { top: 12.5px; }
  .mr-crew-waypoint { gap: 8px; }
  .mr-crew-waypoint-name { font-size: 8px; letter-spacing: 1px; }

  /* Колонка: ведущий сверху */
  .mr-crew-cards { flex-direction: column; gap: 12px; }
  .mr-crew-glow { display: none; }
  .mr-crew-card-slot { width: 100%; transform: none !important; }
  .mr-crew-card-slot.lead { order: -1; }
  .mr-crew-card { padding: 16px 16px 14px; }
  .mr-crew-id-plate { gap: 12px; padding: 10px 12px; border-radius: 14px; }
  .mr-crew-avatar { width: 52px; height: 52px; }
  .mr-crew-avatar-initials { font-size: 16px; }
  .mr-crew-name { font-size: 16px; }

  .mr-crew-modal { padding: 26px 20px 22px; border-radius: 16px; }
  .mr-crew-avatar-lg { width: 66px; height: 66px; }
  .mr-crew-modal-name { font-size: 19px; }
}
</style>
