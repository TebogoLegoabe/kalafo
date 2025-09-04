// src/components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brand-name">Kalafo</span>
            </div>
            <p className="footer-description">
              Revolutionizing healthcare through innovative digital diagnostic technology.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#digital-stethoscope">Digital Stethoscope</a>
            <a href="#features">Features</a>
            <a href="#specifications">Specifications</a>
            <a href="#pricing">Pricing</a>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#documentation">Documentation</a>
            <a href="#training">Training</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="contact-info">
              <a href="mailto:contact@kalafo.com">📧 contact@kalafo.com</a>
              <a href="tel:+15551234567">📞 +27 (12) 123-4567</a>
              <span>📍 1 Jan Smuts Avenue, Johannesburg</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>Made with ❤️ for healthcare professionals worldwide</p>
            <p>&copy; 2025 Kalafo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;