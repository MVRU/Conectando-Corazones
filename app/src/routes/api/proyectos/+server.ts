import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { CrearProyecto } from '$lib/domain/use-cases/proyectos/crearProyecto';
import type { ProyectoCreate } from '$lib/domain/types/dto/ProyectoCreate';

export const GET: RequestHandler = async ({ url }) => {
	const repo = new PostgresProyectoRepository();

	const query = url.searchParams.get('q');
	const estado = url.searchParams.get('estado');

	if (query || estado) {
		const searchCriteria = {
			query: query || undefined,
			estado: (estado as any) || undefined,
			limit: 20,
			offset: 0
		};
		const proyectos = await repo.search(searchCriteria);
		return json(proyectos);
	}

	const proyectos = await repo.findAllSummary();
	return json(proyectos);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// 1. Verificar autenticación y rol
	const usuario = locals.usuario;
	if (!usuario || (usuario.rol !== 'institucion' && usuario.rol !== 'administrador')) {
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

		// 3. Ejecutar con el ID de la institución de la sesión (o el provisto si es admin)
		const payload: ProyectoCreate = {
			...data,
			institucion_id:
				usuario.rol === 'administrador' && data.institucion_id
					? data.institucion_id
					: usuario.id_usuario
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
