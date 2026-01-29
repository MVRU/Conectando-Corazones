import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { CrearProyecto } from '$lib/domain/use-cases/proyectos/crearProyecto';
import type { ProyectoCreate } from '$lib/domain/types/dto/ProyectoCreate';

export const POST: RequestHandler = async ({ request, locals }) => {
	// 1. Verificar autenticación y rol
	const usuario = locals.usuario;
	if (!usuario || usuario.rol !== 'institucion') {
		return json(
			{ error: 'No autorizado. Solo las instituciones pueden crear proyectos.' },
			{ status: 403 }
		);
	}

	try {
		const data = await request.json();

		// 2. Preparar el repositorio y caso de uso
		const proyectoRepo = new PostgresProyectoRepository();
		const crearProyecto = new CrearProyecto(proyectoRepo);

		// 3. Ejecutar con el ID de la institución de la sesión
		const payload: ProyectoCreate = {
			...data,
			institucion_id: usuario.id_usuario
		};

		const proyectoCreado = await crearProyecto.execute(payload);

		return json({
			success: true,
			proyecto: proyectoCreado
		});
	} catch (error: any) {
		console.error('Error al crear proyecto:', error);
		return json(
			{
				success: false,
				error: error.message || 'Error interno al crear el proyecto'
			},
			{ status: 500 }
		);
	}
};
