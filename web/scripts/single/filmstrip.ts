import { FileManifest } from "@/types/single/FileManifest"
import { Frame, Rect } from "@/types/single/Shapes"
import { MetricsData, LayoutShift } from "@/types/single/MetricsData"

interface LayoutShiftVisual {
  time: string
  value: string
  sources: number
  viewportWidth: number
  viewportHeight: number
  sourceVisualData: Array<{
    prevLeftPct: string
    prevTopPct: string
    prevWidthPct: string
    prevHeightPct: string
    currLeftPct: string
    currTopPct: string
    currWidthPct: string
    currHeightPct: string
  }>
}  

export class Filmstrip {
  private container: HTMLElement
  private frames: Frame[] = []
  private totalLoadTime: number = 0
  private layoutShifts: LayoutShiftVisual[] = []
  private clsValue: number = 0
  private filmstripPaths: string[]
  private metricsPath: string
  private screenshotPath: string
  
  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.filmstripPaths = fileManifest?.filmstrip || []
    this.metricsPath = fileManifest?.metrics || ''
    this.screenshotPath = fileManifest?.screenshot || ''
  }

  async loadFilmstrip(): Promise<void> {
    try {
      // Load metrics to get total load time and layout shifts
      const metricsResponse = await fetch(`${this.metricsPath}`)
      const metrics: MetricsData = await metricsResponse.json()
      this.totalLoadTime = metrics.navigationTiming.loadEventEnd

      // Process layout shifts
      this.layoutShifts = this.processLayoutShifts(metrics.layoutShifts || [])

      this.frames = this.filmstripPaths.map(file => {
        const time = parseInt(file.split('_')[1], 10) || 0
        const path = file
        return {
          filename: file,
          time,
          path: path
        }
      })

      // Sort by time
      this.frames.sort((a, b) => a.time - b.time)
    } catch (error) {
      console.error('Failed to load filmstrip:', error)
    }
  }

  private processLayoutShifts(shifts: LayoutShift[]): LayoutShiftVisual[] {
    const layoutVisualData: LayoutShiftVisual[] = []

    // Calculate total CLS value
    this.clsValue = shifts.reduce((sum, shift) => sum + (shift.value || 0), 0)

    for (const shift of shifts) {
      const sources = shift.sources || []

      // Determine viewport dimensions from the data
      let viewportWidth = 1920 // Default viewport width
      let viewportHeight = 1536 // Default viewport height

      for (const source of sources) {
        const prevRect = source.previousRect || {} as Rect
        const currRect = source.currentRect || {} as Rect
        viewportWidth = Math.max(viewportWidth, prevRect.right || 0, currRect.right || 0)
        viewportHeight = Math.max(viewportHeight, prevRect.bottom || 0, currRect.bottom || 0)
      }

      // Process each source to create visual data
      const sourceVisualData = []
      for (const source of sources) {
        const prevRect = source.previousRect || {} as Rect
        const currRect = source.currentRect || {} as Rect

        // Skip if current rect is empty (element removed)
        if ((currRect.width || 0) === 0 || (currRect.height || 0) === 0) {
          continue
        }

        // Calculate percentages for positioning
        const prevLeftPct = viewportWidth > 0 ? ((prevRect.left || 0) / viewportWidth) * 100 : 0
        const prevTopPct = viewportHeight > 0 ? ((prevRect.top || 0) / viewportHeight) * 100 : 0
        const prevWidthPct = viewportWidth > 0 ? ((prevRect.width || 0) / viewportWidth) * 100 : 0
        const prevHeightPct = viewportHeight > 0 ? ((prevRect.height || 0) / viewportHeight) * 100 : 0

        const currLeftPct = viewportWidth > 0 ? ((currRect.left || 0) / viewportWidth) * 100 : 0
        const currTopPct = viewportHeight > 0 ? ((currRect.top || 0) / viewportHeight) * 100 : 0
        const currWidthPct = viewportWidth > 0 ? ((currRect.width || 0) / viewportWidth) * 100 : 0
        const currHeightPct = viewportHeight > 0 ? ((currRect.height || 0) / viewportHeight) * 100 : 0

        sourceVisualData.push({
          prevLeftPct: prevLeftPct.toFixed(2),
          prevTopPct: prevTopPct.toFixed(2),
          prevWidthPct: prevWidthPct.toFixed(2),
          prevHeightPct: prevHeightPct.toFixed(2),
          currLeftPct: currLeftPct.toFixed(2),
          currTopPct: currTopPct.toFixed(2),
          currWidthPct: currWidthPct.toFixed(2),
          currHeightPct: currHeightPct.toFixed(2)
        })
      }

      if (sourceVisualData.length > 0) {
        layoutVisualData.push({
          time: shift.startTime.toFixed(1),
          value: shift.value.toFixed(6),
          sources: sourceVisualData.length,
          viewportWidth,
          viewportHeight,
          sourceVisualData
        })
      }
    }

    return layoutVisualData
  }

  render(): void {
    if (this.frames.length === 0) {
      this.container.innerHTML = '<p>No filmstrip frames available</p>'
      return
    }

    this.container.innerHTML = `
      <div class="filmstrip-container">        
        <div class="filmstrip-scroll">
          <div class="filmstrip-frames">
            ${this.frames.map(frame => this.renderFrame(frame)).join('')}
            ${this.renderFinalFrame()}
          </div>
        </div>

        ${this.layoutShifts.length > 0 ? this.renderLayoutShifts() : ''}
      </div>
    `
  }

  private renderLayoutShifts(): string {
    const getClsClass = (cls: number): string => {
      if (cls <= 0.1) return 'good'
      if (cls <= 0.25) return 'needs-improvement'
      return 'poor'
    }

    return `
      <div class="layout-shifts-section">
        <div class="layout-shifts-header">
          <h3>Layout Shifts</h3>
          <div class="cls-badge ${getClsClass(this.clsValue)}">
            <span class="cls-label">CLS</span>
            <span class="cls-value">${this.clsValue.toFixed(3)}</span>
          </div>
        </div>
        <p class="layout-shifts-description">
          Visual representation of Cumulative Layout Shift (CLS). 
          <span class="legend-blue">Blue</span> shows previous position, 
          <span class="legend-green">green</span> shows current position.
        </p>
        <div class="layout-shifts-timeline">
          ${this.layoutShifts.map(shift => this.renderLayoutShift(shift)).join('')}
        </div>
      </div>
    `
  }

  private renderLayoutShift(shift: LayoutShiftVisual): string {
    const aspectRatio = shift.viewportHeight / shift.viewportWidth

    return `
      <div class="layout-shift-item">
        <div class="shift-header">
          <div class="shift-time">${shift.time} ms</div>
          <div class="shift-value">
            Score: <span class="value-number">${shift.value}</span>
          </div>
          <div class="shift-sources">${shift.sources} element${shift.sources !== 1 ? 's' : ''}</div>
        </div>
        <div class="shift-viewport" style="padding-bottom: ${(aspectRatio * 100).toFixed(2)}%;">
          ${shift.sourceVisualData.map((source: {
            prevLeftPct: string
            prevTopPct: string
            prevWidthPct: string
            prevHeightPct: string
            currLeftPct: string
            currTopPct: string
            currWidthPct: string
            currHeightPct: string
          }) => this.renderShiftSource(source)).join('')}
        </div>
      </div>
    `
  }

  private renderShiftSource(source: {
    prevLeftPct: string
    prevTopPct: string
    prevWidthPct: string
    prevHeightPct: string
    currLeftPct: string
    currTopPct: string
    currWidthPct: string
    currHeightPct: string
  }): string {
    return `
      <div 
        class="shift-rect prev-rect" 
        style="left: ${source.prevLeftPct}%; top: ${source.prevTopPct}%; width: ${source.prevWidthPct}%; height: ${source.prevHeightPct}%;"
      ></div>
      <div 
        class="shift-rect curr-rect" 
        style="left: ${source.currLeftPct}%; top: ${source.currTopPct}%; width: ${source.currWidthPct}%; height: ${source.currHeightPct}%;"
      ></div>
    `
  }

  private renderFrame(frame: Frame): string {
    return `
      <div class="filmstrip-frame">
        <div class="frame-image-wrapper">
          <img 
            src="${frame.path}" 
            alt="Frame at ${frame.time}ms"
            class="frame-image"
            loading="lazy"
          >
        </div>
        <div class="frame-time">${frame.time} ms</div>
      </div>
    `
  }

  private renderFinalFrame(): string {
    const screenshotPath = `${this.screenshotPath}`

    return `
      <div class="filmstrip-frame final-frame">
        <div class="frame-image-wrapper">
          <img 
            src="${screenshotPath}" 
            alt="Final screenshot at ${this.totalLoadTime}ms"
            class="frame-image"
            loading="lazy"
          >
        </div>
        <div class="frame-time final-time">${this.totalLoadTime} ms</div>
      </div>
    `
  }
}

export default Filmstrip
