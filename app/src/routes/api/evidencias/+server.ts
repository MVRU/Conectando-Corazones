import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresParticipacionPermitidaRepository } from '$lib/infrastructure/supabase/postgres/participacion-permitida.repo';
import { SubirEvidencia } from '$lib/domain/use-cases/SubirEvidencia';
import { ListarEvidencias } from '$lib/domain/use-cases/ListarEvidencias';
import { Archivo } from '$lib/domain/entities/Archivo';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.usuario || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const id_proyecto = url.searchParams.get('id_proyecto');
	if (!id_proyecto) {
		return json({ error: 'Debe especificar el id_proyecto' }, { status: 400 });
	}

	try {
		const evidenciaRepo = new PostgresEvidenciaRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const colaboracionRepo = new PostgresColaboracionRepository();

		const listarUseCase = new ListarEvidencias(evidenciaRepo, proyectoRepo, colaboracionRepo);

		const evidencias = await listarUseCase.execute(
			Number(id_proyecto),
			locals.usuario.id_usuario,
			locals.usuario.rol
		);

		return json(evidencias);
	} catch (error: any) {
		return json({ error: error.message || 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { id_participacion_permitida, tipo_evidencia, archivos } = body;

		if (!id_participacion_permitida || !tipo_evidencia || !archivos || !Array.isArray(archivos)) {
			return json({ error: 'Faltan campos obligatorios' }, { status: 400 });
		}

		const evidenciaRepo = new PostgresEvidenciaRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const colaboracionRepo = new PostgresColaboracionRepository();
		const participacionRepo = new PostgresParticipacionPermitidaRepository();

		const subirEvidenciaUseCase = new SubirEvidencia(
			evidenciaRepo,
			proyectoRepo,
			colaboracionRepo,
			participacionRepo
		);

		// Convertir archivos recibidos (DTO/JSON) a entidades Archivo
		const entidadArchivos = archivos.map((a: any) => {
			return new Archivo({
				nombre_original: a.nombre_original,
				url: a.url,
				descripcion: a.descripcion,
				tipo_mime: a.tipo_mime,
				tamanio_bytes: a.tamanio_bytes,
				usuario_id: locals.usuario!.id_usuario, // Asignamos el usuario actual como dueño del archivo
				proyecto_id: a.proyecto_id // Opcional, pero idealmente se deduce del contexto
			});
		});

		const nuevaEvidencia = await subirEvidenciaUseCase.execute(
			locals.usuario.id_usuario,
			locals.usuario.rol,
			id_participacion_permitida,
			tipo_evidencia,
			entidadArchivos
		);

		return json(nuevaEvidencia, { status: 201 });
	} catch (error: any) {
		console.error('Error al subir evidencia:', error);
		return json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
	}
};
