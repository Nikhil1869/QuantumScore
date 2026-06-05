import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/stats').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/model-info').then(res => res.json()).catch(() => null)
    ]).then(([statsData, modelData]) => {
      if (statsData && !statsData.error) setStats(statsData);
      if (modelData && !modelData.error) setModelInfo(modelData);
    });
  }, []);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Head>
        <title>AI Sports Predictor | Elite Predictions</title>
      </Head>

      <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}><span className="gradient-text">AI Predictor</span></h2>
        <nav>
          <Link href="/predict">
            <button className="btn btn-pill">Launch Dashboard</button>
          </Link>
        </nav>
      </header>

      <main style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
        <div className="animate-slide-up">
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
            Unfair Advantage with <br/>
            <span className="gradient-text">Predictive Intelligence</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Leverage state-of-the-art XGBoost machine learning to predict match outcomes with extreme precision across Football, Cricket, and Basketball.
          </p>
          
          <Link href="/predict">
            <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Start Predicting Now
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '5rem' }} className="animate-slide-up">
          <div className="glass-panel">
            <h3 className="gradient-text-green">Multi-Sport</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Advanced models trained specifically on the unique dynamics of Football, Cricket, and Basketball.</p>
          </div>
          <div className="glass-panel">
            <h3 className="gradient-text">XGBoost Engine</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Under the hood lies an ensemble learning algorithm analyzing team form, strength, and historical H2H data.</p>
          </div>
          <div className="glass-panel">
            <h3 className="gradient-text">Explainable AI</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Don't just get a prediction. See exactly which features influenced the model's confidence scores.</p>
          </div>
        </div>

        <div className="glass-panel animate-fade-in" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Model Accuracy</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : '---'}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Matches Analyzed</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {stats ? stats.total_matches.toLocaleString() : '---'}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Avg Confidence</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {stats ? `${(stats.avg_confidence * 100).toFixed(1)}%` : '---'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
