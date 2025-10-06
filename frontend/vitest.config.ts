import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

/**
 * ! DECISIÓN DE DISEÑO
 *  -!- Se extrae la configuración de pruebas en un archivo dedicado para cumplir con SRP y mantener limpio vite.config.ts
 */

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		clearMocks: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/lib/server/**'],
		setupFiles: ['./vitest-setup-client.ts'],
		environmentMatchGlobs: [['src/lib/server/**', 'node']]
	}
});
