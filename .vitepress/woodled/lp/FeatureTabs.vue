<script setup lang="ts">
import { ref, computed } from 'vue'
import { PAGE } from './tokens'

const FEATURES = [
  {
    label: 'Без регистрации',
    text: 'Не нужны email или пароль. Открывайте конструктор и собирайте дом — план сохраняется по уникальной ссылке.',
  },
  {
    label: 'Делитесь с друзьями',
    text: 'Отправляйте ссылку партнёру, родителям, дизайнеру — они увидят дом точно так же, как видите его вы.',
  },
  {
    label: 'Помощь эксперта',
    text: 'Бесплатная консультация специалиста WOODLED — поможем подобрать дерево и решения для каждой комнаты.',
  },
]

const active = ref(0)
const currentText = computed(() => FEATURES[active.value].text)
</script>

<template>
  <div :style="{ width: '100%' }">
    <div :style="{ display: 'flex', justifyContent: 'center' }">
      <div
        :style="{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '3px',
          borderRadius: '999px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(184, 125, 82, 0.10)',
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 10px rgba(184, 125, 82, 0.06)`,
          gap: '1px',
          maxWidth: '100%',
        }"
      >
        <button
          v-for="(f, i) in FEATURES"
          :key="i"
          @click="active = i"
          :style="{
            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2.4vw, 12px)',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            fontWeight: i === active ? 600 : 500,
            color: i === active ? PAGE.roseDeep : PAGE.textSec,
            letterSpacing: '-0.005em',
            background: i === active
              ? `linear-gradient(135deg, ${PAGE.pastelPink} 0%, ${PAGE.pastelPinkD} 100%)`
              : 'transparent',
            boxShadow: i === active
              ? `inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 6px rgba(184, 125, 82, 0.12)`
              : 'none',
            transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms ease, font-weight 300ms ease, box-shadow 300ms ease',
            whiteSpace: 'nowrap',
          }"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div :style="{ marginTop: '14px' }">
      <p
        :key="active"
        :style="{
          margin: 0,
          fontSize: 'clamp(11.5px, 2.8vw, 13px)',
          fontWeight: 500,
          lineHeight: 1.5,
          color: PAGE.textDim,
          maxWidth: '380px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          animation: 'fadeInUp 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }"
      >
        {{ currentText }}
      </p>
    </div>
  </div>
</template>
