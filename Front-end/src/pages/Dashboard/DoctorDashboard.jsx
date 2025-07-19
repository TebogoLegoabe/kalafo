import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [patientsData, setPatientsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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

  useEffect(() => {
    if (activeTab === 'patients' && !patientsData) {
      fetchPatients();
    }
  }, [activeTab, patientsData]);

  const fetchPatients = async () => {
    setPatientsLoading(true);
    try {
      const response = await apiCall('/patients');
      const data = await response.json();
      
      if (response.ok) {
        setPatientsData(data);
      } else {
        setError(data.error || 'Failed to load patients data');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Patients fetch error:', err);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredAndSortedPatients = () => {
    if (!patientsData?.patients) return [];
    
    let filtered = patientsData.patients.filter(patient =>
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'consultations':
          aValue = a.consultation_count || 0;
          bValue = b.consultation_count || 0;
          break;
        case 'lastVisit':
          aValue = a.last_consultation ? new Date(a.last_consultation) : new Date(0);
          bValue = b.last_consultation ? new Date(b.last_consultation) : new Date(0);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
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
  const todayConsultations = upcomingConsultations.filter(c => 
    new Date(c.scheduled_time).toDateString() === new Date().toDateString()
  );

  return (
    <div className="dashboard doctor-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p className="user-info">Dr. {user?.first_name} {user?.last_name}</p>
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
          📊 Overview
        </button>
        <button 
          className={activeTab === 'schedule' ? 'active' : ''}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button 
          className={activeTab === 'patients' ? 'active' : ''}
          onClick={() => setActiveTab('patients')}
        >
          👥 Patients {patientsData && `(${patientsData.total_count})`}
        </button>
        <button 
          className={activeTab === 'consultations' ? 'active' : ''}
          onClick={() => setActiveTab('consultations')}
        >
          🩺 Consultations
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <section className="dashboard-section">
            <h2>Today's Overview</h2>
            
            {/* Quick Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">{todayConsultations.length}</div>
                  <div className="stat-label">Today's Appointments</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {[...new Set([...upcomingConsultations, ...recentConsultations].map(c => c.patient_id))].length}
                  </div>
                  <div className="stat-label">Total Patients</div>
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
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{recentConsultations.length}</div>
                  <div className="stat-label">Completed This Week</div>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            {todayConsultations.length > 0 && (
              <div className="enhanced-card">
                <h3>📋 Today's Schedule</h3>
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
                          <strong>{consultation.patient_name}</strong>
                          <p>{consultation.notes}</p>
                        </div>
                        <div className="appointment-actions">
                          <button className="action-button start">Start</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="dashboard-section">
            <h2>📅 Schedule Management</h2>
            
            <div className="schedule-grid">
              <div className="enhanced-card">
                <h3>Upcoming Consultations</h3>
                {upcomingConsultations.length > 0 ? (
                  <div className="consultations-list">
                    {upcomingConsultations.map(consultation => (
                      <div key={consultation.id} className="consultation-item">
                        <div className="consultation-header">
                          <strong>{consultation.patient_name}</strong>
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
                          <button className="action-button start">Start Consultation</button>
                          <button className="action-button reschedule">Reschedule</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming consultations scheduled.</p>
                )}
              </div>

              <div className="enhanced-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-button primary">Schedule New Consultation</button>
                  <button className="action-button secondary">Update Availability</button>
                  <button className="action-button outline">Generate Reports</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'patients' && (
          <section className="dashboard-section">
            <h2>👥 Patient Management</h2>
            
            <div className="patients-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="table-controls">
                <span>Total: {patientsData?.total_count || 0} patients</span>
              </div>
            </div>

            {patientsLoading ? (
              <div className="loading-spinner">Loading patients...</div>
            ) : patientsData && (
              <div className="patients-table-container">
                <table className="patients-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')} className="sortable">
                        Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('email')} className="sortable">
                        Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('consultations')} className="sortable">
                        Consultations {sortBy === 'consultations' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('lastVisit')} className="sortable">
                        Last Visit {sortBy === 'lastVisit' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedPatients().map(patient => (
                      <tr key={patient.id}>
                        <td>
                          <div className="patient-name">
                            <div className="patient-avatar">
                              {patient.first_name[0]}{patient.last_name[0]}
                            </div>
                            <div>
                              <strong>{patient.first_name} {patient.last_name}</strong>
                              <div className="patient-id">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{patient.email}</td>
                        <td>
                          <span className="consultation-count">
                            {patient.consultation_count || 0}
                          </span>
                        </td>
                        <td>
                          {patient.last_consultation ? (
                            new Date(patient.last_consultation).toLocaleDateString()
                          ) : (
                            <span className="no-visits">No visits</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-btn primary">Schedule</button>
                            <button className="table-btn secondary">History</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredAndSortedPatients().length === 0 && (
                  <div className="no-results">
                    <p>No patients found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'consultations' && (
          <section className="dashboard-section">
            <h2>🩺 Recent Consultations</h2>
            
            <div className="enhanced-card">
              {recentConsultations.length > 0 ? (
                <div className="consultations-list">
                  {recentConsultations.map(consultation => (
                    <div key={consultation.id} className="consultation-item completed">
                      <div className="consultation-header">
                        <strong>{consultation.patient_name}</strong>
                        <span className={`status-badge status-${consultation.status}`}>
                          {consultation.status}
                        </span>
                      </div>
                      <div className="consultation-details">
                        <p>📅 {new Date(consultation.scheduled_time).toLocaleDateString()}</p>
                        <p>⏰ {new Date(consultation.scheduled_time).toLocaleTimeString()}</p>
                        {consultation.diagnosis && (
                          <p><strong>Diagnosis:</strong> {consultation.diagnosis}</p>
                        )}
                        {consultation.notes && (
                          <p><strong>Notes:</strong> {consultation.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent consultations.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;