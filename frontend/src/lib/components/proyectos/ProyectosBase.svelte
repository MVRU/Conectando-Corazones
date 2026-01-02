<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import { fade, fly } from 'svelte/transition';
	import SearchBar from '$lib/components/ui/elementos/SearchBar.svelte';
	import Pagination from '$lib/components/ui/elementos/Pagination.svelte';
	import { writable } from 'svelte/store';
	import { getProvinciaFromLocalidad, filtrarPorLocalidad } from '$lib/utils/util-ubicaciones';
	import {
		filtrarProyectos,
		filtrarPorTipoUbicacion,
		filtrarPorRangoFechas
	} from '$lib/utils/util-proyectos';
	import { calcularProgresoTotal } from '$lib/utils/util-progreso';
	import { ESTADO_LABELS } from '$lib/types/Estado';
	import {
		TIPO_PARTICIPACION_LABELS,
		type TipoParticipacionDescripcion
	} from '$lib/types/TipoParticipacion';

	// Props
	export let proyectos: Proyecto[] = [];
	export let titulo: string = '';
	export let placeholderBusqueda: string = 'Buscar por título o institución...';
	export let textoVacio: string = 'No hay proyectos disponibles';
	export let descripcionVacia: string =
		'Probá con otro tipo de participación o reiniciá los filtros.';

	// Props para filtros avanzados
	export let categoriaSeleccionada: string = 'Todas';
	export let tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	export let localidadSeleccionada: string = 'Todas';
	export let fechaDesde: string = '';
	export let fechaHasta: string = '';
	export let criterioOrden: 'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso' =
		'recientes';

	export let customFilter: ((proyectos: Proyecto[]) => Proyecto[]) | undefined = undefined;

	let searchQuery = writable('');

	// Paginación
	const ITEMS_POR_PAGINA = 16;
	let paginaActual = 1;

	const tiposParticipacion: ('Todos' | TipoParticipacionDescripcion)[] = [
		'Todos',
		...(Object.keys(TIPO_PARTICIPACION_LABELS) as TipoParticipacionDescripcion[])
	];
	const estadosDisponiblesBase = ['Todos', ...Object.values(ESTADO_LABELS)];

	let provinciasDisponibles: string[] = [];
	export let filtroParticipacionSeleccionado: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	export let estadoSeleccionado: string = 'Todos';
	export let provinciaSeleccionada: string = 'Todas';

	// Calcular provincias disponibles
	$: provinciasDisponibles = [
		'Todas',
		...Array.from(
			new Set(
				proyectos
					.map((p) => {
						const primeraUbicacion = p.ubicaciones?.[0]?.ubicacion;
						if (primeraUbicacion?.modalidad === 'presencial') {
							return getProvinciaFromLocalidad(primeraUbicacion.localidad)?.nombre ?? '';
						}
						return '';
					})
					.filter((s) => s !== '')
			)
		).sort()
	];

	let estadosDisponibles: string[] = [];
	let tiposParticipacionDisponibles: string[] = [];

	$: {
		const estadosSet = new Set<string>();
		const tiposSet = new Set<string>();

		proyectos.forEach((p) => {
			if (p.estado) estadosSet.add(ESTADO_LABELS[p.estado]);
			p.participacion_permitida?.forEach((pp) => {
				if (pp.tipo_participacion?.descripcion) {
					tiposSet.add(pp.tipo_participacion.descripcion);
				}
			});
		});

		estadosDisponibles = ['Todos', ...Array.from(estadosSet)];
		tiposParticipacionDisponibles = ['Todos', ...Array.from(tiposSet)];
	}

	// Sincronizar filtros
	let filtrosSeleccionados: (TipoParticipacionDescripcion | 'Todos')[] = ['Todos'];
	$: {
		if (filtroParticipacionSeleccionado === 'Todos') {
			filtrosSeleccionados = ['Todos'];
		} else {
			filtrosSeleccionados = [filtroParticipacionSeleccionado];
		}
	}

	// Aplicar filtros
	$: proyectosFiltrados = filtrarProyectos(
		proyectos,
		filtrosSeleccionados,
		$searchQuery,
		estadoSeleccionado,
		provinciaSeleccionada,
		categoriaSeleccionada
	);

	// Filtros adicionales encadenados
	$: proyectosFiltradosUbicacion = filtrarPorTipoUbicacion(proyectosFiltrados, tipoUbicacion);
	$: proyectosFiltradosFechas = filtrarPorRangoFechas(
		proyectosFiltradosUbicacion,
		fechaDesde,
		fechaHasta
	);
	$: proyectosFiltradosLocalidad = filtrarPorLocalidad(
		proyectosFiltradosFechas,
		localidadSeleccionada,
		tipoUbicacion
	);

	// Aplicar filtro custom (Tabs)
	$: proyectosFinales = customFilter
		? customFilter(proyectosFiltradosLocalidad)
		: proyectosFiltradosLocalidad;

	// Ordenamiento
	$: proyectosOrdenados = [...proyectosFinales].sort((a, b) => {
		if (criterioOrden === 'recientes' || criterioOrden === 'antiguos') {
			const fechaA = new Date(a.created_at || '').getTime();
			const fechaB = new Date(b.created_at || '').getTime();
			return criterioOrden === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
		} else {
			const progA = calcularProgresoTotal(a);
			const progB = calcularProgresoTotal(b);
			return criterioOrden === 'mayor_progreso' ? progB - progA : progA - progB;
		}
	});

	// Paginación
	$: totalPaginas = Math.ceil(proyectosOrdenados.length / ITEMS_POR_PAGINA);
	$: indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
	$: indiceFin = indiceInicio + ITEMS_POR_PAGINA;
	$: proyectosVisibles = proyectosOrdenados.slice(indiceInicio, indiceFin);

	$: if (
		proyectosOrdenados.length !== proyectos.length ||
		$searchQuery ||
		filtroParticipacionSeleccionado
	) {
		paginaActual = 1;
	}

	function manejarCambioPagina(event: CustomEvent<number>) {
		paginaActual = event.detail;
		const element = document.getElementById('proyectos-list-top');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function resetFiltros() {
		filtroParticipacionSeleccionado = 'Todos';
		estadoSeleccionado = 'Todos';
		provinciaSeleccionada = 'Todas';
		categoriaSeleccionada = 'Todas';
		tipoUbicacion = 'Todas';
		localidadSeleccionada = 'Todas';
		fechaDesde = '';
		fechaHasta = '';
		searchQuery.set('');
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
			bind:value={$searchQuery}
			placeholder={placeholderBusqueda}
			ariaLabel="Campo de búsqueda de proyectos"
			autofocus={false}
		/>
	</div>

	<!-- Slot para filtros personalizados -->
	<slot
		name="filtros-personalizados"
		{resetFiltros}
		{provinciasDisponibles}
		{estadosDisponibles}
		tiposParticipacion={tiposParticipacionDisponibles}
	/>

	<!-- Contador -->
	<div class="animate-fade-in-up mb-4 text-center text-sm text-gray-600">
		<p>
			Mostrando <strong>{proyectosVisibles.length}</strong> proyecto{proyectosVisibles.length !== 1
				? 's'
				: ''}
			de <strong>{proyectosOrdenados.length}</strong> encontrado{proyectosOrdenados.length !== 1
				? 's'
				: ''}
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
				<slot name="card" {proyecto} {resetFiltros} />
			</div>
		{/each}
	</div>

	<!-- Paginación -->
	{#if proyectosOrdenados.length > ITEMS_POR_PAGINA}
		<div class="mt-8">
			<Pagination
				currentPage={paginaActual}
				totalPages={totalPaginas}
				on:pageChange={manejarCambioPagina}
			/>
		</div>
	{/if}

	<!-- Sin resultados -->
	{#if proyectosOrdenados.length === 0}
		<div class="animate-fade-in-up py-24 text-center">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">{textoVacio}</h3>
			<p class="mx-auto mb-6 max-w-xl text-gray-600">
				{#if $searchQuery.trim() !== ''}
					No se encontraron resultados para <strong>"{$searchQuery.trim()}"</strong>.
				{:else}
					{descripcionVacia}
				{/if}
			</p>
			<div class="flex justify-center">
				<slot name="empty-action" {resetFiltros} />
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
