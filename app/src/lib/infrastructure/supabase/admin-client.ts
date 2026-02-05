import { createClient } from '@supabase/supabase-js';
import { env } from '$lib/infrastructure/config/env';
import { env as secrets } from '$env/dynamic/private';

// CRÍTICO: este cliente usa la SERVICE_ROLE_KEY.
// Debe usarse SOLO en endpoints del lado del servidor (+server.ts, +page.server.ts).
// NUNCA importar esto en código del lado del cliente (.svelte files).

if (!env.SUPABASE_URL || !secrets.SUPABASE_SERVICE_ROLE_KEY) {
	console.error('SERVER ERROR: Missing SUPABASE_SERVICE_ROLE_KEY for admin operations.');
}

export const supabaseAdmin = createClient(
	env.SUPABASE_URL || '',
	secrets.SUPABASE_SERVICE_ROLE_KEY || '',
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
