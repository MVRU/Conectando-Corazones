import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresArchivoRepository } from '$lib/infrastructure/supabase/postgres/archivo.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-de-cambios.repo';
import { EliminarArchivo } from '$lib/domain/use-cases/EliminarArchivo';
import { ActualizarArchivo } from '$lib/domain/use-cases/ActualizarArchivo';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.usuario || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const id = params.id;
	if (!id) {
		return json({ error: 'Falta el ID del archivo' }, { status: 400 });
	}

	try {
		const nuevosDatos = await request.json();
		const archivoRepo = new PostgresArchivoRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();
		const actualizarUseCase = new ActualizarArchivo(archivoRepo, proyectoRepo, historialRepo);

		await actualizarUseCase.execute(Number(id), locals.usuario.id_usuario, nuevosDatos);

		return json({ message: 'Archivo actualizado correctamente' });
	} catch (error: any) {
		console.error('Error al actualizar archivo:', error);
		return json({ error: error.message || 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.usuario || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const id = params.id;
	if (!id) {
		return json({ error: 'Falta el ID del archivo' }, { status: 400 });
	}

	try {
		const archivoRepo = new PostgresArchivoRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();
		const eliminarUseCase = new EliminarArchivo(archivoRepo, proyectoRepo, historialRepo);

		await eliminarUseCase.execute(Number(id), locals.usuario.id_usuario);

		return json({ message: 'Archivo eliminado correctamente' });
	} catch (error: any) {
		console.error('Error al eliminar archivo:', error);
		return json({ error: error.message || 'Internal server error' }, { status: 500 });
	}
};
