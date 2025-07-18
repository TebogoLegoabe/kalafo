import React from 'react';
import './Dashboard.css';

function AdminDashboard() {
  // Sample data - replace with real data from your backend
  const stats = [
    { label: 'Total Doctors', value: 24 },
    { label: 'Total Patients', value: 187 },
    { label: 'Active Consultations', value: 12 },
    { label: 'Today\'s Sessions', value: 8 }
  ];

  const recentActivity = [
    { id: 1, action: 'New doctor registered', time: '10 mins ago' },
    { id: 2, action: 'Patient record updated', time: '25 mins ago' },
    { id: 3, action: 'New consultation scheduled', time: '1 hour ago' },
    { id: 4, action: 'System maintenance performed', time: '2 hours ago' }
  ];

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button">Logout</button>
      </header>
      
      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>System Overview</h2>
          <div className="card-container">
            {stats.map((stat, index) => (
              <div key={index} className="enhanced-card">
                <h3>{stat.label}</h3>
                <div className="vital-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-section">
            <h2>Recent Activity</h2>
            <div className="enhanced-card">
              <div className="consultation-timeline">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <p>{activity.action}</p>
                      <div className="timeline-date">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="enhanced-card">
              <div className="toolbar">
                <button className="toolbar-button primary-button">Add New Doctor</button>
                <button className="toolbar-button outline-button">Manage Users</button>
                <button className="toolbar-button outline-button">System Settings</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;