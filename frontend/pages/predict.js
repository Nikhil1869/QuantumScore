import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Predict() {
  const [sport, setSport] = useState('football');
  const [tab, setTab] = useState('upcoming');
  const [matches, setMatches] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, [sport, tab]);

  const fetchMatches = async () => {
    setLoadingList(true);
    setError(null);
    try {
      // Map 'upcoming' to 'future' for the API
      const endpoint = tab === 'upcoming' ? 'future-matches' : `${tab}-matches`;
      const res = await fetch(`http://localhost:5000/api/${endpoint}?sport=${sport}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError('Failed to fetch matches. Make sure backend is running.');
      setMatches([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handlePredict = async (match) => {
    setSelectedMatch(match);
    setLoadingPredict(true);
    setPrediction(null);
    try {
      const res = await fetch(`http://localhost:5000/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setPrediction({ error: 'Failed to generate prediction.' });
    } finally {
      setLoadingPredict(false);
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.7) return 'var(--accent-green)';
    if (conf >= 0.55) return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <Head>
        <title>Dashboard | AI Sports Predictor</title>
      </Head>

      <header style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <Link href="/">
          <h2 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }}><span className="gradient-text">AI Predictor</span></h2>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn btn-pill ${sport === 'football' ? 'active' : ''}`} onClick={() => setSport('football')}>⚽ Football</button>
          <button className={`btn btn-pill ${sport === 'cricket' ? 'active' : ''}`} onClick={() => setSport('cricket')}>🏏 Cricket</button>
          <button className={`btn btn-pill ${sport === 'basketball' ? 'active' : ''}`} onClick={() => setSport('basketball')}>🏀 Basketball</button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Panel */}
        <div className="panel glass-panel">
          <div className="panel-header">
            <h3 style={{ margin: 0 }}>Matches</h3>
            <button className="btn btn-pill" onClick={fetchMatches} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>↻ Refresh</button>
          </div>
          
          <div className="tab-bar">
            <button className={`tab ${tab === 'live' ? 'active' : ''}`} onClick={() => setTab('live')}>🔴 Live</button>
            <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>📅 Upcoming</button>
            <button className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>✅ Past</button>
          </div>

          {error && <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

          <div className="match-list">
            {loadingList ? (
              <div className="empty-state"><div className="spinner"></div></div>
            ) : matches.length === 0 ? (
              <div className="empty-state">No matches found.</div>
            ) : (
              matches.map((match, idx) => (
                <div 
                  key={idx} 
                  className={`match-card ${selectedMatch?.match_id === match.match_id ? 'selected' : ''}`}
                  onClick={() => handlePredict(match)}
                >
                  <div className="match-header">
                    <span className={`status-badge status-${tab === 'upcoming' ? 'future' : tab}`}>{tab}</span>
                    <span>{match.venue}</span>
                  </div>
                  <div className="match-teams">
                    <span>{match.homeTeam}</span>
                    <span className="match-vs">vs</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="panel glass-panel" style={{ overflowY: 'auto' }}>
          {!selectedMatch ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', opacity: 0.5 }}>🤖</div>
              <h3>Select a match to predict</h3>
              <p>Our XGBoost model will analyze the data in real-time.</p>
            </div>
          ) : loadingPredict ? (
            <div className="empty-state">
              <div className="spinner" style={{ width: '60px', height: '60px' }}></div>
              <h3 className="gradient-text" style={{ marginTop: '2rem' }}>Running ML Inference...</h3>
            </div>
          ) : prediction?.error ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', opacity: 0.5 }}>⚠️</div>
              <h3 style={{ color: 'var(--accent-red)' }}>Error</h3>
              <p>{prediction.error}</p>
            </div>
          ) : prediction ? (
            <div className="animate-fade-in">
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</h2>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{selectedMatch.venue} • {selectedMatch.sport}</div>
                </div>
              </div>

              <div className="result-header">
                <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Predicted Winner</div>
                <div className="result-winner gradient-text">{prediction.winner}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                
                {/* Confidence */}
                <div className="gauge-container">
                  <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>MODEL CONFIDENCE</div>
                  <div className="gauge-circle" style={{
                    '--gauge-percent': `${prediction.confidence * 100}%`,
                    '--gauge-color': getConfidenceColor(prediction.confidence)
                  }}>
                    <div className="gauge-text" style={{ color: getConfidenceColor(prediction.confidence) }}>
                      {(prediction.confidence * 100).toFixed(1)}<span style={{ fontSize: '1.5rem' }}>%</span>
                    </div>
                  </div>
                </div>

                {/* H2H Visual Comparison */}
                <div>
                  <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>HEAD TO HEAD MATCHUP</div>
                  <div className="h2h-grid">
                    <div className="h2h-row">
                      <div className="h2h-value left">{selectedMatch.teamA_strength.toFixed(2)}</div>
                      <div className="h2h-label">Strength</div>
                      <div className="h2h-value right">{selectedMatch.teamB_strength.toFixed(2)}</div>
                    </div>
                    <div className="h2h-bar-container">
                      <div className="h2h-bar-left" style={{ width: `${(selectedMatch.teamA_strength / (selectedMatch.teamA_strength + selectedMatch.teamB_strength)) * 100}%` }}></div>
                      <div className="h2h-bar-right" style={{ width: `${(selectedMatch.teamB_strength / (selectedMatch.teamA_strength + selectedMatch.teamB_strength)) * 100}%` }}></div>
                    </div>

                    <div className="h2h-row" style={{ marginTop: '0.5rem' }}>
                      <div className="h2h-value left">{selectedMatch.teamA_form.toFixed(2)}</div>
                      <div className="h2h-label">Form</div>
                      <div className="h2h-value right">{selectedMatch.teamB_form.toFixed(2)}</div>
                    </div>
                    <div className="h2h-bar-container">
                      <div className="h2h-bar-left" style={{ width: `${(selectedMatch.teamA_form / (selectedMatch.teamA_form + selectedMatch.teamB_form)) * 100}%` }}></div>
                      <div className="h2h-bar-right" style={{ width: `${(selectedMatch.teamB_form / (selectedMatch.teamA_form + selectedMatch.teamB_form)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Explainability */}
              {prediction.feature_importance && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Prediction Explainability</h3>
                  <div className="feature-bars">
                    {Object.entries(prediction.feature_importance).slice(0, 5).map(([feat, score], idx) => (
                      <div key={idx} className="feature-bar-row">
                        <div className="feature-labels">
                          <span style={{ textTransform: 'capitalize' }}>{feat.replace(/_/g, ' ')}</span>
                          <span>{(score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${score * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
