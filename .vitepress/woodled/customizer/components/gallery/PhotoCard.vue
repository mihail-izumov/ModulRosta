<script setup>
import { ref, computed } from 'vue';
import { T, realPhotoFor, objectPositionFor } from './gallery-constants.js';

const props = defineProps({
  item: { type: Object, required: true },
  displayAspect: { type: Number, default: 1.0 },
  onTap: { type: Function, default: null },
  /** Accent для skeleton pulsing — со страницы (mood color / room tint / T.neutral). */
  accent: { type: String, default: null },
});

const photo = computed(() => realPhotoFor(props.item));
const pressed = ref(false);
const loaded = ref(false);

const accentColor = computed(() => props.accent || T.neutral);

// "rotor_m" → "Rotor M", "rotor_1000" → "Rotor 1000"
const modelLabel = computed(() => {
  const m = props.item.model;
  if (!m) return '';
  return m.split('_')
    .map(p => /^\d+$/.test(p) ? p : (p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ');
});

// "дуб" → "Дуб"
const woodLabel = computed(() => {
  const w = props.item.wood && props.item.wood.name;
  return w ? (w.charAt(0).toUpperCase() + w.slice(1)) : '';
});

function handlePressStart() { pressed.value = true; }
function handlePressEnd()   { pressed.value = false; }
function handleClick() {
  if (props.onTap) props.onTap();
}
function onImgLoad()  { loaded.value = true; }
function onImgError() { loaded.value = true; }
</script>

<template>
  <div
    @click="handleClick"
    @mousedown="handlePressStart"
    @mouseup="handlePressEnd"
    @mouseleave="handlePressEnd"
    @touchstart="handlePressStart"
    @touchend="handlePressEnd"
    :style="{
      borderRadius: '12px',
      aspectRatio: String(displayAspect),
      width: '100%', height: '100%',
      overflow: 'hidden', position: 'relative',
      boxSizing: 'border-box',
      cursor: onTap ? 'pointer' : 'default',
      transform: pressed && onTap ? 'scale(0.97)' : 'scale(1)',
      transition: 'transform .12s ease',
      background: T.cardAlt,
    }"
  >
    <!-- Skeleton placeholder (pulsing accent) — пока image не загружено -->
    <div
      v-if="!loaded"
      class="gallery-skeleton"
      :style="{
        position: 'absolute', inset: 0,
        background: accentColor,
      }"
    />

    <img
      :src="photo.src"
      :alt="photo.label"
      draggable="false"
      @load="onImgLoad"
      @error="onImgError"
      :style="{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: objectPositionFor(item.zone),
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: loaded ? 1 : 0,
        transition: 'opacity .45s ease',
      }"
    />

    <!-- Wood + Model badge -->
    <div
      v-if="item.wood && loaded"
      :style="{
        position: 'absolute', bottom: '8px', left: '8px',
        display: 'flex', alignItems: 'center', gap: '7px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '5px 11px 5px 8px',
        borderRadius: '24px', zIndex: 2,
      }"
    >
      <span :style="{
        width: '14px', height: '14px', borderRadius: '7px',
        background: item.wood.color, flexShrink: 0,
      }" />
      <span :style="{
        fontSize: '13px', fontWeight: 600, color: '#fff',
        whiteSpace: 'nowrap', letterSpacing: '0.2px',
      }">{{ woodLabel }}<template v-if="modelLabel"> · {{ modelLabel }}</template></span>
    </div>
  </div>
</template>

<style>
@keyframes galleryPulse {
  0%, 100% { opacity: 0.12; }
  50%      { opacity: 0.32; }
}
.gallery-skeleton {
  animation: galleryPulse 1.6s ease-in-out infinite;
}
</style>
