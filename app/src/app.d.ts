/// <reference types="svelte" />
/// <reference types="vite/client" />
import '$lib/domain/types/otros/svelte-jsx';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Usuario } from '$lib/domain/types/Usuario';

declare global {
	namespace App {
		interface Locals {
			usuario?: Usuario;
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
