import { describe, it, expect } from 'vitest';
import { swipe } from './swipe';

/**
 * ! Tests de la acción swipe
 */

// describe('swipe action', () => {
//     it('emite swipe-left cuando se arrastra a la izquierda', () => {
//         const div = document.createElement('div');
//         const events: string[] = [];
//         const action = swipe(div, { threshold: 10 });
//         div.addEventListener('swipe-left', () => events.push('left'));

//         div.dispatchEvent(new PointerEvent('mousedown', { clientX: 100 }));
//         div.dispatchEvent(new PointerEvent('mouseup', { clientX: 50 }));

//         expect(events).toContain('left');
//         action.destroy();
//     });

//     it('emite swipe-right cuando se arrastra a la derecha', () => {
//         const div = document.createElement('div');
//         const events: string[] = [];
//         const action = swipe(div, { threshold: 10 });
//         div.addEventListener('swipe-right', () => events.push('right'));

//         div.dispatchEvent(new PointerEvent('mousedown', { clientX: 50 }));
//         div.dispatchEvent(new PointerEvent('mouseup', { clientX: 80 }));

//         expect(events).toContain('right');
//         action.destroy();
//     });
// });