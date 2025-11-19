import { W as store_get, V as slot, Z as unsubscribe_stores, _ as bind_props } from './index2-C-GKnUke.js';
import { p as page } from './stores-Dst42k9g.js';
import { e as escape_html } from './escaping-DvC3sRU6.js';
import { a as attr } from './attributes-ClnnDhOU.js';
import './context-DXUidelg.js';
import './utils-KcIDVAAe.js';
import './state.svelte-CMUqCyss.js';

function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let testId, currentPath, displayId;
    let data = $$props["data"];
    testId = data.testId;
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    currentPath.split("/").pop() || "overview";
    displayId = testId.length > 20 ? "..." + testId.slice(-20) : testId;
    $$renderer2.push(`<div class="result-container svelte-bsdi62">`);
    if (data.config) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="result-header svelte-bsdi62"><div class="result-info svelte-bsdi62"><h2 class="result-title svelte-bsdi62">${escape_html(data.config.url || "Test Result")}</h2> <div class="result-meta svelte-bsdi62"><span class="test-id svelte-bsdi62"${attr("title", testId)}>ID: ${escape_html(displayId)}</span> `);
      if (data.config.browser) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="browser svelte-bsdi62">Browser: ${escape_html(data.config.browser)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.config.connectionType) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="connection svelte-bsdi62">Network: ${escape_html(data.config.connectionType)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (!data.exists) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="result-header warning svelte-bsdi62"><p>⚠️ Test data for <code class="svelte-bsdi62">${escape_html(testId)}</code> not found or still loading.</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> <div class="result-content svelte-bsdi62"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-C-JV_YAm.js.map
