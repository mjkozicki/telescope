<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: testId = data.testId;
  $: config = data.config;
  $: metrics = data.metrics;
  $: har = data.har;
  $: screenshotUrl = `/test-results/${testId}/screenshot.png`;
  
  // Extract metrics
  $: url = config?.url || 'Unknown';
  $: date = config?.date ? new Date(config.date).toLocaleString() : 'Unknown';
  
  // Use HAR browser info if available, otherwise fall back to config
  $: browser = har?.browser 
    ? `${har.browser.name} ${har.browser.version}` 
    : (config?.browserConfig?.channel || config?.browserConfig?.engine || 'Unknown');
  
  // Additional HAR metadata
  $: pageTitle = har?.pageTitle || null;
  $: creator = har?.creator 
    ? `${har.creator.name} ${har.creator.version}` 
    : null;
  
  // Paint timing
  $: fcp = metrics?.paintTiming?.find((p: any) => p.name === 'first-contentful-paint')?.startTime || null;
  
  // LCP
  $: lcp = metrics?.largestContentfulPaint?.[0]?.startTime || null;
  
  // CLS
  $: cls = metrics?.layoutShifts?.reduce((sum: number, shift: any) => sum + (shift.value || 0), 0) || null;
  
  // Navigation timing
  $: ttfb = metrics?.navigationTiming?.responseStart ? 
    (metrics.navigationTiming.responseStart - metrics.navigationTiming.fetchStart) : null;
  $: transferSize = metrics?.navigationTiming?.transferSize || null;
  $: responseTime = metrics?.navigationTiming?.duration || null;
  
  // Core Web Vitals thresholds
  function getFCPClass(value: number | null): string {
    if (value === null) return 'unknown';
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }
  
  function getLCPClass(value: number | null): string {
    if (value === null) return 'unknown';
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }
  
  function getCLSClass(value: number | null): string {
    if (value === null) return 'unknown';
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }
  
  function formatBytes(bytes: number | null): string {
    if (bytes === null) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  function formatMs(ms: number | null): string {
    if (ms === null) return 'N/A';
    return `${ms.toFixed(0)} ms`;
  }
  
  function formatCLS(cls: number | null): string {
    if (cls === null) return 'N/A';
    return cls.toFixed(3);
  }
</script>

<div class="section-content">
  <div class="overview-container">
    <!-- Test Info -->
    <div class="test-info">
      <div class="info-row">
        <span class="info-label">URL:</span>
        <span class="info-value">{url}</span>
      </div>
      {#if pageTitle}
        <div class="info-row">
          <span class="info-label">Title:</span>
          <span class="info-value">{pageTitle}</span>
        </div>
      {/if}
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">{date}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Browser:</span>
        <span class="info-value">{browser}</span>
      </div>
      {#if creator}
        <div class="info-row">
          <span class="info-label">Captured by:</span>
          <span class="info-value">{creator}</span>
        </div>
      {/if}
    </div>
    
    <!-- Screenshot -->
    <div class="screenshot-container">
      <img src={screenshotUrl} alt="Test screenshot" class="screenshot" />
    </div>
  </div>
  
  <!-- Core Web Vitals -->
  <div class="section-header">
    <h3>Core Web Vitals</h3>
    <p class="section-description">Critical user-centric performance metrics</p>
  </div>
  
  <div class="metrics-grid cwv-metrics">
    <div class="metric-card cwv-card {getFCPClass(fcp)}">
      <h4>First Contentful Paint</h4>
      <p class="metric-value">{formatMs(fcp)}</p>
      <p class="metric-label">FCP</p>
    </div>
    
    <div class="metric-card cwv-card {getLCPClass(lcp)}">
      <h4>Largest Contentful Paint</h4>
      <p class="metric-value">{formatMs(lcp)}</p>
      <p class="metric-label">LCP</p>
    </div>
    
    <div class="metric-card cwv-card {getCLSClass(cls)}">
      <h4>Cumulative Layout Shift</h4>
      <p class="metric-value">{formatCLS(cls)}</p>
      <p class="metric-label">CLS</p>
    </div>
  </div>
  
  <!-- Other Metrics -->
  <div class="section-header">
    <h3>Additional Metrics</h3>
    <p class="section-description">Network and timing information</p>
  </div>
  
  <div class="metrics-grid other-metrics">
    <div class="metric-card accent-card">
      <h4>Time to First Byte</h4>
      <p class="metric-value">{formatMs(ttfb)}</p>
      <p class="metric-label">TTFB</p>
    </div>
    
    <div class="metric-card accent-card">
      <h4>Transfer Size</h4>
      <p class="metric-value">{formatBytes(transferSize)}</p>
      <p class="metric-label">Total</p>
    </div>
    
    <div class="metric-card accent-card">
      <h4>Response Time</h4>
      <p class="metric-value">{formatMs(responseTime)}</p>
      <p class="metric-label">Duration</p>
    </div>
  </div>
</div>

<style>
  .overview-container {
    margin-top: var(--spacing-xl);
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
  }
  
  .test-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .info-row {
    display: flex;
    gap: var(--spacing-sm);
    align-items: baseline;
  }
  
  .info-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    min-width: 80px;
  }
  
  .info-value {
    color: var(--color-text-primary);
    word-break: break-all;
  }
  
  .screenshot-container {
    border: 2px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    background: var(--color-white);
  }
  
  .screenshot {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .section-header {
    margin-top: var(--spacing-xxl);
    margin-bottom: var(--spacing-lg);
  }
  
  .section-header h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-xs) 0;
  }
  
  .section-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .metric-card {
    padding: var(--spacing-xl);
    background: var(--color-white);
    border-radius: var(--border-radius-md);
    text-align: center;
    transition: var(--transition-fast);
  }
  
  .metric-card h4 {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-md) 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .metric-value {
    font-size: 2.5rem;
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-md) 0;
  }
  
  .metric-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-light);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  /* Core Web Vitals Cards with Border */
  .cwv-card {
    border: 3px solid;
  }
  
  .cwv-card.good {
    border-color: #28a745;
  }
  
  .cwv-card.good .metric-value {
    color: #28a745;
  }
  
  .cwv-card.needs-improvement {
    border-color: #ffc107;
  }
  
  .cwv-card.needs-improvement .metric-value {
    color: #f57f17;
  }
  
  .cwv-card.poor {
    border-color: #dc3545;
  }
  
  .cwv-card.poor .metric-value {
    color: #dc3545;
  }
  
  .cwv-card.unknown {
    border-color: var(--color-border-light);
  }
  
  .cwv-card.unknown .metric-value {
    color: var(--color-text-secondary);
  }
  
  /* Accent Cards */
  .accent-card {
    border: 3px solid var(--color-accent);
  }
  
  .accent-card .metric-value {
    color: var(--color-accent);
  }
  
  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1024px) {
    .overview-container {
      grid-template-columns: 1fr;
    }
    
    .screenshot-container {
      max-width: 500px;
      margin: 0 auto;
    }
  }
  
  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .metric-value {
      font-size: 2rem;
    }
    
    .overview-container {
      padding: var(--spacing-md);
    }
  }
</style>

