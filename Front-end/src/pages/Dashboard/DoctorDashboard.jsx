import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Video, FileText, User, Clock, Heart, 
  Phone, PhoneOff, Mic, MicOff, VideoOff,
  Bell, Settings, Search, Plus, Activity,
  Maximize2, Minimize2, MessageSquare, Stethoscope,
  Save, Send, Target, Volume2, Play, Pause,
  Thermometer, Droplets, Wind, Eye, AlertTriangle,
  ChevronDown, ChevronUp, Monitor, Headphones
} from 'lucide-react';

const DoctorDashboard = () => {
  // Dashboard states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInCall, setIsInCall] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallFullscreen, setIsCallFullscreen] = useState(false);
  
  // Stethoscope states
  const [isStethoscopeConnected, setIsStethoscopeConnected] = useState(false);
  const [stethoscopeMode, setStethoscopeMode] = useState('heart'); // 'heart' or 'lungs'
  const [isRecording, setIsRecording] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [stethoscopePosition, setStethoscopePosition] = useState('chest-center');
  const [waveformData, setWaveformData] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  
  // Notes and diagnosis states
  const [consultationNotes, setConsultationNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    temperature: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  });
  
  // Mock data
  const [todaysAppointments] = useState([
    {
      id: 1,
      patient: { name: 'kamo', age: 28, id: 'P001' },
      time: '10:00 AM',
      type: 'General Consultation',
      status: 'scheduled',
      canStart: true
    },
  ]);
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  
  // Stethoscope positions for guidance
  const stethoscopePositions = {
    heart: [
      { id: 'aortic', name: 'Aortic Area', position: { top: '25%', left: '45%' }, description: 'Right 2nd intercostal space' },
      { id: 'pulmonary', name: 'Pulmonary Area', position: { top: '25%', left: '55%' }, description: 'Left 2nd intercostal space' },
      { id: 'tricuspid', name: 'Tricuspid Area', position: { top: '45%', left: '52%' }, description: 'Left 4th intercostal space' },
      { id: 'mitral', name: 'Mitral Area', position: { top: '55%', left: '38%' }, description: 'Left 5th intercostal space' },
      { id: 'apex', name: 'Apex', position: { top: '65%', left: '35%' }, description: 'Point of maximal impulse' }
    ],
    lungs: [
      { id: 'upper-right', name: 'Right Upper Lobe', position: { top: '20%', left: '60%' }, description: 'Right upper chest' },
      { id: 'upper-left', name: 'Left Upper Lobe', position: { top: '20%', left: '40%' }, description: 'Left upper chest' },
      { id: 'middle-right', name: 'Right Middle Lobe', position: { top: '45%', left: '65%' }, description: 'Right mid chest' },
      { id: 'lower-right', name: 'Right Lower Lobe', position: { top: '70%', left: '65%' }, description: 'Right lower chest' },
      { id: 'lower-left', name: 'Left Lower Lobe', position: { top: '70%', left: '35%' }, description: 'Left lower chest' }
    ]
  };
  
  // Generate realistic waveform data
  useEffect(() => {
    if (isStethoscopeConnected && isRecording) {
      const interval = setInterval(() => {
        const newData = [];
        const time = Date.now();
        
        if (stethoscopeMode === 'heart') {
          // Generate ECG-like waveform
          for (let i = 0; i < 50; i++) {
            const t = (time + i * 20) / 1000;
            let value = 0;
            
            // P wave
            if (i % 50 < 5) value += 0.2 * Math.sin((i % 5) * Math.PI / 2.5);
            // QRS complex
            if (i % 50 >= 15 && i % 50 < 25) {
              if (i % 50 === 20) value += 1.0; // R wave
              else if (i % 50 === 18) value -= 0.3; // Q wave
              else if (i % 50 === 22) value -= 0.4; // S wave
            }
            // T wave
            if (i % 50 >= 35 && i % 50 < 45) value += 0.3 * Math.sin(((i % 50) - 35) * Math.PI / 10);
            
            newData.push({ x: i, y: value + Math.random() * 0.1 - 0.05 });
          }
        } else {
          // Generate respiratory waveform
          for (let i = 0; i < 50; i++) {
            const respiratoryCycle = Math.sin((i / 50) * 2 * Math.PI * (respiratoryRate / 60));
            const value = respiratoryCycle * 0.8 + Math.random() * 0.2 - 0.1;
            newData.push({ x: i, y: value });
          }
        }
        
        setWaveformData(newData);
        setAudioLevel(Math.random() * 100);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isStethoscopeConnected, isRecording, stethoscopeMode, heartRate, respiratoryRate]);
  
  // Draw waveform
  useEffect(() => {
    if (waveformCanvasRef.current && waveformData.length > 0) {
      const canvas = waveformCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (i * width) / 10;
        const y = (i * height) / 10;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw waveform
      ctx.strokeStyle = stethoscopeMode === 'heart' ? '#dc2626' : '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      waveformData.forEach((point, index) => {
        const x = (point.x / 50) * width;
        const y = height / 2 - (point.y * height / 4);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
  }, [waveformData, stethoscopeMode]);
  
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);
  
  const startCall = (patient) => {
    setCurrentPatient(patient);
    setIsInCall(true);
    setChatLog([
      { sender: 'system', text: `Video consultation started with ${patient.patient.name}`, timestamp: new Date().toISOString() }
    ]);
  };
  
  const endCall = () => {
    setIsInCall(false);
    setCurrentPatient(null);
    setIsStethoscopeConnected(false);
    setIsRecording(false);
    setChatLog([]);
    setConsultationNotes('');
    setDiagnosis('');
    setPrescription('');
  };
  
  const connectStethoscope = () => {
    setIsStethoscopeConnected(!isStethoscopeConnected);
    if (!isStethoscopeConnected) {
      setChatLog(prev => [...prev, {
        sender: 'system',
        text: 'Digital stethoscope connected. Guide patient to position stethoscope.',
        timestamp: new Date().toISOString()
      }]);
    }
  };
  
  const startRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setChatLog(prev => [...prev, {
        sender: 'system',
        text: `Started recording ${stethoscopeMode} sounds at ${stethoscopePosition}`,
        timestamp: new Date().toISOString()
      }]);
    }
  };
  
  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatLog(prev => [...prev, {
        sender: 'doctor',
        text: chatMessage,
        timestamp: new Date().toISOString()
      }]);
      setChatMessage('');
    }
  };
  
  const saveConsultation = () => {
    const consultationData = {
      patientId: currentPatient?.patient.id,
      notes: consultationNotes,
      diagnosis: diagnosis,
      prescription: prescription,
      vitalSigns: vitalSigns,
      stethoscopeFindings: {
        heartRate: heartRate,
        respiratoryRate: respiratoryRate,
        recordings: waveformData
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('Saving consultation:', consultationData);
    alert('Consultation saved successfully!');
  };
  
  const guideStethoscopePosition = (position) => {
    setStethoscopePosition(position.id);
    setChatLog(prev => [...prev, {
      sender: 'system',
      text: `Please move the stethoscope to: ${position.name} - ${position.description}`,
      timestamp: new Date().toISOString()
    }]);
  };
  
  const getDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Welcome Header */}
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '0.75rem', padding: '2rem', color: 'white' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Good morning, Dr. Tebogo Phasha</h2>
              <p style={{ opacity: 0.9, margin: '0.5rem 0 0 0' }}>You have 3 appointments today. 1 video consultation ready to start.</p>
            </div>
            
            {/* Today's Appointments */}
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Today's Appointments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {todaysAppointments.map(appointment => (
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
                        background: '#dbeafe', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: '#111827' }}>
                          {appointment.patient.name}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                          {appointment.time} • {appointment.type}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {appointment.canStart && (
                        <button 
                          onClick={() => startCall(appointment)}
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
                          Start Call
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
                      color: activeTab === t.key ? '#1d4ed8' : '#6b7280', 
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
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>DS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ width: isInCall ? '50%' : '100%', transition: 'all 0.3s ease' }}>
            {getDashboardContent()}
          </div>

          {/* Video Call Panel */}
          {isInCall && (
            <div style={{ 
              width: isCallFullscreen ? '100vw' : '50%', 
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
                    <h3 style={{ fontWeight: 600, color: '#111827', margin: 0 }}>
                      Consultation with {currentPatient?.patient.name}
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
                <div style={{ height: 250, position: 'relative', background: '#111827', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <video 
                      ref={remoteVideoRef} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      autoPlay 
                      playsInline 
                    />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                      Patient: {currentPatient?.patient.name}
                    </div>
                  </div>
                  {/* Local (doctor) PiP */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '6rem', height: '4.5rem', background: '#374151', borderRadius: '0.5rem', border: '2px solid white', overflow: 'hidden' }}>
                    <video 
                      ref={localVideoRef} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      autoPlay 
                      muted 
                      playsInline 
                    />
                    <div style={{ position: 'absolute', bottom: '0.25rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.625rem', textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>
                      You
                    </div>
                  </div>
                  
                  {/* Stethoscope Position Overlay */}
                  {isStethoscopeConnected && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      {stethoscopePositions[stethoscopeMode].map(position => (
                        <div
                          key={position.id}
                          style={{
                            position: 'absolute',
                            top: position.position.top,
                            left: position.position.left,
                            width: '1.5rem',
                            height: '1.5rem',
                            background: stethoscopePosition === position.id ? '#dc2626' : 'rgba(59, 130, 246, 0.8)',
                            borderRadius: '50%',
                            border: '2px solid white',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => guideStethoscopePosition(position)}
                        >
                          <Target style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} />
                        </div>
                      ))}
                    </div>
                  )}
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

                {/* Stethoscope Panel */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>Digital Stethoscope</h4>
                    <button 
                      onClick={connectStethoscope}
                      style={{ 
                        background: isStethoscopeConnected ? '#16a34a' : '#6b7280', 
                        color: 'white', 
                        padding: '0.375rem 0.75rem', 
                        borderRadius: '0.375rem', 
                        border: 'none', 
                        fontSize: '0.75rem', 
                        fontWeight: 500, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem'
                      }}
                    >
                      <Stethoscope style={{ width: '0.875rem', height: '0.875rem' }} />
                      {isStethoscopeConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  
                  {isStethoscopeConnected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Mode Toggle */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setStethoscopeMode('heart')}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: stethoscopeMode === 'heart' ? '#dc2626' : '#f3f4f6',
                            color: stethoscopeMode === 'heart' ? 'white' : '#374151',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Heart style={{ width: '0.875rem', height: '0.875rem' }} />
                          Heart
                        </button>
                        <button
                          onClick={() => setStethoscopeMode('lungs')}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: stethoscopeMode === 'lungs' ? '#2563eb' : '#f3f4f6',
                            color: stethoscopeMode === 'lungs' ? 'white' : '#374151',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Wind style={{ width: '0.875rem', height: '0.875rem' }} />
                          Lungs
                        </button>
                      </div>
                      
                      {/* Recording Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={startRecording}
                          style={{
                            padding: '0.5rem 1rem',
                            background: isRecording ? '#dc2626' : '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                        >
                          {isRecording ? <Pause style={{ width: '0.875rem', height: '0.875rem' }} /> : <Play style={{ width: '0.875rem', height: '0.875rem' }} />}
                          {isRecording ? 'Stop' : 'Record'}
                        </button>
                        
                        {/* Audio Level Indicator */}
                        <div style={{ flex: 1, height: '0.5rem', background: '#e5e7eb', borderRadius: '0.25rem', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              background: 'linear-gradient(to right, #16a34a, #fbbf24, #dc2626)',
                              width: `${audioLevel}%`,
                              transition: 'width 0.1s ease'
                            }}
                          />
                        </div>
                        <Volume2 style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </div>
                      
                      {/* Vital Signs Display */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 600, color: '#dc2626' }}>{heartRate}</div>
                          <div style={{ color: '#6b7280' }}>HR (bpm)</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 600, color: '#2563eb' }}>{respiratoryRate}</div>
                          <div style={{ color: '#6b7280' }}>RR (rpm)</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 600, color: '#16a34a' }}>{Math.round(audioLevel)}</div>
                          <div style={{ color: '#6b7280' }}>Signal</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Waveform Display */}
                {isStethoscopeConnected && isRecording && (
                  <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>
                        {stethoscopeMode === 'heart' ? 'ECG Waveform' : 'Respiratory Waveform'}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Position: {stethoscopePosition}
                      </div>
                    </div>
                    <canvas
                      ref={waveformCanvasRef}
                      width={400}
                      height={120}
                      style={{ 
                        width: '100%', 
                        height: '120px', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.375rem',
                        background: '#f9fafb'
                      }}
                    />
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
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>Chat & Notes</h4>
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
                        maxHeight: '200px',
                        minHeight: '150px'
                      }}>
                        {chatLog.map((message, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              marginBottom: '0.75rem',
                              display: 'flex',
                              justifyContent: message.sender === 'doctor' ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <div style={{
                              background: message.sender === 'doctor' ? '#3b82f6' : 
                                         message.sender === 'system' ? '#f3f4f6' : '#e5e7eb',
                              color: message.sender === 'doctor' ? 'white' : '#374151',
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
                            placeholder="Type a message..."
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
                              background: '#3b82f6',
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

                {/* Notes and Diagnosis Panel */}
                <div style={{ borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: '0 0 0.75rem 0' }}>
                      Consultation Notes & Diagnosis
                    </h4>
                    
                    {/* Vital Signs Input */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                        Vital Signs
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="BP (120/80)"
                          value={vitalSigns.bloodPressure}
                          onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                          style={{ padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Temp (98.6°F)"
                          value={vitalSigns.temperature}
                          onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                          style={{ padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem' }}
                        />
                        <input
                          type="text"
                          placeholder="SpO2 (98%)"
                          value={vitalSigns.oxygenSaturation}
                          onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                          style={{ padding: '0.375rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <div style={{ marginBottom: '1rem' }}>
                      <textarea
                        placeholder="Consultation notes..."
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                        style={{
                          width: '100%',
                          height: '60px',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    
                    {/* Diagnosis */}
                    <div style={{ marginBottom: '1rem' }}>
                      <input
                        type="text"
                        placeholder="Diagnosis..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    
                    {/* Prescription */}
                    <div style={{ marginBottom: '1rem' }}>
                      <textarea
                        placeholder="Prescription and treatment plan..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        style={{
                          width: '100%',
                          height: '60px',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    
                    {/* Save Button */}
                    <button
                      onClick={saveConsultation}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Save style={{ width: '1rem', height: '1rem' }} />
                      Save Consultation
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

export default DoctorDashboard;