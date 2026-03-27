import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}
	if (usuario.rol !== 'institucion') {
		throw error(403, 'Esta sección es solo para cuentas de institución.');
	}
	return { usuario: usuario.toPOJO() };
};
