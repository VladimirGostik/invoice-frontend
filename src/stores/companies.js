      console.log('📊 Parsed companies data:', companiesData)
      companies.value = companiesData.map(company => ({
        id: company.id,
        name: company.company_name,
        email: company.invoice_issuer_email || 'N/A',
        phone: company.invoice_issuer_phone || 'N/A',
        address: company.company_address,
        status: 'active'
      }))