import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { logout, user, apiCall } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiCall('/dashboard/doctor');
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
      <div className="dashboard doctor-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard doctor-dashboard">
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

  const upcomingConsultations = dashboardData?.upcoming_consultations || [];
  const recentConsultations = dashboardData?.recent_consultations || [];

  return (
    <div className="dashboard doctor-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p className="user-info">Welcome, Dr. {user?.first_name} {user?.last_name}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'upcoming' ? 'active' : ''}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Consultations
        </button>
        <button 
          className={activeTab === 'recent' ? 'active' : ''}
          onClick={() => setActiveTab('recent')}
        >
          Recent Consultations
        </button>
        <button 
          className={activeTab === 'schedule' ? 'active' : ''}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule Management
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'upcoming' && (
          <section className="dashboard-section">
            <h2>Upcoming Consultations</h2>
            <div className="enhanced-card">
              {upcomingConsultations.length > 0 ? (
                upcomingConsultations.map(consultation => (
                  <div key={consultation.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <h3>Patient: {consultation.patient_name}</h3>
                    <p>
                      <strong>Date:</strong> {new Date(consultation.scheduled_time).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {new Date(consultation.scheduled_time).toLocaleTimeString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`status-badge status-${consultation.status}`}>
                        {consultation.status}
                      </span>
                    </p>
                    {consultation.notes && (
                      <p><strong>Notes:</strong> {consultation.notes}</p>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                      <button className="toolbar-button primary-button" style={{ marginRight: '10px' }}>
                        Start Consultation
                      </button>
                      <button className="toolbar-button outline-button">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No upcoming consultations scheduled.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'recent' && (
          <section className="dashboard-section">
            <h2>Recent Consultations</h2>
            <div className="enhanced-card">
              {recentConsultations.length > 0 ? (
                recentConsultations.map(consultation => (
                  <div key={consultation.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <h3>Patient: {consultation.patient_name}</h3>
                    <p>
                      <strong>Date:</strong> {new Date(consultation.scheduled_time).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {new Date(consultation.scheduled_time).toLocaleTimeString()}
                    </p>
                    {consultation.diagnosis && (
                      <p><strong>Diagnosis:</strong> {consultation.diagnosis}</p>
                    )}
                    {consultation.notes && (
                      <p><strong>Notes:</strong> {consultation.notes}</p>
                    )}
                    <span className={`status-badge status-${consultation.status}`}>
                      {consultation.status}
                    </span>
                  </div>
                ))
              ) : (
                <p>No recent consultations.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="dashboard-section">
            <h2>Schedule Management</h2>
            <div className="enhanced-card">
              <div className="schedule-summary">
                <h3>Today's Summary</h3>
                <div className="vitals-display">
                  <div className="vital-item">
                    <div className="vital-label">Upcoming Today</div>
                    <div className="vital-value">
                      {upcomingConsultations.filter(c => 
                        new Date(c.scheduled_time).toDateString() === new Date().toDateString()
                      ).length}
                    </div>
                  </div>
                  <div className="vital-item">
                    <div className="vital-label">Total Patients</div>
                    <div className="vital-value">
                      {[...new Set([...upcomingConsultations, ...recentConsultations].map(c => c.patient_id))].length}
                    </div>
                  </div>
                  <div className="vital-item">
                    <div className="vital-label">This Week</div>
                    <div className="vital-value">
                      {upcomingConsultations.filter(c => {
                        const consultDate = new Date(c.scheduled_time);
                        const today = new Date();
                        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return consultDate >= today && consultDate <= weekFromNow;
                      }).length}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3>Quick Actions</h3>
                <div className="toolbar">
                  <button className="toolbar-button primary-button">
                    Schedule New Consultation
                  </button>
                  <button className="toolbar-button outline-button">
                    View All Patients
                  </button>
                  <button className="toolbar-button outline-button">
                    Update Availability
                  </button>
                  <button className="toolbar-button outline-button">
                    Generate Reports
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;