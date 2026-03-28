import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { CambiarContrasena } from '$lib/domain/use-cases/auth/CambiarContrasena';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

const repository = new PostgresUsuarioRepository();

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	try {
		const { nuevaContrasena } = await request.json();

		// Actualizar hash en la DB local (dominio, sin depender de Supabase)
		const cambiarContrasena = new CambiarContrasena(repository);
		await cambiarContrasena.execute({
			userId: locals.usuario.id_usuario!,
			nuevaContrasena
		});

		// Actualizar contraseña en Supabase Auth (infraestructura, solo en el servidor)
		if (locals.usuario.auth_user_id) {
			const { error } = await supabaseAdmin.auth.admin.updateUserById(locals.usuario.auth_user_id, {
				password: nuevaContrasena
			});
			if (error) {
				throw new Error(`Error al actualizar contraseña en Auth: ${error.message}`);
			}
		}

		return json({ message: 'Contraseña actualizada correctamente' });
	} catch (error) {
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
