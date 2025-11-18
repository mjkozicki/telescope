<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  
  export let data: LayoutData;
  
  $: testId = data.testId;
  $: currentPath = $page.url.pathname;
  $: currentPage = currentPath.split('/').pop() || 'overview';
  
  // Format test ID for display (remove timestamp prefix if present)
  $: displayId = testId.length > 20 ? '...' + testId.slice(-20) : testId;
</script>

<div class="result-container">
  {#if data.config}
    <div class="result-header">
      <div class="result-info">
        <h2 class="result-title">
          {data.config.url || 'Test Result'}
        </h2>
        <div class="result-meta">
          <span class="test-id" title={testId}>ID: {displayId}</span>
          {#if data.config.browser}
            <span class="browser">Browser: {data.config.browser}</span>
          {/if}
          {#if data.config.connectionType}
            <span class="connection">Network: {data.config.connectionType}</span>
          {/if}
        </div>
      </div>
    </div>
  {:else if !data.exists}
    <div class="result-header warning">
      <p>⚠️ Test data for <code>{testId}</code> not found or still loading.</p>
    </div>
  {/if}
  
  <div class="result-content">
    <slot />
  </div>
</div>

<style>
  .result-container {
    width: 100%;
  }

  .result-header {
    background: var(--color-white);
    padding: var(--spacing-lg) var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    border-radius: var(--border-radius-md);
    border: var(--border-width) solid var(--color-border-lighter);
  }

  .result-header.warning {
    background: #fff3cd;
    border-color: #ffc107;
    color: #856404;
  }

  .result-header.warning code {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }

  .result-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .result-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    margin: 0;
    word-break: break-all;
  }

  .result-meta {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .result-meta span {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .test-id {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.85rem;
  }

  .result-content {
    width: 100%;
  }

  @media (max-width: 768px) {
    .result-header {
      padding: var(--spacing-md);
    }

    .result-title {
      font-size: var(--font-size-lg);
    }

    .result-meta {
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
</style>

