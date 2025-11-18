// @ts-nocheck
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }: Parameters<LayoutLoad>[0]) => {
  const { testId } = params;
  
  try {
    // Try to load test data
    // In production, this would fetch from your data source
    // For now, we'll load from static public/results folder if it exists
    
    const manifestResponse = await fetch(`/results/${testId}/manifest.json`);
    const configResponse = await fetch(`/results/${testId}/config.json`);
    const metricsResponse = await fetch(`/results/${testId}/metrics.json`);
    
    const manifest = manifestResponse.ok ? await manifestResponse.json() : null;
    const config = configResponse.ok ? await configResponse.json() : null;
    const metrics = metricsResponse.ok ? await metricsResponse.json() : null;
    
    return {
      testId,
      manifest,
      config,
      metrics,
      exists: manifest !== null || config !== null
    };
  } catch (err) {
    // If data doesn't exist, still return testId so navigation works
    // Pages can handle missing data gracefully
    return {
      testId,
      manifest: null,
      config: null,
      metrics: null,
      exists: false
    };
  }
};

