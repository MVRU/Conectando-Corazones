<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { toastStore, type ToastMessage } from '$lib/stores/toast';

	let toasts: ToastMessage[] = [];
	const VARIANT_STYLES: Record<
		ToastMessage['variant'],
		{
			border: string;
			iconWrapper: string;
			iconPath: string;
			label: string;
		}
	> = {
		info: {
			border: 'border-blue-200/70 bg-white text-slate-700',
			iconWrapper:
				'from-blue-500/15 via-blue-500/5 to-blue-500/0 text-blue-600 ring-1 ring-blue-200/40',
			iconPath:
				'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			label: 'Información'
		},
		success: {
			border: 'border-emerald-200/80 bg-white text-slate-700',
			iconWrapper:
				'from-emerald-500/20 via-emerald-500/10 to-emerald-500/0 text-emerald-600 ring-1 ring-emerald-200/50',
			iconPath:
				'M5 13l4 4L19 7',
			label: 'Listo'
		},
		warning: {
			border: 'border-amber-200/80 bg-white text-slate-700',
			iconWrapper:
				'from-amber-400/25 via-amber-400/10 to-amber-400/0 text-amber-600 ring-1 ring-amber-200/60',
			iconPath:
				'M12 8v4m0 4h.01M12 3l9 16H3l9-16z',
			label: 'Atención'
		},
		error: {
			border: 'border-rose-200/80 bg-white text-slate-700',
			iconWrapper:
				'from-rose-500/20 via-rose-500/10 to-rose-500/0 text-rose-600 ring-1 ring-rose-200/50',
			iconPath:
				'M15 9l-6 6m0-6l6 6M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			label: 'Error'
		}
	};

	const unsubscribe = toastStore.subscribe((items) => {
		toasts = items;
	});

	$: if (toasts.length === 0) {
		unsubscribe;
	}

	function closeToast(id: string) {
		toastStore.dismiss(id);
	}
</script>

<div class="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-end justify-end gap-3 p-4 sm:p-6">
	{#each toasts as toast (toast.id)}
		<div
			role="status"
			aria-live="polite"
			class={`pointer-events-auto w-full max-w-sm rounded-2xl border p-4 shadow-xl ring-1 ring-black/5 ${VARIANT_STYLES[toast.variant].border}`}
			in:fly={{ x: 24, duration: 200 }}
			out:fade={{ duration: 150 }}
		>
			<div class="flex items-start gap-3">
				<span
					class={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${VARIANT_STYLES[toast.variant].iconWrapper}`}
					aria-hidden="true"
				>
					<span class="absolute inset-0 animate-pulse bg-gradient-to-br from-white/50 to-transparent opacity-50"></span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="relative h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							d={VARIANT_STYLES[toast.variant].iconPath}
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.8"
						/>
					</svg>
				</span>
				<div class="flex-1 space-y-1">
					{#if toast.title || VARIANT_STYLES[toast.variant].label}
						<p class="text-sm font-semibold text-slate-900">
							{toast.title || VARIANT_STYLES[toast.variant].label}
						</p>
					{/if}
					<p class="text-sm leading-relaxed text-slate-600">{toast.message}</p>
				</div>
				<button
					type="button"
					class="rounded-full p-1 text-slate-400 transition hover:text-slate-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-300"
					on:click={() => closeToast(toast.id)}
					aria-label="Cerrar notificación"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24">
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.8"
							d="M6 6l12 12M6 18L18 6"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/each}
</div>
