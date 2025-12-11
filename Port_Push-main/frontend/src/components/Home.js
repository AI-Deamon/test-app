import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Download, Terminal, Shield, Code, Lock } from 'lucide-react';
import { personalInfo, projects } from '../data/mock';

const Home = () => {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = personalInfo.tagline;

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [fullText]);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="terminal-greeting">
                <div className="terminal-header">
                  <span className="terminal-user">root@bhasher:~$</span>
                  <span className="terminal-command">whoami</span>
                </div>
              </div>
              
              <h1 className="hero-title">
                <span className="name-highlight">{personalInfo.name}</span>
                <span className="handle">@{personalInfo.handle}</span>
              </h1>
              
              <div className="typewriter-container">
                <p className="typewriter-text">
                  {displayText}
                  {!isTypingComplete && <span className="cursor">|</span>}
                </p>
              </div>
              
              <div className="hero-stats">
                <div className="stat">
                  <Shield className="stat-icon" />
                  <span>Cybersecurity Specialist</span>
                </div>
                <div className="stat">
                  <Lock className="stat-icon" />
                  <span>Ethical Hacker</span>
                </div>
                <div className="stat">
                  <Code className="stat-icon" />
                  <span>Security Researcher</span>
                </div>
              </div>
              
              <div className="hero-actions">
                <Link to="/projects" className="btn-primary">
                  View Projects
                </Link>
                <a href={personalInfo.resume} className="btn-secondary" download>
                  <Download size={20} />
                  Resume
                </a>
              </div>
              
              <div className="social-links">
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Github size={24} />
                </a>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Linkedin size={24} />
                </a>
                <a href={`mailto:${personalInfo.email}`} className="social-link">
                  <Mail size={24} />
                </a>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="code-animation">
                <div className="terminal">
                  <div className="terminal-content">
                    <div className="code-line">
                      <span className="code-comment"># Cybersecurity Toolkit</span>
                    </div>
                    <div className="code-line">
                      <span className="code-keyword">import</span> <span className="code-variable">security_tools</span>
                    </div>
                    <div className="code-line">
                      <span className="code-keyword">from</span> <span className="code-variable">ethical_hacking</span> <span className="code-keyword">import</span> <span className="code-function">*</span>
                    </div>
                    <div className="code-line">
                      <span className="code-keyword">class</span> <span className="code-function">CyberSecurityExpert</span>:
                    </div>
                    <div className="code-line">
                      &nbsp;&nbsp;<span className="code-keyword">def</span> <span className="code-function">__init__</span>(<span className="code-variable">self</span>):
                    </div>
                    <div className="code-line">
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-variable">self</span>.name = <span className="code-string">"Bhasker"</span>
                    </div>
                    <div className="code-line">
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-variable">self</span>.skills = [<span className="code-string">"pentesting"</span>, <span className="code-string">"SIEM"</span>]
                    </div>
                    <div className="code-line">
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-variable">self</span>.passion = <span className="code-string">"cybersecurity"</span>
                    </div>
                    <div className="code-line">
                      <span className="cursor">_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects section">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="project-card fade-in" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                      <Github size={20} />
                    </a>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                      <Terminal size={20} />
                    </a>
                  </div>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="section-actions">
            <Link to="/projects" className="btn-secondary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home {
          min-height: 100vh;
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(0, 255, 209, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(10, 132, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .terminal-greeting {
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: var(--terminal-text);
        }

        .terminal-header {
          display: flex;
          gap: 10px;
        }

        .terminal-user {
          color: var(--brand-primary);
        }

        .terminal-command {
          color: var(--text-secondary);
        }

        .hero-title {
          font-size: 66px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .name-highlight {
          color: var(--text-primary);
        }

        .handle {
          color: var(--brand-primary);
          font-size: 48px;
          font-family: 'Courier New', monospace;
        }

        .typewriter-container {
          margin-bottom: 32px;
        }

        .typewriter-text {
          font-size: 20px;
          color: var(--text-secondary);
          min-height: 60px;
          display: flex;
          align-items: center;
        }

        .hero-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .stat-icon {
          color: var(--brand-primary);
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .social-links {
          display: flex;
          gap: 16px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
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

        .hero-visual {
          position: relative;
        }

        .code-animation {
          position: relative;
        }

        .terminal {
          background: var(--terminal-bg);
          border: 1px solid var(--terminal-border);
          border-radius: 12px;
          padding: 24px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .terminal::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: linear-gradient(90deg, #FF5F56, #FFBD2E, #27CA3F);
          background-size: 60px 30px;
          background-repeat: no-repeat;
          background-position: 10px center;
          border-radius: 12px 12px 0 0;
        }

        .terminal-content {
          margin-top: 10px;
        }

        .code-line {
          margin-bottom: 4px;
        }

        .featured-projects {
          background: var(--bg-secondary);
        }

        .section-title {
          font-size: 48px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          color: var(--text-primary);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
          margin-bottom: 60px;
        }

        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 32px;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
        }

        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 255, 209, 0.15);
          border-color: var(--brand-primary);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .project-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .project-links {
          display: flex;
          gap: 8px;
        }

        .project-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .project-link:hover {
          background: var(--brand-primary);
          color: #000000;
        }

        .project-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tech-tag {
          background: rgba(0, 255, 209, 0.1);
          color: var(--brand-primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .section-actions {
          text-align: center;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-title {
            font-size: 40px;
          }

          .handle {
            font-size: 32px;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-actions {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;