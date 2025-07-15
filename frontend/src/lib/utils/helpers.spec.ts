import { describe, it, expect } from 'vitest';
import { getCitiesByProvince, getProvinceByCity } from './helpers';

/**
 * ! Pruebas de mapeo entre provincias y ciudades
 */

describe('getCitiesByProvince', () => {
    it('filtra ciudades de la provincia', () => {
        const cities = getCitiesByProvince('Buenos Aires');
        expect(cities).toContain('La Plata');
    });

    it('no es sensible a mayúsculas o espacios', () => {
        const cities = getCitiesByProvince('  bUeNos aireS ');
        expect(cities).toContain('Mar del Plata');
    });
});

describe('getProvinceByCity', () => {
    it('obtiene la provincia correspondiente', () => {
        expect(getProvinceByCity('Rosario')?.name).toBe('Santa Fe');
    });

    it('retorna undefined si la ciudad no existe', () => {
        expect(getProvinceByCity('Ciudad X')).toBeUndefined();
    });
});