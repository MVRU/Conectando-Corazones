import type { Proyecto } from '$lib/domain/types/Proyecto';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';

/**
 * Caso de uso: Obtener todos los proyectos
 *
 * @returns Lista de todos los proyectos
 */
export async function obtenerTodosLosProyectos(): Promise<Proyecto[]> {
	const repository = new MockProyectoRepository();
	return (await repository.findAll()) ?? [];
}
