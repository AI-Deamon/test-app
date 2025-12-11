import React from 'react';
import { Download, MapPin, Mail, Phone, Calendar, Award, Briefcase, GraduationCap } from 'lucide-react';
import { personalInfo, aboutInfo, certifications } from '../data/mock';

const About = () => {
  return (
    <div className="about">
      <section className="about-hero section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h1 className="display-large">About Me</h1>
              <p className="body-large">{aboutInfo.bio}</p>
              
              <div className="personal-info">
                <div className="info-item">
                  <MapPin size={20} />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="info-item">
                  <Mail size={20} />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="info-item">
                  <Phone size={20} />
                  <span>{personalInfo.phone}</span>
                </div>
              </div>
              
              <div className="cta-buttons">
                <a href={personalInfo.resume} className="btn-primary" download>
                  <Download size={20} />
                  Download Resume
                </a>
                <a href={`mailto:${personalInfo.email}`} className="btn-secondary">
                  <Mail size={20} />
                  Get In Touch
                </a>
              </div>
            </div>
            
            <div className="about-visual">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <span className="avatar-text">B</span>
                  </div>
                  <div className="profile-info">
                    <h3>{personalInfo.name}</h3>
                    <p>@{personalInfo.handle}</p>
                    <div className="status-indicator">
                      <span className="status-dot"></span>
                      Available for opportunities
                    </div>
                  </div>
                </div>
                
                <div className="profile-stats">
                  <div className="stat">
                    <div className="stat-value">5+</div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">8+</div>
                    <div className="stat-label">Months</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">3+</div>
                    <div className="stat-label">Certifications</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="education section-small">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div className="timeline">
            {aboutInfo.education.map((edu, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <GraduationCap size={20} />
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{edu.degree}</h3>
                  <p className="timeline-subtitle">{edu.institution}</p>
                  <p className="timeline-meta">{edu.year} • CGPA: {edu.cgpa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience section-small">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {aboutInfo.experience.map((exp, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <Briefcase size={20} />
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{exp.role}</h3>
                  <p className="timeline-subtitle">{exp.company}</p>
                  <p className="timeline-meta">{exp.period}</p>
                  <p className="timeline-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications section-small">
        <div className="container">
          <h2 className="section-title">Certifications</h2>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="certification-header">
                  <Award className="certification-icon" />
                  <div className="certification-status">
                    <span className={`status-badge ${cert.status.toLowerCase().replace(' ', '-')}`}>
                      {cert.status}
                    </span>
                  </div>
                </div>
                <h3 className="certification-title">{cert.name}</h3>
                <p className="certification-issuer">{cert.issuer}</p>
                <p className="certification-date">{cert.date}</p>
                {cert.badge && (
                  <a href={cert.badge} target="_blank" rel="noopener noreferrer" className="certification-badge">
                    View Badge
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .about {
          min-height: 100vh;
        }

        .about-hero {
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 70% 30%, rgba(0, 255, 209, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .about-text {
          max-width: 600px;
        }

        .about-text h1 {
          margin-bottom: 24px;
        }

        .about-text p {
          margin-bottom: 32px;
          white-space: pre-line;
        }

        .personal-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
        }

        .info-item svg {
          color: var(--brand-primary);
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
        }

        .about-visual {
          display: flex;
          justify-content: center;
        }

        .profile-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 32px;
          max-width: 350px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .profile-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 255, 209, 0.1);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 60px;
          height: 60px;
          background: var(--brand-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: #000000;
        }

        .profile-info h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
        }

        .profile-info p {
          margin: 4px 0;
          color: var(--brand-primary);
          font-family: 'Courier New', monospace;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--brand-primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--brand-primary);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .education,
        .experience,
        .certifications {
          background: var(--bg-secondary);
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          color: var(--text-primary);
        }

        .timeline {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 30px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border-subtle);
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 48px;
          position: relative;
        }

        .timeline-marker {
          width: 60px;
          height: 60px;
          background: var(--bg-card);
          border: 2px solid var(--brand-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-primary);
          position: relative;
          z-index: 1;
        }

        .timeline-content {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(10px);
        }

        .timeline-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .timeline-subtitle {
          color: var(--brand-primary);
          font-weight: 500;
          margin-bottom: 8px;
        }

        .timeline-meta {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .timeline-description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .certification-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .certification-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 255, 209, 0.1);
          border-color: var(--brand-primary);
        }

        .certification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .certification-icon {
          color: var(--brand-primary);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.completed {
          background: rgba(0, 255, 209, 0.1);
          color: var(--brand-primary);
        }

        .status-badge.in-progress {
          background: rgba(255, 159, 10, 0.1);
          color: var(--brand-warning);
        }

        .certification-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .certification-issuer {
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .certification-date {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .certification-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--brand-primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .certification-badge:hover {
          color: var(--brand-active);
          transform: translateX(4px);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .about-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-card {
            max-width: none;
            width: 100%;
          }

          .timeline::before {
            left: 15px;
          }

          .timeline-item {
            gap: 16px;
          }

          .timeline-marker {
            width: 40px;
            height: 40px;
          }

          .certifications-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default About;