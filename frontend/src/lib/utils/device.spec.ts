import { describe, it, expect } from 'vitest';
import { isLowEndDevice } from './device';

/**
 * ! Test para la función isLowEndDevice
 * 
 * Esta función detecta si el dispositivo es de bajo rendimiento
 * según características como hardwareConcurrency, deviceMemory y userAgent.
 */

describe('isLowEndDevice', () => {
    // Debe detectar dispositivos con pocos núcleos de CPU como low-end
    it('detects low hardware concurrency', () => {
        // Simula un navegador con solo 2 núcleos de CPU
        const nav: any = { hardwareConcurrency: 2, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    // Debe detectar user agents móviles como low-end
    it('detects mobile user agent', () => {
        // Simula un navegador con userAgent de iPhone
        const nav: any = { hardwareConcurrency: 8, userAgent: 'iPhone', connection: {} };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    // Debe retornar false para dispositivos de escritorio potentes
    it('returns false on high-end desktop', () => {
        // Simula un navegador de escritorio con buena memoria y CPU
        const nav: any = { hardwareConcurrency: 8, deviceMemory: 8, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(false);
    });
});
