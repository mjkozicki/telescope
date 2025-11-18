// @ts-nocheck
import type { PageLoad } from './$types';

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
  try {
    const response = await fetch('/api/results');
    
    if (!response.ok) {
      console.error('Failed to load results:', response.statusText);
      return { results: [] };
    }
    
    const results = await response.json();
    
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

