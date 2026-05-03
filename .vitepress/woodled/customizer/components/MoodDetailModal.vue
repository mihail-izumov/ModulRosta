<script setup lang="ts">
/**
 * MoodDetailModal.vue — 5 слайдов онбординга настроения.
 *
 * Источник: woodled-v42.jsx (MoodDetailModal).
 * Прогресс-бар сверху (без ✕), большая иконка с float-анимацией,
 * кнопка «Дальше/Домой» + ссылка «Пропустить».
 */

import { computed, ref } from 'vue'
import { T, Z, RGBA } from '../theme/tokens'
import { buildMoodSlides, type Mood } from '../data/moods'
import Icon, { type IconName } from './ui/Icons.vue'

interface Props {
  mood: Mood
}
const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const slide = ref(0)
const slides = computed(() => buildMoodSlides(props.mood))
const s = computed(() => slides.value[slide.value] ?? slides.value[0])

function next() {
  if (slide.value < slides.value.length - 1) {
    slide.value = slide.value + 1
  }
}
</script>

<template>
  <div
    :style="{
      position: 'fixed',
      inset: 0,
      background: T.bg,
      zIndex: Z.fullscreenModal,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- Прогресс-бар (без ✕ — пропустить внизу) -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 20px 0',
      }"
    >
      <div :style="{ display: 'flex', gap: '3px', flex: 1 }">
        <div
          v-for="(_, i) in slides"
          :key="i"
          :style="{
            height: '3px',
            borderRadius: '2px',
            flex: i === slide ? 2 : 1,
            background: i === slide ? props.mood.color : T.border,
            transition: 'all .3s',
          }"
        />
      </div>
    </div>

    <!-- Контент слайда -->
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
        textAlign: 'center',
      }"
    >
      <div
        :style="{
          width: '90px',
          height: '90px',
          borderRadius: '20px',
          background: props.mood.color + '22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: `0 0 40px ${props.mood.color}33`,
          animation: 'float 3s ease-in-out infinite',
        }"
      >
        <Icon :name="s.iconKey as IconName" :color="props.mood.color" :size="44" />
      </div>

      <div
        :style="{
          fontSize: '22px',
          fontWeight: 700,
          color: props.mood.color,
          marginBottom: '12px',
        }"
      >
        {{ s.title }}
      </div>

      <div
        v-if="s.text"
        :style="{
          fontSize: '14px',
          color: T.textSec,
          lineHeight: 1.7,
          maxWidth: '340px',
        }"
      >
        {{ s.text }}
      </div>

      <div
        v-if="s.blocks"
        :style="{ display: 'flex', gap: '10px', marginTop: '8px' }"
      >
        <div
          v-for="[k, v] in s.blocks"
          :key="k"
          :style="{ flex: 1, background: T.card, borderRadius: '10px', padding: '14px' }"
        >
          <div :style="{ fontSize: '10px', color: T.textDim }">{{ k }}</div>
          <div
            :style="{
              fontSize: '16px',
              fontWeight: 700,
              color: T.text,
              marginTop: '4px',
            }"
          >
            {{ v }}
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка + ссылка «Пропустить» -->
    <div :style="{ padding: '0 28px 28px', textAlign: 'center' }">
      <button
        v-if="slide < slides.length - 1"
        :style="{
          padding: '12px 40px',
          background: RGBA.white10,
          border: `1px solid ${RGBA.white20}`,
          borderRadius: '8px',
          color: T.text,
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
        }"
        @click="next"
      >
        Дальше
      </button>
      <button
        v-else
        :style="{
          padding: '12px 40px',
          background: T.text,
          border: 'none',
          borderRadius: '8px',
          color: T.bg,
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 700,
        }"
        @click="emit('close')"
      >
        Домой
      </button>

      <div v-if="slide < slides.length - 1" :style="{ marginTop: '14px' }">
        <button
          :style="{
            background: 'none',
            border: 'none',
            color: T.textSec,
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }"
          @click="emit('close')"
        >
          Пропустить
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
