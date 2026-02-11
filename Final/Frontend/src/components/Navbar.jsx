import React, { useState, useEffect } from 'react';
import myImage from '../assets/Logo.png';
import './styles/Navbar.css';

const Navbar = ({ onOpenLogin, onOpenSignup }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener to toggle sticky style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for nav links
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Updated SkyGrow nav items
  const navItems = ['home', 'features', 'pricing',  'contact'];

  return (
    <div className={`navbar-container ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar" aria-label="Primary navigation">
        <div className="navbar-content">
          {/* Logo */}
          <a href="/" className="logo-container" aria-label="SkyGrow Homepage">
            <img src={myImage} alt="SkyGrow Logo" className="logo-image" />
            <span className="logo-text">SkyGrow</span>
          </a>

          {/* Desktop nav links */}
          <div className="desktop-nav">
            <nav className="nav-links" role="menubar" aria-label="Main menu">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="nav-link"
                  onClick={(e) => handleNavClick(e, item)}
                >
                  <span className="nav-link-text">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                  <span className="nav-link-bg" aria-hidden="true"></span>
                </a>
              ))}
            </nav>

            <div className="divider" aria-hidden="true"></div>

            {/* Auth Buttons trigger modal open */}
            <div className="auth-buttons">
              <button className="btn-login" onClick={onOpenLogin} aria-haspopup="dialog">
                Login
              </button>
              <button className="btn-signup" onClick={onOpenSignup} aria-haspopup="dialog">
                Create Account
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="menu-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links & Auth */}
        {isMenuOpen && (
          <div className="mobile-menu" role="menu" aria-label="Mobile menu">
            <div className="mobile-menu-content">
              <div className="mobile-nav-container">
                <nav className="mobile-nav-links">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={`#${item}`}
                      className="mobile-nav-link"
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="mobile-auth-container">
                <button
                  className="mobile-btn-login"
                  onClick={() => {
                    onOpenLogin();
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="mobile-btn-signup"
                  onClick={() => {
                    onOpenSignup();
                    setIsMenuOpen(false);
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
