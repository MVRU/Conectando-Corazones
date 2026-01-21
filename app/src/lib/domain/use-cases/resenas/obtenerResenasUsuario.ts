// TODO: corregir todo esto

import type { Resena } from '$lib/domain/types/Resena';
import { filtrarResenasPorTipo } from '$lib/utils/resenas';

/**
 * Caso de uso: Obtener reseñas de un usuario
 * 
 * @param idUsuario - ID del usuario
 * @param resenas - Lista de todas las reseñas
 * @returns Lista de reseñas del usuario
 */
export function obtenerResenasUsuario(idUsuario: number | undefined, resenas: Resena[]): Resena[] {
	if (!idUsuario) return [];
	return filtrarResenasPorTipo(resenas, 'usuario', idUsuario);
}
