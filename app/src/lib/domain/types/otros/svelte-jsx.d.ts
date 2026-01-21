declare module 'svelte/elements' {
	export interface HTMLAttributes<T> {
		'on:swipe-left'?: (event: CustomEvent<void>) => void;
		'on:swipe-right'?: (event: CustomEvent<void>) => void;
	}
}
