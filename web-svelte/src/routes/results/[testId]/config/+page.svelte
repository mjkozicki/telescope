<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: configJson = data.config ? JSON.stringify(data.config, null, 2) : null;
</script>

<div class="section-content">
  {#if configJson}
    <div class="config-container">
      <div class="config-header">
        <h3>config.json</h3>
        <button class="copy-button" on:click={() => navigator.clipboard.writeText(configJson)}>
          Copy
        </button>
      </div>
      <pre class="config-content"><code>{configJson}</code></pre>
    </div>
  {:else}
    <p class="placeholder">No configuration data available.</p>
  {/if}
</div>

<style>
  .config-container {
    margin-top: var(--spacing-xl);
    border: 1px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    background: var(--color-white);
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-background-lighter);
    border-bottom: 1px solid var(--color-border-lighter);
  }

  .config-header h3 {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .copy-button {
    padding: var(--spacing-xs) var(--spacing-md);
    background: var(--color-white);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: var(--transition-fast);
  }

  .copy-button:hover {
    background: var(--color-background-light);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .config-content {
    margin: 0;
    padding: var(--spacing-lg);
    background: #fafafa;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #333;
  }

  .config-content code {
    background: transparent;
    padding: 0;
    border: none;
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
    .config-content {
      font-size: 12px;
      padding: var(--spacing-md);
    }
  }
</style>

