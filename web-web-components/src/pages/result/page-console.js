class PageConsole extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="section-content"><h2>Console</h2><p>Browser console logs</p></div>';
  }
}
customElements.define('page-console', PageConsole);

