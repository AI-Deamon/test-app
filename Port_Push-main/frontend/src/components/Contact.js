import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { personalInfo, contactInfo } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      description: 'Send me an email'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
      description: 'Give me a call'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: personalInfo.location,
      href: '#',
      description: 'Currently based in'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: personalInfo.github,
      description: 'View my projects'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: personalInfo.linkedin,
      description: 'Connect professionally'
    }
  ];

  return (
    <div className="contact">
      <section className="contact-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">Get In Touch</h1>
            <p className="body-large">
              {contactInfo.availability}
            </p>
          </div>
        </div>
      </section>

      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-title">Let's Connect</h2>
              <p className="contact-description">
                I'm always interested in discussing cybersecurity challenges, collaboration opportunities, or new projects. Feel free to reach out through any of these channels.
              </p>

              <div className="contact-methods">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.href}
                      className="contact-method"
                      target={method.href.startsWith('mailto:') || method.href.startsWith('tel:') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                    >
                      <div className="method-icon">
                        <IconComponent size={24} />
                      </div>
                      <div className="method-content">
                        <h3>{method.label}</h3>
                        <p>{method.value}</p>
                        <span>{method.description}</span>
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className="social-section">
                <h3>Follow Me</h3>
                <div className="social-links">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title={social.description}
                      >
                        <IconComponent size={24} />
                        <span>{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <div className="form-container">
                <h2 className="form-title">Send a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell me about your project, question, or how I can help..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="loading-spinner" />
                    ) : (
                      <Send size={20} />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal-style Contact Info */}
      <section className="terminal-contact section-small">
        <div className="container">
          <div className="terminal">
            <div className="terminal-header">
              <span className="terminal-title">contact_info.sh</span>
            </div>
            <div className="terminal-content">
              <div className="terminal-line">
                <span className="prompt">bhasker@security-lab:~$</span>
                <span className="command">cat contact_info.txt</span>
              </div>
              <div className="terminal-line">
                <span className="output">Name: {personalInfo.name}</span>
              </div>
              <div className="terminal-line">
                <span className="output">Email: {personalInfo.email}</span>
              </div>
              <div className="terminal-line">
                <span className="output">Location: {personalInfo.location}</span>
              </div>
              <div className="terminal-line">
                <span className="output">GitHub: {personalInfo.github}</span>
              </div>
              <div className="terminal-line">
                <span className="output">LinkedIn: {personalInfo.linkedin}</span>
              </div>
              <div className="terminal-line">
                <span className="output">Status: {contactInfo.availability}</span>
              </div>
              <div className="terminal-line">
                <span className="prompt">bhasker@security-lab:~$</span>
                <span className="cursor">_</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact {
          min-height: 100vh;
        }

        .contact-hero {
          text-align: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        .contact-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 50% 50%, rgba(0, 255, 209, 0.05) 0%, transparent 50%);
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

        .contact-content {
          background: var(--bg-secondary);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .contact-info {
          position: sticky;
          top: 120px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .contact-description {
          color: var(--text-secondary);
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .contact-method:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 209, 0.1);
          border-color: var(--brand-primary);
        }

        .method-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(0, 255, 209, 0.1);
          border-radius: 8px;
          color: var(--brand-primary);
        }

        .method-content h3 {
          color: var(--text-primary);
          font-size: 16px;
          margin-bottom: 4px;
        }

        .method-content p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 4px;
        }

        .method-content span {
          color: var(--text-muted);
          font-size: 12px;
        }

        .social-section {
          border-top: 1px solid var(--border-subtle);
          padding-top: 32px;
        }

        .social-section h3 {
          color: var(--text-primary);
          font-size: 20px;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 16px;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
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

        .form-container {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 40px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 32px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: var(--text-primary);
          font-weight: 500;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 16px;
          transition: all 0.3s ease;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(0, 255, 209, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-muted);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: var(--brand-primary);
          color: #000000;
          border: none;
          border-radius: 8px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--brand-active);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 209, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .terminal-contact {
          background: var(--bg-primary);
        }

        .terminal {
          background: var(--terminal-bg);
          border: 1px solid var(--terminal-border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          margin: 0 auto;
        }

        .terminal-header {
          background: #21262d;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .contact-info {
            position: static;
          }

          .form-container {
            padding: 24px;
          }

          .social-links {
            flex-direction: column;
          }

          .terminal-content {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;