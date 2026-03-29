import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Usar el usuario ya cargado y cacheado en locals
	if (locals.usuario) {
		throw redirect(302, `/perfil/${locals.usuario.username}`);
	}

	// 2. Si no hay usuario ni sesión después de pasar por hooks, redirigir a login
	throw redirect(302, '/iniciar-sesion');
};
