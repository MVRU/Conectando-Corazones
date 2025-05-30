<!--
* Componente: FaqItem
    -*- Descripción: item desplegable para pregunta frecuente (acordeón).
    -*- Props:
        -*- question (string): pregunta.
        -*- answer (string): respuesta.
        -*- initiallyOpen (boolean): abierto por defecto.
-->

<script lang="ts">
	export let question = '';
	export let answer = '';
	export let initiallyOpen = false;

	let open = initiallyOpen;

	function toggle() {
		open = !open;
	}
</script>

<div class="flex flex-col rounded-xl bg-gray-50 px-6 py-4 shadow-sm transition-all">
	<button
		type="button"
		class="flex w-full items-center justify-between text-left font-semibold text-gray-900 focus:outline-none"
		on:click={toggle}
		aria-expanded={open}
	>
		<span>{question}</span>
		<span
			class="ml-2 flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-gray-200"
		>
			{#if open}
				<!-- ícono de cerrar (x) -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{:else}
				<!-- ícono de más (+) -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
			{/if}
		</span>
	</button>
	{#if open}
		<div class="animate-fade-in mt-3 text-base text-gray-700">
			{answer}
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.18s ease;
	}
</style>
