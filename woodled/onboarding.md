---
layout: page
sidebar: false
aside: false
title: WOODLED Rotor - Онбординг
---

<script setup>
import { onMounted, onUnmounted } from 'vue'
import WoodledOnboarding from '../.vitepress/woodled/WoodledOnboarding.vue'

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

function goNext() {
  window.location.href = '/customizer'
}
</script>

<ClientOnly>
  <WoodledOnboarding @finish="goNext" />
</ClientOnly>
