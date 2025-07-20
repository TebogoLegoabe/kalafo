import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './VideoConsultation.css';

function VideoConsultation({ consultationId, patientId, doctorId, onEndCall }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    oxygenSaturation: 98,
    temperature: 98.6,
    respiratoryRate: 16
  });
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [selectedBodyPart, setSelectedBodyPart] = useState('heart');

  const { user } = useAuth();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Simulate real-time health data updates
  useEffect(() => {
    if (isCallActive && isRecording) {
      const interval = setInterval(() => {
        // Simulate real-time health data based on selected body part
        const newHealthData = generateHealthData(selectedBodyPart);
        setHealthData(newHealthData);
        
        // Update heart rate history for chart
        setHeartRateHistory(prev => {
          const newHistory = [...prev, {
            time: new Date().toLocaleTimeString(),
            value: newHealthData.heartRate,
            bodyPart: selectedBodyPart
          }];
          return newHistory.slice(-20); // Keep last 20 readings
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCallActive, isRecording, selectedBodyPart]);

  const generateHealthData = (bodyPart) => {
    const baseData = {
      heartRate: 72 + Math.floor(Math.random() * 20) - 10,
      bloodPressure: '120/80',
      oxygenSaturation: 97 + Math.floor(Math.random() * 3),
      temperature: 98.6 + (Math.random() * 2 - 1),
      respiratoryRate: 16 + Math.floor(Math.random() * 8) - 4
    };

    // Adjust values based on body part being examined
    switch (bodyPart) {
      case 'heart':
        baseData.heartRate = 70 + Math.floor(Math.random() * 30);
        break;
      case 'lungs':
        baseData.respiratoryRate = 14 + Math.floor(Math.random() * 10);
        baseData.oxygenSaturation = 96 + Math.floor(Math.random() * 4);
        break;
      case 'throat':
        baseData.temperature = 99 + Math.random() * 2;
        break;
      default:
        break;
    }

    return baseData;
  };

  const startCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setIsCallActive(true);
      setDeviceStatus('connected');
      
      console.log('Video call started');
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Error accessing camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    setIsCallActive(false);
    setIsRecording(false);
    setDeviceStatus('disconnected');
    
    if (onEndCall) {
      onEndCall();
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const startHealthMonitoring = () => {
    setIsRecording(true);
    console.log('Started health monitoring for:', selectedBodyPart);
  };

  const stopHealthMonitoring = () => {
    setIsRecording(false);
    console.log('Stopped health monitoring');
  };

  const getHeartRateStatus = (rate) => {
    if (rate < 60) return { status: 'low', color: '#3498db' };
    if (rate > 100) return { status: 'high', color: '#e74c3c' };
    return { status: 'normal', color: '#27ae60' };
  };

  const heartRateStatus = getHeartRateStatus(healthData.heartRate);

  return (
    <div className="video-consultation">
      <div className="consultation-header">
        <h2>🩺 Live Consultation</h2>
        <div className="consultation-info">
          <span>Patient ID: {patientId}</span>
          <span>Session: {consultationId}</span>
          <div className={`device-status ${deviceStatus}`}>
            <span className="status-indicator"></span>
            {deviceStatus === 'connected' ? 'Devices Connected' : 'Devices Disconnected'}
          </div>
        </div>
      </div>

      <div className="consultation-main">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-container">
            <div className="remote-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="video-element"
              />
              <div className="video-label">
                {user?.role === 'doctor' ? 'Patient' : 'Doctor'}
              </div>
            </div>
            
            <div className="local-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="video-element"
              />
              <div className="video-label">You</div>
            </div>
          </div>

          <div className="video-controls">
            {!isCallActive ? (
              <button className="control-btn start-call" onClick={startCall}>
                📹 {user?.role === 'doctor' ? 'Start Consultation' : 'Join Call'}
              </button>
            ) : (
              <>
                <button 
                  className={`control-btn ${isMuted ? 'muted' : ''}`}
                  onClick={toggleMute}
                >
                  {isMuted ? '🔇' : '🎤'}
                </button>
                
                <button 
                  className={`control-btn ${!isVideoOn ? 'video-off' : ''}`}
                  onClick={toggleVideo}
                >
                  {isVideoOn ? '📹' : '📷'}
                </button>
                
                <button className="control-btn end-call" onClick={endCall}>
                  📞 End Call
                </button>
              </>
            )}
          </div>
        </div>

        {/* Health Monitoring Section */}
        <div className="health-monitoring-section">
          <div className="monitoring-header">
            <h3>🫀 Real-time Health Monitoring</h3>
            <div className="body-part-selector">
              <label>Examination Area:</label>
              <select 
                value={selectedBodyPart} 
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                disabled={!isCallActive}
              >
                <option value="heart">❤️ Heart</option>
                <option value="lungs">🫁 Lungs</option>
                <option value="throat">🗣️ Throat</option>
                <option value="abdomen">🤰 Abdomen</option>
              </select>
            </div>
          </div>

          {/* Current Vitals */}
          <div className="current-vitals">
            <div className="vital-card primary">
              <div className="vital-icon">💓</div>
              <div className="vital-info">
                <div className="vital-label">Heart Rate</div>
                <div 
                  className="vital-value"
                  style={{ color: heartRateStatus.color }}
                >
                  {healthData.heartRate} BPM
                </div>
                <div className="vital-status">{heartRateStatus.status}</div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-icon">🩸</div>
              <div className="vital-info">
                <div className="vital-label">Blood Pressure</div>
                <div className="vital-value">{healthData.bloodPressure}</div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-icon">💨</div>
              <div className="vital-info">
                <div className="vital-label">Oxygen Sat</div>
                <div className="vital-value">{healthData.oxygenSaturation}%</div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-icon">🌡️</div>
              <div className="vital-info">
                <div className="vital-label">Temperature</div>
                <div className="vital-value">{healthData.temperature.toFixed(1)}°F</div>
              </div>
            </div>
          </div>

          {/* Real-time Chart */}
          <div className="real-time-chart">
            <div className="chart-header">
              <h4>📈 Live Heart Rate Monitor</h4>
              <div className="recording-controls">
                {!isRecording ? (
                  <button 
                    className="record-btn start"
                    onClick={startHealthMonitoring}
                    disabled={!isCallActive}
                  >
                    🔴 Start Monitoring
                  </button>
                ) : (
                  <button className="record-btn stop" onClick={stopHealthMonitoring}>
                    ⏹️ Stop Monitoring
                  </button>
                )}
              </div>
            </div>
            
            <div className="chart-container">
              {isRecording ? (
                <div className="heart-rate-chart">
                  <div className="chart-grid">
                    {heartRateHistory.map((reading, index) => (
                      <div 
                        key={index}
                        className="chart-bar"
                        style={{
                          height: `${(reading.value / 120) * 100}%`,
                          backgroundColor: getHeartRateStatus(reading.value).color
                        }}
                      >
                        <span className="bar-value">{reading.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    <span>Time: {new Date().toLocaleTimeString()}</span>
                    <span>Area: {selectedBodyPart}</span>
                  </div>
                </div>
              ) : (
                <div className="chart-placeholder">
                  <p>📊 Start monitoring to see real-time data</p>
                  <small>Place stethoscope on patient's {selectedBodyPart} area</small>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="monitoring-instructions">
            <h4>📋 Instructions</h4>
            <div className="instruction-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Ensure stethoscope is connected and positioned on {selectedBodyPart}</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Click "Start Monitoring" to begin real-time data collection</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Monitor live readings and communicate findings with patient</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      {user?.role === 'doctor' && (
        <div className="emergency-controls">
          <button className="emergency-btn">
            🚨 Emergency Protocol
          </button>
          <button className="emergency-btn">
            📝 Save Session Notes
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoConsultation;