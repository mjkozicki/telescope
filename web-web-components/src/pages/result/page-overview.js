class PageOverview extends HTMLElement {
  static get observedAttributes() { return ['test-id']; }
  
  async connectedCallback() {
    const testId = this.getAttribute('test-id');
    if (!testId) return;

    this.innerHTML = '<div class="section-content"><p>Loading...</p></div>';

    try {
      const response = await fetch(`/api/results/${testId}`);
      const data = await response.json();

      this.innerHTML = `
        <div class="section-content">
          <h2>Overview</h2>
          <p>Test summary with key performance metrics and screenshot.</p>
          <div style="margin-top: 2rem;">
            <strong>Test ID:</strong> ${testId}<br>
            <strong>URL:</strong> ${data.config?.url || 'N/A'}
          </div>
        </div>
      `;
    } catch (err) {
      this.innerHTML = '<div class="section-content"><p>Failed to load test data</p></div>';
    }
  }
}

customElements.define('page-overview', PageOverview);

