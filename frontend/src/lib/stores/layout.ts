import { writable } from 'svelte/store';

interface LayoutState {
	hasStickyBottomBar: boolean;
}

function createLayoutStore() {
	const { subscribe, update, set } = writable<LayoutState>({
		hasStickyBottomBar: false
	});

	return {
		subscribe,
		showStickyBottomBar: () => update((s) => ({ ...s, hasStickyBottomBar: true })),
		hideStickyBottomBar: () => update((s) => ({ ...s, hasStickyBottomBar: false })),
		reset: () => set({ hasStickyBottomBar: false })
	};
}

export const layoutStore = createLayoutStore();
