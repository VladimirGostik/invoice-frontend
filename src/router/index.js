import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('@/views/companies/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/companies/create',
    name: 'CompaniesCreate',
    component: () => import('@/views/companies/Form.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/companies/:id/edit',
    name: 'CompaniesEdit',
    component: () => import('@/views/companies/Form.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('@/views/Invoices.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients', 
    name: 'clients',
    component: () => import('@/views/Clients.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/residential-companies',
    name: 'ResidentialCompanies',
    component: () => import('@/views/residential-companies/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/residential-companies/create',
    name: 'ResidentialCompaniesCreate',
    component: () => import('@/views/residential-companies/Form.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/residential-companies/:id/edit',
    name: 'ResidentialCompaniesEdit',
    component: () => import('@/views/residential-companies/Form.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Ochrana routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Pri prvom načítaní (refresh), skontroluj auth
  if (!from.name) {
    authStore.checkAuth()
  }
  
  const isAuthenticated = authStore.isAuthenticated
  
  console.log('🔐 Router guard:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: isAuthenticated,
    hasToken: !!authStore.token
  })
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login')
    next('/login')
  } else if (to.meta.guest && isAuthenticated) {
    console.log('✅ Already authenticated, redirecting to dashboard')
    next('/dashboard')
  } else {
    console.log('✅ Access granted to', to.path)
    next()
  }
})

export default router