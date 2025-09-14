import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Video, FileText, User, Clock, Heart, 
  Phone, PhoneOff, Mic, MicOff, VideoOff,
  Bell, Settings, Search, Plus, Activity,
  Maximize2, Minimize2, MessageSquare, Stethoscope,
  Send, Target, Volume2, AlertTriangle,
  ChevronDown, ChevronUp, Monitor, Headphones,
  MapPin, Star, Download, Eye, ChevronRight
} from 'lucide-react';

const PatientDashboard = () => {
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInCall, setIsInCall] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallFullscreen, setIsCallFullscreen] = useState(false);
  
  // Stethoscope states
  const [isStethoscopeConnected, setIsStethoscopeConnected] = useState(false);
  const [stethoscopeInstructions, setStethoscopeInstructions] = useState('');
  const [stethoscopePosition, setStethoscopePosition] = useState('ready');
  const [currentInstruction, setCurrentInstruction] = useState(null);
  
  // Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  
  // Mock data
  const [upcomingAppointments] = useState([
    {
      id: 1,
      doctor: { name: 'Dr. Tebogo Phasha', specialty: 'Cardiology', id: 'D001' },
      date: new Date().toLocaleDateString(),
      time: '10:00 AM',
      type: 'Cardiology Consultation',
      status: 'scheduled',
      canJoin: true
    },
  ]);
  
  const [healthMetrics] = useState({
    lastCheckup: '2 weeks ago',
    nextAppointment: 'Today, 10:00 AM',
    prescriptions: 3,
    healthScore: 85
  });
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  
  // Stethoscope instruction positions
  const instructionPositions = {
    'chest-center': {
      title: 'Center of Chest',
      description: 'Place stethoscope in the center of your chest, between your nipples',
      image: '🫀',
      audioInstructions: 'Please place the stethoscope in the center of your chest, right between your nipples. Press gently but firmly.'
    },
    'upper-right': {
      title: 'Upper Right Chest',
      description: 'Place stethoscope on the upper right side of your chest',
      image: '🫁',
      audioInstructions: 'Now move the stethoscope to the upper right side of your chest, about 2 inches below your collarbone.'
    },
    'upper-left': {
      title: 'Upper Left Chest', 
      description: 'Place stethoscope on the upper left side of your chest',
      image: '🫁',
      audioInstructions: 'Move the stethoscope to the upper left side of your chest, about 2 inches below your left collarbone.'
    },
    'lower-left': {
      title: 'Lower Left Chest',
      description: 'Place stethoscope on the lower left side of your chest',
      image: '❤️',
      audioInstructions: 'Place the stethoscope on the lower left side of your chest, near your heart apex.'
    },
    'back-upper': {
      title: 'Upper Back',
      description: 'Place stethoscope on your upper back between shoulder blades',
      image: '🫁',
      audioInstructions: 'Please place the stethoscope on your upper back, between your shoulder blades. You may need assistance.'
    }
  };
  
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);
  
  // Initialize video streams when call starts
  useEffect(() => {
    const initializeVideoStreams = async () => {
      if (isInCall) {
        try {
          // Create demo video streams
          createDemoVideoStreams();
        } catch (error) {
          console.warn('Could not initialize video streams:', error);
        }
      }
    };
    
    const createDemoVideoStreams = () => {
      // Create patient video (local)
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      const drawPatientFrame = () => {
        if (ctx) {
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#60a5fa';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(isVideoOn ? 'You (Patient)' : 'Camera Off', canvas.width / 2, canvas.height / 2);
        }
        requestAnimationFrame(drawPatientFrame);
      };
      
      drawPatientFrame();
      const patientStream = canvas.captureStream(30);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = patientStream;
      }
      
      // Create doctor video (remote)
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

    initializeVideoStreams();

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
  }, [isInCall, isVideoOn, currentDoctor]);
  
  const joinCall = (appointment) => {
    setCurrentDoctor(appointment.doctor);
    setIsInCall(true);
    setChatLog([
      { sender: 'system', text: `Video consultation started with ${appointment.doctor.name}`, timestamp: new Date().toISOString() }
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
    setIsStethoscopeConnected(false);
    setChatLog([]);
    setStethoscopeInstructions('');
    setCurrentInstruction(null);
  };
  
  const connectStethoscope = () => {
    setIsStethoscopeConnected(true);
    setStethoscopeInstructions('Digital stethoscope connected. Please follow doctor\'s instructions for positioning.');
    setChatLog(prev => [...prev, {
      sender: 'system',
      text: 'Digital stethoscope connected. Please wait for positioning instructions.',
      timestamp: new Date().toISOString()
    }]);
  };
  
  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatLog(prev => [...prev, {
        sender: 'patient',
        text: chatMessage,
        timestamp: new Date().toISOString()
      }]);
      setChatMessage('');
    }
  };
  
  const followStethoscopeInstruction = (positionKey) => {
    const instruction = instructionPositions[positionKey];
    setCurrentInstruction(instruction);
    setStethoscopePosition(positionKey);
    
    // Simulate doctor's instruction
    setChatLog(prev => [...prev, {
      sender: 'doctor',
      text: `Please ${instruction.audioInstructions}`,
      timestamp: new Date().toISOString()
    }]);
    
    // Patient confirmation after 3 seconds
    setTimeout(() => {
      setChatLog(prev => [...prev, {
        sender: 'patient',
        text: 'Stethoscope positioned. Can you hear clearly?',
        timestamp: new Date().toISOString()
      }]);
    }, 3000);
  };
  
  const getDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Welcome Header */}
            <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '0.75rem', padding: '2rem', color: 'white' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Welcome back, Kamo!</h2>
              <p style={{ opacity: 0.9, margin: '0.5rem 0 0 0' }}>Your next appointment is today at 10:00 AM with Dr. Tebogo Phasha.</p>
            </div>
            
            {/* Health Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: <Heart style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} />,
                  label: 'Health Score',
                  value: healthMetrics.healthScore + '%',
                  bgColor: '#fee2e2'
                },
                {
                  icon: <Calendar style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />,
                  label: 'Next Appointment',
                  value: healthMetrics.nextAppointment,
                  bgColor: '#dbeafe'
                },
                {
                  icon: <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }} />,
                  label: 'Active Prescriptions',
                  value: healthMetrics.prescriptions,
                  bgColor: '#dcfce7'
                },
                {
                  icon: <Activity style={{ width: '1.5rem', height: '1.5rem', color: '#d97706' }} />,
                  label: 'Last Checkup',
                  value: healthMetrics.lastCheckup,
                  bgColor: '#fef3c7'
                }
              ].map((metric, index) => (
                <div key={index} style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', background: metric.bgColor, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {metric.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>{metric.value}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{metric.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upcoming Appointments */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Upcoming Appointments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    background: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '3rem', 
                        height: '3rem', 
                        background: '#dcfce7', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: '#111827' }}>
                          {appointment.doctor.name}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                          {appointment.date} at {appointment.time} • {appointment.type}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {appointment.canJoin && (
                        <button 
                          onClick={() => joinCall(appointment)}
                          style={{ 
                            background: '#16a34a', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '0.375rem', 
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
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
      
      default:
        return <div>Content for {activeTab}</div>;
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Kalafo - Patient Portal</h1>
              </div>
              <nav style={{ display: 'flex', gap: '2rem' }}>
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'appointments', label: 'Appointments' },
                  { key: 'records', label: 'Medical Records' },
                  { key: 'prescriptions', label: 'Prescriptions' }
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
                      background: activeTab === t.key ? '#dcfce7' : 'transparent', 
                      color: activeTab === t.key ? '#15803d' : '#6b7280', 
                      transition: 'all 0.15s ease' 
                    }}
                  >
                    {t.label}
                  </button>
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
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>SJ</span>
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
            <div style={{ 
              width: isCallFullscreen ? '100vw' : '40%', 
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
                maxHeight: isCallFullscreen ? '100vh' : '900px'
              }}>
                {/* Call Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', margin: 0 }}>
                      Video Call with {currentDoctor?.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setIsCallFullscreen(!isCallFullscreen)}
                        style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                      >
                        {isCallFullscreen ? 
                          <Minimize2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} /> : 
                          <Maximize2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        }
                      </button>
                      <button 
                        onClick={endCall}
                        style={{ padding: '0.5rem', background: '#fee2e2', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                      >
                        <PhoneOff style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Area */}
                <div style={{ height: 300, position: 'relative', background: '#111827', overflow: 'hidden' }}>
                  {/* Remote (doctor) video - main view */}
                  <div style={{ width: '100%', height: '100%', background: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <video 
                      ref={remoteVideoRef} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      autoPlay 
                      playsInline 
                    />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                      {currentDoctor?.name} - {currentDoctor?.specialty}
                    </div>
                  </div>
                  
                  {/* Local (patient) PiP */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '6rem', height: '4.5rem', background: '#374151', borderRadius: '0.5rem', border: '2px solid white', overflow: 'hidden' }}>
                    <video 
                      ref={localVideoRef} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isVideoOn ? 'none' : 'grayscale(1) brightness(0.4)' }} 
                      autoPlay 
                      muted 
                      playsInline 
                    />
                    <div style={{ position: 'absolute', bottom: '0.25rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.625rem', textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>
                      You
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <button 
                      onClick={() => setIsAudioOn(!isAudioOn)}
                      style={{ 
                        padding: '0.75rem', 
                        background: isAudioOn ? '#f3f4f6' : '#fee2e2', 
                        border: 'none', 
                        borderRadius: '50%', 
                        cursor: 'pointer' 
                      }}
                    >
                      {isAudioOn ? 
                        <Mic style={{ width: '1.25rem', height: '1.25rem', color: '#374151' }} /> : 
                        <MicOff style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                      }
                    </button>
                    <button 
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      style={{ 
                        padding: '0.75rem', 
                        background: isVideoOn ? '#f3f4f6' : '#fee2e2', 
                        border: 'none', 
                        borderRadius: '50%', 
                        cursor: 'pointer' 
                      }}
                    >
                      {isVideoOn ? 
                        <Video style={{ width: '1.25rem', height: '1.25rem', color: '#374151' }} /> : 
                        <VideoOff style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                      }
                    </button>
                  </div>
                </div>

                {/* Stethoscope Instructions Panel */}
                {!isStethoscopeConnected ? (
                  <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <Stethoscope style={{ width: '2rem', height: '2rem', color: '#6b7280', margin: '0 auto' }} />
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: '0.5rem 0' }}>
                        Digital Stethoscope Ready
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                        Connect your digital stethoscope when instructed by the doctor
                      </p>
                    </div>
                    <button 
                      onClick={connectStethoscope}
                      style={{ 
                        background: '#16a34a', 
                        color: 'white', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.375rem', 
                        border: 'none', 
                        fontSize: '0.875rem', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto'
                      }}
                    >
                      <Stethoscope style={{ width: '1rem', height: '1rem' }} />
                      Connect Stethoscope
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>
                        Stethoscope Connected
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: '0.5rem', height: '0.5rem', background: '#16a34a', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 500 }}>Active</span>
                      </div>
                    </div>
                    
                    {currentInstruction && (
                      <div style={{ 
                        background: '#f0f9ff', 
                        border: '1px solid #bae6fd', 
                        borderRadius: '0.5rem', 
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{currentInstruction.image}</span>
                          <div>
                            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: '#0369a1' }}>
                              {currentInstruction.title}
                            </h5>
                            <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: '0.25rem 0 0 0' }}>
                              {currentInstruction.description}
                            </p>
                          </div>
                        </div>
                        <div style={{ 
                          background: '#0369a1', 
                          color: 'white', 
                          padding: '0.5rem', 
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          🔊 {currentInstruction.audioInstructions}
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Position Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                      {Object.entries(instructionPositions).slice(0, 4).map(([key, instruction]) => (
                        <button
                          key={key}
                          onClick={() => followStethoscopeInstruction(key)}
                          style={{
                            padding: '0.5rem',
                            background: stethoscopePosition === key ? '#dbeafe' : '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{instruction.image}</div>
                          <div style={{ fontWeight: 500 }}>{instruction.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>
                      Chat with Doctor
                    </h4>
                    <button
                      onClick={() => setIsChatExpanded(!isChatExpanded)}
                      style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      {isChatExpanded ? 
                        <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6b7280' }} /> : 
                        <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      }
                    </button>
                  </div>
                  
                  {isChatExpanded && (
                    <>
                      {/* Chat Messages */}
                      <div style={{ 
                        flex: 1, 
                        padding: '1rem', 
                        overflowY: 'auto',
                        maxHeight: '250px',
                        minHeight: '200px'
                      }}>
                        {chatLog.map((message, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              marginBottom: '0.75rem',
                              display: 'flex',
                              justifyContent: message.sender === 'patient' ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <div style={{
                              background: message.sender === 'patient' ? '#16a34a' : 
                                         message.sender === 'system' ? '#f3f4f6' : 
                                         message.sender === 'doctor' ? '#3b82f6' : '#e5e7eb',
                              color: message.sender === 'patient' || message.sender === 'doctor' ? 'white' : '#374151',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0.75rem',
                              maxWidth: '80%',
                              fontSize: '0.875rem'
                            }}>
                              <div>{message.text}</div>
                              <div style={{ 
                                fontSize: '0.625rem', 
                                opacity: 0.7,
                                marginTop: '0.25rem'
                              }}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      
                      {/* Chat Input */}
                      <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message to your doctor..."
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          />
                          <button
                            onClick={sendMessage}
                            style={{
                              padding: '0.5rem',
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Send style={{ width: '1rem', height: '1rem' }} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Status Bar */}
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: '#f9fafb', 
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ width: '0.5rem', height: '0.5rem', background: '#16a34a', borderRadius: '50%' }} />
                      <span>Call Active</span>
                    </div>
                    {isStethoscopeConnected && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Stethoscope style={{ width: '0.75rem', height: '0.75rem' }} />
                        <span>Stethoscope Connected</span>
                      </div>
                    )}
                  </div>
                  <div>
                    Call Duration: {Math.floor(Math.random() * 15) + 5}:30
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