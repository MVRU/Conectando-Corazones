import { describe, it, expect } from 'vitest';
import { swipe } from './swipe';

/**
 * * DECISIÓN DE DISEÑO:
 *    -*- Se simulan gestos con PointerEvent para validar la acción swipe.
 *    -*- Se cubren direcciones izquierda y derecha para asegurar un comportamiento consistente.
 */

function createSwipeElement(eventName: 'swipe-left' | 'swipe-right') {
    const element = document.createElement('div');
    const events: string[] = [];
    const action = swipe(element, { threshold: 10 });
    element.addEventListener(eventName, () => events.push(eventName));
    return { element, events, destroy: action?.destroy ?? (() => { }) };
}

describe('swipe', () => {
    it('emite swipe-left cuando se arrastra a la izquierda', () => {
        const { element, events, destroy } = createSwipeElement('swipe-left');

        element.dispatchEvent(new MouseEvent('mousedown', { clientX: 100 }));
        window.dispatchEvent(new MouseEvent('mouseup', { clientX: 40 }));

        expect(events).toContain('swipe-left');
        destroy();
    });

    it('emite swipe-right cuando se arrastra a la derecha', () => {
        const { element, events, destroy } = createSwipeElement('swipe-right');

        element.dispatchEvent(new MouseEvent('mousedown', { clientX: 40 }));
        window.dispatchEvent(new MouseEvent('mouseup', { clientX: 100 }));

        expect(events).toContain('swipe-right');
        destroy();
    });
});