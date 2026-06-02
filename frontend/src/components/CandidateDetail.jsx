import React from 'react';

export default function CandidateDetail({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div 
        className="glass-panel animate-fade-in" 
        style={styles.modal} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.name}>{candidate.name}</h2>
            <p style={styles.title}>{candidate.title} · <span style={styles.location}>{candidate.location}</span></p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Left Column - Main Details */}
          <div style={styles.leftCol}>
            {/* About */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Professional Summary</h4>
              <p style={styles.summaryText}>{candidate.summary}</p>
            </div>

            {/* Experience */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Work Experience</h4>
              <div style={styles.timeline}>
                {candidate.experience.map((exp, idx) => (
                  <div key={idx} style={styles.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineContent}>
                      <h5 style={styles.expTitle}>{exp.title}</h5>
                      <p style={styles.expCompany}>{exp.company} · <span style={styles.expDuration}>{exp.duration_years} Years</span></p>
                      <div style={styles.expSkills}>
                        {exp.skills_used.map((skill, i) => (
                          <span key={i} style={styles.expSkillBadge}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Education</h4>
              <div style={styles.eduCard}>
                <div style={styles.eduIcon}>🎓</div>
                <div>
                  <h5 style={styles.eduDegree}>{candidate.education.level} in {candidate.education.field}</h5>
                  <p style={styles.eduSchool}>{candidate.education.university}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar / Signals */}
          <div style={styles.rightCol}>
            {/* Behavioral signals */}
            <div style={styles.signalCard} className="glass-panel">
              <h4 style={styles.signalTitle}>Activity & Engagement</h4>
              
              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>Profile Status</span>
                <span className={`badge ${candidate.behavioral_signals.open_to_work ? 'badge-green' : 'badge-orange'}`}>
                  {candidate.behavioral_signals.open_to_work ? 'Open to Work' : 'Passive'}
                </span>
              </div>

              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>Last Active</span>
                <span style={styles.signalVal}>
                  {candidate.behavioral_signals.days_since_active === 0 
                    ? 'Active Today' 
                    : `${candidate.behavioral_signals.days_since_active} days ago`}
                </span>
              </div>

              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>Profile Completeness</span>
                <div style={styles.progressContainer}>
                  <div style={styles.progressTrack}>
                    <div 
                      style={{ 
                        ...styles.progressBar, 
                        width: `${candidate.behavioral_signals.profile_completeness * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span style={styles.progressPercent}>
                    {Math.round(candidate.behavioral_signals.profile_completeness * 100)}%
                  </span>
                </div>
              </div>

              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>GitHub Contributions</span>
                <span style={{ ...styles.signalVal, color: 'var(--color-success)', fontWeight: 'bold' }}>
                  {candidate.behavioral_signals.github_contributions}
                </span>
              </div>

              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>Publications</span>
                <span style={styles.signalVal}>
                  {candidate.behavioral_signals.publications}
                </span>
              </div>

              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>Promotions Count</span>
                <span style={{ ...styles.signalVal, color: '#7c3aed', fontWeight: 'bold' }}>
                  {candidate.behavioral_signals.promotions}
                </span>
              </div>

              <div style={styles.signalRow}>
                <span style={styles.signalLabel}>Avg Company Tenure</span>
                <span style={styles.signalVal}>
                  {candidate.behavioral_signals.avg_tenure_years} Years
                </span>
              </div>
            </div>

            {/* Certifications */}
            <div style={styles.certCard}>
              <h4 style={styles.sectionTitle}>Certifications</h4>
              <div style={styles.certsContainer}>
                {candidate.certifications.length > 0 ? (
                  candidate.certifications.map((cert, idx) => (
                    <div key={idx} style={styles.certItem}>
                      {cert}
                    </div>
                  ))
                ) : (
                  <p style={styles.noCerts}>No certifications listed</p>
                )}
              </div>
            </div>

            {/* Skills Pool */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Full Skillset</h4>
              <div style={styles.skillsPool}>
                {candidate.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-purple" style={styles.poolBadge}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(30, 25, 10, 0.55)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  modal: {
    width: '100%',
    maxWidth: '960px',
    maxHeight: '88vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '1.75rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    border: '1px solid var(--border-light)',
    boxShadow: '0 20px 60px rgba(100, 80, 20, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '1rem',
    marginBottom: '1.25rem',
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'Outfit, sans-serif',
  },
  title: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '0.15rem',
  },
  location: {
    color: 'var(--text-muted)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.75rem',
    lineHeight: '1',
    cursor: 'pointer',
    padding: '0 0.4rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '1.5rem',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  sectionTitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '0.3rem',
  },
  summaryText: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    lineHeight: '1.6',
  },
  timeline: {
    position: 'relative',
    paddingLeft: '1.25rem',
    borderLeft: '2px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '0.4rem',
  },
  timelineItem: {
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: 'calc(-1.25rem - 5px)',
    top: '5px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  expTitle: {
    fontSize: '0.92rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  expCompany: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  expDuration: {
    color: 'var(--accent-dark)',
    fontWeight: '500',
  },
  expSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    marginTop: '0.3rem',
  },
  expSkillBadge: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    padding: '0.1rem 0.4rem',
    borderRadius: '3px',
  },
  eduCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    background: 'var(--bg-secondary)',
    padding: '0.85rem',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
  },
  eduIcon: {
    fontSize: '1.5rem',
  },
  eduDegree: {
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  eduSchool: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  signalCard: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  signalTitle: {
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
    marginBottom: '0.15rem',
    fontWeight: '600',
  },
  signalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '0.35rem',
  },
  signalLabel: {
    color: 'var(--text-secondary)',
  },
  signalVal: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    width: '110px',
  },
  progressTrack: {
    flexGrow: 1,
    height: '5px',
    backgroundColor: 'var(--border-light)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'var(--accent-primary)',
    borderRadius: '3px',
  },
  progressPercent: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  certCard: {
    background: 'var(--bg-secondary)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
  },
  certsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginTop: '0.4rem',
  },
  certItem: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    background: '#fff',
    padding: '0.35rem 0.65rem',
    borderRadius: '4px',
    border: '1px solid var(--border-light)',
  },
  noCerts: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  skillsPool: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    marginTop: '0.4rem',
  },
  poolBadge: {
    fontSize: '0.65rem',
    padding: '0.15rem 0.45rem',
  }
};
