<script setup lang="ts">
/**
 * OnboardingLink.vue — Блок «Дерево продолжает светить».
 *
 * Источник: woodled-v42.jsx (главный экран, блок с IC.mirror).
 * Ведёт на внешний онбординг, всегда виден на главной.
 */

import { T } from '../theme/tokens'
import Icon from './ui/Icons.vue'

const ONBOARDING_URL = 'https://runscale.ru/woodled/onboarding'
</script>

<template>
  <a
    :href="ONBOARDING_URL"
    target="_blank"
    rel="noopener noreferrer"
    :style="{
      textDecoration: 'none',
      background: `linear-gradient(135deg, ${T.neutral}15, ${T.neutral}05)`,
      border: `1px solid ${T.neutral}22`,
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }"
  >
    <div
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: T.neutral + '18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }"
    >
      <Icon name="mirror" :color="T.neutral" :size="22" />
    </div>
    <div :style="{ flex: 1, lineHeight: 1.75 }">
      <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
        Дерево продолжает светить
      </div>
      <div :style="{ fontSize: '11px', color: T.textSec }">
        Как работает свет WOODLED
      </div>
    </div>
    <svg
      width="22" height="22" viewBox="0 0 24 24" fill="none"
      :stroke="T.neutral" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"
      :style="{ flexShrink: 0, display: 'block' }"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </a>
</template>
