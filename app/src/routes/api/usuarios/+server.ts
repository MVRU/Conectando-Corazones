import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { CrearUsuario } from '$lib/domain/use-cases/usuarios/CrearUsuario';
import { Usuario } from '$lib/domain/entities/Usuario';

const repository = new PostgresUsuarioRepository();
const crearUsuario = new CrearUsuario(repository);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const nuevoUsuario = await crearUsuario.execute(data);
		return json(nuevoUsuario, { status: 201 });
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error desconocido' }, { status: 500 });
	}
};
