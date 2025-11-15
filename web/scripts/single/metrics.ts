// interface NavigationTiming {
//   name: string
//   startTime: number
//   duration: number
//   fetchStart: number
//   domainLookupStart: number
//   domainLookupEnd: number
//   connectStart: number
//   secureConnectionStart: number
//   connectEnd: number
//   requestStart: number
//   responseStart: number
//   responseEnd: number
//   domInteractive: number
//   domContentLoadedEventStart: number
//   domContentLoadedEventEnd: number
//   domComplete: number
//   loadEventStart: number
//   loadEventEnd: number
//   serverTiming?: Array<{
//     name: string
//     duration: number
//     description: string
//   }>
// }

// interface PaintTiming {
//   name: string
//   startTime: number
//   duration: number
// }

// interface UserTiming {
//   name: string
//   entryType: string
//   startTime: number
//   duration: number
// }

// interface LayoutShift {
//   startTime: number
//   value: number
//   hadRecentInput: boolean
// }

// interface LargestContentfulPaint {
//   startTime: number
//   size: number
//   url: string
// }

// interface MetricsData {
//   navigationTiming: NavigationTiming
//   paintTiming: PaintTiming[]
//   userTiming: UserTiming[]
//   layoutShifts: LayoutShift[]
//   largestContentfulPaint: LargestContentfulPaint[]
//   totalBlockingTime?: number
// }

import { FileManifest } from "@/types/single/FileManifest"
import type { MetricsData, PaintTiming, LayoutShift, ServerTiming, UserTiming } from "@/types/single/MetricsData"

export class Metrics {
  private container: HTMLElement
  private metrics: MetricsData | null = null
  private metricsPath: string

  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.metricsPath = fileManifest?.metrics || ''
  }

  async loadMetrics(): Promise<void> {
    try {
      const response = await fetch(`${this.metricsPath}`)
      this.metrics = await response.json()
    } catch (error) {
      console.error('Failed to load metrics:', error)
    }
  }

  render(): void {
    if (!this.metrics) {
      this.container.innerHTML = '<p>No metrics data available</p>'
      return
    }

    this.container.innerHTML = `
      <div class="metrics-container">
        ${this.renderCWVSection()}
        ${this.renderNavigationTimings()}
        ${this.renderPerformanceMetrics()}
        ${this.renderServerTimings()}
        ${this.renderUserTimings()}
      </div>
    `
  }

  private renderCWVSection(): string {
    const lcp = this.metrics!.largestContentfulPaint.length > 0
      ? this.metrics!.largestContentfulPaint[this.metrics!.largestContentfulPaint.length - 1].startTime
      : 0

    const fcp = this.metrics!.paintTiming.find((p: PaintTiming) => p.name === 'first-contentful-paint')?.startTime || 0

    const cls = this.metrics!.layoutShifts
      .filter((shift: LayoutShift) => !shift.hadRecentInput)
      .reduce((sum: number, shift: LayoutShift) => sum + shift.value, 0)

    const ttfb = this.metrics!.navigationTiming.responseStart - this.metrics!.navigationTiming.fetchStart

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
      <div class="metrics-section">
        <h2>Core Web Vitals & Duration</h2>
        <div class="cwv-grid">
          <div class="metric-card ${getVitalClass('lcp', lcp)}">
            <div class="metric-label">LCP</div>
            <div class="metric-value">${Math.round(lcp)} ms</div>
            <div class="metric-description">Largest Contentful Paint</div>
          </div>
          <div class="metric-card ${getVitalClass('fcp', fcp)}">
            <div class="metric-label">FCP</div>
            <div class="metric-value">${Math.round(fcp)} ms</div>
            <div class="metric-description">First Contentful Paint</div>
          </div>
          <div class="metric-card ${getVitalClass('cls', cls)}">
            <div class="metric-label">CLS</div>
            <div class="metric-value">${cls.toFixed(3)}</div>
            <div class="metric-description">Cumulative Layout Shift</div>
          </div>
          <div class="metric-card ${getVitalClass('ttfb', ttfb)}">
            <div class="metric-label">TTFB</div>
            <div class="metric-value">${Math.round(ttfb)} ms</div>
            <div class="metric-description">Time to First Byte</div>
          </div>
          <div class="metric-card neutral">
            <div class="metric-label">Duration</div>
            <div class="metric-value">${Math.round(this.metrics!.navigationTiming.duration)} ms</div>
            <div class="metric-description">Total Page Load Time</div>
          </div>
        </div>
      </div>
    `
  }

  private renderNavigationTimings(): string {
    const nav = this.metrics!.navigationTiming
    const totalDuration = nav.duration

    const phases = [
      { name: 'DNS Lookup', start: nav.domainLookupStart, end: nav.domainLookupEnd, color: 'dns' },
      { name: 'Connect', start: nav.connectStart, end: nav.connectEnd, color: 'connect' },
      { name: 'Request', start: nav.requestStart, end: nav.responseStart, color: 'request' },
      { name: 'Response', start: nav.responseStart, end: nav.responseEnd, color: 'response' },
      { name: 'DOM Processing', start: nav.responseEnd, end: nav.domInteractive, color: 'dom' },
      { name: 'DOM Complete', start: nav.domInteractive, end: nav.domComplete, color: 'dom-complete' },
      { name: 'Load Event', start: nav.loadEventStart, end: nav.loadEventEnd, color: 'load' }
    ]

    const getPercentage = (start: number, end: number) => {
      if (end <= start || totalDuration === 0) return 0
      return ((end - start) / totalDuration) * 100
    }

    const getOffset = (start: number) => {
      if (totalDuration === 0) return 0
      return (start / totalDuration) * 100
    }

    return `
      <div class="metrics-section">
        <h2>Navigation Timings</h2>
        <div class="navigation-timings-bar">
          ${phases.map(phase => {
      const width = getPercentage(phase.start, phase.end)
      const offset = getOffset(phase.start)
      if (width <= 0) return ''
      return `
              <div 
                class="timing-phase ${phase.color}" 
                style="width: ${width}%; left: ${offset}%"
                title="${phase.name}: ${Math.round(phase.end - phase.start)} ms"
              ></div>
            `
    }).join('')}
        </div>
        <div class="navigation-timings-details">
          <div class="timing-detail">
            <div class="performance-box performance-dns"></div>
            <span class="timing-name">DNS Lookup:</span>
            <span class="timing-value">${Math.round(nav.domainLookupEnd - nav.domainLookupStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-connect"></div>
            <span class="timing-name">Connect:</span>
            <span class="timing-value">${Math.round(nav.connectEnd - nav.connectStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-request"></div>
            <span class="timing-name">Request:</span>
            <span class="timing-value">${Math.round(nav.responseStart - nav.requestStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-response"></div>
            <span class="timing-name">Response:</span>
            <span class="timing-value">${Math.round(nav.responseEnd - nav.responseStart)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-dom"></div>
            <span class="timing-name">DOM Interactive:</span>
            <span class="timing-value">${Math.round(nav.domInteractive)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-dom-complete"></div>
            <span class="timing-name">DOM Complete:</span>
            <span class="timing-value">${Math.round(nav.domComplete)} ms</span>
          </div>
          <div class="timing-detail">
            <div class="performance-box performance-load"></div>
            <span class="timing-name">Load Event End:</span>
            <span class="timing-value">${Math.round(nav.loadEventEnd)} ms</span>
          </div>
        </div>
      </div>
    `
  }

  private renderPerformanceMetrics(): string {
    const nav = this.metrics!.navigationTiming
    const ttfb = nav.responseStart - nav.fetchStart
    const fp = this.metrics!.paintTiming.find((p: PaintTiming) => p.name === 'first-paint')?.startTime || 0
    const fcp = this.metrics!.paintTiming.find((p: PaintTiming) => p.name === 'first-contentful-paint')?.startTime || 0
    const lcp = this.metrics!.largestContentfulPaint.length > 0
      ? this.metrics!.largestContentfulPaint[this.metrics!.largestContentfulPaint.length - 1].startTime
      : 0
    const layoutShiftCount = this.metrics!.layoutShifts.length
    const tbt = this.metrics!.totalBlockingTime || 0

    return `
      <div class="metrics-section">
        <h2>Performance Metrics</h2>
        <div class="performance-metrics-grid">
          <div class="performance-metric">
            <span class="performance-label">Total Blocking Time:</span>
            <span class="performance-value">${Math.round(tbt)} ms</span>
          </div>
          <div class="performance-metric">
            <span class="performance-label">Time to First Byte:</span>
            <span class="performance-value">${Math.round(ttfb)} ms</span>
          </div>
          <div class="performance-metric">
            <span class="performance-label">First Paint:</span>
            <span class="performance-value">${Math.round(fp)} ms</span>
          </div>
          <div class="performance-metric">
            <span class="performance-label">First Contentful Paint:</span>
            <span class="performance-value">${Math.round(fcp)} ms</span>
          </div>
          <div class="performance-metric">
            <span class="performance-label">Largest Contentful Paint:</span>
            <span class="performance-value">${Math.round(lcp)} ms</span>
          </div>
          <div class="performance-metric">
            <span class="performance-label">Layout Shifts:</span>
            <span class="performance-value">${layoutShiftCount}</span>
          </div>
        </div>
      </div>
    `
  }

  private renderServerTimings(): string {
    const serverTimings = this.metrics!.navigationTiming.serverTiming || []

    if (serverTimings.length === 0) {
      return `
        <div class="metrics-section">
          <h2>Server Timings</h2>
          <p class="no-data">No server timing data available</p>
        </div>
      `
    }

    return `
      <div class="metrics-section">
        <h2>Server Timings</h2>
        <div class="server-timings-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${serverTimings.map((timing: ServerTiming) => `
                <tr>
                  <td>${this.escapeHtml(timing.name)}</td>
                  <td>${Math.round(timing.duration)} ms</td>
                  <td>${this.escapeHtml(timing.description || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  private renderUserTimings(): string {
    const userTimings = this.metrics!.userTiming || []

    if (userTimings.length === 0) {
      return `
        <div class="metrics-section">
          <h2>User Timings</h2>
          <p class="no-data">No user timing data available</p>
        </div>
      `
    }

    return `
      <div class="metrics-section">
        <h2>User Timings</h2>
        <div class="user-timings-table">
          <table>
            <thead>
              <tr>
                <th style="width: 10%;min-width: 100px;">Type</th>
                <th style="width: 80%;">Name</th>
                <th style="width: 10%;min-width: 100px;">Value</th>
              </tr>
            </thead>
            <tbody>
              ${userTimings.map((timing: UserTiming) => `
                <tr>
                  <td><span class="timing-type-badge">${timing.entryType}</span></td>
                  <td>${this.escapeHtml(timing.name)}</td>
                  <td>
                  ${timing.entryType === 'mark' ?
                    Math.round(timing.startTime) + ' ms' :
                    Math.round(timing.duration) + ' ms'}
                    </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

export default Metrics
