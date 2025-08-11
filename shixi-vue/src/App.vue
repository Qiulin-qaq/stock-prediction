<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  
  <!-- toast container placeholder for daisyui notifications -->
  <div class="toast toast-end toast-top z-50" id="global-toast-container" />
</template>

<style scoped>
/* App shell is kept minimal; views provide their own layout */
</style>
