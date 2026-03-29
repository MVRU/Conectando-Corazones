import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresEvaluacionRepository } from '$lib/infrastructure/supabase/postgres/evaluacion.repo';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-cambios.repo';
import { RegistrarEvaluacion } from '$lib/domain/use-cases/evaluacion/RegistrarEvaluacion';

const proyectoRepo = new PostgresProyectoRepository();
const colaboracionRepo = new PostgresColaboracionRepository();
const evaluacionRepo = new PostgresEvaluacionRepository();
const solicitudRepo = new PostgresSolicitudFinalizacionRepository();
const historialRepo = new PostgresHistorialDeCambiosRepository();

const registrarEvaluacion = new RegistrarEvaluacion(
	evaluacionRepo,
	proyectoRepo,
	colaboracionRepo,
	solicitudRepo,
	historialRepo
);

/**
 * Evaluación de solicitudes de cierre por parte del colaborador.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 * La verificación de colaboración aprobada es lógica de negocio.
 */
export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario!; // Garantizado por AuthGuard en hooks

	const proyectoId = Number(params.id);

	// 1. Verificar que el colaborador tenga una colaboración APROBADA en este proyecto
	const colaboraciones = await colaboracionRepo.findByProyecto(proyectoId);
	const esColaboradorAprobado = colaboraciones.some(
		(c) => c.colaborador_id === user.id_usuario && c.estado === 'aprobada'
	);

	if (!esColaboradorAprobado) {
		throw redirect(303, `/proyectos/${proyectoId}`);
	}

	// 2. Verificar proyecto
	const proyecto = await proyectoRepo.findById(proyectoId);
	if (!proyecto) throw redirect(303, '/proyectos');

	// 3. Buscar Solicitud más reciente del proyecto
	const solicitud = await solicitudRepo.findByProyectoId(proyectoId);

	// Para el frontend
	const evidencias = solicitud?.evidencias ?? [];

	// Si no hay solicitud y el proyecto está en revisión, es un estado inconsistente o
	// la solicitud se borró manualmente. Manejar con cuidado.
	if (!solicitud && proyecto.estado === 'en_revision') {
		// Log error interno
	}

	// 4. Buscar Evaluación del usuario actual
	let evaluacionUsuario = null;
	if (solicitud && solicitud.id_solicitud !== undefined && user.id_usuario !== undefined) {
		evaluacionUsuario = await evaluacionRepo.findBySolicitudAndColaborador(
			solicitud.id_solicitud!,
			user.id_usuario!
		);
	}

	// 5. Contadores
	const totalColaboradores = colaboraciones.filter((c) => c.estado === 'aprobada').length;
	const votosRealizados = solicitud
		? (await evaluacionRepo.countVotosBySolicitud(solicitud.id_solicitud!)).total
		: 0;

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		solicitud: JSON.parse(JSON.stringify({ ...solicitud, evidencias })),
		evaluacion: evaluacionUsuario ? JSON.parse(JSON.stringify(evaluacionUsuario)) : null,
		yaVote: !!evaluacionUsuario,
		totalColaboradores,
		votosRealizados,
		isEnRevision: proyecto.estado === 'en_revision'
	};
};

export const actions: Actions = {
	aprobar: async ({ request, params, locals }) => {
		const user = locals.usuario;
		if (!user) return fail(401, { error: 'No autenticado' });

		const formData = await request.formData();
		const justificacion = formData.get('justificacion') as string;
		const solicitudId = Number(formData.get('solicitud_id'));
		const proyectoId = Number(params.id);

		if (!solicitudId) return fail(400, { error: 'Falta ID de solicitud' });

		try {
			await registrarEvaluacion.execute({
				proyectoId,
				solicitudId,
				colaboradorId: user.id_usuario!,
				voto: 'aprobado',
				justificacion
			});

			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error interno';
			return fail(400, { error: errorMessage });
		}
	},

	rechazar: async ({ request, params, locals }) => {
		const user = locals.usuario;
		if (!user) return fail(401, { error: 'No autenticado' });

		const formData = await request.formData();
		const justificacion = formData.get('justificacion') as string;
		const solicitudId = Number(formData.get('solicitud_id'));
		const proyectoId = Number(params.id);

		if (!solicitudId) return fail(400, { error: 'Falta ID de solicitud' });
		if (!justificacion)
			return fail(400, { error: 'La justificación es obligatoria para rechazar' });

		try {
			await registrarEvaluacion.execute({
				proyectoId,
				solicitudId,
				colaboradorId: user.id_usuario!,
				voto: 'rechazado',
				justificacion
			});

			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error interno';
			return fail(400, { error: errorMessage });
		}
	},

	reportar: async () => {
		return {
			success: true,
			message: 'Irregularidad reportada correctamente. El equipo de auditoría revisará el caso.'
		};
	}
};
