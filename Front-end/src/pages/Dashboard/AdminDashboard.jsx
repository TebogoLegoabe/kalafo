import React, { useState } from 'react';
import {
  Calendar, Video, FileText, User, Clock, Heart,
  Phone, PhoneOff, Mic, MicOff, VideoOff,
  Bell, Settings, Search, Plus, MapPin, Star,
  Download, Eye, ChevronRight, Activity,
  Maximize2, Minimize2, MessageSquare, Edit,
  Save, X, Users, Stethoscope, BarChart3,
  PlusCircle, Upload, Filter, ChevronDown,
  Shield, UserPlus, UserX, AlertTriangle,
  TrendingUp, TrendingDown, DollarSign,
  CheckCircle, XCircle, Clock3, Award,
  Monitor, Database, Trash2, Lock, Unlock
} from 'lucide-react';

const field = (label, el) => (
  <label style={{ display: 'grid', gap: 6 }}>
    <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
    {el}
  </label>
);

const inputStyle = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  width: '100%'
};

const card = {
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  padding: '1.5rem'
};

const AdminDashboard = () => {
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');

  // Management states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'doctor' or 'patient'

  // Form states
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    license: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: ''
  });

  // System Overview
  const [systemStats] = useState({
    totalUsers: 1542,
    totalDoctors: 89,
    totalPatients: 1453,
    activeConsultations: 12,
    todayAppointments: 156,
    completedToday: 89,
    revenue: 24580,
    avgRating: 4.8
  });

  // Recent Activities
  const [recentActivities] = useState([
    { id: 1, type: 'appointment', message: 'Dr. Sarah Wilson completed consultation with John Miller', timestamp: '2 minutes ago', status: 'success' },
    { id: 2, type: 'registration', message: 'New patient registered: Emily Davis', timestamp: '15 minutes ago', status: 'info' },
    { id: 3, type: 'alert', message: 'System maintenance scheduled for tonight', timestamp: '1 hour ago', status: 'warning' },
    { id: 4, type: 'payment', message: 'Payment received from patient P003', timestamp: '2 hours ago', status: 'success' }
  ]);

  // Doctors
  const [doctorsData, setDoctorsData] = useState([
    { id: 'D001', name: 'Dr. Sarah Wilson', email: 'sarah.wilson@telemed.com', phone: '+1 555-0101', specialty: 'Cardiologist', experience: '15 years', license: 'MD123456', status: 'active', rating: 4.9, consultationsToday: 8, totalConsultations: 1247, joinDate: '2023-01-15', lastActive: '5 minutes ago', revenue: 15420 },
    { id: 'D002', name: 'Dr. Michael Chen', email: 'michael.chen@telemed.com', phone: '+1 555-0102', specialty: 'General Practitioner', experience: '12 years', license: 'MD123457', status: 'active', rating: 4.8, consultationsToday: 6, totalConsultations: 892, joinDate: '2023-02-20', lastActive: '12 minutes ago', revenue: 12680 },
    { id: 'D003', name: 'Dr. Emily Johnson', email: 'emily.johnson@telemed.com', phone: '+1 555-0103', specialty: 'Dermatologist', experience: '10 years', license: 'MD123458', status: 'inactive', rating: 4.7, consultationsToday: 0, totalConsultations: 654, joinDate: '2023-03-10', lastActive: '2 days ago', revenue: 8930 }
  ]);

  // Patients
  const [patientsData, setPatientsData] = useState([
    { id: 'P001', name: 'John Miller', email: 'john.miller@email.com', phone: '+1 555-0201', age: 45, dateOfBirth: '1978-08-15', address: '123 Main St, City, State', emergencyContact: '+1 555-0301', status: 'active', joinDate: '2023-06-10', lastConsultation: '2024-01-10', totalConsultations: 12, totalSpent: 1420, currentDoctor: 'Dr. Sarah Wilson', medicalConditions: ['Hypertension', 'Diabetes Type 2'] },
    { id: 'P002', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '+1 555-0202', age: 32, dateOfBirth: '1991-03-22', address: '456 Oak Ave, City, State', emergencyContact: '+1 555-0302', status: 'active', joinDate: '2023-08-05', lastConsultation: '2024-01-12', totalConsultations: 8, totalSpent: 920, currentDoctor: 'Dr. Michael Chen', medicalConditions: ['Allergies'] },
    { id: 'P003', name: 'Michael Chen', email: 'michael.chen@email.com', phone: '+1 555-0203', age: 28, dateOfBirth: '1995-11-08', address: '789 Pine St, City, State', emergencyContact: '+1 555-0303', status: 'new', joinDate: '2024-01-14', lastConsultation: 'Never', totalConsultations: 0, totalSpent: 0, currentDoctor: 'Not assigned', medicalConditions: ['None reported'] }
  ]);

  const filteredDoctors = doctorsData.filter(d =>
    (d.name + d.specialty).toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'all' || d.status === selectedFilter)
  );
  const filteredPatients = patientsData.filter(p =>
    (p.name + p.email).toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'all' || p.status === selectedFilter)
  );

  const openUserModal = (type) => {
    setModalType(type);
    setShowUserModal(true);
    setNewUserData({ name: '', email: '', phone: '', specialty: '', experience: '', license: '', address: '', dateOfBirth: '', emergencyContact: '' });
  };

  const handleCreateUser = () => {
    if (!newUserData.name || !newUserData.email) {
      alert('Please fill at least name and email');
      return;
    }
    if (modalType === 'doctor') {
      const newDoctor = {
        id: `D${String(doctorsData.length + 1).padStart(3, '0')}`,
        name: newUserData.name,
        email: newUserData.email,
        phone: newUserData.phone,
        specialty: newUserData.specialty,
        experience: newUserData.experience,
        license: newUserData.license,
        status: 'active',
        rating: 0,
        consultationsToday: 0,
        totalConsultations: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just joined',
        revenue: 0
      };
      setDoctorsData([...doctorsData, newDoctor]);
    } else {
      const newPatient = {
        id: `P${String(patientsData.length + 1).padStart(3, '0')}`,
        name: newUserData.name,
        email: newUserData.email,
        phone: newUserData.phone,
        age: newUserData.dateOfBirth ? (new Date().getFullYear() - new Date(newUserData.dateOfBirth).getFullYear()) : null,
        dateOfBirth: newUserData.dateOfBirth,
        address: newUserData.address,
        emergencyContact: newUserData.emergencyContact,
        status: 'new',
        joinDate: new Date().toISOString().split('T')[0],
        lastConsultation: 'Never',
        totalConsultations: 0,
        totalSpent: 0,
        currentDoctor: 'Not assigned',
        medicalConditions: ['None reported']
      };
      setPatientsData([...patientsData, newPatient]);
    }
    setShowUserModal(false);
    alert(`New ${modalType} created successfully!`);
  };

  const toggleUserStatus = (userId, userType) => {
    if (userType === 'doctor') {
      setDoctorsData(doctorsData.map(doc => doc.id === userId ? { ...doc, status: doc.status === 'active' ? 'inactive' : 'active' } : doc));
    } else {
      setPatientsData(patientsData.map(p => p.id === userId ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' } : p));
    }
  };

  const getDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Welcome */}
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '0.75rem', padding: '2rem', color: 'white' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>TeleMed Pro Administration</h2>
              <p style={{ opacity: 0.9, margin: '0.5rem 0 0 0' }}>System overview and management dashboard. {systemStats.activeConsultations} active consultations in progress.</p>
            </div>

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  iconBg: '#dbeafe',
                  icon: <Users style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />,
                  trend: <TrendingUp style={{ width: '1rem', height: '1rem', color: '#16a34a' }} />,
                  value: systemStats.totalUsers,
                  label: 'Total Users'
                },
                {
                  iconBg: '#dcfce7',
                  icon: <Stethoscope style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />,
                  trend: <CheckCircle style={{ width: '1rem', height: '1rem', color: '#16a34a' }} />,
                  value: systemStats.totalDoctors,
                  label: 'Active Doctors'
                },
                {
                  iconBg: '#fef3c7',
                  icon: <Heart style={{ width: '1.25rem', height: '1.25rem', color: '#d97706' }} />,
                  trend: <TrendingUp style={{ width: '1rem', height: '1rem', color: '#16a34a' }} />,
                  value: systemStats.totalPatients,
                  label: 'Registered Patients'
                },
                {
                  iconBg: '#fee2e2',
                  icon: <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />,
                  trend: <TrendingUp style={{ width: '1rem', height: '1rem', color: '#16a34a' }} />,
                  value: `$${systemStats.revenue.toLocaleString()}`,
                  label: "Today's Revenue"
                }
              ].map((m, i) => (
                <div key={i} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ padding: '0.5rem', background: m.iconBg, borderRadius: '0.5rem' }}>{m.icon}</div>
                    {m.trend}
                  </div>
                  <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{m.value}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Summary + Recent */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={card}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Today's Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    ['Scheduled Appointments', systemStats.todayAppointments, '#111827'],
                    ['Completed Consultations', systemStats.completedToday, '#16a34a'],
                    ['Active Sessions', systemStats.activeConsultations, '#d97706'],
                    ['Average Rating', systemStats.avgRating, '#111827', 'star']
                  ].map(([label, value, color, kind], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{label}</span>
                      {kind === 'star' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ fontSize: '1.125rem', fontWeight: 600, color }}>{value}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.125rem', fontWeight: 600, color }}>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentActivities.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'success' ? '#16a34a' : a.status === 'warning' ? '#d97706' : '#3b82f6' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', color: '#111827', margin: 0 }}>{a.message}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{a.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={card}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { key: 'doctor', label: 'Add Doctor', desc: 'Register new medical professional', Icon: UserPlus, grad: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
                  { key: 'patient', label: 'Add Patient', desc: 'Register new patient', Icon: Heart, grad: 'linear-gradient(135deg, #16a34a, #15803d)' },
                  { key: 'analytics', label: 'View Analytics', desc: 'Platform performance metrics', Icon: BarChart3, grad: 'linear-gradient(135deg, #d97706, #b45309)' },
                  { key: 'alerts', label: 'System Alerts', desc: 'Monitor system status', Icon: AlertTriangle, grad: 'linear-gradient(135deg, #dc2626, #b91c1c)' }
                ].map(({ key, label, desc, Icon, grad }) => (
                  <button
                    key={key}
                    onClick={() => (key === 'doctor' || key === 'patient') ? openUserModal(key) : key === 'analytics' ? setActiveTab('analytics') : null}
                    style={{ background: grad, color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <Icon style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem', display: 'block' }} />
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'doctors':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Doctor Management</h3>
                <button
                  onClick={() => openUserModal('doctor')}
                  style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <UserPlus style={{ width: '1rem', height: '1rem' }} /> Add New Doctor
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input type="text" placeholder="Search doctors by name or specialty..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
                </div>
                <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div style={card}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Doctors ({filteredDoctors.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredDoctors.map(doctor => (
                  <div key={doctor.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3rem', height: '3rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Stethoscope style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: 0 }}>{doctor.name}</h4>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>{doctor.specialty} â€¢ {doctor.experience}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>License: {doctor.license} â€¢ ID: {doctor.id}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: doctor.status === 'active' ? '#dcfce7' : '#fee2e2', color: doctor.status === 'active' ? '#166534' : '#dc2626', fontWeight: 500 }}>{doctor.status}</span>
                        <button onClick={() => toggleUserStatus(doctor.id, 'doctor')} style={{ background: doctor.status === 'active' ? '#fee2e2' : '#dcfce7', color: doctor.status === 'active' ? '#dc2626' : '#16a34a', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                          {doctor.status === 'active' ? <Lock style={{ width: '1rem', height: '1rem' }} /> : <Unlock style={{ width: '1rem', height: '1rem' }} />}
                        </button>
                        <button style={{ background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.5rem', cursor: 'pointer' }}>
                          <Edit style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Contact</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{doctor.email}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{doctor.phone}</p>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Performance</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <Star style={{ width: '0.875rem', height: '0.875rem', color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{doctor.rating}/5.0</span>
                        </div>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{doctor.totalConsultations} total consultations</p>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Today</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{doctor.consultationsToday} consultations</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Revenue: ${' '}{doctor.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Status</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Joined: {doctor.joinDate}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Last active: {doctor.lastActive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Patient Management</h3>
                <button
                  onClick={() => openUserModal('patient')}
                  style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <UserPlus style={{ width: '1rem', height: '1rem' }} /> Add New Patient
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input type="text" placeholder="Search patients by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
                </div>
                <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="new">New</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Patients ({filteredPatients.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredPatients.map(patient => (
                  <div key={patient.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3rem', height: '3rem', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Heart style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: 0 }}>{patient.name}</h4>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>Age: {patient.age} â€¢ ID: {patient.id}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>DOB: {patient.dateOfBirth}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: patient.status === 'active' ? '#dcfce7' : patient.status === 'new' ? '#fef3c7' : '#fee2e2', color: patient.status === 'active' ? '#166534' : patient.status === 'new' ? '#92400e' : '#dc2626', fontWeight: 500 }}>{patient.status}</span>
                        <button onClick={() => toggleUserStatus(patient.id, 'patient')} style={{ background: patient.status === 'suspended' ? '#dcfce7' : '#fee2e2', color: patient.status === 'suspended' ? '#16a34a' : '#dc2626', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                          {patient.status === 'suspended' ? <Unlock style={{ width: '1rem', height: '1rem' }} /> : <Lock style={{ width: '1rem', height: '1rem' }} />}
                        </button>
                        <button style={{ background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.5rem', cursor: 'pointer' }}>
                          <Edit style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Contact</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{patient.email}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{patient.phone}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Emergency: {patient.emergencyContact}</p>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Medical Info</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Assigned: {patient.currentDoctor}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Conditions: {patient.medicalConditions.join(', ')}</p>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Activity</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{patient.totalConsultations} consultations</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Last visit: {patient.lastConsultation}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Total spent: ${' '}{patient.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Registration</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Joined: {patient.joinDate}</p>
                        <p style={{ margin: '2px 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Address: {patient.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Platform Analytics</h3>
                <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: 0 }}>Total Revenue</h4>
                  <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>$147,250</p>
                <p style={{ fontSize: '0.875rem', color: '#16a34a', margin: 0 }}>+12.5% from last period</p>
              </div>
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: 0 }}>Total Consultations</h4>
                  <Activity style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>2,847</p>
                <p style={{ fontSize: '0.875rem', color: '#3b82f6', margin: 0 }}>+8.2% from last period</p>
              </div>
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: 0 }}>Avg Session Duration</h4>
                  <Clock3 style={{ width: '1.25rem', height: '1.25rem', color: '#d97706' }} />
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>23.4 min</p>
                <p style={{ fontSize: '0.875rem', color: '#d97706', margin: 0 }}>+2.1 min from last period</p>
              </div>
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: 0 }}>Patient Satisfaction</h4>
                  <Award style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>4.8/5.0</p>
                <p style={{ fontSize: '0.875rem', color: '#16a34a', margin: 0 }}>+0.2 from last period</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <div style={card}>
                <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: '0 0 1rem 0' }}>Top Performing Doctors</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[...doctorsData].sort((a, b) => b.rating - a.rating).slice(0, 5).map((d, i) => (
                    <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, height: 24, background: i < 3 ? '#fbbf24' : '#d1d5db', color: i < 3 ? 'white' : '#6b7280', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>{i + 1}</span>
                        <span style={{ fontSize: '0.875rem', color: '#111827' }}>{d.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star style={{ width: '0.875rem', height: '0.875rem', color: '#fbbf24', fill: '#fbbf24' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{d.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={card}>
                <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: '0 0 1rem 0' }}>System Health</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    ['Server Uptime', '99.9%', '#16a34a'],
                    ['Active Connections', '1,247', '#111827'],
                    ['Database Health', 'Optimal', '#16a34a'],
                    ['Response Time', '127ms', '#16a34a']
                  ].map(([k, v, c], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{k}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>TeleMed Pro - Admin Panel</h1>
              </div>
              <nav style={{ display: 'flex', gap: '2rem' }}>
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'doctors', label: 'Doctors' },
                  { key: 'patients', label: 'Patients' },
                  { key: 'analytics', label: 'Analytics' }
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === t.key ? '#dbeafe' : 'transparent',
                      color: activeTab === t.key ? '#1d4ed8' : '#6b7280'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button title="Notifications" style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <button title="Settings" style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                <Settings style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <div style={{ width: '2rem', height: '2rem', background: '#1d4ed8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>AD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {getDashboardContent()}
      </div>

      {/* Create User Modal */}
      {showUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ width: 'min(720px, 94vw)', background: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>Add {modalType === 'doctor' ? 'Doctor' : 'Patient'}</h3>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X style={{ width: '1.1rem', height: '1.1rem', color: '#6b7280' }} />
              </button>
            </div>

            <div style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {field('Full Name', <input value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} style={inputStyle} placeholder="Jane Doe" />)}
                {field('Email', <input type="email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} style={inputStyle} placeholder="jane@domain.com" />)}
                {field('Phone', <input value={newUserData.phone} onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })} style={inputStyle} placeholder="+1 555-0123" />)}

                {modalType === 'doctor' && (
                  <>
                    {field('Specialty', <input value={newUserData.specialty} onChange={(e) => setNewUserData({ ...newUserData, specialty: e.target.value })} style={inputStyle} placeholder="Cardiologist" />)}
                    {field('Experience', <input value={newUserData.experience} onChange={(e) => setNewUserData({ ...newUserData, experience: e.target.value })} style={inputStyle} placeholder="10 years" />)}
                    {field('License No.', <input value={newUserData.license} onChange={(e) => setNewUserData({ ...newUserData, license: e.target.value })} style={inputStyle} placeholder="MD123456" />)}
                  </>
                )}

                {modalType === 'patient' && (
                  <>
                    {field('Date of Birth', <input type="date" value={newUserData.dateOfBirth} onChange={(e) => setNewUserData({ ...newUserData, dateOfBirth: e.target.value })} style={inputStyle} />)}
                    {field('Address', <input value={newUserData.address} onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })} style={inputStyle} placeholder="123 Main St" />)}
                    {field('Emergency Contact', <input value={newUserData.emergencyContact} onChange={(e) => setNewUserData({ ...newUserData, emergencyContact: e.target.value })} style={inputStyle} placeholder="+1 555-0456" />)}
                  </>
                )}
              </div>
            </div>

            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowUserModal(false)} style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreateUser} style={{ background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 0.9rem', cursor: 'pointer', fontWeight: 600 }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;