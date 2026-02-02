import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { CancelarProyecto } from '$lib/domain/use-cases/proyectos/CancelarProyecto';
import { EditarProyecto } from '$lib/domain/use-cases/proyectos/EditarProyecto';
import { Proyecto } from '$lib/domain/entities/Proyecto';

const repo = new PostgresProyectoRepository();

export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const proyecto = await repo.findById(id);
	if (!proyecto) return json({ error: 'Proyecto no encontrado' }, { status: 404 });

	return json(proyecto);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const usuario = locals.usuario;
	if (!usuario) return json({ error: 'No autenticado' }, { status: 401 });

	try {
		const data = await request.json();
		const useCase = new EditarProyecto(repo);

		const updated = await useCase.execute(id, data, usuario.id_usuario!);
		return json(updated);
	} catch (error: any) {
		console.error('Error al editar el proyecto:', error);
		return json({ error: error.message }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ params, request, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const usuario = locals.usuario;
	if (!usuario) return json({ error: 'No autenticado' }, { status: 401 });

	try {
		const { justificacion } = await request.json().catch(() => ({}));
		const useCase = new CancelarProyecto(repo);

		const proyecto = await repo.findById(id);
		if (!proyecto) return json({ error: 'Proyecto no encontrado' }, { status: 404 });

		if (proyecto.institucion_id !== usuario.id_usuario && usuario.rol !== 'administrador') {
			return json({ error: 'No autorizado para cancelar este proyecto' }, { status: 403 });
		}

		await useCase.execute({
			proyectoId: id,
			usuarioId: usuario.id_usuario!,
			justificacion
		});
		return new Response(null, { status: 204 });
	} catch (error: any) {
		return json({ error: error.message }, { status: 400 });
	}
};
