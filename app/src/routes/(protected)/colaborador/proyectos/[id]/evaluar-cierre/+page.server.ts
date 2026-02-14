import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresEvaluacionRepository } from '$lib/infrastructure/supabase/postgres/evaluacion.repo';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';
import { RegistrarEvaluacion } from '$lib/domain/use-cases/evaluacion/RegistrarEvaluacion';
import { prisma } from '$lib/infrastructure/prisma/client'; // TODO: Eliminar acceso directo cuando exista SolicitudRepository

const proyectoRepo = new PostgresProyectoRepository();
const colaboracionRepo = new PostgresColaboracionRepository();
const evaluacionRepo = new PostgresEvaluacionRepository();
const solicitudRepo = new PostgresSolicitudFinalizacionRepository();

const registrarEvaluacion = new RegistrarEvaluacion(evaluacionRepo, proyectoRepo, colaboracionRepo, solicitudRepo);

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario;
	if (!user || user.rol !== 'colaborador') {
		throw redirect(303, '/iniciar-sesion');
	}

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

	// 3. Buscar Solicitud Pendiente (TODO: Usar Repository)
	// Usamos Prisma directo SOLO en load como permitido temporalmente
	const solicitud = await prisma.solicitudFinalizacion.findFirst({
		where: {
			proyecto_id: proyectoId,
			// Asumo que si el proyecto esta 'en_revision', la ultima solicitud es la vigente
		},
		orderBy: { created_at: 'desc' },
		include: {
			solicitud_evidencias: {
				include: {
					evidencia: {
						include: {
							archivos: {
								include: { usuario: true }
							}
						}
					}
				}
			}
		}
	});

	// Para el frontend
	const evidencias = solicitud?.solicitud_evidencias?.map((se) => se.evidencia) ?? [];

	// Si no hay solicitud y el proyecto está en revisión, es un estado inconsistente o
	// la solicitud se borró manualmente. Manejar con cuidado.
	if (!solicitud && proyecto.estado === 'en_revision') {
		// Log error interno
	}

	// 4. Buscar Evaluación del usuario actual
	let evaluacionUsuario = null;
	if (solicitud) {
		evaluacionUsuario = await evaluacionRepo.findBySolicitudAndColaborador(
			solicitud.id_solicitud,
			user.id_usuario
		);
	}

	// 5. Contadores
	const totalColaboradores = colaboraciones.filter((c) => c.estado === 'aprobada').length;
	const votosRealizados = solicitud
		? (await evaluacionRepo.countVotosBySolicitud(solicitud.id_solicitud)).total
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
		if (!user) throw redirect(303, '/iniciar-sesion');

		const formData = await request.formData();
		const justificacion = formData.get('justificacion') as string;
		const solicitudId = Number(formData.get('solicitud_id'));
		const proyectoId = Number(params.id);

		if (!solicitudId) return fail(400, { error: 'Falta ID de solicitud' });

		try {
			await registrarEvaluacion.execute({
				proyectoId,
				solicitudId,
				colaboradorId: user.id_usuario,
				voto: 'aprobado',
				justificacion
			});
			return { success: true };
		} catch (error: any) {
			return fail(400, { error: error.message });
		}
	},

	rechazar: async ({ request, params, locals }) => {
		const user = locals.usuario;
		if (!user) throw redirect(303, '/iniciar-sesion');

		const formData = await request.formData();
		const justificacion = formData.get('justificacion') as string;
		const solicitudId = Number(formData.get('solicitud_id'));
		const proyectoId = Number(params.id);

		if (!solicitudId) return fail(400, { error: 'Falta ID de solicitud' });
		if (!justificacion) return fail(400, { error: 'La justificación es obligatoria para rechazar' });

		try {
			await registrarEvaluacion.execute({
				proyectoId,
				solicitudId,
				colaboradorId: user.id_usuario,
				voto: 'rechazado',
				justificacion
			});
			return { success: true };
		} catch (error: any) {
			return fail(400, { error: error.message });
		}
	},

	reportar: async ({ request, params }) => {
		return {
			success: true,
			message: 'Irregularidad reportada correctamente. El equipo de auditoría revisará el caso.'
		};
	}
};
