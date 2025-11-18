import './utils-FiC4zhrQ.js';

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

var _layout_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-C-JV_YAm.js')).default;
const universal_id = "src/routes/results/[testId]/+layout.ts";
const imports = ["_app/immutable/nodes/2.D28P-XYn.js","_app/immutable/chunks/BUApaBEI.js","_app/immutable/chunks/B2htzuoC.js","_app/immutable/chunks/Bt75DD1o.js","_app/immutable/chunks/vVpGJ83M.js","_app/immutable/chunks/OhSWhIBa.js","_app/immutable/chunks/BA_UftuP.js","_app/immutable/chunks/DU0NACpz.js","_app/immutable/chunks/FwNjMwio.js","_app/immutable/chunks/8C9uslqf.js","_app/immutable/chunks/DMa23cj2.js","_app/immutable/chunks/B4gnv5C1.js","_app/immutable/chunks/MYImdi6P.js","_app/immutable/chunks/BZVRD660.js","_app/immutable/chunks/CbtQW0rL.js"];
const stylesheets = ["_app/immutable/assets/2.CAFTuNzT.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=2-BUeuI-xj.js.map
