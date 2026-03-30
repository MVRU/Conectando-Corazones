declare module 'svelte/elements' {
	export interface HTMLAttributes<T> {
		onreveal?: (event: CustomEvent<void>) => void;
		onhide?: (event: CustomEvent<void>) => void;
	}
}

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		onreveal?: (event: CustomEvent<void>) => void;
		onhide?: (event: CustomEvent<void>) => void;
	}
}
