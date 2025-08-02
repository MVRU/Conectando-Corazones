import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/**
 * * Configuración base de Vite
 *	-*- Las pruebas se gestionan en vitest.config.ts
 */


export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
