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
    secureConnectionStart: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    initiatorType?: string;
    renderBlockingStatus?: string;
  }
  
  $: resources = (data.resources || []) as Resource[];
  $: metrics = data.metrics || {};
  
  // Calculate scale
  $: maxTime = resources.length > 0 
    ? Math.max(...resources.map(r => r.responseEnd))
    : 1000;
  
  // Round up to a nice number
  $: scaledMaxTime = Math.ceil(maxTime / 1000) * 1000;
  
  // Generate time markers
  $: timeMarkers = generateTimeMarkers(scaledMaxTime);
  
  // Selected request for detail view
  let selectedRequest: number | null = null;
  
  function generateTimeMarkers(max: number): number[] {
    const markers: number[] = [];
    const interval = calculateInterval(max);
    for (let t = 0; t <= max; t += interval) {
      markers.push(t);
    }
    return markers;
  }
  
  function calculateInterval(max: number): number {
    const targetCount = 10;
    const targetInterval = max / targetCount;
    const magnitude = Math.pow(10, Math.floor(Math.log10(targetInterval)));
    const options = [1, 2, 5, 10].map(s => s * magnitude);
    
    let bestInterval = options[0];
    let bestDiff = Math.abs(targetCount - (max / bestInterval));
    
    for (const interval of options) {
      const diff = Math.abs(targetCount - (max / interval));
      if (diff <= bestDiff) {
        bestInterval = interval;
        bestDiff = diff;
      }
    }
    
    return bestInterval;
  }
  
  function getXPosition(time: number): number {
    return (time / scaledMaxTime) * 100;
  }
  
  function formatTime(ms: number): string {
    if (ms >= 1000) {
      return (ms / 1000).toFixed(0) + 's';
    }
    return ms.toFixed(0) + 'ms';
  }
  
  function truncateUrl(url: string, maxLength = 60): string {
    if (url.length <= maxLength) return url;
    const start = url.substring(0, maxLength - 15);
    const end = url.substring(url.length - 12);
    return `${start}...${end}`;
  }
  
  function getHost(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }
  
  function getPath(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  }
  
  function selectRequest(index: number) {
    selectedRequest = selectedRequest === index ? null : index;
  }
  
  function getStatusClass(resource: Resource): string {
    // Could be extended with response code if available
    return resource.renderBlockingStatus === 'blocking' ? 'blocking' : 'normal';
  }
  
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  function formatMs(ms: number): string {
    return `${ms.toFixed(2)} ms`;
  }
</script>

<div class="section-content">
  {#if resources.length === 0}
    <p class="placeholder">No waterfall data available.</p>
  {:else}
    <div class="waterfall-container">
      <!-- Time scale -->
      <div class="waterfall-scale">
        <div class="scale-label"></div>
        <div class="scale-markers">
          {#each timeMarkers as marker}
            <div class="scale-marker" style="left: {getXPosition(marker)}%">
              <span class="marker-label">{formatTime(marker)}</span>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Waterfall rows -->
      <div class="waterfall-rows">
        {#each resources as resource, index}
          {@const dnsStart = resource.domainLookupStart - resource.fetchStart}
          {@const dnsEnd = resource.domainLookupEnd - resource.fetchStart}
          {@const connectStart = resource.connectStart - resource.fetchStart}
          {@const connectEnd = resource.connectEnd - resource.fetchStart}
          {@const sslStart = resource.secureConnectionStart > 0 ? resource.secureConnectionStart - resource.fetchStart : 0}
          {@const sslEnd = resource.secureConnectionStart > 0 ? resource.connectEnd - resource.fetchStart : 0}
          {@const requestStart = resource.requestStart - resource.fetchStart}
          {@const responseStart = resource.responseStart - resource.fetchStart}
          {@const responseEnd = resource.responseEnd - resource.fetchStart}
          
          <div 
            class="waterfall-row {getStatusClass(resource)}" 
            class:selected={selectedRequest === index}
            on:click={() => selectRequest(index)}
            on:keydown={(e) => e.key === 'Enter' && selectRequest(index)}
            role="button"
            tabindex="0"
          >
            <div class="row-label">
              <span class="row-number">{index + 1}.</span>
              <span class="row-host">{getHost(resource.name)}</span>
              <span class="row-path">{truncateUrl(getPath(resource.name), 40)}</span>
            </div>
            
            <div class="row-timeline">
              <!-- Timeline bars -->
              <div class="timeline-bars">
                <!-- DNS Lookup -->
                {#if dnsEnd > dnsStart}
                  <div 
                    class="timing-bar dns" 
                    style="left: {getXPosition(resource.fetchStart + dnsStart)}%; width: {getXPosition(dnsEnd - dnsStart)}%"
                    title="DNS Lookup: {formatMs(dnsEnd - dnsStart)}"
                  ></div>
                {/if}
                
                <!-- Connect -->
                {#if connectEnd > connectStart && sslStart === 0}
                  <div 
                    class="timing-bar connect" 
                    style="left: {getXPosition(resource.fetchStart + connectStart)}%; width: {getXPosition(connectEnd - connectStart)}%"
                    title="Connect: {formatMs(connectEnd - connectStart)}"
                  ></div>
                {/if}
                
                <!-- SSL -->
                {#if sslEnd > sslStart}
                  <div 
                    class="timing-bar connect" 
                    style="left: {getXPosition(resource.fetchStart + connectStart)}%; width: {getXPosition(sslStart - connectStart)}%"
                    title="Connect: {formatMs(sslStart - connectStart)}"
                  ></div>
                  <div 
                    class="timing-bar ssl" 
                    style="left: {getXPosition(resource.fetchStart + sslStart)}%; width: {getXPosition(sslEnd - sslStart)}%"
                    title="SSL: {formatMs(sslEnd - sslStart)}"
                  ></div>
                {/if}
                
                <!-- Request (TTFB) -->
                {#if responseStart > requestStart}
                  <div 
                    class="timing-bar request" 
                    style="left: {getXPosition(resource.fetchStart + requestStart)}%; width: {getXPosition(responseStart - requestStart)}%"
                    title="Request (TTFB): {formatMs(responseStart - requestStart)}"
                  ></div>
                {/if}
                
                <!-- Response -->
                {#if responseEnd > responseStart}
                  <div 
                    class="timing-bar response" 
                    style="left: {getXPosition(resource.fetchStart + responseStart)}%; width: {getXPosition(responseEnd - responseStart)}%"
                    title="Response: {formatMs(responseEnd - responseStart)}"
                  ></div>
                {/if}
              </div>
              
              <!-- Grid lines -->
              {#each timeMarkers as marker}
                <div class="grid-line" style="left: {getXPosition(marker)}%"></div>
              {/each}
            </div>
          </div>
          
          {#if selectedRequest === index}
            <div class="request-details">
              <div class="detail-row">
                <span class="detail-label">URL:</span>
                <span class="detail-value">{resource.name}</span>
              </div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Type:</span>
                  <span class="detail-value">{resource.initiatorType || 'other'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Protocol:</span>
                  <span class="detail-value">{resource.nextHopProtocol || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">{formatMs(resource.duration)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Size:</span>
                  <span class="detail-value">{formatBytes(resource.transferSize || 0)}</span>
                </div>
                {#if dnsEnd > dnsStart}
                  <div class="detail-item">
                    <span class="detail-label">DNS:</span>
                    <span class="detail-value">{formatMs(dnsEnd - dnsStart)}</span>
                  </div>
                {/if}
                {#if connectEnd > connectStart}
                  <div class="detail-item">
                    <span class="detail-label">Connect:</span>
                    <span class="detail-value">{formatMs(connectEnd - connectStart)}</span>
                  </div>
                {/if}
                {#if responseStart > requestStart}
                  <div class="detail-item">
                    <span class="detail-label">TTFB:</span>
                    <span class="detail-value">{formatMs(responseStart - requestStart)}</span>
                  </div>
                {/if}
                {#if responseEnd > responseStart}
                  <div class="detail-item">
                    <span class="detail-label">Download:</span>
                    <span class="detail-value">{formatMs(responseEnd - responseStart)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        {/each}
      </div>
      
      <!-- Legend -->
      <div class="waterfall-legend">
        <div class="legend-item">
          <div class="legend-color dns"></div>
          <span>DNS Lookup</span>
        </div>
        <div class="legend-item">
          <div class="legend-color connect"></div>
          <span>Connect</span>
        </div>
        <div class="legend-item">
          <div class="legend-color ssl"></div>
          <span>SSL</span>
        </div>
        <div class="legend-item">
          <div class="legend-color request"></div>
          <span>Request (TTFB)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color response"></div>
          <span>Response</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .waterfall-container {
    margin-top: var(--spacing-lg);
    background: var(--color-white);
    border: 1px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    overflow: hidden;
  }
  
  /* Time Scale */
  .waterfall-scale {
    display: flex;
    border-bottom: 2px solid var(--color-border-light);
    background: var(--color-background-lighter);
    height: 40px;
  }
  
  .scale-label {
    width: 250px;
    flex-shrink: 0;
    border-right: 1px solid var(--color-border-light);
  }
  
  .scale-markers {
    flex: 1;
    position: relative;
  }
  
  .scale-marker {
    position: absolute;
    top: 0;
    height: 100%;
    border-left: 1px solid var(--color-border-lighter);
  }
  
  .marker-label {
    position: absolute;
    top: 50%;
    left: 4px;
    transform: translateY(-50%);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-semibold);
  }
  
  /* Waterfall Rows */
  .waterfall-rows {
    max-height: 600px;
    overflow-y: auto;
  }
  
  .waterfall-row {
    display: flex;
    border-bottom: 1px solid var(--color-border-lighter);
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  .waterfall-row:hover {
    background: var(--color-background-lighter);
  }
  
  .waterfall-row.selected {
    background: #e0f2fe;
  }
  
  .waterfall-row.blocking {
    background: #fee2e2;
  }
  
  .waterfall-row.blocking:hover {
    background: #fecaca;
  }
  
  .row-label {
    width: 250px;
    flex-shrink: 0;
    padding: var(--spacing-sm);
    border-right: 1px solid var(--color-border-light);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
    overflow: hidden;
  }
  
  .row-number {
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-semibold);
    flex-shrink: 0;
  }
  
  .row-host {
    color: var(--color-text-primary);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }
  
  .row-path {
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
  
  .row-timeline {
    flex: 1;
    position: relative;
    min-height: 28px;
  }
  
  .timeline-bars {
    position: relative;
    height: 100%;
    z-index: 2;
  }
  
  .timing-bar {
    position: absolute;
    top: 6px;
    height: 16px;
    border-radius: 2px;
    opacity: 0.9;
    transition: opacity 0.2s;
  }
  
  .timing-bar:hover {
    opacity: 1;
    z-index: 10;
  }
  
  .timing-bar.dns {
    background: #4285f4;
  }
  
  .timing-bar.connect {
    background: #34a853;
  }
  
  .timing-bar.ssl {
    background: #9333ea;
  }
  
  .timing-bar.request {
    background: #fbbc04;
  }
  
  .timing-bar.response {
    background: #ea4335;
  }
  
  .grid-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #e5e7eb;
    z-index: 1;
  }
  
  /* Request Details */
  .request-details {
    padding: var(--spacing-md);
    background: #f0f9ff;
    border-bottom: 2px solid var(--color-border-light);
  }
  
  .detail-row {
    margin-bottom: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
  }
  
  .detail-row .detail-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    min-width: 60px;
  }
  
  .detail-row .detail-value {
    color: var(--color-text-primary);
    word-break: break-all;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 12px;
  }
  
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .detail-item {
    display: flex;
    gap: var(--spacing-xs);
  }
  
  .detail-item .detail-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    min-width: 80px;
  }
  
  .detail-item .detail-value {
    color: var(--color-text-primary);
  }
  
  /* Legend */
  .waterfall-legend {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--color-background-lighter);
    border-top: 1px solid var(--color-border-light);
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
  
  .legend-color {
    width: 20px;
    height: 12px;
    border-radius: 2px;
  }
  
  .legend-color.dns { background: #4285f4; }
  .legend-color.connect { background: #34a853; }
  .legend-color.ssl { background: #9333ea; }
  .legend-color.request { background: #fbbc04; }
  .legend-color.response { background: #ea4335; }
  
  .placeholder {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--color-text-secondary);
  }
  
  @media (max-width: 768px) {
    .scale-label,
    .row-label {
      width: 150px;
    }
    
    .row-host,
    .row-path {
      font-size: 10px;
    }
    
    .detail-grid {
      grid-template-columns: 1fr;
    }
    
    .waterfall-legend {
      justify-content: center;
    }
  }
</style>

