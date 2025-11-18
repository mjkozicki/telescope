
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/advanced" | "/api" | "/api/results" | "/api/results/[testId]" | "/api/submit-test" | "/api/upload" | "/results" | "/results/[testId]" | "/results/[testId]/bottlenecks" | "/results/[testId]/config" | "/results/[testId]/console" | "/results/[testId]/filmstrip" | "/results/[testId]/metrics" | "/results/[testId]/overview" | "/results/[testId]/resources" | "/results/[testId]/video" | "/results/[testId]/waterfall" | "/upload";
		RouteParams(): {
			"/api/results/[testId]": { testId: string };
			"/results/[testId]": { testId: string };
			"/results/[testId]/bottlenecks": { testId: string };
			"/results/[testId]/config": { testId: string };
			"/results/[testId]/console": { testId: string };
			"/results/[testId]/filmstrip": { testId: string };
			"/results/[testId]/metrics": { testId: string };
			"/results/[testId]/overview": { testId: string };
			"/results/[testId]/resources": { testId: string };
			"/results/[testId]/video": { testId: string };
			"/results/[testId]/waterfall": { testId: string }
		};
		LayoutParams(): {
			"/": { testId?: string };
			"/advanced": Record<string, never>;
			"/api": { testId?: string };
			"/api/results": { testId?: string };
			"/api/results/[testId]": { testId: string };
			"/api/submit-test": Record<string, never>;
			"/api/upload": Record<string, never>;
			"/results": { testId?: string };
			"/results/[testId]": { testId: string };
			"/results/[testId]/bottlenecks": { testId: string };
			"/results/[testId]/config": { testId: string };
			"/results/[testId]/console": { testId: string };
			"/results/[testId]/filmstrip": { testId: string };
			"/results/[testId]/metrics": { testId: string };
			"/results/[testId]/overview": { testId: string };
			"/results/[testId]/resources": { testId: string };
			"/results/[testId]/video": { testId: string };
			"/results/[testId]/waterfall": { testId: string };
			"/upload": Record<string, never>
		};
		Pathname(): "/" | "/advanced" | "/advanced/" | "/api" | "/api/" | "/api/results" | "/api/results/" | `/api/results/${string}` & {} | `/api/results/${string}/` & {} | "/api/submit-test" | "/api/submit-test/" | "/api/upload" | "/api/upload/" | "/results" | "/results/" | `/results/${string}` & {} | `/results/${string}/` & {} | `/results/${string}/bottlenecks` & {} | `/results/${string}/bottlenecks/` & {} | `/results/${string}/config` & {} | `/results/${string}/config/` & {} | `/results/${string}/console` & {} | `/results/${string}/console/` & {} | `/results/${string}/filmstrip` & {} | `/results/${string}/filmstrip/` & {} | `/results/${string}/metrics` & {} | `/results/${string}/metrics/` & {} | `/results/${string}/overview` & {} | `/results/${string}/overview/` & {} | `/results/${string}/resources` & {} | `/results/${string}/resources/` & {} | `/results/${string}/video` & {} | `/results/${string}/video/` & {} | `/results/${string}/waterfall` & {} | `/results/${string}/waterfall/` & {} | "/upload" | "/upload/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/test-results/2025_11_11_21_24_52_0a417b48/3c141275bff7c93ec1c0695b1a603b52.webm" | "/test-results/2025_11_11_21_24_52_0a417b48/config.json" | "/test-results/2025_11_11_21_24_52_0a417b48/console.json" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_001_1.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_002_2.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_003_3.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_004_4.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_005_5.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_006_6.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_007_7.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_008_8.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_009_9.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/filmstrip/frame_010_10.jpg" | "/test-results/2025_11_11_21_24_52_0a417b48/manifest.json" | "/test-results/2025_11_11_21_24_52_0a417b48/metrics.json" | "/test-results/2025_11_11_21_24_52_0a417b48/pageload.har" | "/test-results/2025_11_11_21_24_52_0a417b48/resources.json" | "/test-results/2025_11_11_21_24_52_0a417b48/results.json" | "/test-results/2025_11_11_21_24_52_0a417b48/screenshot.png" | "/vite.svg" | string & {};
	}
}