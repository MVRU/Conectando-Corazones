import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

/**
 * ! DECISIÓN DE DISEÑO
 *  -!- Tests centralizados en carpeta tests/ para mejor organización y mantenibilidad
 */

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		clearMocks: true,
		globals: true,
		include: [
			'src/**/*.{test,spec}.{js,ts}',
			'tests/**/*.test.{js,ts}'
		],
		exclude: ['src/lib/server/**', 'node_modules', '**/node_modules/**'],
		setupFiles: ['./vitest-setup-client.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'**/*.spec.ts',
				'**/*.test.ts',
				'**/node_modules/**',
				'**/tests/**',
				'**/.svelte-kit/**'
			]
		}
	}
});
