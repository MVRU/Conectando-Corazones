import type { Proyecto } from '$lib/domain/types/Proyecto';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';

/**
 * Caso de uso: Obtener un proyecto por su ID
 *
 * @param id - ID del proyecto a buscar
 * @returns El proyecto encontrado o undefined si no existe
 */
export async function obtenerProyectoPorId(id: string | number): Promise<Proyecto | undefined> {
	const proyectoId = typeof id === 'string' ? parseInt(id, 10) : id;

	if (isNaN(proyectoId)) {
		return undefined;
	}

	const repository = new MockProyectoRepository();
	return (await repository.findById(proyectoId)) ?? undefined;
}
