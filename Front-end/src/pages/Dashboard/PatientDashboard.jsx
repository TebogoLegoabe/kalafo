import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

/**
 * PatientDashboard
 * Displays upcoming and past consultations for the logged in patient.
 */
const PatientDashboard = () => {
  const { apiCall } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiCall('/dashboard/patient');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error('Failed to load patient dashboard', err);
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
        <h1>Patient Dashboard</h1>
      </header>

      <section className="dashboard-section">
        <h2>Upcoming Consultations</h2>
        <ul>
          {data.upcoming_consultations.map((c) => (
            <li key={c.id}>
              {c.doctor_name} – {new Date(c.scheduled_time).toLocaleString()} ({c.status})
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard-section">
        <h2>Past Consultations</h2>
        <ul>
          {data.past_consultations.map((c) => (
            <li key={c.id}>
              {c.doctor_name} – {new Date(c.scheduled_time).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PatientDashboard;

