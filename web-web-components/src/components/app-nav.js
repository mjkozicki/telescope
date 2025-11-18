class AppNav extends HTMLElement {
  connectedCallback() {
    this.render();
    window.addEventListener('hashchange', () => this.render());
  }

  render() {
    const hash = window.location.hash.slice(1) || '/';
    const isResultPage = hash.includes('/results/') && hash.split('/').length > 3;
    const testId = isResultPage ? hash.split('/')[2] : null;

    const links = [
      { path: 'overview', label: 'Overview' },
      { path: 'metrics', label: 'Metrics' },
      { path: 'resources', label: 'Resources' },
      { path: 'waterfall', label: 'Waterfall' },
      { path: 'filmstrip', label: 'Filmstrip' },
      { path: 'video', label: 'Video' },
      { path: 'console', label: 'Console' },
      { path: 'bottlenecks', label: 'Bottlenecks' },
      { path: 'config', label: 'Config' }
    ];

    this.innerHTML = `
      <nav class="common-nav">
        ${links.map(link => {
          if (isResultPage) {
            const href = `#/results/${testId}/${link.path}`;
            const isActive = hash === href.slice(1);
            return `<a href="${href}" class="nav-link ${isActive ? 'active' : ''}">${link.label}</a>`;
          } else {
            return `<span class="nav-link disabled">${link.label}</span>`;
          }
        }).join('')}
      </nav>
    `;
  }
}

customElements.define('app-nav', AppNav);

