class AppTabs extends HTMLElement {
  connectedCallback() {
    this.render();
    window.addEventListener('hashchange', () => this.render());
  }

  render() {
    const hash = window.location.hash.slice(1) || '/';
    
    const tabs = [
      { path: '/', label: 'Simple' },
      { path: '/advanced', label: 'Advanced' },
      { path: '/results', label: 'Results' },
      { path: '/upload', label: 'Upload' }
    ];

    this.innerHTML = `
      <div class="tabs">
        ${tabs.map(tab => {
          const isActive = tab.path === '/' ? hash === '/' : hash.startsWith(tab.path);
          return `<a href="#${tab.path}" class="tab ${isActive ? 'active' : ''}">${tab.label}</a>`;
        }).join('')}
      </div>
    `;
  }
}

customElements.define('app-tabs', AppTabs);

