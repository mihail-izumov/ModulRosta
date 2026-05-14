<script setup lang="ts">
import { ref, computed } from 'vue'
import { PAGE } from './tokens'

const FEATURES = [
  {
    label: 'Без регистрации',
    text: 'Не нужны email или пароль. Открывайте конструктор и собирайте дом — план сохраняется по уникальной ссылке.',
  },
  {
    label: 'Ссылки',
    text: 'Покажите ваш дизайн светильника или весь дом друзьям. Они увидят всё так же, как видите вы и смогут добавить что-то своё.',
  },
  {
    label: 'Советы',
    text: 'WOODLED помогает собрать идеальный свет. Отправьте ссылку на Ваш Лес и получите поддержку эксперта по свету. Самые смелые мечты — шаг за шагом.',
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
          padding: '4px',
          borderRadius: '999px',
          background: 'rgba(255, 250, 244, 0.55)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '1px solid rgba(184, 125, 82, 0.10)',
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 10px rgba(184, 125, 82, 0.06)`,
          gap: '2px',
          maxWidth: '100%',
        }"
      >
        <button
          v-for="(f, i) in FEATURES"
          :key="i"
          @click="active = i"
          :style="{
            padding: 'clamp(7px, 1.6vw, 10px) clamp(14px, 3.5vw, 20px)',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'clamp(13px, 3.2vw, 15px)',
            fontWeight: i === active ? 700 : 500,
            color: i === active ? PAGE.roseDeep : PAGE.textSec,
            letterSpacing: '-0.005em',
            background: i === active
              ? `linear-gradient(135deg, ${PAGE.pastelPink} 0%, ${PAGE.pastelPinkD} 100%)`
              : 'transparent',
            boxShadow: i === active
              ? `inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 6px rgba(184, 125, 82, 0.14)`
              : 'none',
            transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms ease, font-weight 300ms ease, box-shadow 300ms ease',
            whiteSpace: 'nowrap',
          }"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div :style="{ marginTop: '18px' }">
      <p
        :key="active"
        :style="{
          margin: 0,
          fontSize: 'clamp(13px, 3vw, 15px)',
          fontWeight: 500,
          lineHeight: 1.55,
          color: PAGE.textDim,
          maxWidth: '460px',
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
