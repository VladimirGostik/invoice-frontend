<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Left side - Page title -->
      <div class="header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle" v-if="pageSubtitle">{{ pageSubtitle }}</p>
      </div>
      
      <!-- Right side - User info & logout -->
      <div class="header-right">
        <!-- User info -->
        <div class="user-info">
          <CIcon icon="cil-user" class="user-icon" />
          <div class="user-details">
            <span class="user-name">{{ userName }}</span>
            <small class="user-email">{{ userEmail }}</small>
          </div>
        </div>
        
        <!-- Logout button -->
        <CButton 
          color="danger" 
          variant="outline" 
          size="sm"
          @click="handleLogout"
          class="logout-btn"
        >
          <CIcon icon="cil-account-logout" class="me-1" />
          Odhlásiť
        </CButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { CIcon } from '@coreui/icons-vue'
import { cilBuilding, cilCursor } from '@coreui/icons'

const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Dashboard'
  },
  pageSubtitle: {
    type: String,
    default: ''
  }
})

const authStore = useAuthStore()

const userName = computed(() => {
  return authStore.user?.name || 'Používateľ'
})

const userEmail = computed(() => {
  return authStore.user?.email || 'user@example.com'
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  min-height: 70px;
}

.header-left {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.page-subtitle {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.user-icon {
  width: 24px;
  height: 24px;
  color: #6c757d;
}

.user-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
}

.user-email {
  color: #6c757d;
  font-size: 0.8rem;
}

.logout-btn {
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .header-left {
    text-align: center;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .user-details {
    display: none;
  }
}
</style>