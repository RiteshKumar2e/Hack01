import React from 'react';

export default function ScoreBreakdown({ breakdown }) {
  const signals = [
    { key: 'semantic_score', label: 'Semantic Fit', color: '#7c3aed' },
    { key: 'skill_overlap_score', label: 'Skills Match', color: '#0891b2' },
    { key: 'experience_score', label: 'Experience Alignment', color: '#2f7d53' },
    { key: 'bm25_score', label: 'Keyword Relevance (BM25)', color: '#2563eb' },
    { key: 'behavioral_score', label: 'Behavioral Signal', color: '#c0392b' },
    { key: 'education_score', label: 'Education Match', color: '#b87a08' },
    { key: 'location_score', label: 'Location Fit', color: '#0d9488' },
    { key: 'tfidf_score', label: 'Lexical Context (TF-IDF)', color: '#64748b' }
  ];

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Score Breakdown Analysis</h4>
      <div style={styles.grid}>
        {signals.map(sig => {
          const val = breakdown[sig.key] || 0;
          return (
            <div key={sig.key} style={styles.barRow}>
              <div style={styles.barInfo}>
                <span style={styles.barLabel}>{sig.label}</span>
                <span style={{ ...styles.barValue, color: sig.color }}>{val}%</span>
              </div>
              <div style={styles.track}>
                <div 
                  style={{ 
                    ...styles.fill, 
                    width: `${val}%`, 
                    backgroundColor: sig.color,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '0.75rem',
    padding: '0.85rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
  },
  title: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.75rem',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  barRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  barInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.78rem',
  },
  barLabel: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  barValue: {
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
  },
  track: {
    width: '100%',
    height: '5px',
    backgroundColor: 'var(--border-light)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.6s ease',
  }
};
