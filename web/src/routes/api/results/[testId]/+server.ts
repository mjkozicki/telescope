import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async ({ params }) => {
  const { testId } = params;
  
  try {
    const resultsDir = join(process.cwd(), 'static', 'test-results');
    const testDir = join(resultsDir, testId);
    
    if (!existsSync(testDir)) {
      return json(
        { error: 'Test not found', testId },
        { status: 404 }
      );
    }
    
    // Load all available data files
    const manifestPath = join(testDir, 'manifest.json');
    const configPath = join(testDir, 'config.json');
    const metricsPath = join(testDir, 'metrics.json');
    const resourcesPath = join(testDir, 'resources.json');
    const consolePath = join(testDir, 'console.json');
    const harPath = join(testDir, 'pageload.har');
    
    const manifest = existsSync(manifestPath) 
      ? JSON.parse(readFileSync(manifestPath, 'utf-8')) 
      : null;
    
    const config = existsSync(configPath) 
      ? JSON.parse(readFileSync(configPath, 'utf-8')) 
      : null;
    
    const metrics = existsSync(metricsPath) 
      ? JSON.parse(readFileSync(metricsPath, 'utf-8')) 
      : null;
    
    const resources = existsSync(resourcesPath) 
      ? JSON.parse(readFileSync(resourcesPath, 'utf-8')) 
      : null;
    
    const consoleData = existsSync(consolePath) 
      ? JSON.parse(readFileSync(consolePath, 'utf-8')) 
      : null;
    
    // Parse HAR file for additional metadata
    let harData: {
      creator?: { name: string; version: string };
      browser?: { name: string; version: string };
      pageTitle?: string;
    } | null = null;
    
    if (existsSync(harPath)) {
      try {
        const har = JSON.parse(readFileSync(harPath, 'utf-8'));
        harData = {
          creator: har.log?.creator ? {
            name: har.log.creator.name,
            version: har.log.creator.version
          } : undefined,
          browser: har.log?.browser ? {
            name: har.log.browser.name,
            version: har.log.browser.version
          } : undefined,
          pageTitle: har.log?.pages?.[0]?.title
        };
      } catch (err) {
        console.error(`Error parsing HAR for ${testId}:`, err);
      }
    }
    
    return json({
      testId,
      manifest,
      config,
      metrics,
      resources,
      console: consoleData,
      har: harData,
      exists: manifest !== null || config !== null
    });
  } catch (error) {
    console.error(`Error loading test ${testId}:`, error);
    return json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};

