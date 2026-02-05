import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresColaboracionTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion-tipo-participacion.repo';
import { PostgresParticipacionPermitidaRepository } from '$lib/infrastructure/supabase/postgres/participacion-permitida.repo';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-de-cambios.repo';
import { RegistrarAporte } from '$lib/domain/use-cases/colaboracion-tipo-participacion/RegistrarAporte';
import { SubirEvidencia } from '$lib/domain/use-cases/SubirEvidencia';

export const load: PageServerLoad = async ({ params, locals }) => {
	const usuario = locals.usuario;
	if (!usuario || usuario.rol !== 'colaborador' || !usuario.id_usuario) {
		throw error(401, 'Debes iniciar sesión como colaborador');
	}

	const projectId = Number(params.id);
	const proyectoRepo = new PostgresProyectoRepository();
	const colaboracionRepo = new PostgresColaboracionRepository();

	const proyecto = await proyectoRepo.findById(projectId);
	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	const allowedStatuses = ['en_curso', 'pendiente_solicitud_cierre'];
	if (!proyecto.estado || !allowedStatuses.includes(proyecto.estado)) {
		throw error(403, 'El proyecto no acepta nuevos aportes en su estado actual');
	}

	const colaboracion = await colaboracionRepo.findByProyectoAndColaborador(
		projectId,
		usuario.id_usuario
	);
	if (!colaboracion || colaboracion.estado !== 'aprobada') {
		throw error(403, 'No tenés una colaboración aprobada en este proyecto');
	}

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		participacionesPermitidas: JSON.parse(JSON.stringify(proyecto.participacion_permitida || [])),
		colaboracionId: colaboracion.id_colaboracion,
		existingContributions: JSON.parse(
			JSON.stringify(colaboracion.colaboraciones_tipo_participacion || [])
		)
	};
};

export const actions: Actions = {
	guardarAporte: async ({ request, locals, params }) => {
		const usuario = locals.usuario;
		if (!usuario || usuario.rol !== 'colaborador' || !usuario.id_usuario) {
			return fail(401, { error: 'No autorizado' });
		}

		const formData = await request.formData();
		const colaboracion_id = Number(formData.get('colaboracion_id'));
		const participacion_permitida_id = Number(formData.get('participacion_permitida_id'));
		const cantidad = Number(formData.get('cantidad'));
		const evidenciasJson = formData.get('evidencias')?.toString();

		if (!colaboracion_id || !participacion_permitida_id) {
			return fail(400, { error: 'Faltan datos requeridos' });
		}

		// Repositorios
		const aporteRepo = new PostgresColaboracionTipoParticipacionRepository();
		const colaboracionRepo = new PostgresColaboracionRepository();
		const participacionRepo = new PostgresParticipacionPermitidaRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const evidenciaRepo = new PostgresEvidenciaRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();

		// Casos de uso
		const registrarAporte = new RegistrarAporte(
			aporteRepo,
			colaboracionRepo,
			participacionRepo,
			proyectoRepo
		);

		const subirEvidencia = new SubirEvidencia(
			evidenciaRepo,
			proyectoRepo,
			colaboracionRepo,
			participacionRepo,
			historialRepo
		);

		try {
			// 1. Registrar el aporte (cantidad)
			await registrarAporte.execute(
				{
					colaboracion_id,
					participacion_permitida_id,
					cantidad
				},
				usuario.id_usuario
			);

			// 2. Si hay evidencias, guardarlas
			if (evidenciasJson) {
				const evidenciasData = JSON.parse(evidenciasJson);
				// El frontend envía [{ archivos: [...] }]
				for (const ev of evidenciasData) {
					if (ev.archivos && ev.archivos.length > 0) {
						await subirEvidencia.execute(
							usuario.id_usuario,
							usuario.rol,
							participacion_permitida_id,
							'entrada',
							ev.archivos.map((a: any) => ({
								...a,
								usuario_id: usuario.id_usuario // Asegurar que el archivo tenga el ID del usuario
							}))
						);
					}
				}
			}

			return { success: true };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Error al guardar aporte';
			return fail(400, { error: message });
		}
	}
};
