import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const proyecto = mockProyectos.find((p) => p.id_proyecto === projectId);

	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	const allowedStatuses = ['en_curso', 'pendiente_solicitud_cierre'];
	if (!proyecto.estado || !allowedStatuses.includes(proyecto.estado)) {
		throw error(403, 'El proyecto no acepta nuevos aportes en su estado actual');
	}

	return {
		proyecto,
		participacionesPermitidas: proyecto.participacion_permitida || []
	};
};
