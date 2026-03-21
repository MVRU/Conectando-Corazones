import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { EliminarUsuario } from '$lib/domain/use-cases/usuarios/EliminarUsuario';

export const DELETE: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.usuario) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	try {
		const id = locals.usuario.id_usuario!;

		const repo = new PostgresUsuarioRepository();
		await new EliminarUsuario(repo).execute(id);

		if (locals.supabase) {
			await locals.supabase.auth.signOut();
		}
		cookies.delete('session_usuario', { path: '/' });
		cookies.delete('remember_me', { path: '/' });

		return new Response(null, { status: 204 });
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
