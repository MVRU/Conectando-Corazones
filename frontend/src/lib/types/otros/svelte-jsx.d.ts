import type { SwipeEvents } from '$lib/actions/swipe';

declare namespace svelte.JSX {
    interface HTMLAttributes<T> extends SwipeEvents { }
}
