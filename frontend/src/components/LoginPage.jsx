import React, { useState } from 'react';
import '../styles/LoginPage.css';

export default function LoginPage({ initialRole = 'recruiter', onLogin, onNavigate }) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="text-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
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
