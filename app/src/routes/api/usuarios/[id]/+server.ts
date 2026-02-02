import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ObtenerUsuario } from '$lib/domain/use-cases/usuarios/ObtenerUsuario';

const repository = new PostgresUsuarioRepository();
const obtenerUsuario = new ObtenerUsuario(repository);

export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	const usuario = await obtenerUsuario.execute(id);

	if (!usuario) {
		return json({ error: 'Usuario no encontrado' }, { status: 404 });
	}

	return json(usuario);
};
