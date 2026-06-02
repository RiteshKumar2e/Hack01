import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JobInput from './components/JobInput';
import StatsPanel from './components/StatsPanel';
import CandidateCard from './components/CandidateCard';
import CandidateDetail from './components/CandidateDetail';
import { rankCandidates, fetchCandidateDetails, fetchCandidates } from './services/api';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CandidateForm from './components/CandidateForm';

const DEFAULT_CANDIDATES = [];

export default function App() {
  // Navigation & User Routing states
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [navParams, setNavParams] = useState({});

  // Recruiter Dashboard States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [rankedList, setRankedList] = useState([]);
  const [insights, setInsights] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);
  
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [initialCandidates, setInitialCandidates] = useState([]);

  // Check user session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('talentflow_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setView(parsed.role === 'recruiter' ? 'discover' : 'candidate-form');
      } catch (e) {
        localStorage.removeItem('talentflow_user');
      }
    }
  }, []);

  // Fetch initial candidates when Recruiter views discover dashboard
  useEffect(() => {
    if (view !== 'discover') return;
    
    async function loadInitial() {
      try {
        const data = await fetchCandidates(0, 10);
        if (data.candidates && data.candidates.length > 0) {
          setInitialCandidates(data.candidates);
        } else {
          setInitialCandidates([]);
        }
      } catch (err) {
        console.error("Error fetching initial candidates:", err);
        setInitialCandidates([]);
      }
    }
    loadInitial();
  }, [view]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setView(loggedInUser.role === 'recruiter' ? 'discover' : 'candidate-form');
  };

  const handleRegister = (registeredUser) => {
    setUser(registeredUser);
    setView(registeredUser.role === 'recruiter' ? 'discover' : 'candidate-form');
  };

  const handleLogout = () => {
    localStorage.removeItem('talentflow_user');
    setUser(null);
    setView('landing');
  };

  const handleNavigate = (targetView, params = {}) => {
    setView(targetView);
    setNavParams(params);
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const results = await rankCandidates(searchParams);
      setRankedList(results.ranked_candidates || []);
      setInsights(results.job_insights || null);
      setProcessingTime(results.processing_time_ms || 0);
    } catch (err) {
      setError(err.message || 'An error occurred while ranking candidates');
      setRankedList([]);
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = async (id) => {
    setSelectedCandidateId(id);
    setLoadingDetail(true);
    try {
      const details = await fetchCandidateDetails(id);
      setSelectedCandidate(details);
    } catch (err) {
      console.error("Error loading candidate details:", err);
      alert("Failed to load candidate details.");
      setSelectedCandidateId(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedCandidate(null);
    setSelectedCandidateId(null);
  };

  // --- CONDITIONAL VIEW RENDERING ---
  if (view === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (view === 'login') {
    return (
      <LoginPage 
        initialRole={navParams.role} 
        onLogin={handleLogin} 
        onNavigate={handleNavigate} 
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterPage 
        initialRole={navParams.role} 
        onRegister={handleRegister} 
        onNavigate={handleNavigate} 
      />
    );
  }

  if (view === 'candidate-form') {
    return <CandidateForm user={user} onLogout={handleLogout} />;
  }

  // default to 'discover' (Recruiter Dashboard)
  return (
    <div className="container">
      {/* App Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left column: Job Input */}
        <div>
          <JobInput onSearch={handleSearch} loading={loading} />
        </div>

        {/* Right column: Results/Insights & List */}
        <div style={styles.resultsContainer}>
          {error && (
            <div className="glass-panel" style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Stats Summary Panel */}
          {insights && (
            <StatsPanel insights={insights} processingTime={processingTime} />
          )}

          {/* Candidates List Header */}
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>
              {rankedList.length > 0 
                ? `Discovered Candidates (${rankedList.length})` 
                : 'Candidate Pool Overview'}
            </h3>
            {rankedList.length === 0 && initialCandidates.length > 0 && (
              <span style={styles.poolHint}>Displaying candidates from database</span>
            )}
          </div>

          {/* Candidates List Container */}
          <div style={styles.listContainer}>
            {loading ? (
              <div style={styles.loaderBox}>
                <div className="spinner" style={styles.largeSpinner}></div>
                <p style={styles.loaderText}>Processing job semantics and cross-matching profiles...</p>
              </div>
            ) : rankedList.length > 0 ? (
              rankedList.map((item) => (
                <CandidateCard 
                  key={item.candidate.id} 
                  item={item} 
                  onSelect={handleSelectCandidate} 
                />
              ))
            ) : initialCandidates.length > 0 ? (
              // Display simple profiles before first search runs
              initialCandidates.map((cand, idx) => (
                <div key={cand.id} className="glass-panel animate-fade-in" style={styles.simpleCard}>
                  <div style={styles.simpleHeader}>
                    <div>
                      <h4 style={styles.simpleName}>{cand.name}</h4>
                      <p style={styles.simpleTitle}>{cand.title}</p>
                    </div>
                    <span className="badge badge-purple">{cand.career_path.replace('_', ' ')}</span>
                  </div>
                  <p style={styles.simpleSummary}>{cand.summary}</p>
                  <div style={styles.simpleSkills}>
                    {cand.skills.slice(0, 6).map((skill, i) => (
                      <span key={i} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyBox}>
                <p>No candidates available in the pool yet. Candidates must register and build profiles to be discovered.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate detail Modal overlay */}
      {selectedCandidate && (
        <CandidateDetail candidate={selectedCandidate} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

const styles = {
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  errorBox: {
    padding: '0.85rem 1.2rem',
    backgroundColor: 'var(--color-danger-bg)',
    borderColor: '#f0b3b3',
    color: 'var(--color-danger)',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '0.5rem',
  },
  listTitle: {
    fontSize: '1.05rem',
    color: 'var(--text-primary)',
    fontFamily: 'Outfit, sans-serif',
  },
  poolHint: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '350px',
  },
  loaderBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: '0.75rem',
    padding: '3rem 0',
  },
  largeSpinner: {
    width: '32px',
    height: '32px',
    borderWidth: '3px',
  },
  loaderText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  emptyBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    padding: '3rem 0',
  },
  simpleCard: {
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
  },
  simpleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.4rem',
  },
  simpleName: {
    fontSize: '1rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  simpleTitle: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  simpleSummary: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.6rem',
    lineHeight: '1.5',
  },
  simpleSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
  }
};
// Font import is handled in index.css
