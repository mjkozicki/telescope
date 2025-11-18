<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: testData = data;
</script>

<div class="section-content">
  <h2>Overview</h2>
  <p>Test overview and summary metrics.</p>
  
  {#if testData.metrics}
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Performance Score</h3>
        <p class="metric-value">{testData.metrics.performanceScore || 'N/A'}</p>
      </div>
      
      {#if testData.metrics.firstContentfulPaint}
        <div class="metric-card">
          <h3>First Contentful Paint</h3>
          <p class="metric-value">{testData.metrics.firstContentfulPaint}ms</p>
        </div>
      {/if}
      
      {#if testData.metrics.largestContentfulPaint}
        <div class="metric-card">
          <h3>Largest Contentful Paint</h3>
          <p class="metric-value">{testData.metrics.largestContentfulPaint}ms</p>
        </div>
      {/if}
      
      {#if testData.metrics.timeToInteractive}
        <div class="metric-card">
          <h3>Time to Interactive</h3>
          <p class="metric-value">{testData.metrics.timeToInteractive}ms</p>
        </div>
      {/if}
    </div>
  {:else}
    <p class="placeholder">Result data will be displayed here when available.</p>
  {/if}
</div>

<style>
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
  }

  .metric-card {
    padding: var(--spacing-lg);
    background: var(--color-white);
    border: var(--border-width) solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
  }

  .metric-card h3 {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    margin: 0;
  }

  .placeholder {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>

