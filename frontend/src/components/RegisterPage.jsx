import React, { useState } from 'react';
import '../styles/RegisterPage.css';

export default function RegisterPage({ initialRole = 'recruiter', onRegister, onNavigate }) {
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Perform simple mock registration
    const user = {
      name,
      email,
      role
    };

    // Store in localStorage
    localStorage.setItem('talentflow_user', JSON.stringify(user));
    onRegister(user);
  };

  return (
    <div className="register-container">
      {/* Top Left Back Button */}
      <button className="register-back-button" onClick={() => onNavigate('landing')}>
        ← Back to Home
      </button>

      {/* Floating Logo Link */}
      <div className="register-logo-link" onClick={() => onNavigate('landing')}>
        ⚡ TalentFlow
      </div>

      <div className="glass-panel animate-fade-in register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Sign up to join our recruitment ecosystem</p>

        {error && <div className="register-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Role selector tab */}
          <div className="register-role-tabs">
            <button
              type="button"
              onClick={() => { setRole('recruiter'); setError(''); }}
              className={`register-role-tab ${role === 'recruiter' ? 'active' : ''}`}
            >
              Recruiter / Employer
            </button>
            <button
              type="button"
              onClick={() => { setRole('candidate'); setError(''); }}
              className={`register-role-tab ${role === 'candidate' ? 'active' : ''}`}
            >
              Job Candidate
            </button>
          </div>

          {/* Full Name */}
          <div className="register-input-group">
            <label className="register-label">Full Name</label>
            <input
              type="text"
              className="text-input"
              placeholder={role === 'recruiter' ? 'e.g. HR Manager' : 'e.g. John Doe'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="register-input-group">
            <label className="register-label">Email Address</label>
            <input
              type="email"
              className="text-input"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="register-input-group">
            <label className="register-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="register-input-group">
            <label className="register-label">Confirm Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary register-submit-btn">
            Register as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
          </button>
        </form>

        <div className="register-card-footer">
          <p className="register-footer-text">
            Already have an account?{' '}
            <span className="register-link" onClick={() => onNavigate('login', { role })}>
              Log in instead
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
