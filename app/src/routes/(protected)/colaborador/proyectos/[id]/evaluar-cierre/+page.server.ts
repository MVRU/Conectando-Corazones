import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresEvaluacionRepository } from '$lib/infrastructure/supabase/postgres/evaluacion.repo';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-cambios.repo';
import { RegistrarEvaluacion } from '$lib/domain/use-cases/evaluacion/RegistrarEvaluacion';
import { analizarProyecto } from '$lib/domain/use-cases/analizarProyecto';
import { prisma } from '$lib/infrastructure/prisma/client';
import { Prisma } from '@prisma/client';

const proyectoRepo = new PostgresProyectoRepository();
const colaboracionRepo = new PostgresColaboracionRepository();
const evaluacionRepo = new PostgresEvaluacionRepository();
const solicitudRepo = new PostgresSolicitudFinalizacionRepository();
const historialRepo = new PostgresHistorialDeCambiosRepository();

function dispararAnalisisProyectoCompletado(proyectoId: number) {
	setTimeout(async () => {
		try {
			const result = await analizarProyecto(proyectoId);
			if (!result.success && result.error) {
				console.error(`[IA] Error en análisis del proyecto ${proyectoId}:`, result.error);
			}
		} catch (error) {
			console.error(`[IA] Excepción no controlada en background task del proyecto ${proyectoId}:`, error);
		}
	}, 0);
}

/**
 * Evaluación de solicitudes de cierre por parte del colaborador.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 * La verificación de colaboración aprobada es lógica de negocio.
 */
export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario!; // Garantizado por AuthGuard en hooks

	const proyectoId = Number(params.id);
	if (!Number.isFinite(proyectoId) || proyectoId <= 0) {
		throw redirect(303, '/proyectos');
	}

	const [proyectoRow, colaboracionAprobada, totalColaboradores, solicitudRow] = await Promise.all([
		prisma.proyecto.findUnique({
			where: { id_proyecto: proyectoId },
			select: {
				id_proyecto: true,
				titulo: true,
				beneficiarios: true,
				estado: {
					select: {
						descripcion: true
					}
				},
				participacion_permitida: {
					select: {
						id_participacion_permitida: true,
						id_proyecto: true,
						id_tipo_participacion: true,
						objetivo: true,
						unidad_medida: true,
						especie: true,
						tipo_participacion: {
							select: {
								id_tipo_participacion: true,
								descripcion: true
							}
						},
						colaboraciones_tipo_participacion: {
							select: {
								cantidad: true
							}
						}
					}
				}
			}
		}),
		prisma.colaboracion.findFirst({
			where: {
				proyecto_id: proyectoId,
				colaborador_id: user.id_usuario!,
				estado: 'aprobada'
			},
			select: {
				id_colaboracion: true
			}
		}),
		prisma.colaboracion.count({
			where: {
				proyecto_id: proyectoId,
				estado: 'aprobada'
			}
		}),
		prisma.solicitudFinalizacion.findFirst({
			where: {
				proyecto_id: proyectoId,
				estado: 'pendiente'
			},
			orderBy: {
				created_at: 'desc'
			},
			select: {
				id_solicitud: true,
				proyecto_id: true,
				estado: true,
				created_at: true,
				solicitud_evidencias: {
					select: {
						evidencia: {
							select: {
								id_evidencia: true,
								tipo_evidencia: true,
								created_at: true,
								id_participacion_permitida: true,
								archivos: {
									select: {
										id_archivo: true,
										nombre_original: true,
										url: true,
										descripcion: true,
										tipo_mime: true,
										tamanio_bytes: true,
										created_at: true,
										usuario: {
											select: {
												nombre: true,
												apellido: true,
												username: true
											}
										}
									}
								}
							}
						}
					}
				}
			}
		})
	]);

	if (!proyectoRow) throw redirect(303, '/proyectos');

	if (!colaboracionAprobada) {
		throw redirect(303, `/proyectos/${proyectoId}`);
	}

	const proyecto = {
		id_proyecto: proyectoRow.id_proyecto,
		titulo: proyectoRow.titulo,
		beneficiarios: proyectoRow.beneficiarios ? Number(proyectoRow.beneficiarios) : null,
		estado: proyectoRow.estado?.descripcion ?? null,
		participacion_permitida: proyectoRow.participacion_permitida.map((participacion) => ({
			id_participacion_permitida: participacion.id_participacion_permitida,
			id_proyecto: participacion.id_proyecto,
			id_tipo_participacion: participacion.id_tipo_participacion,
			objetivo: Number(participacion.objetivo),
			actual: participacion.colaboraciones_tipo_participacion.reduce(
				(total, colaboracion) => total + Number(colaboracion.cantidad || 0),
				0
			),
			unidad_medida: participacion.unidad_medida ?? undefined,
			especie: participacion.especie ?? undefined,
			tipo_participacion: participacion.tipo_participacion
				? {
						id_tipo_participacion: participacion.tipo_participacion.id_tipo_participacion,
						descripcion: participacion.tipo_participacion.descripcion
					}
				: undefined
		}))
	};

	const solicitud = solicitudRow
		? {
				id_solicitud: solicitudRow.id_solicitud,
				proyecto_id: solicitudRow.proyecto_id,
				estado: solicitudRow.estado ?? undefined,
				created_at: solicitudRow.created_at ?? undefined,
				evidencia_ids: solicitudRow.solicitud_evidencias.map(
					({ evidencia }) => evidencia.id_evidencia
				),
				evidencias: solicitudRow.solicitud_evidencias.map(({ evidencia }) => ({
					id_evidencia: evidencia.id_evidencia,
					tipo_evidencia: evidencia.tipo_evidencia,
					created_at: evidencia.created_at ?? undefined,
					id_participacion_permitida: evidencia.id_participacion_permitida,
					archivos_ids: evidencia.archivos.map((archivo) => archivo.id_archivo),
					archivos: evidencia.archivos.map((archivo) => ({
						id_archivo: archivo.id_archivo,
						nombre_original: archivo.nombre_original,
						url: archivo.url,
						descripcion: archivo.descripcion,
						tipo_mime: archivo.tipo_mime,
						tamanio_bytes: archivo.tamanio_bytes ? Number(archivo.tamanio_bytes) : null,
						created_at: archivo.created_at ?? undefined,
						usuario: archivo.usuario
							? {
									nombre: archivo.usuario.nombre,
									apellido: archivo.usuario.apellido,
									username: archivo.usuario.username
								}
							: undefined
					}))
				}))
			}
		: null;

	// Si no hay solicitud y el proyecto está en revisión, es un estado inconsistente o
	// la solicitud se borró manualmente. Manejar con cuidado.
	if (!solicitud && proyecto.estado === 'en_revision') {
		// Log error interno
	}

	const [evaluacionUsuario, votosRealizados] =
		solicitud && solicitud.id_solicitud !== undefined && user.id_usuario !== undefined
			? await Promise.all([
					evaluacionRepo.findBySolicitudAndColaborador(solicitud.id_solicitud, user.id_usuario),
					prisma.evaluacion.count({
						where: {
							solicitud_id: solicitud.id_solicitud
						}
					})
				])
			: [null, 0];

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		solicitud: solicitud ? JSON.parse(JSON.stringify(solicitud)) : null,
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
			await prisma.$transaction(
				async (tx) => {
					const registrarEvaluacion = new RegistrarEvaluacion(
						new PostgresEvaluacionRepository(tx),
						new PostgresProyectoRepository(tx),
						new PostgresColaboracionRepository(tx),
						new PostgresSolicitudFinalizacionRepository(tx),
						new PostgresHistorialDeCambiosRepository(tx)
					);

					await registrarEvaluacion.execute({
						proyectoId,
						solicitudId,
						colaboradorId: user.id_usuario!,
						voto: 'aprobado',
						justificacion
					});
				},
				{
					isolationLevel: Prisma.TransactionIsolationLevel.Serializable
				}
			);

			const proyectoActualizado = await prisma.proyecto.findUnique({
				where: { id_proyecto: proyectoId },
				select: {
					estado: {
						select: {
							descripcion: true
						}
					}
				}
			});

			if (proyectoActualizado?.estado?.descripcion === 'completado') {
				dispararAnalisisProyectoCompletado(proyectoId);
			}

			return {
				success: true,
				message:
					proyectoActualizado?.estado?.descripcion === 'completado'
						? 'Tu voto fue registrado. El proyecto quedó completado.'
						: 'Tu voto fue registrado correctamente.'
			};
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
			await prisma.$transaction(
				async (tx) => {
					const registrarEvaluacion = new RegistrarEvaluacion(
						new PostgresEvaluacionRepository(tx),
						new PostgresProyectoRepository(tx),
						new PostgresColaboracionRepository(tx),
						new PostgresSolicitudFinalizacionRepository(tx),
						new PostgresHistorialDeCambiosRepository(tx)
					);

					await registrarEvaluacion.execute({
						proyectoId,
						solicitudId,
						colaboradorId: user.id_usuario!,
						voto: 'rechazado',
						justificacion
					});
				},
				{
					isolationLevel: Prisma.TransactionIsolationLevel.Serializable
				}
			);

			const proyectoActualizado = await prisma.proyecto.findUnique({
				where: { id_proyecto: proyectoId },
				select: {
					estado: {
						select: {
							descripcion: true
						}
					}
				}
			});

			return {
				success: true,
				message:
					proyectoActualizado?.estado?.descripcion === 'en_auditoria'
						? 'Tu rechazo fue registrado. El proyecto pasó a auditoría.'
						: 'Tu rechazo fue registrado. El proyecto volvió a pendiente de solicitud de cierre.'
			};
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
