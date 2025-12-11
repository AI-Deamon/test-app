import React, { useState, useEffect } from 'react';
import { Monitor, Terminal, Code, Database, Shield, Lock, Wifi, Activity } from 'lucide-react';
import { skills } from '../data/mock';

const Skills = () => {
  const [animatedSkills, setAnimatedSkills] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      const animated = {};
      [...skills.platforms, ...skills.tools, ...skills.languages].forEach(skill => {
        animated[skill.name] = skill.level;
      });
      setAnimatedSkills(animated);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getSkillIcon = (skillName) => {
    const iconMap = {
      'Linux': Monitor,
      'Android': Monitor,
      'Windows': Monitor,
      'Burp Suite': Shield,
      'Metasploit': Terminal,
      'Nmap': Wifi,
      'Hydra': Lock,
      'Wazuh': Activity,
      'Splunk': Database,
      'Wireshark': Activity,
      'Bash': Terminal,
      'Python': Code,
      'Java': Code
    };
    return iconMap[skillName] || Code;
  };

  const allSkills = [
    ...skills.platforms.map(skill => ({...skill, category: 'platforms'})),
    ...skills.tools.map(skill => ({...skill, category: 'tools'})),
    ...skills.languages.map(skill => ({...skill, category: 'languages'}))
  ];

  const filteredSkills = activeCategory === 'all' 
    ? allSkills 
    : allSkills.filter(skill => skill.category === activeCategory);

  return (
    <div className="skills">
      <section className="skills-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">Skills & Expertise</h1>
            <p className="body-large">
              My technical arsenal spans across multiple domains of cybersecurity, from penetration testing to SIEM implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="skills-filter section-small">
        <div className="container">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Skills
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'platforms' ? 'active' : ''}`}
              onClick={() => setActiveCategory('platforms')}
            >
              <Monitor size={16} />
              Platforms
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveCategory('tools')}
            >
              <Shield size={16} />
              Security Tools
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'languages' ? 'active' : ''}`}
              onClick={() => setActiveCategory('languages')}
            >
              <Code size={16} />
              Languages
            </button>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="skills-grid-section section">
        <div className="container">
          <div className="skills-grid">
            {filteredSkills.map((skill, index) => {
              const IconComponent = getSkillIcon(skill.name);
              return (
                <div 
                  key={skill.name} 
                  className="skill-card"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="skill-header">
                    <div className="skill-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="skill-level">
                      <span className="level-text">{skill.level}%</span>
                    </div>
                  </div>
                  
                  <div className="skill-content">
                    <h3 className="skill-name">{skill.name}</h3>
                    <p className="skill-description">{skill.description}</p>
                  </div>
                  
                  <div className="skill-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${animatedSkills[skill.name] || 0}%`
                        }}
                      />
                    </div>
                    <div className="progress-labels">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Terminal Skills Demo */}
      <section className="terminal-demo section">
        <div className="container">
          <h2 className="section-title">Command Line Expertise</h2>
          <div className="terminal-container">
            <div className="terminal">
              <div className="terminal-header">
                <span className="terminal-title">bhasker@security-lab:~$</span>
              </div>
              <div className="terminal-content">
                <div className="terminal-line">
                  <span className="prompt">root@kali:~#</span>
                  <span className="command">nmap -sS -O target_ip</span>
                </div>
                <div className="terminal-line">
                  <span className="output">Starting Nmap 7.92 ( https://nmap.org )</span>
                </div>
                <div className="terminal-line">
                  <span className="output">Nmap scan report for target</span>
                </div>
                <div className="terminal-line">
                  <span className="output">PORT    STATE SERVICE</span>
                </div>
                <div className="terminal-line">
                  <span className="output">22/tcp  open  ssh</span>
                </div>
                <div className="terminal-line">
                  <span className="output">80/tcp  open  http</span>
                </div>
                <div className="terminal-line">
                  <span className="output">443/tcp open  https</span>
                </div>
                <div className="terminal-line">
                  <span className="prompt">root@kali:~#</span>
                  <span className="command">hydra -l admin -P wordlist.txt ssh://target_ip</span>
                </div>
                <div className="terminal-line">
                  <span className="output">Hydra v9.3 starting...</span>
                </div>
                <div className="terminal-line">
                  <span className="prompt">root@kali:~#</span>
                  <span className="cursor">_</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Categories Overview */}
      <section className="skills-overview section-small">
        <div className="container">
          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-icon">
                <Monitor size={32} />
              </div>
              <h3>Platforms</h3>
              <p>Expert in Linux distributions, particularly Ubuntu and Kali Linux for security testing, along with Android and Windows environments.</p>
              <div className="overview-stats">
                <span>{skills.platforms.length} Platforms</span>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="overview-icon">
                <Shield size={32} />
              </div>
              <h3>Security Tools</h3>
              <p>Proficient in industry-standard cybersecurity tools for penetration testing, vulnerability assessment, and security monitoring.</p>
              <div className="overview-stats">
                <span>{skills.tools.length} Tools</span>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="overview-icon">
                <Code size={32} />
              </div>
              <h3>Programming</h3>
              <p>Strong scripting and programming skills for automation, tool development, and security script creation.</p>
              <div className="overview-stats">
                <span>{skills.languages.length} Languages</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .skills {
          min-height: 100vh;
        }

        .skills-hero {
          text-align: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        .skills-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 40% 60%, rgba(0, 255, 209, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          margin-bottom: 24px;
        }

        .skills-filter {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .filter-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 12px 20px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: var(--brand-primary);
          color: #000000;
          border-color: var(--brand-primary);
        }

        .skills-grid-section {
          background: var(--bg-primary);
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .skill-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .skill-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 255, 209, 0.1);
          border-color: var(--brand-primary);
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .skill-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(0, 255, 209, 0.1);
          border-radius: 8px;
          color: var(--brand-primary);
        }

        .skill-level {
          font-size: 14px;
          font-weight: 600;
          color: var(--brand-primary);
        }

        .skill-content {
          margin-bottom: 20px;
        }

        .skill-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .skill-description {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
        }

        .skill-progress {
          margin-top: 16px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--brand-primary), var(--brand-active));
          border-radius: 3px;
          transition: width 1.5s ease-out;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }

        .terminal-demo {
          background: var(--bg-secondary);
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          color: var(--text-primary);
        }

        .terminal-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .terminal {
          background: var(--terminal-bg);
          border: 1px solid var(--terminal-border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .terminal-header {
          background: #21262d;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .terminal-header::before {
          content: '';
          display: flex;
          gap: 6px;
        }

        .terminal-header::before {
          content: '● ● ●';
          color: #ff5f56;
          font-size: 10px;
        }

        .terminal-title {
          color: var(--text-secondary);
          font-size: 14px;
          font-family: 'Courier New', monospace;
          margin-left: 20px;
        }

        .terminal-content {
          padding: 20px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .terminal-line {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .prompt {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .command {
          color: var(--text-primary);
        }

        .output {
          color: var(--text-secondary);
        }

        .cursor {
          color: var(--brand-primary);
          animation: blink 1s infinite;
        }

        .skills-overview {
          background: var(--bg-primary);
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .overview-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .overview-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 255, 209, 0.1);
          border-color: var(--brand-primary);
        }

        .overview-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: rgba(0, 255, 209, 0.1);
          border-radius: 12px;
          color: var(--brand-primary);
          margin: 0 auto 20px;
        }

        .overview-card h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin-bottom: 16px;
        }

        .overview-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .overview-stats {
          color: var(--brand-primary);
          font-weight: 600;
          font-size: 14px;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            flex-direction: column;
            align-items: center;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .terminal-content {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Skills;