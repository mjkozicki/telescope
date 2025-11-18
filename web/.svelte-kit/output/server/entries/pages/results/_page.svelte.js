import { _ as ensure_array_like, X as stringify, Z as bind_props } from "../../../chunks/index2.js";
import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    const sampleTestId = "2025_11_11_21_24_52_0a417b48";
    function formatTimestamp(timestamp) {
      try {
        const date = new Date(timestamp);
        return date.toLocaleString();
      } catch {
        return timestamp;
      }
    }
    $$renderer2.push(`<div class="section-content"><h2>Test Results</h2> <p>View your performance test results.</p> `);
    if (data.results.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="empty-state svelte-bxfdlt"><p class="svelte-bxfdlt">No test results yet. Run a test to see results here.</p> <p class="sample-link svelte-bxfdlt">Or view the <a${attr("href", `/results/${stringify(sampleTestId)}/overview`)} class="svelte-bxfdlt">sample test result</a> (if available in public/results folder)</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<ul class="results-list svelte-bxfdlt"><!--[-->`);
      const each_array = ensure_array_like(data.results);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let result = each_array[$$index];
        $$renderer2.push(`<li class="result-item svelte-bxfdlt"><a${attr("href", `/results/${stringify(result.id)}/overview`)} class="result-link svelte-bxfdlt"><div class="result-main svelte-bxfdlt"><strong class="result-url svelte-bxfdlt">${escape_html(result.url)}</strong> <div class="result-meta svelte-bxfdlt"><span class="result-browser">${escape_html(result.browser)}</span> <span class="result-time">${escape_html(formatTimestamp(result.timestamp))}</span></div></div> <span class="result-arrow svelte-bxfdlt">→</span></a></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
