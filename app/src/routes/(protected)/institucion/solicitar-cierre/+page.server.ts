import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-cambios.repo';
import { CrearSolicitudFinalizacion } from '$lib/domain/use-cases/proyectos/CrearSolicitudFinalizacion';
import { redirect, fail } from '@sveltejs/kit';

const ESTADOS_SOLICITUD_ACTIVA = new Set(['', 'pendiente', 'en_revision']);

function normalizeEstadoSolicitud(estado: string | null | undefined): string {
	return (estado || '').trim().toLowerCase();
}

function esSolicitudActiva(estado: string | null | undefined): boolean {
	const e = normalizeEstadoSolicitud(estado);
	return e === '' || ESTADOS_SOLICITUD_ACTIVA.has(e);
}

/**
 * Carga de datos para solicitar cierre de proyecto.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.usuario;

	if (!user) throw redirect(302, '/iniciar-sesion');
	if (user.rol !== 'institucion') {
		throw redirect(303, '/mi-panel');
	}

	const proyectoRepo = new PostgresProyectoRepository();
	const solicitudRepo = new PostgresSolicitudFinalizacionRepository();
	const evidenciaRepo = new PostgresEvidenciaRepository();
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
	let solicitudesRechazadas: unknown[] = [];
	let evidencias: unknown[] = [];

	if (proyectoId) {
		const idProyecto = Number(proyectoId);
		const p = await proyectoRepo.findById(idProyecto);
		if (p && p.institucion_id === user?.id_usuario) {
			proyectoActual = p;

			const solicitud = await solicitudRepo.findByProyectoId(idProyecto);
			solicitudPendiente = solicitud && esSolicitudActiva(solicitud.estado) ? solicitud : null;

			solicitudesRechazadas = await solicitudRepo.findRechazadasByProyectoId(idProyecto);

			const evs = await evidenciaRepo.findAllByProyecto(idProyecto);
			evidencias = evs;
		}
	}

	return {
		proyectosDisponibles: JSON.parse(JSON.stringify(proyectosDisponibles)),
		proyectoActual: JSON.parse(JSON.stringify(proyectoActual)),
		solicitudPendiente: JSON.parse(JSON.stringify(solicitudPendiente)),
		solicitudesRechazadas: JSON.parse(JSON.stringify(solicitudesRechazadas)),
		evidencias: JSON.parse(JSON.stringify(evidencias)),
		verificacion: {
			estado: user.estado_verificacion || 'pendiente',
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

		const historialRepo = new PostgresHistorialDeCambiosRepository();
 
		const useCase = new CrearSolicitudFinalizacion(solicitudRepo, proyectoRepo, evidenciaRepo, historialRepo);

		try {
			if (typeof user.id_usuario !== 'number') {
				return fail(500, { message: 'El usuario autenticado no tiene un ID válido' });
			}

			const solicitud = await useCase.execute(user.id_usuario, proyectoId, evidenciaIds);

			return {
				success: true,
				solicitud
			};
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'No se pudo crear la solicitud de finalización';
			return fail(400, { message });
		}
	}
};
