<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import { fade, fly } from 'svelte/transition';
	import SearchBar from '$lib/components/ui/elementos/SearchBar.svelte';
	import Pagination from '$lib/components/ui/elementos/Pagination.svelte';
	import type { Writable } from 'svelte/store';
	import ProyectosFiltro from './ProyectosFiltro.svelte';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';

	// Props
	export let proyectos: Proyecto[] = []; // Proyectos YA filtrados y ordenados
	export let titulo: string = '';
	export let placeholderBusqueda: string = 'Buscar por título o institución...';
	export let textoVacio: string = 'No hay proyectos disponibles';
	export let descripcionVacia: string =
		'Probá con otro tipo de participación o reiniciá los filtros.';

	// Configuración
	export let mostrarEstado: boolean = false;
	export let prefijoIdFiltros: string = 'filtros-base';

	// Stores de filtros (Writables)
	export let mostrarFiltros: Writable<boolean>;
	export let filtroParticipacion: Writable<'Todos' | TipoParticipacionDescripcion>;
	export let categoriaSeleccionada: Writable<string>;
	export let tipoUbicacion: Writable<'Todas' | 'Presencial' | 'Virtual'>;
	export let provinciaSeleccionada: Writable<string>;
	export let localidadSeleccionada: Writable<string>;
	export let fechaDesde: Writable<string>;
	export let fechaHasta: Writable<string>;
	export let estadoSeleccionado: Writable<string>;
	export let criterioOrden: Writable<
		'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso'
	>;
	export let consultaBusqueda: Writable<string>;

	// Datos derivados (Stores o Arrays simples pasados desde parent)
	export let categoriasDisponibles: string[] = [];
	export let provinciasDisponibles: string[] = [];
	export let estadosDisponibles: string[] = [];
	export let tiposParticipacionDisponibles: string[] = [];

	// Funciones
	export let calcularLocalidadesDisponibles: (proyectos: Proyecto[], provincia: string) => string[];
	export let restablecerFiltros: () => void;

	// Computed Local
	$: localidades = calcularLocalidadesDisponibles(proyectos, $provinciaSeleccionada);

	// Paginación
	const ITEMS_POR_PAGINA = 16;
	let paginaActual = 1;

	$: totalPaginas = Math.ceil(proyectos.length / ITEMS_POR_PAGINA);
	$: indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
	$: indiceFin = indiceInicio + ITEMS_POR_PAGINA;
	$: proyectosVisibles = proyectos.slice(indiceInicio, indiceFin);

	// Reset página al filtrar
	$: if (proyectos.length || $consultaBusqueda || $filtroParticipacion) {
		paginaActual = 1;
	}

	function manejarCambioPagina(event: CustomEvent<number>) {
		paginaActual = event.detail;
		const element = document.getElementById('proyectos-list-top');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div class="w-full" id="proyectos-list-top">
	<!-- Encabezado -->
	{#if titulo}
		<div class="animate-fade-in-up relative mb-8 flex flex-col items-center gap-4 md:block">
			<h2 class="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
				{titulo}
			</h2>
			<slot name="header-actions" />
		</div>
	{/if}

	<!-- Buscador -->
	<div class="animate-fade-in-up mx-auto mb-4 w-full max-w-xl">
		<SearchBar
			bind:value={$consultaBusqueda}
			placeholder={placeholderBusqueda}
			ariaLabel="Campo de búsqueda de proyectos"
			autofocus={false}
		/>
	</div>

	<ProyectosFiltro
		prefijoId={prefijoIdFiltros}
		bind:mostrar={$mostrarFiltros}
		bind:participacion={$filtroParticipacion}
		bind:categoria={$categoriaSeleccionada}
		{categoriasDisponibles}
		bind:tipoUbicacion={$tipoUbicacion}
		bind:provincia={$provinciaSeleccionada}
		bind:localidad={$localidadSeleccionada}
		bind:fechaDesde={$fechaDesde}
		bind:fechaHasta={$fechaHasta}
		{provinciasDisponibles}
		localidadesDisponibles={localidades}
		tiposParticipacion={tiposParticipacionDisponibles}
		{mostrarEstado}
		bind:estado={$estadoSeleccionado}
		{estadosDisponibles}
		bind:criterioOrden={$criterioOrden}
		on:reset={() => {
			restablecerFiltros();
			// $consultaBusqueda = ''; // reset manejado por restablecerFiltros de composable usualmente, verificar
		}}
		on:ubicacionChange={() => {
			$provinciaSeleccionada = 'Todas';
			$localidadSeleccionada = 'Todas';
		}}
		on:toggle={() => ($mostrarFiltros = !$mostrarFiltros)}
	/>

	<!-- Contador -->
	<div class="animate-fade-in-up mb-4 text-center text-sm text-gray-600">
		<p>
			Mostrando <strong>{proyectosVisibles.length}</strong> proyecto{proyectosVisibles.length !== 1
				? 's'
				: ''}
			de <strong>{proyectos.length}</strong> encontrado{proyectos.length !== 1 ? 's' : ''}
		</p>
	</div>

	<!-- Lista de proyectos -->
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
		{#each proyectosVisibles as proyecto (proyecto.id_proyecto)}
			<div
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 150 }}
				class="transition-transform hover:scale-[1.02]"
			>
				<slot name="card" {proyecto} />
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
			<h3 class="mb-4 text-xl font-semibold text-gray-800">{textoVacio}</h3>
			<p class="mx-auto mb-6 max-w-xl text-gray-600">
				{#if $consultaBusqueda.trim() !== ''}
					No se encontraron resultados para <strong>"{$consultaBusqueda.trim()}"</strong>.
				{:else}
					{descripcionVacia}
				{/if}
			</p>
			<div class="flex justify-center">
				<slot name="empty-action" {restablecerFiltros} />
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
