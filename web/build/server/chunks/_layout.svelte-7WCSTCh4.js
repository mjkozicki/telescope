import { V as slot, W as store_get, X as attr_class, Y as stringify, Z as unsubscribe_stores } from './index2-C-GKnUke.js';
import { p as page } from './stores-Dst42k9g.js';
import { a as attr } from './attributes-ClnnDhOU.js';
import './escaping-DvC3sRU6.js';
import './context-DXUidelg.js';
import './utils-KcIDVAAe.js';
import './state.svelte-CMUqCyss.js';

function Logo($$renderer) {
  $$renderer.push(`<div class="logo-container"><img src="/vite.svg" style="width: 150px; height: 150px;" alt="Logo" class="logo"/></div>`);
}
function Navigation($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let testId, isResultPage, currentPath;
    testId = store_get($$store_subs ??= {}, "$page", page).params.testId;
    isResultPage = store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/results/") && testId;
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<nav class="common-nav">`);
    if (isResultPage) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `/results/${stringify(testId)}/overview`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/overview") })}>Overview</a> <a${attr("href", `/results/${stringify(testId)}/metrics`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/metrics") })}>Metrics</a> <a${attr("href", `/results/${stringify(testId)}/filmstrip`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/filmstrip") })}>Filmstrip</a> <a${attr("href", `/results/${stringify(testId)}/video`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/video") })}>Video</a> <a${attr("href", `/results/${stringify(testId)}/waterfall`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/waterfall") })}>Waterfall</a> <a${attr("href", `/results/${stringify(testId)}/resources`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/resources") })}>Resources</a> <a${attr("href", `/results/${stringify(testId)}/console`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/console") })}>Console</a> <a${attr("href", `/results/${stringify(testId)}/bottlenecks`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/bottlenecks") })}>Bottlenecks</a> <a${attr("href", `/results/${stringify(testId)}/config`)}${attr_class("nav-link svelte-ocbj1u", void 0, { "active": currentPath.endsWith("/config") })}>Config</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="nav-link disabled">Overview</span> <span class="nav-link disabled">Metrics</span> <span class="nav-link disabled">Filmstrip</span> <span class="nav-link disabled">Video</span> <span class="nav-link disabled">Waterfall</span> <span class="nav-link disabled">Resources</span> <span class="nav-link disabled">Console</span> <span class="nav-link disabled">Bottlenecks</span> <span class="nav-link disabled">Config</span>`);
    }
    $$renderer2.push(`<!--]--></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Tabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<header><nav class="tabs"><a href="/"${attr_class("tab svelte-126ak3w", void 0, { "active": currentPath === "/" })}>Simple</a> <a href="/advanced"${attr_class("tab svelte-126ak3w", void 0, { "active": currentPath === "/advanced" })}>Advanced</a> <a href="/results"${attr_class("tab svelte-126ak3w", void 0, { "active": currentPath === "/results" })}>Results</a> <a href="/upload"${attr_class("tab svelte-126ak3w", void 0, { "active": currentPath === "/upload" })}>Upload</a></nav></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.push(`<div class="app">`);
  Logo($$renderer);
  $$renderer.push(`<!----> `);
  Navigation($$renderer);
  $$renderer.push(`<!----> `);
  Tabs($$renderer);
  $$renderer.push(`<!----> <main><div class="content"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div></main></div>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-7WCSTCh4.js.map
