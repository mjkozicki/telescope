import { a as attr } from './attributes-ClnnDhOU.js';
import { e as escape_html } from './escaping-DvC3sRU6.js';
import './utils-KcIDVAAe.js';
import './state.svelte-CMUqCyss.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let url = "";
    let browser = "chrome";
    let connectionType = "";
    let cpuThrottle = null;
    let width = 1366;
    let height = 768;
    let blockDomains = "";
    let blockUrls = "";
    let disableJS = false;
    let headers = "";
    let cookies = "";
    let flags = "";
    let firefoxPrefs = "";
    let auth = { username: "", password: "" };
    let frameRate = 1;
    let timeout = 3e4;
    let generateHtml = false;
    let debug = false;
    let submitting = false;
    $$renderer2.push(`<div class="section-content svelte-1z0msvj"><h2>Advanced</h2> <p>Configure advanced testing options with full control over browser behavior, network conditions, and more.</p> <form class="svelte-1z0msvj">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <section class="form-section svelte-1z0msvj"><h3 class="svelte-1z0msvj">Basic Configuration</h3> <div class="form-row svelte-1z0msvj"><div class="form-group svelte-1z0msvj"><label for="url" class="svelte-1z0msvj">URL <span class="required svelte-1z0msvj">*</span></label> <input type="url" id="url"${attr("value", url)} placeholder="https://example.com" required class="svelte-1z0msvj"/></div> <div class="form-group svelte-1z0msvj"><label for="browser" class="svelte-1z0msvj">Browser</label> `);
    $$renderer2.select(
      { id: "browser", value: browser, class: "" },
      ($$renderer3) => {
        $$renderer3.option({ value: "chrome" }, ($$renderer4) => {
          $$renderer4.push(`Chrome`);
        });
        $$renderer3.option({ value: "chrome-beta" }, ($$renderer4) => {
          $$renderer4.push(`Chrome Beta`);
        });
        $$renderer3.option({ value: "canary" }, ($$renderer4) => {
          $$renderer4.push(`Chrome Canary`);
        });
        $$renderer3.option({ value: "edge" }, ($$renderer4) => {
          $$renderer4.push(`Edge`);
        });
        $$renderer3.option({ value: "safari" }, ($$renderer4) => {
          $$renderer4.push(`Safari`);
        });
        $$renderer3.option({ value: "firefox" }, ($$renderer4) => {
          $$renderer4.push(`Firefox`);
        });
      },
      "svelte-1z0msvj"
    );
    $$renderer2.push(`</div></div></section> <section class="form-section svelte-1z0msvj"><h3 class="svelte-1z0msvj">Network &amp; Performance</h3> <div class="form-row svelte-1z0msvj"><div class="form-group svelte-1z0msvj"><label for="connectionType" class="svelte-1z0msvj">Connection Type</label> `);
    $$renderer2.select(
      { id: "connectionType", value: connectionType, class: "" },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`No throttling`);
        });
        $$renderer3.option({ value: "fios" }, ($$renderer4) => {
          $$renderer4.push(`FiOS`);
        });
        $$renderer3.option({ value: "cable" }, ($$renderer4) => {
          $$renderer4.push(`Cable`);
        });
        $$renderer3.option({ value: "dsl" }, ($$renderer4) => {
          $$renderer4.push(`DSL`);
        });
        $$renderer3.option({ value: "4g" }, ($$renderer4) => {
          $$renderer4.push(`4G`);
        });
        $$renderer3.option({ value: "3g" }, ($$renderer4) => {
          $$renderer4.push(`3G`);
        });
        $$renderer3.option({ value: "3gfast" }, ($$renderer4) => {
          $$renderer4.push(`3G Fast`);
        });
        $$renderer3.option({ value: "3gslow" }, ($$renderer4) => {
          $$renderer4.push(`3G Slow`);
        });
        $$renderer3.option({ value: "2g" }, ($$renderer4) => {
          $$renderer4.push(`2G`);
        });
      },
      "svelte-1z0msvj"
    );
    $$renderer2.push(` <span class="help-text svelte-1z0msvj">Network throttling simulation</span></div> <div class="form-group svelte-1z0msvj"><label for="cpuThrottle" class="svelte-1z0msvj">CPU Throttle</label> <input type="number" id="cpuThrottle"${attr("value", cpuThrottle)} min="1" placeholder="e.g. 4" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">CPU throttling factor (higher = slower)</span></div></div> <div class="form-row svelte-1z0msvj"><div class="form-group svelte-1z0msvj"><label for="width" class="svelte-1z0msvj">Viewport Width</label> <input type="number" id="width"${attr("value", width)} min="320" max="3840" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">pixels</span></div> <div class="form-group svelte-1z0msvj"><label for="height" class="svelte-1z0msvj">Viewport Height</label> <input type="number" id="height"${attr("value", height)} min="240" max="2160" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">pixels</span></div></div></section> <section class="form-section svelte-1z0msvj"><h3 class="svelte-1z0msvj">Content Control</h3> <div class="form-group svelte-1z0msvj"><label for="blockDomains" class="svelte-1z0msvj">Block Domains</label> <input type="text" id="blockDomains"${attr("value", blockDomains)} placeholder="ads.example.com, tracker.com" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">Comma-separated list of domains to block</span></div> <div class="form-group svelte-1z0msvj"><label for="blockUrls" class="svelte-1z0msvj">Block URLs</label> <input type="text" id="blockUrls"${attr("value", blockUrls)} placeholder="/ads/, /analytics/" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">Comma-separated list of URL substrings to block</span></div> <div class="form-group checkbox-group svelte-1z0msvj"><label class="svelte-1z0msvj"><input type="checkbox"${attr("checked", disableJS, true)} class="svelte-1z0msvj"/> Disable JavaScript</label></div></section> <section class="form-section svelte-1z0msvj"><h3 class="svelte-1z0msvj">Advanced Settings</h3> <div class="form-group svelte-1z0msvj"><label for="headers" class="svelte-1z0msvj">Custom Headers (JSON)</label> <textarea id="headers" rows="3" placeholder="{&quot;User-Agent&quot;: &quot;CustomBot/1.0&quot;, &quot;X-Custom&quot;: &quot;value&quot;}" class="svelte-1z0msvj">`);
    const $$body = escape_html(headers);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <span class="help-text svelte-1z0msvj">JSON object of HTTP headers</span></div> <div class="form-group svelte-1z0msvj"><label for="cookies" class="svelte-1z0msvj">Custom Cookies (JSON)</label> <textarea id="cookies" rows="3" placeholder="{&quot;session&quot;: &quot;abc123&quot;, &quot;preference&quot;: &quot;dark&quot;}" class="svelte-1z0msvj">`);
    const $$body_1 = escape_html(cookies);
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea> <span class="help-text svelte-1z0msvj">JSON object of cookies</span></div> <div class="form-group svelte-1z0msvj"><label for="flags" class="svelte-1z0msvj">Chrome Flags</label> <input type="text" id="flags"${attr("value", flags)} placeholder="--disable-gpu,--no-sandbox" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">Comma-separated Chromium flags</span></div> <div class="form-group svelte-1z0msvj"><label for="firefoxPrefs" class="svelte-1z0msvj">Firefox Preferences (JSON)</label> <textarea id="firefoxPrefs" rows="3" placeholder="{&quot;network.trr.mode&quot;: 2}" class="svelte-1z0msvj">`);
    const $$body_2 = escape_html(firefoxPrefs);
    if ($$body_2) {
      $$renderer2.push(`${$$body_2}`);
    }
    $$renderer2.push(`</textarea> <span class="help-text svelte-1z0msvj">Firefox user preferences (Firefox only)</span></div> <div class="auth-group svelte-1z0msvj"><p class="auth-label svelte-1z0msvj">HTTP Basic Authentication</p> <div class="form-row svelte-1z0msvj"><div class="form-group svelte-1z0msvj"><input type="text"${attr("value", auth.username)} placeholder="Username" class="svelte-1z0msvj"/></div> <div class="form-group svelte-1z0msvj"><input type="password"${attr("value", auth.password)} placeholder="Password" class="svelte-1z0msvj"/></div></div></div></section> <section class="form-section svelte-1z0msvj"><h3 class="svelte-1z0msvj">Recording Options</h3> <div class="form-row svelte-1z0msvj"><div class="form-group svelte-1z0msvj"><label for="frameRate" class="svelte-1z0msvj">Filmstrip Frame Rate</label> <input type="number" id="frameRate"${attr("value", frameRate)} min="1" max="60" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">frames per second</span></div> <div class="form-group svelte-1z0msvj"><label for="timeout" class="svelte-1z0msvj">Test Timeout</label> <input type="number" id="timeout"${attr("value", timeout)} min="5000" step="1000" class="svelte-1z0msvj"/> <span class="help-text svelte-1z0msvj">milliseconds</span></div></div> <div class="form-group checkbox-group svelte-1z0msvj"><label class="svelte-1z0msvj"><input type="checkbox"${attr("checked", generateHtml, true)} class="svelte-1z0msvj"/> Generate HTML Report</label></div> <div class="form-group checkbox-group svelte-1z0msvj"><label class="svelte-1z0msvj"><input type="checkbox"${attr("checked", debug, true)} class="svelte-1z0msvj"/> Enable Debug Output</label></div></section> <button type="submit" class="submit-button svelte-1z0msvj"${attr("disabled", submitting, true)}>${escape_html("Run Advanced Test")}</button></form></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-JNXS6PE_.js.map
