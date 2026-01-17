import type { APIRoute } from 'astro';
import { TestConfig } from '../../../types/testConfig';

export const prerender = false;

export const POST: APIRoute = async (context: any) => {
  try {
    const data = await context.request?.json();
    const testConfig = TestConfig.fromInput(data);
    if (!testConfig.isValid()) {
      return new Response(JSON.stringify({
        success: false,
        testConfig: testConfig,
        error: 'Invalid test configuration'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Access D1 database - try both env parameter and context.locals.runtime
    const env = context.env || context.locals?.runtime?.env;
    const queued = await testConfig.saveToD1(env);
    return new Response(JSON.stringify({
      success: true,
      queued: queued,
      testId: testConfig.test_id,
      message: 'Test queued for execution'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
