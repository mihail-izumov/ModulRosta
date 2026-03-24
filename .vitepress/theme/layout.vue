<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import MRPageLoader from '../main-page/MRPageLoader.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <MRPageLoader />
    </template>
  </Layout>
</template>
