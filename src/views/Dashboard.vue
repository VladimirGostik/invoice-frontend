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
                    <small class="text-muted">{{ selectedCompany.email }}</small>
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Stats Cards -->
    <CRow class="mb-4">
      <CCol sm="6" lg="3">
        <CCard class="mb-4">
          <CCardBody>
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-4 fw-semibold">{{ companiesStore.totalCompanies }}</div>
                <div class="text-body-secondary text-uppercase fw-semibold small">
                  Celkové firmy
                </div>
              </div>
              <CIcon icon="cil-building" height="52" class="text-primary" />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol sm="6" lg="3">
        <CCard class="mb-4">
          <CCardBody>
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-4 fw-semibold">{{ companiesStore.activeCompanies }}</div>
                <div class="text-body-secondary text-uppercase fw-semibold small">
                  Aktívne firmy
                </div>
              </div>
              <CIcon icon="cil-check" height="52" class="text-success" />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol sm="6" lg="3">
        <CCard class="mb-4">
          <CCardBody>
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-4 fw-semibold">{{ currentStats.totalInvoices }}</div>
                <div class="text-body-secondary text-uppercase fw-semibold small">
                  Celkové faktúry
                </div>
              </div>
              <CIcon icon="cil-description" height="52" class="text-info" />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol sm="6" lg="3">
        <CCard class="mb-4">
          <CCardBody>
            <div class="d-flex justify-content-between">
              <div>
                <div class="fs-4 fw-semibold">€{{ currentStats.totalRevenue }}</div>
                <div class="text-body-secondary text-uppercase fw-semibold small">
                  Celkové tržby
                </div>
              </div>
              <CIcon icon="cil-euro" height="52" class="text-success" />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Companies Overview -->
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Prehľad firiem</strong>
          </CCardHeader>
          <CCardBody>
            <!-- Loading state -->
            <div v-if="companiesStore.isLoading" class="text-center py-4">
              <CSpinner color="primary" />
              <p class="mt-2">Načítavam firmy...</p>
            </div>
            
            <!-- Error state -->
            <CAlert 
              v-else-if="companiesStore.errors.general"
              color="danger"
              :visible="true"
            >
              {{ companiesStore.errors.general }}
            </CAlert>
            
            <!-- Companies table -->
            <CTable hover v-else-if="companiesStore.companies.length > 0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Názov firmy</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Telefón</CTableHeaderCell>
                  <CTableHeaderCell>Stav</CTableHeaderCell>
                  <CTableHeaderCell>Akcie</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="company in companiesStore.companies" :key="company.id">
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
                  <CTableDataCell>{{ company.email }}</CTableDataCell>
                  <CTableDataCell>{{ company.phone }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="getCompanyStatusColor(company.status)">
                      {{ getCompanyStatusText(company.status) }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButtonGroup size="sm">
                      <CButton 
                        color="primary" 
                        variant="outline"
                        @click="selectCompany(company)"
                      >
                        <CIcon icon="cil-cursor" />
                      </CButton>
                      <CButton color="info" variant="outline">
                        <CIcon icon="cil-pencil" />
                      </CButton>
                      <CButton color="success" variant="outline">
                        <CIcon icon="cil-chart-pie" />
                      </CButton>
                    </CButtonGroup>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            
            <!-- Empty state -->
            <div v-else class="text-center py-4">
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCompaniesStore } from '@/stores/companies'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
const companiesStore = useCompaniesStore()

const selectedCompanyId = ref('')
const currentStats = ref({
  totalInvoices: 0,
  totalRevenue: '0.00'
})

const selectedCompany = computed(() => {
  return companiesStore.companies.find(c => c.id == selectedCompanyId.value)
})

const handleCompanyChange = () => {
  if (selectedCompany.value) {
    companiesStore.selectCompany(selectedCompany.value)
    // Načítame štatistiky pre vybranú firmu
    loadCompanyStats(selectedCompany.value.id)
  }
}

const selectCompany = (company) => {
  selectedCompanyId.value = company.id
  companiesStore.selectCompany(company)
  loadCompanyStats(company.id)
}

const loadCompanyStats = async (companyId) => {
  // Tu načítate štatistiky pre konkrétnu firmu
  try {
    // const response = await authStore.api.get(`/companies/${companyId}/stats`)
    // currentStats.value = response.data
    
    // Zatiaľ mock data:
    currentStats.value = {
      totalInvoices: Math.floor(Math.random() * 100),
      totalRevenue: (Math.random() * 50000).toFixed(2)
    }
  } catch (error) {
    console.error('Error loading company stats:', error)
  }
}

const getCompanyStatusColor = (status) => {
  const colors = {
    'active': 'success',
    'inactive': 'secondary',
    'pending': 'warning',
    'suspended': 'danger'
  }
  return colors[status] || 'secondary'
}

onMounted(async () => {
  console.log('🚀 Dashboard mounted')
  console.log('Is authenticated:', authStore.isAuthenticated)
  console.log('Auth token exists:', !!authStore.token)
  
  authStore.checkAuth()
  
  console.log('📞 Calling fetchCompanies...')
  const result = await companiesStore.fetchCompanies()
  console.log('📞 fetchCompanies result:', result)

  if (companiesStore.companies.length === 1) {
    const company = companiesStore.companies[0]
    selectedCompanyId.value = company.id
    companiesStore.selectCompany(company)
    loadCompanyStats(company.id)
  }
})
</script>