import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'  // Importujte API priamo

export const useCompaniesStore = defineStore('companies', () => {
  // ⚡ STATE
  const companies = ref([])
  const selectedCompany = ref(null)
  const isLoading = ref(false)
  const errors = ref({})

  // 🔍 GETTERS
  const totalCompanies = computed(() => companies.value.length)
  const activeCompanies = computed(() => 
    companies.value.filter(company => company.status === 'active').length
  )

  // 🚀 ACTIONS
  const fetchCompanies = async () => {
    isLoading.value = true
    errors.value = {}
    
    try {
      console.log('🔍 Debugging companies fetch:')
      console.log('API base URL:', import.meta.env.VITE_API_BASE_URL)
      console.log('Full URL will be:', `${import.meta.env.VITE_API_BASE_URL}/api/companies/main`)
      
      const response = await api.get('/api/companies/main')
      
      console.log('🏢 Companies response:', response.data)
      console.log('Response status:', response.status)
      console.log('Response type:', typeof response.data)
      
      // Skúsme rôzne formáty odpovede
      let companiesData = []
      
      if (Array.isArray(response.data)) {
        companiesData = response.data
      } else if (response.data.data && Array.isArray(response.data.data)) {
        companiesData = response.data.data
      } else if (response.data.companies && Array.isArray(response.data.companies)) {
        companiesData = response.data.companies
      } else {
        console.log('⚠️ Neočakávaný formát response:', response.data)
        companiesData = []
      }
      
      console.log('📊 Parsed companies data:', companiesData)
      companies.value = companiesData
      
      return { success: true }
    } catch (error) {
      console.error('❌ Error fetching companies:', error)
      console.log('Error response:', error.response?.data)
      console.log('Error status:', error.response?.status)
      
      let errorMessage = 'Nepodarilo sa načítať firmy'
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
      }
      
      errors.value.general = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const selectCompany = (company) => {
    selectedCompany.value = company
    // Môžete uložiť do localStorage pre persistenciu
    localStorage.setItem('selected_company', JSON.stringify(company))
  }

  const getCompanyStats = (companyId) => {
    // Tu môžete načítať štatistiky pre konkrétnu firmu
    // return authStore.api.get(`/companies/${companyId}/stats`)
  }

  return {
    // State
    companies,
    selectedCompany,
    isLoading,
    errors,
    
    // Getters
    totalCompanies,
    activeCompanies,
    
    // Actions
    fetchCompanies,
    selectCompany,
    getCompanyStats
  }
})