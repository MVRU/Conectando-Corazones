import { describe, it, expect } from 'vitest';
import { highlightSearch, isSafeHref } from './sanitize';

/**
 * ! Pruebas de sanitización y resaltado de texto
 */

describe('highlightSearch', () => {
    it('resalta coincidencias básicas', () => {
        const result = highlightSearch('Hola Mundo', 'Mundo');
        expect(result).toContain('<mark');
    });

    it('escapa caracteres peligrosos', () => {
        const result = highlightSearch('<script>alert(1)</script>', '<script>');
        expect(result).not.toContain('<script>');
    });

    it('maneja caracteres de regex', () => {
        const result = highlightSearch('a.b', 'a.b');
        expect(result).toContain('<mark');
    });
});

describe('isSafeHref', () => {
    it('acepta rutas internas', () => {
        expect(isSafeHref('/projects')).toBe(true);
    });
    it('acepta enlaces http', () => {
        expect(isSafeHref('https://example.com')).toBe(true);
    });
    it('rechaza javascript protocol', () => {
        expect(isSafeHref('javascript:alert(1)')).toBe(false);
    });
    it('rechaza protocolo relativo', () => {
        expect(isSafeHref('//malicioso.com')).toBe(false);
    });
});