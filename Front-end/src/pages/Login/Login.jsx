import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Login.css';

// Import icons for visual enhancement
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStethoscope, FaShieldAlt, FaUserMd } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect based on user role
        const role = result.user.role;
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');
    
    const demoCredentials = {
      admin: { email: 'admin@kalafo.com', password: 'admin123' },
      doctor: { email: 'doctor@kalafo.com', password: 'doctor123' },
      patient: { email: 'patient@kalafo.com', password: 'patient123' }
    };
    
    try {
      const creds = demoCredentials[role];
      const result = await login(creds.email, creds.password);
      
      if (result.success) {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      } else {
        setError(result.error || 'Demo login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      
      <main className="login-main">
        <div className="login-container">
          <div className="login-content">
            {/* Left side - Welcome back message */}
            <div className="login-welcome">
              <div className="welcome-content">
                <h1>Welcome Back</h1>
                <p className="welcome-subtitle">
                  Sign in to access your Kalafo dashboard and continue providing exceptional healthcare.
                </p>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="login-form-section">
              <div className="login-form-container">
                <div className="form-header">
                  <h2>Sign In</h2>
                  <p>Access your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                  {error && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      {error}
                    </div>
                  )}
                  
                  {/* Email Field */}
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  {/* Password Field */}
                  <div className="form-group">
                    <label htmlFor="password">
                      <FaLock className="input-icon" />
                      Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="form-options">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                      />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot-password">
                      Forgot password?
                    </Link>
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner">
                          <span>Signing In</span>
                          <div className="loading-dots">
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        Sign In
                        <span className="button-arrow">→</span>
                      </>
                    )}
                  </button>
                  
                  {/* Register Link */}
                  <div className="register-link">
                    Don't have an account? 
                    <Link to="/register">Create one here</Link>
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

export default Login;