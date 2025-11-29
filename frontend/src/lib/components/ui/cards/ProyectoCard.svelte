<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Proyecto } from '$lib/types/Proyecto';
	import { ArrowRight, BuildingOffice2, MapPin, GlobeAlt, Photo } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	import { getParticipacionVisual, getUbicacionCorta } from '$lib/utils/util-proyectos';
	import StatusBadge from '$lib/components/ui/badges/StatusBadge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
	import LocationDisplay from '$lib/components/ui/badges/LocationDisplay.svelte';

	export let proyecto: Proyecto;
	export let mostrarBotones: boolean = false;

	$: participaciones = (proyecto.participacion_permitida || []).map(getParticipacionVisual);
	$: botonColaborarDeshabilitado = proyecto.estado !== 'en_curso';
	$: ubicacionCorta = getUbicacionCorta(proyecto);
	$: isVirtual = ubicacionCorta === 'Virtual';
</script>

<div
	class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
	on:click={() => goto(`/proyectos/${proyecto.id_proyecto}`)}
	on:keydown={(e) =>
		(e.key === 'Enter' || e.key === ' ') && goto(`/proyectos/${proyecto.id_proyecto}`)}
	role="button"
	tabindex="0"
>
	<!-- Imagen Cover -->
	<div class="relative h-48 overflow-hidden bg-gray-100">
		{#if proyecto.url_portada}
			<img
				src={proyecto.url_portada}
				alt={proyecto.titulo}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				loading="lazy"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center text-gray-300">
				<Icon src={Photo} class="h-12 w-12" />
			</div>
		{/if}

		<!-- Badges flotantes -->
		<div class="absolute left-3 top-3 flex flex-col items-start gap-2">
			<StatusBadge estado={proyecto.estado} />
		</div>

		<!-- Badge de ubicación -->
		<div class="absolute right-3 top-3">
			<span
				class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm"
			>
				{#if isVirtual}
					<Icon src={GlobeAlt} class="h-3.5 w-3.5" />
				{:else}
					<Icon src={MapPin} class="h-3.5 w-3.5" />
				{/if}
				{ubicacionCorta}
			</span>
		</div>
	</div>

	<!-- Contenido -->
	<div class="flex flex-grow flex-col p-4">
		<!-- Header: Título e Institución -->
		<div class="mb-3">
			<h3
				class="mb-1.5 line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-600"
			>
				{proyecto.titulo}
			</h3>

			{#if proyecto.institucion?.nombre_legal}
				<div class="flex items-center gap-1.5 text-sm text-gray-500">
					<Icon src={BuildingOffice2} class="h-3.5 w-3.5 flex-shrink-0" />
					<span class="truncate">{proyecto.institucion.nombre_legal}</span>
				</div>
			{/if}
		</div>

		<p class="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
			{proyecto.descripcion}
		</p>

		<!-- Progreso visual -->
		<div class="mt-auto flex flex-col gap-2.5 border-t border-gray-100 pt-3">
			<ProyectoProgreso {proyecto} variant="compact" />

			{#if mostrarBotones}
				<div
					class="flex flex-col-reverse gap-2 pt-2 sm:flex-row"
					on:click|stopPropagation={() => {}}
					on:keydown|stopPropagation={() => {}}
					role="presentation"
				>
					<Button
						label="Ver detalles"
						href={`/proyectos/${proyecto.id_proyecto}`}
						variant="secondary"
						size="sm"
						customClass="flex-1"
						customAriaLabel="Ver detalles del proyecto"
					/>
					<Button
						label="Colaborar ahora"
						href={`/proyectos/${proyecto.id_proyecto}#colaborar`}
						size="sm"
						disabled={botonColaborarDeshabilitado}
						customClass="flex-1"
						customAriaLabel="Colaborar en este proyecto"
					/>
				</div>
			{:else}
				<button
					class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
					on:click|stopPropagation={() => goto(`/proyectos/${proyecto.id_proyecto}`)}
				>
					Ver detalles
					<Icon src={ArrowRight} class="h-4 w-4" />
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
