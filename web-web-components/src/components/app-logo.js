class AppLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="logo-container">
        <img src="/vite.svg" alt="Logo" class="logo" />
      </div>
    `;
  }
}

customElements.define('app-logo', AppLogo);

