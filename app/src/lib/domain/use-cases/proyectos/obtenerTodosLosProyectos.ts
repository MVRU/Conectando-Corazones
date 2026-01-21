import type { Proyecto } from '$lib/domain/types/Proyecto';
import { mockProyectos } from 'tests/mocks/mock-proyectos';

/**
 * Caso de uso: Obtener todos los proyectos
 * 
 * @returns Lista de todos los proyectos
 * 
 * TODO: Reemplazar mockProyectos con llamada real a Supabase
 */
export async function obtenerTodosLosProyectos(): Promise<Proyecto[]> {
	// TODO: Reemplazar con repositorio real
	// const repository = new ProyectoRepository();
	// return await repository.findAll();
	
	return mockProyectos;
}
