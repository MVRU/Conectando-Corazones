import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.usuario) {
		return json({ usuario: null });
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _pwd, ...usuarioSafe } = locals.usuario.toPOJO();
	return json({ usuario: usuarioSafe });
};
