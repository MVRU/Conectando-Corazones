import type { Localidad } from '$lib/types/Localidad';
import type { Provincia } from '$lib/types/Provincia';
import { provincias } from '$lib/data/provincias';
import { mockLocalidades } from '$lib/mocks/mock-localidades';

/**
 * * Getters sencillos
 */

export const getLocalidad = (id: number) =>
    mockLocalidades.find(({ id_localidad }) => id_localidad === id);

export const getProvincia = (id: number) =>
    provincias.find(({ id_provincia }) => id_provincia === id);

/*
 -!- Obtiene la provincia asociada a una localidad
 ? Depende de la lista estática de "provincias"; si se externaliza, ajustar esta util
 */

export function getProvinciaFromLocalidad(localidad?: Localidad): Provincia | undefined {
    const provinciaId = localidad?.id_provincia;
    if (provinciaId === undefined || provinciaId === null) return undefined;
    return provincias.find((p) => p.id_provincia === provinciaId);
}

/*
 -!- Helper para obtener localidades por ID y evitar depender del índice del arreglo mockLocalidades
 */
export const obtenerLocalidadPorId = (id: number): Localidad | undefined =>
    mockLocalidades.find((l) => l.id_localidad === id);

/**
 * -!- Mapa de ciudades por provincia para consultas rápidas
 */
const citiesByProvince: Record<string, string[]> = {};

mockLocalidades.forEach((loc) => {
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
    const match = mockLocalidades.find((loc) => loc.nombre.trim().toLowerCase() === normalized);
    return match?.provincia;
}

/**
 * -!- Devuelve todas las ciudades que coinciden parcial o totalmente con un término de búsqueda
 */
export function searchCities(query: string): string[] {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return [];

    return mockLocalidades
        .filter((loc) => loc.nombre.toLowerCase().includes(lowerQuery))
        .map((loc) => loc.nombre);
}


/**
 * -!- Devuelve todas las provincias disponibles
 */

export function getAllProvinceNames(): string[] {
    return provincias.map((p) => p.nombre).sort((a, b) => a.localeCompare(b));
}