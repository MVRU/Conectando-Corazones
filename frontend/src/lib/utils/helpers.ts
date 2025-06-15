import locations from '$lib/data/locations';
import provinces from '$lib/data/provinces';

/**
 * ! HELPERS PARA MANIPULAR UBICACIONES
 */

/**
 * -!- Devuelve todas las ciudades de una provincia específica
 */
export function getCitiesByProvince(provinceName: string): string[] {
    return locations
        .filter((loc) => loc.province.name === provinceName)
        .map((loc) => loc.name);
}

/**
 * -!- Devuelve todas las ciudades que coinciden parcial o totalmente con un término de búsqueda
 */
export function searchCities(query: string): string[] {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return locations
        .filter((loc) => loc.name.toLowerCase().includes(lowerQuery))
        .map((loc) => loc.name);
}