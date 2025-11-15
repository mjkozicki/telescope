import { FileManifest } from "@/types/single/FileManifest"
import { TestConfig } from "@/types/single/TestConfig"

export class Config {
  private container: HTMLElement
  private config: TestConfig | null = null
  private configPath: string

  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.configPath = fileManifest?.config || ''
  }

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch(`${this.configPath}`)
      this.config = await response.json()
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  render(): void {
    if (!this.config) {
      this.container.innerHTML = '<p>No configuration data available</p>'
      return
    }

    const prettifiedJson = JSON.stringify(this.config, null, 2)

    this.container.innerHTML = `
      <div class="config-container">
        <p class="config-description">
          Complete test configuration and settings used for this performance test.
        </p>
        <div class="config-json-wrapper">
          <pre class="config-json"><code>${this.escapeHtml(prettifiedJson)}</code></pre>
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

export default Config
