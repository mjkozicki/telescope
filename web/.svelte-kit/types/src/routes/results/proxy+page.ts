// @ts-nocheck
import type { PageLoad } from './$types';

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
  try {
    // Try to load results list from API or scan directory
    // For now, we'll return a sample structure
    // In production, this would list all available test results
    
    // Example: fetch from API
    // const response = await fetch('/api/results');
    // const results = await response.json();
    
    // For now, return empty or sample data
    const results: Array<{
      id: string;
      url: string;
      timestamp: string;
      browser: string;
    }> = [];
    
    // If you have static results in public/results, you could scan them:
    // This would require a server endpoint to list directories
    
    return {
      results
    };
  } catch (err) {
    console.error('Error loading results:', err);
    return {
      results: []
    };
  }
};

