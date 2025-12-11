import React, { useState } from 'react';
import { Github, ExternalLink, Calendar, Code, Filter } from 'lucide-react';
import { projects } from '../data/mock';

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);

  // Get unique technologies for filter
  const allTechnologies = [...new Set(projects.flatMap(project => project.tech))];
  
  // Filter projects based on selected technology
  const filteredProjects = selectedFilter === 'all' 
    ? projects 
    : projects.filter(project => project.tech.includes(selectedFilter));

  return (
    <div className="projects">
      <section className="projects-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">Projects</h1>
            <p className="body-large">
              A collection of cybersecurity projects, tools, and research that showcase my passion for securing digital environments and ethical hacking.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="projects-filter section-small">
        <div className="container">
          <div className="filter-header">
            <Filter size={20} />
            <span>Filter by Technology</span>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Projects
            </button>
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                className={`filter-btn ${selectedFilter === tech ? 'active' : ''}`}
                onClick={() => setSelectedFilter(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects-grid-section section">
        <div className="container">
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="project-header">
                  <div className="project-meta">
                    <Calendar size={16} />
                    <span>{project.period}</span>
                  </div>
                  <div className="project-links">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link"
                      title="View Source Code"
                    >
                      <Github size={20} />
                    </a>
                    <a 
                      href={project.demo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link"
                      title="View Live Demo"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-features">
                    <h4>Key Features:</h4>
                    <ul>
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="project-footer">
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        <Code size={12} />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {hoveredProject === project.id && (
                  <div className="project-overlay">
                    <div className="overlay-content">
                      <p>Click to explore this project</p>
                      <div className="overlay-actions">
                        <a href={project.github} className="overlay-btn">
                          <Github size={16} />
                          Code
                        </a>
                        <a href={project.demo} className="overlay-btn">
                          <ExternalLink size={16} />
                          Demo
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="no-projects">
              <Code size={48} />
              <h3>No projects found</h3>
              <p>Try adjusting your filter or check back later for new projects.</p>
            </div>
          )}
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="github-cta section-small">
        <div className="container">
          <div className="cta-content">
            <h2>Want to see more?</h2>
            <p>Check out my GitHub for additional projects, contributions, and code samples.</p>
            <a href="https://github.com/BHASHER2229" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Github size={20} />
              Visit GitHub Profile
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .projects {
          min-height: 100vh;
        }

        .projects-hero {
          text-align: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        .projects-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 70%, rgba(0, 255, 209, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(10, 132, 255, 0.05) 0%, transparent 50%);
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

        .projects-filter {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 24px;
        }

        .filter-header svg {
          color: var(--brand-primary);
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 8px 16px;
          color: var(--text-secondary);
          font-size: 14px;
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

        .projects-grid-section {
          background: var(--bg-primary);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
        }

        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
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
          margin-bottom: 24px;
        }

        .project-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .project-meta svg {
          color: var(--brand-primary);
        }

        .project-links {
          display: flex;
          gap: 8px;
        }

        .project-link {
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

        .project-link:hover {
          background: var(--brand-primary);
          color: #000000;
          transform: scale(1.1);
        }

        .project-content {
          margin-bottom: 24px;
        }

        .project-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .project-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .project-features {
          margin-bottom: 24px;
        }

        .project-features h4 {
          color: var(--text-primary);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .project-features ul {
          list-style: none;
          padding: 0;
        }

        .project-features li {
          color: var(--text-secondary);
          padding: 4px 0;
          position: relative;
          padding-left: 20px;
        }

        .project-features li::before {
          content: '▶';
          position: absolute;
          left: 0;
          color: var(--brand-primary);
          font-size: 10px;
        }

        .project-footer {
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tech-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 255, 209, 0.1);
          color: var(--brand-primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
          border-radius: 16px;
        }

        .overlay-content {
          text-align: center;
          color: var(--text-primary);
        }

        .overlay-content p {
          margin-bottom: 20px;
          font-size: 18px;
        }

        .overlay-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .overlay-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--brand-primary);
          color: #000000;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .overlay-btn:hover {
          background: var(--brand-active);
          transform: translateY(-2px);
        }

        .no-projects {
          text-align: center;
          color: var(--text-muted);
          padding: 60px 0;
        }

        .no-projects svg {
          margin-bottom: 16px;
        }

        .no-projects h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .github-cta {
          background: var(--bg-secondary);
          text-align: center;
        }

        .cta-content h2 {
          color: var(--text-primary);
          font-size: 32px;
          margin-bottom: 16px;
        }

        .cta-content p {
          color: var(--text-secondary);
          font-size: 18px;
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }

          .project-card {
            padding: 24px;
          }

          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .filter-buttons {
            justify-content: center;
          }

          .overlay-actions {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Projects;