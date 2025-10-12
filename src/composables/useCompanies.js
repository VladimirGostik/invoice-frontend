import { ref, computed } from 'vue'
import { useCompaniesStore } from '@/stores/companies'

export function useCompanies() {
  const companiesStore = useCompaniesStore()
  const selectedCompanyId = ref('')

  const selectedCompany = computed(() => {
    return companiesStore.companies.find(c => c.id == selectedCompanyId.value)
  })

  const selectCompany = (company) => {
    selectedCompanyId.value = company.id
    companiesStore.selectCompany(company)
  }

  const handleCompanyChange = () => {
    if (selectedCompany.value) {
      companiesStore.selectCompany(selectedCompany.value)
    }
  }

  return {
    companiesStore,
    selectedCompanyId,
    selectedCompany,
    selectCompany,
    handleCompanyChange
  }
}