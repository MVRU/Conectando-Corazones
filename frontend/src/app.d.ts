/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference path="$lib/types/svelte-jsx.d.ts" />


// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Usuario } from '$lib/types/Usuario';

declare global {
	namespace App {
		interface Locals {
			user?: Usuario;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
