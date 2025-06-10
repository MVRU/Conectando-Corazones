import { describe, it, expect, vi } from 'vitest';
import { reducedMotion, motionNoticeVisible } from './reducedMotion';
import * as device from '../utils/device';

// util for refreshing subscription
function getValue(store: any) {
    let value: any;
    const unsubscribe = store.subscribe((v: any) => (value = v));
    unsubscribe();
    return value;
}

describe('reducedMotion store', () => {
    it('activates and shows notice on low-end device', () => {
        vi.spyOn(device, 'isLowEndDevice').mockReturnValue(true);
        const html = document.documentElement;
        html.classList.remove('reduced-motion');

        const val = getValue(reducedMotion);
        expect(val).toBe(true);
        expect(getValue(motionNoticeVisible)).toBe(true);
        expect(html.classList.contains('reduced-motion')).toBe(true);
    });

    it('toggle updates class', () => {
        reducedMotion.set(false);
        expect(document.documentElement.classList.contains('reduced-motion')).toBe(false);
    });
});
