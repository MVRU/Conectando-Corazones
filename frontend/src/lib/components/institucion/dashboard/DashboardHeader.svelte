<!--
*- DECISIÓN DE DISEÑO: Encapsular el encabezado nos permite reutilizarlo si agregamos variantes de dashboard.
-->
<script lang="ts">
	import { callToActionIcon, notificationIcon } from './data';
	import type { ViewMode } from './types';
	import {
		BG_CARD,
		BORDER_SUBTLE,
		ERROR_COLOR,
		GRADIENT_CTA,
		PRIMARY_300,
		PRIMARY_500,
		RING_AZURE_10,
		RING_AZURE_25,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from './tokens';

	export let viewMode: ViewMode = 'dashboard';
	export let contextSubtitle = 'Escuela Esperanza · Octubre 2025 · Rosario, Santa Fe, Argentina';
</script>

<header class="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end md:mb-10">
	<div class="mb-0">
		<div class="mb-3 flex items-center gap-2">
			<span class="h-2 w-2 rounded-full" style="background: #dbe6e7;"></span>
			<p class="text-xs font-medium uppercase tracking-widest" style="color: {TEXT_400};">
				Cada acción cuenta
			</p>
		</div>

		<h1
			class="text-5xl font-extrabold leading-[1.05] tracking-tighter sm:text-6xl lg:text-[64px]"
			style="color: {TEXT_100};"
		>
			<span
				style="background-image: linear-gradient(180deg, {PRIMARY_300}, {PRIMARY_500}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
			>
				Mi panel
			</span>
		</h1>

		<p class="mt-3 max-w-[70ch] text-lg font-medium leading-relaxed" style="color: {TEXT_300};">
			{contextSubtitle}
		</p>
	</div>

	{#if viewMode === 'dashboard'}
		<div class="flex flex-wrap items-center gap-4">
			<button
				class="flex items-center gap-2 rounded-full px-7 py-2.5 text-base font-bold text-white transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-4 active:scale-[0.98]"
				style="background: {GRADIENT_CTA}; box-shadow: 0 6px 18px rgba(0,160,255,0.25), inset 0 1px 3px rgba(255, 255, 255, 0.1); --tw-ring-color: {RING_AZURE_10};"
				type="button"
				aria-label="Crear proyecto"
			>
				<svelte:component this={callToActionIcon} class="h-5 w-5" />
				Crear Proyecto
			</button>

			<button
				class="relative flex h-12 w-12 items-center justify-center rounded-[18px] transition-all duration-200 hover:scale-[1.05] focus:outline-none focus:ring-2 active:scale-[0.98]"
				style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18); color: {PRIMARY_500}; --tw-ring-color: {RING_AZURE_25};"
				type="button"
				aria-label="Ver notificaciones"
			>
				<svelte:component this={notificationIcon} class="h-6 w-6" />
				<span
					class="absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ring-2"
					style="background: {ERROR_COLOR}; --tw-ring-color: {BG_CARD}; color: white; line-height: 1;"
				>
					3
				</span>
			</button>
		</div>
	{/if}
</header>
