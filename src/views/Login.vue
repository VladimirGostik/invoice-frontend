<template>
  <div class="login-fullscreen">
    <div class="login-overlay">
      <CContainer fluid class="h-100">
        <CRow class="h-100 justify-content-center align-items-center">
          <CCol :lg="6" :md="8" :sm="10" :xs="12">
            <div class="login-card">
              <div class="text-center mb-4">
                <h1 class="display-4 text-white fw-bold">{{ appName }}</h1>
                <p class="text-white-50 fs-5">Prihláste sa do svojho účtu</p>
              </div>
              
              <CForm @submit.prevent="handleLogin">
                <!-- Error message -->
                <CAlert 
                  v-if="authStore.errors.general" 
                  color="danger" 
                  :visible="true"
                  dismissible
                  @close="authStore.errors.general = ''"
                  class="mb-4"
                >
                  {{ authStore.errors.general }}
                </CAlert>
                
                <!-- Email input -->
                <CInputGroup class="mb-3" size="lg">
                  <CInputGroupText class="bg-white border-0">
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
                    class="border-0 py-3"
                  />
                </CInputGroup>
                
                <!-- Password input -->
                <CInputGroup class="mb-4" size="lg">
                  <CInputGroupText class="bg-white border-0">
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
                    class="border-0 py-3"
                  />
                </CInputGroup>
                
                <!-- Submit button -->
                <div class="d-grid mb-3">
                  <CButton 
                    type="submit"
                    color="primary" 
                    size="lg"
                    :disabled="authStore.isLoading"
                    class="py-3 fw-bold"
                  >
                    <CSpinner 
                      v-if="authStore.isLoading" 
                      size="sm" 
                      class="me-2"
                    />
                    {{ authStore.isLoading ? 'Prihlasuje...' : 'Prihlásiť' }}
                  </CButton>
                </div>
                
                <!-- Forgot password link -->
                <div class="text-center">
                  <CButton color="link" class="text-white-50 text-decoration-none">
                    Zabudli ste heslo?
                  </CButton>
                </div>
              </CForm>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Získame app name z environment premenných
const appName = import.meta.env.VITE_APP_NAME || 'Fakturačný Systém'

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
.login-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-attachment: fixed;
}

.login-overlay {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}

.login-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Glassmorphism effect pre inputy */
.login-card .form-control {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.login-card .form-control:focus {
  background: rgba(255, 255, 255, 1);
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.login-card .input-group-text {
  border-radius: 10px 0 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-card .btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.login-card .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .display-4 {
    font-size: 2rem !important;
  }
}
</style>