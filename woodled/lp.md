---
layout: page
sidebar: false
aside: false
title: Мой свет. Мой лес.
description: Живой Дом WOODLED — Ваше идеальное пространство для света.
head:
  - - meta
    - name: description
      content: Живой Дом WOODLED — Ваше идеальное пространство для света..
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:site_name
      content: WOODLED
  - - meta
    - property: og:title
      content: Мой свет. Мой лес.
  - - meta
    - property: og:description
      content: Живой Дом WOODLED — Ваше идеальное пространство для света.
  - - meta
    - property: og:url
      content: https://runscale.ru/woodled/lp
  - - meta
    - property: og:image
      content: https://runscale.ru/woodled/og-cover.png
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
      content: Мой свет. Мой лес.
  - - meta
    - name: twitter:description
      content: Живой Дом WOODLED — Ваше идеальное пространство для света.
  - - meta
    - name: twitter:image
      content: https://runscale.ru/woodled/og-cover.png
---

<script setup>
import { onMounted, onUnmounted } from 'vue'
import WoodledLanding from '../.vitepress/woodled/lp/App.vue'

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
  <WoodledLanding />
</ClientOnly>
