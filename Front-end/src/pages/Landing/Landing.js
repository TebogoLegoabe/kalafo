// src/pages/Landing/Landing.js
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <Header />
      
      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Kalafo</h1>
            <p>Your trusted telemedicine platform for remote healthcare consultations</p>
            <div className="hero-buttons">
              <a href="/login" className="btn btn-primary">Get Started</a>
              <a href="#features" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <h2>Our Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🏥 Remote Consultations</h3>
                <p>Connect with healthcare professionals from the comfort of your home</p>
              </div>
              <div className="feature-card">
                <h3>📱 Easy to Use</h3>
                <p>Simple and intuitive interface for patients and doctors</p>
              </div>
              <div className="feature-card">
                <h3>🔒 Secure & Private</h3>
                <p>Your health data is protected with enterprise-grade security</p>
              </div>
              <div className="feature-card">
                <h3>📊 Health Tracking</h3>
                <p>Monitor your health metrics and track your progress</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <h2>About Kalafo</h2>
            <p>
              Kalafo is a cutting-edge telemedicine platform that bridges the gap between 
              patients and healthcare providers. Our mission is to make quality healthcare 
              accessible to everyone, regardless of location or circumstances.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="container">
            <h2>Contact Us</h2>
            <p>Have questions? We're here to help!</p>
            <div className="contact-info">
              <p>📧 Email: support@kalafo.com</p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>🌐 Website: www.kalafo.com</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default Landing;