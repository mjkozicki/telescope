# Telescope - Web Components Version

This is a Web Components implementation of the Telescope performance testing tool using vanilla JavaScript and custom elements.

## Structure

```
web-web-components/
├── index.html              # Main entry point
├── src/
│   ├── main.js            # Application bootstrap
│   ├── router.js          # Client-side routing
│   ├── components/
│   │   ├── app-shell.js   # Main app shell component
│   │   ├── app-logo.js    # Logo component
│   │   ├── app-nav.js     # Left sidebar navigation
│   │   └── app-tabs.js    # Top tabs navigation
│   ├── pages/
│   │   ├── page-home.js         # Simple test form
│   │   ├── page-advanced.js     # Advanced test configuration
│   │   ├── page-results.js      # Results list
│   │   ├── page-upload.js       # Upload test results
│   │   └── result/
│   │       ├── page-overview.js     # Test overview
│   │       ├── page-metrics.js      # Performance metrics
│   │       ├── page-resources.js    # Resource breakdown
│   │       ├── page-waterfall.js    # Waterfall chart
│   │       ├── page-filmstrip.js    # Filmstrip view
│   │       ├── page-video.js        # Video playback
│   │       ├── page-console.js      # Console logs
│   │       ├── page-bottlenecks.js  # Bottleneck analysis
│   │       └── page-config.js       # Test configuration
│   └── styles/
│       └── main.css       # Global styles (shared with other versions)
├── public/
│   └── vite.svg           # Logo placeholder
└── package.json
```

## Key Concepts

- **Custom Elements**: All UI components are implemented as custom HTML elements
- **Shadow DOM**: Components use Shadow DOM for style encapsulation
- **Client-side Routing**: Hash-based routing for navigation
- **ES Modules**: Modern JavaScript module system
- **No Build Step**: Can run directly in the browser (or use Vite for dev server)

## Setup

```bash
cd web-web-components
npm install
```

## Development

```bash
# Start the API server (from parent directory)
node shared-server.js

# Start the Vite dev server
npm run dev
```

## Build

```bash
npm run build
```

## Custom Elements

All components are registered as custom HTML elements:

- `<app-shell>` - Main application container
- `<app-logo>` - Logo component
- `<app-nav>` - Navigation sidebar
- `<app-tabs>` - Tab navigation
- `<page-home>` - Home page
- `<page-results>` - Results list
- `<page-overview>` - Test overview
- etc.

## Features

- Native Web Components (no framework)
- Progressive enhancement
- Lightweight and fast
- Compatible with all modern browsers
- Same visual design as other versions
- Shared API server

