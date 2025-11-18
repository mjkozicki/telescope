class PageWaterfall extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="section-content"><h2>Waterfall</h2><p>Network waterfall chart</p></div>';
  }
}
customElements.define('page-waterfall', PageWaterfall);

