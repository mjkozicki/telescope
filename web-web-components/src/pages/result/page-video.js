class PageVideo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="section-content"><h2>Video</h2><p>Video playback view</p></div>';
  }
}
customElements.define('page-video', PageVideo);

