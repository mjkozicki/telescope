import { FileManifest } from "@/types/single/FileManifest"
import { ConsoleMessage } from "@/types/single/ConsoleMessage"

export class Console {
  private container: HTMLElement
  private messages: ConsoleMessage[] = []
  private consolePath: string

  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.consolePath = fileManifest?.console || ''
  }

  async loadMessages(): Promise<void> {
    try {
      const response = await fetch(`${this.consolePath}`)
      this.messages = await response.json()
    } catch (error) {
      console.error('Failed to load console messages:', error)
    }
  }

  render(): void {
    if (this.messages.length === 0) {
      this.container.innerHTML = '<p class="no-messages">No console messages</p>'
      return
    }

    this.container.innerHTML = `
      <div class="console-container">
        <div class="console-header">
          <h2>Console Messages</h2>
          <span class="message-count">${this.messages.length} messages</span>
        </div>
        <div class="console-table-wrapper">
          <table class="console-table">
            <thead>
              <tr>
                <th class="col-type">Level</th>
                <th class="col-message">Message</th>
                <th class="col-location">Location</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderMessages()}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  private renderMessages(): string {
    return this.messages
      .map(
        (msg) => `
        <tr class="console-row level-${msg.type}">
          <td class="col-type">
            <span class="level-badge">${msg.type}</span>
          </td>
          <td class="col-message">${this.escapeHtml(msg.text)}</td>
          <td class="col-location">
            <div class="location-info">
              <span class="location-url">${this.escapeHtml(msg.location.url)}</span>
              <span class="location-coords">${msg.location.lineNumber}:${msg.location.columnNumber}</span>
            </div>
          </td>
        </tr>
      `
      )
      .join('')
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

export default Console