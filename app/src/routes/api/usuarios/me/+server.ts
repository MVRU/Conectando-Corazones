import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { EliminarUsuario } from '$lib/domain/use-cases/usuarios/EliminarUsuario';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

export const DELETE: RequestHandler = async ({ locals }) => {
	if (!locals.usuario) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	try {
		const id = locals.usuario.id_usuario!;
		const authId = locals.usuario.auth_user_id;

		// 1. Eliminar del dominio (DB)
		const repo = new PostgresUsuarioRepository();
		await new EliminarUsuario(repo).execute(id);

		// 2. Eliminar de Supabase Auth (si aplica)
		if (authId) {
			const { error } = await supabaseAdmin.auth.admin.deleteUser(authId);
			if (error) {
				console.error('Error al eliminar usuario de Supabase Auth:', error);
			}
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
