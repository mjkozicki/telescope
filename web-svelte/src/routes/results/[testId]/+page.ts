import type { PageLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
  const { testId } = params;
  
  try {
    // For now, redirect to overview
    // In production, you'd load manifest data here to validate the test exists
    
    // Example of loading data from static files or API:
    // const response = await fetch(`/results/${testId}/manifest.json`);
    // if (!response.ok) {
    //   throw error(404, `Test result ${testId} not found`);
    // }
    // const manifest = await response.json();
    
    throw redirect(307, `/results/${testId}/overview`);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err && err.status === 307) {
      throw err; // Re-throw redirect
    }
    throw error(404, {
      message: `Test result "${testId}" not found`
    });
  }
};

