import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

/**
 * AdminDashboard
 * Fetches administrative statistics and recent consultations from the backend
 * and displays them using the same colour palette as the rest of the site.
 */
const AdminDashboard = () => {
  const { apiCall } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiCall('/dashboard/admin');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecent(data.recent_consultations);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      }
      setLoading(false);
    };
    load();
  }, [apiCall]);

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      {stats && (
        <div className="dashboard-stats">
          <div>
            <strong>{stats.total_doctors}</strong>
            <span>Total doctors</span>
          </div>
          <div>
            <strong>{stats.total_patients}</strong>
            <span>Total patients</span>
          </div>
          <div>
            <strong>{stats.total_consultations}</strong>
            <span>Total consultations</span>
          </div>
          <div>
            <strong>{stats.active_consultations}</strong>
            <span>Active consultations</span>
          </div>
        </div>
      )}

      <section className="dashboard-section">
        <h2>Recent Consultations</h2>
        <ul>
          {recent.map((c) => (
            <li key={c.id}>
              {c.patient_name} with {c.doctor_name} –
              {' '}
              {new Date(c.scheduled_time).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;

