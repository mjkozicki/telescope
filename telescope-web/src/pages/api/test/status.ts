import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, request, env }: any) => {
  const { testId } = params;
  console.log('testId', testId);
  if (!testId) {
    return new Response(JSON.stringify({ error: 'Test ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const stmt = env.DB.prepare(`
      SELECT 
        test_id,
        status,
        created_at,
        updated_at
      FROM tests 
      WHERE test_id = ?
      LIMIT 1
    `);
    const { results: results } = await stmt.bind(testId).all();
    console.log('results', results);
    if(results.length === 0) {
      return new Response(JSON.stringify({ error: 'Test not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ testId, result: results[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch resource',
      message: (error as Error).message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
