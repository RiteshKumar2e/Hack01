import React, { useState, useEffect } from 'react';
import { fetchSampleJobs } from '../services/api';

const DEFAULT_SAMPLE_JOBS = [];


export default function JobInput({ onSearch, loading }) {
  const [sampleJobs, setSampleJobs] = useState(DEFAULT_SAMPLE_JOBS);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [experienceMin, setExperienceMin] = useState('');
  const [experienceMax, setExperienceMax] = useState('');
  const [education, setEducation] = useState("Bachelor's");
  const [location, setLocation] = useState('');
  const [topK, setTopK] = useState(15);

  useEffect(() => {
    async function loadSamples() {
      try {
        const jobs = await fetchSampleJobs();
        if (jobs && jobs.length > 0) {
          setSampleJobs(jobs);
        }
      } catch (err) {
        console.error("Error loading sample jobs from API, using defaults:", err);
      }
    }
    loadSamples();
  }, []);

  const handleSampleChange = (e) => {
    const id = e.target.value;
    setSelectedJobId(id);
    if (!id) return;
    
    const selected = sampleJobs.find(j => j.id === id);
    if (selected) {
      setJobTitle(selected.title || '');
      setJobDescription(selected.description || '');
      setPreferredSkills(selected.preferred_skills ? selected.preferred_skills.join(', ') : '');
      setExperienceMin(selected.required_experience_min || '');
      setExperienceMax(selected.required_experience_max || '');
      setEducation(selected.required_education || "Bachelor's");
      setLocation(selected.location || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedJobId && !preferredSkills.trim() && !experienceMin && !experienceMax && !location.trim()) {
      alert("Please select a job template or enter at least one search criterion (skills, experience, or location).");
      return;
    }
    
    const skillsList = preferredSkills
      ? preferredSkills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    onSearch({
      job_description: jobDescription || " ",
      job_title: jobTitle,
      preferred_skills: skillsList,
      required_experience_min: experienceMin ? parseInt(experienceMin, 10) : null,
      required_experience_max: experienceMax ? parseInt(experienceMax, 10) : null,
      required_education: education,
      preferred_location: location,
      top_k: topK
    });
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <h3 style={styles.title}>Job Details</h3>
      <p style={styles.subtitle}>Enter job details or select a pre-configured template below.</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Template selector */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Template</label>
          <select 
            className="text-input" 
            value={selectedJobId} 
            onChange={handleSampleChange}
            style={styles.select}
          >
            <option value="">-- Choose a template --</option>
            {sampleJobs.map(job => {
              const label = job.title || '';
              const displayLabel = label.length > 35 ? label.substring(0, 32) + '...' : label;
              return (
                <option key={job.id} value={job.id}>
                  {displayLabel}
                </option>
              );
            })}
          </select>
        </div>

        {/* Preferred Skills */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Preferred Skills (Comma separated)</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. PyTorch, MLOps, Docker, Transformers"
            value={preferredSkills}
            onChange={(e) => setPreferredSkills(e.target.value)}
          />
        </div>

        {/* Flex layout for experience */}
        <div style={styles.gridFields}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Min Exp (Years)</label>
            <input
              type="number"
              className="text-input"
              placeholder="e.g. 5"
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Max Exp (Years)</label>
            <input
              type="number"
              className="text-input"
              placeholder="e.g. 10"
              value={experienceMax}
              onChange={(e) => setExperienceMax(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.gridFields}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Required Education</label>
            <select
              className="text-input"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              style={styles.select}
            >
              <option value="High School">High School</option>
              <option value="Associate">Associate</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Job Location</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. San Francisco, CA / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Top K */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Return Top Candidates</label>
          <input
            type="number"
            className="text-input"
            min="1"
            max="100"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value, 10))}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={styles.submitBtn} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '0.5rem', width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>
              Analyzing & Ranking...
            </>
          ) : (
            'Analyze & Discover'
          )}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    height: 'fit-content',
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: '0.2rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    minHeight: '2.2rem',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '0.2rem',
  },
  select: {
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238a8068' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.6rem center',
    backgroundSize: '0.9rem',
    paddingRight: '2rem',
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.4',
  },
  gridFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  submitBtn: {
    marginTop: '0.4rem',
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.9rem',
  }
};
