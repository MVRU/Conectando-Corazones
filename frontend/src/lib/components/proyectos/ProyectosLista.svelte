<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import MisProyectoCard from '$lib/components/ui/cards/MisProyectoCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import SearchBar from '$lib/components/ui/elementos/SearchBar.svelte';
	import Pagination from '$lib/components/ui/elementos/Pagination.svelte';
	import { Search } from 'lucide-svelte';
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Usuario } from '$lib/types/Usuario';

	export let proyectos: Proyecto[] = [];
	export let consultaBusqueda: string = '';
	export let titulo: string;
	export let esHistorial: boolean = false;
	export let usuario: Usuario | null = null;
	export let etiquetaEstado: string | undefined = undefined;
	export let tituloVacio: string | undefined = undefined;
	export let descripcionVacia: string | undefined = undefined;

	const ITEMS_POR_PAGINA = 16;
	let paginaActual = 1;

	$: totalPaginas = Math.ceil(proyectos.length / ITEMS_POR_PAGINA);
	$: indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
	$: indiceFin = indiceInicio + ITEMS_POR_PAGINA;
	$: proyectosPaginados = proyectos.slice(indiceInicio, indiceFin);

	$: if (proyectos) {
		paginaActual = 1;
	}

	function manejarCambioPagina(event: CustomEvent<number>) {
		paginaActual = event.detail;
		const element = document.getElementById(`list-${esHistorial ? 'historial' : 'activos'}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div id="list-{esHistorial ? 'historial' : 'activos'}" class="mb-16">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-6 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">{titulo}</h2>
	</div>

	<!-- Buscador -->
	<div class="animate-fade-in-up mx-auto mb-4 w-full max-w-xl">
		<SearchBar
			bind:value={consultaBusqueda}
			placeholder="Buscar por título o institución..."
			ariaLabel="Campo de búsqueda de {titulo.toLowerCase()}"
			autofocus={false}
		/>
	</div>

	<!-- Filtros Toggle Slot -->
	<slot name="filtros-toggle" />

	<!-- Filtros Content Slot -->
	<slot name="filtros-content" />

	<!-- Contador -->
	<div class="animate-fade-in-up mb-4 text-center text-sm text-gray-600">
		<p>
			Mostrando <strong>{proyectos.length}</strong> proyecto{proyectos.length !== 1 ? 's' : ''}
			{#if etiquetaEstado}
				{etiquetaEstado}{proyectos.length !== 1 ? (etiquetaEstado.endsWith('o') ? 's' : '') : ''}
			{/if}
		</p>
	</div>

	<!-- Lista de proyectos -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each proyectosPaginados as proyecto (proyecto.id_proyecto)}
			<div
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 150 }}
				class="transition-transform hover:scale-[1.02]"
			>
				<slot name="card" {proyecto}>
					<MisProyectoCard
						{proyecto}
						esInstitucion={usuario?.rol === 'institucion'}
						esProyectoCompletado={esHistorial}
					/>
				</slot>
			</div>
		{/each}
	</div>

	<!-- Paginación -->
	{#if proyectos.length > ITEMS_POR_PAGINA}
		<div class="mt-8">
			<Pagination
				currentPage={paginaActual}
				totalPages={totalPaginas}
				on:pageChange={manejarCambioPagina}
			/>
		</div>
	{/if}

	<!-- Sin resultados -->
	{#if proyectos.length === 0}
		<div class="animate-fade-in-up py-24 text-center">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">
				{tituloVacio || `No hay proyectos ${esHistorial ? 'en el historial' : 'activos'}`}
			</h3>
			<p class="mx-auto mb-6 max-w-xl text-gray-600">
				{#if consultaBusqueda.trim() !== ''}
					No se encontraron resultados para <strong>"{consultaBusqueda.trim()}"</strong>.
				{:else}
					{descripcionVacia ||
						(esHistorial
							? 'Aún no tenés proyectos completados.'
							: 'No tenés proyectos activos en este momento.')}
				{/if}
			</p>
			<div class="flex justify-center">
				<slot name="empty-action" />
			</div>
		</div>
	{/if}
</div>

<style>
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
		animation: fade-in-up 0.6s ease-out both;
	}
</style>
