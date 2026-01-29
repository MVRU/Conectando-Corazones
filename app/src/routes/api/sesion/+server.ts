import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.usuario) {
		return json({ usuario: null });
	}

	// locals.usuario ya está poblado en hooks.server.ts desde la BD
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...usuarioSafe } = locals.usuario;
	return json({ usuario: usuarioSafe });
};
