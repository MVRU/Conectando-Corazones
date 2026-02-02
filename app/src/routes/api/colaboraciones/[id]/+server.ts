import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { ActualizarEstadoColaboracion } from '$lib/domain/use-cases/colaboraciones/ActualizarEstadoColaboracion';
import { AnularColaboracion } from '$lib/domain/use-cases/colaboraciones/AnularColaboracion';

const repo = new PostgresColaboracionRepository();
const proyectoRepo = new PostgresProyectoRepository();

export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const colaboracion = await repo.findById(id);
	if (!colaboracion) return json({ error: 'Colaboración no encontrada' }, { status: 404 });

	return json(colaboracion);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const usuario = locals.usuario;
	if (!usuario) return json({ error: 'No autenticado' }, { status: 401 });

	try {
		const data = await request.json();
		const { estado, justificacion } = data;

		if (!estado || !['aprobada', 'rechazada'].includes(estado)) {
			return json({ error: 'Estado no válido' }, { status: 400 });
		}

		// Validar que sea el dueño del proyecto o admin
		const colaboracion = await repo.findById(id);
		if (!colaboracion) return json({ error: 'Colaboración no encontrada' }, { status: 404 });

		const proyecto = await proyectoRepo.findById(colaboracion.proyecto_id!);
		if (!proyecto) return json({ error: 'Proyecto no encontrado' }, { status: 404 });

		if (proyecto.institucion_id !== usuario.id_usuario && usuario.rol !== 'administrador') {
			return json({ error: 'No autorizado' }, { status: 403 });
		}

		const useCase = new ActualizarEstadoColaboracion(repo);
		const updated = await useCase.execute(id, estado as any, justificacion);

		return json(updated);
	} catch (error: any) {
		return json({ error: error.message }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const usuario = locals.usuario;
	if (!usuario) return json({ error: 'No autenticado' }, { status: 401 });

	try {
		const colaboracion = await repo.findById(id);
		if (!colaboracion) return json({ error: 'Colaboración no encontrada' }, { status: 404 });

		// Solo el propio colaborador puede anular su solicitud
		if (colaboracion.colaborador_id !== usuario.id_usuario && usuario.rol !== 'administrador') {
			return json({ error: 'No autorizado' }, { status: 403 });
		}

		const useCase = new AnularColaboracion(repo);
		await useCase.execute(id);

		return new Response(null, { status: 204 });
	} catch (error: any) {
		return json({ error: error.message }, { status: 400 });
	}
};
