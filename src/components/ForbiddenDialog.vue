<template>
  <CModal
    :visible="visible"
    @close="closeDialog"
    backdrop="static"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle>
        <CIcon icon="cilWarning" class="text-danger me-2" size="lg" />
        Prístup zamietnutý
      </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="text-center py-3">
        <CIcon icon="cilLockLocked" class="text-danger mb-3" size="xxl" />
        <h5 class="mb-3">{{ message }}</h5>
        <p class="text-muted">
          Ak si myslíte, že ide o chybu, kontaktujte administrátora.
        </p>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeDialog">
        Zavrieť
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/vue'
import { CIcon } from '@coreui/icons-vue'

const visible = ref(false)
const message = ref('Na túto akciu nemáte oprávnenie.')

const handleForbiddenEvent = (event) => {
  message.value = event.detail.message
  visible.value = true
}

const closeDialog = () => {
  visible.value = false
}

onMounted(() => {
  window.addEventListener('show-forbidden-dialog', handleForbiddenEvent)
})

onUnmounted(() => {
  window.removeEventListener('show-forbidden-dialog', handleForbiddenEvent)
})
</script>

<style scoped>
.text-danger {
  color: #e55353 !important;
}
</style>
