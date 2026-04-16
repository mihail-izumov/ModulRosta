---
layout: page
---

<script setup>
import WoodledOnboarding from '/components/woodled/WoodledOnboarding.vue'
</script>

<ClientOnly>
  <WoodledOnboarding @finish="goNext" />
</ClientOnly>

<script>
function goNext () {
  // navigate to the customizer
  window.location.href = '/customizer'
}
</script>
