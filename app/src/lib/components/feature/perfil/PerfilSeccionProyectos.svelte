<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';

	export let proyectos: Proyecto[];
	export let rol: 'institucion' | 'colaborador' | 'administrador';
	export let limiteMostrar: number = 3;

	$: proyectosMostrados = proyectos.slice(0, limiteMostrar);
	$: tieneProyectos = proyectos.length > 0;
	$: mensajeVacio =
		rol === 'institucion'
			? 'Cuando crees proyectos, aparecerán aquí.'
			: 'Cuando participes en proyectos, aparecerán aquí.';
</script>

<section class="mb-8">
	<h3 class="mb-4 text-xl font-semibold text-gray-900">Últimos proyectos</h3>

	{#if tieneProyectos}
		<div class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each proyectosMostrados as proyecto (proyecto.id_proyecto)}
				<div class="w-full">
					<ProyectoCard {proyecto} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-12 text-center">
			<div class="mx-auto h-12 w-12 text-gray-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			</div>
			<h3 class="mt-4 text-lg font-medium text-gray-900">No hay proyectos</h3>
			<p class="mt-2 text-gray-500">{mensajeVacio}</p>
		</div>
	{/if}
</section>

