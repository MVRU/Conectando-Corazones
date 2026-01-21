import { redirect, type Handle } from '@sveltejs/kit';
import { mockUsuarios } from 'tests/mocks/mock-usuarios';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth_token');
	if (token) {
		const username = token.replace('mock-token-', '');
		const usuario = Object.values(mockUsuarios).find((u) => u.username === username);
		if (usuario) {
			event.locals.usuario = usuario;
		} else {
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

