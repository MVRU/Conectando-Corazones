<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte'; // Import necesario
	import { faqs as allFaqs } from '$lib/data/faqs';
	import SearchBar from '$lib/components/ui/elements/SearchBar.svelte';

	type Agrupadas = Record<string, { question: string; answer: string }[]>;

	// Agrupar FAQs por categoría
	const faqsPorCategoria = allFaqs
		.filter((faq) => faq.category && faq.category !== 'General')
		.reduce((acc, faq) => {
			const categoria = faq.category!;
			if (!acc[categoria]) acc[categoria] = [];
			acc[categoria].push({ question: faq.question, answer: faq.answer });
			return acc;
		}, {} as Agrupadas);

	const categorias = Object.entries(faqsPorCategoria).map(([category, questions]) => ({
		category,
		questions
	}));

	let searchQuery = writable('');
	const filteredFaqs = derived(searchQuery, ($searchQuery) => {
		if (!$searchQuery.trim()) return categorias;

		const lowerQuery = $searchQuery.toLowerCase();
		return categorias
			.map((c) => {
				const filtered = c.questions.filter(
					(q) =>
						q.question.toLowerCase().includes(lowerQuery) ||
						q.answer.toLowerCase().includes(lowerQuery)
				);
				return { category: c.category, questions: filtered };
			})
			.filter((c) => c.questions.length > 0);
	});

	let searchInput: HTMLInputElement | undefined;

	function highlight(text: string, query: string): string {
		if (!query.trim()) return text;
		const regex = new RegExp(`(${query})`, 'gi');
		return text.replace(regex, '<mark class="bg-blue-200 px-1 rounded">$1</mark>');
	}

	onMount(() => {
		const hash = decodeURIComponent(location.hash.substring(1));
		if (hash) {
			const faq = allFaqs.find((f) => f.question.toLowerCase() === hash.toLowerCase());
			if (faq) {
				searchQuery.set(faq.question);
				setTimeout(() => {
					const element = document.getElementById(`faq-${encodeURIComponent(faq.question)}`);
					element?.scrollIntoView({ behavior: 'smooth' });
				}, 500);
			}
		}
	});
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:px-12 lg:px-28">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-16 text-center">
		<h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
			Preguntas Frecuentes
		</h2>
		<p class="mx-auto mt-2 max-w-2xl text-lg text-gray-500">
			<strong>Todo lo que necesitás saber:</strong> simple, ordenado y sin vueltas.
		</p>
	</div>

	<!-- Barra de búsqueda -->
	<div class="animate-fade-in-up mx-auto mb-16 w-full max-w-xl">
		<SearchBar
			bind:value={searchQuery}
			placeholder="Buscar entre las preguntas..."
			ariaLabel="Campo de búsqueda de preguntas frecuentes"
			autofocus={true}
		/>
	</div>

	<!-- Sin resultados -->
	{#if $filteredFaqs.length === 0}
		<div
			class="animate-fade-in-up rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm"
		>
			<svg
				class="mx-auto mb-4 h-12 w-12 text-blue-500 opacity-80"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 10h.01M15 10h.01M9.172 16.172a4 4 0 015.656 0"
				/>
			</svg>
			<h3 class="mb-2 text-lg font-semibold text-gray-800">No se encontraron resultados</h3>
			<p class="text-gray-600">
				{#if $searchQuery.trim() !== ''}
					Sin coincidencias para <strong>"{$searchQuery}"</strong>.
				{:else}
					Probá con otra palabra clave.
				{/if}
			</p>
			{#if $searchQuery.trim() !== ''}
				<button
					type="button"
					class="mt-6 inline-flex cursor-pointer items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
					on:click={() => {
						searchQuery.set('');
						if (searchInput) searchInput.focus();
					}}
				>
					Limpiar búsqueda
				</button>
			{/if}
		</div>
	{/if}

	<!-- Categorías y preguntas -->
	<div class="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
		{#each $filteredFaqs as category, i (category.category)}
			<div class="fade-slide-in" style="animation-delay: {i * 120}ms">
				<div
					class="rounded-xl border border-gray-100 bg-white px-6 pb-6 pt-5 shadow-sm transition-all hover:shadow-md"
				>
					<h3
						class="mb-5 flex items-center justify-between border-b border-gray-100 pb-2 text-xl font-medium text-stone-700"
					>
						<span>{@html highlight(category.category, $searchQuery)}</span>
					</h3>
					<div class="space-y-3">
						{#each category.questions as item, j (item.question)}
							<details
								id={`faq-${encodeURIComponent(item.question)}`}
								class="group rounded-lg border border-gray-100 bg-gray-50 px-5 py-4 transition-all duration-300 hover:bg-gray-100"
								style="animation-delay: {(j + 1) * 90}ms"
							>
								<summary
									class="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-800"
								>
									<span>{@html highlight(item.question, $searchQuery)}</span>
									<svg
										class="ml-3 h-4 w-4 text-blue-500 transition-transform duration-300 group-open:rotate-180"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
									</svg>
								</summary>
								<p class="mt-3 text-sm leading-relaxed text-gray-600">
									{@html highlight(item.answer, $searchQuery)}
								</p>
							</details>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	details summary {
		list-style: none;
		cursor: pointer;
	}

	details summary::-webkit-details-marker {
		display: none;
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}

	@keyframes fade-slide-in {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.fade-slide-in {
		animation: fade-slide-in 0.5s ease-out forwards;
	}
</style>
