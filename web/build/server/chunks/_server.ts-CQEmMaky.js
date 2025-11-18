import { j as json } from './index-BZ3-vrRK.js';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import './utils-FiC4zhrQ.js';

const GET = async () => {
  try {
    const resultsDir = join(process.cwd(), "static", "results");
    if (!existsSync(resultsDir)) {
      return json([]);
    }
    const entries = readdirSync(resultsDir, { withFileTypes: true });
    const results = entries.filter((entry) => entry.isDirectory()).map((entry) => {
      const testId = entry.name;
      const configPath = join(resultsDir, testId, "config.json");
      const manifestPath = join(resultsDir, testId, "manifest.json");
      let url = "Unknown";
      let browser = "Unknown";
      let timestamp = testId;
      if (existsSync(configPath)) {
        try {
          const config = JSON.parse(readFileSync(configPath, "utf-8"));
          url = config.url || url;
          browser = config.browser || browser;
        } catch (err) {
          console.error(`Error reading config for ${testId}:`, err);
        }
      }
      if (existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
          timestamp = manifest.timestamp || manifest.createdAt || timestamp;
        } catch (err) {
          console.error(`Error reading manifest for ${testId}:`, err);
        }
      }
      return {
        id: testId,
        url,
        browser,
        timestamp
      };
    }).sort((a, b) => b.id.localeCompare(a.id));
    return json(results);
  } catch (error) {
    console.error("Error reading results directory:", error);
    return json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};

export { GET };
//# sourceMappingURL=_server.ts-CQEmMaky.js.map
