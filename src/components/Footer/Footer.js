import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Kalafo</h3>
          <p>Revolutionizing cardiac care with digital stethoscope technology</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>info@kalafo.com</p>
          <p>+123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Kalafo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;