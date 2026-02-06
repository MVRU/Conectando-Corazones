declare module 'svelte/elements' {
	export interface HTMLAttributes<T> {
		'on:swipe-left'?: (event: CustomEvent<void>) => void;
		'on:swipe-right'?: (event: CustomEvent<void>) => void;
		'on:reveal'?: (event: CustomEvent<void>) => void;
		'on:hide'?: (event: CustomEvent<void>) => void;
	}
}

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:reveal'?: (event: CustomEvent<void>) => void;
		'on:hide'?: (event: CustomEvent<void>) => void;
	}
}
