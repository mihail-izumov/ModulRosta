<template>
  <div class="mr-page">
    <MRHero />
    <InstrumentPanel />
    <MRProtocol />
    <MRTeams />
    <MRRunscale404 />
    <MRHistory />
  </div>
</template>

<script setup lang="ts">
import MRHero from './MRHero.vue'
import InstrumentPanel from './InstrumentPanel.vue'
import MRTeams from './MRTeams.vue'
import MRRunscale404 from './MRRunscale404.vue'
import MRProtocol from './MRProtocol.vue'
import MRHistory from './MRHistory.vue'
</script>

<style>
/* Global styles for Modul Rosta Page */
.mr-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

/* Import JetBrains Mono for monospace elements */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
</style>
