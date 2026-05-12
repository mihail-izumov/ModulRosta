<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { T, LEAF_REVEALS, makeScatterPieces } from './gallery-constants.js';
import { LEAF_SVG_B64, HEART_SVG_B64 } from './gallery-icons.js';

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

const leafMaskUrl  = `url("data:image/svg+xml;base64,${LEAF_SVG_B64}")`;
const heartMaskUrl = `url("data:image/svg+xml;base64,${HEART_SVG_B64}")`;

function iconStyle(size, color, maskUrl) {
  return {
    width: `${size}px`, height: `${size}px`,
    backgroundColor: color,
    WebkitMaskImage: maskUrl, maskImage: maskUrl,
    WebkitMaskSize: 'contain', maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center', maskPosition: 'center',
    transition: 'background-color .3s ease',
  };
}

function onTap() {
  taps.value = taps.value >= 4 ? 0 : taps.value + 1;
}

function onGiftClick(e) {
  e.stopPropagation();
  // Силент: пусть родитель решает что показать (модалку «Мой лес», навигацию и т.д.)
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
    // leaf fades → empty pause → scatter hearts → big heart pulses 3x
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

// --- styles bag (animation depends on taps + phase) -------------------------
const leafAnimation = computed(() => {
  if (phase.value === 'leaving') return 'wdLeafFade .4s ease-in forwards';
  if (taps.value > 0)            return 'wdLeafShake .6s ease-out';
  return 'none';
});

// Контейнерный стиль вынесен в computed: Vue compiler-core в prod-build не
// парсит template literals (`...${}...`) внутри JS-объекта в :style attr.
const containerStyle = computed(() => ({
  aspectRatio: '1 / 1',
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
        flex: '0 0 108px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }">
        <div :style="{
          position: 'relative',
          width: '96px', height: '96px', borderRadius: '48px',
          background: c + '1F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color .4s ease',
        }">
          <!-- Leaf (idle + leaving) -->
          <div
            v-if="phase === 'idle' || phase === 'leaving'"
            :key="'leaf-' + taps + '-' + phase"
            :style="{
              display: 'flex',
              animation: leafAnimation,
              transformOrigin: 'center',
            }"
          >
            <div :style="iconStyle(72, c, leafMaskUrl)" />
          </div>

          <!-- Heart (phase 'heart') -->
          <div
            v-if="phase === 'heart'"
            key="heart"
            :style="{
              display: 'flex',
              animation: 'wdHeartShow 2.8s ease-out forwards',
              transformOrigin: 'center',
            }"
          >
            <div :style="iconStyle(72, c, heartMaskUrl)" />
          </div>

          <!-- Scatter hearts (wrapper v-if ensures fresh mount per transition) -->
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
              <div :style="iconStyle(l.sz, c, heartMaskUrl)" />
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

        <button
          v-if="phase === 'heart'"
          @click="onGiftClick"
          :style="{
            background: '#FFFFFF', color: T.bg,
            border: 'none', borderRadius: '16px',
            padding: '8px 16px',
            fontSize: '13px', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
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
/* Keyframes are GLOBAL on purpose — they're referenced from inline styles
   (Vue scoped styles would prefix the names and break the lookup). */
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
/* Heart: appear, then 3 lub-DUB beats */
@keyframes wdHeartShow {
  0%   { transform: scale(0.4); opacity: 0; }
  10%  { transform: scale(1.10); opacity: 1; }
  15%  { transform: scale(1); }
  /* beat 1 */
  26%  { transform: scale(1.15); }
  30%  { transform: scale(1); }
  34%  { transform: scale(1.24); }
  40%  { transform: scale(1); }
  /* beat 2 */
  54%  { transform: scale(1.15); }
  58%  { transform: scale(1); }
  62%  { transform: scale(1.24); }
  68%  { transform: scale(1); }
  /* beat 3 */
  82%  { transform: scale(1.15); }
  86%  { transform: scale(1); }
  90%  { transform: scale(1.24); }
  96%  { transform: scale(1); }
  100% { transform: scale(1); }
}
</style>
