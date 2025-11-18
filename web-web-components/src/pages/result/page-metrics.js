class PageMetrics extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="section-content"><h2>Metrics</h2><p>Performance metrics view (implementation similar to other versions)</p></div>';
  }
}
customElements.define('page-metrics', PageMetrics);

