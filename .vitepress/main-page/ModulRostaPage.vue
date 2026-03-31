<template>
  <div class="mr-page">
    <MRSneakPeek />
    <DigitalSupremacyHero />
    <InstrumentPanel />
    <MRProtocol />
    <MRRunscale404 />
    <MRLaunchPanel />
    <MRRadarBadge />
  </div>
</template>

<script setup lang="ts">
import MRSneakPeek from './MRSneakPeek.vue'
import InstrumentPanel from './InstrumentPanel.vue'
import MRHero from './MRHero.vue'
import MRTeams from './MRTeams.vue'
import MRRunscale404 from './MRRunscale404.vue'
import MRProtocol from './MRProtocol.vue'
import MRLaunchPanel from './MRLaunchPanel.vue'
import DigitalSupremacyHero from './DigitalSupremacyHero.vue'
import MRRadarBadge from './MRRadarBadge.vue' 
  
</script>

<style>
.mr-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  overflow-x: hidden;
}

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
</style>
