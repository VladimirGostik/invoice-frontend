import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useResidentialCompaniesStore = defineStore('residentialCompanies', () => {
  // STATE
  const companies = ref([])
  const currentCompany = ref(null)
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
  const totalCompanies = computed(() => pagination.value.total)

  // ACTIONS
  const fetchCompanies = async (page = 1, filters = {}) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const params = new URLSearchParams({
        page: page.toString()
      })
      
      // Pridaj filter pre meno ak existuje
      if (filters.name) {
        params.append('filter[company_name]', filters.name)  // ✅ OPRAVENÉ: používa Laravel Query Builder syntax
      }
      
      console.log('📡 Fetching with URL:', `/api/companies/residential?${params}`) // Debug log
      
      const response = await api.get(`/api/companies/residential?${params}`)
      
      // Transform API data
      companies.value = response.data.data.map(company => ({
        id: company.id,
        name: company.company_name,
        city: company.company_city,
        state: company.company_state,
        address: company.company_address,
        zip: company.company_zip,
        ico: company.company_ico,
        dic: company.company_dic,
        ic_dph: company.company_ic_dph,
        bank_account: company.company_bank_account,
        bank_swift: company.company_bank_swift,
        type: company.company_type,
        created_at: company.created_at,
        updated_at: company.updated_at,
        streets: company.streets || []
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
      console.error('❌ Error fetching residential companies:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa načítať bytové podniky'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const fetchCompany = async (id) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.get(`/api/companies/residential/${id}`)
      currentCompany.value = response.data.data
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error('❌ Error fetching residential company:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa načítať bytový podnik'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const createCompany = async (companyData) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.post('/api/companies/residential', companyData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error creating residential company:', error)
      errors.value = error.response?.data?.errors || {}
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa vytvoriť bytový podnik'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const updateCompany = async (id, companyData) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.put(`/api/companies/${id}`, companyData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error updating residential company:', error)
      errors.value = error.response?.data?.errors || {}
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa aktualizovať bytový podnik'
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
      console.error('❌ Error deleting residential company:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa vymazať bytový podnik'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  // STREETS ACTIONS
  const addStreet = async (companyId, streetName) => {
    errors.value = {}
    
    const data = { 
      company_id: companyId, 
      street_name: streetName 
    }
    
    try {
      const response = await api.post('/api/streets', data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error adding street:', error)
      errors.value.street = error.response?.data?.message || 'Nepodarilo sa pridať ulicu'
      return { success: false, message: errors.value.street }
    }
  }

  const updateStreet = async (companyId, streetId, streetName) => {
    errors.value = {}
    
    const data = { 
      company_id: companyId, 
      street_name: streetName 
    }

    try {
      const response = await api.put(`/api/streets/${streetId}`, data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error updating street:', error)
      errors.value.street = error.response?.data?.message || 'Nepodarilo sa aktualizovať ulicu'
      return { success: false, message: errors.value.street }
    }
  }

  const deleteStreet = async (streetId) => {
    errors.value = {}
    
    try {
      await api.delete(`/api/streets/${streetId}`)
      return { success: true }
    } catch (error) {
      console.error('❌ Error deleting street:', error)
      errors.value.street = error.response?.data?.message || 'Nepodarilo sa vymazať ulicu'
      return { success: false, message: errors.value.street }
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    // State
    companies,
    currentCompany,
    isLoading,
    errors,
    pagination,
    
    // Getters
    totalCompanies,
    
    // Actions
    fetchCompanies,
    fetchCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    addStreet,
    updateStreet,
    deleteStreet,
    clearErrors
  }
})