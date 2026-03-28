import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
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

		// 2. Verificar que la institución esté verificada para publicar
		// Las instituciones no verificadas pueden crear borradores pero no publicar
		if (usuario.rol === 'institucion' && usuario.estado_verificacion !== 'aprobada') {
			const estadoSolicitado = data.estado || 'en_curso';
			if (estadoSolicitado === 'en_curso') {
				return json(
					{ error: 'Tu institución debe estar verificada para publicar proyectos.' },
					{ status: 403 }
				);
			}
		}

		// 3. Preparar los repositorios y caso de uso
		const proyectoRepo = new PostgresProyectoRepository();
		const usuarioRepo = new PostgresUsuarioRepository();
		const crearProyecto = new CrearProyecto(proyectoRepo, usuarioRepo);

		// 4. Ejecutar con el ID de la institución de la sesión (o el provisto si es admin)
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
