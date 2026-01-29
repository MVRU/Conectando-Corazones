import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AutenticarUsuario } from '$lib/domain/use-cases/auth/AutenticarUsuario';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-conectando-corazones';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { identificador, password, rememberMe } = await request.json();

		if (!identificador || !password) {
			return json({ error: 'Credenciales incompletas' }, { status: 400 });
		}

		const repo = new PostgresUsuarioRepository();
		const useCase = new AutenticarUsuario(repo);
		const usuario = await useCase.execute(identificador, password);

		if (!usuario) {
			return json({ error: 'Credenciales inválidas' }, { status: 401 });
		}

		// Generar JWT
		const token = jwt.sign(
			{ id: usuario.id_usuario, username: usuario.username, rol: usuario.rol },
			JWT_SECRET,
			{ expiresIn: rememberMe ? '30d' : '1d' }
		);

		cookies.set('auth_token', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24
		});

		// Strip sensitive data
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...usuarioSafe } = usuario;

		return json({ usuario: usuarioSafe });
	} catch (error) {
		console.error('Error logging in:', error);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
