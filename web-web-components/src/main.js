// Import all components
import './components/app-shell.js';
import './components/app-logo.js';
import './components/app-nav.js';
import './components/app-tabs.js';

// Import all pages
import './pages/page-home.js';
import './pages/page-advanced.js';
import './pages/page-results.js';
import './pages/page-upload.js';
import './pages/result/page-overview.js';
import './pages/result/page-metrics.js';
import './pages/result/page-resources.js';
import './pages/result/page-waterfall.js';
import './pages/result/page-filmstrip.js';
import './pages/result/page-video.js';
import './pages/result/page-console.js';
import './pages/result/page-bottlenecks.js';
import './pages/result/page-config.js';

// Initialize router
import { Router } from './router.js';

const router = new Router();
router.start();

