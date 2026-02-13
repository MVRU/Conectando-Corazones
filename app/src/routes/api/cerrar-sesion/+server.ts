import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	// 1. Cerrar sesión en Supabase (invalida el token en el servidor)
	if (locals.supabase) {
		await locals.supabase.auth.signOut();
	}

	// 2. Retornar éxito (Supabase Auth Helper maneja las cookies automáticamente)
	return json({ success: true });
};
