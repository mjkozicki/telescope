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
        // Try to read HAR file to get creator, browser (name & version), and page title
        const harPath = join(resultsDir, testId, 'pageload.har');
        let harCreator: { name: string, version: string } | null = null;
        let harBrowser: { name: string, version: string } | null = null;
        let pageTitle: string | null = null;
        if (existsSync(harPath)) {
          try {
            const harData = JSON.parse(readFileSync(harPath, 'utf-8'));
            if (harData.creator) {
              harCreator = {
                name: harData.creator.name,
                version: harData.creator.version
              };
            }
            if (harData.browser) {
              // Overwrite browser and version using HAR, if available
              browser = `${harData.browser.name} ${harData.browser.version}`;
            }
            if (harData.pages && Array.isArray(harData.pages) && harData.pages.length > 0) {
              pageTitle = harData.pages[0].title;
            }
          } catch (err) {
            console.error(`Error reading HAR for ${testId}:`, err);
          }
        }
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

