import type { Localidad } from '$lib/domain/types/Localidad';
import type { Provincia } from '$lib/domain/types/Provincia';
import type { Proyecto } from '$lib/domain/types/Proyecto';
import { provincias } from '\$lib/domain/types/static-data/provincias';
import { mockLocalidades } from 'tests/mocks/mock-localidades';
import type {
	UbicacionDisyuncion,
	UbicacionPresencial,
	UbicacionVirtual
} from '$lib/domain/types/Ubicacion';

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
export function esUbicacionPresencial(u?: UbicacionDisyuncion): u is UbicacionPresencial {
	return !!u && (u as UbicacionPresencial).modalidad === 'presencial';
}

/**
 * Para verificar si una ubicación es virtual
 */
export function esUbicacionVirtual(u?: UbicacionDisyuncion): u is UbicacionVirtual {
	return !!u && (u as UbicacionVirtual).modalidad === 'virtual';
}

/**
 * Construye una dirección completa desde una ubicación presencial
 */
export function construirDireccionCompleta(u: UbicacionPresencial): string {
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
export function generarUrlGoogleMaps(u: UbicacionPresencial): string | null {
	// Si tiene URL manual, la usa
	if (u.url_google_maps?.trim()) {
		let url = u.url_google_maps.trim();

		// Si no tiene protocolo, agregarlo
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url;
		}

		return url;
	}

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

/**
 * Obtiene todas las provincias disponibles desde un array de proyectos
 * Solo incluye proyectos con ubicaciones presenciales
 */
export function obtenerProvinciasDisponibles(proyectos: Proyecto[]): string[] {
	const provinciasSet = new Set<string>();

	proyectos.forEach((p) => {
		const primeraUbicacion = p.ubicaciones?.[0]?.ubicacion;
		if (primeraUbicacion?.modalidad === 'presencial') {
			const provincia = getProvinciaFromLocalidad(primeraUbicacion.localidad);
			if (provincia?.nombre) {
				provinciasSet.add(provincia.nombre);
			}
		}
	});

	return ['Todas', ...Array.from(provinciasSet).sort()];
}

/**
 * Obtiene todas las localidades disponibles desde un array de proyectos
 * Opcionalmente filtra por provincia
 */
export function obtenerLocalidadesDisponibles(proyectos: Proyecto[], provincia?: string): string[] {
	const localidadesSet = new Set<string>();

	proyectos.forEach((p) => {
		const primeraUbicacion = p.ubicaciones?.[0]?.ubicacion;
		if (primeraUbicacion?.modalidad === 'presencial') {
			// Si se especifica provincia, filtrar por ella
			if (provincia && provincia !== 'Todas') {
				const prov = getProvinciaFromLocalidad(primeraUbicacion.localidad);
				if (prov?.nombre !== provincia) return;
			}

			const localidadNombre = primeraUbicacion.localidad?.nombre;
			if (localidadNombre) {
				localidadesSet.add(localidadNombre);
			}
		}
	});

	return ['Todas', ...Array.from(localidadesSet).sort()];
}

/**
 * Filtra proyectos por localidad específica
 * Solo aplica a proyectos presenciales
 */
export function filtrarPorLocalidad(
	proyectos: Proyecto[],
	localidad: string,
	tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual'
): Proyecto[] {
	if (localidad !== 'Todas' && tipoUbicacion === 'Presencial') {
		return proyectos.filter((p) => {
			const primeraUbicacion = p.ubicaciones?.[0]?.ubicacion;
			if (primeraUbicacion?.modalidad === 'presencial') {
				return primeraUbicacion.localidad?.nombre === localidad;
			}
			return false;
		});
	}
	return proyectos;
}

