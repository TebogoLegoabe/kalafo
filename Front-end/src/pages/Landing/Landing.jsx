// src/pages/Landing/Landing.jsx
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Landing.css';

// Import professional icons from react-icons
import { 
  HiUserGroup, 
  HiGlobeAlt, 
  HiChartBar,
  HiUsers,
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiClock 
} from 'react-icons/hi';

import { 
  FaStethoscope,
  FaShieldAlt,
  FaMobileAlt,
  FaEye,
  FaWifi,
  FaBatteryFull
} from 'react-icons/fa';

function Landing() {
  return (
    <div className="landing-page">
      <Header />
      
      <main className="landing-main">
        {/* Hero Section - Added id="home" */}
        <section id="home" className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-left">
                <h1 className="hero-title">
                  Revolutionary
                  <br />
                  <span className="gradient-text">Digital</span>
                  <br />
                  <span className="gradient-text">Stethoscope</span>
                </h1>
                
                <p className="hero-subtitle">
                  Experience the future of cardiac diagnostics with our advanced digital stethoscope. 
                  Crystal-clear audio, Meet with your Dr. online and get prescriptions instantly.
                </p>
                
                <div className="hero-actions">
                  <Link to="/register" className="cta-primary">
                    Get Started
                  </Link>
                   <Link to="/register" className="cta-primary">
                    Meet Our Team
                  </Link>
                </div>
              </div>

             <div className="hero-illustration">
              <img 
                src="/doctor.png" 
                alt="Female doctor with stethoscope" 
                className="doctor-illustration"
                width={750}
                height={750}
                style={{ objectFit: 'cover', borderRadius: '25px' }}
              />
            </div>

            </div>
          </div>
        </section>

          
        {/* Features Section - Added id="features" */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <h2>Cutting-Edge Features</h2>
              <p>Discover the innovative technology that makes Kalafo the most advanced digital stethoscope for modern healthcare professionals.</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaStethoscope />
                </div>
                <h3>Advanced Audio Processing</h3>
                <p>Crystal-clear digital audio with noise cancellation and amplification for precise cardiac assessment.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaMobileAlt />
                </div>
                <h3>Mobile Integration</h3>
                <p>Seamlessly connect to iOS and Android devices for real-time monitoring and data sharing.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaWifi />
                </div>
                <h3>Wireless Connectivity</h3>
                <p>Bluetooth and Wi-Fi enabled for effortless data transmission and remote consultations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Added id="about" */}
        <section id="about" className="about">
          <div className="container">
            <div className="about-content">
              <div className="about-left">
                <h2>About Kalafo</h2>
                <p>
                  We are a health-tech company developing end-to-end solutions for accessible healthcare. 
                  Our flagship innovation is a digital stethoscope, integrated with a telehealth platform that enables real-time, one-on-one doctor consultations. 
                  By combining medical-grade diagnostic tools with seamless virtual care, we aim to bring healthcare directly to the patient—anytime, anywhere.
                </p>

                <h2>Our Mission</h2>
                <p>
                  At Kalafo, our mission is to improve access to healthcare. We believe that everyone deserves quality medical care, regardless of their location or circumstances.
                </p>

                <h2>Our Vision</h2>
                <p>
                  To be the most patient-centric company in the world. We envision a future where healthcare is accessible, affordable, and personalized for everyone.
                </p>
              </div>

              <div className="about-right">
                <div className="stats-grid">
                  <Link to="/about" className="learn-more-btn">
                  Learn Our Story
                </Link>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <HiUsers />
                    </div>
                    <div className="stat-number">6</div>
                    <div className="stat-label">Team Members</div>
                  </div>

                    <div className="stat-card">
                    <div className="stat-icon">
                      <HiUsers />
                    </div>
                    <div className="stat-number">100+</div>
                    <div className="stat-label">Patients</div>
                  </div>

                    <div className="stat-card">
                    <div className="stat-icon">
                      <FaStethoscope />
                    </div>
                    <div className="stat-number">1</div>
                    <div className="stat-label">Year of Innovation</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <HiUserGroup />
                    </div>
                    <div className="stat-number">10+</div>
                    <div className="stat-label">Healthcare Professionals</div>
                  
                  
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Added id="contact" */}
        <section id="contact" className="contact">
          <div className="container">
            <div className="section-header">
              <h2>Get In Touch</h2>
              <p>Ready to revolutionize your practice with Kalafo? Contact us today to learn more about our digital stethoscope and how it can enhance your patient care.</p>
            </div>
            
            <div className="contact-content">
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">
                    <HiMail />
                  </div>
                  <h3>Email Us</h3>
                  <p>Get in touch with our team</p>
                  <a href="mailto:contact@kalafo.com">contact@kalafo.com</a>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">
                    <HiPhone />
                  </div>
                  <h3>Call Us</h3>
                  <p>Speak with our specialists</p>
                  <a href="tel:+15551234567">+27 (12) 123-4567</a>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">
                    <HiLocationMarker />
                  </div>
                  <h3>Visit Us</h3>
                  <p>Our headquarters</p>
                  <address>1 Jan Smuts Avenue, Johannesburg</address>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon">
                    <HiClock />
                  </div>
                  <h3>Business Hours</h3>
                  <p>We're here to help</p>
                  <span>Mon-Fri: 8AM-5PM</span>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Send us a message</h3>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
                
                <div className="form-grid">
                  <div className="form-row">
                    <div className="form-group">
                      <input type="text" placeholder="First Name" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Last Name" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <input type="email" placeholder="Email Address" />
                  </div>
                  
                  <div className="form-group">
                    <input type="text" placeholder="Company" />
                  </div>
                  
                  <div className="form-group">
                    <textarea placeholder="Tell us about your needs..." rows="4"></textarea>
                  </div>
                  
                  <button className="send-message-btn">Send Message</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default Landing;