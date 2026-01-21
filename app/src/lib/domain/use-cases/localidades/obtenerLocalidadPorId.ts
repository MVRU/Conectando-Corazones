import type { Localidad } from '$lib/domain/types/Localidad';
import { mockLocalidades } from 'tests/mocks/mock-localidades';

/**
 * Caso de uso: Obtener una localidad por su ID
 * 
 * @param idLocalidad - ID de la localidad
 * @returns La localidad encontrada o undefined
 * 
 * TODO: Reemplazar mockLocalidades con llamada real a Supabase
 */
export function obtenerLocalidadPorId(idLocalidad: number | undefined): Localidad | undefined {
	if (!idLocalidad) return undefined;
	return mockLocalidades.find((l) => l.id_localidad === idLocalidad);
}
