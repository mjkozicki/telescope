class PageResults extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = '<div class="section-content"><p>Loading...</p></div>';

    try {
      const response = await fetch('/api/results');
      const data = await response.json();
      const results = data.results || [];

      if (results.length === 0) {
        this.innerHTML = `
          <div class="section-content">
            <h2>Test Results</h2>
            <p>View all performance test results:</p>
            <div style="margin-top: 2rem; padding: 2rem; background: var(--color-background-lighter); border-radius: var(--border-radius-md); text-align: center;">
              No test results available yet.
            </div>
          </div>
        `;
      } else {
        this.innerHTML = `
          <div class="section-content">
            <h2>Test Results</h2>
            <p>View all performance test results:</p>
            <div style="margin-top: 2rem;">
              ${results.map(result => `
                <a href="#/results/${result.testId}/overview" style="display: flex; gap: 1rem; padding: 1rem; margin-bottom: 1rem; background: var(--color-white); border: 1px solid var(--color-border-lighter); border-radius: var(--border-radius-md); text-decoration: none; color: inherit;">
                  ${result.screenshotUrl ? `
                    <img src="${result.screenshotUrl}" alt="Screenshot" style="width: 120px; height: 80px; object-fit: cover; border-radius: var(--border-radius-md); border: 1px solid var(--color-border-lighter);" />
                  ` : ''}
                  <div style="flex: 1;">
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem; font-family: monospace; background: var(--color-background-lighter); padding: 0.25rem 0.5rem; border-radius: var(--border-radius-sm); display: inline-block;">
                      ${result.url}
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--color-text-secondary);">
                      <div><strong>Browser:</strong> ${result.browser}</div>
                      ${result.timestamp ? `<div><strong>Date:</strong> ${new Date(result.timestamp).toLocaleString()}</div>` : ''}
                    </div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
    } catch (err) {
      this.innerHTML = `
        <div class="section-content">
          <h2>Test Results</h2>
          <p style="color: var(--color-text-secondary);">Failed to load results.</p>
        </div>
      `;
    }
  }
}

customElements.define('page-results', PageResults);

