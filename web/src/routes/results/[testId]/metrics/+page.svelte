<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: metrics = data.metrics;
  $: nav = metrics?.navigationTiming;
  
  // Core Web Vitals
  $: fcp = metrics?.paintTiming?.find((p: any) => p.name === 'first-contentful-paint')?.startTime || null;
  $: lcp = metrics?.largestContentfulPaint?.[0]?.startTime || null;
  $: cls = metrics?.layoutShifts?.reduce((sum: number, shift: any) => sum + (shift.value || 0), 0) || null;
  $: ttfb = nav?.responseStart && nav?.fetchStart ? (nav.responseStart - nav.fetchStart) : null;
  $: totalDuration = nav?.duration || null;
  
  // Performance Metrics
  $: tbt = metrics?.totalBlockingTime || 0;
  $: fp = metrics?.paintTiming?.find((p: any) => p.name === 'first-paint')?.startTime || null;
  $: layoutShiftCount = metrics?.layoutShifts?.length || 0;
  
  // Timings
  $: serverTimings = nav?.serverTiming || [];
  $: userTimings = metrics?.userTiming || [];
  
  // Navigation timing phases
  $: phases = nav ? [
    { name: 'DNS Lookup', start: nav.domainLookupStart, end: nav.domainLookupEnd, color: 'dns' },
    { name: 'Connect', start: nav.connectStart, end: nav.connectEnd, color: 'connect' },
    { name: 'Request', start: nav.requestStart, end: nav.responseStart, color: 'request' },
    { name: 'Response', start: nav.responseStart, end: nav.responseEnd, color: 'response' },
    { name: 'DOM Processing', start: nav.responseEnd, end: nav.domInteractive, color: 'dom' },
    { name: 'DOM Complete', start: nav.domInteractive, end: nav.domComplete, color: 'dom-complete' },
    { name: 'Load Event', start: nav.loadEventStart, end: nav.loadEventEnd, color: 'load' }
  ] : [];
  
  function getVitalClass(metric: string, value: number | null): string {
    if (value === null) return 'unknown';
    
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      lcp: { good: 2500, needsImprovement: 4000 },
      fcp: { good: 1800, needsImprovement: 3000 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      ttfb: { good: 800, needsImprovement: 1800 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'neutral';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }
  
  function getPercentage(start: number, end: number): number {
    if (!totalDuration || end <= start) return 0;
    return ((end - start) / totalDuration) * 100;
  }
  
  function getOffset(start: number): number {
    if (!totalDuration) return 0;
    return (start / totalDuration) * 100;
  }
  
  function formatMs(value: number | null): string {
    return value !== null ? `${Math.round(value)} ms` : 'N/A';
  }
  
  function formatCLS(value: number | null): string {
    return value !== null ? value.toFixed(3) : 'N/A';
  }
</script>

<div class="section-content">
  {#if !metrics}
    <p class="placeholder">No metrics data available.</p>
  {:else}
    <!-- Core Web Vitals -->
    <section class="metrics-section">
      <h3>Core Web Vitals & Duration</h3>
      <div class="cwv-grid">
        <div class="metric-card {getVitalClass('lcp', lcp)}">
          <div class="metric-label">LCP</div>
          <div class="metric-value">{formatMs(lcp)}</div>
          <div class="metric-description">Largest Contentful Paint</div>
        </div>
        
        <div class="metric-card {getVitalClass('fcp', fcp)}">
          <div class="metric-label">FCP</div>
          <div class="metric-value">{formatMs(fcp)}</div>
          <div class="metric-description">First Contentful Paint</div>
        </div>
        
        <div class="metric-card {getVitalClass('cls', cls)}">
          <div class="metric-label">CLS</div>
          <div class="metric-value">{formatCLS(cls)}</div>
          <div class="metric-description">Cumulative Layout Shift</div>
        </div>
        
        <div class="metric-card {getVitalClass('ttfb', ttfb)}">
          <div class="metric-label">TTFB</div>
          <div class="metric-value">{formatMs(ttfb)}</div>
          <div class="metric-description">Time to First Byte</div>
        </div>
        
        <div class="metric-card neutral">
          <div class="metric-label">Duration</div>
          <div class="metric-value">{formatMs(totalDuration)}</div>
          <div class="metric-description">Total Page Load Time</div>
        </div>
      </div>
    </section>
    
    <!-- Navigation Timings -->
    {#if nav}
      <section class="metrics-section">
        <h3>Navigation Timings</h3>
        <div class="total-duration">
          Total Duration: <strong>{formatMs(totalDuration)}</strong>
        </div>
        
        <div class="navigation-timings-bar">
          {#each phases as phase}
            {@const width = getPercentage(phase.start, phase.end)}
            {@const offset = getOffset(phase.start)}
            {#if width > 0}
              <div 
                class="timing-phase {phase.color}" 
                style="width: {width}%; left: {offset}%"
                title="{phase.name}: {Math.round(phase.end - phase.start)} ms"
              ></div>
            {/if}
          {/each}
        </div>
        
        <div class="navigation-timings-details">
          <div class="timing-detail">
            <div class="performance-box performance-dns"></div>
            <span class="timing-name">DNS Lookup:</span>
            <span class="timing-value">{Math.round(nav.domainLookupEnd - nav.domainLookupStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-connect"></div>
            <span class="timing-name">Connect:</span>
            <span class="timing-value">{Math.round(nav.connectEnd - nav.connectStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-request"></div>
            <span class="timing-name">Request:</span>
            <span class="timing-value">{Math.round(nav.responseStart - nav.requestStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-response"></div>
            <span class="timing-name">Response:</span>
            <span class="timing-value">{Math.round(nav.responseEnd - nav.responseStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-dom"></div>
            <span class="timing-name">DOM Interactive:</span>
            <span class="timing-value">{Math.round(nav.domInteractive)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-dom-complete"></div>
            <span class="timing-name">DOM Complete:</span>
            <span class="timing-value">{Math.round(nav.domComplete)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-load"></div>
            <span class="timing-name">Load Event End:</span>
            <span class="timing-value">{Math.round(nav.loadEventEnd)} ms</span>
          </div>
        </div>
      </section>
    {/if}
    
    <!-- Performance Metrics -->
    <section class="metrics-section">
      <h3>Performance Metrics</h3>
      <div class="performance-metrics-grid">
        <div class="performance-metric">
          <span class="performance-label">Total Blocking Time:</span>
          <span class="performance-value">{Math.round(tbt)} ms</span>
        </div>
        <div class="performance-metric">
          <span class="performance-label">Time to First Byte:</span>
          <span class="performance-value">{formatMs(ttfb)}</span>
        </div>
        <div class="performance-metric">
          <span class="performance-label">First Paint:</span>
          <span class="performance-value">{formatMs(fp)}</span>
        </div>
        <div class="performance-metric">
          <span class="performance-label">First Contentful Paint:</span>
          <span class="performance-value">{formatMs(fcp)}</span>
        </div>
        <div class="performance-metric">
          <span class="performance-label">Largest Contentful Paint:</span>
          <span class="performance-value">{formatMs(lcp)}</span>
        </div>
        <div class="performance-metric">
          <span class="performance-label">Layout Shifts:</span>
          <span class="performance-value">{layoutShiftCount}</span>
        </div>
      </div>
    </section>
    
    <!-- Server Timings -->
    <section class="metrics-section">
      <h3>Server Timings</h3>
      {#if serverTimings.length === 0}
        <p class="no-data">No server timing data available</p>
      {:else}
        <div class="timings-table-wrapper">
          <table class="timings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {#each serverTimings as timing}
                <tr>
                  <td>{timing.name}</td>
                  <td>{Math.round(timing.duration)} ms</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
    
    <!-- User Timings -->
    <section class="metrics-section">
      <h3>User Timings</h3>
      {#if userTimings.length === 0}
        <p class="no-data">No user timing data available</p>
      {:else}
        <div class="timings-table-wrapper">
          <table class="timings-table">
            <thead>
              <tr>
                <th class="col-type">Type</th>
                <th class="col-name">Name</th>
                <th class="col-value">Value</th>
              </tr>
            </thead>
            <tbody>
              {#each userTimings as timing}
                <tr>
                  <td class="col-type">
                    <span class="timing-type-badge {timing.entryType}">{timing.entryType}</span>
                  </td>
                  <td class="col-name">{timing.name}</td>
                  <td class="col-value">
                    {timing.entryType === 'mark' 
                      ? Math.round(timing.startTime) + ' ms' 
                      : Math.round(timing.duration) + ' ms'}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .metrics-section {
    margin-top: var(--spacing-xxl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
  }
  
  .metrics-section:first-of-type {
    margin-top: var(--spacing-xl);
  }
  
  .metrics-section h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-lg) 0;
  }
  
  /* Core Web Vitals */
  .cwv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .metric-card {
    padding: var(--spacing-lg);
    background: var(--color-white);
    border-radius: var(--border-radius-md);
    border: 3px solid;
    text-align: center;
    transition: var(--transition-fast);
  }
  
  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .metric-card.good {
    border-color: #28a745;
  }
  
  .metric-card.good .metric-value {
    color: #28a745;
  }
  
  .metric-card.needs-improvement {
    border-color: #ffc107;
  }
  
  .metric-card.needs-improvement .metric-value {
    color: #f57f17;
  }
  
  .metric-card.poor {
    border-color: #dc3545;
  }
  
  .metric-card.poor .metric-value {
    color: #dc3545;
  }
  
  .metric-card.neutral,
  .metric-card.unknown {
    border-color: var(--color-border-light);
  }
  
  .metric-card.neutral .metric-value,
  .metric-card.unknown .metric-value {
    color: var(--color-text-primary);
  }
  
  .metric-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--spacing-xs);
  }
  
  .metric-value {
    font-size: 2rem;
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-sm) 0;
  }
  
  .metric-description {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }
  
  /* Navigation Timings */
  .total-duration {
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--color-white);
    border-radius: var(--border-radius-sm);
    border-left: 4px solid var(--color-accent);
  }
  
  .total-duration strong {
    color: var(--color-accent);
    font-weight: var(--font-weight-bold);
  }
  
  .navigation-timings-bar {
    position: relative;
    width: 100%;
    height: 40px;
    background: var(--color-white);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    margin-bottom: var(--spacing-lg);
  }
  
  .timing-phase {
    position: absolute;
    height: 100%;
    opacity: 0.9;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .timing-phase:hover {
    opacity: 1;
  }
  
  .timing-phase.dns { background: #4285f4; }
  .timing-phase.connect { background: #34a853; }
  .timing-phase.request { background: #fbbc04; }
  .timing-phase.response { background: #ea4335; }
  .timing-phase.dom { background: #9c27b0; }
  .timing-phase.dom-complete { background: #673ab7; }
  .timing-phase.load { background: #ff6b35; }
  
  .navigation-timings-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }
  
  .timing-detail {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--color-white);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
  }
  
  .performance-box {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  
  .performance-dns { background: #4285f4; }
  .performance-connect { background: #34a853; }
  .performance-request { background: #fbbc04; }
  .performance-response { background: #ea4335; }
  .performance-dom { background: #9c27b0; }
  .performance-dom-complete { background: #673ab7; }
  .performance-load { background: #ff6b35; }
  
  .timing-name {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }
  
  .timing-value {
    margin-left: auto;
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
  }
  
  /* Performance Metrics */
  .performance-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-md);
  }
  
  .performance-metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background: var(--color-white);
    border-radius: var(--border-radius-sm);
    border-left: 4px solid var(--color-accent);
  }
  
  .performance-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }
  
  .performance-value {
    font-weight: var(--font-weight-bold);
    color: var(--color-accent);
  }
  
  /* Tables */
  .timings-table-wrapper {
    overflow-x: auto;
    border-radius: var(--border-radius-md);
  }
  
  .timings-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-white);
    font-size: var(--font-size-sm);
  }
  
  .timings-table thead {
    background: var(--color-background-light);
    border-bottom: 2px solid var(--color-border-light);
  }
  
  .timings-table th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: var(--font-size-xs);
  }
  
  .timings-table td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-lighter);
  }
  
  .timings-table tbody tr:last-child td {
    border-bottom: none;
  }
  
  .timings-table tbody tr:hover {
    background: var(--color-background-lighter);
  }
  
  .col-type {
    width: 120px;
  }
  
  .col-value {
    width: 150px;
    text-align: right;
    font-weight: var(--font-weight-semibold);
  }
  
  .timing-type-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius-sm);
    font-size: 11px;
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
  }
  
  .timing-type-badge.mark {
    background: #e3f2fd;
    color: #1565c0;
  }
  
  .timing-type-badge.measure {
    background: #f3e5f5;
    color: #6a1b9a;
  }
  
  .no-data {
    text-align: center;
    color: var(--color-text-secondary);
    padding: var(--spacing-xl);
    background: var(--color-white);
    border-radius: var(--border-radius-md);
  }
  
  .placeholder {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--color-text-secondary);
  }
  
  @media (max-width: 768px) {
    .cwv-grid {
      grid-template-columns: 1fr;
    }
    
    .metric-value {
      font-size: 1.5rem;
    }
    
    .navigation-timings-details {
      grid-template-columns: 1fr;
    }
    
    .performance-metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .timings-table {
      font-size: 12px;
    }
  }
</style>

