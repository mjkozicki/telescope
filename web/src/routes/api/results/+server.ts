import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async () => {
  try {
    const resultsDir = join(process.cwd(), 'static', 'test-results');

    if (!existsSync(resultsDir)) {
      return json([]);
    }

    const entries = readdirSync(resultsDir, { withFileTypes: true });
    const results = entries
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const testId = entry.name;
        const configPath = join(resultsDir, testId, 'config.json');

        let url = 'Unknown';
        let browser = 'Unknown';
        let timestamp = 'Unknown';
        let engineUrl: string | null = null;
        let screenshotUrl: string | null = null;
        // Try to read config
        if (existsSync(configPath)) {
          try {
            const config = JSON.parse(readFileSync(configPath, 'utf-8'));
            url = config.url || url;
            browser = config.browserConfig.channel || config.browserConfig.engine;
            timestamp = config.date || timestamp;
            engineUrl = `/test-results/${testId}/engine.png`;
            screenshotUrl = `/test-results/${testId}/screenshot.png`;
          } catch (err) {
            console.error(`Error reading config for ${testId}:`, err);
          }
        }

        return {
          testId,
          url,
          browser,
          timestamp,
          engineUrl,
          screenshotUrl
        };
      })
      .sort((a, b) => b.testId.localeCompare(a.testId)); // Most recent first

    return json(results);
  } catch (error) {
    console.error('Error reading results directory:', error);
    return json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};

