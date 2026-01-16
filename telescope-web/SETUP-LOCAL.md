# Local D1 and R2 Setup Guide

This guide explains how to set up local Cloudflare D1 (SQLite) and R2 (object storage) for development.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Set up local D1 database
npm run db:setup

# Build the project
npm run build

# Start Cloudflare dev server (with D1 and R2)
npm run dev:cloudflare
```

## What Gets Created

### D1 Database (SQLite)

The local D1 database is stored in `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/telescope-db.sqlite`

**Tables:**
- `test_results` - Test metadata (test_id, url, date, browser, dimensions, etc.)
- `test_metrics` - Performance metrics for each test
- `test_bottlenecks` - Bottleneck analysis results

### R2 Bucket (Local)

The local R2 bucket is automatically created when first used and stored in `.wrangler/state/v3/r2/`

**Stored Files:**
- `{testId}/config.json` - Test configuration
- `{testId}/metrics.json` - Performance metrics
- `{testId}/console.json` - Console messages
- `{testId}/resources.json` - Resource timings
- `{testId}/pageload.har` - HAR file
- `{testId}/screenshot.png` - Screenshot
- `{testId}/video.webm` - Video recording
- `{testId}/filmstrip/*.jpg` - Filmstrip frames

## Database Schema

### test_results

Stores metadata about each test run:

```sql
CREATE TABLE test_results (
  test_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  date TEXT NOT NULL,
  browser TEXT,
  width INTEGER,
  height INTEGER,
  timestamp INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
```

### test_metrics

Stores performance metrics:

```sql
CREATE TABLE test_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL,
  metric_unit TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (test_id) REFERENCES test_results(test_id) ON DELETE CASCADE,
  UNIQUE(test_id, metric_name)
);
```

### test_bottlenecks

Stores bottleneck analysis:

```sql
CREATE TABLE test_bottlenecks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (test_id) REFERENCES test_results(test_id) ON DELETE CASCADE
);
```

## Using the Database

### Query the Database

```bash
# List all test results
npm run db:query "SELECT * FROM test_results ORDER BY timestamp DESC LIMIT 10"

# Get metrics for a specific test
npm run db:query "SELECT * FROM test_metrics WHERE test_id = 'your-test-id'"

# Count total tests
npm run db:query "SELECT COUNT(*) as total FROM test_results"
```

### Using in Code

```typescript
// In your API route
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, env }) => {
  // Access D1 database
  const stmt = env.DB.prepare('SELECT * FROM test_results ORDER BY timestamp DESC LIMIT 10');
  const { results } = await stmt.all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Using R2 in Code

```typescript
// In your API route
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, env }) => {
  const { testId, path: filePath } = params;
  
  // Read from R2
  const object = await env.RESULTS_BUCKET.get(`${testId}/${filePath}`);
  
  if (!object) {
    return new Response('Not found', { status: 404 });
  }
  
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream'
    }
  });
};
```

## Migration Management

### Apply Schema

```bash
npm run db:migrate
```

This applies the schema defined in `db/schema.sql`.

### Create a New Migration

1. Create a new SQL file in `db/migrations/`:
   ```bash
   # e.g., db/migrations/002_add_column.sql
   ```

2. Add your SQL:
   ```sql
   ALTER TABLE test_results ADD COLUMN user_agent TEXT;
   ```

3. Apply the migration:
   ```bash
   npx wrangler d1 execute telescope-db --local --file=./db/migrations/002_add_column.sql
   ```

## Configuration

### wrangler.toml

The local D1 and R2 are configured in `wrangler.toml`:

```toml
# Local D1 database
[[d1_databases]]
binding = "DB"
database_name = "telescope-db"
database_id = "local"

# Local R2 bucket
[[r2_buckets]]
binding = "RESULTS_BUCKET"
bucket_name = "telescope-results-local"
```

### Production Setup

For production, uncomment and configure the production bindings:

```toml
[env.production]

[[env.production.d1_databases]]
binding = "DB"
database_name = "telescope-db"
database_id = "your-production-database-id"

[[env.production.r2_buckets]]
binding = "RESULTS_BUCKET"
bucket_name = "telescope-results"
```

## Troubleshooting

### Database not found

If you see errors about the database not existing:

```bash
npm run db:setup
```

### Reset the Database

To start fresh:

```bash
# Delete local database
rm -rf .wrangler/state/v3/d1/

# Recreate
npm run db:setup
```

### R2 Bucket Issues

R2 buckets are created automatically. If you have issues:

1. Check `.wrangler/state/v3/r2/` directory exists
2. Ensure `wrangler.toml` has the R2 bucket binding configured
3. Restart the dev server

## Useful Commands

```bash
# Set up database
npm run db:setup

# Apply schema/migrations
npm run db:migrate

# Query database
npm run db:query "SELECT * FROM test_results"

# Start dev server with Cloudflare bindings
npm run dev:cloudflare

# View Wrangler logs
npx wrangler pages tail
```

## Storage Locations

- **D1 Database**: `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/telescope-db.sqlite`
- **R2 Bucket**: `.wrangler/state/v3/r2/telescope-results-local/`

These directories are gitignored and are created automatically by Wrangler.

## Next Steps

1. Update your API routes to use D1 and R2 instead of filesystem
2. Create migration scripts for production deployment
3. Set up CI/CD to run migrations on deployment
4. Configure production D1 and R2 bindings in Cloudflare Dashboard
