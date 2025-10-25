<!-- src/views/residential-companies/Form.vue -->
<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard>
          <CCardHeader class="d-flex align-items-center">
            <CButton 
              color="link" 
              class="text-decoration-none p-0 me-3"
              @click="$router.push('/residential-companies')"
            >
              <CIcon icon="cil-arrow-left" size="lg" />
            </CButton>
            <strong>{{ isEdit ? 'Upraviť bytový podnik' : 'Nový bytový podnik' }}</strong>
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

            <CForm @submit.prevent="handleSubmit">
              <!-- Základné informácie -->
              <h5 class="mb-3">Základné informácie</h5>
              
              <CRow class="mb-3">
                <CCol :md="12">
                  <CFormLabel>Názov bytového podniku *</CFormLabel>
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

              <!-- Streets - len pri editácii -->
              <template v-if="isEdit">
                <h5 class="mb-3 mt-4">Ulice v správe</h5>
                
                <!-- Error pre streets -->
                <CAlert 
                  v-if="companiesStore.errors.street"
                  color="danger"
                  :visible="true"
                  dismissible
                  @close="companiesStore.errors.street = ''"
                >
                  {{ companiesStore.errors.street }}
                </CAlert>

                <!-- Existing streets -->
                <CRow class="mb-3">
                  <CCol :md="12">
                    <CListGroup v-if="streets.length > 0">
                      <CListGroupItem 
                        v-for="(street, index) in streets" 
                        :key="street.id || `new-${index}`"
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div class="flex-grow-1 me-3">
                          <CFormInput
                            v-if="street.editing"
                            v-model="street.street_name"
                            placeholder="Názov ulice..."
                            @keyup.enter="saveStreet(street, index)"
                            @keyup.esc="cancelEditStreet(street, index)"
                          />
                          <span v-else>{{ street.street_name }}</span>
                        </div>
                        <CButtonGroup size="sm">
                          <CButton 
                            v-if="street.editing"
                            color="success" 
                            variant="outline"
                            @click="saveStreet(street, index)"
                            :disabled="isStreetLoading"
                          >
                            <CIcon icon="cil-check" /> Uložiť
                          </CButton>
                          <CButton 
                            v-if="street.editing"
                            color="secondary" 
                            variant="outline"
                            @click="cancelEditStreet(street, index)"
                            :disabled="isStreetLoading"
                          >
                            <CIcon icon="cil-x" /> Zrušiť
                          </CButton>
                          <CButton 
                            v-if="!street.editing"
                            color="info" 
                            variant="outline"
                            @click="editStreet(street, index)"
                          >
                            <CIcon icon="cil-pencil" />
                          </CButton>
                          <CButton 
                            v-if="!street.editing"
                            color="danger" 
                            variant="outline"
                            @click="deleteStreet(street, index)"
                            :disabled="isStreetLoading"
                          >
                            <CIcon icon="cil-trash" />
                          </CButton>
                        </CButtonGroup>
                      </CListGroupItem>
                    </CListGroup>
                    <p v-else class="text-muted">Žiadne ulice pridané</p>
                  </CCol>
                </CRow>

                <!-- Add new street -->
                <CRow class="mb-3">
                  <CCol :md="12">
                    <CInputGroup>
                      <CFormInput
                        v-model="newStreetName"
                        placeholder="Pridať novú ulicu..."
                        @keyup.enter="addNewStreet"
                      />
                      <CButton 
                        color="primary" 
                        @click="addNewStreet"
                        :disabled="!newStreetName || isStreetLoading"
                      >
                        <CSpinner v-if="isStreetLoading" size="sm" class="me-2" />
                        <CIcon icon="cil-plus" /> Pridať ulicu
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </CRow>
              </template>

              <!-- Buttons -->
              <div class="d-flex justify-content-end gap-2 mt-4">
                <CButton 
                  color="secondary" 
                  variant="outline"
                  @click="$router.push('/residential-companies')"
                  :disabled="companiesStore.isLoading"
                >
                  Zrušiť
                </CButton>
                <CButton 
                  color="primary" 
                  type="submit"
                  :disabled="companiesStore.isLoading"
                >
                  <CSpinner v-if="companiesStore.isLoading" size="sm" class="me-2" />
                  {{ isEdit ? 'Uložiť zmeny' : 'Vytvoriť bytový podnik' }}
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
import { useResidentialCompaniesStore } from '@/stores/residentialCompanies'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const route = useRoute()
const companiesStore = useResidentialCompaniesStore()

const isEdit = computed(() => !!route.params.id)
const successMessage = ref('')
const isStreetLoading = ref(false)

// Form pre company
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

// Streets management
const streets = ref([])
const newStreetName = ref('')
const streetsBackup = ref({})

const loadCompanyData = async () => {
  if (!isEdit.value) return
  
  const result = await companiesStore.fetchCompany(route.params.id)
  if (result.success) {
    const company = companiesStore.currentCompany
    
    // Naplň form
    form.value = {
      company_name: company.company_name,
      company_city: company.company_city,
      company_state: company.company_state,
      company_address: company.company_address,
      company_zip: company.company_zip,
      company_ico: company.company_ico,
      company_dic: company.company_dic,
      company_ic_dph: company.company_ic_dph || '',
      company_bank_account: company.company_bank_account,
      company_bank_swift: company.company_bank_swift
    }
    
    // Naplň streets
    streets.value = (company.streets || []).map(street => ({
      ...street,
      editing: false
    }))
  }
}

const addNewStreet = async () => {
  if (!newStreetName.value.trim() || !isEdit.value) return
  
  isStreetLoading.value = true
  
  const result = await companiesStore.addStreet(route.params.id, newStreetName.value.trim())
  
  if (result.success) {
    successMessage.value = '✅ Ulica bola pridaná!'
    newStreetName.value = ''
    await loadCompanyData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  isStreetLoading.value = false
}

const editStreet = (street, index) => {
  // Backup original value
  streetsBackup.value[index] = { ...street }
  // Enable editing
  streets.value[index].editing = true
}

const cancelEditStreet = (street, index) => {
  // Restore original value
  if (streetsBackup.value[index]) {
    streets.value[index] = { ...streetsBackup.value[index] }
    delete streetsBackup.value[index]
  }
}

const saveStreet = async (street, index) => {
  if (!street.street_name.trim()) return
  
  isStreetLoading.value = true
  
  const result = await companiesStore.updateStreet(
    route.params.id, 
    street.id, 
    street.street_name.trim()
  )
  
  if (result.success) {
    successMessage.value = '✅ Ulica bola aktualizovaná!'
    streets.value[index].editing = false
    delete streetsBackup.value[index]
    await loadCompanyData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  isStreetLoading.value = false
}

const deleteStreet = async (street, index) => {
  if (!confirm(`Naozaj chcete vymazať ulicu "${street.street_name}"?`)) return
  
  isStreetLoading.value = true
  
  const result = await companiesStore.deleteStreet(route.params.id, street.id)
  
  if (result.success) {
    successMessage.value = '✅ Ulica bola vymazaná!'
    await loadCompanyData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  isStreetLoading.value = false
}

const handleSubmit = async () => {
  companiesStore.clearErrors()
  successMessage.value = ''
  
  let result
  if (isEdit.value) {
    // Editácia
    result = await companiesStore.updateCompany(route.params.id, form.value)
    
    if (result.success) {
      successMessage.value = '✅ Bytový podnik bol úspešne aktualizovaný!'
      await loadCompanyData()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else {
    // Vytvorenie
    result = await companiesStore.createCompany(form.value)
    
    if (result.success) {
      const newCompanyId = result.data.data?.id || result.data.id
      if (newCompanyId) {
        router.push(`/residential-companies/${newCompanyId}/edit`)
        successMessage.value = '✅ Bytový podnik bol úspešne vytvorený! Teraz môžete pridať ulice.'
      }
    }
  }
}

onMounted(async () => {
  await loadCompanyData()
})
</script>