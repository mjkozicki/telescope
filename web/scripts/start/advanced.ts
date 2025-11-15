export class Advanced {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  render(): void {
    this.container.innerHTML = `
    <div class="advanced-container">
        ${this.renderCommonNav()}
        <form class="advanced-form" id="advanced-form">
            <h1>Advanced Performance Test</h1>
            <p class="advanced-subtitle">Configure detailed test parameters</p>
            <div class="form-group">
            <label for="url" class="form-label">
                Website URL
                <span class="required">*</span>
            </label>
            <input type="text" id="url" name="url" class="form-input" placeholder="https://example.com" required
                autocomplete="url" />
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

        <!-- Basic Settings -->
        <div class="form-section" data-section="basic">
        <button type="button" class="section-header" data-toggle="basic">
            <h2 class="section-title">Basic Settings</h2>
            <span class="section-icon">+</span>
        </button>

        <div class="section-content" data-content="basic">
            <div class="form-group">

            <div class="form-row">
                <div class="form-group">
                <label for="width" class="form-label">Viewport Width (px)</label>
                <input type="number" id="width" name="width" class="form-input" placeholder="1366" value="1366" min="320" />
                </div>

                <div class="form-group">
                <label for="height" class="form-label">Viewport Height (px)</label>
                <input type="number" id="height" name="height" class="form-input" placeholder="768" value="768" min="200" />
                </div>
            </div>

            <div class="form-group">
                <label for="timeout" class="form-label">Timeout (ms)</label>
                <input type="number" id="timeout" name="timeout" class="form-input" placeholder="30000" value="30000"
                min="1000" />
            </div>
            </div>
            </div>
        </div>

        <!-- Network Settings -->
        <div class="form-section" data-section="network">
            <button type="button" class="section-header" data-toggle="network">
            <h2 class="section-title">Network Settings</h2>
            <span class="section-icon">+</span>
            </button>

            <div class="section-content" data-content="network">
            <div class="form-group">
                <label for="connectionType" class="form-label">Connection Type</label>
                <select id="connectionType" name="connectionType" class="form-select">
                <option value="">No Throttling</option>
                <option value="fios">FiOS</option>
                <option value="cable">Cable</option>
                <option value="dsl">DSL</option>
                <option value="4g">4G</option>
                <option value="3g">3G</option>
                <option value="3gfast">3G Fast</option>
                <option value="3gslow">3G Slow</option>
                <option value="2g">2G</option>
                </select>
            </div>

            <div class="form-group">
                <label for="blockDomains" class="form-label">Block Domains</label>
                <input type="text" id="blockDomains" name="blockDomains" class="form-input"
                placeholder="ads.example.com, analytics.example.com" />
                <span class="form-hint">Comma-separated list of domains to block</span>
            </div>

            <div class="form-group">
                <label for="block" class="form-label">Block URLs (Substring Match)</label>
                <input type="text" id="block" name="block" class="form-input" placeholder="tracking, advertisement" />
                <span class="form-hint">Comma-separated list of URL substrings to block</span>
            </div>
            </div>
        </div>

        <!-- Authentication & Headers -->
        <div class="form-section" data-section="auth">
            <button type="button" class="section-header" data-toggle="auth">
            <h2 class="section-title">Authentication & Headers</h2>
            <span class="section-icon">+</span>
            </button>

            <div class="section-content" data-content="auth">
            <div class="form-row">
                <div class="form-group">
                <label for="authUsername" class="form-label">Basic Auth Username</label>
                <input type="text" id="authUsername" name="authUsername" class="form-input" placeholder="username" />
                </div>

                <div class="form-group">
                <label for="authPassword" class="form-label">Basic Auth Password</label>
                <input type="password" id="authPassword" name="authPassword" class="form-input" placeholder="password" />
                </div>
            </div>

            <div class="form-group">
            <label for="headers" class="form-label">Custom Headers (JSON)</label>
            <textarea id="headers" name="headers" class="form-textarea"
                placeholder='{"User-Agent": "Custom Agent", "Accept-Language": "en-US"}' rows="3"></textarea>
            <span class="form-hint">Valid JSON object with header key-value pairs</span>
            </div>

            <div class="form-group">
            <label for="cookies" class="form-label">Custom Cookies (JSON)</label>
            <textarea id="cookies" name="cookies" class="form-textarea"
                placeholder='{"session": "abc123", "preference": "dark"}' rows="3"></textarea>
            <span class="form-hint">Valid JSON object with cookie key-value pairs</span>
            </div>
            </div>
        </div>

        <!-- Performance & Recording -->
        <div class="form-section" data-section="performance">
        <button type="button" class="section-header" data-toggle="performance">
            <h2 class="section-title">Performance & Recording</h2>
            <span class="section-icon">+</span>
        </button>

        <div class="section-content" data-content="performance">
            <div class="form-group">
            <label for="cpuThrottle" class="form-label">CPU Throttling Factor</label>
            <input type="number" id="cpuThrottle" name="cpuThrottle" class="form-input" placeholder="1" min="1" step="1" />
            <span class="form-hint">Slowdown multiplier (e.g., 4 = 4x slower)</span>
            </div>

            <div class="form-group">
            <label for="frameRate" class="form-label">Filmstrip Frame Rate (fps)</label>
            <input type="number" id="frameRate" name="frameRate" class="form-input" placeholder="1" value="1" min="1"
                max="60" />
            </div>
        </div>
        </div>

        <!-- Browser-Specific Settings -->
        <div class="form-section" data-section="browser">
        <button type="button" class="section-header" data-toggle="browser">
            <h2 class="section-title">Browser-Specific Settings</h2>
            <span class="section-icon">+</span>
        </button>

        <div class="section-content" data-content="browser">
            <div class="form-group">
            <label for="flags" class="form-label">Chromium Flags</label>
            <input type="text" id="flags" name="flags" class="form-input" placeholder="--disable-gpu, --no-sandbox" />
            <span class="form-hint">Comma-separated list of Chrome command-line flags</span>
            </div>

            <div class="form-group">
            <label for="firefoxPrefs" class="form-label">Firefox Preferences (JSON)</label>
            <textarea id="firefoxPrefs" name="firefoxPrefs" class="form-textarea" placeholder='{"network.trr.mode": 2}'
                rows="3"></textarea>
            <span class="form-hint">Firefox only - Valid JSON object with preference key-value pairs</span>
            </div>
        </div>
        </div>

        <!-- Additional Options -->
        <div class="form-section" data-section="options">
        <button type="button" class="section-header" data-toggle="options">
            <h2 class="section-title">Additional Options</h2>
            <span class="section-icon">+</span>
        </button>

        <div class="section-content" data-content="options">
            <div class="form-checkboxes">
            <label class="checkbox-label">
                <input type="checkbox" id="disableJS" name="disableJS" class="form-checkbox" />
                <span>Disable JavaScript</span>
            </label>

            <label class="checkbox-label">
                <input type="checkbox" id="debug" name="debug" class="form-checkbox" />
                <span>Enable Debug Output</span>
            </label>

            <label class="checkbox-label">
                <input type="checkbox" id="html" name="html" class="form-checkbox" />
                <span>Generate HTML Report</span>
            </label>

            <label class="checkbox-label">
                <input type="checkbox" id="list" name="list" class="form-checkbox" />
                <span>Generate Results List as HTML</span>
            </label>
            </div>
        </div>
        </div>

        <button type="submit" class="form-submit">
        <span class="submit-icon">🚀</span>
        <span class="submit-text">Run Advanced Test</span>
        </button>
        </form>
        </div>
    `

    this.attachEventListeners()
    this.attachToggleListeners()
  }

  private renderCommonNav(): string {
    return `
      <nav class="common-nav">
        <a href="/" class="nav-link">Simple</a>
        <a class="nav-link" disabled>Advanced</a>
        <a href="/results" class="nav-link">Results</a>
        <a href="/upload" class="nav-link">Upload</a>
      </nav>
    `
  }

  private attachToggleListeners(): void {
    const toggleButtons = this.container.querySelectorAll('.section-header')

    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = button.getAttribute('data-toggle')
        if (!sectionId) return

        const content = this.container.querySelector(`[data-content="${sectionId}"]`)
        const icon = button.querySelector('.section-icon')

        if (content && icon) {
          const isExpanded = content.classList.contains('expanded')

          if (isExpanded) {
            content.classList.remove('expanded')
            icon.textContent = '+'
          } else {
            content.classList.add('expanded')
            icon.textContent = '−'
          }
        }
      })
    })
  }

  private attachEventListeners(): void {
    const form = this.container.querySelector('#advanced-form') as HTMLFormElement

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(form)

        // Basic settings
        let url = formData.get('url') as string
        if (!url) {
          alert('Please enter a URL')
          return
        }

        if (!url.startsWith('http') && !url.startsWith('https')) {
          url = `https://${url}`
        }

        // Validate URL
        try {
          new URL(url)
        } catch {
          alert('Please enter a valid URL')
          return
        }

        // Prepare test data object
        const testData: Record<string, string | boolean> = {
          url,
          browser: formData.get('browser') as string,
          testType: 'advanced'
        }

        // Add all other parameters if they have values
        const fields = [
          'width', 'height', 'timeout', 'connectionType', 'blockDomains', 'block',
          'authUsername', 'authPassword', 'headers', 'cookies', 'cpuThrottle',
          'frameRate', 'flags', 'firefoxPrefs'
        ]

        fields.forEach(field => {
          const value = formData.get(field) as string
          if (value && value.trim()) {
            testData[field] = value.trim()
          }
        })

        // Handle checkboxes
        const checkboxes = ['disableJS', 'debug', 'html', 'list']
        checkboxes.forEach(checkbox => {
          const checked = (form.querySelector(`#${checkbox}`) as HTMLInputElement)?.checked
          if (checked) {
            testData[checkbox] = true
          }
        })

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

export default Advanced

