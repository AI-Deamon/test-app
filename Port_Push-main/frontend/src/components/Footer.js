import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Phone, MapPin, Shield, Terminal, Heart } from 'lucide-react';
import { personalInfo } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Projects', path: '/projects' },
        { label: 'Skills', path: '/skills' },
        { label: 'Blog', path: '/blog' },
        { label: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Projects',
      links: [
        { label: 'NotePass Password Manager', path: '/projects' },
        { label: 'Bug Bounty Research', path: '/projects' },
        { label: 'Cybersecurity Home Lab', path: '/projects' },
        { label: 'All Projects', path: '/projects' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Resume', path: personalInfo.resume, external: true },
        { label: 'GitHub', path: personalInfo.github, external: true },
        { label: 'LinkedIn', path: personalInfo.linkedin, external: true },
        { label: 'Email', path: `mailto:${personalInfo.email}`, external: true }
      ]
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      href: personalInfo.github,
      label: 'GitHub'
    },
    {
      icon: Linkedin,
      href: personalInfo.linkedin,
      label: 'LinkedIn'
    },
    {
      icon: Mail,
      href: `mailto:${personalInfo.email}`,
      label: 'Email'
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">
                <Shield className="logo-icon" />
                <span className="logo-text">BHASHER</span>
                <Terminal className="logo-terminal" />
              </div>
              <p className="brand-description">
                Cybersecurity enthusiast passionate about securing digital environments 
                and ethical hacking. Building a safer digital world, one vulnerability at a time.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              {footerSections.map((section, index) => (
                <div key={index} className="footer-section">
                  <h3 className="section-title">{section.title}</h3>
                  <ul className="section-links">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.external ? (
                          <a 
                            href={link.path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-link"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link to={link.path} className="footer-link">
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-social">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    title={social.label}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>

            <div className="footer-terminal">
              <div className="terminal-line">
                <span className="prompt">root@portfolio:~$</span>
                <span className="command">echo "Thanks for visiting!"</span>
              </div>
            </div>

            <div className="footer-copyright">
              <p>
                © {currentYear} {personalInfo.name}. Made with{' '}
                <Heart size={16} className="heart-icon" /> for cybersecurity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-primary);
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
        }

        .footer-main {
          padding: 60px 0;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
        }

        .footer-brand {
          max-width: 400px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
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

        .brand-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .contact-item svg {
          color: var(--brand-primary);
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .section-title {
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .section-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .section-links li {
          margin-bottom: 12px;
        }

        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: block;
        }

        .footer-link:hover {
          color: var(--brand-primary);
          transform: translateX(4px);
        }

        .footer-bottom {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          padding: 24px 0;
        }

        .footer-bottom-content {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 32px;
          align-items: center;
        }

        .footer-social {
          display: flex;
          gap: 16px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--brand-primary);
          color: #000000;
          transform: translateY(-2px);
        }

        .footer-terminal {
          display: flex;
          justify-content: center;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }

        .terminal-line {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .prompt {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .command {
          color: var(--text-secondary);
        }

        .footer-copyright {
          text-align: right;
        }

        .footer-copyright p {
          color: var(--text-muted);
          font-size: 14px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .heart-icon {
          color: #ff4757;
          animation: heartbeat 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-bottom-content {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
          }

          .footer-social {
            justify-content: center;
          }

          .footer-terminal {
            order: -1;
          }

          .footer-copyright {
            text-align: center;
          }

          .footer-copyright p {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-main {
            padding: 40px 0;
          }

          .brand-logo {
            font-size: 20px;
          }

          .footer-links {
            gap: 24px;
          }

          .section-title {
            font-size: 16px;
          }

          .footer-link {
            font-size: 13px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;