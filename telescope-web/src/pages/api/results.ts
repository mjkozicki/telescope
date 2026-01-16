import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Note: In Cloudflare Workers/Pages, filesystem access is not available.
    // For production deployment, this should read from Cloudflare R2, KV, or D1.
    // This implementation works for local development with Node.js filesystem.
    
    let results: any[] = [];
    
    // Check if we're in a Node.js environment with filesystem access
    // In Cloudflare Workers, these won't be available
    if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
      try {
        // Try to dynamically import Node.js modules
        const fs = await import('fs').then(m => m.default || m).catch(() => null);
        const path = await import('path').then(m => m.default || m).catch(() => null);
        
        if (fs && path && typeof fs.existsSync === 'function') {
          // Path to results directory relative to telescope-web
          const currentDir = process.cwd();
          const resultsPath = path.resolve(currentDir, '..', 'results');
        
          // Check if results directory exists
          if (fs.existsSync(resultsPath) && fs.statSync(resultsPath).isDirectory()) {
            // Read all directories in results folder
            const entries = fs.readdirSync(resultsPath, { withFileTypes: true });
            
            for (const entry of entries) {
              if (entry.isDirectory()) {
                const testId = entry.name;
                const configPath = path.join(resultsPath, testId, 'config.json');
                
                // Try to read config.json
                if (fs.existsSync(configPath)) {
                  try {
                    const configContent = fs.readFileSync(configPath, 'utf-8');
                    const config = JSON.parse(configContent);
                    
                    // Extract test information from config
                    const result = {
                      testId: testId,
                      url: config.url || config.options?.url || '',
                      date: config.date || '',
                      browser: config.options?.browser || config.browserConfig?.channel || '',
                      width: config.options?.width || config.browserConfig?.viewport?.width || '',
                      height: config.options?.height || config.browserConfig?.viewport?.height || '',
                      timestamp: new Date(config.date || Date.now()).getTime(),
                    };
                    
                    results.push(result);
                  } catch (err) {
                    // Skip this entry if config can't be parsed
                    console.warn(`Skipping ${testId}: Failed to parse config.json`, err);
                  }
                } else {
                  // If no config.json, still include the folder as a result
                  results.push({
                    testId: testId,
                    url: '',
                    date: '',
                    browser: '',
                    width: '',
                    height: '',
                    timestamp: 0,
                  });
                }
              }
            }
            
            // Sort by timestamp descending (newest first)
            results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          }
        }
      } catch (fsError) {
        // Filesystem operation failed - log but don't throw
        console.warn('Filesystem access failed:', (fsError as Error).message);
        results = [];
      }
    } else {
      // Running in Cloudflare Workers environment - filesystem not available
      // Return empty array - in production, read from R2/KV/D1 instead
      console.info('Filesystem not available (Cloudflare Workers). In production, read from Cloudflare storage (R2/KV/D1).');
      results = [];
    }
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch results',
      message: (error as Error).message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
