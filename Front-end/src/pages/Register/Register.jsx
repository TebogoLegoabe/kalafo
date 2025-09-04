import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Register.css';

// Import icons for visual enhancement
import { FaUserMd, FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' // Default to patient
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API
      const registrationData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };
      
      console.log('Registering user:', registrationData);
      
      const result = await register(registrationData);
      
      if (result.success) {
        setSuccessMessage('Registration successful! You can now login with your credentials.');
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'patient'
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Header />
      
      <main className="register-main">
        <div className="register-container">
          <div className="register-content">
            {/* Left side - Welcome message */}
            <div className="register-welcome">
              <div className="welcome-content">
                <h1>Join Kalafo</h1>
                <p className="welcome-subtitle">
                  Start your journey towards better healthcare with our revolutionary digital stethoscope platform.
                </p>
                
                <div className="benefits-list">
                  <div className="benefit-item">
                    <FaCheckCircle className="benefit-icon" />
                    <div>
                      <h4>Advanced Diagnostics</h4>
                      <p>Crystal-clear digital audio with AI-powered analysis</p>
                    </div>
                  </div>
                  
                  <div className="benefit-item">
                    <FaCheckCircle className="benefit-icon" />
                    <div>
                      <h4>Remote Consultations</h4>
                      <p>Connect with patients anywhere, anytime</p>
                    </div>
                  </div>
                  
                  <div className="benefit-item">
                    <FaCheckCircle className="benefit-icon" />
                    <div>
                      <h4>HIPAA Compliant</h4>
                      <p>Enterprise-grade security for patient data</p>
                    </div>
                  </div>
                </div>
                
                <div className="welcome-image">
                  <div className="floating-icon">🩺</div>
                </div>
              </div>
            </div>

            {/* Right side - Registration form */}
            <div className="register-form-section">
              <div className="register-form-container">
                <div className="form-header">
                  <h2>Create Your Account</h2>
                  <p>Join thousands of healthcare professionals</p>
                </div>
                
                <form onSubmit={handleSubmit} className="register-form">
                  {error && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      {error}
                    </div>
                  )}
                  
                  {successMessage && (
                    <div className="success-message">
                      <span className="success-icon">✅</span>
                      {successMessage}
                    </div>
                  )}
                  
                  {/* Role Selection */}
                  <div className="form-group role-selection">
                    <label htmlFor="role">I am a:</label>
                    <div className="role-options">
                      <div 
                        className={`role-option ${formData.role === 'patient' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                      >
                        <FaUser className="role-icon" />
                        <div className="role-content">
                          <h4>Patient</h4>
                          <p>Looking for medical consultations</p>
                        </div>
                        <input
                          type="radio"
                          name="role"
                          value="patient"
                          checked={formData.role === 'patient'}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                      
                      <div 
                        className={`role-option ${formData.role === 'doctor' ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                      >
                        <FaUserMd className="role-icon" />
                        <div className="role-content">
                          <h4>Healthcare Provider</h4>
                          <p>Medical professional providing services</p>
                        </div>
                        <input
                          type="radio"
                          name="role"
                          value="doctor"
                          checked={formData.role === 'doctor'}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">
                        <FaUser className="input-icon" />
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">
                        <FaUser className="input-icon" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  {/* Password Fields */}
                  <div className="form-group">
                    <label htmlFor="password">
                      <FaLock className="input-icon" />
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      disabled={loading}
                      required
                    />
                    <small className="form-help">
                      Password must be at least 6 characters long
                    </small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FaLock className="input-icon" />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="register-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <span className="button-arrow">→</span>
                      </>
                    )}
                  </button>
                  
                  {/* Login Link */}
                  <div className="login-link">
                    Already have an account? 
                    <Link to="/login">Sign in here</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Register;