import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	depends('supabase:auth');
	return {
		session: locals.session,
		usuario: locals.usuario ? locals.usuario.toPOJO() : null
	};
};
