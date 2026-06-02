import React, { useState } from 'react';
import '../styles/LoginPage.css';

export default function LoginPage({ initialRole = 'recruiter', onLogin, onNavigate }) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Perform simple mock login validation
    const user = {
      email,
      role,
      name: role === 'recruiter' ? 'Demo Recruiter' : 'Demo Candidate'
    };

    // Store in localStorage
    localStorage.setItem('talentflow_user', JSON.stringify(user));
    onLogin(user);
  };

  const handleRecruiterDemoLogin = () => {
    const user = {
      email: 'recruiter@demo.com',
      role: 'recruiter',
      name: 'Demo Recruiter'
    };
    localStorage.setItem('talentflow_user', JSON.stringify(user));
    onLogin(user);
  };

  const handleCandidateDemoLogin = () => {
    const user = {
      email: 'candidate@demo.com',
      role: 'candidate',
      name: 'Demo Candidate'
    };
    localStorage.setItem('talentflow_user', JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="login-container">
      {/* Top Left Back Button */}
      <button className="login-back-button" onClick={() => onNavigate('landing')}>
        ← Back to Home
      </button>

      {/* Floating Logo Link */}
      <div className="login-logo-link" onClick={() => onNavigate('landing')}>
        ⚡ TalentFlow
      </div>

      <div className="glass-panel animate-fade-in login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Enter details to log in to your account</p>

        {error && <div className="login-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Role selector tab */}
          <div className="login-role-tabs">
            <button
              type="button"
              onClick={() => { setRole('recruiter'); setError(''); }}
              className={`login-role-tab ${role === 'recruiter' ? 'active' : ''}`}
            >
              Recruiter / Employer
            </button>
            <button
              type="button"
              onClick={() => { setRole('candidate'); setError(''); }}
              className={`login-role-tab ${role === 'candidate' ? 'active' : ''}`}
            >
              Job Candidate
            </button>
          </div>

          {/* Email */}
          <div className="login-input-group">
            <label className="login-label">Email Address</label>
            <input
              type="email"
              className="text-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="login-input-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn">
            Log In as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
          </button>

          <div className="login-demo-section">
            <div className="login-demo-divider">
              <span className="login-demo-divider-line"></span>
              <span className="login-demo-divider-text">Or use demo accounts</span>
              <span className="login-demo-divider-line"></span>
            </div>

            <div className="login-demo-grid">
              <button
                type="button"
                onClick={handleRecruiterDemoLogin}
                className="btn btn-secondary login-demo-btn"
              >
                💼 Recruiter Login
              </button>
              <button
                type="button"
                onClick={handleCandidateDemoLogin}
                className="btn btn-secondary login-demo-btn"
              >
                👤 Candidate Login
              </button>
            </div>
          </div>
        </form>

        <div className="login-card-footer">
          <p className="login-footer-text">
            Don't have an account?{' '}
            <span className="login-link" onClick={() => onNavigate('register', { role })}>
              Register now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
