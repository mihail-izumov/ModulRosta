---
layout: page
sidebar: false
aside: false
title: WOODLED Rotor — Конфигуратор
---

<script setup>
import { onMounted, onUnmounted } from 'vue'
import WoodledCustomizer from '../.vitepress/woodled/customizer/components/App.vue'

let styleEl = null

onMounted(() => {
  styleEl = document.createElement('style')
  styleEl.textContent = `
    .VPNav, .VPLocalNav, .VPBackToTop, .VPFooter, .VPSidebar {
      display: none !important;
    }
    .VPContent { padding: 0 !important; }
  `
  document.head.appendChild(styleEl)
})

onUnmounted(() => {
  if (styleEl) {
    styleEl.remove()
    styleEl = null
  }
})
</script>

<ClientOnly>
  <WoodledCustomizer />
</ClientOnly>
