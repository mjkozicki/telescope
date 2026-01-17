import type { APIRoute } from 'astro';
import { TestConfig } from '../../../types/testConfig';

export const prerender = false;

export const POST: APIRoute = async (context: any) => {
  try {
    const data = await context.request?.json();
    const testConfig = new TestConfig(data);
    if (!testConfig.isValid()) {
      return new Response(JSON.stringify({
        success: false,
        testConfig: testConfig,
        error: 'Invalid test configuration'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Access D1 database - try both env parameter and context.locals.runtime
    const env = context.env || context.locals?.runtime?.env;
    const queued = await queueTest(testConfig, env);
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

async function queueTest(testConfig: TestConfig, env: any): Promise<boolean> {
  try {
    const stmt = env.DB.prepare(`
      INSERT INTO tests (
        test_id, 
        name, 
        source, 
        owner, 
        url, 
        browser, 
        device, 
        headers, 
        cookies, 
        flags, 
        block_domains, 
        block, 
        firefox_prefs, 
        cpu_throttle, 
        connection_type, 
        width, 
        height, 
        frame_rate, 
        disable_js, 
        debug, 
        auth, 
        timeout, 
        status, 
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = await stmt.bind(
      testConfig.test_id,
      testConfig.name,
      testConfig.source,
      testConfig.owner,
      testConfig.url,
      testConfig.browser,
      testConfig.device,
      testConfig.headers,
      testConfig.cookies,
      testConfig.flags,
      testConfig.block_domains,
      testConfig.block,
      testConfig.firefox_prefs,
      testConfig.cpu_throttle,
      testConfig.connection_type,
      testConfig.width,
      testConfig.height,
      testConfig.frame_rate,
      testConfig.disable_js,
      testConfig.debug,
      testConfig.auth,
      testConfig.timeout,
      testConfig.status,
      testConfig.created_at
    ).run();
    console.log('result', result);
  } catch (dbError) {
    console.error('Failed to create database entry:', dbError);
    return false;
  }
  return true;
}