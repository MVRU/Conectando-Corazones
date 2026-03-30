<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import SearchBar from '$lib/components/ui/elementos/SearchBar.svelte';
	import Pagination from '$lib/components/ui/elementos/Pagination.svelte';
	import type { Writable } from 'svelte/store';
	import ProyectosFiltro from './ProyectosFiltro.svelte';

	let {
		proyectos = [],
		titulo = '',
		placeholderBusqueda = 'Buscar por título o institución...',
		textoVacio = 'No hay proyectos disponibles',
		descripcionVacia = 'Probá con otro tipo de participación o reiniciá los filtros.',
		mostrarEstado = false,
		prefijoIdFiltros = 'filtros-base',
		mostrarFiltros,
		filtroParticipacion,
		categoriaSeleccionada,
		tipoUbicacion,
		provinciaSeleccionada,
		localidadSeleccionada,
		fechaDesde,
		fechaHasta,
		estadoSeleccionado,
		criterioOrden,
		consultaBusqueda,
		categoriasDisponibles = [],
		provinciasDisponibles = [],
		estadosDisponibles = [],
		tiposParticipacionDisponibles = [],
		calcularLocalidadesDisponibles,
		restablecerFiltros,
		headerActions,
		card,
		emptyAction
	} = $props<{
		proyectos?: Proyecto[];
		titulo?: string;
		placeholderBusqueda?: string;
		textoVacio?: string;
		descripcionVacia?: string;
		mostrarEstado?: boolean;
		prefijoIdFiltros?: string;
		mostrarFiltros: Writable<boolean>;
		filtroParticipacion: Writable<string[]>;
		categoriaSeleccionada: Writable<string[]>;
		tipoUbicacion: Writable<'Todas' | 'Presencial' | 'Virtual'>;
		provinciaSeleccionada: Writable<string>;
		localidadSeleccionada: Writable<string>;
		fechaDesde: Writable<string>;
		fechaHasta: Writable<string>;
		estadoSeleccionado: Writable<string[]>;
		criterioOrden: Writable<'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso'>;
		consultaBusqueda: Writable<string>;
		categoriasDisponibles?: string[];
		provinciasDisponibles?: string[];
		estadosDisponibles?: { value: string; label: string }[];
		tiposParticipacionDisponibles?: string[];
		calcularLocalidadesDisponibles: (proyectos: Proyecto[], provincia: string) => string[];
		restablecerFiltros: () => void;
		headerActions?: Snippet;
		card: Snippet<[{ proyecto: Proyecto }]>;
		emptyAction?: Snippet<[{ restablecerFiltros: () => void }]>;
	}>();

	let localidades = $derived(calcularLocalidadesDisponibles(proyectos, $provinciaSeleccionada));

	// Paginación
	const ITEMS_POR_PAGINA = 16;
	let paginaActual = $state(1);

	let totalPaginas = $derived(Math.ceil(proyectos.length / ITEMS_POR_PAGINA));
	let indiceInicio = $derived((paginaActual - 1) * ITEMS_POR_PAGINA);
	let indiceFin = $derived(indiceInicio + ITEMS_POR_PAGINA);
	let proyectosVisibles = $derived(proyectos.slice(indiceInicio, indiceFin));

	// Reset página al filtrar
	$effect(() => {
		if (proyectos.length || $consultaBusqueda || $filtroParticipacion) {
			paginaActual = 1;
		}
	});

	function manejarCambioPagina(page: number) {
		paginaActual = page;
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
			{#if headerActions}{@render headerActions()}{/if}
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

	<div class="relative z-30">
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
			onreset={() => {
				restablecerFiltros();
			}}
			onubicacionchange={() => {
				$provinciaSeleccionada = 'Todas';
				$localidadSeleccionada = 'Todas';
			}}
			ontoggle={() => ($mostrarFiltros = !$mostrarFiltros)}
		/>
	</div>

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
				{@render card({ proyecto })}
			</div>
		{/each}
	</div>

	<!-- Paginación -->
	{#if proyectos.length > ITEMS_POR_PAGINA}
		<div class="mt-8">
			<Pagination
				currentPage={paginaActual}
				totalPages={totalPaginas}
				onpagechange={manejarCambioPagina}
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
				{#if emptyAction}{@render emptyAction({ restablecerFiltros })}{/if}
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
