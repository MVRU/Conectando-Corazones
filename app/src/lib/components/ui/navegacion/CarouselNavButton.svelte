<script lang="ts">
	export let direction: 'prev' | 'next' = 'next';
</script>

<button
	class="absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-xl text-white shadow-md transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none md:flex"
	class:left-0={direction === 'prev'}
	class:right-0={direction === 'next'}
	aria-label={direction === 'prev' ? 'Anterior' : 'Siguiente'}
>
	{#if direction === 'prev'}&#10094;{:else}&#10095;{/if}
</button>

