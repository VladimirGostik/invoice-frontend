<template>
  <RouterView />
  <ForbiddenDialog />
</template>

<script setup>
import { RouterView } from 'vue-router'
import ForbiddenDialog from '@/components/ForbiddenDialog.vue'
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden; /* Zabráni dvojitému scrollbaru */
}

#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* Odstránime default margin/padding z CoreUI */
.container-fluid {
  margin: 0 !important;
  padding: 1rem !important;
  max-width: none !important;
  width: 100% !important;
}
</style>