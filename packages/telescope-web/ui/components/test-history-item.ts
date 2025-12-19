/**
 * Test History Item Component
 * Displays a single test result in the history list
 */

export class TestHistoryItem extends HTMLElement {
  shadowRoot: ShadowRoot;
  private testData: any = null;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['test-id', 'url', 'browser', 'status', 'timestamp', 'test-data'];
  }

  connectedCallback() {
    this.parseAttributes();
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.parseAttributes();
      this.render();
    }
  }

  private parseAttributes() {
    const testDataAttr = this.getAttribute('test-data');
    if (testDataAttr) {
      try {
        this.testData = JSON.parse(testDataAttr);
      } catch (e) {
        this.testData = null;
      }
    }

    // Fallback to individual attributes
    if (!this.testData) {
      this.testData = {
        testId: this.getAttribute('test-id') || '',
        url: this.getAttribute('url') || '',
        browser: this.getAttribute('browser') || 'chrome',
        status: this.getAttribute('status') || 'unknown',
        timestamp: this.getAttribute('timestamp') || new Date().toISOString(),
        metrics: null,
      };
    }
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  }

  private getBrowserIcon(browser: string): string {
    const icons: { [key: string]: string } = {
      chrome: '🌐',
      'chrome-beta': '🌐',
      canary: '🌐',
      edge: '🔷',
      safari: '🧭',
      firefox: '🦊',
    };
    return icons[browser.toLowerCase()] || '🌐';
  }

  private getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      success: '#155724',
      completed: '#155724',
      failed: '#721c24',
      error: '#721c24',
      running: '#856404',
      pending: '#666',
    };
    return colors[status.toLowerCase()] || '#666';
  }

  private getStatusBgColor(status: string): string {
    const colors: { [key: string]: string } = {
      success: '#d4edda',
      completed: '#d4edda',
      failed: '#f8d7da',
      error: '#f8d7da',
      running: '#fff3cd',
      pending: '#f8f9fa',
    };
    return colors[status.toLowerCase()] || '#f8f9fa';
  }

  private handleViewDetails() {
    const event = new CustomEvent('view-details', {
      detail: { testId: this.testData.testId, testData: this.testData },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  private handleDownload() {
    const event = new CustomEvent('download-test', {
      detail: { testId: this.testData.testId, testData: this.testData },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.shadowRoot) return;

    const { testId, url, browser, status, timestamp, metrics } = this.testData || {};
    const statusColor = this.getStatusColor(status);
    const statusBg = this.getStatusBgColor(status);
    const browserIcon = this.getBrowserIcon(browser || 'chrome');

    const metricsHtml = metrics ? `
      <div class="metrics">
        ${metrics.loadTime ? `<div class="metric-item">
          <span class="metric-label">Load Time:</span>
          <span class="metric-value">${this.formatDuration(metrics.loadTime)}</span>
        </div>` : ''}
        ${metrics.firstContentfulPaint ? `<div class="metric-item">
          <span class="metric-label">FCP:</span>
          <span class="metric-value">${this.formatDuration(metrics.firstContentfulPaint)}</span>
        </div>` : ''}
        ${metrics.largestContentfulPaint ? `<div class="metric-item">
          <span class="metric-label">LCP:</span>
          <span class="metric-value">${this.formatDuration(metrics.largestContentfulPaint)}</span>
        </div>` : ''}
      </div>
    ` : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1rem;
        }
        .test-item {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .test-item:hover {
          box-shadow: 0 4px 12px rgba(244, 129, 32, 0.15);
          border-color: #F48120;
          transform: translateY(-2px);
        }
        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .test-info {
          flex: 1;
        }
        .test-id {
          font-size: 0.85rem;
          color: #666;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          margin-bottom: 0.25rem;
        }
        .test-url {
          font-size: 1.1rem;
          font-weight: 600;
          color: #404041;
          margin-bottom: 0.5rem;
          word-break: break-all;
        }
        .test-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .browser-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .timestamp {
          color: #999;
          font-size: 0.85rem;
        }
        .metrics {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
          flex-wrap: wrap;
        }
        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .metric-label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }
        .metric-value {
          font-size: 1rem;
          color: #F48120;
          font-weight: 600;
        }
        .test-actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-button {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          color: #404041;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .action-button:hover {
          background: #F48120;
          color: white;
          border-color: #F48120;
        }
        .action-button.primary {
          background: linear-gradient(135deg, #F48120 0%, #FAAD3F 100%);
          color: white;
          border-color: #F48120;
        }
        .action-button.primary:hover {
          box-shadow: 0 2px 8px rgba(244, 129, 32, 0.3);
        }
      </style>
      <div class="test-item">
        <div class="test-header">
          <div class="test-info">
            <div class="test-id">${testId || 'N/A'}</div>
            <div class="test-url">${url || 'No URL'}</div>
            <div class="test-meta">
              <span class="status-badge" style="background: ${statusBg}; color: ${statusColor};">
                ${status || 'unknown'}
              </span>
              <span class="browser-badge">
                <span>${browserIcon}</span>
                <span>${browser || 'chrome'}</span>
              </span>
              <span class="timestamp">${this.formatDate(timestamp || new Date().toISOString())}</span>
            </div>
            ${metricsHtml}
          </div>
          <div class="test-actions">
            <button class="action-button primary" data-action="view">View Details</button>
            <button class="action-button" data-action="download">Download</button>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners
    const viewBtn = this.shadowRoot.querySelector('[data-action="view"]');
    const downloadBtn = this.shadowRoot.querySelector('[data-action="download"]');

    viewBtn?.addEventListener('click', () => this.handleViewDetails());
    downloadBtn?.addEventListener('click', () => this.handleDownload());
  }
}

if(!customElements.get('test-history-item')) {
  customElements.define('test-history-item', TestHistoryItem);
}
