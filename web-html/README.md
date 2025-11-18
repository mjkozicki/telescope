# Telescope - Vanilla HTML/CSS/JS Version

This is a vanilla HTML/CSS/JavaScript implementation of the Telescope performance testing tool with no frameworks or build tools required.

## Structure

```
web-html/
├── index.html              # Home page (simple test form)
├── advanced.html          # Advanced test configuration
├── results.html           # Results list
├── upload.html            # Upload test results
├── result/
│   ├── overview.html      # Test overview
│   ├── metrics.html       # Performance metrics
│   ├── resources.html     # Resource breakdown
│   ├── waterfall.html     # Waterfall chart
│   ├── filmstrip.html     # Filmstrip view
│   ├── video.html         # Video playback
│   ├── console.html       # Console logs
│   ├── bottlenecks.html   # Bottleneck analysis
│   └── config.html        # Test configuration
├── js/
│   ├── main.js           # Main application logic
│   ├── api.js            # API client
│   └── router.js         # Client-side navigation
├── css/
│   └── main.css          # Global styles (shared)
└── assets/
    └── vite.svg          # Logo placeholder
```

## Features

- No build step required
- Pure vanilla JavaScript (ES6+)
- Modular code with ES modules
- Same visual design as other versions
- Shared API server
- Progressive enhancement
- Works in all modern browsers

## Development

```bash
# Start the shared API server (from parent directory)
node shared-server.js

# Serve the HTML files (use any static server)
npx serve web-html

# Or use Python
cd web-html
python3 -m http.server 8000

# Or open index.html directly in your browser
```

## No Installation Required

This version requires no npm install or build step. Just open `index.html` in a browser or serve the directory with any static file server.

## Key Differences

- **No JSX/Templates**: Pure HTML and DOM manipulation
- **No Virtual DOM**: Direct DOM updates
- **No State Management**: Simple JavaScript variables and functions
- **No Routing Library**: Hash-based navigation with vanilla JS
- **No Module Bundler**: Native ES modules

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- ES Modules
- Fetch API
- CSS Custom Properties

## API

Uses the same shared API server (`shared-server.js`) as other versions:
- `POST /api/submit-test`
- `GET /api/results`
- `GET /api/results/:testId`
- `POST /api/upload`

