import type { PageServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

export const load: PageServerLoad = async () => {
	try {
		const repo = new PostgresProyectoRepository();
		const proyectos = await repo.findAll();

		return {
			proyectosDestacados: JSON.parse(JSON.stringify(proyectos.slice(0, 3)))
		};
	} catch (error) {
		console.error('Error loading home page:', error);
		return {
			proyectosDestacados: []
		};
	}
};
