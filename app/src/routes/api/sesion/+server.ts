import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';
import type { Usuario } from '$lib/domain/types/Usuario';

// Tipo para la respuesta de sesión sin el password
type UsuarioSeguro = Omit<Usuario, 'password'>;

interface RespuestaSesion {
	usuario: UsuarioSeguro | null;
}

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('auth_token');

	if (!token) {
		return json({ usuario: null } as RespuestaSesion);
	}

	const nombreUsuario = token.replace('mock-token-', '');
	const usuario = Object.values(mockUsuarios).find((u) => u.username === nombreUsuario);

	if (!usuario) {
		// Eliminar token inválido
		cookies.delete('auth_token', { path: '/' });
		return json({ usuario: null } as RespuestaSesion);
	}

	// ! Eliminar password por seguridad antes de enviar la respuesta
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _password, ...usuarioSeguro } = usuario;
	return json({ usuario: usuarioSeguro } as RespuestaSesion);
};
