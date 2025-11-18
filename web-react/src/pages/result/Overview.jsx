import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatBytes, formatMs, formatCLS, getFCPClass, getLCPClass, getCLSClass } from '../../utils/format';

function Overview() {
  const { testId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/results/${testId}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [testId]);

  if (loading) return <div className="section-content"><p>Loading...</p></div>;
  if (!data) return <div className="section-content"><p>Test not found</p></div>;

  const { config, metrics, har } = data;
  const screenshotUrl = `/test-results/${testId}/screenshot.png`;
  
  // Extract data
  const url = config?.url || 'Unknown';
  const date = config?.date ? new Date(config.date).toLocaleString() : 'Unknown';
  const browser = har?.browser 
    ? `${har.browser.name} ${har.browser.version}` 
    : (config?.browserConfig?.channel || config?.browserConfig?.engine || 'Unknown');
  const pageTitle = har?.pageTitle || null;
  const creator = har?.creator ? `${har.creator.name} ${har.creator.version}` : null;

  // Metrics
  const fcp = metrics?.paintTiming?.find(p => p.name === 'first-contentful-paint')?.startTime || null;
  const lcp = metrics?.largestContentfulPaint?.[0]?.startTime || null;
  const cls = metrics?.layoutShifts?.reduce((sum, shift) => sum + (shift.value || 0), 0) || null;
  const ttfb = metrics?.navigationTiming?.responseStart 
    ? (metrics.navigationTiming.responseStart - metrics.navigationTiming.fetchStart) 
    : null;
  const transferSize = metrics?.navigationTiming?.transferSize || null;
  const responseTime = metrics?.navigationTiming?.duration || null;

  return (
    <div className="section-content">
      <div style={{ marginBottom: '2rem' }}>
        {/* Test Info */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Test Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><strong>URL:</strong> {url}</div>
            {pageTitle && <div><strong>Title:</strong> {pageTitle}</div>}
            <div><strong>Date:</strong> {date}</div>
            <div><strong>Browser:</strong> {browser}</div>
            {creator && <div><strong>Created by:</strong> {creator}</div>}
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Screenshot</h3>
          <img 
            src={screenshotUrl} 
            alt="Page Screenshot" 
            style={{ 
              maxWidth: '100%', 
              border: '1px solid var(--color-border-lighter)',
              borderRadius: 'var(--border-radius-md)'
            }} 
          />
        </div>

        {/* Core Web Vitals */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Core Web Vitals</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <MetricCard label="FCP" value={formatMs(fcp)} className={getFCPClass(fcp)} />
            <MetricCard label="LCP" value={formatMs(lcp)} className={getLCPClass(lcp)} />
            <MetricCard label="CLS" value={formatCLS(cls)} className={getCLSClass(cls)} />
          </div>
        </div>

        {/* Additional Metrics */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Additional Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <MetricCard label="TTFB" value={formatMs(ttfb)} className="accent" />
            <MetricCard label="Transfer Size" value={formatBytes(transferSize)} className="accent" />
            <MetricCard label="Response Time" value={formatMs(responseTime)} className="accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, className }) {
  const borderColors = {
    good: '#22c55e',
    'needs-improvement': '#eab308',
    poor: '#ef4444',
    accent: '#ff6b35',
    unknown: '#e0e0e0'
  };

  return (
    <div style={{
      padding: '1rem',
      background: 'var(--color-white)',
      border: `2px solid ${borderColors[className] || borderColors.unknown}`,
      borderRadius: 'var(--border-radius-md)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

export default Overview;

