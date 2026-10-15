import { useEffect, useState } from 'react';
import { checkBackendHealth, API_BASE_URL } from './services/api';
import { OUTCOMES, STRENGTHS, type HealthResponse } from './types/contracts';

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth()
      .then((data) => {
        if (isMounted) {
          setHealth(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="brand-badge">Part 1 Architecture Baseline</div>
        <h1 className="title">TRACE Investigation Platform</h1>
        <p className="subtitle">
          Synthetic multi-institution evidence reconstruction for disputed payment flows.
          All findings are strictly owned by a deterministic rules engine.
        </p>
      </header>

      <main>
        {/* Backend Connectivity Status Card */}
        <section className="card" aria-label="System Health">
          <div className="card-title">
            <span>Backend Service Connectivity</span>
            <div className="status-indicator">
              <span className={`dot ${health ? 'dot-green' : 'dot-amber'}`} />
              <span>
                {loading
                  ? 'Probing Backend...'
                  : health
                  ? `Connected (${health.service} v${health.version})`
                  : 'Backend Offline'}
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            API Target: <code style={{ color: 'var(--accent-cyan)' }}>{API_BASE_URL}</code>
          </p>
          {error && (
            <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
              Connection Note: {error} (Ensure backend is running via <code>python -m uvicorn app.main:app --port 8000</code>)
            </p>
          )}
        </section>

        {/* Frozen Domain Outcomes */}
        <section className="card" aria-label="Permitted Outcomes">
          <div className="card-title">
            <span>Frozen Outcome Enums (5 Exact Classifications)</span>
          </div>
          <div className="badge-grid">
            {OUTCOMES.map((outcome) => (
              <span key={outcome} className="badge badge-outcome">
                {outcome}
              </span>
            ))}
          </div>
        </section>

        {/* Frozen Qualitative Strengths */}
        <section className="card" aria-label="Permitted Strengths">
          <div className="card-title">
            <span>Permitted Finding Strengths (Qualitative Only)</span>
          </div>
          <div className="badge-grid">
            {STRENGTHS.map((strength) => (
              <span key={strength} className="badge badge-strength">
                {strength}
              </span>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            * Numerical confidence percentages are strictly prohibited to prevent probabilistic misinterpretation.
          </p>
        </section>

        {/* Non-Negotiable Rules Summary */}
        <section className="card" aria-label="Core Engineering Rules">
          <div className="card-title">
            <span>Architectural Axioms & Data Rules</span>
          </div>
          <ul className="rules-list">
            <li>
              <span className="check">✓</span>
              <span><strong>Integer Minor Units:</strong> All monetary values stored and calculated in kobo (₦85,000 = 8,500,000 kobo).</span>
            </li>
            <li>
              <span className="check">✓</span>
              <span><strong>ISO 8601 & Skew Tolerance:</strong> Timestamps require explicit timezone offsets with ±5s allowable clock drift.</span>
            </li>
            <li>
              <span className="check">✓</span>
              <span><strong>Strong Correlation:</strong> Never merge events on amount and time alone; Session ID / RRN required.</span>
            </li>
            <li>
              <span className="check">✓</span>
              <span><strong>Read-Only Safety:</strong> TRACE never initiates transfers, reversals, refunds, or financial movements.</span>
            </li>
            <li>
              <span className="check">✓</span>
              <span><strong>AI Explains Only:</strong> AI cannot alter findings, classifications, strengths, or rule versions.</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        TRACE Architecture &amp; Data Contract Baseline &bull; FinTech Hackathon 2026
      </footer>
    </div>
  );
}

export default App;
