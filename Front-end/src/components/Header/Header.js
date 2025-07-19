import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import kalafoLogo from '../../assets/images/kalafo2.jpg';

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={kalafoLogo} alt="Kalafo Logo" className="logo-image" />
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <Link to="/login" className="login-btn">Login</Link>
      </nav>
    </header>
  );
}

export default Header;