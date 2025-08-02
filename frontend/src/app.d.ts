/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference path="$lib/types/svelte-jsx.d.ts" />


// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '$lib/types/User';

declare global {
	namespace App {
		interface Locals {
			user?: User;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
