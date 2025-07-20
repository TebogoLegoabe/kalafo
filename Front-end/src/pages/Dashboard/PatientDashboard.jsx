import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import VideoConsultation from './VideoConsultation';
import './Dashboard.css';

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Video consultation state
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [isInConsultation, setIsInConsultation] = useState(false);

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
          // Create mock data if API endpoint doesn't exist yet
          setError('Using demo data - patient API endpoint not available yet');
          const mockData = {
            upcoming_consultations: [
              {
                id: 1,
                doctor_id: 2,
                doctor_name: 'Dr. John Smith',
                scheduled_time: new Date(Date.now() + 86400000).toISOString(),
                status: 'scheduled',
                notes: 'Follow-up consultation for blood pressure monitoring'
              },
              {
                id: 2,
                doctor_id: 3,
                doctor_name: 'Dr. Tebogo Tebogo',
                scheduled_time: new Date(Date.now() + 2 * 86400000).toISOString(),
                status: 'scheduled',
                notes: 'Regular health checkup'
              }
            ],
            past_consultations: [
              {
                id: 3,
                doctor_id: 2,
                doctor_name: 'Dr. John Smith',
                scheduled_time: new Date(Date.now() - 7 * 86400000).toISOString(),
                status: 'completed',
                diagnosis: 'Hypertension - Stage 1',
                notes: 'Blood pressure elevated. Prescribed lifestyle changes and monitoring.',
                prescription: 'Low sodium diet, regular exercise, blood pressure monitoring'
              }
            ],
            health_vitals: {
              latest_readings: {
                blood_pressure: '128/82',
                heart_rate: 72,
                weight: '75 kg',
                temperature: '98.6°F',
                last_updated: new Date(Date.now() - 2 * 86400000).toISOString()
              },
              trends: {
                blood_pressure_trend: 'improving',
                weight_trend: 'stable',
                heart_rate_trend: 'normal'
              }
            }
          };
          setDashboardData(mockData);
        }
      } catch (err) {
        // Use mock data as fallback and set error message
        const mockData = {
          upcoming_consultations: [
            {
              id: 1,
              doctor_id: 2,
              doctor_name: 'Dr. John Smith',
              scheduled_time: new Date().toISOString(),
              status: 'scheduled',
              notes: 'Demo consultation - click Join Call to test'
            }
          ],
          past_consultations: [],
          health_vitals: {
            latest_readings: {
              blood_pressure: '120/80',
              heart_rate: 72,
              weight: 'Not recorded',
              temperature: 'Not recorded',
              last_updated: null
            }
          }
        };
        setDashboardData(mockData);
        setError('Using demo data - connect to backend for real data');
        console.log('Using mock data for patient dashboard');
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

  // Video consultation handlers - THIS IS THE IMPORTANT PART!
  const joinConsultation = (consultation) => {
    console.log('🎥 Joining consultation:', consultation);
    setActiveConsultation({
      id: consultation.id,
      patientId: user.id,
      doctorId: consultation.doctor_id,
      doctorName: consultation.doctor_name,
      scheduledTime: consultation.scheduled_time
    });
    setIsInConsultation(true);
  };

  const endConsultation = () => {
    setIsInConsultation(false);
    setActiveConsultation(null);
  };

  // THIS IS KEY - If in video consultation, show the video interface
  if (isInConsultation && activeConsultation) {
    return (
      <VideoConsultation
        consultationId={activeConsultation.id}
        patientId={activeConsultation.patientId}
        doctorId={activeConsultation.doctorId}
        doctorName={activeConsultation.doctorName}
        onEndCall={endConsultation}
      />
    );
  }

  const handleBookAppointment = () => {
    alert('Appointment booking feature will be implemented here');
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
  const healthVitals = dashboardData?.health_vitals || {};
  const latestReadings = healthVitals.latest_readings || {};

  const todayConsultations = upcomingConsultations.filter(c => 
    new Date(c.scheduled_time).toDateString() === new Date().toDateString()
  );

  return (
    <div className="dashboard patient-dashboard">
      {error && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '6px', 
          padding: '1rem', 
          marginBottom: '1rem',
          color: '#856404'
        }}>
          ℹ️ {error}
        </div>
      )}
      
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
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          🏠 Overview
        </button>
        <button 
          className={activeTab === 'appointments' ? 'active' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments {upcomingConsultations.length > 0 && `(${upcomingConsultations.length})`}
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📋 Medical History
        </button>
        <button 
          className={activeTab === 'health' ? 'active' : ''}
          onClick={() => setActiveTab('health')}
        >
          💓 Health Data
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <section className="dashboard-section">
            <h2>Today's Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">{todayConsultations.length}</div>
                  <div className="stat-label">Today's Appointments</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-content">
                  <div className="stat-number">{upcomingConsultations.length}</div>
                  <div className="stat-label">Upcoming Appointments</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-number">{pastConsultations.length}</div>
                  <div className="stat-label">Past Consultations</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💓</div>
                <div className="stat-content">
                  <div className="stat-number">{latestReadings.heart_rate || '--'}</div>
                  <div className="stat-label">Heart Rate (BPM)</div>
                </div>
              </div>
            </div>

            {todayConsultations.length > 0 && (
              <div className="enhanced-card">
                <h3>📋 Today's Appointments</h3>
                <div className="today-appointments">
                  {todayConsultations
                    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time))
                    .map(consultation => (
                      <div key={consultation.id} className="appointment-item">
                        <div className="appointment-time">
                          {new Date(consultation.scheduled_time).toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="appointment-patient">
                          <strong>With {consultation.doctor_name}</strong>
                          <p>{consultation.notes}</p>
                        </div>
                        <div className="appointment-actions">
                          <button 
                            className="action-button start"
                            onClick={() => joinConsultation(consultation)}
                          >
                            📹 Join Call
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="dashboard-grid">
              <div className="enhanced-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-button primary" onClick={handleBookAppointment}>
                    📅 Book New Appointment
                  </button>
                  <button className="action-button secondary">
                    📊 View Health Reports
                  </button>
                  <button className="action-button outline">
                    💬 Message Doctor
                  </button>
                </div>
              </div>

              <div className="enhanced-card">
                <h3>Latest Health Readings</h3>
                <div className="vitals-display">
                  <div className="vital-item">
                    <div className="vital-label">Blood Pressure</div>
                    <div className="vital-value" style={{ fontSize: '1.5rem' }}>
                      {latestReadings.blood_pressure || '--/--'}
                    </div>
                  </div>
                  <div className="vital-item">
                    <div className="vital-label">Weight</div>
                    <div className="vital-value" style={{ fontSize: '1.5rem' }}>
                      {latestReadings.weight || '--'}
                    </div>
                  </div>
                </div>
                {latestReadings.last_updated && (
                  <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
                    Last updated: {new Date(latestReadings.last_updated).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'appointments' && (
          <section className="dashboard-section">
            <h2>📅 My Appointments</h2>
            
            <div className="enhanced-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Upcoming Consultations</h3>
                <button className="action-button primary" onClick={handleBookAppointment}>
                  + Book New
                </button>
              </div>
              
              {upcomingConsultations.length > 0 ? (
                <div className="consultations-list">
                  {upcomingConsultations.map(consultation => (
                    <div key={consultation.id} className="consultation-item">
                      <div className="consultation-header">
                        <strong>With {consultation.doctor_name}</strong>
                        <span className={`status-badge status-${consultation.status}`}>
                          {consultation.status}
                        </span>
                      </div>
                      <div className="consultation-details">
                        <p>📅 {new Date(consultation.scheduled_time).toLocaleDateString()}</p>
                        <p>⏰ {new Date(consultation.scheduled_time).toLocaleTimeString()}</p>
                        {consultation.notes && <p>📝 {consultation.notes}</p>}
                      </div>
                      <div className="consultation-actions">
                        <button 
                          className="action-button start"
                          onClick={() => joinConsultation(consultation)}
                        >
                          📹 Join Consultation
                        </button>
                        <button className="action-button reschedule">Reschedule</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <p>No upcoming appointments scheduled.</p>
                  <button className="action-button primary" onClick={handleBookAppointment} style={{ marginTop: '1rem' }}>
                    Schedule Your First Appointment
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'history' && (
          <section className="dashboard-section">
            <h2>📋 Medical History</h2>
            
            <div className="enhanced-card">
              <h3>Past Consultations</h3>
              {pastConsultations.length > 0 ? (
                <div className="consultations-list">
                  {pastConsultations.map(consultation => (
                    <div key={consultation.id} className="consultation-item completed">
                      <div className="consultation-header">
                        <strong>Consultation with {consultation.doctor_name}</strong>
                        <span className={`status-badge status-${consultation.status}`}>
                          {consultation.status}
                        </span>
                      </div>
                      <div className="consultation-details">
                        <p>📅 {new Date(consultation.scheduled_time).toLocaleDateString()}</p>
                        <p>⏰ {new Date(consultation.scheduled_time).toLocaleTimeString()}</p>
                        {consultation.diagnosis && (
                          <p><strong>🔍 Diagnosis:</strong> {consultation.diagnosis}</p>
                        )}
                        {consultation.prescription && (
                          <p><strong>💊 Treatment Plan:</strong> {consultation.prescription}</p>
                        )}
                        {consultation.notes && (
                          <p><strong>📝 Doctor's Notes:</strong> {consultation.notes}</p>
                        )}
                      </div>
                      <div className="consultation-actions">
                        <button className="action-button outline">Download Report</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <p>No consultation history available yet.</p>
                  <p>Your medical records will appear here after your first consultation.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'health' && (
          <section className="dashboard-section">
            <h2>💓 My Health Data</h2>
            
            <div className="enhanced-card">
              <h3>Current Vitals</h3>
              <div className="vitals-display">
                <div className="vital-item">
                  <div className="vital-label">Heart Rate</div>
                  <div className="vital-value">
                    {latestReadings.heart_rate || '--'} <span style={{ fontSize: '1rem' }}>BPM</span>
                  </div>
                  {healthVitals.trends?.heart_rate_trend && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                      {healthVitals.trends.heart_rate_trend}
                    </div>
                  )}
                </div>
                <div className="vital-item">
                  <div className="vital-label">Blood Pressure</div>
                  <div className="vital-value">
                    {latestReadings.blood_pressure || '--/--'}
                  </div>
                  {healthVitals.trends?.blood_pressure_trend && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                      {healthVitals.trends.blood_pressure_trend}
                    </div>
                  )}
                </div>
                <div className="vital-item">
                  <div className="vital-label">Weight</div>
                  <div className="vital-value">
                    {latestReadings.weight || '--'}
                  </div>
                  {healthVitals.trends?.weight_trend && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                      {healthVitals.trends.weight_trend}
                    </div>
                  )}
                </div>
                <div className="vital-item">
                  <div className="vital-label">Temperature</div>
                  <div className="vital-value">
                    {latestReadings.temperature || '--'}
                  </div>
                </div>
              </div>

              {latestReadings.last_updated && (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '1.5rem' }}>
                  Last updated: {new Date(latestReadings.last_updated).toLocaleDateString()} at{' '}
                  {new Date(latestReadings.last_updated).toLocaleTimeString()}
                </p>
              )}

              <div style={{ marginTop: '2rem' }}>
                <h4>Health Tracking</h4>
                <p>Connect health monitoring devices to track your vitals over time. Charts and trends will appear here as data becomes available.</p>
                <div className="quick-actions" style={{ marginTop: '1rem' }}>
                  <button className="action-button outline">📱 Connect Device</button>
                  <button className="action-button outline">➕ Manual Entry</button>
                  <button className="action-button outline">📊 View Trends</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;