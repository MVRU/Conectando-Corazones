// TODO: corregir todo esto

import type { Resena } from '$lib/domain/types/Resena';

/**
 * Caso de uso: Verificar si un usuario ya reseñó a otro usuario
 *
 * @param username - Username del usuario que reseña
 * @param idUsuarioResenado - ID del usuario que recibe la reseña
 * @param resenas - Lista de todas las reseñas
 * @returns true si ya reseñó, false en caso contrario
 */
export function yaResenoUsuario(
	username: string,
	idUsuarioResenado: number | undefined,
	resenas: Resena[]
): boolean {
	if (!username || !idUsuarioResenado) return false;

	const resenasDelUsuario = resenas.filter(
		(r) =>
			r.tipo_objeto === 'usuario' && r.id_objeto === idUsuarioResenado && r.username === username
	);

	return resenasDelUsuario.length > 0;
}
