import React from 'react';

export default function StatsPanel({ insights, processingTime }) {
  if (!insights) return null;

  return (
    <div style={styles.container}>
      {/* Cards row */}
      <div className="stats-container">
        <div className="stat-card glass-panel animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="stat-val">{processingTime} ms</span>
          <span className="stat-lbl">Latency</span>
        </div>
        
        <div className="stat-card glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="stat-val">{insights.total_candidates_pool}</span>
          <span className="stat-lbl">Pool Size</span>
        </div>

        <div className="stat-card glass-panel animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <span className="stat-val">{insights.avg_match_score}%</span>
          <span className="stat-lbl">Avg Match</span>
        </div>

        <div className="stat-card glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="stat-val">{insights.max_match_score}%</span>
          <span className="stat-lbl">Top Match</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="glass-panel" style={styles.detailsBox}>
        <h4 style={styles.detailsTitle}>Job Semantic Insights</h4>
        
        <div style={styles.insightsGrid}>
          <div>
            <h5 style={styles.subtitle}>Score Distribution</h5>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Standard Deviation:</span>
              <span style={styles.metricValue}>{insights.score_std_dev}%</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Minimum Match:</span>
              <span style={styles.metricValue}>{insights.min_match_score}%</span>
            </div>
          </div>

          <div>
            <h5 style={styles.subtitle}>Extracted Key Terms</h5>
            <div style={styles.tagsContainer}>
              {insights.detected_key_terms && insights.detected_key_terms.map((term, i) => (
                <span key={i} className="badge badge-cyan" style={styles.termTag}>
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '1rem',
  },
  detailsBox: {
    padding: '1rem 1.25rem',
    marginTop: '0.75rem',
  },
  detailsTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.75rem',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '0.4rem',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '1.5rem',
  },
  subtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginBottom: '0.6rem',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.82rem',
    marginBottom: '0.3rem',
  },
  metricLabel: {
    color: 'var(--text-secondary)',
  },
  metricValue: {
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
  },
  termTag: {
    fontSize: '0.68rem',
    padding: '0.15rem 0.45rem',
  }
};
