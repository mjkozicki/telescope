#!/bin/bash
# Setup script for local D1 database and R2 bucket

set -e

echo "🔧 Setting up local Cloudflare D1 and R2 for Telescope Web UI..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Initialize local D1 database
echo "📊 Setting up local D1 database..."
if [ ! -f "db/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/telescope-db.sqlite" ]; then
    echo "  Creating local D1 database..."
    wrangler d1 execute telescope-db --local --file=./db/schema.sql
    echo "✅ Local D1 database initialized"
else
    echo "  Local D1 database already exists"
fi

# Apply migrations
if [ -d "db/migrations" ]; then
    echo "📦 Applying database migrations..."
    for migration in db/migrations/*.sql; do
        if [ -f "$migration" ]; then
            echo "  Applying migration: $(basename $migration)"
            wrangler d1 execute telescope-db --local --file="$migration"
        fi
    done
    echo "✅ Migrations applied"
fi

echo ""
echo "✅ Local setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run 'npm run dev:cloudflare' to start the development server"
echo "   2. The local D1 database is stored in db/.wrangler/state/"
echo "   3. Local R2 bucket will be created automatically on first use"
echo ""
echo "💡 To view database contents:"
echo "   wrangler d1 execute telescope-db --local --command='SELECT * FROM test_results LIMIT 10'"
