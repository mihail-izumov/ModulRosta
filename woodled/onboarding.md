---
layout: page
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
