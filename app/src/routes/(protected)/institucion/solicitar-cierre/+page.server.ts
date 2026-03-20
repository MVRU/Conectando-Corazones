import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { CrearSolicitudFinalizacion } from '$lib/domain/use-cases/proyectos/CrearSolicitudFinalizacion';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.usuario;

	if (!user) throw redirect(302, '/login');
	if (user.rol !== 'institucion') {
	}

	const proyectoRepo = new PostgresProyectoRepository();
	const solicitudRepo = new PostgresSolicitudFinalizacionRepository();
	const evidenciaRepo = new PostgresEvidenciaRepository();
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
		const idProyecto = Number(proyectoId);
		const p = await proyectoRepo.findById(idProyecto);
		if (p && p.institucion_id === user?.id_usuario) {
			proyectoActual = p;

			// Cargar solicitud pendiente (si existe) y solicitudes rechazadas
			const solicitud = await solicitudRepo.findByProyectoId(idProyecto);
			if (solicitud) {
				if (solicitud.estado === 'pendiente') {
					solicitudPendiente = solicitud;
				}
			}

			solicitudesRechazadas = await solicitudRepo.findRechazadasByProyectoId(idProyecto);

			// Cargar evidencias del proyecto para agrupar en el frontend
			evidencias = await evidenciaRepo.findAllByProyecto(idProyecto);
		}
	}

	return {
		proyectosDisponibles: JSON.parse(JSON.stringify(proyectosDisponibles)),
		proyectoActual: JSON.parse(JSON.stringify(proyectoActual)),
		solicitudPendiente,
		solicitudesRechazadas: JSON.parse(JSON.stringify(solicitudesRechazadas)),
		evidencias: JSON.parse(JSON.stringify(evidencias)),
		verificacion: {
			estado: user.estado_verificacion || 'pendiente', // Fallback
			usuario_id: user.id_usuario
		}
	};
};

export const actions: Actions = {
	solicitarCierre: async ({ request, locals }) => {
		const user = locals.usuario;

		if (!user) {
			return fail(401, { message: 'No autenticado' });
		}

		if (user.rol !== 'institucion') {
			return fail(403, { message: 'Solo las instituciones pueden solicitar cierre de proyectos' });
		}

		const formData = await request.formData();
		const proyectoIdRaw = formData.get('proyecto_id');
		const evidenciasRaw = formData.getAll('evidencia_ids');

		if (!proyectoIdRaw) {
			return fail(400, { message: 'Debe seleccionar un proyecto' });
		}

		const proyectoId = Number(proyectoIdRaw);
		const evidenciaIds = evidenciasRaw.map((v) => Number(v)).filter((n) => !isNaN(n));

		const proyectoRepo = new PostgresProyectoRepository();
		const solicitudRepo = new PostgresSolicitudFinalizacionRepository();
		const evidenciaRepo = new PostgresEvidenciaRepository();

		const useCase = new CrearSolicitudFinalizacion(solicitudRepo, proyectoRepo, evidenciaRepo);

		try {
			if (typeof user.id_usuario !== 'number') {
				return fail(500, { message: 'El usuario autenticado no tiene un ID válido' });
			}

			const solicitud = await useCase.execute(user.id_usuario, proyectoId, evidenciaIds);

			return {
				success: true,
				solicitud
			};
		} catch (error: any) {
			return fail(400, {
				message: error.message || 'No se pudo crear la solicitud de finalización'
			});
		}
	}
};

