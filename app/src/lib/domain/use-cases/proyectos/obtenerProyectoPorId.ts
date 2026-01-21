// TODO: corregir todo esto

import type { Proyecto } from '$lib/domain/types/Proyecto';
import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';

/**
 * Caso de uso: Obtener un proyecto por su ID
 *
 * @param id - ID del proyecto a buscar
 * @returns El proyecto encontrado o undefined si no existe
 *
 * TODO: Reemplazar mockProyectos con llamada real a Supabase
 */
export async function obtenerProyectoPorId(id: string | number): Promise<Proyecto | undefined> {
	const proyectoId = typeof id === 'string' ? parseInt(id, 10) : id;

	if (isNaN(proyectoId)) {
		return undefined;
	}

	// TODO: Reemplazar con repositorio real
	// const repository = new ProyectoRepository();
	// return await repository.findById(proyectoId);

	return mockProyectos.find((p) => p.id_proyecto === proyectoId);
}
