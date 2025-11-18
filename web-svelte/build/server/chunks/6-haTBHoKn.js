import { r as redirect, e as error } from './index-BZ3-vrRK.js';
import './utils-FiC4zhrQ.js';

const load = async ({ params, fetch }) => {
  const { testId } = params;
  try {
    throw redirect(307, `/results/${testId}/overview`);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err && err.status === 307) {
      throw err;
    }
    throw error(404, {
      message: `Test result "${testId}" not found`
    });
  }
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
const universal_id = "src/routes/results/[testId]/+page.ts";
const imports = ["_app/immutable/nodes/6.Dwjv15Z7.js","_app/immutable/chunks/BUApaBEI.js"];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=6-haTBHoKn.js.map
