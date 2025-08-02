<!--
* Componente: Breadcrumbs
        -*- Descripción: Navegación de migas de pan para mostrar la ubicación actual.
        -*- Funcionalidad: Muestra la ruta de navegación con enlaces clicables.
         ! Se muestra cuando hay migas configuradas (mínimo dos elementos).

* Props:
        -*- useIconSeparator (boolean): si true usa flecha, si false usa “/”.
-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';
	import { breadcrumbs as breadcrumbsStore } from '$lib/stores/breadcrumbs';

	/* -------- props -------- */
	export let useIconSeparator = true;

	/* -------- constantes de diseño -------- */
	const MOBILE_MAX_LABEL = 14;
	const MIN_ITEM_WIDTH = 110;
	const MIN_LAST_ITEM_WIDTH = 120;
	const SEPARATOR_WIDTH = 32;

	/* -------- estado -------- */
	let breadcrumbs: BreadcrumbItem[] = [];
	let showPopover = false;
	// * Cierra el popover cuando cambia la ruta
	let lastBreadcrumbs: BreadcrumbItem[] = [];
	let navRef: HTMLElement | null = null;
	let containerWidth = 0;
	let visibleCrumbsCount = 0;

	$: breadcrumbs = $breadcrumbsStore;
	$: if (breadcrumbs !== lastBreadcrumbs) {
		lastBreadcrumbs = breadcrumbs;
		showPopover = false;
	}

	/* -------- utils -------- */
	const truncate = (label: string, max: number) =>
		label && label.length > max ? label.slice(0, max - 1).trimEnd() + '…' : (label ?? '');

	/* -------- medir ancho para desktop -------- */
	function observeNavWidth() {
		if (!navRef) return;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
			}
		});
		ro.observe(navRef);
		onDestroy(() => ro.disconnect());
	}

	/* -------- cerrar popover al hacer clic fuera -------- */
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

	/* -------- cálculo de breadcrumbs visibles (desktop) -------- */
	$: {
		visibleCrumbsCount = 0;

		if (breadcrumbs && breadcrumbs.length) {
			let remaining = containerWidth;

			// Siempre muestra primero y último
			remaining -= MIN_ITEM_WIDTH; // primero
			remaining -= MIN_LAST_ITEM_WIDTH; // último
			remaining -= SEPARATOR_WIDTH * (breadcrumbs.length - 1);

			const possibleMiddle = Math.max(breadcrumbs.length - 2, 0);
			let maxMiddle = 0;

			while (remaining > 0 && maxMiddle < possibleMiddle) {
				remaining -= MIN_ITEM_WIDTH;
				if (remaining >= 0) maxMiddle++;
			}
			visibleCrumbsCount = 2 + maxMiddle; // primero + último + los del medio

			if (breadcrumbs.length <= 3) {
				visibleCrumbsCount = breadcrumbs.length;
			}

			if (visibleCrumbsCount > breadcrumbs.length) {
				visibleCrumbsCount = breadcrumbs.length;
			}
		}
	}
</script>

{#if breadcrumbs && breadcrumbs.length >= 2}
	<nav
		bind:this={navRef}
		class="animate-slide-down-fade sticky top-0 z-30 w-full border-b border-gray-100 bg-white/90 px-2 py-2 shadow-sm backdrop-blur sm:px-8 sm:py-4"
		aria-label="Breadcrumb"
	>
		<!--  *MOBILE  -->
		<ol class="flex items-center gap-1 whitespace-nowrap text-[15px] font-medium sm:hidden">
			<!-- primero -->
			<li class="flex min-w-0 max-w-[120px] items-center">
				<a
					href={breadcrumbs[0].href}
					class="group block max-w-[100px] truncate rounded-full bg-white px-3 py-2 text-gray-900 shadow-md ring-1 ring-inset ring-gray-100 transition-all hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
					title={breadcrumbs[0].label}
				>
					{truncate(breadcrumbs[0].label, MOBILE_MAX_LABEL)}
				</a>
			</li>

			{#if breadcrumbs.length > 2}
				<!-- separador -->
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

				<!-- ellipsis popover -->
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
									on:click={() => (showPopover = false)}
								>
									{truncate(middleItem.label, MOBILE_MAX_LABEL + 6)}
								</a>
							{/each}
						</div>
					{/if}
				</li>

				<!-- separador -->
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

			<!-- último -->
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

		<!--  *DESKTOP  -->
		<ol class="hidden items-center gap-2 whitespace-nowrap text-[16px] font-medium sm:flex">
			{#if breadcrumbs.length <= visibleCrumbsCount}
				<!-- ! todos entran -->
				{#each breadcrumbs as item, index (item.href ?? item.label)}
					<li class="flex min-w-0 items-center">
						{#if index}
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

						{#if item.href}
							<a
								href={item.href}
								class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
								title={item.label}
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
				<!-- primero -->
				<li class="flex min-w-0 items-center">
					<a
						href={breadcrumbs[0].href}
						class="group block rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
						title={breadcrumbs[0].label}
					>
						<span class="inline-block align-middle">{breadcrumbs[0].label}</span>
					</a>
				</li>

				<!-- separador -->
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

				<!-- ellipsis popover (solo si hay ocultos) -->
				{#if breadcrumbs.length > visibleCrumbsCount && breadcrumbs.slice(1, -(visibleCrumbsCount - 1)).length}
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
										on:click={() => (showPopover = false)}
									>
										{middleItem.label}
									</a>
								{/each}
							</div>
						{/if}
					</li>

					<!-- separador -->
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
				{/if}

				<!-- penúltimo -->
				<li class="flex min-w-0 items-center">
					<a
						href={breadcrumbs[breadcrumbs.length - 2].href}
						class="group block cursor-pointer rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
						title={breadcrumbs[breadcrumbs.length - 2].label}
					>
						<span class="inline-block align-middle"
							>{breadcrumbs[breadcrumbs.length - 2].label}</span
						>
					</a>
				</li>

				<!-- separador -->
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

				<!-- último -->
				<li class="flex min-w-0 items-center">
					<span
						class="block rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-bold text-blue-700 shadow-sm"
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

	@keyframes slide-down-fade {
		from {
			opacity: 0;
			transform: translateY(-12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slide-down-fade {
		animation: slide-down-fade 0.4s ease-out both;
	}
</style>
