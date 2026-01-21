import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { identificador, password, rememberMe } = await request.json();

	const usuario = Object.values(mockUsuarios).find((u) => {
		const email = u.contactos?.find(
			(c) => c.tipo_contacto === 'email' && c.etiqueta === 'principal'
		)?.valor;
		return u.username === identificador || email === identificador;
	});

	if (!usuario || usuario.password !== password) {
		return json({ error: 'Credenciales inválidas' }, { status: 401 });
	}

	cookies.set('auth_token', `mock-token-${usuario.username}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined
	});

	// ! Se omite la contraseña para no exponer credenciales en la respuesta
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _pw, ...safeUsuario } = usuario;
	return json({ usuario: safeUsuario });
};
