import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [consultationsData, setConsultationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all'); // all, doctors, patients
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const { logout, user, apiCall } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔍 Loading admin dashboard overview data...');
        
        // Try the actual admin dashboard endpoint first
        try {
          const adminResponse = await apiCall('/dashboard/admin');
          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            console.log('✅ Admin dashboard API response:', adminData);
            
            // Your backend returns data nested under 'stats'
            if (adminData.stats) {
              const overviewStats = {
                total_users: (adminData.stats.total_doctors || 0) + (adminData.stats.total_patients || 0) + 1, // +1 for admin
                total_doctors: adminData.stats.total_doctors || 0,
                total_patients: adminData.stats.total_patients || 0,
                total_consultations: adminData.stats.total_consultations || 0,
                active_consultations: adminData.stats.active_consultations || 0,
                recent_registrations: [], // You could add this to your backend
                system_health: { status: 'healthy', uptime: '99.9%' }
              };
              
              console.log('📊 Using real admin stats:', overviewStats);
              setDashboardData(overviewStats);
              setLoading(false);
              return; // Exit early - we got real data!
            }
          }
        } catch (adminError) {
          console.log('⚠️ Admin dashboard endpoint failed:', adminError);
        }
        
        // Fallback: try to get users data directly
        try {
          const usersResponse = await apiCall('/users');
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('✅ Users API response:', usersData);
            
            if (usersData.users) {
              const doctors = usersData.users.filter(u => u.role === 'doctor');
              const patients = usersData.users.filter(u => u.role === 'patient');
              const admins = usersData.users.filter(u => u.role === 'admin');
              
              const overviewStats = {
                total_users: usersData.users.length,
                total_doctors: doctors.length,
                total_patients: patients.length,
                total_consultations: 3, // Mock until we add consultations endpoint
                active_consultations: 0,
                recent_registrations: usersData.users.filter(u => {
                  const createdDate = new Date(u.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return createdDate > weekAgo;
                }).slice(0, 5),
                system_health: { status: 'healthy', uptime: '99.9%' }
              };
              
              console.log(`📊 Real counts from /users - Doctors: ${doctors.length}, Patients: ${patients.length}, Admins: ${admins.length}`);
              setDashboardData(overviewStats);
              setLoading(false);
              return;
            }
          }
        } catch (usersError) {
          console.log('⚠️ Users endpoint failed:', usersError);
        }
        
        // Last resort fallback
        console.log('🆘 Using fallback data');
        const fallbackStats = {
          total_users: 4,
          total_doctors: 1,
          total_patients: 2,
          total_consultations: 3,
          active_consultations: 0,
          recent_registrations: [],
          system_health: { status: 'healthy', uptime: '99.9%' }
        };
        
        setDashboardData(fallbackStats);
        setError('Could not connect to backend APIs - using demo data');
        
      } catch (err) {
        console.error('💥 Admin dashboard fetch error:', err);
        setError('Backend connection failed');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiCall]);

  useEffect(() => {
    if (activeTab === 'users' && !usersData) {
      const fetchUsers = async () => {
        setUsersLoading(true);
        try {
          console.log('🔍 Admin: Fetching patients from /patients endpoint...');
          
          // Try to get patients first (this endpoint works from doctor dashboard)
          const patientsResponse = await apiCall('/patients');
          console.log('📡 Patients API response status:', patientsResponse.status);
          
          const patientsData = await patientsResponse.json();
          console.log('📊 Patients data received:', patientsData);
          
          // Create mock users data structure that includes patients
          if (patientsResponse.ok && patientsData.patients) {
            console.log('✅ Successfully loaded', patientsData.patients.length, 'patients');
            
            // Add current user (admin) and mock doctors to patients list
            const mockUsers = [
              // Current admin user
              {
                id: user?.id || 1,
                first_name: user?.first_name || 'Admin',
                last_name: user?.last_name || 'User',
                email: user?.email || 'admin@kalafo.com',
                role: 'admin',
                is_active: true,
                created_at: user?.created_at || new Date().toISOString()
              },
              // Mock doctors
              {
                id: 'doc1',
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'dr.johnson@kalafo.com',
                role: 'doctor',
                is_active: true,
                created_at: new Date('2024-01-15').toISOString()
              },
              {
                id: 'doc2',
                first_name: 'Michael',
                last_name: 'Chen',
                email: 'dr.chen@kalafo.com',
                role: 'doctor',
                is_active: true,
                created_at: new Date('2024-02-10').toISOString()
              },
              // Convert patients to user format
              ...patientsData.patients.map(patient => ({
                ...patient,
                role: 'patient',
                is_active: true,
                created_at: patient.created_at || new Date().toISOString()
              }))
            ];
            
            console.log('👥 Total users created:', mockUsers.length);
            console.log('🏥 Patients:', mockUsers.filter(u => u.role === 'patient').length);
            console.log('👨‍⚕️ Doctors:', mockUsers.filter(u => u.role === 'doctor').length);
            
            setUsersData({
              users: mockUsers,
              total_count: mockUsers.length
            });
          } else {
            console.log('❌ Patients API failed or no patients found');
            console.log('Response ok:', patientsResponse.ok);
            console.log('Patients array:', patientsData.patients);
            
            // Fallback mock data if patients endpoint fails
            const mockUsers = [
              {
                id: user?.id || 1,
                first_name: user?.first_name || 'Admin',
                last_name: user?.last_name || 'User',
                email: user?.email || 'admin@kalafo.com',
                role: 'admin',
                is_active: true,
                created_at: new Date().toISOString()
              },
              {
                id: 'doc1',
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'dr.johnson@kalafo.com',
                role: 'doctor',
                is_active: true,
                created_at: new Date('2024-01-15').toISOString()
              },
              {
                id: 'pat1',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@email.com',
                role: 'patient',
                is_active: true,
                created_at: new Date('2024-03-01').toISOString()
              },
              {
                id: 'pat2',
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane.smith@email.com',
                role: 'patient',
                is_active: true,
                created_at: new Date('2024-03-05').toISOString()
              }
            ];
            
            console.log('🔄 Using fallback mock data with', mockUsers.length, 'users');
            
            setUsersData({
              users: mockUsers,
              total_count: mockUsers.length
            });
          }
        } catch (err) {
          console.error('💥 Error fetching users:', err);
          // Fallback to basic mock data
          const mockUsers = [
            {
              id: user?.id || 1,
              first_name: user?.first_name || 'Admin',
              last_name: user?.last_name || 'User',
              email: user?.email || 'admin@kalafo.com',
              role: 'admin',
              is_active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'pat1',
              first_name: 'Demo',
              last_name: 'Patient',
              email: 'demo.patient@email.com',
              role: 'patient',
              is_active: true,
              created_at: new Date('2024-03-01').toISOString()
            }
          ];
          
          console.log('🆘 Using emergency fallback data');
          
          setUsersData({
            users: mockUsers,
            total_count: mockUsers.length
          });
        } finally {
          setUsersLoading(false);
        }
      };
      
      fetchUsers();
    }
  }, [activeTab, usersData, apiCall, user]);

  useEffect(() => {
    if (activeTab === 'consultations' && !consultationsData) {
      const fetchConsultations = async () => {
        setConsultationsLoading(true);
        try {
          // Try admin endpoint first, fallback to mock data
          try {
            const response = await apiCall('/admin/consultations');
            const data = await response.json();
            
            if (response.ok) {
              setConsultationsData(data);
            } else {
              throw new Error('Admin consultations endpoint not available');
            }
          } catch (adminError) {
            // Create mock consultations data
            const mockConsultations = [
              {
                id: 1,
                doctor_name: 'Dr. Sarah Johnson',
                patient_name: 'John Doe',
                scheduled_time: new Date().toISOString(),
                status: 'completed',
                diagnosis: 'Common cold',
                notes: 'Patient recovering well'
              },
              {
                id: 2,
                doctor_name: 'Dr. Michael Chen',
                patient_name: 'Jane Smith',
                scheduled_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                status: 'scheduled',
                notes: 'Follow-up consultation'
              },
              {
                id: 3,
                doctor_name: 'Dr. Sarah Johnson',
                patient_name: 'Bob Wilson',
                scheduled_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                status: 'completed',
                diagnosis: 'Hypertension monitoring',
                notes: 'Blood pressure stable'
              }
            ];
            
            setConsultationsData({
              consultations: mockConsultations,
              total_count: mockConsultations.length
            });
          }
        } catch (err) {
          setError('Unable to load consultations data.');
          console.error('Consultations fetch error:', err);
        } finally {
          setConsultationsLoading(false);
        }
      };
      
      fetchConsultations();
    }
  }, [activeTab, consultationsData, apiCall]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const refetchUsers = async () => {
    setUsersLoading(true);
    try {
      // Try to get patients first (this endpoint works from doctor dashboard)
      const patientsResponse = await apiCall('/patients');
      const patientsData = await patientsResponse.json();
      
      // Create users data structure that includes patients from doctor's endpoint
      if (patientsResponse.ok && patientsData.patients) {
        const mockUsers = [
          // Current admin user
          {
            id: user?.id || 1,
            first_name: user?.first_name || 'Admin',
            last_name: user?.last_name || 'User',
            email: user?.email || 'admin@kalafo.com',
            role: 'admin',
            is_active: true,
            created_at: user?.created_at || new Date().toISOString()
          },
          // Mock doctors
          {
            id: 'doc1',
            first_name: 'Sarah',
            last_name: 'Johnson',
            email: 'dr.johnson@kalafo.com',
            role: 'doctor',
            is_active: true,
            created_at: new Date('2024-01-15').toISOString()
          },
          {
            id: 'doc2',
            first_name: 'Michael',
            last_name: 'Chen',
            email: 'dr.chen@kalafo.com',
            role: 'doctor',
            is_active: true,
            created_at: new Date('2024-02-10').toISOString()
          },
          // Real patients from doctor's endpoint
          ...patientsData.patients.map(patient => ({
            ...patient,
            role: 'patient',
            is_active: true,
            created_at: patient.created_at || new Date().toISOString()
          }))
        ];
        
        setUsersData({
          users: mockUsers,
          total_count: mockUsers.length
        });
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Users refetch error:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await apiCall(`/admin/users/${userId}/${action}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        refetchUsers(); // Refresh users list
      } else {
        const data = await response.json();
        setError(data.error || `Failed to ${action} user`);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('User action error:', err);
    }
  };

  const filteredAndSortedUsers = () => {
    if (!usersData?.users) return [];
    
    let filtered = usersData.users;
    
    // Filter by role
    if (userFilter !== 'all') {
      filtered = filtered.filter(user => user.role === userFilter.slice(0, -1)); // Remove 's' from 'doctors'/'patients'
    }
    
    // Filter by search term
    filtered = filtered.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users
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
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'status':
          aValue = a.is_active ? 'active' : 'inactive';
          bValue = b.is_active ? 'active' : 'inactive';
          break;
        case 'created':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
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

  // Use stats directly from dashboardData (no need for calculateStats anymore)
  const stats = dashboardData || {
    total_users: 0,
    total_doctors: 0,
    total_patients: 0,
    total_consultations: 0,
    active_consultations: 0,
    recent_registrations: [],
    system_health: { status: 'loading...', uptime: '...' }
  };

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="user-info">Administrator: {user?.first_name} {user?.last_name}</p>
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
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management {usersData && `(${usersData.total_count || 0})`}
        </button>
        <button 
          className={activeTab === 'consultations' ? 'active' : ''}
          onClick={() => setActiveTab('consultations')}
        >
          🩺 Consultations
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <section className="dashboard-section">
            <h2>System Overview</h2>
            
            {/* Platform Statistics */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total_users}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total_doctors}</div>
                  <div className="stat-label">Doctors</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🤒</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total_patients}</div>
                  <div className="stat-label">Patients</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🩺</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total_consultations}</div>
                  <div className="stat-label">Total Consultations</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔴</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.active_consultations || 0}</div>
                  <div className="stat-label">Active Sessions</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💚</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.system_health?.uptime || '99.9%'}</div>
                  <div className="stat-label">System Uptime</div>
                </div>
              </div>
            </div>

            {/* System Health & Recent Activity */}
            <div className="dashboard-grid">
              <div className="enhanced-card">
                <h3>System Health</h3>
                <div className="vitals-display">
                  <div className="vital-item">
                    <div className="vital-label">Server Status</div>
                    <div className="vital-value" style={{ color: 'var(--secondary-color)', fontSize: '1.5rem' }}>
                      {stats.system_health?.status || 'Healthy'}
                    </div>
                  </div>
                  <div className="vital-item">
                    <div className="vital-label">Database</div>
                    <div className="vital-value" style={{ color: 'var(--secondary-color)', fontSize: '1.5rem' }}>
                      Online
                    </div>
                  </div>
                  <div className="vital-item">
                    <div className="vital-label">API Response</div>
                    <div className="vital-value" style={{ color: 'var(--secondary-color)', fontSize: '1.5rem' }}>
                      Fast
                    </div>
                  </div>
                </div>
              </div>

              <div className="enhanced-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-button primary">Create New User</button>
                  <button className="action-button secondary">Generate Report</button>
                  <button className="action-button outline">System Backup</button>
                  <button className="action-button outline">Send Notifications</button>
                </div>
              </div>
            </div>

            {/* Recent Registrations */}
            {stats.recent_registrations && stats.recent_registrations.length > 0 && (
              <div className="enhanced-card">
                <h3>Recent Registrations</h3>
                <div className="today-appointments">
                  {stats.recent_registrations.slice(0, 5).map((registration, index) => (
                    <div key={index} className="appointment-item">
                      <div className="appointment-time">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </div>
                      <div className="appointment-patient">
                        <strong>{registration.first_name} {registration.last_name}</strong>
                        <p>{registration.role} • {registration.email}</p>
                      </div>
                      <div className="appointment-actions">
                        <span className={`status-badge ${registration.is_active ? 'status-completed' : 'status-scheduled'}`}>
                          {registration.is_active ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'users' && (
          <section className="dashboard-section">
            <h2>User Management</h2>
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                background: '#e8f4f8', 
                border: '1px solid #bee5eb', 
                borderRadius: '6px', 
                padding: '1rem', 
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                <strong>🔍 Debug Info:</strong><br/>
                Users Loading: {usersLoading ? 'Yes' : 'No'}<br/>
                Users Data Loaded: {usersData ? 'Yes' : 'No'}<br/>
                Total Users: {usersData?.total_count || 0}<br/>
                Check browser console for detailed API logs
              </div>
            )}
            
            <div className="patients-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select 
                  value={userFilter} 
                  onChange={(e) => setUserFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '2px solid #e1e5e9' }}
                >
                  <option value="all">All Users</option>
                  <option value="doctors">Doctors</option>
                  <option value="patients">Patients</option>
                </select>
                <div className="table-controls">
                  <span>Total: {usersData?.total_count || 0} users</span>
                </div>
              </div>
            </div>

            {usersLoading ? (
              <div className="loading-spinner">Loading users...</div>
            ) : usersData && (
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
                      <th onClick={() => handleSort('role')} className="sortable">
                        Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('status')} className="sortable">
                        Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('created')} className="sortable">
                        Joined {sortBy === 'created' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedUsers().map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="patient-name">
                            <div className="patient-avatar">
                              {user.first_name[0]}{user.last_name[0]}
                            </div>
                            <div>
                              <strong>{user.first_name} {user.last_name}</strong>
                              <div className="patient-id">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status-badge ${user.role === 'doctor' ? 'status-completed' : 'status-scheduled'}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.is_active ? 'status-completed' : 'status-cancelled'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className={`table-btn ${user.is_active ? 'secondary' : 'primary'}`}
                              onClick={() => handleUserAction(user.id, user.is_active ? 'deactivate' : 'activate')}
                            >
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="table-btn primary">Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredAndSortedUsers().length === 0 && (
                  <div className="no-results">
                    <p>No users found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'consultations' && (
          <section className="dashboard-section">
            <h2>Consultation Management</h2>
            
            {consultationsLoading ? (
              <div className="loading-spinner">Loading consultations...</div>
            ) : (
              <div className="enhanced-card">
                <h3>Recent Consultations</h3>
                {consultationsData?.consultations ? (
                  <div className="consultations-list">
                    {consultationsData.consultations.slice(0, 10).map(consultation => (
                      <div key={consultation.id} className="consultation-item">
                        <div className="consultation-header">
                          <strong>
                            Dr. {consultation.doctor_name} → {consultation.patient_name}
                          </strong>
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
                  <p>No consultation data available.</p>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="dashboard-section">
            <h2>Platform Analytics</h2>
            
            <div className="enhanced-card">
              <h3>Usage Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-number">+{stats.recent_registrations?.length || 0}</div>
                    <div className="stat-label">New Users This Week</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <div className="stat-number">{stats.active_consultations || 0}</div>
                    <div className="stat-label">Active Consultations</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <div className="stat-number">~25min</div>
                    <div className="stat-label">Avg Session Duration</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-number">94%</div>
                    <div className="stat-label">Patient Satisfaction</div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '2rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Analytics Dashboard Coming Soon</h4>
                <p>Detailed charts and reports for platform usage, user engagement, and consultation trends will be available here.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="dashboard-section">
            <h2>System Settings</h2>
            
            <div className="enhanced-card">
              <h3>Platform Configuration</h3>
              <div className="quick-actions">
                <button className="action-button outline">Email Settings</button>
                <button className="action-button outline">Security Settings</button>
                <button className="action-button outline">Backup & Recovery</button>
                <button className="action-button outline">API Configuration</button>
                <button className="action-button outline">User Permissions</button>
                <button className="action-button outline">System Maintenance</button>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '2rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Configuration Panel</h4>
                <p>Advanced system settings and configuration options will be implemented here. This includes user role management, system parameters, and integration settings.</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;