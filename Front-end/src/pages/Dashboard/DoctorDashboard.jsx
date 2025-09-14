import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar, Video, FileText, User, Activity,
  Maximize2, Minimize2, PhoneOff, Mic, MicOff, VideoOff,
  Bell, Settings, Users, Stethoscope, Plus, PlusCircle,
  Search, Upload, Download
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, apiCall, logout } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInCall, setIsInCall] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend data states
  const [doctorData, setDoctorData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    upcomingAppointments: 0,
    activePatients: 0,
    videoConsultations: 0,
    avgRating: 0
  });
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [patients, setPatients] = useState([]);

  // Video/Audio states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallFullscreen, setIsCallFullscreen] = useState(false);

  // Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  // Notes states
  const [currentNotes, setCurrentNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);

  // Stethoscope states
  const [isStethoscopeConnected, setIsStethoscopeConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [lungSounds, setLungSounds] = useState('normal');
  const [waveformData, setWaveformData] = useState([]);

  // Patient management states
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const notesRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch doctor dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch doctor dashboard data
        const dashboardResponse = await apiCall('/dashboard/doctor');
        
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData = await dashboardResponse.json();
        
        setDoctorData(dashboardData.doctor_info);
        setUpcomingConsultations(dashboardData.upcoming_consultations || []);
        setRecentConsultations(dashboardData.recent_consultations || []);

        // Calculate dashboard stats
        setDashboardStats({
          upcomingAppointments: dashboardData.upcoming_consultations?.length || 0,
          activePatients: 127, // This would need to be calculated from backend
          videoConsultations: dashboardData.recent_consultations?.length || 0,
          avgRating: 4.9 // This would come from reviews/ratings system
        });

        // Fetch patients if doctor has access
        try {
          const patientsResponse = await apiCall('/patients');
          if (patientsResponse.ok) {
            const patientsData = await patientsResponse.json();
            setPatients(patientsData.patients || []);
          }
        } catch (patientsError) {
          console.warn('Could not fetch patients:', patientsError.message);
        }

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
        
        // If it's an authentication error, logout
        if (err.message.includes('Session expired')) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, apiCall, logout]);

  // Get doctor's display name
  const getDoctorDisplayName = () => {
    if (!doctorData && !user) return 'Doctor';
    
    const userData = doctorData || user;
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    
    if (firstName && lastName) {
      return `Dr. ${firstName} ${lastName}`;
    } else if (firstName) {
      return `Dr. ${firstName}`;
    } else if (userData.email) {
      return `Dr. ${userData.email.split('@')[0]}`;
    }
    
    return 'Doctor';
  };

  // Convert backend consultation format to frontend format
  const formatConsultation = (consultation) => {
    return {
      id: consultation.id,
      patient: {
        name: consultation.patient_name || 'Unknown Patient',
        id: consultation.patient_id,
        age: 'N/A', // Would need to be added to backend
        condition: consultation.diagnosis || 'Consultation'
      },
      time: new Date(consultation.scheduled_time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: '30 min', // Default, could be calculated
      type: consultation.notes ? 'Follow-up' : 'Consultation',
      status: consultation.status,
      canStart: consultation.status === 'scheduled' && 
                new Date(consultation.scheduled_time) <= new Date(),
      notes: consultation.notes || `Consultation with ${consultation.patient_name}`
    };
  };

  // Convert backend consultation data for today's appointments
  const getTodaysAppointments = () => {
    const today = new Date().toDateString();
    return upcomingConsultations
      .filter(consultation => 
        new Date(consultation.scheduled_time).toDateString() === today
      )
      .map(formatConsultation);
  };

  // Filter patients based on search and filter
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = (patient.first_name + ' ' + patient.last_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedPatientFilter === 'all' || 
      (selectedPatientFilter === 'active' && patient.is_active) ||
      (selectedPatientFilter === 'new' && patient.consultation_count === 0);
    
    return matchesSearch && matchesFilter;
  });

  // Simulate heart rate monitoring when stethoscope connected
  useEffect(() => {
    if (isInCall && isStethoscopeConnected) {
      const interval = setInterval(() => {
        const newHeartRate = 65 + Math.random() * 20; // 65-85 BPM
        setHeartRate(Math.round(newHeartRate));
        setWaveformData(prev => {
          const newData = [...prev.slice(-80), newHeartRate];
          return newData;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isInCall, isStethoscopeConnected]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  // (Optional) Attach dummy streams to video tags so the layout feels alive
  useEffect(() => {
    if (!localVideoRef.current) return;
    // Create a tiny blank MediaStream when video is off, so element renders
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('Camera preview', 20, 40);
    }
    const stream = canvas.captureStream();
    if (localVideoRef.current && !localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject = stream;
    }
    if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, []);

  const startCall = (patient) => {
    setCurrentPatient(patient);
    setIsInCall(true);
    setCurrentNotes(patient.notes || '');
  };

  const endCall = () => {
    if (currentNotes.trim() && currentPatient) {
      const newNote = {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        date: new Date().toISOString(),
        notes: currentNotes,
        duration: '15 minutes'
      };
      setSavedNotes(prev => [...prev, newNote]);
    }
    setIsInCall(false);
    setCurrentPatient(null);
    setCurrentNotes('');
    setIsStethoscopeConnected(false);
    setWaveformData([]);
    setChatLog([]);
  };

  const saveNotes = () => {
    if (currentNotes.trim() && currentPatient) {
      const newNote = {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        date: new Date().toISOString(),
        notes: currentNotes,
        duration: '—'
      };
      setSavedNotes(prev => [...prev, newNote]);
      alert('Notes saved successfully!');
    }
  };

  const connectStethoscope = () => {
    setIsStethoscopeConnected(!isStethoscopeConnected);
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    setChatLog(prev => ([...prev, { sender: 'doctor', text: chatMessage, ts: new Date().toISOString() }]));
    setChatMessage('');
    // Simulate a short auto-reply from patient for demo purposes
    setTimeout(() => {
      setChatLog(prev => ([...prev, { sender: 'patient', text: 'Thanks, doc!', ts: new Date().toISOString() }]));
    }, 800);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '4px solid #e5e7eb', 
            borderTopColor: '#3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error Loading Dashboard</h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const todaysAppointments = getTodaysAppointments();

  const getDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Welcome */}
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '0.75rem', padding: '2rem', color: 'white' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                Good morning, {getDoctorDisplayName()}!
              </h2>
              <p style={{ opacity: 0.9, margin: '0.5rem 0 0 0' }}>
                You have {dashboardStats.upcomingAppointments} appointments today.
                {todaysAppointments.length > 0 && todaysAppointments[0].patient.name && 
                  ` Your next patient is ${todaysAppointments[0].patient.name} at ${todaysAppointments[0].time}.`
                }
              </p>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[{
                icon: <Calendar style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />,
                bg: '#dbeafe', title: "Today's Appointments", value: dashboardStats.upcomingAppointments
              }, {
                icon: <Users style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }} />,
                bg: '#dcfce7', title: 'Active Patients', value: dashboardStats.activePatients
              }, {
                icon: <Video style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} />,
                bg: '#fef3c7', title: 'Video Consultations', value: dashboardStats.videoConsultations
              }, {
                icon: <Activity style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} />,
                bg: '#fee2e2', title: 'Avg Rating', value: dashboardStats.avgRating
              }].map((c, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '0.75rem', background: c.bg, borderRadius: '0.5rem', marginRight: '1rem' }}>{c.icon}</div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{c.title}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{c.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Today's Schedule */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Today's Schedule</h3>
                <button onClick={() => setActiveTab('appointments')} style={{ color: '#3b82f6', fontWeight: 500, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>View All</button>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {todaysAppointments.length > 0 ? todaysAppointments.map((appointment) => (
                  <div key={appointment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: '0 0 0.25rem 0' }}>{appointment.patient.name} ({appointment.patient.age}y)</h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{appointment.type} • {appointment.patient.condition}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>{appointment.time}</p>
                        <p style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', margin: 0, background: appointment.status === 'completed' ? '#dcfce7' : appointment.status === 'scheduled' ? '#fef3c7' : '#f3f4f6', color: appointment.status === 'completed' ? '#166534' : appointment.status === 'scheduled' ? '#92400e' : '#6b7280' }}>{appointment.status}</p>
                      </div>
                      {appointment.canStart && (
                        <button onClick={() => startCall(appointment.patient)} style={{ background: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Video style={{ width: '1rem', height: '1rem' }} /> Start Call
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Notes */}
            {savedNotes.length > 0 && (
              <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Recent Consultation Notes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {savedNotes.slice(-3).map((note, index) => (
                    <div key={index} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem', borderLeft: '4px solid #3b82f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>{note.patientName}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{note.notes.length > 100 ? `${note.notes.substring(0, 100)}...` : note.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'appointments':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Appointments Header */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Appointment Management</h3>
                <button style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus style={{ width: '1rem', height: '1rem' }} /> Block Time Slot
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
                <select style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', background: 'white' }}>
                  <option value="all">All Appointments</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Today's Schedule Detail */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Today's Schedule - {new Date().toLocaleDateString()}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {todaysAppointments.length > 0 ? todaysAppointments.map((appointment) => (
                  <div key={appointment.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: '0 0 0.25rem 0' }}>{appointment.patient.name} (ID: {appointment.patient.id})</h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>Age: {appointment.patient.age} • {appointment.patient.condition}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          <span>🕐 {appointment.time}</span>
                          <span>⏱️ {appointment.duration}</span>
                          <span>📋 {appointment.type}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: appointment.status === 'completed' ? '#dcfce7' : appointment.status === 'scheduled' ? '#fef3c7' : '#f3f4f6', color: appointment.status === 'completed' ? '#166534' : appointment.status === 'scheduled' ? '#92400e' : '#6b7280', fontWeight: 500 }}>{appointment.status}</span>
                        {appointment.canStart && (
                          <button onClick={() => startCall(appointment.patient)} style={{ background: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Video style={{ width: '1rem', height: '1rem' }} /> Start
                          </button>
                        )}
                      </div>
                    </div>
                    {appointment.notes && (
                      <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Pre-visit Notes:</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Patient Management Header */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Patient Management</h3>
                <button style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PlusCircle style={{ width: '1rem', height: '1rem' }} /> Add New Patient
                </button>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#6b7280' }} />
                  <input type="text" placeholder="Search patients by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
                </div>
                <select value={selectedPatientFilter} onChange={(e) => setSelectedPatientFilter(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', background: 'white' }}>
                  <option value="all">All Patients</option>
                  <option value="active">Active Patients</option>
                  <option value="new">New Patients</option>
                </select>
              </div>
            </div>

            {/* Patient List */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Patient List ({filteredPatients.length} patients)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                  <div key={patient.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: '0 0 0.25rem 0' }}>
                          {patient.first_name} {patient.last_name} (ID: {patient.id})
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                          Consultations: {patient.consultation_count || 0} • Last visit: {patient.last_consultation ? new Date(patient.last_consultation).toLocaleDateString() : 'Never'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          <span>📞 {patient.phone || 'N/A'}</span>
                          <span>📧 {patient.email}</span>
                          <span>📅 Joined: {new Date(patient.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: patient.is_active ? '#dcfce7' : '#fef3c7', color: patient.is_active ? '#166534' : '#92400e', fontWeight: 500 }}>
                          {patient.is_active ? 'active' : 'inactive'}
                        </span>
                        <button onClick={() => setActiveTab('records')} style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText style={{ width: '1rem', height: '1rem' }} /> View Records
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <Users style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No patients found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'records':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Patient Selection */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Medical Records Access</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', background: 'white', minWidth: '200px' }}>
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.id}
                    </option>
                  ))}
                </select>
                <button style={{ background: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload style={{ width: '1rem', height: '1rem' }} /> Upload Records
                </button>
              </div>
            </div>

            {/* Sample Records Display */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Recent Consultations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentConsultations.length > 0 ? recentConsultations.map((consultation) => (
                  <div key={consultation.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', margin: '0 0 0.25rem 0' }}>
                          {consultation.patient_name}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                          Date: {new Date(consultation.scheduled_time).toLocaleDateString()}
                        </p>
                      </div>
                      <button style={{ background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                        <Download style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </button>
                    </div>

                    {consultation.diagnosis && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Diagnosis:</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{consultation.diagnosis}</p>
                      </div>
                    )}

                    {consultation.notes && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Clinical Notes:</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{consultation.notes}</p>
                      </div>
                    )}

                    <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #16a34a' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#15803d' }}>Status:</strong>
                      <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>{consultation.status}</p>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <FileText style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No consultation records found</p>
                  </div>
                )}
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
                  <Stethoscope style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Kalafo - Doctor Portal</h1>
              </div>
              <nav style={{ display: 'flex', gap: '2rem' }}>
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'appointments', label: 'Appointments' },
                  { key: 'patients', label: 'Patients' },
                  { key: 'records', label: 'Medical Records' }
                ].map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: '0.375rem', border: 'none', cursor: 'pointer', background: activeTab === t.key ? '#dbeafe' : 'transparent', color: activeTab === t.key ? '#1d4ed8' : '#6b7280', transition: 'all 0.15s ease' }}>{t.label}</button>
                ))}
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <button style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                <Settings style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <div style={{ width: '2rem', height: '2rem', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                  {getDoctorDisplayName().split(' ').map(name => name[0]).join('').slice(0, 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ width: isInCall ? '60%' : '100%', transition: 'all 0.3s ease' }}>
            {getDashboardContent()}
          </div>

          {/* Video Call Panel */}
          {isInCall && (
            <div style={{ width: isCallFullscreen ? '100vw' : '40%', height: isCallFullscreen ? '100vh' : 'auto', position: isCallFullscreen ? 'fixed' : 'relative', top: isCallFullscreen ? 0 : 'auto', left: isCallFullscreen ? 0 : 'auto', zIndex: isCallFullscreen ? 50 : 'auto', background: isCallFullscreen ? 'black' : 'transparent', transition: 'all 0.3s ease' }}>
              <div style={{ background: 'white', borderRadius: isCallFullscreen ? 0 : '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column', maxHeight: isCallFullscreen ? '100vh' : '900px' }}>
                {/* Call Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', margin: 0 }}>Consultation with {currentPatient?.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => setIsCallFullscreen(!isCallFullscreen)} style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>{isCallFullscreen ? <Minimize2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} /> : <Maximize2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />}</button>
                      <button onClick={endCall} style={{ padding: '0.5rem', background: '#fee2e2', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                        <PhoneOff style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Area */}
                <div style={{ height: 300, position: 'relative', background: '#111827', overflow: 'hidden' }}>
                  {/* Remote (patient) */}
                  <div style={{ width: '100%', height: '100%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <video ref={remoteVideoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isVideoOn ? 'none' : 'grayscale(1) brightness(0.4)' }} autoPlay playsInline />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>Patient: {currentPatient?.name}</div>
                  </div>
                  {/* Local (doctor) PiP */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '6rem', height: '4.5rem', background: '#374151', borderRadius: '0.5rem', border: '2px solid white', overflow: 'hidden' }}>
                    <video ref={localVideoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isVideoOn ? 'none' : 'grayscale(1) brightness(0.4)' }} autoPlay muted playsInline />
                    <div style={{ position: 'absolute', bottom: '0.25rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.625rem', textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>You</div>
                  </div>
                </div>

                {/* Stethoscope Panel */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>Digital Stethoscope</h4>
                    <button onClick={connectStethoscope} style={{ background: isStethoscopeConnected ? '#16a34a' : '#6b7280', color: 'white', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Stethoscope style={{ width: '0.875rem', height: '0.875rem' }} /> {isStethoscopeConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>

                  {isStethoscopeConnected && (
                    <div>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #16a34a', flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 500 }}>Heart Rate</div>
                          <div style={{ fontSize: '1.25rem', color: '#166534', fontWeight: 'bold' }}>{heartRate} BPM</div>
                        </div>
                        <div style={{ background: '#f0f9ff', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #0ea5e9', flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 500 }}>Lung Sounds</div>
                          <div style={{ fontSize: '1rem', color: '#075985', fontWeight: 'bold' }}>{lungSounds}</div>
                        </div>
                      </div>
                      {/* Waveform */}
                      <div style={{ height: 60, background: '#111827', borderRadius: '0.375rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', color: '#16a34a', fontSize: '0.75rem', fontWeight: 500 }}>Heart Rhythm</div>
                        <svg width="100%" height="60" style={{ position: 'absolute', bottom: 0 }}>
                          {waveformData.map((value, index) => (
                            <line key={index} x1={index * 4} y1={60} x2={index * 4} y2={60 - (value - 65) * 2} stroke="#16a34a" strokeWidth="2" />
                          ))}
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call Controls */}
                <div style={{ padding: '1rem', background: '#f3f4f6', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <button onClick={() => setIsVideoOn(!isVideoOn)} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isVideoOn ? '#3b82f6' : '#dc2626', color: 'white' }}>{isVideoOn ? <Video style={{ width: '1rem', height: '1rem' }} /> : <VideoOff style={{ width: '1rem', height: '1rem' }} />}</button>
                  <button onClick={() => setIsAudioOn(!isAudioOn)} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAudioOn ? '#3b82f6' : '#dc2626', color: 'white' }}>{isAudioOn ? <Mic style={{ width: '1rem', height: '1rem' }} /> : <MicOff style={{ width: '1rem', height: '1rem' }} />}</button>
                  <button onClick={endCall} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dc2626', color: 'white' }}>
                    <PhoneOff style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>

                {/* Notes + Chat */}
                <div style={{ display: 'grid', gridTemplateColumns: isNotesExpanded ? '1fr' : '1.2fr 0.8fr', gap: '1rem', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  {/* Clinical Notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>Clinical Notes</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setIsNotesExpanded(!isNotesExpanded)} style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.375rem', cursor: 'pointer', fontSize: '0.75rem' }}>{isNotesExpanded ? <Minimize2 style={{ width: '0.875rem', height: '0.875rem' }} /> : <Maximize2 style={{ width: '0.875rem', height: '0.875rem' }} />}</button>
                        <button onClick={saveNotes} disabled={!currentNotes.trim()} style={{ background: currentNotes.trim() ? '#16a34a' : '#d1d5db', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.375rem 0.75rem', cursor: currentNotes.trim() ? 'pointer' : 'not-allowed', fontSize: '0.75rem', fontWeight: 600 }}>Save</button>
                      </div>
                    </div>
                    <textarea ref={notesRef} value={currentNotes} onChange={(e) => setCurrentNotes(e.target.value)} placeholder="Type SOAP notes, symptoms, assessment, plan..." rows={isNotesExpanded ? 14 : 8} style={{ width: '100%', resize: 'vertical', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }} />

                    {savedNotes.length > 0 && (
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem' }}>
                        <strong style={{ fontSize: '0.75rem', color: '#374151' }}>Recent notes for this session:</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                          {savedNotes.slice(-2).map((n, i) => (
                            <li key={i}>{n.patientName}: {n.notes.slice(0, 60)}{n.notes.length > 60 ? '…' : ''}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Chat */}
                  {!isNotesExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                      <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Chat with {currentPatient?.name}</strong>
                      </div>
                      <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 240, overflowY: 'auto' }}>
                        {chatLog.map((m, idx) => (
                          <div key={idx} style={{ alignSelf: m.sender === 'doctor' ? 'flex-end' : 'flex-start', background: m.sender === 'doctor' ? '#dbeafe' : '#f3f4f6', color: '#111827', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', maxWidth: '80%' }}>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 4 }}>{m.sender === 'doctor' ? 'You' : currentPatient?.name}</div>
                            <div style={{ fontSize: '0.875rem' }}>{m.text}</div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <div style={{ padding: '0.75rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
                        <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }} placeholder="Type a message…" style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }} />
                        <button onClick={sendChatMessage} style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 0.9rem', borderRadius: '0.375rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add loading spinner animation */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DoctorDashboard;