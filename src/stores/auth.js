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

export const useAuthStore = defineStore('auth', () => {
  // ⚡ STATE
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const isLoading = ref(false)
  const errors = ref({})

  // 🔍 GETTERS (computed)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isGuest = computed(() => !isAuthenticated.value)

  // 🚀 ACTIONS
  const login = async (credentials) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      console.log('Pokus o prihlásenie na:', import.meta.env.VITE_API_BASE_URL)
      console.log('Credentials:', credentials)
      
      const response = await api.post('/auth/login', credentials)
      console.log('Login response:', response.data)
      
      const { user: userData, token: authToken } = response.data
      
      // Uložíme token a user data
      token.value = authToken
      user.value = userData
      localStorage.setItem('auth_token', authToken)
      
      // Nastavíme Authorization header pre budúce requesty
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      
      // Redirect na dashboard
      router.push('/dashboard')
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Prihlásenie sa nepodarilo'
      
      if (error.response) {
        // Server odpovedal s error kódom
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
        errors.value = error.response.data?.errors || {}
      } else if (error.request) {
        // Request bol poslaný, ale nebola response
        errorMessage = 'Nepodarilo sa pripojiť na server. Skontrolujte internetové pripojenie.'
      } else {
        // Chyba v nastavení requestu
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
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Vyčistíme store aj v prípade chyby
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      delete api.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    
    try {
      const response = await api.get('/auth/user')
      user.value = response.data
    } catch (error) {
      console.error('Fetch user error:', error)
      // Ak je token neplatný, odhlásíme používateľa
      logout()
    }
  }

  const checkAuth = () => {
    if (token.value && !user.value) {
      fetchUser()
    }
  }

  // Inicializácia - ak máme token, nastavíme Authorization header
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
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
    fetchUser,
    checkAuth,
    
    // Export API pre použitie v iných častiach aplikácie
    api
  }
})