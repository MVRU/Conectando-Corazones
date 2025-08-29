/**
 * * DECISIÓN DE DISEÑO:
 *    -*- Se implementa una acción genérica de swipe para detectar gestos
 *    -*- horizontales. Se centraliza la lógica para reutilizarla en distintos
 *    -*- componentes y mantener un código limpio.
 */

import type { Action } from 'svelte/action';

export interface SwipeParams {
	threshold?: number;
}

export interface SwipeEvents {
	'swipe-left': CustomEvent<void>;
	'swipe-right': CustomEvent<void>;
}

export const swipe: Action<HTMLElement, SwipeParams, SwipeEvents> = (
	node,
	{ threshold = 40 } = {}
) => {
	let startX = 0;
	let dragging = false;

	function getPoint(event: TouchEvent | PointerEvent | MouseEvent) {
		if ('changedTouches' in event) return event.changedTouches[0];
		return event;
	}

	function onStart(event: TouchEvent | PointerEvent | MouseEvent) {
		const point = getPoint(event);
		startX = point.clientX;
		dragging = true;

		window.addEventListener('touchend', onEnd, { once: true });
		window.addEventListener('mouseup', onEnd, { once: true });
		window.addEventListener('pointerup', onEnd, { once: true });
	}

	function onEnd(event: TouchEvent | PointerEvent | MouseEvent) {
		if (!dragging) return;
		dragging = false;

		const point = getPoint(event);
		const deltaX = point.clientX - startX;
		if (Math.abs(deltaX) < threshold) return;

		const direction = deltaX < 0 ? 'swipe-left' : 'swipe-right';
		node.dispatchEvent(new CustomEvent(direction));
	}

	node.addEventListener('touchstart', onStart, { passive: true });
	node.addEventListener('mousedown', onStart);
	node.addEventListener('pointerdown', onStart);

	return {
		destroy() {
			node.removeEventListener('touchstart', onStart);
			node.removeEventListener('mousedown', onStart);
			node.removeEventListener('pointerdown', onStart);
		}
	};
};
