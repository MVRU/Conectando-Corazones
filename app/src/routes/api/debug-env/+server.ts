import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET = async () => {
	const hasKey = !!env.SUPABASE_SERVICE_ROLE_KEY;
	const keyLength = env.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.length : 0;

	return json({
		has_supabase_service_role_key: hasKey,
		key_length: keyLength
	});
};
