<script lang="ts">
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let currentPage: number;
	export let totalPages: number;

	const dispatch = createEventDispatcher();

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			dispatch('pageChange', newPage);
		}
	}
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center gap-2 py-4">
		<button
			class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={() => handlePageChange(currentPage - 1)}
			disabled={currentPage === 1}
		>
			<span class="sr-only">Anterior</span>
			<ArrowLeft size={16} />
		</button>

		<span class="text-sm text-gray-700">
			Página <span class="font-medium">{currentPage}</span> de
			<span class="font-medium">{totalPages}</span>
		</span>

		<button
			class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={() => handlePageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
		>
			<span class="sr-only">Siguiente</span>
			<ArrowRight size={16} />
		</button>
	</div>
{/if}

