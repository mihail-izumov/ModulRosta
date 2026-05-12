<script setup>
/* FIX-2026-05-12-icons-bubble-v4 — inline SVG icons + pill bubble.
   Маркер: если этого комментария нет в задеплоенном файле — залит старый. */
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { T, LEAF_REVEALS, makeScatterPieces } from './gallery-constants.js';

const props = defineProps({
  /** Accent colour for leaf/heart/circle/dots. Falls back to T.clearing. */
  accent: { type: String, default: null },
});

const emit = defineEmits(['gift-click']);

const taps = ref(0);
/** phase: 'idle' | 'leaving' | 'empty' | 'scatter' | 'heart' */
const phase = ref('idle');
const scatterPieces = ref([]);

const c = computed(() => props.accent || T.clearing);
const isGift = computed(() => taps.value >= 4);
const reveal = computed(() => LEAF_REVEALS[Math.min(taps.value, LEAF_REVEALS.length - 1)]);

// Inline SVG с viewBox 24x24 → размер контейнера 100% контролируется этим числом.
// 56px помещается в круг 100x100 с запасом 22px со всех сторон — никакого clipping.
const ICON = 56;

function onTap() {
  taps.value = taps.value >= 4 ? 0 : taps.value + 1;
}

function onGiftClick(e) {
  e.stopPropagation();
  emit('gift-click');
}

// --- phase state machine ----------------------------------------------------
let timers = [];
function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}
onBeforeUnmount(clearTimers);

watch(taps, (n) => {
  clearTimers();
  if (n === 4) {
    phase.value = 'leaving';
    timers.push(setTimeout(() => { phase.value = 'empty'; }, 400));
    timers.push(setTimeout(() => {
      scatterPieces.value = makeScatterPieces(12);
      phase.value = 'scatter';
    }, 700));
    timers.push(setTimeout(() => { phase.value = 'heart'; }, 1100));
  } else {
    phase.value = 'idle';
  }
});

const leafAnimation = computed(() => {
  if (phase.value === 'leaving') return 'wdLeafFade .4s ease-in forwards';
  if (taps.value > 0)            return 'wdLeafShake .6s ease-out';
  return 'none';
});

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  background: 'linear-gradient(165deg, ' + c.value + '28 0%, ' + c.value + '0A 100%)',
  border: 'none',
  borderRadius: '14px',
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 1px 0 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(255, 255, 255, 0.05), inset -1px 0 0 rgba(255, 255, 255, 0.04), inset 0 0 30px rgba(255, 255, 255, 0.025), 0 2px 14px rgba(0, 0, 0, 0.22)',
  transition: 'background .5s ease',
}));
</script>

<template>
  <div :style="containerStyle">
    <div
      role="button"
      tabindex="0"
      @click="onTap"
      @keydown="(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } }"
      :style="{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', outline: 'none', userSelect: 'none',
        minHeight: 0,
      }"
    >
      <!-- Icon zone — fixed height so the circle never shifts -->
      <div :style="{
        flex: '0 0 116px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }">
        <div :style="{
          position: 'relative',
          width: '100px', height: '100px', borderRadius: '50px',
          background: c + '1F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'visible',
          transition: 'background-color .4s ease',
        }">
          <!-- Leaf (idle + leaving) — inline SVG, no mask, full control -->
          <div
            v-if="phase === 'idle' || phase === 'leaving'"
            :key="'leaf-' + taps + '-' + phase"
            :style="{
              display: 'flex',
              animation: leafAnimation,
              transformOrigin: 'center',
            }"
          >
            <svg :width="ICON" :height="ICON" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
              <path
                d="M11 20A7 7 0 0 1 4 13c0-5 4-9 11-11 0 7-4 11-9 11"
                :stroke="c"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M2 22c4-2 9-7 13-13"
                :stroke="c"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <!-- Heart (phase 'heart') — inline SVG -->
          <div
            v-if="phase === 'heart'"
            key="heart"
            :style="{
              display: 'flex',
              animation: 'wdHeartShow 2.8s ease-out forwards',
              transformOrigin: 'center',
            }"
          >
            <svg :width="ICON" :height="ICON" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
              <path
                d="M19 14c-2.2 2.2-4.7 4.5-7 6.5-2.3-2-4.8-4.3-7-6.5C2.2 11.7 2 8 4.5 5.7 6.5 4 9.2 4.2 11 6c.4.4.7.8 1 1.3.3-.5.6-.9 1-1.3 1.8-1.8 4.5-2 6.5-.3 2.5 2.3 2.3 6 0 8.3z"
                :fill="c"
              />
            </svg>
          </div>

          <!-- Scatter hearts — inline SVG -->
          <template v-if="phase === 'scatter' || phase === 'heart'">
            <div
              v-for="(l, i) in scatterPieces"
              :key="'s-' + i"
              :style="{
                position: 'absolute',
                left: '50%', top: '50%',
                marginLeft: (-l.sz / 2) + 'px', marginTop: (-l.sz / 2) + 'px',
                width: l.sz + 'px', height: l.sz + 'px',
                pointerEvents: 'none',
                opacity: 0,
                '--ex': l.x + 'px',
                '--ey': l.y + 'px',
                '--er': l.rot + 'deg',
                animation: 'wdScatter ' + l.dur + 's ease-out ' + l.del + 's forwards',
                zIndex: 5,
              }"
            >
              <svg :width="l.sz" :height="l.sz" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
                <path
                  d="M19 14c-2.2 2.2-4.7 4.5-7 6.5-2.3-2-4.8-4.3-7-6.5C2.2 11.7 2 8 4.5 5.7 6.5 4 9.2 4.2 11 6c.4.4.7.8 1 1.3.3-.5.6-.9 1-1.3 1.8-1.8 4.5-2 6.5-.3 2.5 2.3 2.3 6 0 8.3z"
                  :fill="c"
                />
              </svg>
            </div>
          </template>
        </div>
      </div>

      <!-- Text / button zone -->
      <div :style="{
        flex: 1, minHeight: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 4px',
      }">
        <div
          v-if="!isGift"
          :style="{
            fontSize: '14px', fontWeight: 600, color: T.text,
            lineHeight: 1.25, whiteSpace: 'pre-line', textAlign: 'center',
          }"
        >{{ reveal.text }}</div>

        <!-- Pill-shaped bubble: borderRadius 999, super-low vertical padding -->
        <button
          v-if="phase === 'heart'"
          @click="onGiftClick"
          :style="{
            background: '#FFFFFF', color: T.bg,
            border: 'none',
            borderRadius: '999px',
            padding: '3px 14px',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.1,
            fontFamily: 'inherit', cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            animation: 'wdLeafFade .4s ease-out reverse',
            opacity: 1,
          }"
        >+3000₽ на свет</button>
      </div>
    </div>

    <!-- Progress dots -->
    <div :style="{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '4px' }">
      <span
        v-for="m in [1, 2, 3, 4]"
        :key="m"
        :style="{
          width: '7px', height: '7px', borderRadius: '4px',
          background: taps >= m ? c : 'rgba(255, 255, 255, 0.2)',
          transition: 'background-color .25s ease',
        }"
      />
    </div>
  </div>
</template>

<style>
@keyframes wdLeafShake {
  0%, 100% { transform: rotate(0deg); }
  18% { transform: rotate(-11deg); }
  38% { transform: rotate(9deg); }
  58% { transform: rotate(-6deg); }
  80% { transform: rotate(3deg); }
}
@keyframes wdLeafFade {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.5); }
}
@keyframes wdScatter {
  0%   { opacity: 0.95; transform: translate(0, 0) rotate(0deg) scale(1); }
  30%  { opacity: 0.9; }
  100% { opacity: 0; transform: translate(var(--ex), var(--ey)) rotate(var(--er)) scale(0.5); }
}
@keyframes wdHeartShow {
  0%   { transform: scale(0.4); opacity: 0; }
  10%  { transform: scale(1.10); opacity: 1; }
  15%  { transform: scale(1); }
  26%  { transform: scale(1.15); }
  30%  { transform: scale(1); }
  34%  { transform: scale(1.24); }
  40%  { transform: scale(1); }
  54%  { transform: scale(1.15); }
  58%  { transform: scale(1); }
  62%  { transform: scale(1.24); }
  68%  { transform: scale(1); }
  82%  { transform: scale(1.15); }
  86%  { transform: scale(1); }
  90%  { transform: scale(1.24); }
  96%  { transform: scale(1); }
  100% { transform: scale(1); }
}
</style>
