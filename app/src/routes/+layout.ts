import { createBrowserClient, isBrowser, parse, serialize } from '@supabase/ssr';
import { env } from '$lib/infrastructure/config/env';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '', {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}
				const cookie = parse(document.cookie);
				return cookie[key];
			},
			set(key, value, options) {
				if (!isBrowser()) return;
				document.cookie = serialize(key, value, options);
			},
			remove(key, options) {
				if (!isBrowser()) return;
				document.cookie = serialize(key, '', { ...options, maxAge: 0 });
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { ...data, supabase, session };
};
