import { redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-conectando-corazones';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth_token');

	if (token) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as {
				id: number;
				username: string;
				rol: string;
			};

			const usuarioRepo = new PostgresUsuarioRepository();
			// Usar findByUsernameBasic() para cargar solo datos esenciales en la sesión
			const usuario = await usuarioRepo.findByUsernameBasic(decoded.username);

			if (usuario) {
				event.locals.usuario = usuario;
			} else {
				// Usuario borrado o no existe
				event.cookies.delete('auth_token', { path: '/' });
			}
		} catch (error) {
			// Token inválido o expirado
			event.cookies.delete('auth_token', { path: '/' });
		}
	}

	if (event.url.pathname.startsWith('/mis-proyectos')) {
		if (!event.locals.usuario) {
			throw redirect(303, '/iniciar-sesion');
		}
	}

	return resolve(event);
};
