<!-- src/views/residential-companies/Index.vue -->
<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Bytové podniky</strong>
            <CButton color="primary" @click="$router.push('/residential-companies/create')">
              <CIcon icon="cil-plus" /> Pridať bytový podnik
            </CButton>
          </CCardHeader>
          <CCardBody>
            <!-- Filter -->
            <CRow class="mb-3">
              <CCol :md="6">
                <CInputGroup>
                  <CFormInput
                    v-model="filters.name"
                    placeholder="Hľadať podľa názvu..."
                  />
                  <CButton 
                    v-if="filters.name" 
                    color="secondary" 
                    variant="outline"
                    @click="clearSearch"
                  >
                    <CIcon icon="cil-x" /> Zrušiť
                  </CButton>
                </CInputGroup>
                <small v-if="isSearching" class="text-muted mt-1 d-block">
                  <CSpinner size="sm" class="me-1" /> Vyhľadávám...
                </small>
              </CCol>
            </CRow>

            <!-- Loading -->
            <div v-if="companiesStore.isLoading" class="text-center py-4">
              <CSpinner color="primary" />
              <p class="mt-2">Načítavam bytové podniky...</p>
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
            
            <!-- Companies List -->
            <div v-else-if="companiesStore.companies.length > 0">
              <CCard 
                v-for="company in companiesStore.companies" 
                :key="company.id"
                class="mb-3"
              >
                <CCardBody>
                  <CRow class="align-items-start">
                    <CCol :md="8">
                      <h5 class="mb-2">{{ company.name }}</h5>
                      <div class="text-muted mb-2">
                        <small>
                          <strong>IČO:</strong> {{ company.ico }} | 
                          <strong>DIČ:</strong> {{ company.dic }}
                        </small>
                      </div>
                      <div class="text-muted mb-3">
                        <small>
                          <CIcon icon="cil-location-pin" class="me-1" />
                          {{ company.address }}, {{ company.city }}
                        </small>
                      </div>
                      
                      <!-- Streets always visible -->
                      <div v-if="company.streets && company.streets.length > 0" class="mt-3">
                        <h6 class="mb-2">
                          <CIcon icon="cil-list" class="me-2" />
                          Ulice ({{ company.streets.length }})
                        </h6>
                        <div class="d-flex flex-wrap gap-2">
                          <CBadge 
                            v-for="street in company.streets" 
                            :key="street.id"
                            color="info"
                            class="px-3 py-2"
                          >
                            <CIcon icon="cil-location-pin" size="sm" class="me-1" />
                            {{ street.street_name }}
                          </CBadge>
                        </div>
                      </div>
                      <div v-else class="mt-3">
                        <small class="text-muted">
                          <CIcon icon="cil-info" class="me-1" />
                          Žiadne ulice nie sú priradené
                        </small>
                      </div>
                    </CCol>
                    <CCol :md="4" class="text-end">
                      <CButtonGroup size="sm">
                        <CButton 
                          color="info" 
                          variant="outline"
                          @click="$router.push(`/residential-companies/${company.id}/edit`)"
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
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </div>

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
            <div v-else-if="!companiesStore.isLoading && companiesStore.companies.length === 0" class="text-center py-4">
              <CIcon icon="cil-building" size="3xl" class="text-muted mb-3" />
              <h5>Žiadne bytové podniky</h5>
              <p class="text-muted">
                {{ filters.name ? 'Nenašli sa žiadne výsledky pre váš filter.' : 'Zatiaľ nemáte žiadne bytové podniky v systéme.' }}
              </p>
              <CButton 
                v-if="!filters.name"
                color="primary" 
                @click="$router.push('/residential-companies/create')"
              >
                Pridať prvý bytový podnik
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useResidentialCompaniesStore } from '@/stores/residentialCompanies'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const companiesStore = useResidentialCompaniesStore()

const filters = ref({
  name: ''
})

const isSearching = ref(false)
let searchTimeout = null

// Watch for filter changes and trigger debounced search
watch(() => filters.value.name, (newValue) => {
  // Clear existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
  
  // Show searching indicator only if typing
  isSearching.value = true
  
  // Set new timeout for 500ms
  searchTimeout = setTimeout(async () => {
    console.log('🔍 Searching for:', newValue) // Debug log
    isSearching.value = false
    await companiesStore.fetchCompanies(1, { name: newValue })
  }, 500)
})

const loadPage = async (page) => {
  await companiesStore.fetchCompanies(page, filters.value)
}

const clearSearch = async () => {
  filters.value.name = ''
  // Watch will trigger the search automatically
}

const handleDelete = async (company) => {
  if (confirm(`Naozaj chcete vymazať bytový podnik "${company.name}"?`)) {
    const result = await companiesStore.deleteCompany(company.id)
    if (result.success) {
      await companiesStore.fetchCompanies(companiesStore.pagination.currentPage, filters.value)
    }
  }
}

onMounted(async () => {
  await companiesStore.fetchCompanies()
})
</script>