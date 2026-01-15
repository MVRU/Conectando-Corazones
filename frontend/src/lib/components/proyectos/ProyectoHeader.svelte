<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import StatusBadge from '$lib/components/ui/badges/StatusBadge.svelte';
	import LocationDisplay from '$lib/components/ui/badges/LocationDisplay.svelte';
	import { Photo } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';

	export let proyecto: Proyecto;
	export let esAdministrador: boolean = false;
</script>

<div class="group relative h-48 w-full overflow-hidden rounded-xl shadow-lg md:h-64 lg:h-80">
	{#if proyecto.url_portada}
		<img
			src={proyecto.url_portada}
			alt={proyecto.titulo}
			class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
		/>
	{:else}
		<div
			class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100"
		>
			<Icon src={Photo} class="h-16 w-16 text-blue-300" />
		</div>
	{/if}

	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

	<div class="absolute bottom-0 left-0 w-full p-4 text-white sm:p-6">
		<div class="flex flex-col gap-2">
			<div class="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
				<StatusBadge estado={proyecto.estado} />
				<LocationDisplay {proyecto} variant="badge" />
			</div>

			<h1
				class="text-shadow-sm flex flex-wrap items-center gap-2 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
			>
				{proyecto.titulo}
				{#if esAdministrador}
					<span
						class="inline-flex items-center rounded-md bg-slate-900/80 px-2 py-1 text-sm font-normal text-white ring-1 ring-white/20 backdrop-blur-sm"
					>
						ID: {proyecto.id_proyecto}
					</span>
				{/if}
			</h1>

			{#if proyecto.institucion?.nombre_legal}
				{#if obtenerUrlPerfil(proyecto.institucion)}
					<a
						href={obtenerUrlPerfil(proyecto.institucion)}
						class="text-lg font-medium text-white/90 transition-colors hover:text-white hover:underline"
					>
						{proyecto.institucion.nombre_legal}
					</a>
				{:else}
					<p class="text-lg font-medium text-white/90">
						{proyecto.institucion.nombre_legal}
					</p>
				{/if}
			{/if}

			{#if esAdministrador}
				<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-white/80">
					<span>
						Creado: {proyecto.created_at
							? new Date(proyecto.created_at).toLocaleDateString('es-AR')
							: '-'}
					</span>
					<span>•</span>
					<span>
						Actualizado: {proyecto.updated_at
							? new Date(proyecto.updated_at).toLocaleDateString('es-AR')
							: '-'}
					</span>
				</div>
			{/if}
		</div>
	</div>
</div>
