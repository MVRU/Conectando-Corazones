// TODO: corregir todo esto

import type { Localidad } from '$lib/domain/types/Localidad';
import { mockLocalidades } from '$lib/infrastructure/mocks/mock-localidades';

/**
 * Caso de uso: Obtener localidades filtradas por provincia
 * 
 * @param idProvincia - ID de la provincia
 * @returns Lista de localidades de la provincia
 * 
 * TODO: Reemplazar mockLocalidades con llamada real a Supabase
 */
export function obtenerLocalidadesPorProvincia(idProvincia: number | undefined): Localidad[] {
	if (idProvincia === undefined) return [];
	return mockLocalidades.filter((l) => l.id_provincia === idProvincia);
}
