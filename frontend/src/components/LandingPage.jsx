import React from 'react';
import '../styles/LandingPage.css';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon">⚡</span> TalentFlow
        </div>
        <div className="landing-nav-links">
          <button 
            onClick={() => onNavigate('login', { role: 'recruiter' })} 
            className="btn btn-secondary landing-nav-btn"
          >
            Recruiter Login
          </button>
          <button 
            onClick={() => onNavigate('login', { role: 'candidate' })} 
            className="btn btn-primary landing-nav-btn"
          >
            Join as Candidate
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="animate-fade-in landing-hero-content">
          <span className="landing-hero-badge">Next-Gen Recruitment</span>
          <h1 className="landing-hero-title">
            Discover Top Talent with <br />
            <span className="landing-highlight-text">Intelligent Hybrid Search</span>
          </h1>
          <p className="landing-hero-subtitle">
            Go beyond simple keywords. Our multi-signal ML pipeline fuses Semantic SBERT embeddings, Okapi BM25, TF-IDF, and behavioral engagement signals to match the best candidates with precision.
          </p>
          <div className="landing-hero-actions">
            <button 
              onClick={() => onNavigate('register', { role: 'recruiter' })} 
              className="btn btn-primary landing-hero-btn-primary"
            >
              Hire Top Candidates
            </button>
            <button 
              onClick={() => onNavigate('register', { role: 'candidate' })} 
              className="btn btn-secondary landing-hero-btn-secondary"
            >
              Get Discovered by Recruiters
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="landing-features-section">
        <h2 className="landing-section-title">Engineered for Match Precision</h2>
        <p className="landing-section-subtitle">Four layers of analysis working together to identify matching profiles.</p>
        
        <div className="landing-features-grid">
          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon-box">🧠</div>
            <h3 className="landing-feature-title">Semantic Search (SBERT)</h3>
            <p className="landing-feature-text">
              Leverages Sentence-BERT to encode context. Matches the deep technical meaning of a job description with candidate summaries, even if they use different phrasing.
            </p>
          </div>

          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon-box">🔍</div>
            <h3 className="landing-feature-title">Lexical Keyword Search</h3>
            <p className="landing-feature-text">
              Okapi BM25 and TF-IDF search indices guarantee that strict technical terms, programming languages, and framework keywords are matched without false positives.
            </p>
          </div>

          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon-box">📈</div>
            <h3 className="landing-feature-title">Behavioral Scoring</h3>
            <p className="landing-feature-text">
              Analyzes candidate activity recency, profile completeness, GitHub contributions, and publications to elevate active, high-engaging talent.
            </p>
          </div>

          <div className="glass-panel landing-feature-card">
            <div className="landing-feature-icon-box">⚙️</div>
            <h3 className="landing-feature-title">Metadata & Exp Scoring</h3>
            <p className="landing-feature-text">
              Uses Gaussian decay functions to evaluate experience levels, checks education level alignment, and calculates location preference matches.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-grid">
          {/* Column 1: About */}
          <div className="landing-footer-col">
            <div className="landing-logo footer-logo">
              <span className="landing-logo-icon">⚡</span> TalentFlow
            </div>
            <p className="footer-about-text">
              An intelligent candidate discovery platform fusing semantic NLP SBERT embeddings, lexical relevance models (BM25 & TF-IDF), and behavioral diagnostic signals to rank talent.
            </p>
          </div>

          {/* Column 2: Portal Gateways */}
          <div className="landing-footer-col">
            <h4 className="footer-col-title">Portal Gateways</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => onNavigate('login', { role: 'candidate' })} className="footer-link-btn">
                  Candidate Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register', { role: 'candidate' })} className="footer-link-btn">
                  Candidate Register
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login', { role: 'recruiter' })} className="footer-link-btn">
                  Recruiter Board
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register', { role: 'recruiter' })} className="footer-link-btn">
                  Recruiter Join
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="landing-footer-col">
            <h4 className="footer-col-title">Developer & Contact</h4>
            <div className="footer-contact-details">
              <p className="contact-name">Ritesh Kumar</p>
              <p className="contact-role">Software Engineer</p>
              <div className="contact-links-stack">
                <a href="mailto:riteshkumar90359@gmail.com" className="footer-contact-item">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  riteshkumar90359@gmail.com
                </a>
                <a href="https://github.com/RiteshKumar2e" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                  GitHub (RiteshKumar2e)
                </a>
                <a href="https://www.linkedin.com/in/riteshkumar-tech/" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm10.943 8.212V9.197c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v-1.01h-2.4c.032.678 0 7.225 0 7.225h2.4v-4.03c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.4z"></path></svg>
                  LinkedIn Profile
                </a>
                <span className="footer-contact-location">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Jamshedpur, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="landing-footer-bottom">
          <p>© 2026 TalentFlow. Made with HSL Yellow Aesthetics.</p>
        </div>
      </footer>
    </div>
  );
}
