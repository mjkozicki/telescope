import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const testData = await request.json();

    if (!testData.url) {
      return json({ error: 'URL is required' }, { status: 400 });
    }

    // Generate a unique test ID with timestamp
    const date_ob = new Date();
    const date = ('0' + date_ob.getDate()).slice(-2);
    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();
    
    const testId = `${year}_${month}_${date}_${crypto.randomUUID()}`;

    // Create requested directory if it doesn't exist
    const requestedDir = join(process.cwd(), 'static', 'requested');
    if (!existsSync(requestedDir)) {
      mkdirSync(requestedDir, { recursive: true });
    }

    // Save the test request data
    const testFilePath = join(requestedDir, `${testId}.json`);
    const requestData = {
      ...testData,
      testId,
      requestedAt: new Date().toISOString(),
      status: 'requested'
    };

    writeFileSync(testFilePath, JSON.stringify(requestData, null, 2));

    // Read config.json to get agentUrl
    const configPath = join(process.cwd(), 'config.json');
    let agentUrl = null;
    
    if (existsSync(configPath)) {
      const configData = readFileSync(configPath, 'utf-8');
      try {
        const config = JSON.parse(configData);
        agentUrl = config.agentUrl;
      } catch (err) {
        console.error('Failed to parse config.json:', err);
      }
    }

    if (!agentUrl) {
      console.warn('agentUrl not found in config.json');
    } else {
      // Make HTTP POST request to agentUrl with test data
      try {
        const response = await fetch(agentUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.error('Failed HTTP call to agentUrl:', err);
      }
    }

    return json({
      success: true,
      testId,
      redirectUrl: `/running?testId=${testId}`
    });
  } catch (error) {
    console.error('Submit test error:', error);
    return json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};

