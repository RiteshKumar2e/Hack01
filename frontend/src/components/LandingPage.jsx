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
        <p>© 2026 TalentFlow. Made with HSL Yellow Aesthetics.</p>
      </footer>
    </div>
  );
}
