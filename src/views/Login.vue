<template>
  <div class="bg-primary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>{{ import.meta.env.VITE_APP_NAME }}</h1>
                  <p class="text-body-secondary">Prihláste sa do svojho účtu</p>
                  
                  <!-- Error message -->
                  <CAlert 
                    v-if="authStore.errors.general" 
                    color="danger" 
                    :visible="true"
                    dismissible
                    @close="authStore.errors.general = ''"
                  >
                    {{ authStore.errors.general }}
                  </CAlert>
                  
                  <!-- Email input -->
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.email"
                      type="email"
                      placeholder="Email"
                      autocomplete="email"
                      required
                      :disabled="authStore.isLoading"
                      :invalid="!!authStore.errors.email"
                    />
                    <CFormFeedback v-if="authStore.errors.email" invalid>
                      {{ authStore.errors.email[0] }}
                    </CFormFeedback>
                  </CInputGroup>
                  
                  <!-- Password input -->
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.password"
                      type="password"
                      placeholder="Heslo"
                      autocomplete="current-password"
                      required
                      :disabled="authStore.isLoading"
                      :invalid="!!authStore.errors.password"
                    />
                    <CFormFeedback v-if="authStore.errors.password" invalid>
                      {{ authStore.errors.password[0] }}
                    </CFormFeedback>
                  </CInputGroup>
                  
                  <!-- Submit button -->
                  <CRow>
                    <CCol :xs="6">
                      <CButton 
                        type="submit"
                        color="primary" 
                        class="px-4"
                        :disabled="authStore.isLoading"
                      >
                        <CSpinner 
                          v-if="authStore.isLoading" 
                          size="sm" 
                          class="me-2"
                        />
                        {{ authStore.isLoading ? 'Prihlasuje...' : 'Prihlásiť' }}
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-end">
                      <CButton color="link" class="px-0">
                        Zabudli ste heslo?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            
            <!-- Right side card with info -->
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Fakturačný systém</h2>
                  <p>
                    Jednoduché a efektívne riešenie pre správu faktúr a klientov.
                  </p>
                  <p class="mt-3">
                    <small>Verzia 1.0</small>
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  console.log('Attempting login with:', form.value)
  await authStore.login(form.value)
}

// Pre development - predvyplnené údaje (odstráňte v produkcii)
onMounted(() => {
  // form.value.email = 'admin@example.com'
  // form.value.password = 'password'
})
</script>

<style scoped>
.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>