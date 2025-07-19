import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { logout, user, apiCall } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiCall('/dashboard/patient');
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

  // Sample health data - in a real app, this would come from the API
  const healthData = {
    heartRate: 72,
    bloodPressure: '120/80',
    lastCheckup: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'
  };

  if (loading) {
    return (
      <div className="dashboard patient-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard patient-dashboard">
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
  const pastConsultations = dashboardData?.past_consultations || [];

  return (
    <div className="dashboard patient-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Patient Dashboard</h1>
          <p className="user-info">Welcome, {user?.first_name} {user?.last_name}</p>
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
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Medical History
        </button>
        <button 
          className={activeTab === 'health' ? 'active' : ''}
          onClick={() => setActiveTab('health')}
        >
          My Health Data
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'upcoming' && (
          <section className="dashboard-section">
            <h2>Upcoming Consultations</h2>
            <div className="enhanced-card">
              {upcomingConsultations.length > 0 ? (
                upcomingConsultations.map(consultation => (
                  <div key={consultation.id} style={{ marginBottom: '1.5rem' }}>
                    <h3>With {consultation.doctor_name}</h3>
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
                    <button className="toolbar-button primary-button" style={{ marginTop: '1rem' }}>
                      Join Consultation
                    </button>
                  </div>
                ))
              ) : (
                <p>No upcoming consultations scheduled. Contact your doctor to book an appointment.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'history' && (
          <section className="dashboard-section">
            <h2>Medical History</h2>
            <div className="enhanced-card">
              {pastConsultations.length > 0 ? (
                pastConsultations.map(consultation => (
                  <div key={consultation.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <h3>Consultation with {consultation.doctor_name}</h3>
                    <p>
                      <strong>Date:</strong> {new Date(consultation.scheduled_time).toLocaleDateString()}
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
                <p>No consultation history available.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'health' && (
          <section className="dashboard-section">
            <h2>My Health Data</h2>
            <div className="enhanced-card">
              <div className="vitals-display">
                <div className="vital-item">
                  <div className="vital-label">Heart Rate</div>
                  <div className="vital-value">
                    {healthData.heartRate} <span style={{ fontSize: '1rem' }}>BPM</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-label">Blood Pressure</div>
                  <div className="vital-value">
                    {healthData.bloodPressure}
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-label">Last Checkup</div>
                  <div className="vital-value">
                    {healthData.lastCheckup}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3>Health Tracking</h3>
                <p>Connect health monitoring devices to track your vitals over time. Charts and trends will appear here as data becomes available.</p>
                <button className="toolbar-button outline-button" style={{ marginTop: '1rem' }}>
                  Connect Device
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;