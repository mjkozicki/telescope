const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","vite.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.DdQTJXuD.js",app:"_app/immutable/entry/app.DPXFnAad.js",imports:["_app/immutable/entry/start.DdQTJXuD.js","_app/immutable/chunks/FwNjMwio.js","_app/immutable/chunks/Bt75DD1o.js","_app/immutable/chunks/8C9uslqf.js","_app/immutable/chunks/BUApaBEI.js","_app/immutable/chunks/DMa23cj2.js","_app/immutable/entry/app.DPXFnAad.js","_app/immutable/chunks/Bt75DD1o.js","_app/immutable/chunks/OhSWhIBa.js","_app/immutable/chunks/B2htzuoC.js","_app/immutable/chunks/DMa23cj2.js","_app/immutable/chunks/BA_UftuP.js","_app/immutable/chunks/BZVRD660.js","_app/immutable/chunks/CbtQW0rL.js","_app/immutable/chunks/8C9uslqf.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CUbEI_jM.js')),
			__memo(() => import('./chunks/1-Bkos3U7t.js')),
			__memo(() => import('./chunks/2-BUeuI-xj.js')),
			__memo(() => import('./chunks/3-DXX30kQ7.js')),
			__memo(() => import('./chunks/4-D-55065_.js')),
			__memo(() => import('./chunks/5-BMcqJAq1.js')),
			__memo(() => import('./chunks/6-haTBHoKn.js')),
			__memo(() => import('./chunks/7-CFLUU-nC.js')),
			__memo(() => import('./chunks/8-BJEsyebM.js')),
			__memo(() => import('./chunks/9-Dd6ZrEVE.js')),
			__memo(() => import('./chunks/10-DpvZMrJv.js')),
			__memo(() => import('./chunks/11-DlylFlxZ.js')),
			__memo(() => import('./chunks/12-lYKMqfpC.js')),
			__memo(() => import('./chunks/13-BNVAaIE8.js')),
			__memo(() => import('./chunks/14-DsDf3Khb.js')),
			__memo(() => import('./chunks/15-rzGXPyaR.js')),
			__memo(() => import('./chunks/16-DeIUfFP7.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/advanced",
				pattern: /^\/advanced\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/api/results",
				pattern: /^\/api\/results\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CQEmMaky.js'))
			},
			{
				id: "/api/submit-test",
				pattern: /^\/api\/submit-test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CkVPQA-t.js'))
			},
			{
				id: "/api/upload",
				pattern: /^\/api\/upload\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DoLH5j0t.js'))
			},
			{
				id: "/results",
				pattern: /^\/results\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/results/[testId]",
				pattern: /^\/results\/([^/]+?)\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/results/[testId]/bottlenecks",
				pattern: /^\/results\/([^/]+?)\/bottlenecks\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/results/[testId]/config",
				pattern: /^\/results\/([^/]+?)\/config\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/results/[testId]/console",
				pattern: /^\/results\/([^/]+?)\/console\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/results/[testId]/filmstrip",
				pattern: /^\/results\/([^/]+?)\/filmstrip\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/results/[testId]/metrics",
				pattern: /^\/results\/([^/]+?)\/metrics\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/results/[testId]/overview",
				pattern: /^\/results\/([^/]+?)\/overview\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/results/[testId]/resources",
				pattern: /^\/results\/([^/]+?)\/resources\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/results/[testId]/video",
				pattern: /^\/results\/([^/]+?)\/video\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/results/[testId]/waterfall",
				pattern: /^\/results\/([^/]+?)\/waterfall\/?$/,
				params: [{"name":"testId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/upload",
				pattern: /^\/upload\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
