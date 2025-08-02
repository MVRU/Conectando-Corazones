import { locations } from '$lib/mocks/mock-locations';
import { provinces } from '$lib/data/provinces';

/**
 * ! HELPERS PARA MANIPULAR UBICACIONES
 */

/**
 * -!- Mapa de ciudades por provincia para consultas rápidas
 */
const citiesByProvince: Record<string, string[]> = {};

locations.forEach((loc) => {
    if (!loc.province || !loc.province.name) return;
    const key = loc.province.name.trim().toLowerCase();
    citiesByProvince[key] ??= [];
    citiesByProvince[key].push(loc.name);
});



/**
 * -!- Devuelve todas las ciudades de una provincia específica
*/
export function getCitiesByProvince(provinceName: string): string[] {
    const normalized = provinceName.trim().toLowerCase();
    return citiesByProvince[normalized] ?? [];
}

/** 
 * -!- Obtiene la provincia correspondiente a una ciudad
*/
export function getProvinceByCity(cityName: string) {
    const normalized = cityName.trim().toLowerCase();
    const match = locations.find(
        (loc) => loc.name.trim().toLowerCase() === normalized
    );
    return match?.province;
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


