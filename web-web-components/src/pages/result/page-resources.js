class PageResources extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="section-content"><h2>Resources</h2><p>Resource breakdown view</p></div>';
  }
}
customElements.define('page-resources', PageResources);

