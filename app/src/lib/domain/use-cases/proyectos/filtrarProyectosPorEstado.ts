// TODO: corregir todo esto

import type { Proyecto } from '$lib/domain/types/Proyecto';

/**
 * Caso de uso: Filtrar proyectos por estado
 * 
 * @param proyectos - Lista de proyectos a filtrar
 * @param estado - Estado por el cual filtrar
 * @returns Lista de proyectos filtrados
 */
export function filtrarProyectosPorEstado(proyectos: Proyecto[], estado: string): Proyecto[] {
	return proyectos.filter((p) => p.estado === estado);
}
