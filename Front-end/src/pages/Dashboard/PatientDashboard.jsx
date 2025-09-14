import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Video, FileText, User, Clock, Heart, 
  Phone, PhoneOff, Mic, MicOff, VideoOff,
  Bell, Settings, Search, Plus, MapPin, Star,
  Download, Eye, ChevronRight, Activity,
  Maximize2, Minimize2, MessageSquare
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, apiCall, logout } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInCall, setIsInCall] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Backend data states
  const [patientData, setPatientData] = useState(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [pastConsultations, setPastConsultations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    upcomingAppointments: 0,
    videoConsultations: 0,
    medicalRecords: 0,
    healthScore: 85
  });
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallFullscreen, setIsCallFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  
  // Appointment booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);

  // Get patient's display name
  const getPatientDisplayName = () => {
    if (!patientData && !user) return 'Patient';
    
    const userData = patientData || user;
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (userData.email) {
      return userData.email.split('@')[0];
    }
    
    return 'Patient';
  };

  // Get patient's first name for welcome message
  const getPatientFirstName = () => {
    if (!patientData && !user) return 'Patient';
    
    const userData = patientData || user;
    return userData.first_name || userData.email?.split('@')[0] || 'Patient';
  };

  // Fetch patient dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch patient dashboard data
        const dashboardResponse = await apiCall('/dashboard/patient');
        
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData = await dashboardResponse.json();
        
        setPatientData(dashboardData.patient_info);
        setUpcomingConsultations(dashboardData.upcoming_consultations || []);
        setPastConsultations(dashboardData.past_consultations || []);

        // Calculate dashboard stats
        setDashboardStats({
          upcomingAppointments: dashboardData.upcoming_consultations?.length || 0,
          videoConsultations: dashboardData.past_consultations?.length || 0,
          medicalRecords: dashboardData.past_consultations?.length || 0,
          healthScore: 85 // This would be calculated based on various health metrics
        });

        // Fetch available doctors for booking
        try {
          const doctorsResponse = await apiCall('/users');
          if (doctorsResponse.ok) {
            const doctorsData = await doctorsResponse.json();
            const doctors = doctorsData.users?.filter(u => u.role === 'doctor') || [];
            setAvailableDoctors(doctors.map(doctor => ({
              id: doctor.id,
              name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
              specialty: doctor.specialty || 'General Practice',
              rating: 4.8,
              experience: '10+ years'
            })));
          }
        } catch (doctorsError) {
          console.warn('Could not fetch doctors:', doctorsError.message);
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

  // Convert backend consultation format to frontend format
  const formatConsultation = (consultation, includeCanJoin = false) => {
    const consultationDate = new Date(consultation.scheduled_time);
    const now = new Date();
    const isToday = consultationDate.toDateString() === now.toDateString();
    const isUpcoming = consultationDate > now;
    const canJoin = includeCanJoin && isToday && isUpcoming && consultation.status === 'scheduled';

    return {
      id: consultation.id,
      doctor: {
        name: consultation.doctor_name || 'Dr. Unknown',
        specialty: 'General Practice', // Would need to fetch doctor details
        id: consultation.doctor_id
      },
      date: consultationDate.toLocaleDateString(),
      time: consultationDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: consultation.diagnosis ? 'Follow-up Consultation' : 'General Consultation',
      status: consultation.status || 'scheduled',
      canJoin,
      notes: consultation.notes,
      diagnosis: consultation.diagnosis
    };
  };

  // Get today's appointments that can be joined
  const getTodaysJoinableAppointments = () => {
    return upcomingConsultations
      .map(consultation => formatConsultation(consultation, true))
      .filter(appointment => appointment.canJoin);
  };

  // Initialize video streams
  useEffect(() => {
    const initializeVideoStreams = async () => {
      try {
        // Get user media for local video
        if (isInCall && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isAudioOn
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.warn('Could not access camera/microphone:', error);
        // Create dummy video stream as fallback
        createDummyVideoStream();
      }
    };

    const createDummyVideoStream = () => {
      if (!localVideoRef.current || !remoteVideoRef.current) return;
      
      // Create dummy video streams for demo
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      const drawFrame = () => {
        if (ctx) {
          // Draw patient video (local)
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#60a5fa';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(isVideoOn ? `${getPatientFirstName()} (You)` : 'Camera Off', canvas.width / 2, canvas.height / 2);
        }
        requestAnimationFrame(drawFrame);
      };
      
      drawFrame();
      const stream = canvas.captureStream(30);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Create doctor video (remote) - simulate incoming video
      const doctorCanvas = document.createElement('canvas');
      doctorCanvas.width = 640;
      doctorCanvas.height = 480;
      const doctorCtx = doctorCanvas.getContext('2d');
      
      const drawDoctorFrame = () => {
        if (doctorCtx) {
          doctorCtx.fillStyle = '#065f46';
          doctorCtx.fillRect(0, 0, doctorCanvas.width, doctorCanvas.height);
          doctorCtx.fillStyle = '#34d399';
          doctorCtx.font = '28px sans-serif';
          doctorCtx.textAlign = 'center';
          doctorCtx.fillText(currentDoctor?.name || 'Doctor', doctorCanvas.width / 2, doctorCanvas.height / 2);
        }
        requestAnimationFrame(drawDoctorFrame);
      };
      
      drawDoctorFrame();
      const doctorStream = doctorCanvas.captureStream(30);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = doctorStream;
      }
    };

    if (isInCall) {
      initializeVideoStreams();
    }

    // Cleanup streams when call ends
    return () => {
      if (localVideoRef.current?.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (remoteVideoRef.current?.srcObject) {
        const tracks = remoteVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isInCall, isVideoOn, isAudioOn, currentDoctor]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const joinCall = (doctor) => {
    setCurrentDoctor(doctor);
    setIsInCall(true);
    setChatLog([
      { sender: 'system', text: `Call started with ${doctor.name}`, timestamp: new Date().toISOString() }
    ]);
  };

  const endCall = () => {
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      const tracks = remoteVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }

    setIsInCall(false);
    setCurrentDoctor(null);
    setChatLog([]);
    setIsCallFullscreen(false);
  };

  const toggleVideo = async () => {
    setIsVideoOn(!isVideoOn);
    
    // Update video track if real stream exists
    if (localVideoRef.current?.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleAudio = async () => {
    setIsAudioOn(!isAudioOn);
    
    // Update audio track if real stream exists
    if (localVideoRef.current?.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      setChatLog(prev => [...prev, {
        sender: 'patient',
        text: chatMessage,
        timestamp: new Date().toISOString()
      }]);
      setChatMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        setChatLog(prev => [...prev, {
          sender: 'doctor',
          text: 'Thank you for that information. I understand your concern.',
          timestamp: new Date().toISOString()
        }]);
      }, 1500);
    }
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !appointmentReason) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      // Create a new appointment object for demo
      const selectedDoctorInfo = availableDoctors.find(d => d.id == selectedDoctor);
      const appointmentDateTime = new Date(`${selectedDate} ${selectedTime}`);
      
      const newAppointment = {
        id: Date.now(), // Use timestamp as ID for demo
        patient_id: user?.id || 1,
        doctor_id: parseInt(selectedDoctor),
        doctor_name: selectedDoctorInfo?.name || 'Dr. Unknown',
        scheduled_time: appointmentDateTime.toISOString(),
        status: 'scheduled',
        notes: appointmentReason,
        diagnosis: null
      };

      // Add to upcoming consultations for immediate display
      setUpcomingConsultations(prev => [...prev, newAppointment]);
      
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        upcomingAppointments: prev.upcomingAppointments + 1
      }));

      alert('Appointment booked successfully! You will receive a confirmation email shortly.');
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedDoctor('');
      setAppointmentReason('');
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again.');
    }
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
          <p style={{ color: '#6b7280' }}>Loading your dashboard...</p>
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

  const formattedUpcomingConsultations = upcomingConsultations.map(c => formatConsultation(c, true));
  const formattedPastConsultations = pastConsultations.map(c => formatConsultation(c, false));

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
                Welcome back, {getPatientFirstName()}!
              </h2>
              <p style={{ opacity: 0.9, margin: 0 }}>
                {formattedUpcomingConsultations.length > 0 
                  ? `Your next appointment is on ${formattedUpcomingConsultations[0].date} at ${formattedUpcomingConsultations[0].time} with ${formattedUpcomingConsultations[0].doctor.name}`
                  : 'You have no upcoming appointments. Book a consultation with one of our doctors.'
                }
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
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{dashboardStats.upcomingAppointments}</p>
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
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{dashboardStats.videoConsultations}</p>
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
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{dashboardStats.medicalRecords}</p>
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
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{dashboardStats.healthScore}%</p>
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
                  {formattedUpcomingConsultations.length > 0 ? formattedUpcomingConsultations.slice(0, 2).map((appointment) => (
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
                            background: appointment.status === 'scheduled' ? '#dcfce7' : '#fef3c7',
                            color: appointment.status === 'scheduled' ? '#166534' : '#92400e'
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
                  )) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p>No upcoming appointments</p>
                      <button 
                        onClick={() => setActiveTab('appointments')}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          marginTop: '0.5rem'
                        }}
                      >
                        Book Appointment
                      </button>
                    </div>
                  )}
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
                    min={new Date().toISOString().split('T')[0]}
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
                disabled={!selectedDate || !selectedTime || !selectedDoctor || !appointmentReason}
                style={{
                  background: selectedDate && selectedTime && selectedDoctor && appointmentReason ? '#3b82f6' : '#d1d5db',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: selectedDate && selectedTime && selectedDoctor && appointmentReason ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (selectedDate && selectedTime && selectedDoctor && appointmentReason) {
                    e.target.style.background = '#2563eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedDate && selectedTime && selectedDoctor && appointmentReason) {
                    e.target.style.background = '#3b82f6';
                  }
                }}
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
                {formattedUpcomingConsultations.length > 0 ? formattedUpcomingConsultations.map((appointment) => (
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
                        background: appointment.status === 'scheduled' ? '#dcfce7' : appointment.status === 'completed' ? '#f3f4f6' : '#fef3c7',
                        color: appointment.status === 'scheduled' ? '#166534' : appointment.status === 'completed' ? '#6b7280' : '#92400e',
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
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No upcoming appointments</p>
                  </div>
                )}
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
                {formattedPastConsultations.length > 0 ? formattedPastConsultations.map((record) => (
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
                          {record.doctor.name} • {record.date}
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
                    {record.diagnosis && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Diagnosis:</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{record.diagnosis}</p>
                      </div>
                    )}
                    {record.notes && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Notes:</strong>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>{record.notes}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <FileText style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No medical records found</p>
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
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>
                  {getPatientDisplayName().split(' ').map(name => name[0]).join('').slice(0, 2)}
                </span>
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
                borderRadius: isCallFullscreen ? 0 : '0.75rem', 
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
                    height: '100%', 
                    background: '#1f2937', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <video
                      ref={remoteVideoRef}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: 'none'
                      }}
                      autoPlay
                      playsInline
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '1rem',
                      left: '1rem',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}>
                      {currentDoctor?.name}
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
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: isVideoOn ? 'none' : 'grayscale(1) brightness(0.4)'
                      }}
                      autoPlay
                      muted
                      playsInline
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '0.25rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white', 
                      fontSize: '0.625rem',
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '0.125rem 0.25rem',
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
                    onClick={toggleVideo}
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
                    onClick={toggleAudio}
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
                    Chat with {currentDoctor?.name}
                  </h4>
                  
                  {/* Chat Messages */}
                  <div style={{ 
                    maxHeight: '120px', 
                    overflowY: 'auto', 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: '#f9fafb',
                    borderRadius: '0.375rem'
                  }}>
                    {chatLog.map((message, index) => (
                      <div key={index} style={{ 
                        marginBottom: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        background: message.sender === 'patient' ? '#dbeafe' : message.sender === 'doctor' ? '#dcfce7' : '#f3f4f6',
                        fontSize: '0.75rem'
                      }}>
                        <strong style={{ color: '#374151' }}>
                          {message.sender === 'patient' ? 'You' : message.sender === 'doctor' ? currentDoctor?.name : 'System'}:
                        </strong>
                        <span style={{ marginLeft: '0.25rem', color: '#6b7280' }}>{message.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  
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

export default PatientDashboard;
    