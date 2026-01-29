import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { ListarColaboracionesPorProyecto } from '$lib/domain/use-cases/colaboraciones/ListarColaboracionesPorProyecto';
import { ListarColaboracionesPorColaborador } from '$lib/domain/use-cases/colaboraciones/ListarColaboracionesPorColaborador';
import { CrearColaboracion } from '$lib/domain/use-cases/colaboraciones/CrearColaboracion';

const repo = new PostgresColaboracionRepository();

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
	} catch (err) {
		console.error('Error in GET /api/colaboraciones:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Error al obtener colaboraciones');
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const data = await request.json();

		if (!data.proyecto_id || !data.colaborador_id) {
			throw error(400, 'Se requiere proyecto_id y colaborador_id');
		}

		const useCase = new CrearColaboracion(repo);
		const colaboracion = await useCase.execute({
			proyecto_id: data.proyecto_id,
			colaborador_id: data.colaborador_id,
			mensaje: data.mensaje
		});

		return json(colaboracion, { status: 201 });
	} catch (err) {
		console.error('Error in POST /api/colaboraciones:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Error al crear colaboración');
	}
};
