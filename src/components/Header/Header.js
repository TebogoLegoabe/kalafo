import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <span className="logo-text">KALAFO</span>
        <span className="logo-subtext">Digital Stethoscope</span>
      </div>
      <nav className="nav-links">
      <a href="">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="/login" className="login-btn">Login</a>
      </nav>
    </header>
  );
}

export default Header;