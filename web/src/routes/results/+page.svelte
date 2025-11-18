<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  // Sample test ID from public folder if available
  const sampleTestId = '2025_11_11_21_24_52_0a417b48';
  
  function formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  }
</script>

<div class="section-content">
  <h2>Test Results</h2>
  <p>View your performance test results.</p>
  
  {#if data.results.length === 0}
    <div class="empty-state">
      <p>No test results yet. Run a test to see results here.</p>
      <p class="sample-link">
        Or view the <a href="/results/{sampleTestId}/overview">sample test result</a> 
        (if available in public/results folder)
      </p>
    </div>
  {:else}
    <ul class="results-list">
      {#each data.results as result}
        <li class="result-item">
          <a href="/results/{result.id}/overview" class="result-link">
            <div class="result-main">
              <strong class="result-url">{result.url}</strong>
              <div class="result-meta">
                <span class="result-browser">{result.browser}</span>
                <span class="result-time">{formatTimestamp(result.timestamp)}</span>
              </div>
            </div>
            <span class="result-arrow">→</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .empty-state {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xxl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .empty-state p {
    margin-bottom: var(--spacing-md);
  }

  .sample-link {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
  }

  .sample-link a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .sample-link a:hover {
    text-decoration: underline;
  }

  .results-list {
    list-style: none;
    padding: 0;
    margin-top: var(--spacing-xl);
  }

  .result-item {
    margin-bottom: var(--spacing-md);
  }

  .result-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    background: var(--color-white);
    border: var(--border-width) solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    color: var(--color-text-primary);
    text-decoration: none;
    transition: var(--transition-fast);
    gap: var(--spacing-md);
  }

  .result-link:hover {
    border-color: var(--color-accent);
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .result-main {
    flex: 1;
    min-width: 0;
  }

  .result-url {
    display: block;
    font-size: var(--font-size-base);
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
    word-break: break-all;
  }

  .result-meta {
    display: flex;
    gap: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .result-arrow {
    color: var(--color-accent);
    font-size: 1.5rem;
    flex-shrink: 0;
    transition: var(--transition-fast);
  }

  .result-link:hover .result-arrow {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .result-link {
      padding: var(--spacing-md);
    }

    .result-meta {
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
</style>

