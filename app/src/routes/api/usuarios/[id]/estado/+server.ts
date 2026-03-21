import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { DesactivarUsuario } from '$lib/domain/use-cases/usuarios/DesactivarUsuario';

const repository = new PostgresUsuarioRepository();

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const { estado } = await request.json();
		const estadosValidos = ['activo', 'inactivo'];
		if (!estadosValidos.includes(estado)) {
			return json(
				{ error: `Estado inválido. Debe ser: ${estadosValidos.join(' o ')}` },
				{ status: 400 }
			);
		}

		const desactivarUsuario = new DesactivarUsuario(repository);
		const usuarioActualizado = await desactivarUsuario.execute(id, estado);
		return json(usuarioActualizado);
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
