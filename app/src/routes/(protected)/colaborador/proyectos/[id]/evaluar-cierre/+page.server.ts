import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MockSolicitudFinalizacionRepository } from '$lib/infrastructure/repositories/mock/MockSolicitudFinalizacionRepository';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { MockColaboracionRepository } from '$lib/infrastructure/repositories/mock/MockColaboracionRepository';
import { MockEvaluacionRepository } from '$lib/infrastructure/repositories/mock/MockEvaluacionRepository';
import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';

// Repositories
const solicitudRepo = new MockSolicitudFinalizacionRepository();
const proyectoRepo = new MockProyectoRepository();
const colaboracionRepo = new MockColaboracionRepository();
const evaluacionRepo = new MockEvaluacionRepository();

// Helper para asegurar numero id
function ensureId(id: number | undefined): number {
	if (id === undefined) throw new Error('El ID es undefined');
	return id;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario;
	if (!user || user.rol !== 'colaborador') {
		throw redirect(303, '/iniciar-sesion');
	}

	const proyectoId = Number(params.id);

	// 1. Verificar que el colaborador tenga una colaboración APROBADA en este proyecto
	const colaboraciones = await colaboracionRepo.findByProyectoId(proyectoId);
	const esColaboradorAprobado = colaboraciones.some(
		(c) => c.colaborador_id === user.id_usuario && c.estado === 'aprobada'
	);

	if (!esColaboradorAprobado) {
		throw redirect(303, `/proyectos/${proyectoId}`);
	}

	// 2. Verificar estado del proyecto
	const proyecto = await proyectoRepo.findById(proyectoId);
	if (!proyecto) {
		throw redirect(303, '/proyectos');
	}

	// 3. Buscar la solicitud PENDIENTE
	const solicitud = await solicitudRepo.findByProyectoId(proyectoId);

	let solicitudConEvidencias = null;
	let evaluacion = null;
	let yaVote = false;

	let totalColaboradores = 0;
	let votosRealizados = 0;

	if (solicitud) {
		const evidencias = mockEvidencias.filter(
			(e) => e.id_evidencia && solicitud.evidencia_ids.includes(e.id_evidencia)
		);
		solicitudConEvidencias = { ...solicitud, evidencias };

		// 4. Verificar si ya votó y contar votos
		const solicitudId = solicitud.id_solicitud;
		if (solicitudId) {
			evaluacion = await evaluacionRepo.findBySolicitudAndColaborador(
				solicitudId,
				ensureId(user.id_usuario)
			);
			yaVote = evaluacion !== null && evaluacion.voto !== null;

			// Conteo para el indicador visual
			const todasEvaluaciones = await evaluacionRepo.findBySolicitudId(solicitudId);
			votosRealizados = todasEvaluaciones.length;
			const todasColaboraciones = await colaboracionRepo.findByProyectoId(proyectoId);
			totalColaboradores = todasColaboraciones.filter((c) => c.estado === 'aprobada').length;
		}
	}

	return {
		proyecto,
		solicitud: solicitudConEvidencias,
		evaluacion,
		yaVote,
		totalColaboradores,
		votosRealizados,
		isEnRevision: proyecto.estado === 'en_revision'
	};
};

export const actions: Actions = {
	aprobar: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const solicitudIdStr = formData.get('solicitud_id');
		const proyectoId = Number(params.id);
		const user = locals.usuario!;

		if (!solicitudIdStr) {
			return fail(400, { error: 'Solicitud ID es requerido' });
		}
		const solicitudId = Number(solicitudIdStr);

		try {
			// Guardar/Actualizar evaluación del colaborador
			let evaluacion = await evaluacionRepo.findBySolicitudAndColaborador(
				solicitudId,
				ensureId(user.id_usuario)
			);
			if (evaluacion && evaluacion.id_evaluacion !== undefined) {
				await evaluacionRepo.updateVoto(evaluacion.id_evaluacion, 'aprobado');
			} else {
				await evaluacionRepo.save({
					solicitud_id: solicitudId,
					colaborador_id: user.id_usuario,
					voto: 'aprobado'
				});
			}

			// Verificar si TODOS los colaboradores aprobados han votado "aprobado"
			const colaboradores = await colaboracionRepo.findByProyectoId(proyectoId);
			const evaluaciones = await evaluacionRepo.findBySolicitudId(solicitudId);

			const todosAprobaron = colaboradores.every((c) =>
				evaluaciones.some((e) => e.colaborador_id === c.colaborador_id && e.voto === 'aprobado')
			);

			if (todosAprobaron) {
				await solicitudRepo.updateEstado(solicitudId, 'aprobada');
				await proyectoRepo.update(proyectoId, {
					estado: 'completado'
				});
				return {
					success: true,
					message: 'Has aprobado el cierre. El proyecto ha sido completado.'
				};
			} else {
				return {
					success: true,
					message: 'Tu voto positivo ha sido registrado. Esperando al resto de los colaboradores.'
				};
			}
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Error al aprobar la solicitud' });
		}
	},

	rechazar: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const solicitudIdStr = formData.get('solicitud_id');
		const proyectoId = Number(params.id);
		const motivo = formData.get('justificacion') as string;
		const user = locals.usuario!;

		if (!solicitudIdStr) {
			return fail(400, { error: 'Solicitud ID es requerido' });
		}
		const solicitudId = Number(solicitudIdStr);

		try {
			// 1. Guardar/Actualizar evaluación del colaborador
			let evaluacion = await evaluacionRepo.findBySolicitudAndColaborador(
				solicitudId,
				ensureId(user.id_usuario)
			);
			if (evaluacion && evaluacion.id_evaluacion !== undefined) {
				await evaluacionRepo.updateVoto(evaluacion.id_evaluacion, 'rechazado', motivo);
			} else {
				await evaluacionRepo.save({
					solicitud_id: solicitudId,
					colaborador_id: user.id_usuario,
					voto: 'rechazado',
					justificacion: motivo
				});
			}

			// 2. Actualizar solicitud a rechazada
			await solicitudRepo.updateEstado(solicitudId, 'rechazada', motivo);

			// 3. Verificar conteo de rechazos
			const count = await solicitudRepo.countRechazadasByProyectoId(proyectoId);

			if (count >= 3) {
				await proyectoRepo.update(proyectoId, {
					estado: 'en_auditoria'
				});
			} else {
				await proyectoRepo.update(proyectoId, {
					// @ts-ignore
					estado: 'pendiente_solicitud_cierre'
				});
			}

			return { success: true, message: 'Has rechazado la solicitud de cierre.' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Error al rechazar la solicitud' });
		}
	},

	reportar: async ({ request, params }) => {
		return {
			success: true,
			message: 'Irregularidad reportada correctamente. El equipo de auditoría revisará el caso.'
		};
	}
};
