# Telescope Web UI

Web UI for [Cloudflare Telescope](https://github.com/cloudflare/telescope) built with Astro and deployed on Cloudflare Pages/Workers.

## Features

- 🚀 Built with Astro for optimal performance
- ☁️ Deployed on Cloudflare Pages/Workers
- 🧩 Web Components for UI elements
- 📊 Results visualization
- 🎨 Modern, responsive design

## Development

### Local Development (Node.js with filesystem access)

For local development with full Node.js filesystem access (recommended for initial development):

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` to see your site.

This mode allows reading results from the local `../results` directory.

### Cloudflare Local Development (Workers simulation)

To test your site in a Cloudflare Workers environment locally:

```bash
# First, build the project
npm run build

# Then run with Wrangler (simulates Cloudflare Workers environment)
npm run dev:cloudflare
# or
npm run preview
```

This will:
- Simulate the Cloudflare Workers runtime
- Test your API routes in the Workers environment
- Use environment variables from `.dev.vars` (if present)
- Not have filesystem access (use R2/KV bindings for data)

**Note:** In Cloudflare Workers mode, filesystem access is not available. Your API routes will need to read from Cloudflare R2, KV, or D1. See the Storage section below.

### Environment Variables

For local Cloudflare development, create a `.dev.vars` file:

```bash
cp .dev.vars.example .dev.vars
```

Then edit `.dev.vars` with your configuration. This file is gitignored and will be used by Wrangler for local development.

## Building

```bash
npm run build
```

This will create a `dist/` directory with your site ready to be deployed to Cloudflare.

**Build Output:**
- Static pages are pre-rendered
- API routes and dynamic pages are compiled to Workers
- Output is optimized for Cloudflare Pages/Workers

## Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `dist`

### Cloudflare Pages (via Wrangler)

```bash
npm run build
npm run deploy
# or manually:
npx wrangler pages deploy dist
```

You can also use the Cloudflare Dashboard:
1. Go to Cloudflare Dashboard → Pages
2. Create a new project or connect your GitHub repository
3. Set build command: `npm run build`
4. Set build output directory: `dist`
5. Set Node.js version: `20` (or latest LTS)

### Authenticating with Cloudflare

Before deploying, authenticate with Cloudflare:

```bash
npx wrangler login
```

This will open a browser window for authentication.

## Project Structure

```
/
├── public/
│   └── style.css          # Global styles
├── src/
│   ├── components/        # Web components
│   │   ├── TopNav.astro
│   │   ├── DataNav.astro
│   │   └── MetricItem.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro
│       ├── results/
│       └── data/
│           └── overview/
│               └── [testId].astro
└── astro.config.mjs
```

## API Routes

The API routes are located in `src/pages/api/`:

- `/api/results` - List all test results
- `/api/results/[testId]/[...path]` - Get specific result files

## Storage

Results can be stored in:
- Cloudflare R2 (recommended for large files)
- Cloudflare KV (for metadata)
- Cloudflare D1 (for structured data)

Configure storage bindings in `wrangler.toml`.

## License

Apache-2.0
