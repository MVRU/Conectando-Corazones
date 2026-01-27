import { writable } from 'svelte/store';

interface ChatState {
	sidebarCollapsed: boolean;
	currentChatId: number | null;
	draftMessages: Map<number, string>;
	showArchived: boolean;
}

function createChatStore() {
	const { subscribe, set, update } = writable<ChatState>({
		sidebarCollapsed: false,
		currentChatId: null,
		draftMessages: new Map(),
		showArchived: false
	});

	return {
		subscribe,
		toggleSidebar: () =>
			update((state) => ({
				...state,
				sidebarCollapsed: !state.sidebarCollapsed
			})),
		setCurrentChat: (chatId: number | null) =>
			update((state) => ({
				...state,
				currentChatId: chatId
			})),
		saveDraft: (chatId: number, content: string) =>
			update((state) => {
				const newDrafts = new Map(state.draftMessages);
				if (content.trim()) {
					newDrafts.set(chatId, content);
				} else {
					newDrafts.delete(chatId);
				}
				return {
					...state,
					draftMessages: newDrafts
				};
			}),
		getDraft: (chatId: number): string => {
			let draft = '';
			subscribe((state) => {
				draft = state.draftMessages.get(chatId) || '';
			})();
			return draft;
		},
		clearDraft: (chatId: number) =>
			update((state) => {
				const newDrafts = new Map(state.draftMessages);
				newDrafts.delete(chatId);
				return {
					...state,
					draftMessages: newDrafts
				};
			}),
		toggleArchived: () =>
			update((state) => ({
				...state,
				showArchived: !state.showArchived
			}))
	};
}

export const chatStore = createChatStore();
