<!--
* Componente: Breadcrumbs
        -*- Descripción: Navegación de migas de pan para mostrar la ubicación actual
        -*- Funcionalidad: Muestra la ruta de navegación con enlaces clickeables
        ! Solo se renderiza cuando hay más de dos niveles para evitar ruido visual

* Props:
        -*- items (array): lista de objetos con {label, href} para cada nivel de navegación
        -*- separator (string): carácter separador entre elementos. Por defecto: '/'.
        -*- useIconSeparator (boolean): usar un ícono de flecha como separador.
        -*- maxLabelLength (number): cantidad máxima de caracteres visibles por etiqueta.
-->

<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';

	export let items: BreadcrumbItem[] | undefined = undefined;
	export let useIconSeparator: boolean = true;
	const MOBILE_MAX_LABEL = 14;

	let showPopover = false;
	let navRef: HTMLElement | null = null;
	let containerWidth = 0;
	const MIN_ITEM_WIDTH = 110;
	const MIN_LAST_ITEM_WIDTH = 120;
	const SEPARATOR_WIDTH = 32;

	let visibleCrumbsCount = 0;

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

	// Detectar el tamaño del nav (desktop)
	function observeNavWidth() {
		if (!navRef) return;
		const ro = new ResizeObserver((entries) => {
			for (let entry of entries) {
				containerWidth = entry.contentRect.width;
			}
		});
		ro.observe(navRef);
		onDestroy(() => ro.disconnect());
	}

	function closePopoverOnClickOutside(event: MouseEvent) {
		if (
			showPopover &&
			!(event.target as HTMLElement).closest('.breadcrumb-popover, .breadcrumb-popover-bg')
		) {
			showPopover = false;
		}
	}
	onMount(() => {
		observeNavWidth();
		window.addEventListener('click', closePopoverOnClickOutside);
		return () => window.removeEventListener('click', closePopoverOnClickOutside);
	});

	const truncate = (label: string, max: number) =>
		label.length > max ? label.slice(0, max - 1).trimEnd() + '…' : label;

	// Cálculo para desktop: muestra todos breadcrumbs posibles
	$: {
		visibleCrumbsCount = 0;
		if (breadcrumbs && breadcrumbs.length > 0) {
			let remaining = containerWidth;
			// Siempre muestra primero y último, intenta agregar del medio de a uno
			// primero
			remaining -= MIN_ITEM_WIDTH;
			// último
			remaining -= MIN_LAST_ITEM_WIDTH;
			// Separadores
			remaining -= SEPARATOR_WIDTH * (breadcrumbs.length - 1);

			// Cada breadcrumb extra suma MIN_ITEM_WIDTH
			let possibleMiddle = Math.max(breadcrumbs.length - 2, 0);
			let maxMiddle = 0;
			while (remaining > 0 && maxMiddle < possibleMiddle) {
				remaining -= MIN_ITEM_WIDTH;
				if (remaining >= 0) maxMiddle++;
			}
			visibleCrumbsCount = 2 + maxMiddle; // primero, último y los del medio que entren
			if (visibleCrumbsCount > breadcrumbs.length) visibleCrumbsCount = breadcrumbs.length;
		}
	}
</script>

{#if breadcrumbs && breadcrumbs.length > 2}
	<nav
		bind:this={navRef}
		class="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/90 px-2 py-2 shadow-sm backdrop-blur sm:px-8 sm:py-4"
		aria-label="Breadcrumb"
	>
		<!-- *MOBILE: solo primero, ellipsis, último -->
		<ol class="flex items-center gap-1 whitespace-nowrap text-[15px] font-medium sm:hidden">
			<!-- -*- Primero -->
			<li class="flex min-w-0 max-w-[120px] items-center">
				<a
					href={breadcrumbs[0].href}
					class="group block max-w-[100px] truncate rounded-full bg-white px-3 py-2 text-gray-900 shadow-md ring-1 ring-inset ring-gray-100 transition-all hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
					title={breadcrumbs[0].label}
					tabIndex="0"
				>
					{truncate(breadcrumbs[0].label, MOBILE_MAX_LABEL)}
				</a>
			</li>
			{#if breadcrumbs.length > 2}
				<!-- -*- Separador -->
				{#if useIconSeparator}
					<svg class="mx-1 h-4 w-4 flex-shrink-0 text-blue-200" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-1 text-blue-200">/</span>
				{/if}
				<!-- -*- Ellipsis Popover -->
				<li class="relative flex min-w-0 items-center">
					<button
						type="button"
						class="breadcrumb-popover group flex cursor-pointer items-center rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-700 shadow-md transition-all hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
						title="Ver rutas intermedias"
						aria-haspopup="dialog"
						aria-expanded={showPopover}
						on:click|stopPropagation={() => (showPopover = !showPopover)}
					>
						<span class="text-lg font-bold">…</span>
					</button>
					{#if showPopover}
						<div
							class="breadcrumb-popover animate-fade-in absolute left-1/2 top-[120%] z-50 mt-2 w-64 max-w-[95vw] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg backdrop-blur"
						>
							{#each breadcrumbs.slice(1, -1) as middleItem}
								<a
									href={middleItem.href}
									class="block truncate rounded-lg px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
									title={middleItem.label}
									tabIndex="0"
									on:click={() => {
										showPopover = false;
									}}
								>
									{truncate(middleItem.label, MOBILE_MAX_LABEL + 6)}
								</a>
							{/each}
						</div>
					{/if}
				</li>
				<!-- -*- Separador -->
				{#if useIconSeparator}
					<svg class="mx-1 h-4 w-4 flex-shrink-0 text-blue-200" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-1 text-blue-200">/</span>
				{/if}
			{/if}
			<!-- -*- Último -->
			<li class="flex min-w-0 max-w-[120px] items-center">
				<span
					class="block max-w-[100px] cursor-pointer truncate rounded-full border border-blue-100 bg-blue-50 px-3 py-2 font-bold text-blue-700 shadow-md"
					aria-current="page"
					title={breadcrumbs[breadcrumbs.length - 1].label}
				>
					{truncate(breadcrumbs[breadcrumbs.length - 1].label, MOBILE_MAX_LABEL)}
				</span>
			</li>
		</ol>

		<!-- *DESKTOP: solo muestra tantos breadcrumbs como entren -->
		<ol class="hidden items-center gap-2 whitespace-nowrap text-[16px] font-medium sm:flex">
			{#if breadcrumbs.length <= visibleCrumbsCount}
				{#each breadcrumbs as item, index (item.href || item.label)}
					<li class="flex min-w-0 items-center">
						{#if index > 0}
							{#if useIconSeparator}
								<svg
									class="mx-1 h-4 w-4 flex-shrink-0 text-blue-300"
									viewBox="0 0 20 20"
									fill="none"
								>
									<path
										d="M7 15l5-5-5-5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{:else}
								<span class="mx-1 text-blue-300">/</span>
							{/if}
						{/if}
						{#if item.href && index < breadcrumbs.length - 1}
							<a
								href={item.href}
								class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm transition-all duration-150 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
								title={item.label}
								tabIndex="0"
							>
								<span class="inline-block align-middle">{item.label}</span>
							</a>
						{:else}
							<span
								class="block cursor-default rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-bold text-blue-700 shadow-sm"
								aria-current="page"
								title={item.label}
							>
								<span class="inline-block align-middle">{item.label}</span>
							</span>
						{/if}
					</li>
				{/each}
			{:else}
				<!-- -*- Primero -->
				<li class="flex min-w-0 items-center">
					<a
						href={breadcrumbs[0].href}
						class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm transition-all duration-150 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
						title={breadcrumbs[0].label}
						tabIndex="0"
					>
						<span class="inline-block align-middle">{breadcrumbs[0].label}</span>
					</a>
				</li>
				<!-- -*- Separador -->
				{#if useIconSeparator}
					<svg class="mx-1 h-4 w-4 flex-shrink-0 text-blue-300" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-1 text-blue-300">/</span>
				{/if}
				<!-- -*- Ellipsis Popover -->
				<li class="relative flex min-w-0 items-center">
					<button
						type="button"
						class="breadcrumb-popover group flex cursor-pointer items-center rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-700 shadow-md transition-all hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
						title="Ver rutas intermedias"
						aria-haspopup="dialog"
						aria-expanded={showPopover}
						on:click|stopPropagation={() => (showPopover = !showPopover)}
					>
						<span class="text-lg font-bold">…</span>
					</button>
					{#if showPopover}
						<div
							class="breadcrumb-popover animate-fade-in absolute left-1/2 top-full z-50 mt-2 w-56 max-w-[90vw] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg backdrop-blur"
						>
							{#each breadcrumbs.slice(1, -(visibleCrumbsCount - 1)) as middleItem}
								<a
									href={middleItem.href}
									class="block truncate rounded-lg px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
									title={middleItem.label}
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
				<!-- -*- Separador -->
				{#if useIconSeparator}
					<svg class="mx-1 h-4 w-4 flex-shrink-0 text-blue-300" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-1 text-blue-300">/</span>
				{/if}
				<!-- Penúltimo -->
				<li class="flex min-w-0 items-center">
					<a
						href={breadcrumbs[breadcrumbs.length - 2].href}
						class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm transition-all duration-150 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
						title={breadcrumbs[breadcrumbs.length - 2].label}
						tabIndex="0"
					>
						<span class="inline-block align-middle"
							>{breadcrumbs[breadcrumbs.length - 2].label}</span
						>
					</a>
				</li>
				<!-- -*- Separador -->
				{#if useIconSeparator}
					<svg class="mx-1 h-4 w-4 flex-shrink-0 text-blue-300" viewBox="0 0 20 20" fill="none">
						<path
							d="M7 15l5-5-5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="mx-1 text-blue-300">/</span>
				{/if}
				<!-- -*- Último -->
				<li class="flex min-w-0 items-center">
					<span
						class="block cursor-pointer rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-bold text-blue-700 shadow-sm"
						aria-current="page"
						title={breadcrumbs[breadcrumbs.length - 1].label}
					>
						<span class="inline-block align-middle"
							>{breadcrumbs[breadcrumbs.length - 1].label}</span
						>
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
