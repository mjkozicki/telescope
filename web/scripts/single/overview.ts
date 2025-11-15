import type { FileManifest } from '@/types/single/FileManifest'
import type { ConfigData } from '@/types/single/ConfigData'
import type { MetricsData } from '@/types/single/MetricsData'
import type { WebVitals } from '@/types/single/WebVitals'

export class Overview {
  private container: HTMLElement
  private config: ConfigData | null = null
  private metrics: MetricsData | null = null
  private webVitals: WebVitals | null = null
  private configPath: string
  private metricsPath: string
  private screenshotPath: string
  private enginePath: string

  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.configPath = fileManifest?.config || ''
    this.metricsPath = fileManifest?.metrics || ''
    this.screenshotPath = fileManifest?.screenshot || ''
    this.enginePath = fileManifest?.engine || ''
  }

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch(`${this.configPath}`)
      this.config = await response.json()

      // Also load metrics
      await this.loadMetrics()
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  async loadMetrics(): Promise<void> {
    try {
      const response = await fetch(`${this.metricsPath}`)
      this.metrics = await response.json()
      this.webVitals = this.calculateWebVitals()
    } catch (error) {
      console.error('Failed to load metrics:', error)
    }
  }

  private calculateWebVitals(): WebVitals | null {
    if (!this.metrics) return null

    // LCP: Last largest-contentful-paint entry
    const lcp = this.metrics.largestContentfulPaint.length > 0
      ? this.metrics.largestContentfulPaint[this.metrics.largestContentfulPaint.length - 1].startTime
      : 0

    // FCP: First-contentful-paint
    const fcpEntry = this.metrics.paintTiming.find(p => p.name === 'first-contentful-paint')
    const fcp = fcpEntry ? fcpEntry.startTime : 0

    // CLS: Sum of layout shifts without recent input
    const cls = this.metrics.layoutShifts
      .filter(shift => !shift.hadRecentInput)
      .reduce((sum, shift) => sum + shift.value, 0)

    // TTFB: Time to First Byte
    const ttfb = this.metrics.navigationTiming.responseStart

    return {
      lcp,
      fcp,
      cls,
      ttfb,
      transferSize: this.metrics.navigationTiming.transferSize,
      responseEnd: this.metrics.navigationTiming.responseEnd
    }
  }

  render(): void {
    if (!this.config) {
      this.container.innerHTML = '<p>Loading configuration...</p>'
      return
    }

    const { engine, channel } = this.config.browserConfig

    this.container.innerHTML = `
      <div class="overview-container">
        <div class="overview-header">
          <div class="overview-info">
            <div class="info-row">
              <span class="label">URL:</span>
              <a href="${this.config.url}" target="_blank" class="url-link">${this.config.url}</a>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">${new Date(this.config.date).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Browser:</span>
              <span class="value">${engine} (${channel})</span>
              <img src="${this.enginePath}" alt="${engine}" class="engine-icon" />
            </div>
            ${this.renderWebVitals()}
          </div>
          <div class="overview-screenshot">
            <img src="${this.screenshotPath}" alt="Page Screenshot" class="screenshot" />
          </div>
        </div>
      </div>
    `

  }

  private renderWebVitals(): string {
    if (!this.webVitals) return ''

    const formatBytes = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const formatMs = (ms: number): string => {
      return `${Math.round(ms)} ms`
    }

    const getVitalClass = (metric: string, value: number): string => {
      const thresholds: Record<string, { good: number; needsImprovement: number }> = {
        lcp: { good: 2500, needsImprovement: 4000 },
        fcp: { good: 1800, needsImprovement: 3000 },
        cls: { good: 0.1, needsImprovement: 0.25 },
        ttfb: { good: 800, needsImprovement: 1800 }
      }

      const threshold = thresholds[metric]
      if (!threshold) return 'neutral'

      if (value <= threshold.good) return 'good'
      if (value <= threshold.needsImprovement) return 'needs-improvement'
      return 'poor'
    }

    return `
      <div class="web-vitals-card">
        <div class="vitals-grid">
          <div class="vital-item ${getVitalClass('lcp', this.webVitals.lcp)}">
            <span class="vital-label">LCP</span>
            <span class="vital-value">${formatMs(this.webVitals.lcp)}</span>
          </div>
          <div class="vital-item ${getVitalClass('fcp', this.webVitals.fcp)}">
            <span class="vital-label">FCP</span>
            <span class="vital-value">${formatMs(this.webVitals.fcp)}</span>
          </div>
          <div class="vital-item ${getVitalClass('cls', this.webVitals.cls)}">
            <span class="vital-label">CLS</span>
            <span class="vital-value">${this.webVitals.cls.toFixed(3)}</span>
          </div>
          <div class="vital-item ${getVitalClass('ttfb', this.webVitals.ttfb)}">
            <span class="vital-label">TTFB</span>
            <span class="vital-value">${formatMs(this.webVitals.ttfb)}</span>
          </div>
          <div class="vital-item neutral">
            <span class="vital-label">Transfer</span>
            <span class="vital-value">${formatBytes(this.webVitals.transferSize)}</span>
          </div>
          <div class="vital-item neutral">
            <span class="vital-label">Response</span>
            <span class="vital-value">${formatMs(this.webVitals.responseEnd)}</span>
          </div>
        </div>
      </div>
    `
  }
}

export default Overview