import React from 'react';
import './Header.css';
import kalafoLogo from '../../assets/images/kalafo2.jpg';


function Header() {
  return (
    <header className="header">
      <div className="logo-container">
      <img src={kalafoLogo} alt="Kalafo Logo" className="logo-image" />
        
      </div>
      <nav className="nav-links">
      <a href="">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#Contact">Contact</a>
        <a href="/login" className="login-btn">Login</a>
      </nav>
    </header>
  );
}

export default Header;


