import type { LayoutServerLoad } from './$types';

/**
 * Layout para rutas protegidas.
 * La validación de acceso se realiza de forma centralizada en hooks.server.ts mediante AuthGuard.
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	// Puesto que hooks.server.ts ya verificó el acceso, locals.usuario está garantizado.
	const { usuario } = locals;

	return {
		usuario: usuario?.toPOJO() ?? null
	};
};
