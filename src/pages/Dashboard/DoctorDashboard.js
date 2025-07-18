import React, { useState } from 'react';
import './Dashboard.css';

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('consultations');
  const [heartRate, setHeartRate] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);

  // Sample patient data
  const currentPatient = {
    name: 'Sarah Johnson',
    age: 42,
    gender: 'Female',
    lastConsultation: '2 days ago'
  };

  const patientHistory = [
    { date: '2023-05-15', diagnosis: 'Normal sinus rhythm', heartRate: 72 },
    { date: '2023-03-22', diagnosis: 'Mild tachycardia', heartRate: 95 },
    { date: '2023-01-10', diagnosis: 'Normal sinus rhythm', heartRate: 78 }
  ];

  const simulateHeartRate = () => {
    const rate = Math.floor(Math.random() * 30) + 60; // 60-90 BPM
    setHeartRate(rate);
  };

  const startVideoCall = () => {
    setIsCallActive(true);
    // In a real app, you would initialize WebRTC connection here
  };

  return (
    <div className="dashboard doctor-dashboard">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <button className="logout-button">Logout</button>
      </header>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'patients' ? 'active' : ''}
          onClick={() => setActiveTab('patients')}
        >
          My Patients
        </button>
        <button 
          className={activeTab === 'consultations' ? 'active' : ''}
          onClick={() => setActiveTab('consultations')}
        >
          Current Consultation
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'patients' ? (
          <section className="dashboard-section">
            <h2>Patient List</h2>
            <div className="enhanced-card">
              {/* Patient list would go here */}
              <p>Your active patients will appear here</p>
            </div>
          </section>
        ) : (
          <>
            <section className="dashboard-section">
              <h2>Current Consultation</h2>
              <div className="dashboard-grid">
                <div className="enhanced-card">
                  <div className="patient-profile">
                    <div className="profile-avatar">
                      {currentPatient.name.charAt(0)}
                    </div>
                    <div className="profile-info">
                      <h3>{currentPatient.name}</h3>
                      <div className="profile-meta">
                        {currentPatient.age} years • {currentPatient.gender} • Last visit: {currentPatient.lastConsultation}
                      </div>
                    </div>
                  </div>

                  <div className="vitals-display">
                    <div className="vital-item">
                      <div className="vital-label">Heart Rate</div>
                      <div className="vital-value">
                        {heartRate || '--'}
                        {heartRate && <span style={{ fontSize: '1rem' }}> BPM</span>}
                      </div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-label">Rhythm</div>
                      <div className="vital-value">
                        {heartRate ? (heartRate > 100 ? 'Tachycardia' : heartRate < 60 ? 'Bradycardia' : 'Normal') : '--'}
                      </div>
                    </div>
                  </div>

                  <div className="toolbar">
                    <button 
                      className="toolbar-button primary-button"
                      onClick={startVideoCall}
                    >
                      {isCallActive ? 'End Call' : 'Start Video Call'}
                    </button>
                    <button 
                      className="toolbar-button secondary-button"
                      onClick={simulateHeartRate}
                    >
                      Measure Heart Rate
                    </button>
                  </div>
                </div>

                <div className="enhanced-card">
                  <h3>Stethoscope Guidance</h3>
                  <ol style={{ paddingLeft: '1.5rem' }}>
                    <li>Ensure patient is seated comfortably</li>
                    <li>Place stethoscope on the aortic area (2nd right intercostal space)</li>
                    <li>Move to pulmonic area (2nd left intercostal space)</li>
                    <li>Check tricuspid area (4th left intercostal space)</li>
                    <li>Finally listen at mitral area (5th left intercostal space)</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <h2>Patient History</h2>
              <div className="enhanced-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Diagnosis</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Heart Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientHistory.map((record, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.5rem 0' }}>{record.date}</td>
                        <td style={{ padding: '0.5rem 0' }}>{record.diagnosis}</td>
                        <td style={{ padding: '0.5rem 0' }}>{record.heartRate} BPM</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;