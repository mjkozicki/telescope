import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="section-content">Loading...</div>;
  }

  return (
    <div className="section-content">
      <h2>Test Results</h2>
      <p>View all performance test results:</p>

      {results.length === 0 ? (
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--color-background-lighter)', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
          No test results available yet.
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {results.map((result) => (
            <Link
              key={result.testId}
              to={`/results/${result.testId}/overview`}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                marginBottom: '1rem',
                background: 'var(--color-white)',
                border: '1px solid var(--color-border-lighter)',
                borderRadius: 'var(--border-radius-md)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border-lighter)'}
            >
              {result.screenshotUrl && (
                <img
                  src={result.screenshotUrl}
                  alt="Screenshot"
                  style={{
                    width: '120px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--color-border-lighter)'
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '0.5rem',
                  fontFamily: 'monospace',
                  background: 'var(--color-background-lighter)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--border-radius-sm)',
                  display: 'inline-block'
                }}>
                  {result.url}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <div><strong>Browser:</strong> {result.browser}</div>
                  {result.timestamp && <div><strong>Date:</strong> {new Date(result.timestamp).toLocaleString()}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;

