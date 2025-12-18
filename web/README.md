# Telescope Web Components

A web application for browser performance testing with a modern UI built using web components and static HTML pages.

## Features

- ✅ **Web Components** - Native web components (no Shadow DOM)
- ✅ **Static HTML Pages** - Multiple pages for different features
- ✅ **TypeScript** - Full TypeScript support for components
- ✅ **Vite** - Fast build tooling and development server
- ✅ **Express Server** - Development and production server
- ✅ **Client-Side Navigation** - Multi-page application with navigation component

## Project Structure

```
web/
├── ui/                        # UI source files
│   ├── components/           # Web components
│   │   ├── side-nav.ts       # Side navigation component
│   │   └── test-history-item.ts  # Test history item component
│   ├── styles/               # Stylesheets
│   │   └── main.css          # Main stylesheet
│   ├── img/                  # Images and assets
│   ├── index.html            # Home page
│   ├── basic.html            # Basic test configuration page
│   ├── advanced.html         # Advanced test configuration page
│   ├── history.html          # Test history page
│   └── upload.html           # File upload page
├── server.js                 # Express server for development/production
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## Getting Started

### Installation

```bash
cd web
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

In development mode:
- Vite middleware processes TypeScript files on-the-fly
- Hot module replacement for fast development
- TypeScript components are automatically transformed

### Building

Build for production:

```bash
npm run build
```

This will create a production build in the `dist` directory using Vite.

### Preview Production Build

Preview the production build:

```bash
npm run preview
```

This serves the built files from the `dist` directory.

## Pages

- **Home** (`/`) - Overview and documentation
- **Basic** (`/basic`) - Basic test configuration with URL and browser selection
- **Advanced** (`/advanced`) - Advanced test configuration with all options
- **History** (`/history`) - View and manage past test results
- **Upload** (`/upload`) - Upload zip files for testing

## Components

### Side Navigation (`side-nav`)

The side navigation component displays a vertical menu with navigation items.

**Usage:**
```html
<side-nav active="/basic"></side-nav>
```

**Attributes:**
- `active` - Specifies which navigation item should be highlighted (e.g., `/`, `/basic`, `/advanced`, `/history`, `/upload`)

**Features:**
- No Shadow DOM - uses regular DOM for easier styling
- Active state management via `active` attribute
- Client-side navigation

### Test History Item (`test-history-item`)

Component for displaying individual test results in the history list.

## How It Works

### Architecture

1. **Static HTML Pages** - Each page is a standalone HTML file in the `ui/` directory
2. **Web Components** - TypeScript components are imported as ES modules
3. **Vite Processing** - In development, Vite transforms TypeScript and serves files
4. **Express Server** - Serves HTML pages and static assets, with Vite middleware in dev mode

### Component Loading

1. HTML pages include `<script type="module">` tags that import components
2. Components register themselves using `customElements.define()`
3. Custom elements are automatically instantiated when they appear in the DOM
4. Components use regular DOM (no Shadow DOM) for easier styling integration

### Routing

- Each page is a separate HTML file
- Navigation is handled by the `side-nav` component
- The `active` attribute on `side-nav` determines which tab is highlighted
- Full page navigation (not SPA-style routing)

## Creating New Components

1. Create a new component file in `ui/components/`
2. Extend `HTMLElement` and implement lifecycle methods
3. Register with `customElements.define()`
4. Import in your HTML page

Example:

```typescript
export class MyComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.innerHTML = '<p>Hello World</p>';
  }
}

customElements.define('my-component', MyComponent);
```

Then in your HTML:

```html
<script type="module">
  import '/components/my-component.ts';
</script>

<my-component></my-component>
```

## Styling

- All styles are consolidated in `ui/styles/main.css`
- Components use regular DOM, so styles can target them directly
- No Shadow DOM means no style encapsulation - use specific selectors

## Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## Development Notes

- **No Shadow DOM**: Components use regular DOM for easier styling and debugging
- **Static Pages**: Each route is a separate HTML file, not a single-page app
- **Vite Root**: Vite is configured with `root: 'ui'` so imports are relative to that directory
- **Component Imports**: Use absolute paths like `/components/side-nav.ts` in HTML files

## License

MIT
