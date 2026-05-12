<script setup>
import { ref, computed } from 'vue';
import { T, realPhotoFor, objectPositionFor } from './gallery-constants.js';

const props = defineProps({
  item: { type: Object, required: true },
  displayAspect: { type: Number, default: 1.0 },
  onTap: { type: Function, default: null },
});

const photo = computed(() => realPhotoFor(props.item));
const pressed = ref(false);

function handlePressStart() { pressed.value = true; }
function handlePressEnd()   { pressed.value = false; }
function handleClick() {
  if (props.onTap) props.onTap();
}
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
      aspectRatio: `${displayAspect}`,
      width: '100%', height: '100%',
      overflow: 'hidden', position: 'relative',
      boxSizing: 'border-box',
      cursor: onTap ? 'pointer' : 'default',
      transform: pressed && onTap ? 'scale(0.97)' : 'scale(1)',
      transition: 'transform .12s ease',
      background: T.cardAlt,
    }"
  >
    <img
      :src="photo.src"
      :alt="photo.label"
      draggable="false"
      :style="{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: objectPositionFor(item.zone),
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
      }"
    />
    <!-- Wood badge -->
    <div
      v-if="item.wood"
      :style="{
        position: 'absolute', bottom: '6px', left: '6px',
        display: 'flex', alignItems: 'center', gap: '4px',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '3px 7px 3px 5px',
        borderRadius: '20px', zIndex: 2,
      }"
    >
      <span :style="{
        width: '7px', height: '7px', borderRadius: '4px',
        background: item.wood.color, flexShrink: 0,
      }" />
      <span :style="{
        fontSize: '9px', fontWeight: 600, color: '#fff',
        whiteSpace: 'nowrap', letterSpacing: '0.3px',
      }">{{ item.wood.name }}</span>
    </div>
  </div>
</template>
