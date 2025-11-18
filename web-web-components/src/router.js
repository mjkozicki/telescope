export class Router {
  constructor() {
    this.routes = {
      '/': 'page-home',
      '/advanced': 'page-advanced',
      '/results': 'page-results',
      '/upload': 'page-upload',
      '/results/:testId/overview': 'page-overview',
      '/results/:testId/metrics': 'page-metrics',
      '/results/:testId/resources': 'page-resources',
      '/results/:testId/waterfall': 'page-waterfall',
      '/results/:testId/filmstrip': 'page-filmstrip',
      '/results/:testId/video': 'page-video',
      '/results/:testId/console': 'page-console',
      '/results/:testId/bottlenecks': 'page-bottlenecks',
      '/results/:testId/config': 'page-config'
    };
  }

  start() {
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('load', () => this.route());
  }

  route() {
    const hash = window.location.hash.slice(1) || '/';
    const { component, params } = this.matchRoute(hash);
    
    const content = document.querySelector('app-shell');
    if (content) {
      content.setAttribute('current-page', component);
      if (params.testId) {
        content.setAttribute('test-id', params.testId);
      }
    }
  }

  matchRoute(path) {
    for (const [route, component] of Object.entries(this.routes)) {
      const regex = new RegExp('^' + route.replace(/:(\w+)/g, '([^/]+)') + '$');
      const match = path.match(regex);
      
      if (match) {
        const params = {};
        const keys = [...route.matchAll(/:(\w+)/g)].map(m => m[1]);
        keys.forEach((key, i) => {
          params[key] = match[i + 1];
        });
        
        return { component, params };
      }
    }
    
    return { component: 'page-home', params: {} };
  }

  navigate(path) {
    window.location.hash = path;
  }
}

export const router = new Router();

