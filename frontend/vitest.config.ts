import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

/**
 * ! DECISIÓN DE DISEÑO
 *  -!- Se extrae la configuración de pruebas en un archivo dedicado para cumplir con SRP y mantener limpio vite.config.ts
 */

const firebaseMock = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
        plugins: [tailwindcss(), sveltekit(), svelteTesting()],
        resolve: {
                alias: {
                        'firebase/app': firebaseMock('./src/lib/services/firebase/__mocks__/firebase-app.ts'),
                        'firebase/auth': firebaseMock('./src/lib/services/firebase/__mocks__/firebase-auth.ts'),
                        'firebase/firestore': firebaseMock('./src/lib/services/firebase/__mocks__/firebase-firestore.ts')
                }
        },
        test: {
                environment: 'jsdom',
                clearMocks: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/lib/server/**'],
		setupFiles: ['./vitest-setup-client.ts'],
		environmentMatchGlobs: [['src/lib/server/**', 'node']]
	}
});
