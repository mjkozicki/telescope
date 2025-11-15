import type { FileManifest } from '@/types/single/FileManifest'
import type { Resource } from '@/types/single/Resource'

export class Resources {
  private container: HTMLElement
  private resources: Resource[] = []
  private expandedItems: Set<number> = new Set()
  private resourcesPath: string

  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.resourcesPath = fileManifest?.resources || ''
  }

  async loadResources(): Promise<void> {
    try {
      const response = await fetch(`${this.resourcesPath}`)
      this.resources = await response.json()
    } catch (error) {
      console.error('Failed to load resources:', error)
    }
  }

  render(): void {
    if (this.resources.length === 0) {
      this.container.innerHTML = '<p>No resources data available</p>'
      return
    }

    this.container.innerHTML = `
      <div class="resources-container">
        <div class="resources-header">
          <div class="resource-stats">
            <span class="stat-item">
              <span class="stat-label">Total:</span>
              <span class="stat-value">${this.resources.length}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">Blocking:</span>
              <span class="stat-value blocking">${this.getBlockingCount()}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">Non-blocking:</span>
              <span class="stat-value non-blocking">${this.getNonBlockingCount()}</span>
            </span>
          </div>
        </div>

        <div class="resources-list">
          ${this.renderResourcesList()}
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  private getBlockingCount(): number {
    return this.resources.filter(r => r.renderBlockingStatus === 'blocking').length
  }

  private getNonBlockingCount(): number {
    return this.resources.filter(r => r.renderBlockingStatus === 'non-blocking').length
  }

  private renderResourcesList(): string {
    return this.resources
      .map((resource, index) => {
        const isExpanded = this.expandedItems.has(index)
        const isBlocking = resource.renderBlockingStatus === 'blocking'
        const filename = this.getFilename(resource.name)

        return `
          <div class="resource-item ${isBlocking ? 'blocking' : 'non-blocking'}">
            <div class="resource-header" data-index="${index}">
              <button class="expand-btn" aria-label="Toggle details">
                <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
              </button>
              <div class="resource-info">
                <span class="resource-filename" title="${this.escapeHtml(resource.name)}">
                  ${this.escapeHtml(filename)}
                </span>
                <span class="resource-type-badge">${resource.initiatorType}</span>
              </div>
              <div class="resource-status">
                <span class="status-badge ${isBlocking ? 'blocking' : 'non-blocking'}">
                  ${isBlocking ? 'Blocking' : 'Non-blocking'}
                </span>
              </div>
            </div>
            ${isExpanded ? this.renderResourceDetails(resource, index) : ''}
          </div>
        `
      })
      .join('')
  }

  private renderResourceDetails(resource: Resource, _index: number): string {
    return `
      <div class="resource-details">        
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">URL:</span>
            <span class="detail-value url">${this.escapeHtml(resource.name)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Protocol:</span>
            <span class="detail-value">${resource.nextHopProtocol || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">${Math.round(resource.duration)} ms</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Transfer Size:</span>
            <span class="detail-value">${this.formatBytes(resource.transferSize)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Decoded Size:</span>
            <span class="detail-value">${this.formatBytes(resource.decodedBodySize)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Start Time:</span>
            <span class="detail-value">${Math.round(resource.startTime)} ms</span>
          </div>
        </div>
        ${this.renderTimingBar(resource)}
      </div>
    `
  }

  private renderTimingBar(resource: Resource): string {
    // Calculate timing phases
    const domainLookup = resource.domainLookupEnd - resource.domainLookupStart
    const connect = resource.connectEnd - resource.connectStart
    const secureConnection = resource.secureConnectionStart > 0 
      ? resource.connectEnd - resource.secureConnectionStart 
      : 0
    const request = resource.responseStart - resource.requestStart
    const response = resource.responseEnd - resource.responseStart
    
    const totalDuration = resource.responseEnd - resource.fetchStart
    
    // Calculate percentages for bar widths
    const getPercentage = (value: number) => {
      return totalDuration > 0 ? (value / totalDuration) * 100 : 0
    }
    
    const domainLookupPct = getPercentage(domainLookup)
    const connectPct = getPercentage(connect)
    const requestPct = getPercentage(request)
    const responsePct = getPercentage(response)
    
    return `
      <div class="timing-bar-container">
        <div class="timing-bar">
          ${domainLookup > 0 ? `
            <div class="timing-segment dns" style="width: ${domainLookupPct}%" title="DNS Lookup: ${Math.round(domainLookup)}ms">
              <span class="timing-label">DNS</span>
            </div>
          ` : ''}
          ${connect > 0 ? `
            <div class="timing-segment connect" style="width: ${connectPct}%" title="Connect: ${Math.round(connect)}ms">
              <span class="timing-label">Connect</span>
            </div>
          ` : ''}
          ${request > 0 ? `
            <div class="timing-segment request" style="width: ${requestPct}%" title="Request: ${Math.round(request)}ms">
              <span class="timing-label">Request</span>
            </div>
          ` : ''}
          ${response > 0 ? `
            <div class="timing-segment response" style="width: ${responsePct}%" title="Response: ${Math.round(response)}ms">
              <span class="timing-label">Response</span>
            </div>
          ` : ''}
        </div>
        <div class="timing-details">
          <div class="timing-detail-row">
            <span class="timing-phase dns">DNS Lookup:</span>
            <span class="timing-value">${Math.round(domainLookup)} ms</span>
            <span class="timing-range">(${Math.round(resource.domainLookupStart)} - ${Math.round(resource.domainLookupEnd)})</span>
          </div>
          <div class="timing-detail-row">
            <span class="timing-phase connect">Connect:</span>
            <span class="timing-value">${Math.round(connect)} ms</span>
            <span class="timing-range">(${Math.round(resource.connectStart)} - ${Math.round(resource.connectEnd)})</span>
          </div>
          ${secureConnection > 0 ? `
            <div class="timing-detail-row">
              <span class="timing-phase ssl">SSL/TLS:</span>
              <span class="timing-value">${Math.round(secureConnection)} ms</span>
              <span class="timing-range">(${Math.round(resource.secureConnectionStart)} - ${Math.round(resource.connectEnd)})</span>
            </div>
          ` : ''}
          <div class="timing-detail-row">
            <span class="timing-phase request">Request:</span>
            <span class="timing-value">${Math.round(request)} ms</span>
            <span class="timing-range">(${Math.round(resource.requestStart)} - ${Math.round(resource.responseStart)})</span>
          </div>
          <div class="timing-detail-row">
            <span class="timing-phase response">Response:</span>
            <span class="timing-value">${Math.round(response)} ms</span>
            <span class="timing-range">(${Math.round(resource.responseStart)} - ${Math.round(resource.responseEnd)})</span>
          </div>
          <div class="timing-detail-row total">
            <span class="timing-phase">Total:</span>
            <span class="timing-value">${Math.round(totalDuration)} ms</span>
          </div>
        </div>
      </div>
    `
  }

  private attachEventListeners(): void {
    const headers = this.container.querySelectorAll('.resource-header')
    
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const index = parseInt(header.getAttribute('data-index') || '0')
        
        if (this.expandedItems.has(index)) {
          this.expandedItems.delete(index)
        } else {
          this.expandedItems.add(index)
        }
        
        this.render()
      })
    })
  }

  private getFilename(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const filename = pathname.split('/').pop() || pathname
      return filename || url
    } catch {
      return url
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

export default Resources