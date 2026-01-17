import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context: any) => {
  const env = context.env || context.locals?.runtime?.env;
  const { testId } = context.params;
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
    const { result: result } = await stmt.bind(testId).first();
    if(!result) {
      return new Response(JSON.stringify({ error: 'Test not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ testId, result }), {
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
