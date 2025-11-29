<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import StatusBadge from '$lib/components/ui/badges/StatusBadge.svelte';
	import LocationDisplay from '$lib/components/ui/badges/LocationDisplay.svelte';
	import { Photo } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let proyecto: Proyecto;
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

	<div class="absolute bottom-0 left-0 w-full p-6 text-white">
		<div class="flex flex-col gap-2">
			<div class="mb-2 flex items-center gap-3">
				<StatusBadge estado={proyecto.estado} />
				<LocationDisplay {proyecto} className="text-white/90" />
			</div>

			<h1 class="text-shadow-sm text-3xl font-bold leading-tight md:text-4xl">
				{proyecto.titulo}
			</h1>

			{#if proyecto.institucion?.nombre_legal}
				<p class="text-lg font-medium text-white/90">
					{proyecto.institucion.nombre_legal}
				</p>
			{/if}
		</div>
	</div>
</div>
