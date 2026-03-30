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
 * Carga de datos optimizada para solicitar cierre de proyecto.
 * Recupera objetivos, progreso y evidencias asociadas usando Prisma.
 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.usuario;

	// Validación de seguridad defensiva
	if (!user) throw redirect(302, '/iniciar-sesion?reason=unauthenticated');
	if (user.rol !== 'institucion') {
		throw redirect(303, '/mi-panel?reason=forbidden');
	}

	const proyectoRepo = new PostgresProyectoRepository();
	const solicitudRepo = new PostgresSolicitudFinalizacionRepository();
	const evidenciaRepo = new PostgresEvidenciaRepository();

	const proyectoId = url.searchParams.get('proyecto');
	
	// Consulta base para el selector móvil/desktop
	const [allProyectos] = await Promise.all([
		proyectoRepo.findAllSummary()
	]);

	const proyectosDisponibles = allProyectos.filter(
		(p) =>
			p.institucion_id === user.id_usuario &&
			(p.estado === 'pendiente_solicitud_cierre' || p.estado === 'en_curso')
	);

	let proyectoActual = null;
	let solicitudPendiente = null;
	let solicitudesRechazadas: unknown[] = [];
	let evidencias: unknown[] = [];
	let objetivos: any[] = [];

	if (proyectoId) {
		const idProyecto = Number(proyectoId);
		
		// Carga paralela de todo el grafo de datos del proyecto seleccionado
		const [p, solicitud, rechazadas, evs] = await Promise.all([
			proyectoRepo.findById(idProyecto),
			solicitudRepo.findByProyectoId(idProyecto),
			solicitudRepo.findRechazadasByProyectoId(idProyecto),
			evidenciaRepo.findAllByProyecto(idProyecto)
		]);

		if (p && p.institucion_id === user.id_usuario) {
			proyectoActual = p;
			solicitudPendiente = solicitud && esSolicitudActiva(solicitud.estado) ? solicitud : null;
			solicitudesRechazadas = rechazadas;
			evidencias = evs;
			
			// Objetivos con progreso calculado dinámicamente en el servidor
			objetivos = (p.participacion_permitida || []).map(obj => ({
				...obj,
				porcentaje: (obj.objetivo || 0) > 0 ? ((obj.actual || 0) / (obj.objetivo || 1)) * 100 : 0
			}));
		}
	}

	return {
		proyectos: JSON.parse(JSON.stringify(proyectosDisponibles)),
		proyectoActual: JSON.parse(JSON.stringify(proyectoActual)),
		objetivos: JSON.parse(JSON.stringify(objetivos)),
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

		if (!user) return fail(401, { message: 'No autenticado' });
		if (user.rol !== 'institucion') return fail(403, { message: 'Solo las instituciones pueden solicitar cierre' });

		const formData = await request.formData();
		const proyectoId = Number(formData.get('proyecto_id'));
		const evidenciaIds = formData.getAll('evidencia_ids').map(Number).filter(n => !isNaN(n));

		if (!proyectoId) return fail(400, { message: 'Debe seleccionar un proyecto' });

		const useCase = new CrearSolicitudFinalizacion(
			new PostgresSolicitudFinalizacionRepository(),
			new PostgresProyectoRepository(),
			new PostgresEvidenciaRepository(),
			new PostgresHistorialDeCambiosRepository()
		);

		try {
			const solicitud = await useCase.execute(user.id_usuario!, proyectoId, evidenciaIds);
			return { success: true, solicitud };
		} catch (error: any) {
			return fail(400, { message: error.message });
		}
	}
};
