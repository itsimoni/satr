import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */

// svelte.config.js
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: vercel(),
	}
};

export default config;
