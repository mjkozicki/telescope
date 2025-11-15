export class Simple {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  render(): void {
    this.container.innerHTML = `
      <div class="simple-container">
        ${this.renderCommonNav()}
        <div class="simple-card">
          <form class="simple-form" id="simple-form">
            <h1>Performance Test</h1>
            <p class="simple-subtitle">Test your website's performance</p>
            <div class="form-group">
              <label for="url" class="form-label">
                Website URL
                <span class="required">*</span>
              </label>
              <input
                type="text"
                id="url"
                name="url"
                class="form-input"
                placeholder="https://example.com"
                required
                autocomplete="url"
              />
            </div>

            <div class="form-group">
              <label for="browser" class="form-label">
                Browser
              </label>
              <select id="browser" name="browser" class="form-select">
                <option value="chrome">Chrome</option>
                <option value="chrome-beta">Chrome Beta</option>
                <option value="canary">Chrome Canary</option>
                <option value="edge">Edge</option>
                <option value="safari">Safari</option>
                <option value="firefox">Firefox</option>
              </select>
            </div>

            <button type="submit" class="form-submit">
              <span class="submit-icon">🚀</span>
              <span class="submit-text">Run Test</span>
            </button>
          </form>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  private renderCommonNav(): string {
    return `
      <nav class="common-nav">
        <a class="nav-link" disabled>Simple</a>
        <a href="/advanced" class="nav-link">Advanced</a>
        <a href="/results" class="nav-link">Results</a>
        <a href="/upload" class="nav-link">Upload</a>
      </nav>
    `
  }

  private attachEventListeners(): void {
    const form = this.container.querySelector('#simple-form') as HTMLFormElement
    
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const formData = new FormData(form)
        let url = formData.get('url') as string
        const browser = formData.get('browser') as string

        if (!url.startsWith('http') && !url.startsWith('https')) {
          url = `https://${url}`
        }

        // Validate URL
        try {
          new URL(url)
        } catch {
          alert('Please enter a valid URL.')
          return
        }

        // Prepare test data
        const testData = {
          url,
          browser,
          testType: 'simple'
        }

        // Submit test to API
        try {
          const response = await fetch('/api/submit-test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to submit test')
          }

          const result = await response.json()
          
          // Redirect to running page
          window.location.href = result.redirectUrl
        } catch (error) {
          console.error('Error submitting test:', error)
          alert(error instanceof Error ? error.message : 'Failed to submit test. Please try again.')
        }
      })
    }
  }
}

export default Simple

