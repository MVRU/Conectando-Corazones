import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ObtenerUsuario } from '$lib/domain/use-cases/usuarios/ObtenerUsuario';
import { ActualizarUsuario } from '$lib/domain/use-cases/usuarios/ActualizarUsuario';

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

export const PUT: RequestHandler = async ({ params, request }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const data = await request.json();
		const actualizarUsuario = new ActualizarUsuario(repository);
		const usuarioActualizado = await actualizarUsuario.execute(id, data);
		return json(usuarioActualizado);
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
