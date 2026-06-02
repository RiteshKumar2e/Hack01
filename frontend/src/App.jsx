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
import './styles/AtsBoard.css';

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

  // ATS Column Stage State - persisted in localStorage
  const [candidateStages, setCandidateStages] = useState(() => {
    const saved = localStorage.getItem('talentflow_stages');
    return saved ? JSON.parse(saved) : {};
  });

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

  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const data = await fetchCandidates(0, 100);
      if (data.candidates) {
        setInitialCandidates(data.candidates);
      }
    } catch (err) {
      console.error("Error syncing candidates:", err);
    } finally {
      setSyncing(false);
    }
  };

  // Fetch initial candidates when Recruiter views discover dashboard, and poll for updates
  useEffect(() => {
    if (view !== 'discover') return;
    
    async function loadInitial() {
      try {
        const data = await fetchCandidates(0, 100);
        if (data.candidates) {
          setInitialCandidates(data.candidates);
        }
      } catch (err) {
        console.error("Error fetching initial candidates:", err);
      }
    }
    
    loadInitial();
    const interval = setInterval(loadInitial, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [view]);

  // Persist candidate stages
  useEffect(() => {
    localStorage.setItem('talentflow_stages', JSON.stringify(candidateStages));
  }, [candidateStages]);

  const moveCandidate = (id, targetStage) => {
    setCandidateStages(prev => ({
      ...prev,
      [id]: targetStage
    }));
  };

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

  // Get unique list of candidates to display in the board
  const getBoardCandidates = () => {
    const map = new Map();
    
    // Add initial candidates first
    initialCandidates.forEach(cand => {
      map.set(cand.id, {
        candidate: cand,
        match_score: null,
        score_breakdown: null,
        match_reasons: []
      });
    });
    
    // Override/add with search result candidates (which have scores)
    rankedList.forEach(item => {
      map.set(item.candidate.id, {
        candidate: item.candidate,
        match_score: item.match_score,
        score_breakdown: item.score_breakdown,
        match_reasons: item.match_reasons
      });
    });
    
    return Array.from(map.values());
  };

  // Sort helper to rank matching candidates by match score
  const sortCandidates = (list) => {
    return [...list].sort((a, b) => {
      const scoreA = a.match_score !== null ? a.match_score : -1;
      const scoreB = b.match_score !== null ? b.match_score : -1;
      return scoreB - scoreA;
    });
  };

  const allCandidates = getBoardCandidates();

  const discovered = allCandidates.filter(item => {
    const stage = candidateStages[item.candidate.id] || 'discovered';
    return stage === 'discovered';
  });

  const shortlisted = allCandidates.filter(item => {
    const stage = candidateStages[item.candidate.id];
    return stage === 'shortlisted';
  });

  const interviewing = allCandidates.filter(item => {
    const stage = candidateStages[item.candidate.id];
    return stage === 'interviewing';
  });

  const hired = allCandidates.filter(item => {
    const stage = candidateStages[item.candidate.id];
    return stage === 'hired';
  });

  // Render a single ATS Card
  const renderATSCard = (item) => {
    const cand = item.candidate;
    const score = item.match_score !== null ? Math.round(item.match_score) : null;
    const stage = candidateStages[cand.id] || 'discovered';
    
    return (
      <div key={cand.id} className="ats-candidate-card animate-fade-in">
        <div className="ats-candidate-header">
          <h4 className="ats-candidate-name" onClick={() => handleSelectCandidate(cand.id)}>
            {cand.name}
          </h4>
          {score !== null && (
            <span className="ats-candidate-score">
              {score}% Match
            </span>
          )}
        </div>
        <p className="ats-candidate-title">{cand.title}</p>
        
        {cand.skills && cand.skills.length > 0 && (
          <div className="ats-candidate-skills">
            {cand.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="ats-skill-badge">{skill}</span>
            ))}
          </div>
        )}
        
        <div className="ats-candidate-actions">
          {stage === 'discovered' && (
            <button 
              onClick={() => moveCandidate(cand.id, 'shortlisted')} 
              className="ats-action-btn"
            >
              Shortlist →
            </button>
          )}
          
          {stage === 'shortlisted' && (
            <>
              <button 
                onClick={() => moveCandidate(cand.id, 'discovered')} 
                className="ats-action-btn reject"
              >
                ← Reject
              </button>
              <button 
                onClick={() => moveCandidate(cand.id, 'interviewing')} 
                className="ats-action-btn"
              >
                Interview →
              </button>
            </>
          )}
          
          {stage === 'interviewing' && (
            <>
              <button 
                onClick={() => moveCandidate(cand.id, 'shortlisted')} 
                className="ats-action-btn reject"
              >
                ← Back
              </button>
              <button 
                onClick={() => moveCandidate(cand.id, 'hired')} 
                className="ats-action-btn"
              >
                🎉 Hire →
              </button>
            </>
          )}
          
          {stage === 'hired' && (
            <>
              <span className="ats-hired-badge">
                ✓ Hired
              </span>
              <button 
                onClick={() => moveCandidate(cand.id, 'interviewing')} 
                className="ats-action-btn reject"
                style={{ fontSize: '0.65rem' }}
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyColumn = (message) => (
    <div className="ats-empty-placeholder">
      {message}
    </div>
  );

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={styles.listTitle}>ATS Hiring Pipeline</h3>
              <button 
                onClick={handleSync} 
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', height: 'fit-content' }}
                disabled={syncing}
              >
                {syncing ? '🔄 Syncing...' : '🔄 Sync'}
              </button>
            </div>
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
            ) : allCandidates.length > 0 ? (
              <div className="ats-board-wrapper">
                <div className="ats-board">
                  {/* Column 1: Discovered */}
                  <div className="ats-column">
                    <div className="ats-column-header">
                      <span>Discovered</span>
                      <span className="ats-column-count">{discovered.length}</span>
                    </div>
                    <div className="ats-cards-list">
                      {discovered.length > 0 
                        ? sortCandidates(discovered).map(renderATSCard) 
                        : renderEmptyColumn("No discovered matches")}
                    </div>
                  </div>

                  {/* Column 2: Shortlisted */}
                  <div className="ats-column">
                    <div className="ats-column-header">
                      <span>Shortlisted</span>
                      <span className="ats-column-count">{shortlisted.length}</span>
                    </div>
                    <div className="ats-cards-list">
                      {shortlisted.length > 0 
                        ? shortlisted.map(renderATSCard) 
                        : renderEmptyColumn("Drop candidates here")}
                    </div>
                  </div>

                  {/* Column 3: Interviewing */}
                  <div className="ats-column">
                    <div className="ats-column-header">
                      <span>Interviewing</span>
                      <span className="ats-column-count">{interviewing.length}</span>
                    </div>
                    <div className="ats-cards-list">
                      {interviewing.length > 0 
                        ? interviewing.map(renderATSCard) 
                        : renderEmptyColumn("Schedule interviews")}
                    </div>
                  </div>

                  {/* Column 4: Hired */}
                  <div className="ats-column">
                    <div className="ats-column-header">
                      <span>Hired</span>
                      <span className="ats-column-count">{hired.length}</span>
                    </div>
                    <div className="ats-cards-list">
                      {hired.length > 0 
                        ? hired.map(renderATSCard) 
                        : renderEmptyColumn("Ready to offer")}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ ...styles.emptyBox, display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: 0, lineHeight: 1.5 }}>
                  No candidates available in the pool yet. Candidates must register and build profiles to be discovered.
                </p>
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
  }
};
