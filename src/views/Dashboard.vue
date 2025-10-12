const getStatusText = (status) => {
  const texts = {
    'paid': 'Zaplatené',
    'pending': 'Čaká na platbu',
    'overdue': 'Po splatnosti',
    'draft': 'Koncept'
  }
  return texts[status] || status
}

const getCompanyStatusText = (status) => {
  const texts = {
    'active': 'Aktívna',
    'inactive': 'Neaktívna',
    'pending': 'Čakajúca',
    'suspended': 'Pozastavená'
  }
  return texts[status] || 'Neznámy'
}