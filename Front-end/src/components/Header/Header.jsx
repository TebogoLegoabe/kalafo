// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Far left KALAFO */}
          <Link
            to="/"
            className="far-left-brand"
            style={{
              marginRight: 'auto',
              fontWeight: 'bold',
              color: '#0da9e7ff', // Example color, adjust as needed
              textDecoration: 'none',
              fontSize: '1.2em',
              letterSpacing: '2px'
            }}
            onClick={closeMobileMenu}
          >
            <span className="far-left-text">KALAFO</span>
          </Link>

          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
          </Link>

          {/* Navigation */}
          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <a href="#home" onClick={closeMobileMenu}>Home</a>
            <a href="#features" onClick={closeMobileMenu}>Features</a>
            <a href="#about" onClick={closeMobileMenu}>About</a>
            <a href="#contact" onClick={closeMobileMenu}>Contact</a>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <Link to="/login" className="login-btn" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link to="/register" className="signup-btn" onClick={closeMobileMenu}>
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
}

export default Header;
