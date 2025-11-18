import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { testId } = params;
  
  try {
    // Load test data from API endpoint
    const response = await fetch(`/api/results/${testId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw error(404, `Test ${testId} not found`);
      }
      throw error(response.status, 'Failed to load test data');
    }
    
    const data = await response.json();
    
    return {
      testId: data.testId,
      manifest: data.manifest,
      config: data.config,
      metrics: data.metrics,
      resources: data.resources,
      console: data.console,
      har: data.har,
      exists: data.exists
    };
  } catch (err) {
    // Re-throw SvelteKit errors
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }
    
    // For other errors, return empty data
    console.error(`Error loading test ${testId}:`, err);
    return {
      testId,
      manifest: null,
      config: null,
      metrics: null,
      resources: null,
      console: null,
      har: null,
      exists: false
    };
  }
};

