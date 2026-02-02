import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ListarColaboracionesPorProyecto } from '$lib/domain/use-cases/colaboraciones/ListarColaboracionesPorProyecto';
import { ListarColaboracionesPorColaborador } from '$lib/domain/use-cases/colaboraciones/ListarColaboracionesPorColaborador';
import { CrearColaboracion } from '$lib/domain/use-cases/colaboraciones/CrearColaboracion';

const repo = new PostgresColaboracionRepository();
const proyectoRepo = new PostgresProyectoRepository();
const usuarioRepo = new PostgresUsuarioRepository();

export const GET: RequestHandler = async ({ url }) => {
	try {
		const proyectoId = url.searchParams.get('proyecto_id');
		const colaboradorId = url.searchParams.get('colaborador_id');

		if (proyectoId) {
			const useCase = new ListarColaboracionesPorProyecto(repo);
			const colaboraciones = await useCase.execute(Number(proyectoId));
			return json(colaboraciones);
		}

		if (colaboradorId) {
			const useCase = new ListarColaboracionesPorColaborador(repo);
			const colaboraciones = await useCase.execute(Number(colaboradorId));
			return json(colaboraciones);
		}

		throw error(400, 'Se requiere proyecto_id o colaborador_id');
	} catch (err: any) {
		console.error('Error in GET /api/colaboraciones:', err);
		return json(
			{ error: err.message || 'Error al obtener colaboraciones' },
			{ status: err.status || 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		return json({ error: 'Debés iniciar sesión para enviar una solicitud.' }, { status: 401 });
	}

	try {
		const data = await request.json();

		if (!data.proyecto_id) {
			return json({ error: 'Se requiere proyecto_id' }, { status: 400 });
		}

		const useCase = new CrearColaboracion(repo, proyectoRepo, usuarioRepo);
		const colaboracion = await useCase.execute({
			proyecto_id: data.proyecto_id,
			colaborador_id: usuario.id_usuario!,
			mensaje: data.mensaje
		});

		return json(colaboracion, { status: 201 });
	} catch (err: any) {
		console.error('Error in POST /api/colaboraciones:', err);
		return json({ error: err.message || 'Error al crear colaboración' }, { status: 400 });
	}
};
