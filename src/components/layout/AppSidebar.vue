<template>
  <aside class="sidebar">
    <!-- Logo/Brand -->
    <div class="sidebar-header">
      <h4 class="text-white mb-0">
        <CIcon icon="cil-speedometer" class="me-2" />
        {{ appName }}
      </h4>
    </div>
    
    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" active-class="active">
            <CIcon icon="cil-speedometer" class="nav-icon" />
            <span>Dashboard</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/invoices" class="nav-link" active-class="active">
            <CIcon icon="cil-description" class="nav-icon" />
            <span>Faktúry</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/clients" class="nav-link" active-class="active">
            <CIcon icon="cil-people" class="nav-icon" />
            <span>Klienti</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/reports" class="nav-link" active-class="active">
            <CIcon icon="cil-chart-pie" class="nav-icon" />
            <span>Reporty</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/settings" class="nav-link" active-class="active">
            <CIcon icon="cil-settings" class="nav-icon" />
            <span>Nastavenia</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
const appName = import.meta.env.VITE_APP_NAME || 'Fakturačný systém'
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
  color: white;
  border-left-color: #3498db;
}

.nav-link.active {
  background-color: rgba(255,255,255,0.15);
  color: white;
  border-left-color: #e74c3c;
  font-weight: 600;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .sidebar-nav {
    display: flex;
    overflow-x: auto;
  }
  
  .nav-list {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
  }
  
  .nav-link span {
    display: none;
  }
}
</style>