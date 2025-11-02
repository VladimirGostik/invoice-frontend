import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor pre token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor pre 401 a 403 handling
let isHandling401 = false

api.interceptors.response.use(
  response => response,
  error => {
    // 401 - Unauthorized (token vypršal/neplatný)
    if (error.response?.status === 401 && !isHandling401) {
      isHandling401 = true
      
      // Vyčisti localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
      // Redirect na login
      router.push('/login').finally(() => {
        isHandling401 = false
      })
    }
    
    // 403 - Forbidden (nemáte oprávnenie)
    if (error.response?.status === 403) {
      // Vytvor custom event pre zobrazenie dialógu
      const event = new CustomEvent('show-forbidden-dialog', {
        detail: {
          message: error.response?.data?.message || 'Na túto akciu nemáte oprávnenie.'
        }
      })
      window.dispatchEvent(event)
    }
    
    return Promise.reject(error)
  }
)

export default api