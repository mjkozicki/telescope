import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context: any) => {
  try {
    // Access D1 database - try both env parameter and context.locals.runtime
    const env = context.env || context.locals?.runtime?.env;
    let results: any[] = [];
    const stmt = env.DB.prepare(`
          SELECT 
            test_id,
            url,
            browser,
            width,
            height,
            status,
            created_at,
            source,
            name,
            owner
          FROM tests
          ORDER BY created_at DESC
          LIMIT 50
        `);

    const { results: dbResults } = await stmt.all();

    if (dbResults && Array.isArray(dbResults)) {
      results = dbResults.map((row: any) => ({
        testId: row.test_id,
        url: row.url || '',
        date: row.created_at ? new Date(row.created_at * 1000).toISOString() : '',
        browser: row.browser || '',
        status: row.status || 0,
        name: row.name || null,
        timestamp: row.created_at ? row.created_at * 1000 : Date.now(),
      }));
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
