// src/components/Header/Header.jsx - Simplified Version
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  // Function to create navigation links
  const createNavLink = (href, text) => {
    // If we're on the home page, use anchor links
    if (location.pathname === '/') {
      return (
        <a 
          href={href} 
          onClick={closeMobileMenu}
          className="nav-link"
        >
          {text}
        </a>
      );
    } else {
      // If we're on another page, navigate to home with hash
      return (
        <Link 
          to={`/${href}`} 
          onClick={closeMobileMenu}
          className="nav-link"
        >
          {text}
        </Link>
      );
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Far left KALAFO - Always redirects to home */}
          <Link
            to="/"
            className="far-left-brand"
            style={{
              marginRight: 'auto',
              fontWeight: 'bold',
              color: '#0da9e7ff',
              textDecoration: 'none',
              fontSize: '1.2em',
              letterSpacing: '2px'
            }}
            onClick={(e) => {
              closeMobileMenu();
              // If we're already on home page, scroll to top
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              // Otherwise, React Router will handle navigation to "/"
            }}
          >
            <span className="far-left-text">KALAFO</span>
          </Link>

          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
          </Link>

          {/* Navigation */}
          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            {createNavLink('#home', 'Home')}
            {createNavLink('#features', 'Features')}
            {createNavLink('#about', 'About')}
            {createNavLink('#contact', 'Contact')}
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