<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main content area -->
    <div class="main-content">
      <!-- Header -->
      <AppHeader :page-title="pageTitle" />
      
      <!-- Page content -->
      <main class="content-area">
        <CContainer fluid class="p-4">
          <slot />
        </CContainer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { CIcon } from '@coreui/icons-vue'
import { cilBuilding, cilCursor } from '@coreui/icons'

const route = useRoute()

// Dynamicky určujeme názov stránky podľa route
const pageTitle = computed(() => {
  const titles = {
    'Dashboard': 'Dashboard',
    'invoices': 'Faktúry',
    'clients': 'Klienti',
    'settings': 'Nastavenia'
  }
  return titles[route.name] || 'Fakturačný systém'
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }
}
</style>