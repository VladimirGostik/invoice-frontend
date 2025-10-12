<template>
  <AppLayout>
    <CRow>
      <CCol :xs="12">
        <CCard>
          <CCardHeader>
            <strong>Zoznam faktúr</strong>
          </CCardHeader>
          <CCardBody>
            <p>Tu bude zoznam všetkých faktúr...</p>
            
            <!-- Placeholder obsah -->
            <CButton color="primary" class="mb-3">
              <CIcon icon="cil-plus" class="me-2" />
              Nová faktúra
            </CButton>
            
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Číslo</CTableHeaderCell>
                  <CTableHeaderCell>Klient</CTableHeaderCell>
                  <CTableHeaderCell>Suma</CTableHeaderCell>
                  <CTableHeaderCell>Stav</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>INV-001</CTableDataCell>
                  <CTableDataCell>Test Client</CTableDataCell>
                  <CTableDataCell>€1,000</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="success">Zaplatené</CBadge>
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