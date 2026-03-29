import type { PageServerLoad } from './$types';

/**
 * Carga de datos para la sección de verificación institucional.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario!; // Garantizado por AuthGuard en hooks

	return {
		usuario: usuario.toPOJO()
	};
};
