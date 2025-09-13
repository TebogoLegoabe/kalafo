import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Video, FileText, User, Clock, Heart, 
  Phone, PhoneOff, Mic, MicOff, VideoOff,
  Bell, Settings, Search, Plus, MapPin, Star,
  Download, Eye, ChevronRight, Activity,
  Maximize2, Minimize2, MessageSquare
} from 'lucide-react';

const PatientDashboard = () => {
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInCall, setIsInCall] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallFullscreen, setIsCallFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  // Appointment booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Sample data
  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctor: { name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', id: 'D001' },
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Follow-up Consultation',
      status: 'confirmed',
      canJoin: true
    },
    {
      id: 2,
      doctor: { name: 'Dr. Michael Chen', specialty: 'General Practitioner', id: 'D002' },
      date: '2024-01-18',
      time: '2:30 PM',
      type: 'Regular Checkup',
      status: 'confirmed',
      canJoin: false
    },
    {
      id: 3,
      doctor: { name: 'Dr. Emily Johnson', specialty: 'Dermatologist', id: 'D003' },
      date: '2024-01-22',
      time: '11:15 AM',
      type: 'Skin Consultation',
      status: 'pending',
      canJoin: false
    }
  ]);

  const [medicalHistory] = useState([
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Sarah Wilson',
      type: 'Consultation',
      diagnosis: 'Routine cardiovascular checkup',
      notes: 'Blood pressure normal, heart rate steady. Continue current medication.',
      prescription: 'Lisinopril 10mg daily'
    },
    {
      id: 2,
      date: '2024-01-05',
      doctor: 'Dr. Michael Chen',
      type: 'Blood Test',
      diagnosis: 'Annual blood work',
      notes: 'All levels within normal range. Vitamin D slightly low.',
      prescription: 'Vitamin D3 1000IU daily'
    },
    {
      id: 3,
      date: '2023-12-20',
      doctor: 'Dr. Emily Johnson',
      type: 'Dermatology Consultation',
      diagnosis: 'Eczema flare-up',
      notes: 'Mild eczema on arms. Recommended moisturizing routine.',
      prescription: 'Hydrocortisone cream 1% as needed'
    }
  ]);

  const [availableDoctors] = useState([
    { id: 'D001', name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', rating: 4.9, experience: '15 years' },
    { id: 'D002', name: 'Dr. Michael Chen', specialty: 'General Practitioner', rating: 4.8, experience: '12 years' },
    { id: 'D003', name: 'Dr. Emily Johnson', specialty: 'Dermatologist', rating: 4.7, experience: '10 years' },
    { id: 'D004', name: 'Dr. James Martinez', specialty: 'Psychiatrist', rating: 4.9, experience: '18 years' }
  ]);

  const joinCall = (doctor) => {
    setCurrentDoctor(doctor);
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setCurrentDoctor(null);
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !appointmentReason) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate API call
    alert('Appointment booked successfully!');
    
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setAppointmentReason('');
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      // Here you would send the message to the doctor
      console.log('Message sent:', chatMessage);
      setChatMessage('');
    }
  };

  const getDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Welcome Section */}
            <div style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              borderRadius: '0.75rem', 
              padding: '2rem',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                Welcome back, John!
              </h2>
              <p style={{ opacity: 0.9, margin: 0 }}>
                Your next appointment is today at 10:00 AM with Dr. Sarah Wilson
              </p>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '0.75rem', background: '#dbeafe', borderRadius: '0.5rem', marginRight: '1rem' }}>
                    <Calendar style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Upcoming Appointments</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>3</p>
                  </div>
                </div>
              </div>
              
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '0.75rem', background: '#dcfce7', borderRadius: '0.5rem', marginRight: '1rem' }}>
                    <Video style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Video Consultations</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>12</p>
                  </div>
                </div>
              </div>
              
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem', marginRight: '1rem' }}>
                    <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Medical Records</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>8</p>
                  </div>
                </div>
              </div>
              
              <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '0.75rem', background: '#fee2e2', borderRadius: '0.5rem', marginRight: '1rem' }}>
                    <Heart style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Health Score</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>85%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>Upcoming Appointments</h3>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    style={{ 
                      color: '#3b82f6', 
                      fontWeight: '500', 
                      fontSize: '0.875rem', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {upcomingAppointments.slice(0, 2).map((appointment) => (
                    <div key={appointment.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '0.5rem',
                      transition: 'background-color 0.15s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '2.5rem', 
                          height: '2.5rem', 
                          background: '#3b82f6', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <User style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>
                            {appointment.doctor.name}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                            {appointment.type} • {appointment.doctor.specialty}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>
                            {appointment.time}
                          </p>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            margin: 0,
                            background: appointment.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                            color: appointment.status === 'confirmed' ? '#166534' : '#92400e'
                          }}>
                            {appointment.status}
                          </p>
                        </div>
                        {appointment.canJoin && (
                          <button
                            onClick={() => joinCall(appointment.doctor)}
                            style={{
                              background: '#16a34a',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              border: 'none',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#15803d'}
                            onMouseOut={(e) => e.target.style.background = '#16a34a'}
                          >
                            <Video style={{ width: '1rem', height: '1rem' }} />
                            Join Call
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <Calendar style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem', display: 'block' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Book Appointment</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Schedule with your doctor</div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('records')}
                  style={{
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <FileText style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem', display: 'block' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>View Records</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Access medical history</div>
                </button>
                
                <button 
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <Phone style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem', display: 'block' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Emergency Call</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>24/7 emergency support</div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Book New Appointment */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Book New Appointment
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'white'
                    }}
                  >
                    <option value="">Choose a doctor</option>
                    {availableDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'white'
                    }}
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Reason for Visit
                </label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for the appointment..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <button
                onClick={bookAppointment}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Book Appointment
              </button>
            </div>

            {/* Upcoming Appointments List */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Your Appointments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>
                          {appointment.doctor.name}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                          {appointment.doctor.specialty}
                        </p>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: appointment.status === 'confirmed' ? '#dcfce7' : appointment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                        color: appointment.status === 'confirmed' ? '#166534' : appointment.status === 'pending' ? '#92400e' : '#dc2626',
                        fontWeight: '500'
                      }}>
                        {appointment.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          📅 {appointment.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          🕐 {appointment.time}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          📋 {appointment.type}
                        </span>
                      </div>
                      {appointment.canJoin && (
                        <button
                          onClick={() => joinCall(appointment.doctor)}
                          style={{
                            background: '#16a34a',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Video style={{ width: '1rem', height: '1rem' }} />
                          Join Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'records':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Medical History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {medicalHistory.map((record) => (
                  <div key={record.id} style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>
                          {record.type}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                          {record.doctor} • {record.date}
                        </p>
                      </div>
                      <button style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Download style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </button>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Diagnosis:</strong>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{record.diagnosis}</p>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Notes:</strong>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{record.notes}</p>
                    </div>
                    {record.prescription && (
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Prescription:</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{record.prescription}</p>
                      </div>
                    )}
                  </div>
                ))}
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
                <div style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Heart style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  TeleMed Pro - Patient Portal
                </h1>
              </div>
              <nav style={{ display: 'flex', gap: '2rem' }}>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'dashboard' ? '#dbeafe' : 'transparent',
                    color: activeTab === 'dashboard' ? '#1d4ed8' : '#6b7280',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'appointments' ? '#dbeafe' : 'transparent',
                    color: activeTab === 'appointments' ? '#1d4ed8' : '#6b7280',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('records')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'records' ? '#dbeafe' : 'transparent',
                    color: activeTab === 'records' ? '#1d4ed8' : '#6b7280',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Medical Records
                </button>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{ 
                padding: '0.5rem', 
                background: '#f3f4f6', 
                border: 'none', 
                borderRadius: '0.375rem', 
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}>
                <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <button style={{ 
                padding: '0.5rem', 
                background: '#f3f4f6', 
                border: 'none', 
                borderRadius: '0.375rem', 
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}>
                <Settings style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                background: '#16a34a', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>J</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ width: isInCall ? '66.666667%' : '100%', transition: 'all 0.3s ease' }}>
            {getDashboardContent()}
          </div>

          {/* Video Call Panel */}
          {isInCall && (
            <div style={{ 
              width: isCallFullscreen ? '100vw' : '33.333333%', 
              height: isCallFullscreen ? '100vh' : 'auto',
              position: isCallFullscreen ? 'fixed' : 'relative',
              top: isCallFullscreen ? '0' : 'auto',
              left: isCallFullscreen ? '0' : 'auto',
              zIndex: isCallFullscreen ? '50' : 'auto',
              background: isCallFullscreen ? 'black' : 'transparent',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                background: 'white', 
                borderRadius: '0.75rem', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: isCallFullscreen ? '100vh' : '800px'
              }}>
                {/* Call Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                      {currentDoctor?.name} - Video Consultation
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => setIsCallFullscreen(!isCallFullscreen)}
                        style={{ 
                          padding: '0.5rem', 
                          background: '#f3f4f6', 
                          border: 'none', 
                          borderRadius: '0.375rem', 
                          cursor: 'pointer' 
                        }}
                      >
                        {isCallFullscreen ? 
                          <Minimize2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} /> : 
                          <Maximize2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        }
                      </button>
                      <button
                        onClick={endCall}
                        style={{ 
                          padding: '0.5rem', 
                          background: '#fee2e2', 
                          border: 'none', 
                          borderRadius: '0.375rem', 
                          cursor: 'pointer' 
                        }}
                      >
                        <PhoneOff style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Area */}
                <div style={{ 
                  flex: 1, 
                  position: 'relative', 
                  background: '#111827', 
                  overflow: 'hidden',
                  minHeight: '400px'
                }}>
                  {/* Remote Video (Doctor) */}
                  <div style={{ 
                    width: '100%', 
                    height: '70%', 
                    background: '#1f2937', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <video
                      ref={remoteVideoRef}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      autoPlay
                      playsInline
                    />
                    <div style={{ 
                      position: 'absolute', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontSize: '1.125rem'
                    }}>
                      Dr. {currentDoctor?.name}
                    </div>
                  </div>
                  
                  {/* Local Video (Patient - Picture in Picture) */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem', 
                    width: '8rem', 
                    height: '6rem', 
                    background: '#374151', 
                    borderRadius: '0.5rem',
                    border: '2px solid white',
                    overflow: 'hidden'
                  }}>
                    <video
                      ref={localVideoRef}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      autoPlay
                      muted
                      playsInline
                    />
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      color: 'white', 
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.5)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem'
                    }}>
                      You
                    </div>
                  </div>

                  {/* Live Status Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '1rem', 
                    left: '1rem', 
                    right: '1rem', 
                    background: 'rgba(0, 0, 0, 0.7)', 
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                          🔴 Live Consultation
                        </h4>
                        <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>
                          Connected • {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {currentDoctor?.specialty}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call Controls */}
                <div style={{ 
                  padding: '1rem', 
                  background: '#f3f4f6',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem'
                }}>
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isVideoOn ? '#3b82f6' : '#dc2626',
                      color: 'white',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {isVideoOn ? 
                      <Video style={{ width: '1.25rem', height: '1.25rem' }} /> : 
                      <VideoOff style={{ width: '1.25rem', height: '1.25rem' }} />
                    }
                  </button>
                  <button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isAudioOn ? '#3b82f6' : '#dc2626',
                      color: 'white',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {isAudioOn ? 
                      <Mic style={{ width: '1.25rem', height: '1.25rem' }} /> : 
                      <MicOff style={{ width: '1.25rem', height: '1.25rem' }} />
                    }
                  </button>
                  <button
                    onClick={endCall}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#dc2626',
                      color: 'white',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                    onMouseOut={(e) => e.target.style.background = '#dc2626'}
                  >
                    <PhoneOff style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                </div>

                {/* Quick Chat */}
                <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                    Quick Message
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message to the doctor..."
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendChatMessage();
                        }
                      }}
                    />
                    <button 
                      onClick={sendChatMessage}
                      disabled={!chatMessage.trim()}
                      style={{
                        background: chatMessage.trim() ? '#3b82f6' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        cursor: chatMessage.trim() ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;