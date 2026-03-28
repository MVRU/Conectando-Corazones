import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ObtenerUsuario } from '$lib/domain/use-cases/usuarios/ObtenerUsuario';
import { ActualizarUsuario } from '$lib/domain/use-cases/usuarios/ActualizarUsuario';
import { EliminarUsuario } from '$lib/domain/use-cases/usuarios/EliminarUsuario';

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _pwd, ...usuarioSafe } = usuario.toPOJO();
	return json(usuarioSafe);
};

export const PUT: RequestHandler = async ({ params, request, locals, cookies }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		// TODO (Marina Milo): Validar que el usuario autenticado (locals.usuario.id_usuario) coincida con el ID solicitado o sea admin
		const data = await request.json();
		const actualizarUsuario = new ActualizarUsuario(repository);
		const usuarioActualizado = await actualizarUsuario.execute(id, data);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _pwd, ...usuarioActualizadoSafe } = usuarioActualizado.toPOJO();

		// Actualizar cookie de sesión si es el usuario autenticado para que el Header refleje cambios
		if (locals.usuario?.id_usuario === id) {
			const rememberMe = cookies.get('remember_me') === 'true';
			const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined;
			cookies.set('session_usuario', JSON.stringify(usuarioActualizadoSafe), {
				path: '/',
				httpOnly: false,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge
			});
		}

		return json(usuarioActualizadoSafe);
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const eliminarUsuario = new EliminarUsuario(repository);
		await eliminarUsuario.execute(id);
		return new Response(null, { status: 204 });
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
