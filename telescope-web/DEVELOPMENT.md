# Development Guide

This guide covers setting up and working with the Telescope Web UI in a Cloudflare development environment.

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn
- Cloudflare account (for deployment and Cloudflare-specific features)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start local development:**
   ```bash
   # Standard Astro dev server (with Node.js filesystem)
   npm run dev
   
   # OR Cloudflare Workers simulation
   npm run build
   npm run dev:cloudflare
   ```

3. **Open in browser:**
   - Astro dev: `http://localhost:4321`
   - Wrangler dev: Check terminal output for the local URL

## Development Modes

### 1. Astro Dev Server (`npm run dev`)

**Use when:**
- Initial development
- Need filesystem access (reading from `../results`)
- Faster iteration on UI changes

**Features:**
- Hot module replacement
- Full Node.js APIs available
- Can read from local filesystem
- API routes work with Node.js `fs` module

**Limitations:**
- Not a true Cloudflare Workers environment
- Some Cloudflare-specific features may not work

### 2. Wrangler Dev Server (`npm run dev:cloudflare`)

**Use when:**
- Testing Cloudflare Workers compatibility
- Validating API routes for Workers runtime
- Testing R2/KV/D1 bindings
- Pre-deployment testing

**Features:**
- True Cloudflare Workers runtime simulation
- Environment variables from `.dev.vars`
- R2/KV/D1 bindings available (if configured)
- Production-like environment

**Limitations:**
- No filesystem access
- Slower iteration (requires rebuild)
- Must use Cloudflare storage for data

## Environment Variables

### For Local Development

Create a `.dev.vars` file in the project root:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your values:

```env
# Optional: Cloudflare API token
CLOUDFLARE_API_TOKEN=your_token_here

# If using R2 for results storage
RESULTS_BUCKET_NAME=telescope-results

# If using KV for metadata
RESULTS_KV_NAMESPACE_ID=your_kv_namespace_id
```

The `.dev.vars` file is gitignored and will be used by Wrangler.

### For Production

Set environment variables in:
- Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
- Or via Wrangler: `wrangler pages secret put VARIABLE_NAME`

## Storage Configuration

### Using R2 (Recommended for large files)

1. Create an R2 bucket in Cloudflare Dashboard
2. Update `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "RESULTS_BUCKET"
bucket_name = "telescope-results"
```

3. Update API routes to use the binding:

```typescript
// In your API route
export const GET: APIRoute = async ({ request, env }) => {
  const object = await env.RESULTS_BUCKET.get(`${testId}/metrics.json`);
  // ...
};
```

### Using KV (For metadata)

1. Create a KV namespace: `wrangler kv:namespace create "RESULTS_KV"`
2. Update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "RESULTS_KV"
id = "your-kv-namespace-id"
```

### Using D1 (For structured data)

1. Create a D1 database: `wrangler d1 create telescope-db`
2. Update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "telescope-db"
database_id = "your-database-id"
```

## API Routes

API routes are located in `src/pages/api/` and automatically become Workers routes.

### Current API Routes

- `GET /api/results` - List all test results
- `GET /api/results/[testId]/[...path]` - Get specific result files

### Accessing Cloudflare Bindings

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, env }) => {
  // env.RESULTS_BUCKET - R2 bucket binding
  // env.RESULTS_KV - KV namespace binding
  // env.DB - D1 database binding
  
  const data = await env.RESULTS_BUCKET.get('file.json');
  return new Response(data);
};
```

## File Structure

```
telescope-web/
├── .dev.vars              # Local environment variables (gitignored)
├── .dev.vars.example      # Example environment variables
├── wrangler.toml          # Cloudflare configuration
├── astro.config.mjs       # Astro configuration
├── package.json           # Dependencies and scripts
├── public/                # Static assets
│   └── style.css
└── src/
    ├── components/        # Astro components
    ├── layouts/           # Layout components
    └── pages/             # Pages and API routes
        ├── api/           # API routes (become Workers)
        ├── data/          # Data visualization pages
        └── results/       # Results listing
```

## Common Tasks

### Building for Production

```bash
npm run build
```

Output goes to `dist/` directory.

### Testing Locally (Cloudflare Workers mode)

```bash
npm run build
npm run preview
```

### Deploying to Cloudflare Pages

```bash
# Authenticate first (if not already)
npx wrangler login

# Deploy
npm run deploy
```

### Viewing Logs

```bash
# Local development logs
npm run dev:cloudflare

# Production logs (after deployment)
npx wrangler pages tail
```

## Troubleshooting

### "Filesystem not available" error

This happens when running in Cloudflare Workers mode. Solutions:
1. Use `npm run dev` for local development (has filesystem access)
2. Configure R2/KV/D1 bindings and update API routes to use them
3. The code already handles this gracefully with fallbacks

### Build errors with Node.js modules

If you see errors about `fs` or `path` modules:
- These are only available in Node.js, not Cloudflare Workers
- Use conditional imports (as done in `/api/results.ts`)
- Or use Cloudflare storage alternatives

### Port already in use

Change the port:
```bash
# For Astro dev
npm run dev -- --port 3000

# For Wrangler (edit wrangler.toml or use --port flag)
```

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
