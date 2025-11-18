import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [url, setUrl] = useState('https://example.com');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (data.success && data.testId) {
        navigate(`/results/${data.testId}/overview`);
      } else {
        setError('Failed to submit test');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-content">
      <h2>Simple Test</h2>
      <p>Enter a URL to test:</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem', maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid var(--color-border-lighter)',
              borderRadius: 'var(--border-radius-sm)'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--border-radius-sm)',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'white',
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--border-radius-sm)',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1
          }}
        >
          {submitting ? 'Submitting...' : 'Run Test'}
        </button>
      </form>
    </div>
  );
}

export default Home;

