import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api' // ✅ Použi centrálnu inštanciu
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // ⚡ STATE
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const isLoading = ref(false)
  const errors = ref({})

  // 🔍 GETTERS (computed)
  const isAuthenticated = computed(() => !!token.value)
  const isGuest = computed(() => !isAuthenticated.value)

  // 🚀 ACTIONS
  const login = async (credentials) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.post('/api/auth/login', credentials)
      const authToken = response.data.access_token
      
      // Uložíme token
      token.value = authToken
      localStorage.setItem('auth_token', authToken)
    
      // Nastavíme Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    
      // Ulož user data z login response (ak ich BE posiela)
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      } else {
        // Fallback - ulož aspoň email
        user.value = { email: credentials.email }
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
      
      // Redirect na dashboard
      await router.push('/dashboard')
    
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Prihlásenie sa nepodarilo'
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
        errors.value = error.response.data?.errors || {}
      } else if (error.request) {
        errorMessage = 'Nepodarilo sa pripojiť na server.'
      } else {
        errorMessage = error.message
      }
      
      errors.value.general = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await api.post('/api/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      forceLogout()
    }
  }

  const forceLogout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    router.push('/login')
  }

  const checkAuth = () => {
    if (token.value && !user.value) {
      const storedUser = localStorage.getItem('auth_user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (e) {
          console.error('Failed to parse stored user:', e)
        }
      }
    }
  }

  // Inicializácia
  if (token.value) {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    errors,
    
    // Getters
    isAuthenticated,
    isGuest,
    
    // Actions
    login,
    logout,
    forceLogout,
    checkAuth
  }
})