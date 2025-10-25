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

            <CForm @submit.prevent="handleSubmit">
              <CRow>
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
                      required
                    >
                      <option value="">Vyberte firmu</option>
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
                    <CFormLabel for="residential_company_id">Bytový podnik *</CFormLabel>
                    <CFormSelect
                      id="residential_company_id"
                      v-model="formData.residential_company_id"
                      :invalid="!!invoicesStore.errors.residential_company_id"
                      required
                      @change="onResidentialCompanyChange"
                    >
                      <option value="">Vyberte bytový podnik</option>
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
                    <CFormLabel for="street_id">Ulica *</CFormLabel>
                    <CFormSelect
                      id="street_id"
                      v-model="formData.street_id"
                      :invalid="!!invoicesStore.errors.street_id"
                      :disabled="!formData.residential_company_id"
                      required
                    >
                      <option value="">Vyberte ulicu</option>
                      <option v-for="street in availableStreets" :key="street.id" :value="street.id">
                        {{ street.street_name }}
                      </option>
                    </CFormSelect>
                    <CFormFeedback v-if="invoicesStore.errors.street_id" invalid>
                      {{ invoicesStore.errors.street_id[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="subtotal">Subtotal *</CFormLabel>
                    <CFormInput
                      id="subtotal"
                      v-model="formData.subtotal"
                      type="number"
                      step="0.01"
                      :invalid="!!invoicesStore.errors.subtotal"
                      required
                    />
                    <CFormFeedback v-if="invoicesStore.errors.subtotal" invalid>
                      {{ invoicesStore.errors.subtotal[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>

                <CCol :md="6">
                  <div class="mb-3">
                    <CFormLabel for="total">Celková suma *</CFormLabel>
                    <CFormInput
                      id="total"
                      v-model="formData.total"
                      type="number"
                      step="0.01"
                      :invalid="!!invoicesStore.errors.total"
                      required
                    />
                    <CFormFeedback v-if="invoicesStore.errors.total" invalid>
                      {{ invoicesStore.errors.total[0] }}
                    </CFormFeedback>
                  </div>
                </CCol>
              </CRow>

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
import { ref, computed, onMounted } from 'vue'
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

const formData = ref({
  invoice_name: '',
  company_id: '',
  residential_company_id: '',
  street_id: '',
  subtotal: '',
  total: '',
  type: 'monthly'
})

const availableStreets = computed(() => {
  if (!formData.value.residential_company_id) return []
  
  const company = residentialCompaniesStore.companies.find(
    c => c.id == formData.value.residential_company_id
  )
  
  return company?.streets || []
})

const onResidentialCompanyChange = () => {
  // Reset street when residential company changes
  formData.value.street_id = ''
}

const handleSubmit = async () => {
  invoicesStore.clearErrors()
  
  const result = isEditMode.value
    ? await invoicesStore.updateInvoice(route.params.id, formData.value)
    : await invoicesStore.createInvoice(formData.value)
  
  if (result.success) {
    alert(isEditMode.value ? 'Mesačná faktúra bola úspešne aktualizovaná!' : 'Mesačná faktúra bola úspešne vytvorená!')
    router.push('/monthly-invoices')
  }
}

onMounted(async () => {
  // Load companies and residential companies for selects
  await Promise.all([
    companiesStore.fetchCompanies(1, {}, 100), // Load all companies
    residentialCompaniesStore.fetchCompanies(1, {}, 100) // Load all residential companies
  ])
  
  // If edit mode, load invoice data
  if (isEditMode.value) {
    const result = await invoicesStore.fetchInvoice(route.params.id)
    if (result.success) {
      const invoice = result.data
      formData.value = {
        invoice_name: invoice.invoice_name,
        company_id: invoice.company_id,
        residential_company_id: invoice.residential_company_id,
        street_id: invoice.street_id,
        subtotal: invoice.subtotal,
        total: invoice.total,
        type: invoice.type
      }
    }
  }
})
</script>
