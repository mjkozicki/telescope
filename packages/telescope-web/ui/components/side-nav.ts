/**
 * Side navigation component
 * Displays vertical menu with navigation items
 */

export class SideNav extends HTMLElement {
  private activeTab: string = '/';

  static get observedAttributes() {
    return ['active'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateActiveTab();
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'active' && oldValue !== newValue) {
      this.updateActiveTab();
      this.render();
    }
  }

  private updateActiveTab() {
    const activeAttr = this.getAttribute('active');
    this.activeTab = activeAttr || '/';
  }

  private setupEventListeners() {
    this.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          this.navigate(href);
        }
      }
    });
  }

  private navigate(path: string) {
    // Handle relative paths
    if (path.startsWith('http')) {
      const url = new URL(path);
      path = url.pathname;
    }
    // Navigate to the new page
    window.location.href = path;
  }

  private isActive(path: string): boolean {
    return this.activeTab === path;
  }

  render() {
    const menuItems = [
      { path: '/', label: 'Home', icon: '🏠' },
      { path: '/basic', label: 'Basic', icon: '⚙️' },
      { path: '/advanced', label: 'Advanced', icon: '🔧' },
      { path: '/history', label: 'History', icon: '📜' },
      { path: '/upload', label: 'Upload', icon: '📤' },
    ];

    const menuItemsHtml = menuItems
      .map(
        (item) => `
      <a href="${item.path}" class="nav-item ${this.isActive(item.path) ? 'active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </a>
    `
      )
      .join('');

    this.innerHTML = `
      <nav>
        ${menuItemsHtml}
      </nav>
    `;
  }
}

// Register the custom element
if (!customElements.get('side-nav')) {
  customElements.define('side-nav', SideNav);
}
