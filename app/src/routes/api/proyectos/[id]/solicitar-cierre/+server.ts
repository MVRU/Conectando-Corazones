import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { GestionarEstadoProyecto } from '$lib/domain/use-cases/proyectos/GestionarEstadoProyecto';

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = locals.usuario;
	if (!session) {
		throw error(401, 'No autorizado');
	}

	if (session.rol !== 'institucion') {
		throw error(403, 'Solo las instituciones pueden finalizar actividades de un proyecto');
	}

	const id = Number(params.id);
	if (isNaN(id)) {
		throw error(400, 'ID de proyecto inválido');
	}

	try {
		const proyectoRepo = new PostgresProyectoRepository();
		const useCase = new GestionarEstadoProyecto(proyectoRepo);
		await useCase.solicitarCierre(id, session.id_usuario!);

		return json({
			success: true,
			message: 'Actividades finalizadas correctamente'
		});
	} catch (err: any) {
		if (err.status) throw err;
		console.error('Error al finalizar actividades:', err);
		throw error(500, err.message || 'Error interno del servidor');
	}
};
