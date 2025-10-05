<template>
  <div class="dashboard">
    <!-- Header -->
    <CContainer fluid class="px-4">
      <CRow class="align-items-center mb-3">
        <CCol>
          <h1 class="h2 mb-0">Dashboard</h1>
          <p class="text-body-secondary">
            Vitajte späť, {{ authStore.user?.name || 'používateľ' }}!
          </p>
        </CCol>
        <CCol xs="auto">
          <CButton 
            color="danger" 
            variant="outline" 
            @click="authStore.logout"
          >
            <CIcon icon="cil-account-logout" class="me-2" />
            Odhlásiť
          </CButton>
        </CCol>
      </CRow>

      <!-- Stats Cards -->
      <CRow class="mb-4">
        <CCol sm="6" lg="3">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fs-4 fw-semibold">26K</div>
                  <div class="text-body-secondary text-uppercase fw-semibold small">
                    Celkové faktúry
                  </div>
                </div>
                <CIcon icon="cil-people" height="52" class="text-high-emphasis-inverse" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm="6" lg="3">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fs-4 fw-semibold">€2.49M</div>
                  <div class="text-body-secondary text-uppercase fw-semibold small">
                    Celkové tržby
                  </div>
                </div>
                <CIcon icon="cil-chart-pie" height="52" class="text-high-emphasis-inverse" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm="6" lg="3">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fs-4 fw-semibold">€1.22M</div>
                  <div class="text-body-secondary text-uppercase fw-semibold small">
                    Nezaplatené
                  </div>
                </div>
                <CIcon icon="cil-chart-line" height="52" class="text-high-emphasis-inverse" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol sm="6" lg="3">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fs-4 fw-semibold">74</div>
                  <div class="text-body-secondary text-uppercase fw-semibold small">
                    Aktívni klienti
                  </div>
                </div>
                <CIcon icon="cil-people" height="52" class="text-high-emphasis-inverse" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <!-- Recent Invoices -->
      <CRow>
        <CCol :xs="12">
          <CCard class="mb-4">
            <CCardHeader>
              <strong>Posledné faktúry</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Číslo faktúry</CTableHeaderCell>
                    <CTableHeaderCell>Klient</CTableHeaderCell>
                    <CTableHeaderCell>Suma</CTableHeaderCell>
                    <CTableHeaderCell>Dátum</CTableHeaderCell>
                    <CTableHeaderCell>Stav</CTableHeaderCell>
                    <CTableHeaderCell>Akcie</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="invoice in sampleInvoices" :key="invoice.id">
                    <CTableDataCell>{{ invoice.number }}</CTableDataCell>
                    <CTableDataCell>{{ invoice.client }}</CTableDataCell>
                    <CTableDataCell>€{{ invoice.amount }}</CTableDataCell>
                    <CTableDataCell>{{ invoice.date }}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge :color="getStatusColor(invoice.status)">
                        {{ getStatusText(invoice.status) }}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton color="info" variant="outline">
                          <CIcon icon="cil-pencil" />
                        </CButton>
                        <CButton color="success" variant="outline">
                          <CIcon icon="cil-cloud-download" />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <!-- Quick Actions -->
      <CRow>
        <CCol :xs="12">
          <CCard>
            <CCardHeader>
              <strong>Rýchle akcie</strong>
            </CCardHeader>
            <CCardBody>
              <CButtonGroup>
                <CButton color="primary">
                  <CIcon icon="cil-plus" class="me-2" />
                  Nová faktúra
                </CButton>
                <CButton color="success" variant="outline">
                  <CIcon icon="cil-people" class="me-2" />
                  Nový klient
                </CButton>
                <CButton color="info" variant="outline">
                  <CIcon icon="cil-chart-pie" class="me-2" />
                  Reporty
                </CButton>
              </CButtonGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Sample data (neskôr nahradíme API callom)
const sampleInvoices = ref([
  {
    id: 1,
    number: 'INV-2024-001',
    client: 'ABC s.r.o.',
    amount: '1,250.00',
    date: '2024-01-15',
    status: 'paid'
  },
  {
    id: 2,
    number: 'INV-2024-002',
    client: 'XYZ spol. s r.o.',
    amount: '890.50',
    date: '2024-01-14',
    status: 'pending'
  },
  {
    id: 3,
    number: 'INV-2024-003',
    client: 'DEF company',
    amount: '2,100.00',
    date: '2024-01-13',
    status: 'overdue'
  }
])

const getStatusColor = (status) => {
  const colors = {
    'paid': 'success',
    'pending': 'warning',
    'overdue': 'danger',
    'draft': 'secondary'
  }
  return colors[status] || 'secondary'
}

const getStatusText = (status) => {
  const texts = {
    'paid': 'Zaplatené',
    'pending': 'Čaká na platbu',
    'overdue': 'Po splatnosti',
    'draft': 'Koncept'
  }
  return texts[status] || status
}

onMounted(() => {
  // Skontrolujeme autentifikáciu pri načítaní stránky
  authStore.checkAuth()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem 0;
}
</style>