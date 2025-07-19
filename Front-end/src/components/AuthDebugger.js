// Create this file: src/components/AuthDebugger.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AuthDebugger() {
  const { login, logout, isAuthenticated, userRole, userEmail } = useAuth();
  const navigate = useNavigate();

  const testAdminLogin = () => {
    console.log('🧪 Testing admin login...');
    login('admin@test.com', 'admin');
    setTimeout(() => {
      console.log('🚀 Navigating to admin dashboard...');
      navigate('/admin-dashboard');
    }, 200);
  };

  const testPatientLogin = () => {
    console.log('🧪 Testing patient login...');
    login('patient@test.com', 'patient');
    setTimeout(() => {
      console.log('🚀 Navigating to patient dashboard...');
      navigate('/patient-dashboard');
    }, 200);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ff6b6b', 
      margin: '20px',
      backgroundColor: '#ffe0e0',
      borderRadius: '8px'
    }}>
      <h3>🔧 Auth Debugger</h3>
      
      <div style={{ marginBottom: '15px', fontSize: '14px' }}>
        <strong>Current State:</strong><br/>
        ✅ Authenticated: {isAuthenticated ? 'YES' : 'NO'}<br/>
        👤 Role: {userRole || 'None'}<br/>
        📧 Email: {userEmail || 'None'}<br/>
        💾 Storage: {localStorage.getItem('auth') ? 'Has data' : 'Empty'}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testAdminLogin} 
          style={{ 
            margin: '5px', 
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔑 Test Admin Login
        </button>
        
        <button 
          onClick={testPatientLogin} 
          style={{ 
            margin: '5px', 
            padding: '10px 15px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🏥 Test Patient Login
        </button>
        
        <button 
          onClick={logout} 
          style={{ 
            margin: '5px', 
            padding: '10px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🚪 Logout
        </button>
      </div>
      
      <div>
        <a 
          href="/admin-dashboard" 
          style={{ margin: '10px', color: '#4CAF50', textDecoration: 'none' }}
        >
          📊 Direct Admin Link
        </a>
        <a 
          href="/patient-dashboard" 
          style={{ margin: '10px', color: '#2196F3', textDecoration: 'none' }}
        >
          🏥 Direct Patient Link
        </a>
      </div>
    </div>
  );
}

export default AuthDebugger;