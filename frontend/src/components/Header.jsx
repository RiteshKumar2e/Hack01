import React, { useEffect, useState } from 'react';
import { fetchHealth } from '../services/api';

export default function Header({ user, onLogout }) {
  const [status, setStatus] = useState('connecting');
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    let active = true;
    async function checkStatus() {
      try {
        const data = await fetchHealth();
        if (active) {
          setStatus(data.pipeline_ready ? 'ready' : 'initializing');
          setTotalCandidates(data.total_candidates || 0);
        }
      } catch (err) {
        if (active) {
          setStatus('offline');
        }
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header style={styles.header} className="glass-panel">
      <div style={styles.logoContainer}>
        <span style={styles.logoText}>Talent Discovery</span>
        <span style={styles.tagline}>AI Candidate Matching & Ranking</span>
      </div>
      
      <div style={styles.statusContainer}>
        {status === 'ready' && (
          <div style={styles.statusBadge} className="badge badge-green">
            <span style={{ ...styles.dot, backgroundColor: 'var(--color-success)' }}></span>
            Pipeline Active ({totalCandidates} Profiles)
          </div>
        )}
        {status === 'initializing' && (
          <div style={styles.statusBadge} className="badge badge-orange">
            <div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }}></div>
            Building ML Indices...
          </div>
        )}
        {status === 'connecting' && (
          <div style={styles.statusBadge} className="badge badge-orange">
            <span style={{ ...styles.dot, backgroundColor: 'var(--color-warning)' }}></span>
            Connecting...
          </div>
        )}
        {status === 'offline' && (
          <div style={styles.statusBadge} className="badge badge-red">
            <span style={{ ...styles.dot, backgroundColor: 'var(--color-danger)' }}></span>
            Backend Offline
          </div>
        )}

        {user && (
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {user.email}
            </span>
            <button 
              onClick={onLogout} 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--accent-dark)',
    letterSpacing: '-0.01em',
  },
  tagline: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
    marginTop: '0.1rem',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.85rem',
    fontSize: '0.75rem',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
  }
};
