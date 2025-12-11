import React, { useState } from 'react';
import { Calendar, Clock, Tag, ArrowRight, BookOpen, Search } from 'lucide-react';
import { blogPosts } from '../data/mock';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Get unique tags
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];

  // Filter posts based on search and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="blog">
      <section className="blog-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">Blog & Insights</h1>
            <p className="body-large">
              Technical articles, security research, and insights from my cybersecurity journey. 
              Sharing knowledge and experiences from the world of ethical hacking and security.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="blog-filters section-small">
        <div className="container">
          <div className="filters-row">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="tag-filters">
              <button 
                className={`tag-btn ${selectedTag === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedTag('all')}
              >
                All Posts
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="blog-posts section">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map((post, index) => (
                <article 
                  key={post.id} 
                  className="post-card"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="post-header">
                    <div className="post-meta">
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    
                    <div className="post-tags">
                      {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="post-tag">
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="post-footer">
                    <button className="read-more-btn">
                      Read More
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <BookOpen size={48} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Article */}
      <section className="featured-article section-small">
        <div className="container">
          <div className="featured-content">
            <div className="featured-text">
              <h2>Latest Featured Article</h2>
              <h3>Building a Cybersecurity Home Lab: A Complete Guide</h3>
              <p>
                In this comprehensive guide, I walk through the process of setting up a complete cybersecurity home lab using VirtualBox, 
                Kali Linux, and various vulnerable machines. Perfect for anyone starting their ethical hacking journey.
              </p>
              <div className="featured-meta">
                <span className="meta-item">
                  <Calendar size={16} />
                  January 15, 2024
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  12 min read
                </span>
              </div>
              <button className="featured-btn">
                Read Full Article
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="featured-visual">
              <div className="terminal-preview">
                <div className="terminal">
                  <div className="terminal-header">
                    <span className="terminal-title">homelab-setup.sh</span>
                  </div>
                  <div className="terminal-content">
                    <div className="terminal-line">
                      <span className="prompt">root@kali:~#</span>
                      <span className="command">./setup-homelab.sh</span>
                    </div>
                    <div className="terminal-line">
                      <span className="output">🔧 Setting up VirtualBox...</span>
                    </div>
                    <div className="terminal-line">
                      <span className="output">📦 Downloading Kali Linux...</span>
                    </div>
                    <div className="terminal-line">
                      <span className="output">🛠️ Configuring network settings...</span>
                    </div>
                    <div className="terminal-line">
                      <span className="output">✅ Home lab setup complete!</span>
                    </div>
                    <div className="terminal-line">
                      <span className="prompt">root@kali:~#</span>
                      <span className="cursor">_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter section-small">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get notified when I publish new articles about cybersecurity, ethical hacking, and security research.</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="subscribe-btn">
                Subscribe
              </button>
            </form>
            <p className="newsletter-disclaimer">
              No spam, just quality cybersecurity content. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog {
          min-height: 100vh;
        }

        .blog-hero {
          text-align: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        .blog-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 60% 40%, rgba(0, 255, 209, 0.05) 0%, transparent 50%);
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

        .blog-filters {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 300px;
        }

        .search-box svg {
          color: var(--text-muted);
        }

        .search-box input {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 16px;
          width: 100%;
        }

        .search-box input:focus {
          outline: none;
        }

        .search-box input::placeholder {
          color: var(--text-muted);
        }

        .tag-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tag-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 8px 16px;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tag-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
        }

        .tag-btn.active {
          background: var(--brand-primary);
          color: #000000;
          border-color: var(--brand-primary);
        }

        .blog-posts {
          background: var(--bg-primary);
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
        }

        .post-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.4s ease;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .post-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 255, 209, 0.15);
          border-color: var(--brand-primary);
        }

        .post-header {
          margin-bottom: 24px;
        }

        .post-meta {
          display: flex;
          gap: 20px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meta-item svg {
          color: var(--brand-primary);
        }

        .post-content {
          margin-bottom: 24px;
        }

        .post-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .post-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .post-tag {
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

        .post-footer {
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }

        .read-more-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--brand-primary);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          color: var(--brand-active);
          transform: translateX(4px);
        }

        .no-posts {
          text-align: center;
          color: var(--text-muted);
          padding: 80px 0;
        }

        .no-posts svg {
          margin-bottom: 20px;
        }

        .no-posts h3 {
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .featured-article {
          background: var(--bg-secondary);
        }

        .featured-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .featured-text h2 {
          color: var(--brand-primary);
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .featured-text h3 {
          color: var(--text-primary);
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .featured-text p {
          color: var(--text-secondary);
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .featured-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
        }

        .featured-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--brand-primary);
          color: #000000;
          border: none;
          border-radius: 8px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .featured-btn:hover {
          background: var(--brand-active);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 209, 0.3);
        }

        .terminal-preview {
          position: relative;
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

        .newsletter {
          background: var(--bg-primary);
          text-align: center;
        }

        .newsletter-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .newsletter-content h2 {
          color: var(--text-primary);
          font-size: 32px;
          margin-bottom: 16px;
        }

        .newsletter-content > p {
          color: var(--text-secondary);
          font-size: 18px;
          margin-bottom: 32px;
        }

        .newsletter-form {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .newsletter-form input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 16px;
          color: var(--text-primary);
          font-size: 16px;
        }

        .newsletter-form input:focus {
          outline: none;
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(0, 255, 209, 0.1);
        }

        .newsletter-form input::placeholder {
          color: var(--text-muted);
        }

        .subscribe-btn {
          background: var(--brand-primary);
          color: #000000;
          border: none;
          border-radius: 8px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .subscribe-btn:hover {
          background: var(--brand-active);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 255, 209, 0.3);
        }

        .newsletter-disclaimer {
          color: var(--text-muted);
          font-size: 14px;
          margin: 0;
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
          .filters-row {
            flex-direction: column;
            gap: 20px;
          }

          .search-box {
            min-width: 100%;
          }

          .tag-filters {
            justify-content: center;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .post-card {
            padding: 24px;
          }

          .featured-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .subscribe-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;