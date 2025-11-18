class PageUpload extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="section-content">
        <h2>Upload Test Results</h2>
        <p>Upload a test results archive (implementation similar to other versions)</p>
      </div>
    `;
  }
}

customElements.define('page-upload', PageUpload);

