import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AuthGuard } from '$lib/infrastructure/auth/AuthGuard';

/**
 * Endpoint de redirección para el panel principal según el rol del usuario.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const { usuario } = locals;

	// AuthGuard en hooks ya verificó que el usuario existe si llegó aquí.
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	throw redirect(303, AuthGuard.getPanelRedirect(usuario));
};
