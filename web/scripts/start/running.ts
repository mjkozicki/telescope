export class Running {
  private container: HTMLElement
  private url: string
  private browser: string

  constructor(container: HTMLElement) {
    this.container = container

    // Parse URL parameters
    const params = new URLSearchParams(window.location.search)
    this.url = params.get('url') || ''
    this.browser = params.get('browser') || 'chrome'
  }

  render(): void {
    this.container.innerHTML = `
      <div class="running-container">
        <div class="running-card">
          <div class="running-header">
            <h1>Running Performance Test</h1>
            <p class="running-subtitle">Please wait while we analyze your website...</p>
          </div>

          <div class="running-details">
            <div class="detail-item">
              <span class="detail-label">URL:</span>
              <span class="detail-value">${this.escapeHtml(this.url)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Browser:</span>
              <span class="detail-value">${this.formatBrowser(this.browser)}</span>
            </div>
          </div>

          <div class="running-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 5%;"></div>
            </div>
          </div>

          <div class="running-steps">
            <div class="step-item active"id="step-requested">
              <div class="step-icon">⏳</div>
              <span class="step-text">Test requested...</span>
            </div>
            <div class="step-item"  id="step-running">
              <div class="step-icon">🌐</div>
              <span class="step-text">Test running...</span>
            </div>
            <div class="step-item" id="step-saving">
              <div class="step-icon">✨</div>
              <span class="step-text">Saved results.</span>
            </div>
            <div class="step-item" id="step-failed" style="display: none;">
              <div class="step-icon">❌</div>
              <span class="step-text">Test failed.</span>
            </div>
          </div>

          <div class="running-actions">
            <a href="" class="results-link-button link-inactive" id="this-results-link">
              Test Results
            </a>
            <a href="/results" class="results-link-button">
              View Past Results
            </a>
          </div>
        </div>
      </div>
    `

    this.startProgressAnimation()
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  private formatBrowser(browser: string): string {
    const browserNames: Record<string, string> = {
      'chrome': 'Chrome',
      'chrome-beta': 'Chrome Beta',
      'canary': 'Chrome Canary',
      'edge': 'Microsoft Edge',
      'safari': 'Safari',
      'firefox': 'Firefox'
    }
    return browserNames[browser] || browser
  }

  private startProgressAnimation(): void {
    const progressFill = this.container.querySelector('.progress-fill') as HTMLElement
    const resultsLink = document.getElementById('this-results-link')!;

    let progress = 5
    let completed = false;
    const interval = 1000;
    const updateProgress = () => {
      progressFill.style.width = `${progress}%`
      if (progress >= 5 && progress < 100) {
        document.getElementById('step-requested')!.classList.add('completed')
        document.getElementById('step-running')!.classList.add('active')
      } else if (progress === 100) {
        document.getElementById('step-running')!.classList.add('completed')
        if (completed) {
          document.getElementById('step-saving')!.classList.add('completed')
          resultsLink.outerHTML = `<a href="/results/${testId}/overview" class="results-link-button">View Results</a>`
        } else {
          document.getElementById('step-failed')!.classList.add('failed')
          document.getElementById('step-saving')!.style.display = 'none';
          document.getElementById('step-failed')!.style.display = 'flex';
        }
      }

      progress++;
    }

    async function checkTestStatus() {
      try {
        const res = await fetch(`/results/${testId}/manifest.json`, { cache: 'no-store' });
        if (res.ok) {
          completed = true;
          progress = 100;
          updateProgress();
        } else if (progress < 100) {
          updateProgress();
          setTimeout(checkTestStatus, interval)
        } else if (progress == 100) {
          updateProgress();
        }
      } catch (err) {
        updateProgress();
        setTimeout(checkTestStatus, interval)
      }
    }

    const searchParams = new URLSearchParams(window.location.search)
    const testId = searchParams.get('testId')
    if (!testId) {
      alert('Test ID not found');
      window.location.href = '/';
      return
    }
    checkTestStatus()
  }
}

export default Running

