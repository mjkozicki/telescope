# Telescope Web UI

Web UI for [Cloudflare Telescope](https://github.com/cloudflare/telescope) built with Astro and deployed on Cloudflare Pages/Workers.

## Features

- 🚀 Built with Astro for optimal performance
- ☁️ Deployed on Cloudflare Pages/Workers
- 🧩 Web Components for UI elements
- 📊 Results visualization
- 🎨 Modern, responsive design

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` to see your site.

## Building

```bash
npm run build
```

This will create a `dist/` directory with your site ready to be deployed.

## Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `dist`

### Cloudflare Workers

```bash
npm run build
npx wrangler pages deploy dist
```

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
