<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	export let value: Writable<string> = writable('');
	export let placeholder = 'Buscar...';
	export let ariaLabel = 'Campo de búsqueda';
	export let showReset = true;
	export let autofocus = false;
	export let customClass: string = '';

	let inputRef: HTMLInputElement | null = null;

	onMount(() => {
		if (autofocus && inputRef) {
			inputRef.focus();
		}
	});

	function clearSearch() {
		value.set('');
		inputRef?.focus();
	}
</script>

<div class={`group relative w-full ${customClass}`}>
	<input
		type="text"
		class="focus:ring-opacity-50 w-full rounded-xl border border-gray-200 bg-white px-14 py-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
		{placeholder}
		aria-label={ariaLabel}
		bind:this={inputRef}
		bind:value={$value}
		on:keydown={(e) => {
			if (e.key === 'Escape') clearSearch();
		}}
	/>

	<!-- Ícono lupa -->
	<svg
		class="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gray-400 transition duration-300 group-hover:text-blue-500"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
		/>
	</svg>

	{#if showReset && $value.trim() !== ''}
		<!-- Botón para limpiar -->
		<button
			type="button"
			aria-label="Limpiar búsqueda"
			class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
			on:click={clearSearch}
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}
</div>
