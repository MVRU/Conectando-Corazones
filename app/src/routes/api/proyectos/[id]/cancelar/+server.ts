import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { CancelarProyecto } from '$lib/domain/use-cases/proyectos/CancelarProyecto';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	// 1. Validar autenticación
	const session = locals.usuario;
	if (!session) {
		throw error(401, 'No autorizado');
	}

	const id = Number(params.id);
	if (isNaN(id)) {
		throw error(400, 'ID de proyecto inválido');
	}

	try {
		const { justificacion } = await request.json();

		const proyectoRepo = new PostgresProyectoRepository();
		const useCase = new CancelarProyecto(proyectoRepo);

		await useCase.execute({
			proyectoId: id,
			usuarioId: session.id_usuario!,
			rol: session.rol,
			justificacion
		});

		return json({
			success: true,
			message: 'Proyecto cancelado exitosamente'
		});
	} catch (err: any) {
		console.error('Error al cancelar proyecto:', err);
		throw error(err.status || 500, err.message || 'Error interno del servidor');
	}
};
