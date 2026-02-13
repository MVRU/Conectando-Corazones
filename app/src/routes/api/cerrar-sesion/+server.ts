import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	// Cerrar sesión en Supabase (invalida el token en el servidor)
	if (locals.supabase) {
		await locals.supabase.auth.signOut();
	}

	// Limpiar cookies de sesión y preferencia
	cookies.delete('session_usuario', { path: '/' });
	cookies.delete('remember_me', { path: '/' });

	// Retornar éxito (Supabase Auth Helper maneja las cookies de auth automáticamente)
	return json({ success: true });
};
