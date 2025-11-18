import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Test not found</div>;

  return (
    <div className="section-content">
      <h2>Overview</h2>
      <p>Test summary with key performance metrics and screenshot.</p>
      <div style={{ marginTop: '2rem' }}>
        <strong>Test ID:</strong> {testId}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <strong>URL:</strong> {data.config?.url}
      </div>
      {/* Add more overview details similar to Svelte version */}
    </div>
  );
}

export default Overview;

