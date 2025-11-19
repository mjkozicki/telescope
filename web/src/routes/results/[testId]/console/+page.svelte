<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  interface ConsoleMessage {
    type: 'error' | 'warning' | 'info' | 'debug' | 'log';
    text: string;
    location: {
      url: string;
      lineNumber: number;
      columnNumber: number;
    };
  }
  
  $: messages = (data.console || []) as ConsoleMessage[];
  
  // Count by type
  $: errorCount = messages.filter(m => m.type === 'error').length;
  $: warningCount = messages.filter(m => m.type === 'warning').length;
  $: infoCount = messages.filter(m => m.type === 'info' || m.type === 'log').length;
  $: debugCount = messages.filter(m => m.type === 'debug').length;
  
  function truncateUrl(url: string, maxLength = 60): string {
    if (url.length <= maxLength) return url;
    const start = url.substring(0, maxLength - 20);
    const end = url.substring(url.length - 17);
    return `${start}...${end}`;
  }
</script>

<div class="section-content">
  {#if messages.length === 0}
    <p class="placeholder">No console messages captured.</p>
  {:else}
    <div class="console-header">
      <div class="message-stats">
        <span class="stat-item error">{errorCount} errors</span>
        <span class="stat-item warning">{warningCount} warnings</span>
        <span class="stat-item info">{infoCount} info</span>
        <span class="stat-item debug">{debugCount} debug</span>
      </div>
      <span class="total-count">{messages.length} total messages</span>
    </div>
    
    <div class="console-table-wrapper">
      <table class="console-table">
        <thead>
          <tr>
            <th class="col-level">Level</th>
            <th class="col-message">Message</th>
            <th class="col-location">Location</th>
          </tr>
        </thead>
        <tbody>
          {#each messages as message}
            <tr class="console-row level-{message.type}">
              <td class="col-level">
                <span class="level-badge">{message.type}</span>
              </td>
              <td class="col-message">{message.text}</td>
              <td class="col-location">
                <div class="location-info">
                  <span class="location-url" title={message.location.url}>
                    {truncateUrl(message.location.url)}
                  </span>
                  <span class="location-coords">
                    {message.location.lineNumber}:{message.location.columnNumber}
                  </span>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
  }
  
  .message-stats {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
  
  .stat-item {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }
  
  .stat-item.error {
    background: #ffebee;
    color: #c62828;
  }
  
  .stat-item.warning {
    background: #fff8e1;
    color: #f57f17;
  }
  
  .stat-item.info {
    background: #e3f2fd;
    color: #1565c0;
  }
  
  .stat-item.debug {
    background: #f5f5f5;
    color: #616161;
  }
  
  .total-count {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }
  
  .console-table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    background: var(--color-white);
  }
  
  .console-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }
  
  .console-table thead {
    background: var(--color-background-lighter);
    border-bottom: 2px solid var(--color-border-light);
    position: sticky;
    top: 0;
  }
  
  .console-table th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    white-space: nowrap;
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .console-table td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-lighter);
  }
  
  .console-table tbody tr:last-child td {
    border-bottom: none;
  }
  
  /* Row background colors based on level */
  .console-row.level-error {
    background: #ffebee;
  }
  
  .console-row.level-warning {
    background: #fff8e1;
  }
  
  .console-row.level-info,
  .console-row.level-log {
    background: #e3f2fd;
  }
  
  .console-row.level-debug {
    background: #f5f5f5;
  }
  
  .col-level {
    width: 100px;
  }
  
  .col-message {
    max-width: 500px;
    word-break: break-word;
  }
  
  .col-location {
    width: 280px;
  }
  
  .level-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-sm);
    font-size: 11px;
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .level-error .level-badge {
    background: #ffcdd2;
    color: #c62828;
    border: 1px solid #e57373;
  }
  
  .level-error .col-message {
    color: #c62828;
  }
  
  .level-warning .level-badge {
    background: #fff9c4;
    color: #f57f17;
    border: 1px solid #fdd835;
  }
  
  .level-warning .col-message {
    color: #f57f17;
  }
  
  .level-info .level-badge,
  .level-log .level-badge {
    background: #bbdefb;
    color: #1565c0;
    border: 1px solid #64b5f6;
  }
  
  .level-info .col-message,
  .level-log .col-message {
    color: #1565c0;
  }
  
  .level-debug .level-badge {
    background: #eeeeee;
    color: #616161;
    border: 1px solid #bdbdbd;
  }
  
  .level-debug .col-message {
    color: #616161;
  }
  
  .location-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 12px;
  }
  
  .location-url {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .location-coords {
    color: var(--color-text-light);
    font-weight: var(--font-weight-medium);
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
    .console-header {
      flex-direction: column;
      gap: var(--spacing-sm);
      align-items: flex-start;
    }
    
    .console-table {
      font-size: 12px;
    }
    
    .console-table th,
    .console-table td {
      padding: var(--spacing-sm);
    }
    
    .col-location {
      width: 200px;
    }
    
    .location-info {
      font-size: 11px;
    }
    
    .level-badge {
      font-size: 10px;
      padding: 0.2rem 0.5rem;
    }
  }
</style>

