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
    <div :style="{ flex: 1, lineHeight: 1.25 }">
      <div :style="{ fontSize: '13px', fontWeight: 600, color: T.text }">
        Дерево продолжает светить
      </div>
      <div :style="{ fontSize: '11px', color: T.textSec }">
        Как работает свет WOODLED
      </div>
    </div>
    <span
      :style="{
        fontSize: '60px',
        lineHeight: 1,
        fontWeight: 500,
        color: T.neutral,
        flexShrink: 0,
      }"
    >›</span>
  </a>
</template>
