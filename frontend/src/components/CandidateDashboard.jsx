import React, { useState, useEffect } from 'react';
import { addCandidate, fetchCandidates } from '../services/api';
import '../styles/CandidateForm.css';
import '../styles/CandidateDashboard.css';

const CAREER_PATHS = [
  { value: '', label: 'Select Career Path' },
  { value: 'ml_engineer', label: 'Machine Learning Engineer' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'frontend_engineer', label: 'Frontend Engineer' },
  { value: 'backend_engineer', label: 'Backend Engineer' },
  { value: 'fullstack_engineer', label: 'Fullstack Engineer' },
  { value: 'devops_engineer', label: 'DevOps / SRE' },
  { value: 'data_engineer', label: 'Data Engineer' },
  { value: 'security_engineer', label: 'Security Engineer' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'ux_designer', label: 'UX / Product Designer' },
  { value: 'other', label: 'Other (Specify)' }
];

export default function CandidateDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [error, setError] = useState('');

  // Main Candidate Profile Object from DB
  const [fullProfile, setFullProfile] = useState(null);

  // Form States
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState('');
  const [careerPath, setCareerPath] = useState('');
  const [customCareerPath, setCustomCareerPath] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('');
  
  // Education States
  const [eduLevel, setEduLevel] = useState('');
  const [customEduLevel, setCustomEduLevel] = useState('');
  const [eduUniv, setEduUniv] = useState('');
  const [eduField, setEduField] = useState('');

  // Skills & Certs
  const [skills, setSkills] = useState('');
  const [certs, setCerts] = useState('');

  // Work Experience Entries (Dynamic)
  const [workHistory, setWorkHistory] = useState([]);
  const [expCompany, setExpCompany] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expSkills, setExpSkills] = useState('');

  // Fetch existing candidate details on load
  useEffect(() => {
    if (!user?.name) return;
    
    async function loadExistingProfile() {
      try {
        const data = await fetchCandidates(0, 100);
        if (data.candidates && data.candidates.length > 0) {
          // Find a candidate with a matching name (case-insensitive)
          const matched = data.candidates.find(
            cand => cand.name.trim().toLowerCase() === user.name.trim().toLowerCase()
          );
          
          if (matched) {
            setFullProfile(matched);
            setTitle(matched.title || '');
            
            // Check if career path matches predefined values or is custom
            const predefinedPaths = ['ml_engineer', 'data_scientist', 'frontend_engineer', 'backend_engineer', 'fullstack_engineer', 'devops_engineer', 'data_engineer', 'security_engineer', 'product_manager', 'ux_designer'];
            if (predefinedPaths.includes(matched.career_path)) {
              setCareerPath(matched.career_path);
            } else {
              setCareerPath('other');
              setCustomCareerPath(matched.career_path || '');
            }
            
            setLocation(matched.location || '');
            setSummary(matched.summary || '');
            setYearsOfExp(matched.years_of_experience?.toString() || '');
            
            // Education details
            if (matched.education) {
              const predefinedDegrees = ['High School', 'Associate', "Bachelor's", "Master's", 'MBA', 'PhD'];
              const level = matched.education.level;
              if (predefinedDegrees.includes(level)) {
                setEduLevel(level);
              } else {
                setEduLevel('other');
                setCustomEduLevel(level || '');
              }
              setEduUniv(matched.education.university || '');
              setEduField(matched.education.field || '');
            }
            
            // Skills & Certs
            setSkills(matched.skills ? matched.skills.join(', ') : '');
            setCerts(matched.certifications ? matched.certifications.join(', ') : '');
            
            // Work History
            setWorkHistory(matched.experience || []);
            setProfileLoaded(true);
            setActiveTab('profile'); // Default to profile preview if profile already exists
          } else {
            setActiveTab('edit'); // Default to edit form if no profile exists
          }
        } else {
          setActiveTab('edit'); // Default to edit form if list is empty
        }
      } catch (err) {
        console.error("Error loading existing profile:", err);
        setActiveTab('edit');
      }
    }
    
    loadExistingProfile();
  }, [user]);

  const handleAddExperience = () => {
    if (!expCompany || !expTitle || !expDuration) {
      alert('Please fill in Company, Job Title, and Duration.');
      return;
    }
    const entry = {
      company: expCompany,
      title: expTitle,
      duration_years: parseInt(expDuration, 10),
      skills_used: expSkills ? expSkills.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
    };
    setWorkHistory([...workHistory, entry]);
    setExpCompany('');
    setExpTitle('');
    setExpDuration('');
    setExpSkills('');
  };

  const handleRemoveExperience = (idx) => {
    setWorkHistory(workHistory.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !title || !location || !summary || !yearsOfExp || !eduLevel || !eduUniv || !eduField || !skills || !careerPath || (careerPath === 'other' && !customCareerPath) || (eduLevel === 'other' && !customEduLevel)) {
      setError('Please fill in all required fields (including Career Path and Degree Level).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const formattedData = {
      name,
      title,
      career_path: careerPath === 'other' ? customCareerPath : careerPath,
      location,
      summary,
      years_of_experience: parseInt(yearsOfExp, 10),
      education: {
        level: eduLevel === 'other' ? customEduLevel : eduLevel,
        university: eduUniv,
        field: eduField
      },
      skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      experience: workHistory,
      certifications: certs ? certs.split(',').map(c => c.trim()).filter(c => c.length > 0) : []
    };

    try {
      const result = await addCandidate(formattedData);
      setFullProfile(result);
      setProfileLoaded(true);
      setSuccessMsg('Profile saved and indexed successfully!');
      setActiveTab('profile'); // Switch to profile view upon successful submission
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit profile. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-dashboard-container">
      {/* Header bar */}
      <div className="dashboard-header-bar">
        <div className="dashboard-logo">⚡ TalentFlow Candidate Portal</div>
        <div className="dashboard-user-section">
          <div className="dashboard-user-badge">
            <span className="dashboard-user-name">{user?.name || user?.email}</span>
            <span className="dashboard-user-role">Candidate Portal</span>
          </div>
          <button onClick={onLogout} className="btn btn-secondary logout-btn">
            Log Out
          </button>
        </div>
      </div>

      <div className="dashboard-content-wrapper">
        {/* Welcome Banner */}
        <div className="dashboard-welcome-banner animate-fade-in">
          <h1 className="dashboard-welcome-title">Welcome back, {user?.name || 'Talent'}!</h1>
          <p className="dashboard-welcome-text">
            Manage your credentials and keep your discoverability profile up to date for active matches.
          </p>
        </div>

        {/* Tab System Switching */}
        <div className="dashboard-tabs-container">
          <button
            className={`dashboard-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Overview
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            ✍️ Edit / Update Profile
          </button>
        </div>

        {/* Success / Error Messages */}
        {successMsg && (
          <div className="profile-loaded-banner animate-fade-in" style={{ margin: '0.5rem 0' }}>
            🎉 {successMsg}
          </div>
        )}
        {error && (
          <div className="form-error-box animate-fade-in" style={{ margin: '0.5rem 0' }}>
            ⚠️ {error}
          </div>
        )}

        {/* --- TAB CONTENT 1: PROFILE OVERVIEW --- */}
        {activeTab === 'profile' && (
          <div className="glass-panel animate-fade-in profile-preview-card">
            {profileLoaded && fullProfile ? (
              <>
                {/* Profile Header */}
                <div className="profile-preview-header">
                  <div>
                    <h2 className="profile-meta-title">{fullProfile.name}</h2>
                    <div className="profile-meta-subtitle">
                      <span>{fullProfile.title}</span>
                      <span className="profile-meta-dot">·</span>
                      <span style={{ color: 'var(--text-muted)' }}>{fullProfile.location}</span>
                      <span className="profile-meta-dot">·</span>
                      <span className="badge badge-purple">
                        {fullProfile.years_of_experience} Years of Experience
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${fullProfile.behavioral_signals?.open_to_work ? 'badge-green' : 'badge-orange'}`}>
                      {fullProfile.behavioral_signals?.open_to_work ? 'Open to Work' : 'Passive'}
                    </span>
                  </div>
                </div>

                {/* Profile Content (Split Layout) */}
                <div className="profile-preview-content">
                  {/* Left Column */}
                  <div>
                    {/* Summary */}
                    <div className="profile-preview-section">
                      <h4 className="profile-preview-sec-title">Professional Summary</h4>
                      <p className="profile-summary-text">{fullProfile.summary}</p>
                    </div>

                    {/* Work Experience */}
                    <div className="profile-preview-section">
                      <h4 className="profile-preview-sec-title">Work Experience</h4>
                      {fullProfile.experience && fullProfile.experience.length > 0 ? (
                        <div className="profile-timeline">
                          {fullProfile.experience.map((exp, idx) => (
                            <div key={idx} className="profile-timeline-item">
                              <div className="profile-timeline-dot"></div>
                              <div className="profile-timeline-content">
                                <h5 className="profile-exp-title">{exp.title}</h5>
                                <p className="profile-exp-company">
                                  {exp.company} &middot; <span className="profile-exp-duration">{exp.duration_years} Years</span>
                                </p>
                                {exp.skills_used && exp.skills_used.length > 0 && (
                                  <div className="profile-exp-skills">
                                    {exp.skills_used.map((skill, i) => (
                                      <span key={i} className="profile-exp-skill-badge">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No work experience listed yet.
                        </p>
                      )}
                    </div>

                    {/* Education */}
                    <div className="profile-preview-section">
                      <h4 className="profile-preview-sec-title">Education</h4>
                      {fullProfile.education ? (
                        <div className="profile-edu-card">
                          <span className="profile-edu-icon">🎓</span>
                          <div>
                            <h5 className="profile-edu-degree">
                              {fullProfile.education.level} in {fullProfile.education.field}
                            </h5>
                            <p className="profile-edu-school">{fullProfile.education.university}</p>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No education credentials listed.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Sidebar) */}
                  <div className="profile-sidebar">
                    {/* Activity & Signals Panel */}
                    {fullProfile.behavioral_signals && (
                      <div className="profile-signal-card glass-panel">
                        <h4 className="profile-signal-title">Discovery Diagnostics</h4>
                        
                        <div className="profile-signal-row">
                          <span className="profile-signal-label">Profile Completeness</span>
                          <div className="profile-progress-container">
                            <div className="profile-progress-track">
                              <div 
                                className="profile-progress-bar"
                                style={{ width: `${fullProfile.behavioral_signals.profile_completeness * 100}%` }}
                              ></div>
                            </div>
                            <span className="profile-progress-percent">
                              {Math.round(fullProfile.behavioral_signals.profile_completeness * 100)}%
                            </span>
                          </div>
                        </div>

                        <div className="profile-signal-row">
                          <span className="profile-signal-label">GitHub Activity Score</span>
                          <span className="profile-signal-val" style={{ color: 'var(--color-success)' }}>
                            {fullProfile.behavioral_signals.github_contributions}
                          </span>
                        </div>

                        <div className="profile-signal-row">
                          <span className="profile-signal-label">Publications</span>
                          <span className="profile-signal-val">
                            {fullProfile.behavioral_signals.publications}
                          </span>
                        </div>

                        <div className="profile-signal-row">
                          <span className="profile-signal-label">Promotions</span>
                          <span className="profile-signal-val" style={{ color: '#7c3aed' }}>
                            {fullProfile.behavioral_signals.promotions}
                          </span>
                        </div>

                        <div className="profile-signal-row">
                          <span className="profile-signal-label">Avg Tenure</span>
                          <span className="profile-signal-val">
                            {fullProfile.behavioral_signals.avg_tenure_years} Years
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Skills Set */}
                    <div className="profile-preview-section">
                      <h4 className="profile-preview-sec-title">Core Skillset</h4>
                      <div className="profile-skills-pool">
                        {fullProfile.skills && fullProfile.skills.map((skill, idx) => (
                          <span key={idx} className="badge badge-purple">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="profile-preview-section">
                      <h4 className="profile-preview-sec-title">Certifications</h4>
                      {fullProfile.certifications && fullProfile.certifications.length > 0 ? (
                        <div className="profile-certs-container">
                          {fullProfile.certifications.map((cert, idx) => (
                            <div key={idx} className="profile-cert-item">
                              {cert}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No certifications listed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="profile-no-data-placeholder animate-fade-in">
                <span className="profile-no-data-icon">👤</span>
                <h3 className="profile-no-data-title">No Candidate Profile Found</h3>
                <p className="profile-no-data-text">
                  You haven't initialized your discovery profile yet. Recruiters will not be able to find or score your profile against active openings.
                </p>
                <button 
                  onClick={() => setActiveTab('edit')} 
                  className="btn btn-primary"
                  style={{ marginTop: '0.5rem' }}
                >
                  Create Your Profile Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 2: PROFILE FORM EDIT --- */}
        {activeTab === 'edit' && (
          <div className="glass-panel animate-fade-in form-edit-panel">
            <div className="form-card" style={{ maxWidth: '100%', boxShadow: 'none' }}>
              <h2 className="form-title">Build Your Discovery Profile</h2>
              <p className="form-subtitle">
                Fill out your professional credentials below. Your details will be processed through our NLP parser and indexed for recruiters.
              </p>

              <form onSubmit={handleSubmit} className="candidate-form">
                {/* --- SECTION 1: Personal Info --- */}
                <div className="form-section-header">
                  <span className="form-section-num">1</span> Basic Information
                </div>

                <div className="form-grid-2">
                  <div className="form-input-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Professional Title *</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. Junior Frontend Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-input-group">
                    <label className="form-label">Career Path / Track *</label>
                    <select
                      className="text-input form-select"
                      value={careerPath}
                      onChange={(e) => {
                        setCareerPath(e.target.value);
                        if (e.target.value !== 'other') {
                          setCustomCareerPath('');
                        }
                      }}
                      required
                    >
                      {CAREER_PATHS.map((path) => (
                        <option key={path.value} value={path.value}>
                          {path.label}
                        </option>
                      ))}
                    </select>
                    {careerPath === 'other' && (
                      <input
                        type="text"
                        className="text-input"
                        placeholder="Specify career path..."
                        value={customCareerPath}
                        onChange={(e) => setCustomCareerPath(e.target.value)}
                        style={{ marginTop: '0.5rem' }}
                        required
                      />
                    )}
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Years of Experience *</label>
                    <input
                      type="number"
                      className="text-input"
                      min="0"
                      max="40"
                      placeholder="e.g. 2"
                      value={yearsOfExp}
                      onChange={(e) => setYearsOfExp(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Current Location *</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. Bangalore, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-input-group">
                  <label className="form-label">Professional Summary * (Describe your expertise, minimum 20 characters)</label>
                  <textarea
                    className="text-input form-textarea"
                    rows="4"
                    placeholder="Write a brief professional overview explaining your tech stack, projects, and career interests..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                </div>

                {/* --- SECTION 2: Tech Skills & Certs --- */}
                <div className="form-section-header">
                  <span className="form-section-num">2</span> Skills & Certifications
                </div>

                <div className="form-grid-2">
                  <div className="form-input-group">
                    <label className="form-label">Technical Skills * (Comma separated)</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. React, JavaScript, HTML5, CSS3, Git, Node.js"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Certifications (Optional, Comma separated)</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. AWS Developer, Scrum Master"
                      value={certs}
                      onChange={(e) => setCerts(e.target.value)}
                    />
                  </div>
                </div>

                {/* --- SECTION 3: Education --- */}
                <div className="form-section-header">
                  <span className="form-section-num">3</span> Education Credentials
                </div>

                <div className="form-grid-3">
                  <div className="form-input-group">
                    <label className="form-label">Degree Level *</label>
                    <select
                      className="text-input form-select"
                      value={eduLevel}
                      onChange={(e) => {
                        setEduLevel(e.target.value);
                        if (e.target.value !== 'other') {
                          setCustomEduLevel('');
                        }
                      }}
                      required
                    >
                      <option value="">Select Degree Level</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="MBA">MBA</option>
                      <option value="PhD">PhD</option>
                      <option value="other">Other (Specify)</option>
                    </select>
                    {eduLevel === 'other' && (
                      <input
                        type="text"
                        className="text-input"
                        placeholder="Specify degree level..."
                        value={customEduLevel}
                        onChange={(e) => setCustomEduLevel(e.target.value)}
                        style={{ marginTop: '0.5rem' }}
                        required
                      />
                    )}
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">University / College Name *</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. Stanford University"
                      value={eduUniv}
                      onChange={(e) => setEduUniv(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Field of Study *</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. Computer Science"
                      value={eduField}
                      onChange={(e) => setEduField(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* --- SECTION 4: Work Experience History --- */}
                <div className="form-section-header">
                  <span className="form-section-num">4</span> Professional Experience (Optional)
                </div>

                {/* Existing experience entries list */}
                {workHistory.length > 0 && (
                  <div className="history-list">
                    {workHistory.map((item, idx) => (
                      <div key={idx} className="history-item">
                        <div>
                          <strong className="history-title">{item.title}</strong> at <span className="history-company">{item.company}</span>
                          <div className="history-sub">
                            Duration: {item.duration_years} year(s) | Skills: {item.skills_used.join(', ') || 'None'}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExperience(idx)}
                          className="history-remove-btn"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience input box */}
                <div className="add-exp-box">
                  <h4 className="add-exp-title">Add Work History Entry</h4>
                  
                  <div className="form-grid-3">
                    <div className="form-input-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="text-input"
                        placeholder="e.g. Google"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                      />
                    </div>
                    <div className="form-input-group">
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className="text-input"
                        placeholder="e.g. UI Intern"
                        value={expTitle}
                        onChange={(e) => setExpTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-input-group">
                      <label className="form-label">Duration (Years)</label>
                      <input
                        type="number"
                        className="text-input"
                        placeholder="e.g. 1"
                        value={expDuration}
                        onChange={(e) => setExpDuration(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-input-group" style={{ marginTop: '0.65rem' }}>
                    <label className="form-label">Skills Used (Comma separated)</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. React, TypeScript, Jest"
                      value={expSkills}
                      onChange={(e) => setExpSkills(e.target.value)}
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleAddExperience}
                    className="btn btn-secondary add-exp-btn"
                  >
                    + Add Experience Entry
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary form-submit-btn" 
                  disabled={loading}
                >
                  {loading ? 'Processing & Indexing Profile...' : 'Save & Publish Profile'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
