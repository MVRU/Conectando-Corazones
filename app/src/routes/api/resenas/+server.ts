import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresResenaRepository } from '$lib/infrastructure/supabase/postgres/resena.repo';
import { AgregarResena } from '$lib/domain/use-cases/resenas/agregarResena';

const repository = new PostgresResenaRepository();

export const GET: RequestHandler = async () => {
	try {
		const resenas = await repository.findAll();
		return json(resenas);
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 500 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	try {
		const data = await request.json();
		const agregarResena = new AgregarResena(repository);
		const resena = await agregarResena.execute({
			...data,
			username: locals.usuario.username
		});
		return json(resena, { status: 201 });
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
