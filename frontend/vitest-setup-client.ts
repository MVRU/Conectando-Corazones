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

// * Mock para ResizeObserver, requerido por Breadcrumbs
class MockResizeObserver {
	callback: ResizeObserverCallback;
	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}
	observe() { }
	unobserve() { }
	disconnect() { }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = globalThis.ResizeObserver || MockResizeObserver;


// TODO: añadir otros mocks si fueran necesarios