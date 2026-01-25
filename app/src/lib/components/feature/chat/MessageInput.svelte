<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let disabled: boolean = false;
	export let placeholder: string = 'Escribe un mensaje...';

	let mensaje = '';
	const dispatch = createEventDispatcher();

	function enviar() {
		if (!mensaje.trim() || disabled) return;
		dispatch('send', { contenido: mensaje });
		mensaje = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			enviar();
		}
	}
</script>

<div class="border-t border-gray-200 bg-white p-4">
	<div class="flex gap-2">
		<textarea
			bind:value={mensaje}
			on:keydown={handleKeydown}
			{disabled}
			{placeholder}
			rows="1"
			class="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
		></textarea>
		<button
			on:click={enviar}
			disabled={!mensaje.trim() || disabled}
			class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
		>
			Enviar
		</button>
	</div>
	{#if disabled}
		<p class="mt-2 text-center text-xs text-red-500">
			El chat está deshabilitado para este proyecto.
		</p>
	{/if}
</div>
