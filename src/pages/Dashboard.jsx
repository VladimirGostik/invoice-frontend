import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Total Invoices', value: '127', icon: '📄', color: '#667eea' },
    { title: 'Pending', value: '23', icon: '⏳', color: '#f59e0b' },
    { title: 'Paid', value: '89', icon: '✅', color: '#10b981' },
    { title: 'Overdue', value: '15', icon: '⚠️', color: '#ef4444' },
  ];

  const recentInvoices = [
    { id: 'INV-001', customer: 'Acme Corp', amount: '$1,250.00', status: 'Paid' },
    { id: 'INV-002', customer: 'TechStart Inc', amount: '$3,450.00', status: 'Pending' },
    { id: 'INV-003', customer: 'Global Solutions', amount: '$890.00', status: 'Overdue' },
    { id: 'INV-004', customer: 'Design Studio', amount: '$2,100.00', status: 'Paid' },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <h2 className="section-title">Recent Invoices</h2>
        <div className="table-container">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">{invoice.id}</td>
                  <td>{invoice.customer}</td>
                  <td className="amount">{invoice.amount}</td>
                  <td>
                    <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
