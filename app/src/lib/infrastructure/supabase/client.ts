import { createBrowserClient } from '@supabase/ssr';
import { env } from '$lib/infrastructure/config/env';

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
	console.error('Supabase environment variables are missing.');
}

export const supabase = createBrowserClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '');
