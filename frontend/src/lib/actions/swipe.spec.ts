import { describe, it, expect, afterEach } from 'vitest';
import { swipe } from './swipe';

/**
 * * DECISIÓN DE DISEÑO:
 *    -*- Se simulan gestos con MouseEvent, TouchEvent y PointerEvent para validar la acción swipe.
 *    -*- Se cubren direcciones izquierda y derecha para asegurar un comportamiento consistente.
 *    -*- Se valida el threshold y el cleanup de event listeners.
 */

interface SwipeTestContext {
	element: HTMLElement;
	events: string[];
	destroy: () => void;
}

function createSwipeElement(
	eventName: 'swipeleft' | 'swiperight',
	threshold = 10
): SwipeTestContext {
	const element = document.createElement('div');
	const events: string[] = [];
	const action = swipe(element, { threshold });
	element.addEventListener(eventName, () => events.push(eventName));
	return { element, events, destroy: action?.destroy ?? (() => { }) };
}

describe('swipe', () => {
	const contexts: SwipeTestContext[] = [];

	afterEach(() => {
		// Cleanup all test contexts
		contexts.forEach((ctx) => ctx.destroy());
		contexts.length = 0;
	});

	describe('Mouse Events', () => {
		it('emite swipeleft cuando se arrastra a la izquierda', () => {
			const ctx = createSwipeElement('swipeleft');
			contexts.push(ctx);

			// Simulate swipe left: start at 100, end at 40 (delta = -60)
			ctx.element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 40, bubbles: true }));

			expect(ctx.events).toContain('swipeleft');
		});

		it('emite swiperight cuando se arrastra a la derecha', () => {
			const ctx = createSwipeElement('swiperight');
			contexts.push(ctx);

			// Simulate swipe right: start at 40, end at 100 (delta = +60)
			ctx.element.dispatchEvent(new MouseEvent('mousedown', { clientX: 40, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, bubbles: true }));

			expect(ctx.events).toContain('swiperight');
		});

		it('no emite eventos cuando el movimiento es menor al threshold', () => {
			const ctx = createSwipeElement('swipeleft', 50);
			contexts.push(ctx);

			// Simulate small movement: delta = -30, threshold = 50
			ctx.element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 70, bubbles: true }));

			expect(ctx.events).toHaveLength(0);
		});
	});

	describe('Touch Events', () => {
		it('emite swipeleft con touch events', () => {
			const ctx = createSwipeElement('swipeleft');
			contexts.push(ctx);

			// Simulate touch swipe left
			const touchStart = new TouchEvent('touchstart', {
				changedTouches: [{ clientX: 100 } as Touch],
				bubbles: true
			});
			const touchEnd = new TouchEvent('touchend', {
				changedTouches: [{ clientX: 40 } as Touch],
				bubbles: true
			});

			ctx.element.dispatchEvent(touchStart);
			window.dispatchEvent(touchEnd);

			expect(ctx.events).toContain('swipeleft');
		});

		it('emite swiperight con touch events', () => {
			const ctx = createSwipeElement('swiperight');
			contexts.push(ctx);

			// Simulate touch swipe right
			const touchStart = new TouchEvent('touchstart', {
				changedTouches: [{ clientX: 40 } as Touch],
				bubbles: true
			});
			const touchEnd = new TouchEvent('touchend', {
				changedTouches: [{ clientX: 100 } as Touch],
				bubbles: true
			});

			ctx.element.dispatchEvent(touchStart);
			window.dispatchEvent(touchEnd);

			expect(ctx.events).toContain('swiperight');
		});
	});

	describe('Pointer Events', () => {
		it('emite swipeleft con pointer events', () => {
			const ctx = createSwipeElement('swipeleft');
			contexts.push(ctx);

			// Simulate pointer swipe left using MouseEvent (PointerEvent extends MouseEvent)
			ctx.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('pointerup', { clientX: 40, bubbles: true }));

			expect(ctx.events).toContain('swipeleft');
		});

		it('emite swiperight con pointer events', () => {
			const ctx = createSwipeElement('swiperight');
			contexts.push(ctx);

			// Simulate pointer swipe right using MouseEvent (PointerEvent extends MouseEvent)
			ctx.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 40, bubbles: true }));
			window.dispatchEvent(new MouseEvent('pointerup', { clientX: 100, bubbles: true }));

			expect(ctx.events).toContain('swiperight');
		});
	});

	describe('Threshold', () => {
		it('respeta el threshold personalizado', () => {
			const ctx = createSwipeElement('swipeleft', 100);
			contexts.push(ctx);

			// Movement of 50 should not trigger with threshold of 100
			ctx.element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, bubbles: true }));

			expect(ctx.events).toHaveLength(0);
		});

		it('usa threshold por defecto de 40', () => {
			const element = document.createElement('div');
			const events: string[] = [];
			const action = swipe(element, {}); // No threshold specified, should use default 40
			element.addEventListener('swipeleft', () => events.push('swipeleft'));
			contexts.push({ element, events, destroy: action?.destroy ?? (() => { }) });

			// Movement of 30 should not trigger with default threshold of 40
			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 70, bubbles: true }));

			expect(events).toHaveLength(0);

			// Movement of 50 should trigger with default threshold of 40
			element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, bubbles: true }));

			expect(events).toContain('swipeleft');
		});
	});

	describe('Cleanup', () => {
		it('remueve event listeners al destruir', () => {
			const ctx = createSwipeElement('swipeleft');

			// Verify it works before destroy
			ctx.element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 40, bubbles: true }));
			expect(ctx.events).toContain('swipeleft');

			// Destroy and verify it no longer works
			ctx.destroy();
			ctx.events.length = 0; // Clear events array

			ctx.element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, bubbles: true }));
			window.dispatchEvent(new MouseEvent('mouseup', { clientX: 40, bubbles: true }));
			expect(ctx.events).toHaveLength(0);
		});
	});
});
