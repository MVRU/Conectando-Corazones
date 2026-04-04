import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-cambios.repo';
import { CrearSolicitudFinalizacion } from '$lib/domain/use-cases/proyectos/CrearSolicitudFinalizacion';
import { redirect, fail } from '@sveltejs/kit';
import { GestionarEstadoProyecto } from '$lib/domain/use-cases/proyectos/GestionarEstadoProyecto';
import { prisma } from '$lib/infrastructure/prisma/client';

const ESTADOS_SOLICITUD_ACTIVA = new Set(['', 'pendiente', 'en_revision']);

function normalizeEstadoSolicitud(estado: string | null | undefined): string {
	return (estado || '').trim().toLowerCase();
}

function esSolicitudActiva(estado: string | null | undefined): boolean {
	const e = normalizeEstadoSolicitud(estado);
	return e === '' || ESTADOS_SOLICITUD_ACTIVA.has(e);
}

function calcularActual(participacion: {
	colaboraciones_tipo_participacion?: Array<{ cantidad: number | null }>;
}): number {
	const contribuciones = participacion.colaboraciones_tipo_participacion || [];
	return contribuciones.reduce((sum, c) => sum + Number(c.cantidad || 0), 0);
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

	const proyectoId = url.searchParams.get('proyecto');
	
	// Consulta base para el selector móvil/desktop
	const [allProyectos] = await Promise.all([
		proyectoRepo.findAllSummary()
	]);

	const proyectosDisponibles = allProyectos.filter(
		(p) =>
			p.institucion_id === user.id_usuario &&
			p.estado === 'pendiente_solicitud_cierre'
	);

	const proyectosDisponiblesIds = new Set(
		proyectosDisponibles.map((proyecto) => Number(proyecto.id_proyecto))
	);

	let proyectoActual = null;
	let solicitudPendiente = null;
	let solicitudesRechazadas: unknown[] = [];
	let evidencias: unknown[] = [];
	let objetivos: any[] = [];

	if (proyectoId) {
		const idProyecto = Number(proyectoId);

		if (idProyecto && !isNaN(idProyecto)) {
			if (!proyectosDisponiblesIds.has(idProyecto)) {
				throw redirect(303, url.pathname);
			}

			// CARGA MASIVA Y PROFUNDA (Relaciones completas de Proyecto y Evidencias)
			const [p, solicitud, rechazadas, evs] = await Promise.all([
				prisma.proyecto.findUnique({
					where: { id_proyecto: idProyecto },
					include: {
						estado: true,
						institucion: true,
						proyecto_categorias: { include: { categoria: true } },
						participacion_permitida: {
							include: {
								tipo_participacion: true,
								colaboraciones_tipo_participacion: {
									include: {
										colaboracion: {
											include: { colaborador: true }
										}
									}
								}
							}
						}
					}
				}),
				solicitudRepo.findByProyectoId(idProyecto),
				solicitudRepo.findRechazadasByProyectoId(idProyecto),
				prisma.evidencia.findMany({
					where: {
						participacion_permitida: { id_proyecto: idProyecto }
					},
					include: {
						archivos: {
							include: {
								usuario: true
							}
						},
						participacion_permitida: {
							include: {
								tipo_participacion: true
							}
						}
					}
				})
			]);

			if (p && p.id_proyecto === idProyecto) {
				if (p.institucion_id !== user.id_usuario) {
					throw redirect(303, '/mi-panel?reason=forbidden_project');
				}

				proyectoActual = p;
				solicitudPendiente = solicitud && esSolicitudActiva(solicitud.estado) ? solicitud : null;
				solicitudesRechazadas = rechazadas;

				const participacionesPermitidas = p.participacion_permitida || [];
				const objetivosIds = new Set(participacionesPermitidas.map((obj: any) => Number(obj.id_participacion_permitida)));
				
				evidencias = evs.filter((ev: any) => {
					const evObjId = Number(ev.id_participacion_permitida);
					return evObjId != null && objetivosIds.has(evObjId);
				});

				objetivos = participacionesPermitidas.map((obj) => {
					const actual = calcularActual(obj);
					return {
					...obj,
					id_participacion_permitida: Number(obj.id_participacion_permitida),
					actual,
					porcentaje: (Number(obj.objetivo) || 0) > 0 ? (actual / (Number(obj.objetivo) || 1)) * 100 : 0
				};
				});
			}
		}
	}

	// Mapeo exhaustivo a POJO antes de enviar al cliente
	// Esto asegura que Svelte/Kit reciba datos limpios, tipados y con relaciones anidadas
	const pActualMapped = proyectoActual ? {
		...JSON.parse(JSON.stringify(proyectoActual)),
		id_proyecto: Number(proyectoActual.id_proyecto),
		participacion_permitida: (proyectoActual.participacion_permitida || []).map((p) => {
			const actual = calcularActual(p);
			return {
				...JSON.parse(JSON.stringify(p)),
				id_participacion_permitida: Number(p.id_participacion_permitida),
				id_proyecto: Number(p.id_proyecto),
				id_tipo_participacion: Number(p.id_tipo_participacion),
				objetivo: Number(p.objetivo),
				actual,
				tipo_participacion: p.tipo_participacion ? {
					id_tipo_participacion: Number(p.tipo_participacion.id_tipo_participacion),
					descripcion: p.tipo_participacion.descripcion
				} : undefined
			};
		})
	} : null;

	const evidenciasMapped = evidencias.map((ev: any) => ({
		id_evidencia: Number(ev.id_evidencia),
		tipo_evidencia: ev.tipo_evidencia,
		id_participacion_permitida: Number(ev.id_participacion_permitida),
		created_at: ev.created_at instanceof Date ? ev.created_at.toISOString() : ev.created_at,
		archivos: (ev.archivos || []).map((a: any) => ({
			id_archivo: Number(a.id_archivo),
			nombre_original: a.nombre_original,
			url: a.url,
			descripcion: a.descripcion,
			tipo_mime: a.tipo_mime,
			tamanio_bytes: Number(a.tamanio_bytes || 0),
			created_at: a.created_at instanceof Date ? a.created_at.toISOString() : a.created_at,
			usuario: a.usuario ? {
				nombre: a.usuario.nombre,
				apellido: a.usuario.apellido,
				username: a.usuario.username
			} : undefined
		}))
	}));

	return {
		proyectos: JSON.parse(JSON.stringify(proyectosDisponibles)),
		proyectoActual: pActualMapped,
		objetivos: objetivos.map(obj => ({
			...JSON.parse(JSON.stringify(obj)),
			id_participacion_permitida: Number(obj.id_participacion_permitida),
			objetivo: Number(obj.objetivo),
			actual: Number(obj.actual || 0)
		})),
		solicitudPendiente: solicitudPendiente ? JSON.parse(JSON.stringify(solicitudPendiente)) : null,
		solicitudesRechazadas: JSON.parse(JSON.stringify(solicitudesRechazadas)),
		evidencias: evidenciasMapped,
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

			// Transicionar el proyecto a en_revision
			const gestionEstado = new GestionarEstadoProyecto(
				new PostgresProyectoRepository(),
				new PostgresHistorialDeCambiosRepository()
			);
			await gestionEstado.enviarASolicitudCierreConEvidencias(proyectoId, user.id_usuario!);

			return { success: true, solicitud };
		} catch (error: any) {
			return fail(400, { message: error.message });
		}
	}
};
