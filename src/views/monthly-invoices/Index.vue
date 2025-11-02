<!-- src/views/monthly-invoices/Index.vue -->
<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader class="d-flex justify-content-between align-items-center">
            <strong>Mesačné faktúry (Drafty)</strong>
            <CButton color="primary" @click="$router.push('/monthly-invoices/create')">
              <CIcon icon="cil-plus" /> Pridať mesačnú faktúru
            </CButton>
          </CCardHeader>
          <CCardBody>
            <!-- Filters -->
            <CRow class="mb-3">
              <CCol :md="3">
                <CFormInput
                  v-model="filters.invoice_name"
                  placeholder="Hľadať podľa názvu..."
                />
                <small v-if="isSearching" class="text-muted mt-1 d-block">
                  <CSpinner size="sm" class="me-1" /> Vyhľadávám...
                </small>
              </CCol>
              <CCol :md="2">
                <CFormSelect
                  v-model="filters.company_id"
                >
                  <option value="">Všetky hlavné firmy</option>
                  <option v-for="company in companiesStore.companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </option>
                </CFormSelect>
              </CCol>
              <CCol :md="2">
                <CFormSelect
                  v-model="filters.residential_company_id"
                >
                  <option value="">Všetky bytové podniky</option>
                  <option v-for="company in residentialCompaniesStore.companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </option>
                </CFormSelect>
              </CCol>
              <CCol :md="2">
                <CFormSelect
                  v-model="filters.street_id"
                  :disabled="!filters.residential_company_id"
                >
                  <option value="">Všetky ulice</option>
                  <option v-for="street in streetOptions" :key="street.value" :value="street.value">
                    {{ street.label }}
                  </option>
                </CFormSelect>
              </CCol>
              <CCol :md="2">
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon="cil-list" size="sm" />
                  </CInputGroupText>
                  <CFormSelect
                    v-model="perPage"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </CFormSelect>
                  <CInputGroupText class="text-muted" style="font-size: 0.875rem;">
                    / strana
                  </CInputGroupText>
                </CInputGroup>
              </CCol>
              <CCol :md="1" class="d-flex align-items-start">
                <CButton 
                  v-if="hasActiveFilters"
                  color="secondary" 
                  variant="ghost"
                  @click="clearFilters"
                  title="Vyčistiť filtre"
                >
                  <CIcon icon="cil-x" />
                </CButton>
              </CCol>
            </CRow>

            <!-- Loading -->
            <div v-if="invoicesStore.isLoading" class="text-center py-4">
              <CSpinner color="primary" />
              <p class="mt-2">Načítavam mesačné faktúry...</p>
            </div>
            
            <!-- Error -->
            <CAlert 
              v-else-if="invoicesStore.errors.general"
              color="danger"
              :visible="true"
              dismissible
              @close="invoicesStore.clearErrors"
            >
              {{ invoicesStore.errors.general }}
            </CAlert>
            
            <!-- Table -->
            <CTable hover responsive v-else-if="invoicesStore.invoices.length > 0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell @click="handleSort('invoice_name')" style="cursor: pointer;">
                    Názov faktúry
                    <CIcon v-if="sort.field === 'invoice_name'" :icon="sort.direction === 'asc' ? 'cil-arrow-top' : 'cil-arrow-bottom'" size="sm" />
                  </CTableHeaderCell>
                  <CTableHeaderCell @click="handleSort('company_name')" style="cursor: pointer;">
                    Hlavná firma
                    <CIcon v-if="sort.field === 'company_name'" :icon="sort.direction === 'asc' ? 'cil-arrow-top' : 'cil-arrow-bottom'" size="sm" />
                  </CTableHeaderCell>
                  <CTableHeaderCell @click="handleSort('residential_company_id')" style="cursor: pointer;">
                    Bytový podnik
                    <CIcon v-if="sort.field === 'residential_company_id'" :icon="sort.direction === 'asc' ? 'cil-arrow-top' : 'cil-arrow-bottom'" size="sm" />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Ulica</CTableHeaderCell>
                  <CTableHeaderCell @click="handleSort('total')" style="cursor: pointer;" class="text-end">
                    Celková suma
                    <CIcon v-if="sort.field === 'total'" :icon="sort.direction === 'asc' ? 'cil-arrow-top' : 'cil-arrow-bottom'" size="sm" />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Akcie</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="invoice in invoicesStore.invoices" :key="invoice.id">
                  <CTableDataCell>
                    <strong>{{ invoice.invoice_name }}</strong>
                    <br>
                    <small class="text-muted">ID: {{ invoice.id }}</small>
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ invoice.main_company_name }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ invoice.company_name }}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">
                      {{ invoice.street_name }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell class="text-end">
                    <strong>{{ formatCurrency(invoice.total) }}</strong>
                    <br>
                    <small class="text-muted">Subtotal: {{ formatCurrency(invoice.subtotal) }}</small>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButtonGroup size="sm">
                      <CButton 
                        color="info" 
                        variant="outline"
                        @click="$router.push(`/monthly-invoices/${invoice.id}/edit`)"
                      >
                        <CIcon icon="cil-pencil" /> Upraviť
                      </CButton>
                      <CButton 
                        color="danger" 
                        variant="outline"
                        @click="handleDelete(invoice)"
                      >
                        <CIcon icon="cil-trash" /> Zmazať
                      </CButton>
                    </CButtonGroup>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <!-- Pagination -->
            <div v-if="invoicesStore.pagination.lastPage > 1" class="mt-3 d-flex justify-content-between align-items-center">
              <div class="text-muted">
                Zobrazujem {{ invoicesStore.pagination.from }} - {{ invoicesStore.pagination.to }} 
                z {{ invoicesStore.pagination.total }} záznamov
              </div>
              <CPagination>
                <CPaginationItem 
                  :disabled="invoicesStore.pagination.currentPage === 1"
                  @click="loadPage(invoicesStore.pagination.currentPage - 1)"
                >
                  Predošlá
                </CPaginationItem>
                
                <CPaginationItem 
                  v-for="page in visiblePages" 
                  :key="page"
                  :active="page === invoicesStore.pagination.currentPage"
                  @click="loadPage(page)"
                >
                  {{ page }}
                </CPaginationItem>
                
                <CPaginationItem 
                  :disabled="invoicesStore.pagination.currentPage === invoicesStore.pagination.lastPage"
                  @click="loadPage(invoicesStore.pagination.currentPage + 1)"
                >
                  Ďalšia
                </CPaginationItem>
              </CPagination>
            </div>
            
            <!-- Empty state -->
            <div v-else-if="!invoicesStore.isLoading && invoicesStore.invoices.length === 0" class="text-center py-4">
              <CIcon icon="cil-file" size="3xl" class="text-muted mb-3" />
              <h5>Žiadne mesačné faktúry</h5>
              <p class="text-muted">
                {{ hasActiveFilters ? 'Nenašli sa žiadne výsledky pre váš filter.' : 'Zatiaľ nemáte žiadne mesačné faktúry v systéme.' }}
              </p>
              <CButton 
                v-if="!hasActiveFilters"
                color="primary" 
                @click="$router.push('/monthly-invoices/create')"
              >
                Pridať prvú mesačnú faktúru
              </CButton>
              <CButton 
                v-else
                color="secondary" 
                variant="outline"
                @click="clearFilters"
              >
                Vyčistiť filtre
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMonthlyInvoicesStore } from '@/stores/monthlyInvoices'
import { useCompaniesStore } from '@/stores/companies'
import { useResidentialCompaniesStore } from '@/stores/residentialCompanies'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const invoicesStore = useMonthlyInvoicesStore()
const companiesStore = useCompaniesStore()
const residentialCompaniesStore = useResidentialCompaniesStore()

// Helper function for currency formatting
const formatCurrency = (value) => {
  if (!value) return '0,00 €'
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const filters = ref({
  invoice_name: '',
  company_id: '',
  residential_company_id: '',
  street_id: ''
})

const sort = ref({
  field: null,
  direction: 'asc'
})

const perPage = ref('10')
const isSearching = ref(false)
let searchTimeout = null

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.invoice_name || 
         filters.value.company_id || 
         filters.value.residential_company_id || 
         filters.value.street_id
})

const streetOptions = computed(() => {
  if (!filters.value.residential_company_id) return []
  
  const company = residentialCompaniesStore.companies.find(
    c => c.id == filters.value.residential_company_id
  )
  
  return company?.streets?.map(s => ({
    value: s.id,
    label: s.street_name
  })) || []
})

// Pagination - show max 5 pages at a time
const visiblePages = computed(() => {
  const current = invoicesStore.pagination.currentPage
  const last = invoicesStore.pagination.lastPage
  const delta = 2
  const pages = []
  
  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch for invoice_name changes with debounce
watch(() => filters.value.invoice_name, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
  
  isSearching.value = true
  
  searchTimeout = setTimeout(async () => {
    isSearching.value = false
    await loadInvoices()
  }, 500)
})

// Watch for other filter changes (instant search)
watch(() => filters.value.company_id, () => loadInvoices())
watch(() => filters.value.residential_company_id, () => {
  // Reset street filter when residential company changes
  filters.value.street_id = ''
  loadInvoices()
})
watch(() => filters.value.street_id, () => loadInvoices())

// ✅ Watch for perPage changes (instant reload)
watch(() => perPage.value, () => {
  console.log('📊 Per page changed to:', perPage.value)
  loadInvoices()
})

const loadInvoices = async () => {
  const activeFilters = {}
  
  // Only add non-empty filters
  if (filters.value.invoice_name) activeFilters.invoice_name = filters.value.invoice_name
  if (filters.value.company_id) activeFilters.company_id = filters.value.company_id
  if (filters.value.residential_company_id) activeFilters.residential_company_id = filters.value.residential_company_id
  if (filters.value.street_id) activeFilters.street_id = filters.value.street_id
  
  await invoicesStore.fetchInvoices(1, activeFilters, sort.value.field ? sort.value : null, parseInt(perPage.value))
}

const loadPage = async (page) => {
  const activeFilters = {}
  
  if (filters.value.invoice_name) activeFilters.invoice_name = filters.value.invoice_name
  if (filters.value.company_id) activeFilters.company_id = filters.value.company_id
  if (filters.value.residential_company_id) activeFilters.residential_company_id = filters.value.residential_company_id
  if (filters.value.street_id) activeFilters.street_id = filters.value.street_id
  
  await invoicesStore.fetchInvoices(page, activeFilters, sort.value.field ? sort.value : null, parseInt(perPage.value))
}

const handleSort = (field) => {
  if (sort.value.field === field) {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.field = field
    sort.value.direction = 'asc'
  }
  loadInvoices()
}

const clearFilters = () => {
  filters.value = {
    invoice_name: '',
    company_id: '',
    residential_company_id: '',
    street_id: ''
  }
  sort.value = {
    field: null,
    direction: 'asc'
  }
  loadInvoices()
}

const handleDelete = async (invoice) => {
  if (confirm(`Naozaj chcete vymazať mesačnú faktúru "${invoice.invoice_name}"?`)) {
    const result = await invoicesStore.deleteInvoice(invoice.id)
    if (result.success) {
      const activeFilters = {}
      if (filters.value.invoice_name) activeFilters.invoice_name = filters.value.invoice_name
      if (filters.value.company_id) activeFilters.company_id = filters.value.company_id
      if (filters.value.residential_company_id) activeFilters.residential_company_id = filters.value.residential_company_id
      if (filters.value.street_id) activeFilters.street_id = filters.value.street_id
      
      await invoicesStore.fetchInvoices(invoicesStore.pagination.currentPage, activeFilters, sort.value.field ? sort.value : null, parseInt(perPage.value))
    }
  }
}

onMounted(async () => {
  // Load companies and residential companies for filters
  await Promise.all([
    companiesStore.fetchCompanies(1, {}, 100), // Load all companies
    residentialCompaniesStore.fetchCompanies(1, {})
  ])
  
  // Load invoices
  await invoicesStore.fetchInvoices(1, {}, null, parseInt(perPage.value))
})
</script>
