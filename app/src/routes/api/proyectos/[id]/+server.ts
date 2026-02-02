import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { CancelarProyecto } from '$lib/domain/use-cases/proyectos/CancelarProyecto';
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
		const proyectoActual = await repo.findById(id);
		if (!proyectoActual) return json({ error: 'Proyecto no encontrado' }, { status: 404 });

		// Solo la institución dueña o un admin pueden editar
		if (proyectoActual.institucion_id !== usuario.id_usuario && usuario.rol !== 'administrador') {
			return json({ error: 'No autorizado para editar este proyecto' }, { status: 403 });
		}

		const data = await request.json();
		const proyectoData = new Proyecto({
			...proyectoActual,
			...data,
			id_proyecto: id
		});

		const updated = await repo.update(proyectoData);
		return json(updated);
	} catch (error: any) {
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
