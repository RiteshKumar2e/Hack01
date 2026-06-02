import React, { useState, useEffect } from 'react';
import { addCandidate, fetchCandidates } from '../services/api';
import '../styles/CandidateForm.css';

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

export default function CandidateForm({ user, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [error, setError] = useState('');

  // Main Candidate States
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
          }
        }
      } catch (err) {
        console.error("Error loading existing profile:", err);
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
      setSuccessData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit profile. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="form-container">
        <div className="glass-panel animate-fade-in success-card">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Profile Indexed Successfully!</h2>
          <p className="success-subtitle">
            Your professional profile has been saved and compiled into our semantic search index.
          </p>

          <div className="success-info-box">
            <div className="success-info-row">
              <span className="success-info-label">Candidate ID:</span>
              <span className="success-info-val">{successData.id}</span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">Name:</span>
              <span className="success-info-val">{successData.name}</span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">Position:</span>
              <span className="success-info-val">{successData.title}</span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">Indexed Skills:</span>
              <span className="success-info-val">{successData.skills.join(', ')}</span>
            </div>
          </div>

          <p className="success-notice-text">
            Employers can now discover and score your profile dynamically against active job descriptions using our hybrid ML pipeline.
          </p>

          <div className="success-actions">
            <button onClick={() => setSuccessData(null)} className="btn btn-secondary">
              Update Profile Details
            </button>
            <button onClick={onLogout} className="btn btn-primary">
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      {/* Header bar */}
      <div className="header-bar">
        <div className="header-logo">⚡ TalentFlow Candidate Portal</div>
        <div className="user-section">
          <span className="user-email">{user?.email}</span>
          <button onClick={onLogout} className="btn btn-secondary logout-btn">
            Log Out
          </button>
        </div>
      </div>

      <div className="form-wrapper">
        <div className="glass-panel animate-fade-in form-card">
          <h2 className="form-title">Build Your Discovery Profile</h2>
          <p className="form-subtitle">
            Fill out your professional credentials below. Your details will be processed through our NLP parser and indexed for recruiters.
          </p>

          {profileLoaded && (
            <div className="profile-loaded-banner animate-fade-in">
              ✨ We loaded your existing profile from the database. You can review or edit it below.
            </div>
          )}

          {error && <div className="form-error-box">{error}</div>}

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
    </div>
  );
}
