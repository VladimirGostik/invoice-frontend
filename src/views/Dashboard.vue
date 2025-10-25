<template>
  <AppLayout>
    <!-- Company Selector -->
    <CRow class="mb-4" v-if="companiesStore.companies.length > 1">
      <CCol :xs="12">
        <CCard>
          <CCardHeader>
            <strong>Výber firmy</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol :md="6">
                <CFormSelect 
                  v-model="selectedCompanyId"
                  @change="handleCompanyChange"
                >
                  <option value="">Vyberte firmu...</option>
                  <option 
                    v-for="company in companiesStore.companies" 
                    :key="company.id"
                    :value="company.id"
                  >
                    {{ company.name }}
                  </option>
                </CFormSelect>
              </CCol>
              <CCol :md="6" v-if="selectedCompany">
                <div class="d-flex align-items-center">
                  <CIcon icon="cil-building" class="me-2 text-primary" />
                  <div>
                    <strong>{{ selectedCompany.name }}</strong>
                    <br>
                    <small class="text-muted">{{ selectedCompany.bank_account }}</small>
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Companies Table -->
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Prehľad firiem</strong>
            <span class="text-muted ms-2" v-if="companiesStore.pagination.total">
              ({{ companiesStore.pagination.from }} - {{ companiesStore.pagination.to }} z {{ companiesStore.pagination.total }})
            </span>
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
            >
              {{ companiesStore.errors.general }}
            </CAlert>
            
            <!-- Table -->
            <CTable hover v-else-if="companiesStore.companies.length > 0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Názov firmy</CTableHeaderCell>
                  <CTableHeaderCell>IČO</CTableHeaderCell>
                  <CTableHeaderCell>DIČ</CTableHeaderCell>
                  <CTableHeaderCell>Bankový účet</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow 
                  v-for="company in companiesStore.companies" 
                  :key="company.id"
                  :class="{ 'table-active': company.id === selectedCompanyId }"
                >
                  <CTableDataCell>
                    <div class="d-flex align-items-center">
                      <CIcon icon="cil-building" class="me-2 text-primary" />
                      <div>
                        <strong>{{ company.name }}</strong>
                        <br>
                        <small class="text-muted">{{ company.address }}</small>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{{ company.ico }}</CTableDataCell>
                  <CTableDataCell>{{ company.dic }}</CTableDataCell>
                  <CTableDataCell>{{ company.bank_account }}</CTableDataCell>
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
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { CIcon } from '@coreui/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useCompanies } from '@/composables/useCompanies'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
const { 
  companiesStore, 
  selectedCompanyId, 
  selectedCompany, 
  selectCompany, 
  handleCompanyChange 
} = useCompanies()

const loadPage = async (page) => {
  await companiesStore.fetchCompanies(page)
}

onMounted(async () => {
  // Load stored company selection
  companiesStore.loadStoredCompany()
  
  // Fetch companies
  await companiesStore.fetchCompanies()
  
  // Auto-select if only one company
  if (companiesStore.companies.length === 1 && !selectedCompanyId.value) {
    selectCompany(companiesStore.companies[0])
  }
})
</script>