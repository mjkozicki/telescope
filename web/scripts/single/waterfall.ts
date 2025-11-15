import type { FileManifest } from '../../types/single/FileManifest'

export class Waterfall {
  private container: HTMLElement
  private waterfall: any = null
  private resultsPath: string

  constructor(container: HTMLElement, basePath: string, testId: string, _fileManifest: FileManifest | null = null) {
    this.container = container
    this.resultsPath = `${basePath}/${testId}`
  }

  async loadWaterfall(): Promise<void> {
    try {
      const response = await fetch(`${this.resultsPath}/waterfall.json`)
      if (response.ok) {
        this.waterfall = await response.json()
      }
    } catch (error) {
      console.error('Failed to load waterfall:', error)
    }
  }

  render(): void {
    if (!this.waterfall) {
      this.container.innerHTML = '<p>No waterfall data available</p>'
      return
    }

    this.container.innerHTML = `
      <div id="waterfall">
        <p>Waterfall visualization will be rendered here</p>
        <pre>${JSON.stringify(this.waterfall, null, 2)}</pre>
      </div>
    `
  }
}

export default Waterfall