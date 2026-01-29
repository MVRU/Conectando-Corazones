import type { Proyecto } from '$lib/domain/types/Proyecto';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

/**
 * Caso de uso: Obtener todos los proyectos
 *
 * @returns Lista de todos los proyectos
 */
export async function obtenerTodosLosProyectos(): Promise<Proyecto[]> {
	const repository = new PostgresProyectoRepository();
	return (await repository.findAll()) ?? [];
}
