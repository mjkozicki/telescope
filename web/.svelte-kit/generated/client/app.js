export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/advanced": [4],
		"/results": [5],
		"/results/[testId]": [6,[2]],
		"/results/[testId]/bottlenecks": [7,[2]],
		"/results/[testId]/config": [8,[2]],
		"/results/[testId]/console": [9,[2]],
		"/results/[testId]/filmstrip": [10,[2]],
		"/results/[testId]/metrics": [11,[2]],
		"/results/[testId]/overview": [12,[2]],
		"/results/[testId]/resources": [13,[2]],
		"/results/[testId]/video": [14,[2]],
		"/results/[testId]/waterfall": [15,[2]],
		"/upload": [16]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';