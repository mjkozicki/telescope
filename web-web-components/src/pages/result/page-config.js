class PageConfig extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="section-content"><h2>Configuration</h2><p>Test configuration details</p></div>';
  }
}
customElements.define('page-config', PageConfig);

