import { a as attr } from './attributes-ClnnDhOU.js';
import { e as escape_html } from './escaping-DvC3sRU6.js';
import './utils-KcIDVAAe.js';
import './state.svelte-CMUqCyss.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let uploading = false;
    $$renderer2.push(`<div class="section-content"><h2>Upload Results</h2> <p>Upload existing test results for analysis.</p> <form>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-group svelte-tziouu"><label for="files" class="svelte-tziouu">Select result archive (.zip):</label> <input type="file" id="files" name="files" accept=".zip"${attr("disabled", uploading, true)} class="svelte-tziouu"/></div> <button type="submit"${attr("disabled", true, true)} class="svelte-tziouu">${escape_html("Upload")}</button></form></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-5XPY2yd_.js.map
