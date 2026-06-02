import React, { useState } from 'react';
import ScoreBreakdown from './ScoreBreakdown';

export default function CandidateCard({ item, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const { candidate, match_score, rank, score_breakdown, match_reasons } = item;

  const getScoreColor = (score) => {
    if (score >= 80) return '#2f7d53';
    if (score >= 60) return '#b87a08';
    return '#c0392b';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return '#e6f5ed';
    if (score >= 60) return '#fef3cd';
    return '#fce4e4';
  };

  const scoreColor = getScoreColor(match_score);
  const scoreBg = getScoreBg(match_score);

  return (
    <div 
      className="glass-panel animate-fade-in" 
      style={{
        ...styles.card,
        borderLeft: `3px solid ${scoreColor}`
      }}
    >
      <div style={styles.header}>
        {/* Top Info */}
        <div style={styles.topMeta}>
          <div style={styles.rankBadge}>#{rank}</div>
          <div style={styles.titleInfo}>
            <h4 style={styles.name}>{candidate.name}</h4>
            <div style={styles.subInfo}>
              <span style={styles.currentTitle}>{candidate.title}</span>
              <span style={styles.dotDivider}>·</span>
              <span style={styles.location}>{candidate.location}</span>
            </div>
          </div>
        </div>

        {/* Score dial */}
        <div 
          style={{
            ...styles.scoreDial,
            backgroundColor: scoreBg,
            borderColor: scoreColor + '40',
          }}
        >
          <span style={{ ...styles.scoreVal, color: scoreColor }}>{match_score}</span>
          <span style={styles.scoreLbl}>Match</span>
        </div>
      </div>

      {/* Body Summary */}
      <p style={styles.summary}>{candidate.summary}</p>

      {/* Skill tags */}
      <div style={styles.skillsContainer}>
        {candidate.skills.slice(0, 10).map((skill, i) => (
          <span key={i} className="badge badge-purple" style={styles.skillBadge}>
            {skill}
          </span>
        ))}
        {candidate.skills.length > 10 && (
          <span style={styles.moreSkills}>+{candidate.skills.length - 10} more</span>
        )}
      </div>

      {/* Highlights / Badges */}
      <div style={styles.badgeRow}>
        <span className="badge badge-cyan" style={styles.infoBadge}>
          {candidate.years_of_experience} Yrs Exp
        </span>
        <span className="badge badge-orange" style={styles.infoBadge}>
          {candidate.education.level}
        </span>
        {candidate.behavioral_signals.open_to_work && (
          <span className="badge badge-green" style={styles.infoBadge}>
            Open to Work
          </span>
        )}
        <span className="badge badge-purple" style={styles.infoBadge}>
          {candidate.behavioral_signals.days_since_active === 0 ? 'Active Today' : `Active ${candidate.behavioral_signals.days_since_active}d ago`}
        </span>
      </div>

      {/* Accordion content */}
      {expanded && (
        <div style={styles.expandedContent}>
          {/* Match reasons */}
          <div style={styles.section}>
            <h5 style={styles.sectionTitle}>Relevance Insights</h5>
            <ul style={styles.reasonsList}>
              {match_reasons.map((reason, idx) => (
                <li key={idx} style={styles.reasonItem}>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Graphical breakdown */}
          <ScoreBreakdown breakdown={score_breakdown} />
        </div>
      )}

      {/* Actions footer */}
      <div style={styles.footer}>
        <button 
          className="btn btn-secondary" 
          style={styles.toggleBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Analysis' : 'View Match Analysis'}
        </button>

        <button 
          className="btn btn-primary" 
          style={styles.detailsBtn}
          onClick={() => onSelect(candidate.id)}
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '1.25rem',
    marginBottom: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  topMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  rankBadge: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: '1.05rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  subInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  currentTitle: {
    fontWeight: '500',
  },
  dotDivider: {
    color: 'var(--text-muted)',
  },
  location: {
    color: 'var(--text-muted)',
  },
  scoreDial: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: '2px solid',
    flexShrink: 0,
  },
  scoreVal: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.15rem',
    fontWeight: '800',
    lineHeight: '1',
  },
  scoreLbl: {
    fontSize: '0.5rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  summary: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.5',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    marginBottom: '0.75rem',
  },
  skillBadge: {
    padding: '0.15rem 0.5rem',
    fontSize: '0.65rem',
  },
  moreSkills: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    alignSelf: 'center',
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginBottom: '0.75rem',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '0.6rem',
  },
  infoBadge: {
    fontSize: '0.68rem',
    padding: '0.2rem 0.5rem',
  },
  expandedContent: {
    borderTop: '1px solid var(--border-light)',
    paddingTop: '0.85rem',
    marginTop: '0.25rem',
    animation: 'fadeIn 0.3s ease',
  },
  section: {
    marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.4rem',
  },
  reasonsList: {
    listStyleType: 'none',
    paddingLeft: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  reasonItem: {
    fontSize: '0.82rem',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.2rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '0.75rem',
    marginTop: '0.25rem',
  },
  toggleBtn: {
    fontSize: '0.78rem',
    padding: '0.35rem 0.7rem',
  },
  detailsBtn: {
    fontSize: '0.78rem',
    padding: '0.35rem 0.8rem',
  }
};
