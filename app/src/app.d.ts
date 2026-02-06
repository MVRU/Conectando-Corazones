/// <reference types="svelte" />
/// <reference types="vite/client" />
import '$lib/domain/types/otros/svelte-jsx';

import type { Usuario } from '$lib/domain/types/Usuario';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			usuario?: Usuario;
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		// interface Error {}
		// interface PageData {}
		interface PageState {
			showReportModal?: boolean;
		}
		// interface Platform {}
	}
}

export {};
