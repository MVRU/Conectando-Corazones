import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (locals.supabase) {
		await locals.supabase.auth.signOut();
	}

	cookies.delete('remember_me', { path: '/' });


	return json({ success: true });
};
