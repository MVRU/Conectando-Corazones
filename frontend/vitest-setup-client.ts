import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

/**
 * * Mocks globales para jsdom
 */

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// TODO: añadir otros mocks si fueran necesarios