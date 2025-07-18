import React, { useState } from 'react';
import './Dashboard.css';

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    lastCheckup: '2023-05-15'
  });

  const upcomingConsultations = [
    { id: 1, doctor: 'Dr. Smith', date: '2023-06-20', time: '10:00 AM' }
  ];

  const pastConsultations = [
    { id: 1, doctor: 'Dr. Johnson', date: '2023-05-15', diagnosis: 'Normal checkup' },
    { id: 2, doctor: 'Dr. Johnson', date: '2023-03-10', diagnosis: 'Routine follow-up' }
  ];

  return (
    <div className="dashboard patient-dashboard">
      <header className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <button className="logout-button">Logout</button>
      </header>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'upcoming' ? 'active' : ''}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
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
                    <h3>With {consultation.doctor}</h3>
                    <p>Date: {consultation.date} at {consultation.time}</p>
                    <button className="toolbar-button primary-button" style={{ marginTop: '1rem' }}>
                      Join Consultation
                    </button>
                  </div>
                ))
              ) : (
                <p>No upcoming consultations scheduled</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'history' && (
          <section className="dashboard-section">
            <h2>Medical History</h2>
            <div className="enhanced-card">
              {pastConsultations.map(consultation => (
                <div key={consultation.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <h3>Consultation with {consultation.doctor}</h3>
                  <p>Date: {consultation.date}</p>
                  <p>Diagnosis: {consultation.diagnosis}</p>
                </div>
              ))}
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
                <h3>Recent Measurements</h3>
                <p>Your heart rate measurements over time will appear here</p>
                {/* In a real app, you would display a chart here */}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;