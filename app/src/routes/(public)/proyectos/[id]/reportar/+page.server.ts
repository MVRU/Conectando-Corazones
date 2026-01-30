import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const proyectoRepo = new PostgresProyectoRepository();
	const proyectoId = Number(params.id);
	// @ts-ignore
	const proyecto = await proyectoRepo.findById(proyectoId);

	if (!proyecto) throw error(404, 'Proyecto no encontrado');

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto))
	};
};
