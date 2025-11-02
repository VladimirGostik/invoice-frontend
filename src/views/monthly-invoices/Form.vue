<!-- src/views/monthly-invoices/Form.vue -->
<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard>
          <CCardHeader>
            <strong>{{ isEditMode ? 'Upraviť' : 'Pridať' }} mesačnú faktúru</strong>
          </CCardHeader>
          <CCardBody>
            <CAlert v-if="invoicesStore.errors.general" color="danger" :visible="true" dismissible>
              {{ invoicesStore.errors.general }}
            </CAlert>

            <!-- Loading indicator for initial data -->
            <div v-if="isLoadingInitialData" class="text-center py-5">
              <CSpinner color="primary" />
              <p class="mt-2">Načítavam dáta...</p>
            </div>

            <CForm v-else @submit.prevent="handleSubmit">
              <!-- Základné informácie -->
              <h5 class="mb-3">Základné informácie</h5>
              <CRow class="mb-4">
                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="invoice_name">Názov faktúry *</CFormLabel>
                    <CFormInput
                      id="invoice_name"
                      v-model="formData.invoice_name"
                      :invalid="!!invoicesStore.errors.invoice_name"
                      required
                    />
                    <CFormFeedback v-if="invoicesStore.errors.invoice_name" invalid>
                      {{ invoicesStore.errors.invoice_name[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="company_id">Hlavná firma *</CFormLabel>
                    <CFormSelect
                      id="company_id"
                      v-model="formData.company_id"
                      :invalid="!!invoicesStore.errors.company_id"
                      :disabled="companiesStore.isLoading"
                      required
                      @change="onCompanyChange"
                    >
                      <option value="">
                        {{ companiesStore.isLoading ? 'Načítavam...' : 'Vyberte firmu' }}
                      </option>
                      <option v-for="company in companiesStore.companies" :key="company.id" :value="company.id">
                        {{ company.name }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback v-if="invoicesStore.errors.company_id" invalid>
                      {{ invoicesStore.errors.company_id[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="residential_company_id">Bytový podnik</CFormLabel>
                    <CFormSelect
                      id="residential_company_id"
                      v-model="formData.residential_company_id"
                      :invalid="!!invoicesStore.errors.residential_company_id"
                      :disabled="residentialCompaniesStore.isLoading || isLoadingCompanyDetails"
                      @change="onResidentialCompanyChange"
                    >
                      <option value="">
                        {{ residentialCompaniesStore.isLoading ? 'Načítavam...' : isLoadingCompanyDetails ? 'Načítavam detaily...' : 'Vyberte bytový podnik' }}
                      </option>
                      <option v-for="company in residentialCompaniesStore.companies" :key="company.id" :value="company.id">
                        {{ company.name }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback v-if="invoicesStore.errors.residential_company_id" invalid>
                      {{ invoicesStore.errors.residential_company_id[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="street_id">Ulica</CFormLabel>
                    <CFormSelect
                      id="street_id"
                      v-model="formData.street_id"
                      :invalid="!!invoicesStore.errors.street_id"
                      :disabled="!formData.residential_company_id || isLoadingCompanyDetails"
                    >
                      <option value="">{{ isLoadingCompanyDetails ? 'Načítavam ulice...' : 'Vyberte ulicu' }}</option>
                      <option v-for="street in availableStreets" :key="street.id" :value="street.id">
                        {{ street.street_name }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback v-if="invoicesStore.errors.street_id" invalid>
                      {{ invoicesStore.errors.street_id[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>

                <CCol :md="12">
                  <div class="mb-3">
                    <CFormCheck 
                      id="is_complex_billing"
                      v-model="formData.is_complex_billing"
                      label="Komplexné fakturovanie"
                    />
                  </div>
                </CCol>
              </CRow>

              <!-- Údaje o zákazníkovi -->
              <h5 class="mb-3">Údaje o zákazníkovi</h5>
              <CRow class="mb-4">
                <!-- Additional info 1 & 2 - Show only if complex billing -->
                <template v-if="formData.is_complex_billing">
                  <CCol :md="6">
                    <div class="mb-3">
                      <CFormLabel for="additional_info_1">Dodatočná informácia 1</CFormLabel>
                      <CFormInput
                        id="additional_info_1"
                        v-model="formData.additional_info_1"
                        placeholder="Napr. Informácia o bytovom podniku..."
                      />
                    </div>
                  </CCol>

                  <CCol :md="6">
                    <div class="mb-3">
                      <CFormLabel for="additional_info_2">Dodatočná informácia 2</CFormLabel>
                      <CFormInput
                        id="additional_info_2"
                        v-model="formData.additional_info_2"
                        placeholder="Napr. Informácia o ulici..."
                      />
                    </div>
                  </CCol>
                </template>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="company_name">Názov firmy</CFormLabel>
                    <CFormInput
                      id="company_name"
                      v-model="formData.company_name"
                      :invalid="!!invoicesStore.errors.company_name"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="company_ico">IČO</CFormLabel>
                    <CFormInput
                      id="company_ico"
                      v-model="formData.company_ico"
                      :invalid="!!invoicesStore.errors.company_ico"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="company_dic">DIČ</CFormLabel>
                    <CFormInput
                      id="company_dic"
                      v-model="formData.company_dic"
                      :invalid="!!invoicesStore.errors.company_dic"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="company_ic_dph">IČ DPH</CFormLabel>
                    <CFormInput
                      id="company_ic_dph"
                      v-model="formData.company_ic_dph"
                      :invalid="!!invoicesStore.errors.company_ic_dph"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="company_address">Adresa</CFormLabel>
                    <CFormInput
                      id="company_address"
                      v-model="formData.company_address"
                      :invalid="!!invoicesStore.errors.company_address"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>

                <CCol :md="4">
                  <div class="mb-3">
                    <CFormLabel for="company_city">Mesto</CFormLabel>
                    <CFormInput
                      id="company_city"
                      v-model="formData.company_city"
                      :invalid="!!invoicesStore.errors.company_city"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>

                <CCol :md="2">
                  <div class="mb-3">
                    <CFormLabel for="company_zip">PSČ</CFormLabel>
                    <CFormInput
                      id="company_zip"
                      v-model="formData.company_zip"
                      :invalid="!!invoicesStore.errors.company_zip"
                      :disabled="isLoadingCompanyDetails"
                    />
                  </div>
                </CCol>
              </CRow>

              <!-- Položky faktúry -->
              <h5 class="mb-3">Položky faktúry *</h5>

              <!-- Poznámka k faktúre -->
              <div class="mb-4">
                <CFormLabel for="invoice_text">Poznámka k faktúre</CFormLabel>
                <CFormTextarea
                  id="invoice_text"
                  v-model="formData.invoice_text"
                  rows="3"
                  placeholder="Dodatočné poznámky alebo podmienky..."
                />
              </div>

              <!-- Text nad tabuľkou -->
              <div class="mb-3">
                <CFormLabel for="invoice_above_table_text">Text nad tabuľkou</CFormLabel>
                <CFormTextarea
                  id="invoice_above_table_text"
                  v-model="formData.invoice_above_table_text"
                  rows="2"
                  placeholder="Text, ktorý sa zobrazí nad tabuľkou s položkami..."
                />
              </div>

              <div class="mb-4">
                <CTable bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell style="width: 35%">Popis *</CTableHeaderCell>
                      <CTableHeaderCell style="width: 15%">Jednotka *</CTableHeaderCell>
                      <CTableHeaderCell style="width: 10%">Množstvo *</CTableHeaderCell>
                      <CTableHeaderCell style="width: 15%">Cena/jednotka *</CTableHeaderCell>
                      <CTableHeaderCell style="width: 15%">Spolu</CTableHeaderCell>
                      <CTableHeaderCell style="width: 10%">Akcie</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="(item, index) in formData.items" :key="index">
                      <CTableDataCell>
                        <CFormInput
                          v-model="item.description"
                          placeholder="Popis položky"
                          :invalid="!!invoicesStore.errors[`items.${index}.description`]"
                          required
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          v-model="item.unit"
                          :invalid="!!invoicesStore.errors[`items.${index}.unit`]"
                          required
                        >
                          <option value="ks">ks</option>
                          <option value="hod">hod</option>
                          <option value="m²">m²</option>
                          <option value="m³">m³</option>
                          <option value="m">m</option>
                          <option value="kg">kg</option>
                          <option value="l">l</option>
                          <option value="balenie">balenie</option>
                          <option value="súbor">súbor</option>
                          <option value="deň">deň</option>
                          <option value="mesiac">mesiac</option>
                          <option value="rok">rok</option>
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          v-model.number="item.quantity"
                          type="number"
                          step="0.01"
                          min="0"
                          :invalid="!!invoicesStore.errors[`items.${index}.quantity`]"
                          required
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          v-model.number="item.unit_price"
                          type="number"
                          step="0.01"
                          min="0"
                          :invalid="!!invoicesStore.errors[`items.${index}.unit_price`]"
                          required
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong>{{ formatCurrency((item.quantity || 0) * (item.unit_price || 0)) }}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          color="danger" 
                          size="sm"
                          variant="ghost"
                          @click="removeItem(index)"
                          :disabled="formData.items.length === 1"
                        >
                          <CIcon icon="cil-trash" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                
                <CButton color="success" variant="outline" size="sm" @click="addItem">
                  <CIcon icon="cil-plus" /> Pridať položku
                </CButton>
              </div>

              <CRow class="mb-4">
                <CCol :md="6" class="offset-md-6">
                  <CCard>
                    <CCardBody>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>{{ formatCurrency(formData.subtotal) }}</strong>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>DPH (20%):</span>
                        <CFormInput
                          v-model.number="formData.tax"
                          type="number"
                          step="0.01"
                          min="0"
                          size="sm"
                          style="width: 120px;"
                        />
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between">
                        <strong>Celkom:</strong>
                        <strong class="text-primary fs-5">{{ formatCurrency(formData.total) }}</strong>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <!-- Info o DPH -->
              <div class="mb-4">
                <CFormLabel for="info_dph">Info o DPH</CFormLabel>
                <CFormTextarea
                  id="info_dph"
                  v-model="formData.info_dph"
                  rows="2"
                  placeholder="Informácie o DPH, registrácii, oslobodení..."
                />
              </div>

              <div class="d-flex justify-content-between">
                <CButton color="secondary" @click="$router.back()">
                  Zrušiť
                </CButton>
                <CButton color="primary" type="submit" :disabled="invoicesStore.isLoading">
                  <CSpinner v-if="invoicesStore.isLoading" size="sm" class="me-2" />
                  {{ isEditMode ? 'Uložiť zmeny' : 'Vytvoriť faktúru' }}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMonthlyInvoicesStore } from '@/stores/monthlyInvoices'
import { useCompaniesStore } from '@/stores/companies'
import { useResidentialCompaniesStore } from '@/stores/residentialCompanies'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const router = useRouter()
const invoicesStore = useMonthlyInvoicesStore()
const companiesStore = useCompaniesStore()
const residentialCompaniesStore = useResidentialCompaniesStore()

const isEditMode = computed(() => !!route.params.id)
const isLoadingInitialData = ref(true)
const isLoadingCompanyDetails = ref(false)

// Helper function for currency formatting
const formatCurrency = (value) => {
  if (!value) return '0,00 €'
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const formData = ref({
  invoice_name: '',
  company_id: '',
  residential_company_id: '',
  street_id: '',
  items: [
    {
      description: '',
      unit: 'ks',
      quantity: 1,
      unit_price: 0
    }
  ],
  subtotal: 0,
  tax: 0,
  total: 0,
  company_name: '',
  company_city: '',
  company_state: 'Slovensko',
  company_address: '',
  company_zip: '',
  company_ico: '',
  company_dic: '',
  company_ic_dph: '',
  invoice_text: '',
  invoice_above_table_text: '',
  is_complex_billing: false,
  additional_info_1: '',
  additional_info_2: '',
  info_dph: ''
})

const availableStreets = computed(() => {
  const company = residentialCompaniesStore.currentCompany
  return company?.streets || []
})

// Watch items deeply and recalculate subtotal and total
watch(() => formData.value.items, () => {
  const subtotal = formData.value.items.reduce((sum, item) => {
    return sum + ((item.quantity || 0) * (item.unit_price || 0))
  }, 0)
  formData.value.subtotal = subtotal
  formData.value.total = subtotal + (formData.value.tax || 0)
}, { deep: true })

// Watch tax and recalculate total
watch(() => formData.value.tax, (newTax) => {
  formData.value.total = formData.value.subtotal + (newTax || 0)
})

const addItem = () => {
  formData.value.items.push({
    description: '',
    unit: 'ks',
    quantity: 1,
    unit_price: 0
  })
}

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
  }
}

const onCompanyChange = () => {
  // Optionally load company data and pre-fill customer info from main company
}

const onResidentialCompanyChange = async (event) => {
  // Get the selected value from the event
  const selectedId = event.target.value
  
  // Reset street when residential company changes
  formData.value.street_id = ''
  
  // Clear customer info first
  formData.value.company_name = ''
  formData.value.company_city = ''
  formData.value.company_state = 'Slovensko'
  formData.value.company_address = ''
  formData.value.company_zip = ''
  formData.value.company_ico = ''
  formData.value.company_dic = ''
  formData.value.company_ic_dph = ''
  
  // If company selected, fetch its details
  if (selectedId) {
    isLoadingCompanyDetails.value = true
    
    try {
      const result = await residentialCompaniesStore.fetchCompany(selectedId)
      
      if (result.success && result.data) {
        const company = result.data
        
        // Auto-fill customer info from loaded company data
        formData.value.company_name = company.company_name || ''
        formData.value.company_city = company.company_city || ''
        formData.value.company_state = company.company_state || 'Slovensko'
        formData.value.company_address = company.company_address || ''
        formData.value.company_zip = company.company_zip || ''
        formData.value.company_ico = company.company_ico || ''
        formData.value.company_dic = company.company_dic || ''
        formData.value.company_ic_dph = company.company_ic_dph || ''
      }
    } catch (error) {
      console.error('Error loading company details:', error)
    } finally {
      isLoadingCompanyDetails.value = false
    }
  }
}

const handleSubmit = async () => {
  invoicesStore.clearErrors()
  
  // Prepare submitData - only include non-empty optional fields
  const submitData = {
    invoice_name: formData.value.invoice_name,
    company_id: formData.value.company_id,
    subtotal: formData.value.subtotal,
    tax: formData.value.tax,
    total: formData.value.total,
    is_complex_billing: formData.value.is_complex_billing ? true : false,  // ✅ Explicitne boolean
    items: formData.value.items.map(item => ({
      description: item.description,
      unit: item.unit,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      line_total: Number(item.quantity) * Number(item.unit_price)
    }))
  }
  
  // ✅ Add optional fields only if they have values
  if (formData.value.residential_company_id) {
    submitData.residential_company_id = formData.value.residential_company_id
  }
  
  if (formData.value.street_id) {
    submitData.street_id = formData.value.street_id
  }
  
  if (formData.value.company_name) {
    submitData.company_name = formData.value.company_name
  }
  
  if (formData.value.company_city) {
    submitData.company_city = formData.value.company_city
  }
  
  if (formData.value.company_state) {
    submitData.company_state = formData.value.company_state
  }
  
  if (formData.value.company_address) {
    submitData.company_address = formData.value.company_address
  }
  
  if (formData.value.company_zip) {
    submitData.company_zip = formData.value.company_zip
  }
  
  if (formData.value.company_ico) {
    submitData.company_ico = formData.value.company_ico
  }
  
  if (formData.value.company_dic) {
    submitData.company_dic = formData.value.company_dic
  }
  
  if (formData.value.company_ic_dph) {
    submitData.company_ic_dph = formData.value.company_ic_dph
  }
  
  if (formData.value.invoice_text) {
    submitData.invoice_text = formData.value.invoice_text
  }
  
  if (formData.value.invoice_above_table_text) {
    submitData.invoice_above_table_text = formData.value.invoice_above_table_text
  }
  
  // ✅ Add additional_info only if complex billing is true
  if (formData.value.is_complex_billing) {
    if (formData.value.additional_info_1) {
      submitData.additional_info_1 = formData.value.additional_info_1
    }
    if (formData.value.additional_info_2) {
      submitData.additional_info_2 = formData.value.additional_info_2
    }
  }
  
  if (formData.value.info_dph) {
    submitData.info_dph = formData.value.info_dph
  }
  
  console.log('📤 Submitting data:', submitData)  // Debug log
  
  const result = isEditMode.value
    ? await invoicesStore.updateInvoice(route.params.id, submitData)
    : await invoicesStore.createInvoice(submitData)
  
  if (result.success) {
    alert(isEditMode.value ? 'Mesačná faktúra bola úspešne aktualizovaná!' : 'Mesačná faktúra bola úspešne vytvorená!')
    router.push('/monthly-invoices')
  }
}

onMounted(async () => {
  isLoadingInitialData.value = true
  
  try {
    // Load companies and residential companies for selects
    await Promise.all([
      companiesStore.fetchCompanies(1, {}, 100),
      residentialCompaniesStore.fetchCompanies(1, {}, 100)
    ])
    
    // If edit mode, load invoice data
    if (isEditMode.value) {
      const result = await invoicesStore.fetchInvoice(route.params.id)
      if (result.success) {
        const invoice = result.data
        
        const items = invoice.items && invoice.items.length > 0 
          ? invoice.items.map(item => ({
              description: item.description || '',
              unit: item.unit || 'ks',
              quantity: Number(item.quantity) || 1,
              unit_price: Number(item.unit_price) || 0
            }))
          : [{
              description: '',
              unit: 'ks',
              quantity: 1,
              unit_price: 0
            }]
        
        formData.value = {
          invoice_name: invoice.invoice_name || '',
          company_id: invoice.company_id || '',
          residential_company_id: invoice.residential_company_id || '',
          street_id: invoice.street_id || '',
          items: items,
          subtotal: Number(invoice.subtotal) || 0,
          tax: Number(invoice.tax) || 0,
          total: Number(invoice.total) || 0,
          company_name: invoice.company_name || '',
          company_city: invoice.company_city || '',
          company_state: invoice.company_state || 'Slovensko',
          company_address: invoice.company_address || '',
          company_zip: invoice.company_zip || '',
          company_ico: invoice.company_ico || '',
          company_dic: invoice.company_dic || '',
          company_ic_dph: invoice.company_ic_dph || '',
          invoice_text: invoice.invoice_text || '',
          invoice_above_table_text: invoice.invoice_above_table_text || '',
          is_complex_billing: invoice.is_complex_billing === true || invoice.is_complex_billing === 1,  // ✅ Handle both boolean and int
          additional_info_1: invoice.additional_info_1 || '',
          additional_info_2: invoice.additional_info_2 || '',
          info_dph: invoice.info_dph || ''
        }
        
        // If residential company is set, load its details to get streets
        if (formData.value.residential_company_id) {
          await residentialCompaniesStore.fetchCompany(formData.value.residential_company_id)
        }
      }
    }
  } finally {
    isLoadingInitialData.value = false
  }
})
</script>
