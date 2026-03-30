<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { XMark } from '@steeze-ui/heroicons';
	import { scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let {
		abierto = $bindable(false),
		titulo = '',
		cerrarAlClickearFondo = true,
		ocultarEncabezado = false,
		anchoMaximo = 'max-w-lg',
		onCerrar = undefined,
		children,
		footer
	} = $props<{
		abierto?: boolean;
		titulo?: string;
		cerrarAlClickearFondo?: boolean;
		ocultarEncabezado?: boolean;
		anchoMaximo?: string;
		onCerrar?: () => void;
		children?: any;
		footer?: any;
	}>();

	let dialogo: HTMLDialogElement;

	$effect(() => {
		if (dialogo && abierto) {
			dialogo.showModal();
		} else if (dialogo && !abierto) {
			dialogo.close();
		}
	});

	function cerrar() {
		// Solo ejecutar una vez: idempotente
		if (!abierto) return;
		abierto = false;
		// Soportar ambas APIs: callback Svelte 5 y evento Svelte 4
		if (onCerrar) onCerrar();
		dispatch('cerrar');
	}

	function sincronizarEstado() {
		// Solo sincronizar estado sin ejecutar callbacks (se llama desde onclose)
		abierto = false;
	}

	function manejarClickFondo(e: MouseEvent) {
		if (cerrarAlClickearFondo && e.target === dialogo) {
			cerrar();
		}
	}
</script>

<dialog
	bind:this={dialogo}
	onclose={sincronizarEstado}
	onclick={manejarClickFondo}
	onkeydown={(e) => {
		if (e.key === 'Escape') cerrar();
	}}
	class="m-auto w-full {anchoMaximo} rounded-2xl bg-transparent p-0 text-left shadow-xl transition-all outline-none backdrop:bg-black/30 backdrop:backdrop-blur-sm"
>
	{#if abierto}
		<div
			class="relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Header -->
			{#if !ocultarEncabezado}
				<div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
					{#if titulo}
						<h3 class="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
							{titulo}
						</h3>
					{:else}
						<div><!-- Espaciador si no hay título --></div>
					{/if}
					<button
						type="button"
						class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
						onclick={cerrar}
						aria-label="Cerrar modal"
					>
						<Icon src={XMark} class="h-5 w-5" />
					</button>
				</div>
			{/if}

			<!-- Contenido -->
			<div class="px-4 py-5 sm:p-6">
				{@render children?.()}
			</div>

			<!-- Footer (Opcional) -->
			{#if footer}
				<div class="gap-2 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					{@render footer()}
				</div>
			{/if}
		</div>
	{/if}
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
		animation: fade-in 0.2s ease-out;
	}

	dialog[open] {
		animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes zoom-in {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
</style>
