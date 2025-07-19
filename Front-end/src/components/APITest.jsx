import React, { useState } from 'react';

function APITest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testHealthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        health: { success: true, data, status: response.status }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        health: { success: false, error: error.message }
      }));
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@kalafo.com',
          password: 'admin123'
        }),
      });
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        login: { success: response.ok, data, status: response.status }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        login: { success: false, error: error.message }
      }));
    }
    setLoading(false);
  };

  const testCORS = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'OPTIONS'
      });
      setTestResults(prev => ({
        ...prev,
        cors: { success: true, status: response.status, headers: [...response.headers.entries()] }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        cors: { success: false, error: error.message }
      }));
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '2px solid #ff4444', 
      borderRadius: '8px',
      backgroundColor: '#fff5f5'
    }}>
      <h2>🔧 API Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testHealthEndpoint} 
          disabled={loading}
          style={{ margin: '5px', padding: '10px 15px' }}
        >
          Test Health Endpoint
        </button>
        
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{ margin: '5px', padding: '10px 15px' }}
        >
          Test Login API
        </button>
        
        <button 
          onClick={testCORS} 
          disabled={loading}
          style={{ margin: '5px', padding: '10px 15px' }}
        >
          Test CORS
        </button>
      </div>

      {loading && <p>Testing...</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        <pre style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <h4>Expected Results:</h4>
        <ul>
          <li><strong>Health:</strong> Should return {`{"status": "healthy", "message": "Kalafo API is running"}`}</li>
          <li><strong>Login:</strong> Should return access_token and user data</li>
          <li><strong>CORS:</strong> Should allow cross-origin requests</li>
        </ul>
      </div>
    </div>
  );
}

export default APITest;