import type { FileManifest } from '@/types/single/FileManifest'
import type { Resource } from '@/types/single/Resource'
import type { ChartData } from '@/types/single/ChartData'

export class Bottlenecks {
  private container: HTMLElement
  private resources: Resource[] = []
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
      this.container.innerHTML = '<p>No resource data available</p>'
      return
    }

    this.container.innerHTML = `
      <div class="bottlenecks-container">
        <div class="tables-container">
          <p class="blocking-note">
            <strong>Note:</strong> Red table rows indicate blocking resources that delay page rendering.
          </p>
          <div class="tables-section">
            <div class="table-container">
              <h3>Top 5 Longest Response Times</h3>
              ${this.renderTopResponseTimes()}
            </div>
            
            <div class="table-container">
              <h3>Top 5 Largest Files</h3>
              ${this.renderTopLargestFiles()}
            </div>
          </div>
        </div>

        <div class="blocking-resources-section">
          <h3>All Render-Blocking Resources</h3>
          ${this.renderBlockingResources()}
        </div>
        
        <div class="charts-grid">
          <div class="chart-card">
            ${this.renderChart('File Types', this.getFileTypeData())}
            </div>
            <div class="chart-card">
            ${this.renderChart('Transfer Size', this.getTransferSizeData())}
          </div>
          <div class="chart-card">
            ${this.renderChart('Compression (Count)', this.getCompressionData())}
          </div>
          <div class="chart-card">
            ${this.renderChart('Compression (Size)', this.getCompressionSizeData())}
          </div>
          <div class="chart-card">
            ${this.renderChart('HTTP Versions', this.getHttpVersionData())}
          </div>
        </div>
      </div>
    `
  }

  private getFileTypeData(): ChartData[] {
    const typeCounts = new Map<string, number>()

    this.resources.forEach(r => {
      const type = r.initiatorType || 'other'
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1)
    })

    const colors = ['#ff6b35', '#280a70', '#e0e0e0', '#ff8c5a', '#4a1a9e', '#ffa680', '#6b3db8']
    return Array.from(typeCounts.entries())
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
  }

  private getTransferSizeData(): ChartData[] {
    const typeSizes = new Map<string, number>()

    this.resources.forEach(r => {
      const type = r.initiatorType || 'other'
      typeSizes.set(type, (typeSizes.get(type) || 0) + r.transferSize)
    })

    const colors = ['#ff6b35', '#280a70', '#e0e0e0', '#ff8c5a', '#4a1a9e', '#ffa680', '#6b3db8']
    return Array.from(typeSizes.entries())
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
  }

  private getCompressionData(): ChartData[] {
    const compressionCounts = new Map<string, number>()

    this.resources.forEach(r => {
      const isCompressed = r.encodedBodySize < r.decodedBodySize
      const type = isCompressed ? 'Compressed' : 'Uncompressed'
      compressionCounts.set(type, (compressionCounts.get(type) || 0) + 1)
    })

    return [
      { label: 'Compressed', value: compressionCounts.get('Compressed') || 0, color: '#280a70' },
      { label: 'Uncompressed', value: compressionCounts.get('Uncompressed') || 0, color: '#ff6b35' }
    ]
  }

  private getCompressionSizeData(): ChartData[] {
    const compressionSizes = new Map<string, number>()

    this.resources.forEach(r => {
      const isCompressed = r.encodedBodySize < r.decodedBodySize
      const type = isCompressed ? 'Compressed' : 'Uncompressed'
      compressionSizes.set(type, (compressionSizes.get(type) || 0) + r.transferSize)
    })

    return [
      { label: 'Compressed', value: compressionSizes.get('Compressed') || 0, color: '#280a70' },
      { label: 'Uncompressed', value: compressionSizes.get('Uncompressed') || 0, color: '#ff6b35' }
    ]
  }

  private getHttpVersionData(): ChartData[] {
    const versionCounts = new Map<string, number>()

    this.resources.forEach(r => {
      const version = r.nextHopProtocol || 'unknown'
      versionCounts.set(version, (versionCounts.get(version) || 0) + 1)
    })

    const colors = ['#ff6b35', '#280a70', '#e0e0e0', '#ff8c5a']
    return Array.from(versionCounts.entries())
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
  }

  private renderChart(title: string, data: ChartData[]): string {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return `
      <h4>${title}</h4>
      <div class="chart-wrapper">
        <div class="pie-chart">
          ${this.renderPieChart(data, total)}
        </div>
        <div class="chart-legend">
          ${data.map(item => `
            <div class="legend-item">
              <span class="legend-color" style="background: ${item.color}"></span>
              <span class="legend-label">${item.label}</span>
              <span class="legend-value">${this.formatValue(item.value, title, total)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  private renderPieChart(data: ChartData[], total: number): string {
    let currentPercent = 0
    const gradientStops: string[] = []

    data.forEach(item => {
      const percentage = (item.value / total) * 100
      const startPercent = currentPercent
      const endPercent = currentPercent + percentage

      gradientStops.push(`${item.color} ${startPercent}% ${endPercent}%`)
      currentPercent = endPercent
    })

    const gradient = gradientStops.join(', ')

    return `
      <div class="pie-visual" style="background: conic-gradient(${gradient})"></div>
    `
  }

  private formatValue(value: number, chartType: string, total: number): string {
    const percentage = ((value / total) * 100).toFixed(1)

    if (chartType === 'Transfer Size' || chartType === 'Compression (Size)') {
      return `${this.formatBytes(value)} (${percentage}%)`
    }
    return `${value} (${percentage}%)`
  }

  private renderTopResponseTimes(): string {
    const sorted = [...this.resources]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)

    return `
      <table class="bottleneck-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Type</th>
            <th>Response Time</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(r => `
            <tr class="${!this.isCompressed(r) ? 'uncompressed' : ''}">
              <td class="filename">
               ${this.renderIndicator(this.isThirdParty(r.name))}
               ${this.getFilename(r.name)}
              </td>
              <td><span class="type-badge">${r.initiatorType}</span></td>
              <td class="metric">${Math.round(r.duration)} ms</td>
              <td class="metric">${this.formatBytes(r.transferSize)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

  private renderTopLargestFiles(): string {
    const sorted = [...this.resources]
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 5)

    return `
      <table class="bottleneck-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Type</th>
            <th>Size</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(r => `
            <tr class="${!this.isCompressed(r) ? 'uncompressed' : ''}">
              <td class="filename">
               ${this.renderIndicator(this.isThirdParty(r.name))}
               ${this.getFilename(r.name)}
              </td>
              <td><span class="type-badge">${r.initiatorType}</span></td>
              <td class="metric">${this.formatBytes(r.transferSize)}</td>
              <td class="metric">${Math.round(r.duration)} ms</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
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

  private isThirdParty(url: string): boolean {
    try {
      const resourceUrl = new URL(url)
      // Assume first resource is the main page - could be improved by passing the main domain
      const mainDomain = 'www.iana.org'
      return resourceUrl.hostname !== mainDomain
    } catch {
      return false
    }
  }

  private isCompressed(resource: Resource): boolean {
    return resource.encodedBodySize < resource.decodedBodySize
  }

  private renderIndicator(isTrue: boolean): string {
    if (isTrue) {
      return '<span class="indicator-icon yes" title="3rd Party">✓</span>'
    }
    return '<span class="indicator-icon no" title="1st Party">✗</span>'
  }

  private renderBlockingResources(): string {
    const blockingResources = this.resources.filter(
      r => r.renderBlockingStatus === 'blocking'
    )

    if (blockingResources.length === 0) {
      return '<p class="no-blocking">No render-blocking resources found</p>'
    }

    return `
      <div class="blocking-count">
        Found ${blockingResources.length} render-blocking resource${blockingResources.length !== 1 ? 's' : ''}
      </div>
      <table class="bottleneck-table blocking-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Type</th>
            <th>Response Time</th>
            <th>Size</th>
            <th>Protocol</th>
          </tr>
        </thead>
        <tbody>
          ${blockingResources.map(r => `
            <tr class="blocking-row">
              <td class="filename" title="${this.escapeHtml(r.name)}">
                ${this.renderIndicator(this.isThirdParty(r.name))}
                ${this.getFilename(r.name)}
              </td>
              <td><span class="type-badge">${r.initiatorType}</span></td>
              <td class="metric">${Math.round(r.duration)} ms</td>
              <td class="metric">${this.formatBytes(r.transferSize)}</td>
              <td class="protocol">${r.nextHopProtocol || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}

export default Bottlenecks