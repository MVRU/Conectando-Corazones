import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';

export const load: PageServerLoad = async ({ params, locals }) => {
	const usuario = locals.usuario;
	if (!usuario || usuario.rol !== 'colaborador' || !usuario.id_usuario) {
		throw error(401, 'Debes iniciar sesión como colaborador');
	}

	const projectId = Number(params.id);
	const proyectoRepo = new PostgresProyectoRepository();
	const colaboracionRepo = new PostgresColaboracionRepository();

	const proyecto = await proyectoRepo.findById(projectId);
	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	const allowedStatuses = ['en_curso', 'pendiente_solicitud_cierre'];
	if (!proyecto.estado || !allowedStatuses.includes(proyecto.estado)) {
		throw error(403, 'El proyecto no acepta nuevos aportes en su estado actual');
	}

	const colaboracion = await colaboracionRepo.findByProyectoAndColaborador(
		projectId,
		usuario.id_usuario
	);
	if (!colaboracion || colaboracion.estado !== 'aprobada') {
		throw error(403, 'No tenés una colaboración aprobada en este proyecto');
	}

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		participacionesPermitidas: JSON.parse(JSON.stringify(proyecto.participacion_permitida || [])),
		colaboracionId: colaboracion.id_colaboracion
	};
};
