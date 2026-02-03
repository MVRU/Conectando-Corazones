import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const ESTADOS_CHAT_ACTIVO = ['en_curso', 'pendiente_solicitud_cierre', 'en_revision'];

export const load: PageServerLoad = async ({ params, locals }) => {
	const proyectoRepo = new PostgresProyectoRepository();
	const colaboracionRepo = new PostgresColaboracionRepository();
	const proyectoId = Number(params.proyecto_id);
	if (Number.isNaN(proyectoId)) {
		throw error(400, 'ID de proyecto inválido');
	}
	const usuario = locals.usuario;

	if (!usuario) {
		throw error(401, 'Debés iniciar sesión para acceder al chat');
	}

	if (!usuario.id_usuario) {
		throw error(400, 'Usuario inválido');
	}

	const proyecto = await proyectoRepo.findById(proyectoId);
	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	const estadoValido = proyecto.estado && ESTADOS_CHAT_ACTIVO.includes(proyecto.estado);
	if (!estadoValido) {
		throw error(403, 'El chat no está disponible para este proyecto');
	}

	const esDuenoDelProyecto = proyecto.institucion_id === usuario.id_usuario;

	let tieneColaboracionAprobada = false;
	if (!esDuenoDelProyecto) {
		const colaboracion = await colaboracionRepo.findByProyectoAndColaborador(
			proyectoId,
			usuario.id_usuario
		);
		tieneColaboracionAprobada = colaboracion?.estado === 'aprobada';
	}

	if (!esDuenoDelProyecto && !tieneColaboracionAprobada) {
		throw error(403, 'No tenés acceso a este chat. Necesitás una colaboración aprobada.');
	}

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		tieneAcceso: true,
		esDuenoDelProyecto
	};
};
