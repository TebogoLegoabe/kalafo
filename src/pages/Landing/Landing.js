import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Advanced Digital Stethoscope Platform</h1>
            <p>Real-time cardiac monitoring for doctors and patients</p>
            <div className="hero-buttons">
              <a href="/register" className="btn-primary">Get Started</a>
              <a href="#features" className="btn-secondary">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            {/* Placeholder for stethoscope image */}
            <div className="image-placeholder"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Monitoring</h3>
              <p>View heart rate and sounds in real-time during consultations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Doctor-Patient Video</h3>
              <p>Integrated video calls with stethoscope guidance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Records</h3>
              <p>All patient data securely stored and encrypted</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <h2>About Kalafo</h2>
          <p>
            Kalafo is a digital stethoscope platform designed to bridge the gap between doctors and patients 
            through remote cardiac monitoring. Our technology enables accurate heart sound capture and 
            real-time sharing between medical professionals and their patients.
          </p>
        </section>
      </main>
      <Footer />

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem' }}>
  <a href="/admin-dashboard" className="btn-primary">Admin Dashboard</a>
  <a href="/doctor-dashboard" className="btn-primary">Doctor Dashboard</a>
  <a href="/patient-dashboard" className="btn-primary">Patient Dashboard</a>
</div>
    </div>

    
  );
}

export default Landing;