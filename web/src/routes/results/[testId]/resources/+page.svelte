<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  interface Resource {
    name: string;
    startTime: number;
    duration: number;
    nextHopProtocol: string;
    transferSize: number;
    decodedBodySize: number;
    fetchStart: number;
    domainLookupStart: number;
    domainLookupEnd: number;
    connectStart: number;
    connectEnd: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    initiatorType?: string;
    renderBlockingStatus?: string;
  }
  
  $: resources = (data.resources || []) as Resource[];
  $: blockingResources = resources.filter(r => r.renderBlockingStatus === 'blocking');
  
  // Track which resources are expanded
  let expandedResources = new Set<number>();
  
  function toggleResource(index: number) {
    if (expandedResources.has(index)) {
      expandedResources.delete(index);
    } else {
      expandedResources.add(index);
    }
    expandedResources = expandedResources; // Trigger reactivity
  }
  
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  function formatMs(ms: number): string {
    return `${ms.toFixed(2)} ms`;
  }
  
  function truncateUrl(url: string, maxLength = 80): string {
    if (url.length <= maxLength) return url;
    const start = url.substring(0, maxLength - 20);
    const end = url.substring(url.length - 17);
    return `${start}...${end}`;
  }
  
  function getTimingPhases(resource: Resource) {
    const duration = resource.duration;
    
    return [
      { 
        name: 'DNS Lookup', 
        start: resource.domainLookupStart - resource.fetchStart, 
        end: resource.domainLookupEnd - resource.fetchStart, 
        color: 'dns' 
      },
      { 
        name: 'Connect', 
        start: resource.connectStart - resource.fetchStart, 
        end: resource.connectEnd - resource.fetchStart, 
        color: 'connect' 
      },
      { 
        name: 'Request', 
        start: resource.requestStart - resource.fetchStart, 
        end: resource.responseStart - resource.fetchStart, 
        color: 'request' 
      },
      { 
        name: 'Response', 
        start: resource.responseStart - resource.fetchStart, 
        end: resource.responseEnd - resource.fetchStart, 
        color: 'response' 
      }
    ];
  }
  
  function getPercentage(start: number, end: number, total: number): number {
    if (total === 0 || end <= start) return 0;
    return ((end - start) / total) * 100;
  }
  
  function getOffset(start: number, total: number): number {
    if (total === 0) return 0;
    return (start / total) * 100;
  }
</script>

<div class="section-content">
  {#if resources.length === 0}
    <p class="placeholder">No resource data available.</p>
  {:else}
    <div class="resources-stats">
      <div class="stat">
        <span class="stat-label">Total Resources:</span>
        <span class="stat-value">{resources.length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Blocking Resources:</span>
        <span class="stat-value blocking">{blockingResources.length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Total Transfer Size:</span>
        <span class="stat-value">{formatBytes(resources.reduce((sum, r) => sum + (r.transferSize || 0), 0))}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Total Decoded Size:</span>
        <span class="stat-value">{formatBytes(resources.reduce((sum, r) => sum + (r.decodedBodySize || 0), 0))}</span>
      </div>
    </div>
    
    <div class="resources-table-wrapper">
      <table class="resources-table">
        <thead>
          <tr>
            <th class="col-expand"></th>
            <th class="col-name">Resource</th>
            <th class="col-type">Type</th>
            <th class="col-size">Size</th>
            <th class="col-duration">Duration</th>
          </tr>
        </thead>
        <tbody>
          {#each resources as resource, index}
            <tr class="resource-row" class:expanded={expandedResources.has(index)} class:blocking={resource.renderBlockingStatus === 'blocking'}>
              <td class="col-expand">
                <button 
                  class="expand-button" 
                  on:click={() => toggleResource(index)}
                  aria-label={expandedResources.has(index) ? 'Collapse' : 'Expand'}
                >
                  {expandedResources.has(index) ? '▼' : '▶'}
                </button>
              </td>
              <td class="col-name" title={resource.name}>
                {truncateUrl(resource.name)}
              </td>
              <td class="col-type">{resource.initiatorType || 'other'}</td>
              <td class="col-size">{formatBytes(resource.transferSize || 0)}</td>
              <td class="col-duration">{formatMs(resource.duration)}</td>
            </tr>
            
            {#if expandedResources.has(index)}
              <tr class="expanded-row" class:blocking={resource.renderBlockingStatus === 'blocking'}>
                <td colspan="5">
                  <div class="expanded-content">
                    <!-- Resource Details -->
                    <div class="resource-details">
                      <div class="detail-item">
                        <span class="detail-label">Full URL:</span>
                        <span class="detail-value url-value">{resource.name}</span>
                      </div>
                      <div class="detail-grid">
                        <div class="detail-item">
                          <span class="detail-label">Duration:</span>
                          <span class="detail-value">{formatMs(resource.duration)}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Start Time:</span>
                          <span class="detail-value">{formatMs(resource.startTime)}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Protocol:</span>
                          <span class="detail-value">{resource.nextHopProtocol || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Transfer Size:</span>
                          <span class="detail-value">{formatBytes(resource.transferSize || 0)}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Decoded Size:</span>
                          <span class="detail-value">{formatBytes(resource.decodedBodySize || 0)}</span>
                        </div>
                        {#if resource.renderBlockingStatus}
                          <div class="detail-item">
                            <span class="detail-label">Render Blocking:</span>
                            <span class="detail-value">{resource.renderBlockingStatus}</span>
                          </div>
                        {/if}
                      </div>
                    </div>
                    
                    <!-- Timing Bar -->
                    <div class="timing-section">
                      <h4>Resource Timing</h4>
                      <div class="timing-bar-container">
                        <div class="timing-bar">
                          {#each getTimingPhases(resource) as phase}
                            {@const width = getPercentage(phase.start, phase.end, resource.duration)}
                            {@const offset = getOffset(phase.start, resource.duration)}
                            {#if width > 0}
                              <div 
                                class="timing-phase {phase.color}" 
                                style="width: {width}%; left: {offset}%"
                                title="{phase.name}: {formatMs(phase.end - phase.start)}"
                              ></div>
                            {/if}
                          {/each}
                        </div>
                      </div>
                      
                      <!-- Timing Table -->
                      <div class="timing-table-wrapper">
                        <table class="timing-table">
                          <thead>
                            <tr>
                              <th>Phase</th>
                              <th>Start</th>
                              <th>End</th>
                              <th>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><div class="timing-box timing-dns"></div> DNS Lookup</td>
                              <td>{formatMs(resource.domainLookupStart - resource.fetchStart)}</td>
                              <td>{formatMs(resource.domainLookupEnd - resource.fetchStart)}</td>
                              <td>{formatMs(resource.domainLookupEnd - resource.domainLookupStart)}</td>
                            </tr>
                            <tr>
                              <td><div class="timing-box timing-connect"></div> Connect</td>
                              <td>{formatMs(resource.connectStart - resource.fetchStart)}</td>
                              <td>{formatMs(resource.connectEnd - resource.fetchStart)}</td>
                              <td>{formatMs(resource.connectEnd - resource.connectStart)}</td>
                            </tr>
                            <tr>
                              <td><div class="timing-box timing-request"></div> Request</td>
                              <td>{formatMs(resource.requestStart - resource.fetchStart)}</td>
                              <td>{formatMs(resource.responseStart - resource.fetchStart)}</td>
                              <td>{formatMs(resource.responseStart - resource.requestStart)}</td>
                            </tr>
                            <tr>
                              <td><div class="timing-box timing-response"></div> Response</td>
                              <td>{formatMs(resource.responseStart - resource.fetchStart)}</td>
                              <td>{formatMs(resource.responseEnd - resource.fetchStart)}</td>
                              <td>{formatMs(resource.responseEnd - resource.responseStart)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .resources-stats {
    display: flex;
    gap: var(--spacing-xl);
    margin: var(--spacing-xl) 0;
    padding: var(--spacing-lg);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-semibold);
  }
  
  .stat-value {
    font-size: var(--font-size-lg);
    color: var(--color-accent);
    font-weight: var(--font-weight-bold);
  }
  
  .stat-value.blocking {
    color: #dc2626;
  }
  
  .resources-table-wrapper {
    overflow-x: auto;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border-lighter);
  }
  
  .resources-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-white);
    font-size: var(--font-size-sm);
  }
  
  .resources-table thead {
    background: var(--color-background-lighter);
    border-bottom: 2px solid var(--color-border-light);
    position: sticky;
    top: 0;
  }
  
  .resources-table th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: var(--font-size-xs);
  }
  
  .resources-table td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border-lighter);
  }
  
  .col-expand {
    width: 40px;
    text-align: center;
  }
  
  .col-name {
    max-width: 400px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 12px;
  }
  
  .col-type {
    width: 100px;
  }
  
  .col-size {
    width: 120px;
    text-align: right;
  }
  
  .col-duration {
    width: 120px;
    text-align: right;
    font-weight: var(--font-weight-semibold);
  }
  
  .expand-button {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: 12px;
    padding: var(--spacing-xs);
    transition: var(--transition-fast);
  }
  
  .expand-button:hover {
    color: var(--color-accent);
    transform: scale(1.2);
  }
  
  .resource-row {
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  .resource-row:hover {
    background: var(--color-background-lighter);
  }
  
  .resource-row.expanded {
    background: var(--color-background-light);
  }
  
  .resource-row.blocking {
    background: #fee2e2;
  }
  
  .resource-row.blocking:hover {
    background: #fecaca;
  }
  
  .resource-row.blocking.expanded {
    border-bottom: 2px solid #fecaca;
    background: var(--color-background-lighter);
  }
  
  .expanded-row {
    background: var(--color-background-light);
  }
  
  .expanded-row.blocking {
    background: #fecaca;
  }
  
  .expanded-row td {
    padding: 0;
    border-bottom: 2px solid var(--color-border-light);
  }
  
  .expanded-content {
    padding: var(--spacing-xl);
  }
  
  /* Resource Details */
  .resource-details {
    margin-bottom: var(--spacing-xl);
  }
  
  .detail-item {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .detail-item .detail-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    min-width: 120px;
  }
  
  .detail-item .detail-value {
    color: var(--color-text-primary);
  }
  
  .url-value {
    word-break: break-all;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 12px;
  }
  
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-white);
    border-radius: var(--border-radius-sm);
  }
  
  .detail-grid .detail-item {
    margin-bottom: 0;
  }
  
  /* Timing Section */
  .timing-section {
    margin-top: var(--spacing-xl);
  }
  
  .timing-section h4 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }
  
  .timing-bar-container {
    margin-bottom: var(--spacing-lg);
  }
  
  .timing-bar {
    position: relative;
    width: 100%;
    height: 32px;
    background: var(--color-white);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    border: 1px solid var(--color-border-lighter);
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
  
  /* Timing Table */
  .timing-table-wrapper {
    overflow-x: auto;
  }
  
  .timing-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-white);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
  }
  
  .timing-table thead {
    background: var(--color-background-lighter);
  }
  
  .timing-table th {
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-xs);
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .timing-table td {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    border-bottom: 1px solid var(--color-border-lighter);
  }
  
  .timing-table tbody tr:last-child td {
    border-bottom: none;
  }
  
  .timing-table td:first-child {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .timing-box {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  
  .timing-dns { background: #4285f4; }
  .timing-connect { background: #34a853; }
  .timing-request { background: #fbbc04; }
  .timing-response { background: #ea4335; }
  
  .placeholder {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--color-text-secondary);
  }
  
  @media (max-width: 768px) {
    .resources-stats {
      flex-direction: column;
      gap: var(--spacing-md);
    }
    
    .resources-table {
      font-size: 12px;
    }
    
    .col-name {
      max-width: 200px;
    }
    
    .detail-grid {
      grid-template-columns: 1fr;
    }
    
    .expanded-content {
      padding: var(--spacing-md);
    }
  }
</style>

