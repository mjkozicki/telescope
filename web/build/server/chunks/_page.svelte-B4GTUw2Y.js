import { _ as bind_props } from './index2-C-GKnUke.js';
import { e as escape_html } from './escaping-DvC3sRU6.js';
import './attributes-ClnnDhOU.js';
import './context-DXUidelg.js';

function _page($$renderer, $$props) {
  let testData;
  let data = $$props["data"];
  testData = data;
  $$renderer.push(`<div class="section-content"><h2>Overview</h2> <p>Test overview and summary metrics.</p> `);
  if (testData.metrics) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="metrics-grid svelte-zlig2h"><div class="metric-card svelte-zlig2h"><h3 class="svelte-zlig2h">Performance Score</h3> <p class="metric-value svelte-zlig2h">${escape_html(testData.metrics.performanceScore || "N/A")}</p></div> `);
    if (testData.metrics.firstContentfulPaint) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<div class="metric-card svelte-zlig2h"><h3 class="svelte-zlig2h">First Contentful Paint</h3> <p class="metric-value svelte-zlig2h">${escape_html(testData.metrics.firstContentfulPaint)}ms</p></div>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--> `);
    if (testData.metrics.largestContentfulPaint) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<div class="metric-card svelte-zlig2h"><h3 class="svelte-zlig2h">Largest Contentful Paint</h3> <p class="metric-value svelte-zlig2h">${escape_html(testData.metrics.largestContentfulPaint)}ms</p></div>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--> `);
    if (testData.metrics.timeToInteractive) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<div class="metric-card svelte-zlig2h"><h3 class="svelte-zlig2h">Time to Interactive</h3> <p class="metric-value svelte-zlig2h">${escape_html(testData.metrics.timeToInteractive)}ms</p></div>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--></div>`);
  } else {
    $$renderer.push("<!--[!-->");
    $$renderer.push(`<p class="placeholder svelte-zlig2h">Result data will be displayed here when available.</p>`);
  }
  $$renderer.push(`<!--]--></div>`);
  bind_props($$props, { data });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B4GTUw2Y.js.map
