declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		'on:swipeleft'?: (event: CustomEvent<void>) => void;
		'on:swiperight'?: (event: CustomEvent<void>) => void;
	}
}

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:swipeleft'?: (event: CustomEvent<void>) => void;
		'on:swiperight'?: (event: CustomEvent<void>) => void;
	}
}
