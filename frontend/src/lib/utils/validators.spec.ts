import { describe, it, expect } from 'vitest';
import { isValidCityInProvince } from './validators';

/**
 * ! Pruebas para validar relación ciudad-provincias
 */

describe('isValidCityInProvince', () => {
    it('confirma ciudad válida', () => {
        expect(isValidCityInProvince('Rosario', 'Santa Fe')).toBe(true);
    });

    it('detecta ciudad en provincia incorrecta', () => {
        expect(isValidCityInProvince('Rosario', 'Buenos Aires')).toBe(false);
    });
});