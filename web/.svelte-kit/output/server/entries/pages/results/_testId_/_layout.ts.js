import "@sveltejs/kit";
const load = async ({ params, fetch }) => {
  const { testId } = params;
  try {
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
    return {
      testId,
      manifest: null,
      config: null,
      metrics: null,
      exists: false
    };
  }
};
export {
  load
};
