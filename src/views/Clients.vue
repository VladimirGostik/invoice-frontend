<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard>
          <CCardHeader>
            <strong>Zoznam klientov</strong>
          </CCardHeader>
          <CCardBody>
            <p>Tu bude zoznam všetkých klientov...</p>
            
            <!-- Placeholder obsah -->
            <CButton color="success" class="mb-3">
              <CIcon icon="cil-plus" class="me-2" />
              Nový klient
            </CButton>
            
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Názov</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Telefón</CTableHeaderCell>
                  <CTableHeaderCell>Akcie</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>ABC s.r.o.</CTableDataCell>
                  <CTableDataCell>info@abc.sk</CTableDataCell>
                  <CTableDataCell>+421 123 456 789</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="info" variant="outline">
                      <CIcon icon="cil-pencil" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>