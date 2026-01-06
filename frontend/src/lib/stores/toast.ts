import { writable } from 'svelte/store';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
	id?: string;
	title?: string;
	message: string;
	variant?: ToastVariant;
	duration?: number;
}

export interface ToastMessage extends Required<Omit<ToastOptions, 'id'>> {
	id: string;
}

const DEFAULT_DURATION = 6000;

const createToastStore = () => {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function generateId(): string {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return crypto.randomUUID();
		}
		return Math.random().toString(36).slice(2);
	}

	function show(options: ToastOptions): ToastMessage {
		const toast: ToastMessage = {
			id: options.id ?? generateId(),
			title: options.title ?? '',
			message: options.message,
			variant: options.variant ?? 'info',
			duration: options.duration ?? DEFAULT_DURATION
		};
		update((current) => [...current, toast]);
		if (toast.duration > 0) {
			setTimeout(() => dismiss(toast.id), toast.duration);
		}
		return toast;
	}

	function dismiss(id: string) {
		update((current) => current.filter((toast) => toast.id !== id));
	}

	function clear() {
		update(() => []);
	}

	return { subscribe, show, dismiss, clear };
};

export const toastStore = createToastStore();
