import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.usuario) {
		throw redirect(303, '/mi-panel?error=already_logged_in');
	}
};
