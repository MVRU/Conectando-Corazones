import { writable } from 'svelte/store';

interface LayoutState {
	hasStickyBottomBar: boolean;
	headerVisible: boolean;
}

function createLayoutStore() {
	const { subscribe, update, set } = writable<LayoutState>({
		hasStickyBottomBar: false,
		headerVisible: true
	});

	return {
		subscribe,
		showStickyBottomBar: () => update((s) => ({ ...s, hasStickyBottomBar: true })),
		hideStickyBottomBar: () => update((s) => ({ ...s, hasStickyBottomBar: false })),
		setHeaderVisible: (visible: boolean) => update((s) => ({ ...s, headerVisible: visible })),
		reset: () => set({ hasStickyBottomBar: false, headerVisible: true })
	};
}

export const layoutStore = createLayoutStore();
