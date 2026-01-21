<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { XMark } from '@steeze-ui/heroicons';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';

	export let abierto = false;
	export let titulo = '';
	export let cerrarAlClickearFondo = true;
	export let ocultarEncabezado = false;
	export let anchoMaximo = 'max-w-lg';

	const dispatch = createEventDispatcher();
	let dialogo: HTMLDialogElement;

	$: if (dialogo && abierto) {
		dialogo.showModal();
	} else if (dialogo && !abierto) {
		dialogo.close();
	}

	function cerrar() {
		abierto = false;
		dispatch('cerrar');
	}

	function manejarClickFondo(e: MouseEvent) {
		if (cerrarAlClickearFondo && e.target === dialogo) {
			cerrar();
		}
	}
</script>

<dialog
	bind:this={dialogo}
	on:close={cerrar}
	on:click={manejarClickFondo}
	on:keydown={(e) => {
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
						on:click={cerrar}
						aria-label="Cerrar modal"
					>
						<Icon src={XMark} class="h-5 w-5" />
					</button>
				</div>
			{/if}

			<!-- Contenido -->
			<div class="px-4 py-5 sm:p-6">
				<slot />
			</div>

			<!-- Footer (Opcional) -->
			{#if $$slots.footer}
				<div class="gap-2 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<slot name="footer" />
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

