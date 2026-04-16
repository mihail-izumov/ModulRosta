---
layout: page
sidebar: false
navbar: false
footer: false
aside: false
pageClass: woodled-fullscreen
title: WOODLED Rotor - Онбординг
---

<script setup>
import WoodledOnboarding from '../.vitepress/woodled/WoodledOnboarding.vue'

function goNext() {
  window.location.href = '/customizer'
}
</script>

<ClientOnly>
  <WoodledOnboarding @finish="goNext" />
</ClientOnly>
