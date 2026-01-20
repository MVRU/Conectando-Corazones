import { createClient } from '@supabase/supabase-js';
import { env } from '$lib/infrastructure/config/env';

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
	console.error('Supabase environment variables are missing.');
}

export const supabase = createClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '');