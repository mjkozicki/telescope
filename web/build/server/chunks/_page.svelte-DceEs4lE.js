import { a as attr } from './attributes-ClnnDhOU.js';
import { e as escape_html } from './escaping-DvC3sRU6.js';
import './utils-KcIDVAAe.js';
import './state.svelte-CMUqCyss.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let url = "";
    let browser = "chrome";
    let submitting = false;
    $$renderer2.push(`<div class="section-content"><h2>Simple</h2> <p>Simple is a simple way to test your website.</p> <form>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-group svelte-1uha8ag"><label for="url" class="svelte-1uha8ag">URL:</label> <input type="text" id="url" name="url"${attr("value", url)} placeholder="https://example.com"${attr("disabled", submitting, true)} class="svelte-1uha8ag"/></div> <div class="form-group svelte-1uha8ag"><label for="browser" class="svelte-1uha8ag">Browser:</label> `);
    $$renderer2.select(
      {
        id: "browser",
        name: "browser",
        value: browser,
        disabled: submitting,
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "chrome" }, ($$renderer4) => {
          $$renderer4.push(`Chrome`);
        });
        $$renderer3.option({ value: "firefox" }, ($$renderer4) => {
          $$renderer4.push(`Firefox`);
        });
        $$renderer3.option({ value: "edge" }, ($$renderer4) => {
          $$renderer4.push(`Edge`);
        });
        $$renderer3.option({ value: "safari" }, ($$renderer4) => {
          $$renderer4.push(`Safari`);
        });
      },
      "svelte-1uha8ag"
    );
    $$renderer2.push(`</div> <button type="submit"${attr("disabled", submitting, true)} class="svelte-1uha8ag">${escape_html("Run Test")}</button></form></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DceEs4lE.js.map
