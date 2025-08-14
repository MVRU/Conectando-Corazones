// TODO: revisar y corregir errores tras cambios en interfaces

import { localidades } from '$lib/mocks/mock-localidades';
import { provincias } from '$lib/data/provincias';

/**
 * ! HELPERS PARA MANIPULAR UBICACIONES
 */

/**
 * -!- Mapa de ciudades por provincia para consultas rápidas
 */
const citiesByProvince: Record<string, string[]> = {};

localidades.forEach((loc) => {
    if (!loc.provincia || !loc.provincia.nombre) return;
    const key = loc.provincia.nombre.trim().toLowerCase();
    citiesByProvince[key] ??= [];
    citiesByProvince[key].push(loc.nombre);
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
    const match = localidades.find(
        (loc) => loc.nombre.trim().toLowerCase() === normalized
    );
    return match?.provincia;
}

/**
 * -!- Devuelve todas las ciudades que coinciden parcial o totalmente con un término de búsqueda
 */
export function searchCities(query: string): string[] {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return [];

    return localidades
        .filter((loc) => loc.nombre.toLowerCase().includes(lowerQuery))
        .map((loc) => loc.nombre);
}


/**
 * -!- Devuelve todas las provincias disponibles
 */

export function getAllProvinceNames(): string[] {
    return provincias.map((p) => p.nombre).sort((a, b) => a.localeCompare(b));
}