<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
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
    </div>
  {:else}
    <ul class="results-list">
      {#each data.results as result}
        <li class="result-item">
          <a href="/results/{result.testId}/overview" class="result-link">
            <img src="{result.screenshotUrl || '/images/default-screenshot.png'}" alt="Screenshot" class="result-screenshot" />
            <div class="result-main">
              <strong class="result-url">{result.url}</strong>
                <div class="result-meta">
                  <img src="{result.engineUrl}" alt="Engine" class="result-engine" />
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

  .result-screenshot {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border-lighter);
    flex-shrink: 0;
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
    border-radius: var(--border-radius-sm);
  }

  .result-meta {
    display: flex;
    gap: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    align-items: center;
  }

  .result-engine {
    width: 20px;
    height: 20px;
    object-fit: contain;
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

    .result-screenshot {
      width: 80px;
      height: 60px;
    }

    .result-meta {
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
</style>

