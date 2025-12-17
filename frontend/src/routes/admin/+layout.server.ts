import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Obtener el usuario desde locals (configurado en hooks.server.ts)
	const usuario = locals.usuario;

	// Si no hay usuario autenticado, redirigir al login
	if (!usuario) {
		throw redirect(302, '/iniciar-sesion?redirect=/admin');
	}

	// Si el usuario no es administrador, redirigir al panel de usuario
	if (usuario.rol !== 'administrador') {
		throw redirect(302, '/mi-panel');
	}

	return {
		usuario
	};
};
