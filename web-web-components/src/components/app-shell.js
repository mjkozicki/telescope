class AppShell extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="app">
        <app-logo></app-logo>
        <app-nav></app-nav>
        <header>
          <app-tabs></app-tabs>
        </header>
        <main>
          <div class="content" id="page-content">
            <page-home></page-home>
          </div>
        </main>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['current-page', 'test-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'current-page' && newValue) {
      this.renderPage(newValue);
    }
  }

  renderPage(pageName) {
    const content = this.querySelector('#page-content');
    if (content) {
      const testId = this.getAttribute('test-id');
      const pageElement = document.createElement(pageName);
      if (testId) {
        pageElement.setAttribute('test-id', testId);
      }
      content.innerHTML = '';
      content.appendChild(pageElement);
    }
  }
}

customElements.define('app-shell', AppShell);

