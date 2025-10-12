// Formatovanie stavov
export const getCompanyStatusColor = (status) => {
  const colors = {
    'active': 'success',
    'inactive': 'secondary',
    'pending': 'warning',
    'suspended': 'danger'
  }
  return colors[status] || 'secondary'
}

export const getCompanyStatusText = (status) => {
  const texts = {
    'active': 'Aktívna',
    'inactive': 'Neaktívna',
    'pending': 'Čakajúca',
    'suspended': 'Pozastavená'
  }
  return texts[status] || 'Neznámy'
}

// Formatovanie adresy
export const formatAddress = (address, city, state) => {
  return `${address}, ${city}, ${state}`
}