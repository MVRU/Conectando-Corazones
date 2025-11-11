import type { Localidad } from '$lib/types/Localidad';
import type { Provincia } from '$lib/types/Provincia';
import { provincias } from '$lib/data/provincias';
import { mockLocalidades } from '$lib/mocks/mock-localidades';

/**
 * * Getters sencillos
 */

export const getLocalidad = (localidadId: number) =>
	mockLocalidades.find(({ id_localidad }) => id_localidad === localidadId);

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
export const obtenerLocalidadPorId = (localidadId: number): Localidad | undefined =>
	mockLocalidades.find((l) => l.id_localidad === localidadId);

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

/**
 * Para verificar si una ubicación es presencial
 */
export function esUbicacionPresencial(u?: import('$lib/types/Ubicacion').UbicacionDisyuncion): u is import('$lib/types/Ubicacion').UbicacionPresencial {
	return !!u && (u as import('$lib/types/Ubicacion').UbicacionPresencial).modalidad === 'presencial';
}

/**
 * Para verificar si una ubicación es virtual
 */
export function esUbicacionVirtual(u?: import('$lib/types/Ubicacion').UbicacionDisyuncion): u is import('$lib/types/Ubicacion').UbicacionVirtual {
	return !!u && (u as import('$lib/types/Ubicacion').UbicacionVirtual).modalidad === 'virtual';
}


/**
 * Construye una dirección completa desde una ubicación presencial
 */
export function construirDireccionCompleta(u: import('$lib/types/Ubicacion').UbicacionPresencial): string {
	const calle = u.calle?.trim();
	const numero = u.numero?.toString().trim();
	const localidad = u.localidad?.nombre?.trim();
	const provincia = u.localidad?.provincia?.nombre?.trim();

	return [[calle, numero].filter(Boolean).join(' '), localidad, provincia]
		.filter(Boolean)
		.join(', ');
}

/**
 * Genera URL de Google Maps desde una ubicación presencial
 * Prioriza url_google_maps manual, sino genera automáticamente
 */
export function generarUrlGoogleMaps(u: import('$lib/types/Ubicacion').UbicacionPresencial): string | null {
	// Si tiene URL manual, la usa
	if (u.url_google_maps?.trim()) return u.url_google_maps;

	// Sino genera automáticamente
	const direccion = construirDireccionCompleta(u);
	return direccion 
		? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}` 
		: null;
}

/**
 * Variante simplificada
 */
export function crearUrlGoogleMapsBasica(direccionCompleta: string): string {
	return `https://maps.google.com/?q=${encodeURIComponent(direccionCompleta)}`;
}

/**
 * Obtiene todas las localidades de una provincia por nombre
 */
export function obtenerLocalidadesPorProvincia(nombreProvincia: string): Localidad[] {
	const provincia = provincias.find((p) => p.nombre === nombreProvincia);
	if (!provincia) return [];
	return mockLocalidades.filter((l) => l.id_provincia === provincia.id_provincia);
}
