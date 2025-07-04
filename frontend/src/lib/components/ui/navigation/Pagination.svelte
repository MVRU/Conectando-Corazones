<script lang="ts">
	export let totalPages: number;
	export let currentPage: number;
	export let onPageChange: (page: number) => void;

	const range = 2; // Cantidad de páginas a mostrar alrededor de la actual

	// Genera los números de página que se mostrarán
	function getPagesToShow(): number[] {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const start = Math.max(2, currentPage - range);
		const end = Math.min(totalPages - 1, currentPage + range);

		const pages = [1];

		if (start > 2) {
			pages.push(-1); // Representa el "..." cuando hay muchas páginas
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (end < totalPages - 1) {
			pages.push(-1);
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	}

	const isActive = (page: number) => currentPage === page;
	const isDisabled = (direction: 'prev' | 'next') =>
		direction === 'prev' ? currentPage === 1 : currentPage === totalPages;
</script>

{#if totalPages > 1}
	<nav
		class="mt-8 flex flex-wrap items-center justify-center gap-1 text-sm font-medium"
		aria-label="Paginación"
	>
		<!-- Botón Anterior -->
		<button
			on:click={() => onPageChange(currentPage - 1)}
			class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-700 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isDisabled('prev')}
			aria-label="Página anterior"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Números de página -->
		{#each getPagesToShow() as page}
			{#if page === -1}
				<span class="mx-1 select-none text-gray-500">…</span>
			{:else}
				<button
					on:click={() => onPageChange(page)}
					class={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border px-2 py-1 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						isActive(page)
							? 'border-transparent bg-[rgb(var(--color-primary))] text-white shadow-sm'
							: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
					}`}
					aria-current={isActive(page) ? 'page' : undefined}
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Botón Siguiente -->
		<button
			on:click={() => onPageChange(currentPage + 1)}
			class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-700 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isDisabled('next')}
			aria-label="Página siguiente"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</nav>
{/if}
