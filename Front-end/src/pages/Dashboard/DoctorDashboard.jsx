import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

/**
 * DoctorDashboard
 * Shows the doctor's upcoming and recent consultations by requesting
 * data from the backend API.
 */
const DoctorDashboard = () => {
  const { apiCall } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiCall('/dashboard/doctor');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error('Failed to load doctor dashboard', err);
      }
    };
    load();
  }, [apiCall]);

  if (!data) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
      </header>

      <section className="dashboard-section">
        <h2>Upcoming Consultations</h2>
        <ul>
          {data.upcoming_consultations.map((c) => (
            <li key={c.id}>
              {c.patient_name} – {new Date(c.scheduled_time).toLocaleString()} ({c.status})
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard-section">
        <h2>Recent Consultations</h2>
        <ul>
          {data.recent_consultations.map((c) => (
            <li key={c.id}>
              {c.patient_name} – {new Date(c.scheduled_time).toLocaleString()} ({c.status})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DoctorDashboard;

