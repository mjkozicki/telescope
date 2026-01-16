# Telescope Web UI Setup Guide

## Overview

This is an Astro-based web UI for Cloudflare Telescope, designed to be deployed on Cloudflare Pages/Workers. It uses Web Components for the UI as specified in PR #79.

## Project Structure

```
telescope-web/
├── src/
│   ├── components/          # Web Components (TopNav, DataNav, MetricItem)
│   ├── layouts/             # Page layouts
│   └── pages/
│       ├── index.astro      # Home page
│       ├── results/         # Results listing
│       ├── data/            # Result detail pages
│       │   ├── overview/
│       │   └── metrics/
│       └── api/             # API routes for serving results
├── public/
│   └── style.css            # Global styles
├── astro.config.mjs         # Astro configuration with Cloudflare adapter
└── wrangler.toml            # Cloudflare Workers configuration
```

## Next Steps

### 1. Storage Integration

The API routes in `src/pages/api/` need to be connected to your storage solution:

**Option A: Cloudflare R2 (Recommended for large files)**
- Store HAR files, videos, screenshots, etc. in R2
- Update `wrangler.toml` with R2 bucket binding
- Modify API routes to read from R2

**Option B: Cloudflare KV**
- Store metadata and small JSON files
- Update `wrangler.toml` with KV namespace binding

**Option C: Cloudflare D1**
- Store structured data in SQLite database
- Better for querying and relationships

### 2. Add More Pages

Create additional pages in `src/pages/data/`:
- `waterfall/[testId].astro`
- `console/[testId].astro`
- `filmstrip-video/[testId].astro`
- `resources/[testId].astro`
- `bottlenecks/[testId].astro`
- `config/[testId].astro`

### 3. Web Components

Additional components can be added in `src/components/`:
- Waterfall chart component
- Console message component
- Filmstrip viewer component
- etc.

### 4. Deployment

#### Cloudflare Pages
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables if needed

#### Cloudflare Workers
```bash
npm run build
npx wrangler pages deploy dist
```

## Development

```bash
npm run dev
```

Visit `http://localhost:4321`

## Building

```bash
npm run build
```

## References

- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Integration](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Telescope Repository](https://github.com/cloudflare/telescope)
