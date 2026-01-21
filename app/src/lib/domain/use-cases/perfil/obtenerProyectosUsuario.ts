import type { Proyecto } from '$lib/domain/types/Proyecto';
import { mockProyectos } from 'tests/mocks/mock-proyectos';

/**
 * Caso de uso: Obtener proyectos de un usuario según su rol
 * 
 * @param idUsuario - ID del usuario
 * @param rol - Rol del usuario ('institucion', 'colaborador', etc.)
 * @returns Lista de proyectos del usuario
 * 
 * TODO: Reemplazar mockProyectos con llamada real a Supabase
 */
export function obtenerProyectosUsuario(idUsuario: number | undefined, rol: string): Proyecto[] {
	if (!idUsuario) return [];

	// Si es institución, devolver proyectos donde es creador
	if (rol === 'institucion') {
		return mockProyectos.filter((p) => p.institucion_id === idUsuario);
	}

	// Si es colaborador, devolver proyectos donde colabora (aprobado)
	return mockProyectos.filter((p) =>
		p.colaboraciones?.some((c) => c.colaborador_id === idUsuario && c.estado === 'aprobada')
	);
}
