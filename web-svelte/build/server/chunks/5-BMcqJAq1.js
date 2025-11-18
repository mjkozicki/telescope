const load = async ({ fetch }) => {
  try {
    const response = await fetch("/api/results");
    if (!response.ok) {
      console.error("Failed to load results:", response.statusText);
      return { results: [] };
    }
    const results = await response.json();
    return {
      results
    };
  } catch (err) {
    console.error("Error loading results:", err);
    return {
      results: []
    };
  }
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-IUJ_GLqd.js')).default;
const universal_id = "src/routes/results/+page.ts";
const imports = ["_app/immutable/nodes/5.pqgRT75u.js","_app/immutable/chunks/B2htzuoC.js","_app/immutable/chunks/Bt75DD1o.js","_app/immutable/chunks/vVpGJ83M.js","_app/immutable/chunks/OhSWhIBa.js","_app/immutable/chunks/BA_UftuP.js","_app/immutable/chunks/B4gnv5C1.js","_app/immutable/chunks/MYImdi6P.js","_app/immutable/chunks/BZVRD660.js","_app/immutable/chunks/CbtQW0rL.js","_app/immutable/chunks/8C9uslqf.js"];
const stylesheets = ["_app/immutable/assets/5.BmZy5VmB.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=5-BMcqJAq1.js.map
