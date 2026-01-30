import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.usuario;

	if (!user) throw redirect(302, '/login');
	if (user.rol !== 'institucion') {
	}

	const proyectoRepo = new PostgresProyectoRepository();
	// Usar findAllSummary() ya que solo necesitamos datos básicos para filtrar
	const allProyectos = await proyectoRepo.findAllSummary();
	const proyectosDisponibles =
		user.rol === 'institucion'
			? allProyectos.filter(
					(p) => p.institucion_id === user.id_usuario && p.estado === 'pendiente_solicitud_cierre'
				)
			: [];

	const proyectoId = url.searchParams.get('proyecto');
	let proyectoActual = null;

	let solicitudPendiente = null;
	let solicitudesRechazadas: any[] = [];
	let evidencias: any[] = [];

	if (proyectoId) {
		const p = await proyectoRepo.findById(Number(proyectoId));
		if (p && p.institucion_id === user?.id_usuario) {
			proyectoActual = p;
		}
	}

	return {
		proyectosDisponibles: JSON.parse(JSON.stringify(proyectosDisponibles)),
		proyectoActual: JSON.parse(JSON.stringify(proyectoActual)),
		solicitudPendiente,
		solicitudesRechazadas,
		evidencias,
		verificacion: {
			estado: user.estado_verificacion || 'pendiente', // Fallback
			usuario_id: user.id_usuario
		}
	};
};

export const actions: Actions = {
	solicitarCierre: async ({ request }) => {
		return fail(501, { message: 'Funcionalidad no implementada en backend' });
	}
};
