<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  interface Resource {
    name: string;
    duration: number;
    transferSize: number;
    renderBlockingStatus: string;
  }
  
  $: resources = (data.resources || []) as Resource[];
  
  // Top 5 longest response times (duration)
  $: longestResponseTimes = [...resources]
    .filter(r => r.duration > 0)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);
  
  // Top 5 largest files (transferSize)
  $: largestFiles = [...resources]
    .filter(r => r.transferSize > 0)
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 5);
  
  // All render blocking resources
  $: renderBlockingResources = resources.filter(
    r => r.renderBlockingStatus === 'blocking'
  );
  
  function formatDuration(ms: number): string {
    return `${ms.toFixed(2)} ms`;
  }
  
  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  function truncateUrl(url: string, maxLength = 80): string {
    if (url.length <= maxLength) return url;
    const start = url.substring(0, maxLength - 20);
    const end = url.substring(url.length - 17);
    return `${start}...${end}`;
  }
</script>

<div class="section-content">
  {#if resources.length === 0}
    <p class="placeholder">No resource data available.</p>
  {:else}
    <!-- Top 5 Longest Response Times -->
    <section class="bottleneck-section">
      <h3>Top 5 Longest Response Times</h3>
      <div class="table-container">
        <table class="bottleneck-table">
          <thead>
            <tr>
              <th class="rank-col">#</th>
              <th class="url-col">Resource URL</th>
              <th class="metric-col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {#each longestResponseTimes as resource, index}
              <tr>
                <td class="rank-col">{index + 1}</td>
                <td class="url-col" title={resource.name}>{truncateUrl(resource.name)}</td>
                <td class="metric-col">{formatDuration(resource.duration)}</td>
              </tr>
            {:else}
              <tr>
                <td colspan="3" class="empty-cell">No data available</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- Top 5 Largest Files -->
    <section class="bottleneck-section">
      <h3>Top 5 Largest Files</h3>
      <div class="table-container">
        <table class="bottleneck-table">
          <thead>
            <tr>
              <th class="rank-col">#</th>
              <th class="url-col">Resource URL</th>
              <th class="metric-col">Size</th>
            </tr>
          </thead>
          <tbody>
            {#each largestFiles as resource, index}
              <tr>
                <td class="rank-col">{index + 1}</td>
                <td class="url-col" title={resource.name}>{truncateUrl(resource.name)}</td>
                <td class="metric-col">{formatSize(resource.transferSize)}</td>
              </tr>
            {:else}
              <tr>
                <td colspan="3" class="empty-cell">No data available</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- All Render Blocking Resources -->
    <section class="bottleneck-section">
      <h3>Render Blocking Resources ({renderBlockingResources.length})</h3>
      <div class="table-container">
        <table class="bottleneck-table">
          <thead>
            <tr>
              <th class="rank-col">#</th>
              <th class="url-col">Resource URL</th>
              <th class="metric-col">Duration</th>
              <th class="metric-col">Size</th>
            </tr>
          </thead>
          <tbody>
            {#each renderBlockingResources as resource, index}
              <tr>
                <td class="rank-col">{index + 1}</td>
                <td class="url-col" title={resource.name}>{truncateUrl(resource.name)}</td>
                <td class="metric-col">{formatDuration(resource.duration)}</td>
                <td class="metric-col">{formatSize(resource.transferSize)}</td>
              </tr>
            {:else}
              <tr>
                <td colspan="4" class="empty-cell">No render blocking resources found</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
</div>

<style>
  .bottleneck-section {
    margin-top: var(--spacing-xxl);
  }
  
  .bottleneck-section:first-of-type {
    margin-top: var(--spacing-xl);
  }
  
  .bottleneck-section h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
  }
  
  .table-container {
    overflow-x: auto;
    border: 1px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    background: var(--color-white);
  }
  
  .bottleneck-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }
  
  .bottleneck-table thead {
    background: var(--color-background-lighter);
    border-bottom: 2px solid var(--color-border-light);
  }
  
  .bottleneck-table th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    white-space: nowrap;
  }
  
  .bottleneck-table td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-lighter);
  }
  
  .bottleneck-table tbody tr:last-child td {
    border-bottom: none;
  }
  
  .bottleneck-table tbody tr:hover {
    background: var(--color-background-lighter);
  }
  
  .rank-col {
    width: 50px;
    text-align: center;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }
  
  .url-col {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 12px;
  }
  
  .metric-col {
    width: 120px;
    text-align: right;
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
  }
  
  .empty-cell {
    text-align: center;
    color: var(--color-text-secondary);
    padding: var(--spacing-xl);
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
    .bottleneck-table {
      font-size: 12px;
    }
    
    .bottleneck-table th,
    .bottleneck-table td {
      padding: var(--spacing-sm);
    }
    
    .url-col {
      font-size: 11px;
    }
    
    .metric-col {
      width: 80px;
    }
  }
</style>

