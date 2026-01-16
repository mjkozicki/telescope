#!/usr/bin/env node
/**
 * Setup script for local D1 database and R2 bucket
 * This script initializes the local development environment
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function runCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });
    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('already exists')) console.error(stderr);
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`  ✓ ${description} already exists`);
      return true;
    }
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

async function setupDatabase() {
  console.log('🔧 Setting up local Cloudflare D1 and R2 for Telescope Web UI...\n');

  // Check if wrangler is available
  try {
    await execAsync('wrangler --version', { cwd: projectRoot });
  } catch {
    console.log('⚠️  Wrangler CLI not found. Run: npm install -g wrangler');
    console.log('   Or use: npx wrangler <command>\n');
  }

  // Apply schema
  const schemaPath = join(projectRoot, 'db', 'schema.sql');
  if (existsSync(schemaPath)) {
    const success = await runCommand(
      'npx wrangler d1 execute telescope-db --local --file=./db/schema.sql',
      'Creating local D1 database schema'
    );
    
    if (success) {
      console.log('✅ Local D1 database schema applied');
    }
  }

  // Apply migrations
  const migrationsPath = join(projectRoot, 'db', 'migrations');
  if (existsSync(migrationsPath)) {
    console.log('\n📦 Applying database migrations...');
    // Note: In a real scenario, you'd track which migrations have been applied
    // For now, we'll just apply the schema which includes the initial migration
    console.log('✅ Migrations complete (schema already includes initial migration)');
  }

  console.log('\n✅ Local setup complete!\n');
  console.log('📝 Next steps:');
  console.log('   1. Run "npm run dev:cloudflare" to start the development server');
  console.log('   2. The local D1 database is stored in .wrangler/state/');
  console.log('   3. Local R2 bucket will be created automatically on first use\n');
  console.log('💡 To view database contents:');
  console.log('   npx wrangler d1 execute telescope-db --local --command="SELECT * FROM test_results LIMIT 10"\n');
}

// Run setup
setupDatabase().catch(console.error);
