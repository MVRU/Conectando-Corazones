<!--
* Componente: Breadcrumbs
	-*- Descripción: Navegación de migas de pan para mostrar la ubicación actual
	-*- Funcionalidad: Muestra la ruta de navegación con enlaces clickeables

* Props:
        -*- items (array): lista de objetos con {label, href} para cada nivel de navegación
        -*- separator (string): carácter separador entre elementos. Por defecto: '/'.
        -*- useIconSeparator (boolean): usar un ícono de flecha como separador.
        -*- maxLabelLength (number): cantidad máxima de caracteres visibles por etiqueta.
-->

<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';

	export let items: BreadcrumbItem[] | undefined = undefined;
	export let separator: string = '/';
	export let useIconSeparator: boolean = true;
	export let maxLabelLength: number = 60; // Permitir nombres más largos

	let showPopover = false;

	// Breadcrumbs automáticos si no se pasan items
	const autoBreadcrumbs = derived(page, ($page) => {
		const segments = $page.url.pathname.split('/').filter(Boolean);
		let path = '';
		return segments.map((segment, idx) => {
			path += '/' + segment;
			return {
				label: decodeURIComponent(
					segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
				),
				href: idx < segments.length - 1 ? path : undefined
			};
		});
	});

	$: breadcrumbs = items && items.length > 0 ? items : $autoBreadcrumbs;

	function handlePopover(open: boolean) {
		showPopover = open;
	}

	function closePopoverOnClickOutside(event: MouseEvent) {
		if (showPopover && !(event.target as HTMLElement).closest('.breadcrumb-popover')) {
			showPopover = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', closePopoverOnClickOutside);
		return () => window.removeEventListener('click', closePopoverOnClickOutside);
	});
</script>

{#if breadcrumbs && breadcrumbs.length > 0}
	<nav class="w-full bg-white px-3 py-4 sm:px-12" aria-label="Breadcrumb">
		<ol class="flex items-center gap-1 whitespace-nowrap text-[16px] font-medium">
			{#if breadcrumbs.length <= 4}
				{#each breadcrumbs as item, index (item.href || item.label)}
					<li class="flex min-w-0 items-center">
						{#if index > 0}
							{#if useIconSeparator}
								<svg class="mx-2 h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="none">
									<path
										d="M7 15l5-5-5-5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else}
								<span class="mx-2 text-blue-300">{separator}</span>
							{/if}
						{/if}
						{#if item.href && index < breadcrumbs.length - 1}
							<a
								href={item.href}
								class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-[0_2px_6px_0_rgba(0,0,0,0.04)]
									transition-all duration-150 hover:bg-blue-50 hover:text-blue-700
									focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
								title={item.label}
								tabIndex="0"
							>
								<span class="inline-block align-middle">
									{item.label}
								</span>
							</a>
						{:else}
							<span
								class="block cursor-default rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-bold
									text-blue-700 shadow-[0_2px_6px_0_rgba(0,0,0,0.04)]"
								aria-current="page"
								title={item.label}
							>
								<span class="inline-block align-middle">
									{item.label}
								</span>
							</span>
						{/if}
					</li>
				{/each}
			{:else}
				<!-- Muestra: Primero > [...] > Penúltimo > Último -->
				<!-- Primero -->
				<li class="flex min-w-0 items-center">
					<a
						href={breadcrumbs[0].href}
						class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-[0_2px_6px_0_rgba(0,0,0,0.04)]
							transition-all duration-150 hover:bg-blue-50 hover:text-blue-700
							focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
						title={breadcrumbs[0].label}
						tabIndex="0"
					>
						<span class="inline-block align-middle">
							{breadcrumbs[0].label}
						</span>
					</a>
				</li>

				<!-- Separador -->
				{#if useIconSeparator}
					<svg class="mx-2 h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-2 text-blue-300">{separator}</span>
				{/if}

				<!-- Ellipsis (popover para los del medio) -->
				<li class="relative flex min-w-0 items-center">
					<button
						type="button"
						class="breadcrumb-popover group flex items-center rounded-full bg-white px-4 py-2 text-gray-600 shadow-[0_2px_6px_0_rgba(0,0,0,0.04)] transition-all duration-150 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
						title="Ver rutas intermedias"
						on:click={() => handlePopover(!showPopover)}
					>
						<span class="text-lg font-bold">…</span>
					</button>
					{#if showPopover}
						<div
							class="breadcrumb-popover animate-fade-in absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
						>
							{#each breadcrumbs.slice(1, -2) as middleItem}
								<a
									href={middleItem.href}
									class="block rounded px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
									on:click={() => {
										showPopover = false;
									}}
								>
									{middleItem.label}
								</a>
							{/each}
						</div>
					{/if}
				</li>

				<!-- Separador -->
				{#if useIconSeparator}
					<svg class="mx-2 h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-2 text-blue-300">{separator}</span>
				{/if}

				<!-- Penúltimo -->
				<li class="flex min-w-0 items-center">
					<a
						href={breadcrumbs[breadcrumbs.length - 2].href}
						class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-[0_2px_6px_0_rgba(0,0,0,0.04)]
							transition-all duration-150 hover:bg-blue-50 hover:text-blue-700
							focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
						title={breadcrumbs[breadcrumbs.length - 2].label}
						tabIndex="0"
					>
						<span class="inline-block align-middle">
							{breadcrumbs[breadcrumbs.length - 2].label}
						</span>
					</a>
				</li>

				<!-- Separador -->
				{#if useIconSeparator}
					<svg class="mx-2 h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-2 text-blue-300">{separator}</span>
				{/if}

				<!-- Último -->
				<li class="flex min-w-0 items-center">
					<span
						class="block cursor-default rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-bold text-blue-700 shadow-[0_2px_6px_0_rgba(0,0,0,0.04)]"
						aria-current="page"
						title={breadcrumbs[breadcrumbs.length - 1].label}
					>
						<span class="inline-block align-middle">
							{breadcrumbs[breadcrumbs.length - 1].label}
						</span>
					</span>
				</li>
			{/if}
		</ol>
	</nav>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.2s ease;
	}
</style>
