import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ObtenerUsuario } from '$lib/domain/use-cases/usuarios/ObtenerUsuario';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { username, email } = await request.json();
		const repo = new PostgresUsuarioRepository();
		const obtenerUsuario = new ObtenerUsuario(repo);
		const errores: Record<string, string> = {};

		if (username) {
			const usuarioExistente = await obtenerUsuario.porUsername(username);
			if (usuarioExistente) {
				errores.username = 'Este nombre de usuario ya está ocupado.';
			}
		}

		if (email) {
			const emailExistente = await obtenerUsuario.porEmail(email);
			if (emailExistente) {
				errores.email = 'Este correo electrónico ya está registrado.';
			}
		}

		return json({
			disponible: Object.keys(errores).length === 0,
			errores
		});
	} catch (error) {
		console.error('Error verificando disponibilidad:', error);
		if (error instanceof Error) {
			console.error('Stack:', error.stack);
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
