<!-- src/views/companies/Form.vue -->
<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard>
          <CCardHeader class="d-flex align-items-center">
            <CButton 
              color="link" 
              class="text-decoration-none p-0 me-3"
              @click="$router.push('/companies')"
            >
              <CIcon icon="cil-arrow-left" size="lg" />
            </CButton>
            <strong>{{ isEdit ? 'Upraviť firmu' : 'Nová firma' }}</strong>
          </CCardHeader>
          <CCardBody>
            <!-- Success Alert -->
            <CAlert 
              v-if="successMessage"
              color="success"
              :visible="true"
              dismissible
              @close="successMessage = ''"
            >
              {{ successMessage }}
            </CAlert>

            <!-- Error Alert -->
            <CAlert 
              v-if="companiesStore.errors.general"
              color="danger"
              :visible="true"
              dismissible
              @close="companiesStore.clearErrors"
            >
              {{ companiesStore.errors.general }}
            </CAlert>

            <!-- Customization Error Alert -->
            <CAlert 
              v-if="customizationErrors.general"
              color="warning"
              :visible="true"
              dismissible
              @close="customizationErrors.general = ''"
            >
              {{ customizationErrors.general }}
            </CAlert>

            <CForm @submit.prevent="handleSubmit">
              <!-- Základné informácie -->
              <h5 class="mb-3">Základné informácie</h5>
              
              <CRow class="mb-3">
                <CCol :md="12">
                  <CFormLabel>Názov firmy *</CFormLabel>
                  <CFormInput
                    v-model="form.company_name"
                    :invalid="!!companiesStore.errors.company_name"
                    required
                  />
                  <CFormFeedback v-if="companiesStore.errors.company_name" invalid>
                    {{ companiesStore.errors.company_name[0] }}
                  </CFormFeedback>
                </CCol>
              </CRow>

              <CRow class="mb-3">
                <CCol :md="6">
                  <CFormLabel>IČO *</CFormLabel>
                  <CFormInput
                    v-model="form.company_ico"
                    :invalid="!!companiesStore.errors.company_ico"
                    required
                  />
                  <CFormFeedback v-if="companiesStore.errors.company_ico" invalid>
                    {{ companiesStore.errors.company_ico[0] }}
                  </CFormFeedback>
                </CCol>
                
                <CCol :md="6">
                  <CFormLabel>DIČ *</CFormLabel>
                  <CFormInput
                    v-model="form.company_dic"
                    :invalid="!!companiesStore.errors.company_dic"
                    required
                  />
                  <CFormFeedback v-if="companiesStore.errors.company_dic" invalid>
                    {{ companiesStore.errors.company_dic[0] }}
                  </CFormFeedback>
                </CCol>
              </CRow>

              <CRow class="mb-3">
                <CCol :md="12">
                  <CFormLabel>IČ DPH</CFormLabel>
                  <CFormInput
                    v-model="form.company_ic_dph"
                    :invalid="!!companiesStore.errors.company_ic_dph"
                  />
                </CCol>
              </CRow>

              <!-- Adresa -->
              <h5 class="mb-3 mt-4">Adresa</h5>
              
              <CRow class="mb-3">
                <CCol :md="12">
                  <CFormLabel>Ulica a číslo *</CFormLabel>
                  <CFormInput
                    v-model="form.company_address"
                    :invalid="!!companiesStore.errors.company_address"
                    required
                  />
                </CCol>
              </CRow>

              <CRow class="mb-3">
                <CCol :md="6">
                  <CFormLabel>Mesto *</CFormLabel>
                  <CFormInput
                    v-model="form.company_city"
                    :invalid="!!companiesStore.errors.company_city"
                    required
                  />
                </CCol>
                
                <CCol :md="3">
                  <CFormLabel>PSČ *</CFormLabel>
                  <CFormInput
                    v-model="form.company_zip"
                    :invalid="!!companiesStore.errors.company_zip"
                    required
                  />
                </CCol>
                
                <CCol :md="3">
                  <CFormLabel>Štát *</CFormLabel>
                  <CFormInput
                    v-model="form.company_state"
                    :invalid="!!companiesStore.errors.company_state"
                    required
                  />
                </CCol>
              </CRow>

              <!-- Bankové údaje -->
              <h5 class="mb-3 mt-4">Bankové údaje</h5>
              
              <CRow class="mb-3">
                <CCol :md="8">
                  <CFormLabel>Bankový účet (IBAN) *</CFormLabel>
                  <CFormInput
                    v-model="form.company_bank_account"
                    :invalid="!!companiesStore.errors.company_bank_account"
                    placeholder="SK0202000000005047157358"
                    required
                  />
                </CCol>
                
                <CCol :md="4">
                  <CFormLabel>SWIFT/BIC</CFormLabel>
                  <CFormInput
                    v-model="form.company_bank_swift"
                    :invalid="!!companiesStore.errors.company_bank_swift"
                    placeholder="VUB"
                  />
                </CCol>
              </CRow>

              <!-- Customization - len pri editácii -->
              <template v-if="isEdit">
                <h5 class="mb-3 mt-4">Kontaktné údaje vystaviteľa faktúr</h5>
                
                <CRow class="mb-3">
                  <CCol :md="12">
                    <CFormLabel>Meno vystaviteľa</CFormLabel>
                    <CFormInput
                      v-model="customization.invoice_issuer_name"
                      :invalid="!!customizationErrors.invoice_issuer_name"
                    />
                  </CCol>
                </CRow>

                <CRow class="mb-3">
                  <CCol :md="6">
                    <CFormLabel>Email vystaviteľa</CFormLabel>
                    <CFormInput
                      v-model="customization.invoice_issuer_email"
                      type="email"
                      :invalid="!!customizationErrors.invoice_issuer_email"
                    />
                  </CCol>
                  
                  <CCol :md="6">
                    <CFormLabel>Telefón vystaviteľa</CFormLabel>
                    <CFormInput
                      v-model="customization.invoice_issuer_phone"
                      :invalid="!!customizationErrors.invoice_issuer_phone"
                    />
                  </CCol>
                </CRow>

                <!-- Podpis -->
                <h5 class="mb-3 mt-4">Podpis</h5>
                
                <CRow class="mb-3">
                  <CCol :md="12">
                    <CFormLabel>Nahrať podpis (obrázok)</CFormLabel>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      @change="handleSignatureUpload"
                      :invalid="!!customizationErrors.signatures"
                    />
                    <small class="text-muted">Podporované formáty: JPG, PNG, GIF</small>
                    <CFormFeedback v-if="customizationErrors.signatures" invalid>
                      {{ customizationErrors.signatures }}
                    </CFormFeedback>
                  </CCol>
                </CRow>

                <!-- Preview existujúceho podpisu -->
                <CRow v-if="currentSignatureUrl" class="mb-3">
                  <CCol :md="12">
                    <CFormLabel>Aktuálny podpis:</CFormLabel>
                    <div class="signature-preview">
                      <img :src="currentSignatureUrl" alt="Podpis" style="max-width: 300px; border: 1px solid #ddd; padding: 10px;" />
                    </div>
                  </CCol>
                </CRow>
              </template>

              <!-- Buttons -->
              <div class="d-flex justify-content-end gap-2 mt-4">
                <CButton 
                  color="secondary" 
                  variant="outline"
                  @click="$router.push('/companies')"
                  :disabled="companiesStore.isLoading || isUploadingCustomization"
                >
                  Zrušiť
                </CButton>
                <CButton 
                  color="primary" 
                  type="submit"
                  :disabled="companiesStore.isLoading || isUploadingCustomization"
                >
                  <CSpinner v-if="companiesStore.isLoading || isUploadingCustomization" size="sm" class="me-2" />
                  {{ isEdit ? 'Uložiť zmeny' : 'Vytvoriť firmu' }}
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompaniesStore } from '@/stores/companies'
import AppLayout from '@/components/layout/AppLayout.vue'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const companiesStore = useCompaniesStore()

const isEdit = computed(() => !!route.params.id)
const isUploadingCustomization = ref(false)
const customizationErrors = ref({})
const currentSignatureUrl = ref(null)
const successMessage = ref('')

// Základný form pre vytvorenie/editáciu firmy
const form = ref({
  company_name: '',
  company_city: '',
  company_state: '',
  company_address: '',
  company_zip: '',
  company_ico: '',
  company_dic: '',
  company_ic_dph: '',
  company_bank_account: '',
  company_bank_swift: ''
})

// Customization data - len pre edit
const customization = ref({
  invoice_issuer_name: '',
  invoice_issuer_email: '',
  invoice_issuer_phone: ''
})

const signatureFile = ref(null)

const handleSignatureUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    signatureFile.value = file
  }
}

const loadCompanyData = async () => {
  if (!isEdit.value) return
  
  const result = await companiesStore.fetchCompany(route.params.id)
  if (result.success) {
    const company = companiesStore.currentCompany
    
    // Naplň základný form
    form.value = {
      company_name: company.company_name,
      company_city: company.company_city,
      company_state: company.company_state,
      company_address: company.company_address,
      company_zip: company.company_zip,
      company_ico: company.company_ico,
      company_dic: company.company_dic,
      company_ic_dph: company.company_ic_dph,
      company_bank_account: company.company_bank_account,
      company_bank_swift: company.company_bank_swift
    }
    
    // Naplň customization form
    customization.value = {
      invoice_issuer_name: company.invoice_issuer_name || '',
      invoice_issuer_email: company.invoice_issuer_email || '',
      invoice_issuer_phone: company.invoice_issuer_phone || ''
    }
    
    // Ak existuje signature, zobraz ju
    if (company.signatures) {
      currentSignatureUrl.value = company.signatures
    }
  }
}

const updateCustomization = async (companyId) => {
  if (!isEdit.value) return { success: true }
  
  isUploadingCustomization.value = true
  customizationErrors.value = {}
  
  try {
    const formData = new FormData()
    
    // Pridaj customization data
    if (customization.value.invoice_issuer_name) {
      formData.append('invoice_issuer_name', customization.value.invoice_issuer_name)
    }
    if (customization.value.invoice_issuer_email) {
      formData.append('invoice_issuer_email', customization.value.invoice_issuer_email)
    }
    if (customization.value.invoice_issuer_phone) {
      formData.append('invoice_issuer_phone', customization.value.invoice_issuer_phone)
    }
    
    // Pridaj signature ak bola nahraná
    if (signatureFile.value) {
      formData.append('signatures', signatureFile.value)
      formData.append('_method', 'put')
    }
    
    // Volaj customization endpoint
    await api.post(`/api/companies/${companyId}/customization`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('❌ Error updating customization:', error)
    customizationErrors.value = error.response?.data?.errors || {}
    customizationErrors.value.general = error.response?.data?.message || 'Nepodarilo sa aktualizovať customizáciu'
    return { 
      success: false, 
      message: customizationErrors.value.general
    }
  } finally {
    isUploadingCustomization.value = false
  }
}

const handleSubmit = async () => {
  companiesStore.clearErrors()
  successMessage.value = ''
  customizationErrors.value = {}
  
  let result
  if (isEdit.value) {
    // Editácia - najprv aktualizuj základné údaje
    result = await companiesStore.updateCompany(route.params.id, form.value)
    
    // Potom aktualizuj customization ak bola editácia úspešná
    if (result.success) {
      const customizationResult = await updateCustomization(route.params.id)
      
      if (customizationResult.success) {
        successMessage.value = '✅ Firma bola úspešne aktualizovaná!'
        // Reload data pre zobrazenie updated signatures
        await loadCompanyData()
        // Reset file input
        signatureFile.value = null
      } else {
        successMessage.value = '⚠️ Základné údaje boli uložené, ale vyskytla sa chyba pri ukladaní kontaktných údajov.'
      }
      
      // Scroll na vrch pre zobrazenie správy
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else {
    // Vytvorenie - len základné údaje
    result = await companiesStore.createCompany(form.value)
    
    if (result.success) {
      // Pri vytvorení presmeruj na edit tejto firmy
      const newCompanyId = result.data.data?.id || result.data.id
      if (newCompanyId) {
        router.push(`/companies/${newCompanyId}/edit`)
        successMessage.value = '✅ Firma bola úspešne vytvorená! Teraz môžete pridať kontaktné údaje a podpis.'
      }
    }
  }
}

onMounted(async () => {
  await loadCompanyData()
})
</script>

<style scoped>
.signature-preview {
  margin-top: 10px;
}
</style>