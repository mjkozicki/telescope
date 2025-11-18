# Telescope - React Version

This is a React implementation of the Telescope performance testing tool.

## Structure

```
web-react/
├── src/
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx               # Entry point
│   ├── components/
│   │   ├── Logo.jsx           # Logo component
│   │   ├── Navigation.jsx     # Left sidebar navigation
│   │   └── Tabs.jsx           # Top tabs navigation
│   ├── pages/
│   │   ├── Home.jsx           # Simple test form
│   │   ├── Advanced.jsx       # Advanced test configuration
│   │   ├── Results.jsx        # Results list
│   │   ├── Upload.jsx         # Upload test results
│   │   └── result/
│   │       ├── Overview.jsx   # Test overview
│   │       ├── Metrics.jsx    # Performance metrics
│   │       ├── Resources.jsx  # Resource breakdown
│   │       ├── Waterfall.jsx  # Waterfall chart
│   │       ├── Filmstrip.jsx  # Filmstrip view
│   │       ├── Video.jsx      # Video playback
│   │       ├── Console.jsx    # Console logs
│   │       ├── Bottlenecks.jsx # Bottleneck analysis
│   │       └── Config.jsx     # Test configuration
│   └── styles/
│       └── main.css           # Global styles
├── server/
│   └── index.js               # Express server with API endpoints
├── public/
│   └── vite.svg               # Logo placeholder
├── package.json
├── vite.config.js
└── index.html
```

## Setup

```bash
cd web-react
npm install
```

## Development

```bash
# Terminal 1: Start the API server
npm run server

# Terminal 2: Start the Vite dev server
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Key Features

- React Router for client-side routing
- Functional components with hooks
- Context API for state management
- Vite for fast development and builds
- Express backend for API endpoints
- Same visual design as SvelteKit version

## API Endpoints

- `POST /api/submit-test` - Submit a test configuration
- `GET /api/results` - List all test results
- `GET /api/results/:testId` - Get detailed test results
- `POST /api/upload` - Upload test result archives

