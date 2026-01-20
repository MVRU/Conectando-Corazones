import '@testing-library/jest-dom/vitest';
// import { vi } from 'vitest';

/**
 * * Mocks globales para jsdom
 */

const buildMatchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false
});

Object.defineProperty(window, 'matchMedia', {
        writable: true,
        enumerable: true,
        value: buildMatchMedia
});

Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        enumerable: true,
        value: buildMatchMedia
});

// * Mock para ResizeObserver, requerido por Breadcrumbs
class MockResizeObserver {
	callback: ResizeObserverCallback;
	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}
	observe() {}
	unobserve() {}
	disconnect() {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = globalThis.ResizeObserver || MockResizeObserver;
