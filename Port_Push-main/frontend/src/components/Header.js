import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, Shield } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-container">
              <Shield className="logo-icon" />
              <span className="logo-text">BHASHER</span>
              <Terminal className="logo-terminal" />
            </div>
          </Link>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-subtle);
          transition: all 0.3s ease;
        }

        .header.scrolled {
          background: rgba(0, 0, 0, 0.95);
          border-bottom-color: var(--brand-primary);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          height: 80px;
        }

        .logo {
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 24px;
          font-weight: 700;
        }

        .logo-icon {
          color: var(--brand-primary);
          animation: pulse 2s infinite;
        }

        .logo-text {
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
        }

        .logo-terminal {
          color: var(--brand-primary);
          animation: blink 1s infinite;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          padding: 8px 0;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link.active {
          color: var(--brand-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--brand-primary);
          border-radius: 1px;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 20px 0;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 12px 0;
          border-left: 3px solid transparent;
          padding-left: 20px;
        }

        .mobile-nav-link:hover {
          color: var(--text-primary);
          border-left-color: var(--brand-primary);
        }

        .mobile-nav-link.active {
          color: var(--brand-primary);
          border-left-color: var(--brand-primary);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;