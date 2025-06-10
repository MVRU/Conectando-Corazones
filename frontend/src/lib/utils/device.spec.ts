import { describe, it, expect } from 'vitest';
import { isLowEndDevice } from './device';

describe('isLowEndDevice', () => {
    it('detects low hardware concurrency', () => {
        const nav: any = { hardwareConcurrency: 2, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    it('detects mobile user agent', () => {
        const nav: any = { hardwareConcurrency: 8, userAgent: 'iPhone', connection: {} };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    it('returns false on high-end desktop', () => {
        const nav: any = { hardwareConcurrency: 8, deviceMemory: 8, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(false);
    });
});
