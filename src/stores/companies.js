import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useCompaniesStore = defineStore('companies', () => {
  // STATE
  const companies = ref([])
  const currentCompany = ref(null)
  const selectedCompany = ref(null)
  const isLoading = ref(false)
  const errors = ref({})
  
  // Pagination
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
    from: 0,
    to: 0
  })

  // GETTERS
  const totalCompanies = computed(() => companies.value.length)
  const activeCompanies = computed(() => 
    companies.value.filter(company => company.status === 'active').length
  )

  // ACTIONS
  const fetchCompanies = async (page = 1) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.get(`/api/companies/main?page=${page}`)
      
      // Transform API data
      companies.value = response.data.data.map(company => ({
        id: company.id,
        name: company.company_name,
        email: company.invoice_issuer_email || 'N/A',
        phone: company.invoice_issuer_phone || 'N/A',
        address: `${company.company_address}, ${company.company_city}`,
        city: company.company_city,
        state: company.company_state,
        zip: company.company_zip,
        ico: company.company_ico,
        dic: company.company_dic,
        ic_dph: company.company_ic_dph,
        bank_account: company.company_bank_account,
        bank_swift: company.company_bank_swift,
        type: company.company_type,
        issuer_name: company.invoice_issuer_name,
        issuer_email: company.invoice_issuer_email,
        issuer_phone: company.invoice_issuer_phone,
        signatures: company.signatures
      }))
      
      // Update pagination
      pagination.value = {
        currentPage: response.data.meta.current_page,
        lastPage: response.data.meta.last_page,
        total: response.data.meta.total,
        perPage: response.data.meta.per_page,
        from: response.data.meta.from,
        to: response.data.meta.to
      }
      
      return { success: true }
    } catch (error) {
      console.error('❌ Error fetching companies:', error)
      
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

  const fetchCompany = async (id) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.get(`/api/companies/${id}`)
      currentCompany.value = response.data.data
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error('❌ Error fetching company:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa načítať firmu'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const createCompany = async (data) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.post('/api/companies/main', data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error creating company:', error)
      errors.value = error.response?.data?.errors || {}
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa vytvoriť firmu'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const updateCompany = async (id, data) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.put(`/api/companies/${id}`, data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error updating company:', error)
      errors.value = error.response?.data?.errors || {}
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa aktualizovať firmu'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const deleteCompany = async (id) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      await api.delete(`/api/companies/${id}`)
      return { success: true }
    } catch (error) {
      console.error('❌ Error deleting company:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa vymazať firmu'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const selectCompany = (company) => {
    selectedCompany.value = company
    localStorage.setItem('selected_company', JSON.stringify(company))
  }

  const clearSelection = () => {
    selectedCompany.value = null
    localStorage.removeItem('selected_company')
  }

  const loadStoredCompany = () => {
    const stored = localStorage.getItem('selected_company')
    if (stored) {
      try {
        selectedCompany.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load stored company:', e)
      }
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    // State
    companies,
    currentCompany,
    selectedCompany,
    isLoading,
    errors,
    pagination,
    
    // Getters
    totalCompanies,
    activeCompanies,
    
    // Actions
    fetchCompanies,
    fetchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    selectCompany,
    clearSelection,
    loadStoredCompany,
    clearErrors
  }
})