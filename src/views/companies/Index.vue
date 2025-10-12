<!-- src/views/companies/Index.vue -->
<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Firmy</strong>
            <CButton color="primary" @click="$router.push('/companies/create')">
              <CIcon icon="cil-plus" /> Pridať firmu
            </CButton>
          </CCardHeader>
          <CCardBody>
            <!-- Loading -->
            <div v-if="companiesStore.isLoading" class="text-center py-4">
              <CSpinner color="primary" />
              <p class="mt-2">Načítavam firmy...</p>
            </div>
            
            <!-- Error -->
            <CAlert 
              v-else-if="companiesStore.errors.general"
              color="danger"
              :visible="true"
              dismissible
              @close="companiesStore.clearErrors"
            >
              {{ companiesStore.errors.general }}
            </CAlert>
            
            <!-- Table -->
            <CTable hover v-else-if="companiesStore.companies.length > 0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Názov</CTableHeaderCell>
                  <CTableHeaderCell>IČO / DIČ</CTableHeaderCell>
                  <CTableHeaderCell>Adresa</CTableHeaderCell>
                  <CTableHeaderCell>Bankový účet</CTableHeaderCell>
                  <CTableHeaderCell>Akcie</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="company in companiesStore.companies" :key="company.id">
                  <CTableDataCell>
                    <strong>{{ company.name }}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ company.ico }} / {{ company.dic }}
                  </CTableDataCell>
                  <CTableDataCell>
                    <small>{{ company.address }}</small>
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ company.bank_account }}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButtonGroup size="sm">
                      <CButton 
                        color="info" 
                        variant="outline"
                        @click="$router.push(`/companies/${company.id}/edit`)"
                      >
                        <CIcon icon="cil-pencil" /> Upraviť
                      </CButton>
                      <CButton 
                        color="danger" 
                        variant="outline"
                        @click="handleDelete(company)"
                      >
                        <CIcon icon="cil-trash" /> Zmazať
                      </CButton>
                    </CButtonGroup>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <!-- Pagination -->
            <div v-if="companiesStore.pagination.lastPage > 1" class="mt-3">
              <CPagination>
                <CPaginationItem 
                  :disabled="companiesStore.pagination.currentPage === 1"
                  @click="loadPage(companiesStore.pagination.currentPage - 1)"
                >
                  Predošlá
                </CPaginationItem>
                
                <CPaginationItem 
                  v-for="page in companiesStore.pagination.lastPage" 
                  :key="page"
                  :active="page === companiesStore.pagination.currentPage"
                  @click="loadPage(page)"
                >
                  {{ page }}
                </CPaginationItem>
                
                <CPaginationItem 
                  :disabled="companiesStore.pagination.currentPage === companiesStore.pagination.lastPage"
                  @click="loadPage(companiesStore.pagination.currentPage + 1)"
                >
                  Ďalšia
                </CPaginationItem>
              </CPagination>
            </div>
            
            <!-- Empty state -->
            <div v-else-if="companiesStore.isLoading" class="text-center py-4">
              <CIcon icon="cil-building" size="3xl" class="text-muted mb-3" />
              <h5>Žiadne firmy</h5>
              <p class="text-muted">Zatiaľ nemáte žiadne firmy v systéme.</p>
              <CButton color="primary" @click="$router.push('/companies/create')">
                Pridať prvú firmu
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const companiesStore = useCompaniesStore()

const loadPage = async (page) => {
  await companiesStore.fetchCompanies(page)
}

const handleDelete = async (company) => {
  if (confirm(`Naozaj chcete vymazať firmu "${company.name}"?`)) {
    const result = await companiesStore.deleteCompany(company.id)
    if (result.success) {
      await companiesStore.fetchCompanies()
    }
  }
}

onMounted(async () => {
  await companiesStore.fetchCompanies()
})
</script>