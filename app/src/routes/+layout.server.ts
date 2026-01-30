import type { LayoutServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

export const load: LayoutServerLoad = async () => {
	try {
		const repo = new PostgresProyectoRepository();
		// Usar findAllSummary() en lugar de findAll() para reducir datos cargados
		const proyectos = await repo.findAllSummary();

		return {
			proyectos: JSON.parse(JSON.stringify(proyectos))
		};
	} catch (error) {
		console.error('Error en LayoutServerLoad:', error);
		return {
			proyectos: [],
			error: 'No se pudieron cargar algunos datos globales.'
		};
	}
};
