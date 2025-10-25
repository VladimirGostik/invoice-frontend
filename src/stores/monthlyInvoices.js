import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useMonthlyInvoicesStore = defineStore('monthlyInvoices', () => {
  // STATE
  const invoices = ref([])
  const currentInvoice = ref(null)
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
  const totalInvoices = computed(() => pagination.value.total)

  // ACTIONS
  const fetchInvoices = async (page = 1, filters = {}, sort = null) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const params = new URLSearchParams({
        page: page.toString()
      })
      
      // Pridaj filtre
      if (filters.invoice_name) {
        params.append('filter[invoice_name]', filters.invoice_name)
      }
      if (filters.company_id) {
        params.append('filter[company_id]', filters.company_id)
      }
      if (filters.residential_company_id) {
        params.append('filter[residential_company_id]', filters.residential_company_id)
      }
      if (filters.street_id) {
        params.append('filter[street_id]', filters.street_id)
      }
      if (filters.total) {
        params.append('filter[total]', filters.total)
      }
      
      // Pridaj sorting
      if (sort) {
        const direction = sort.direction === 'desc' ? '-' : ''
        params.append('sort', `${direction}${sort.field}`)
      }
      
      console.log('📡 Fetching monthly invoices with URL:', `/api/invoices/monthly?${params}`)
      
      const response = await api.get(`/api/invoices/monthly?${params}`)
      
      // Data are already in the correct format from API
      invoices.value = response.data.data
      
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
      console.error('❌ Error fetching monthly invoices:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa načítať mesačné faktúry'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const fetchInvoice = async (id) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.get(`/api/invoices/monthly/${id}`)
      currentInvoice.value = response.data.data
      return { success: true, data: response.data.data }
    } catch (error) {
      console.error('❌ Error fetching monthly invoice:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa načítať mesačnú faktúru'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const createInvoice = async (invoiceData) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.post('/api/invoices/monthly', invoiceData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error creating monthly invoice:', error)
      errors.value = error.response?.data?.errors || {}
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa vytvoriť mesačnú faktúru'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const updateInvoice = async (id, invoiceData) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      const response = await api.put(`/api/invoices/monthly/${id}`, invoiceData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error updating monthly invoice:', error)
      errors.value = error.response?.data?.errors || {}
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa aktualizovať mesačnú faktúru'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const deleteInvoice = async (id) => {
    isLoading.value = true
    errors.value = {}
    
    try {
      await api.delete(`/api/invoices/monthly/${id}`)
      return { success: true }
    } catch (error) {
      console.error('❌ Error deleting monthly invoice:', error)
      errors.value.general = error.response?.data?.message || 'Nepodarilo sa vymazať mesačnú faktúru'
      return { success: false, message: errors.value.general }
    } finally {
      isLoading.value = false
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    // State
    invoices,
    currentInvoice,
    isLoading,
    errors,
    pagination,
    
    // Getters
    totalInvoices,
    
    // Actions
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    clearErrors
  }
})
