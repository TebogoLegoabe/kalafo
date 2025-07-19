import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

function AdminDashboard() {
  const { logout, user, apiCall } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiCall('/dashboard/admin');
        const data = await response.json();
        
        if (response.ok) {
          setDashboardData(data);
        } else {
          setError(data.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError('Network error. Please check your connection.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiCall]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard admin-dashboard">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentConsultations = dashboardData?.recent_consultations || [];

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="user-info">Welcome, {user?.first_name} {user?.last_name}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>System Overview</h2>
          <div className="card-container">
            <div className="enhanced-card">
              <h3>Total Doctors</h3>
              <div className="vital-value">{stats.total_doctors || 0}</div>
            </div>
            <div className="enhanced-card">
              <h3>Total Patients</h3>
              <div className="vital-value">{stats.total_patients || 0}</div>
            </div>
            <div className="enhanced-card">
              <h3>Active Consultations</h3>
              <div className="vital-value">{stats.active_consultations || 0}</div>
            </div>
            <div className="enhanced-card">
              <h3>Total Consultations</h3>
              <div className="vital-value">{stats.total_consultations || 0}</div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-section">
            <h2>Recent Activity</h2>
            <div className="enhanced-card">
              {recentConsultations.length > 0 ? (
                <div className="consultation-timeline">
                  {recentConsultations.map(consultation => (
                    <div key={consultation.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <p>
                          <strong>{consultation.patient_name}</strong> consultation with{' '}
                          <strong>{consultation.doctor_name}</strong>
                        </p>
                        <div className="timeline-date">
                          {new Date(consultation.scheduled_time).toLocaleDateString()}
                          {' - '}
                          <span className={`status-badge status-${consultation.status}`}>
                            {consultation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent consultations</p>
              )}
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