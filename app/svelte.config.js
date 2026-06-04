import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ runtime: 'nodejs22.x' }),
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;
