import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Serve individual files from a test result ZIP stored in R2 bucket
 * Route: /api/data/[testId]/[file]
 */
export const GET: APIRoute = async (context: any) => {
  try {
    const { testId, file } = context.params;
    
    if (!testId || !file) {
      return new Response(JSON.stringify({ error: 'Missing testId or file parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Access R2 bucket - try both env parameter and context.locals.runtime
    const env = context.env || context.locals?.runtime?.env;
    
    // Get the ZIP file from R2 bucket
    const zipObject = await env.RESULTS_BUCKET.get(testId);
    
    if (!zipObject) {
      return new Response(JSON.stringify({ error: 'Test not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract the ZIP file
    const zipBuffer = await zipObject.arrayBuffer();
    const { unzipSync } = await import('fflate');
    const uint8Array = new Uint8Array(zipBuffer);
    const unzipped = unzipSync(uint8Array);

    // Look for the file in the ZIP (file path format: testId/filename)
    const filePath = `${testId}/${file}`;
    const fileData = unzipped[filePath];

    if (!fileData) {
      return new Response(JSON.stringify({ error: 'File not found in test results' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine content type based on file extension
    const ext = file.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'json') contentType = 'application/json';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'webm') contentType = 'video/webm';
    else if (ext === 'har') contentType = 'application/json';

    // Convert Uint8Array to ArrayBuffer for Response
    // Create a new ArrayBuffer to avoid SharedArrayBuffer issues
    const arrayBuffer = new ArrayBuffer(fileData.length);
    new Uint8Array(arrayBuffer).set(fileData);

    // Return the file content
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving result file:', error);
    return new Response(JSON.stringify({
      error: 'Failed to serve result file',
      message: (error as Error).message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
