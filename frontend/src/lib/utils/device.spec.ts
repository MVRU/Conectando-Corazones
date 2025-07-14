import { describe, it, expect } from 'vitest';
import { isLowEndDevice, hasSlowConnection } from './device';

/**
 * ! Tests para la detección de dispositivos de gama baja
 *
 * -*- Se cubren casos de CPU, memoria, conexión y combinación en móviles.
 * -*- Garantiza que la lógica se active correctamente.
 */

describe('isLowEndDevice', () => {
    // Debe detectar dispositivos con pocos núcleos de CPU como low-end
    it('detects low hardware concurrency', () => {
        // Simula un navegador con solo 2 núcleos de CPU
        const nav: any = { hardwareConcurrency: 2, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    // ? Un móvil por sí solo no debe considerarse low-end
    it('ignores mobile user agent when resources are high', () => {
        const nav: any = { hardwareConcurrency: 8, userAgent: 'iPhone', connection: {} };
        expect(isLowEndDevice(nav)).toBe(false);
    });

    // Debe detectar poca memoria como dispositivo lento
    it('detects low device memory', () => {
        const nav: any = { hardwareConcurrency: 8, deviceMemory: 2, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    // Debe detectar conexiones lentas
    it('detects slow network', () => {
        const nav: any = { connection: { effectiveType: '2g' }, userAgent: 'Test', hardwareConcurrency: 8 };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    // Debe detectar móviles con mala conexión
    it('detects mobile with slow connection', () => {
        const nav: any = { userAgent: 'Android', connection: { downlink: 0.5 }, hardwareConcurrency: 8 };
        expect(isLowEndDevice(nav)).toBe(true);
    });

    // Debe retornar false para dispositivos de escritorio potentes
    it('returns false on high-end desktop', () => {
        // Simula un navegador de escritorio con buena memoria y CPU
        const nav: any = { hardwareConcurrency: 8, deviceMemory: 8, userAgent: 'Test', connection: {} };
        expect(isLowEndDevice(nav)).toBe(false);
    });
});

describe('hasSlowConnection', () => {
    // Debe detectar el modo ahorro de datos
    it('detects save-data preference', () => {
        const nav: any = { connection: { saveData: true } };
        expect(hasSlowConnection(nav)).toBe(true);
    });

    // Debe detectar tipo de conexión 2G
    it('detects 2g connection', () => {
        const nav: any = { connection: { effectiveType: '2g' } };
        expect(hasSlowConnection(nav)).toBe(true);
    });

    // Debe detectar downlink por debajo de 1 Mbps
    it('detects low downlink', () => {
        const nav: any = { connection: { downlink: 0.8 } };
        expect(hasSlowConnection(nav)).toBe(true);
    });

    // No debe marcar como lenta una conexión rápida
    it('returns false on fast connection', () => {
        const nav: any = { connection: { effectiveType: '4g', downlink: 10 } };
        expect(hasSlowConnection(nav)).toBe(false);
    });
});