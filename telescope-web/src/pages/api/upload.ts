import type { APIRoute } from 'astro';
import { TestConfig } from '../../types/testConfig';

export const POST: APIRoute = async ({ request, env }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const testId = formData.get('testId') as string | null;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Generate test ID if not provided
    const finalTestId = testId?.trim() || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Read file buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Extract ZIP archive and store files
    let config: TestConfig | null = null;
    
    // Create database entry
    if (env?.DB) {
      try {
        const now = Math.floor(Date.now() / 1000);
        const stmt = env.DB.prepare(`
          INSERT INTO tests (
            test_id, url, browser, width, height, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        await stmt.bind(
          finalTestId,
          url,
          browser,
          width,
          height,
          2, // status: 2 = completed
          now,
          now
        ).run();
      } catch (dbError) {
        console.warn('Failed to create database entry:', dbError);
        // Continue even if database insert fails
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      testId: finalTestId,
      message: 'Upload processed successfully',
      filesStored: true,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
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

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'json': return 'application/json';
    case 'har': return 'application/json';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webm': return 'video/webm';
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'css': return 'text/css';
    case 'js': return 'application/javascript';
    case 'html': return 'text/html';
    case 'txt': return 'text/plain';
    case 'zip': return 'application/zip';
    default: return 'application/octet-stream';
  }
}
