import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

// Vytvoríme Axios instanciu s base URL z .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Axios interceptor pre automatické pridanie tokenu a handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ak dostaneme 401, token je neplatný - odhláš používateľa
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.forceLogout()
    }
    return Promise.reject(error)
  }
)

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
      console.log('Pokus o prihlásenie na:', import.meta.env.VITE_API_BASE_URL)
      
      const response = await api.post('/api/auth/login', credentials)
      console.log('Login response:', response.data)
      
      const authToken = response.data.access_token
    
      // Uložíme token
      token.value = authToken
      localStorage.setItem('auth_token', authToken)
    
      // Nastavíme Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    
      console.log('✅ Token uložený:', authToken)
    
      // Ulož user data z login response (ak ich BE posiela)
      if (response.data.user) {
        user.value = response.data.user
      } else {
        // Fallback - ulož aspoň email
        user.value = { email: credentials.email }
      }
      
      console.log('✅ User data:', user.value)
    
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
    localStorage.removeItem('auth_user') // Vyčisti aj user
    delete api.defaults.headers.common['Authorization']
    router.push('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return
    
    try {
      const response = await api.get('/api/auth/user')
      user.value = response.data
      localStorage.setItem('auth_user', JSON.stringify(user.value))
      console.log('✅ User data loaded:', user.value)
    } catch (error) {
      console.error('❌ Fetch user error:', error)
      
      // Neodhlasuj pri fetch errore - už je v interceptore
      if (error.response?.status !== 401) {
        console.warn('⚠️ User fetch failed, using stored data')
        // Skús načítať z localStorage
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        } else {
          user.value = { email: 'user' }
        }
      }
    }
  }

  const checkAuth = () => {
    console.log('🔍 Checking auth...', { hasToken: !!token.value, hasUser: !!user.value })
    
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      // Skús načítať user z localStorage
      if (!user.value) {
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          try {
            user.value = JSON.parse(storedUser)
            console.log('✅ User loaded from localStorage:', user.value)
          } catch (e) {
            console.error('Failed to parse stored user:', e)
          }
        }
      }
      
      // ⚠️ REMOVED: Nebudeme volať fetchUser() pri každom checkAuth()
      // Volá sa len raz pri logine
    }
  }

  // Inicializácia
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    
    // Načítaj user z localStorage
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        console.log('✅ User restored from localStorage:', user.value)
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
    fetchUser,
    checkAuth,
    
    // Export API pre použitie v iných častiach aplikácie
    api
  }
})