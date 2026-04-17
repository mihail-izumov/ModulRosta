---
layout: page
sidebar: false
aside: false
title: WOODLED Rotor — Конфигуратор
description: Соберите свой лес света WOODLED — дизайнерские светильники из дерева для каждой комнаты
head:
  - - meta
    - name: description
      content: Соберите свой лес света WOODLED — дизайнерские светильники из дерева для каждой комнаты
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:site_name
      content: WOODLED
  - - meta
    - property: og:title
      content: WOODLED Rotor — Конфигуратор
  - - meta
    - property: og:description
      content: Соберите свой лес света WOODLED — дизайнерские светильники из дерева для каждой комнаты
  - - meta
    - property: og:url
      content: https://runscale.ru/woodled/customizer
  - - meta
    - property: og:image
      content: https://runscale.ru/woodled/og-cover.jpg
  - - meta
    - property: og:image:width
      content: "1200"
  - - meta
    - property: og:image:height
      content: "630"
  - - meta
    - property: og:image:alt
      content: WOODLED Rotor
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: WOODLED Rotor — Конфигуратор
  - - meta
    - name: twitter:description
      content: Соберите свой лес света WOODLED — дизайнерские светильники из дерева для каждой комнаты
  - - meta
    - name: twitter:image
      content: https://runscale.ru/woodled/og-cover.jpg
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
