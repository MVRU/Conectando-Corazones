import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const repo = new PostgresProyectoRepository();
	// @ts-ignore
	const proyecto = await repo.findById(projectId);

	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	const allowedStatuses = ['en_curso', 'pendiente_solicitud_cierre'];
	if (!proyecto.estado || !allowedStatuses.includes(proyecto.estado)) {
		throw error(403, 'El proyecto no acepta nuevos aportes en su estado actual');
	}

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		participacionesPermitidas: JSON.parse(JSON.stringify(proyecto.participacion_permitida || []))
	};
};
