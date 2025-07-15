import { locations } from '$lib/mocks/mock-locations';
import { provinces } from '$lib/data/provinces';

/**
 * ! HELPERS PARA MANIPULAR UBICACIONES
 */

/**
 * -!- Devuelve todas las ciudades de una provincia específica
 */
export function getCitiesByProvince(provinceName: string): string[] {
    const normalized = provinceName.trim().toLowerCase();

    return locations
        .filter((loc) => loc.province.name.trim().toLowerCase() === normalized)
        .map((loc) => loc.name);
}


/**
 * -!- Devuelve todas las ciudades que coinciden parcial o totalmente con un término de búsqueda
 */
export function searchCities(query: string): string[] {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return [];

    return locations
        .filter((loc) => loc.name.toLowerCase().includes(lowerQuery))
        .map((loc) => loc.name);
}


/**
 * -!- Devuelve todas las provincias disponibles
 */

export function getAllProvinceNames(): string[] {
    return provinces.map((p) => p.name).sort((a, b) => a.localeCompare(b));
}
