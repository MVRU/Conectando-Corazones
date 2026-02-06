import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresParticipacionPermitidaRepository } from '$lib/infrastructure/supabase/postgres/participacion-permitida.repo';
import { PostgresArchivoRepository } from '$lib/infrastructure/supabase/postgres/archivo.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-de-cambios.repo';
import { SubirEvidencia } from '$lib/domain/use-cases/SubirEvidencia';
import { EliminarArchivo } from '$lib/domain/use-cases/EliminarArchivo';
import { ListarEvidencias } from '$lib/domain/use-cases/ListarEvidencias';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { Archivo } from '$lib/domain/entities/Archivo';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const projectId = Number(params.id);

		if (isNaN(projectId)) {
			throw error(404, 'Proyecto no encontrado');
		}

		const proyectoRepo = new PostgresProyectoRepository();
		const usuarioRepo = new PostgresUsuarioRepository();

		const project = await proyectoRepo.findById(projectId);

		if (!project) throw error(404, 'Proyecto no encontrado');

		// Extraer tipos de participación únicos permitidos para este proyecto
		const tiposUnicos = Array.from(
			new Set(project.participacion_permitida?.map((p) => p.tipo_participacion?.descripcion) || [])
		).filter(Boolean) as string[];

		// Obtener todos los proyectos disponibles (en curso o pendiente de cierre)
		// Usar findAllSummary() para reducir datos transferidos
		const allProjects = await proyectoRepo.findAllSummary();
		const proyectosDisponibles = allProjects
			.filter((p) => p.estado === 'en_curso' || p.estado === 'pendiente_solicitud_cierre')
			.map((p) => ({
				id_proyecto: p.id_proyecto,
				titulo: p.titulo,
				estado: p.estado
			}));

		// Obtener datos de la institución
		let nombreInstitucion = 'Institución';
		if (project.institucion_id) {
			const institucion = await usuarioRepo.findById(project.institucion_id);
			if (institucion && institucion.nombre_legal) {
				nombreInstitucion = institucion.nombre_legal;
			}
		}

		// 4. Cargar Evidencias Existentes
		const evidenciaRepo = new PostgresEvidenciaRepository();
		const colaboracionRepo = new PostgresColaboracionRepository();
		const listarEvidencias = new ListarEvidencias(evidenciaRepo, proyectoRepo, colaboracionRepo);

		let evidencias: any[] = [];
		try {
			if (locals.usuario) {
				const evidenciasDominio = await listarEvidencias.execute(
					projectId,
					locals.usuario.id_usuario!,
					locals.usuario.rol
				);

				// Mapear y generar URLs firmadas para visualización
				evidencias = await Promise.all(
					evidenciasDominio.map(async (ev) => {
						const archivosConUrl = await Promise.all(
							ev.archivos.map(async (archivo: any) => {
								// Si la URL ya es http (antiguos) o data, la dejamos. Si es relativa (storage), firmamos.
								let urlFirmada = archivo.url;
								if (
									archivo.url &&
									!archivo.url.startsWith('http') &&
									!archivo.url.startsWith('data:')
								) {
									const partes = archivo.url.split('/');
									const bucketName = partes[0] === 'evidencias' ? 'evidencias' : 'avatars';
									const path = partes.slice(1).join('/');

									if (path) {
										const { data } = await supabaseAdmin.storage
											.from(bucketName)
											.createSignedUrl(path, 3600); // 1 hora de validez

										if (data?.signedUrl) {
											urlFirmada = data.signedUrl;
										}
									}
								}

								return {
									...archivo,
									url: urlFirmada
								};
							})
						);

						return {
							...ev,
							archivos: archivosConUrl
						};
					})
				);
			}
		} catch (e) {
			console.error('Error cargando evidencias:', e);
			// No bloqueamos la carga de la página si fallan las evidencias
		}

		return {
			proyecto: JSON.parse(
				JSON.stringify({
					id_proyecto: project.id_proyecto,
					titulo: project.titulo,
					descripcion: project.descripcion,
					estado: project.estado,
					nombreInstitucion
				})
			),
			proyectosDisponibles: JSON.parse(JSON.stringify(proyectosDisponibles)),
			tiposParticipacion: tiposUnicos,
			participacionesPermitidas: JSON.parse(JSON.stringify(project.participacion_permitida || [])),
			evidencias: JSON.parse(JSON.stringify(evidencias))
		};
	} catch (err) {
		console.error('Error loading evidencias page:', err);
		// Si es un error 404, lo re-lanzamos
		if (err && typeof err === 'object' && 'status' in err && (err as any).status === 404) {
			throw err;
		}
		// Para otros errores, retornamos datos vacíos en lugar de 500
		return {
			proyecto: {
				id_proyecto: 0,
				titulo: '',
				descripcion: '',
				estado: 'en_curso',
				nombreInstitucion: ''
			},
			proyectosDisponibles: [],
			tiposParticipacion: [],
			participacionesPermitidas: []
		};
	}
};

export const actions = {
	guardarEvidencia: async ({ request, locals, params }) => {
		if (!locals.usuario) {
			throw error(401, 'Usuario no autenticado');
		}

		if (locals.usuario.rol !== 'institucion') {
			throw error(403, 'Solo instituciones pueden realizar esta acción');
		}

		const formData = await request.formData();
		const evidenciasJson = formData.get('evidencias')?.toString();
		const eliminadasJson = formData.get('eliminadas')?.toString();
		const idParticipacionPermitidaStr = formData.get('id_participacion_permitida')?.toString();

		if (!evidenciasJson || !idParticipacionPermitidaStr) {
			return fail(400, { error: 'Faltan datos requeridos' });
		}

		const idParticipacionPermitida = Number(idParticipacionPermitidaStr);
		const evidencias = JSON.parse(evidenciasJson); // EvidenciaNueva[] del frontend
		const eliminadas = eliminadasJson ? JSON.parse(eliminadasJson) : []; // number[] IDs de archivos

		// Repositorios
		const evidenciaRepo = new PostgresEvidenciaRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const colaboracionRepo = new PostgresColaboracionRepository();
		const participacionRepo = new PostgresParticipacionPermitidaRepository();
		const archivoRepo = new PostgresArchivoRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();

		// Casos de uso
		const subirEvidencia = new SubirEvidencia(
			evidenciaRepo,
			proyectoRepo,
			colaboracionRepo,
			participacionRepo,
			historialRepo
		);

		const eliminarArchivo = new EliminarArchivo(archivoRepo, proyectoRepo, historialRepo);

		try {
			// 1. Procesar eliminaciones
			if (eliminadas.length > 0) {
				await Promise.all(
					eliminadas.map(async (idArchivo: number) => {
						const archivoEliminado = await eliminarArchivo.execute(
							idArchivo,
							locals.usuario!.id_usuario!
						);

						// Eliminar de Supabase Storage
						if (archivoEliminado && archivoEliminado.url) {
							const partes = archivoEliminado.url.split('/');
							if (partes.length > 1) {
								const bucket = partes[0];
								const path = partes.slice(1).join('/');

								if (bucket && path) {
									await supabaseAdmin.storage.from(bucket).remove([path]);
								}
							}
						}
					})
				);
			}

			// 2. Procesar nuevas evidencias
			const archivosAProcesar: Archivo[] = evidencias.flatMap((ev: any) =>
				ev.archivos.map((a: any) => {
					// Mapear al dominio Archivo
					return new Archivo({
						nombre_original: a.nombre_original,
						url: a.url, // Full path devuelto por API
						tipo_mime: a.tipo_mime,
						tamanio_bytes: a.tamanio_bytes,
						descripcion: a.descripcion,
						usuario_id: locals.usuario!.id_usuario!
					});
				})
			);

			if (archivosAProcesar.length > 0) {
				await subirEvidencia.execute(
					locals.usuario.id_usuario!,
					locals.usuario.rol,
					idParticipacionPermitida,
					'salida',
					archivosAProcesar
				);
			}

			return { success: true };
		} catch (err: any) {
			console.error('Error al guardar evidencia:', err);
			return fail(500, { error: err.message || 'Error interno del servidor' });
		}
	}
};
