<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
<<<<<<< HEAD
	import { projects as defaultProjects } from '$lib/data/projects';
	import type { Project } from '$lib/models/Project';
	import Pagination from '$lib/components/ui/navigation/Pagination.svelte';

	let filtroSeleccionado: ParticipacionLabel | 'Todos' = 'Todos';
	let currentPage = 1;
	const ITEMS_POR_PAGINA = 9;

	// Filtramos y ordenamos los proyectos según el filtro actual
	function filtrarProyectos(proyectos: Project[], filtro: typeof filtroSeleccionado): Project[] {
		let resultado = [...proyectos];

		if (filtro !== 'Todos') {
			const unidadEsperada = reverseMap[filtro];
			resultado = resultado.filter((p) => (p.unidad || '').trim().toLowerCase() === unidadEsperada);
		}

		// Ordenar por estado y fechaInicio
		resultado.sort((a, b) => {
			const estadoA = estadoTemporizadorProyecto(a);
			const estadoB = estadoTemporizadorProyecto(b);
			const prioridadEstadoA = ESTADO_PRIORIDAD[estadoA] ?? 3;
			const prioridadEstadoB = ESTADO_PRIORIDAD[estadoB] ?? 3;

			if (prioridadEstadoA !== prioridadEstadoB) {
				return prioridadEstadoA - prioridadEstadoB;
			}

			const fechaA = new Date(a.fechaInicio || '').getTime();
			const fechaB = new Date(b.fechaInicio || '').getTime();
			return fechaA - fechaB;
		});

		return resultado;
	}

	$: proyectosFiltrados = filtrarProyectos(proyectos, filtroSeleccionado);

	$: totalPaginas = Math.ceil(proyectosFiltrados.length / ITEMS_POR_PAGINA);

	// Aplicar paginación inicialmente y cada vez que cambie filtro o página
	$: proyectosVisibles = proyectosFiltrados.slice(
		(currentPage - 1) * ITEMS_POR_PAGINA,
		currentPage * ITEMS_POR_PAGINA
	);

	function cambiarPagina(nueva: number) {
		if (nueva >= 1 && nueva <= totalPaginas) {
			currentPage = nueva;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
=======
	import { projects as defaultProjects } from '$lib/mocks/mock-projects';
	import type { Project } from '$lib/types/Project';
	import SearchBar from '../ui/elements/SearchBar.svelte';
	import { writable } from 'svelte/store';

	let searchQuery = writable('');
>>>>>>> main

	const participacionMap = {
		dinero: 'Monetaria',
		voluntarios: 'Voluntariado',
		materiales: 'Materiales'
	} as const;

	type ParticipacionLabel = (typeof participacionMap)[keyof typeof participacionMap];
	const tiposParticipacion: ('Todos' | ParticipacionLabel)[] = [
		'Todos',
		...Object.values(participacionMap)
	];

	const reverseMap: Record<ParticipacionLabel, keyof typeof participacionMap> = {
		Monetaria: 'dinero',
		Voluntariado: 'voluntarios',
		Materiales: 'materiales'
	};

<<<<<<< HEAD
=======
	let filtrosSeleccionados: (ParticipacionLabel | 'Todos')[] = ['Todos'];
>>>>>>> main
	export let proyectos: Project[] = defaultProjects;

	const ESTADO_PRIORIDAD: Record<string, number> = {
		Abierto: 0,
		'En ejecución': 1,
		Finalizado: 2
	};

	function estadoTemporizadorProyecto(p: Project): string {
		const hoy = new Date();
		const inicio = p.fechaInicio ? new Date(p.fechaInicio) : null;
		const cierre = p.fechaCierre ? new Date(p.fechaCierre) : null;

		if (!inicio || !cierre) return 'Abierto';

		if (hoy > cierre) return 'Finalizado';
		if (hoy >= inicio && hoy <= cierre) return 'En ejecución';
		return 'Abierto';
	}
<<<<<<< HEAD
=======

	function filtrarProyectos(
		proyectos: Project[],
		filtros: typeof filtrosSeleccionados,
		searchQuery: string
	): Project[] {
		let resultado = [...proyectos];

		// Filtro por tipo de participación
		if (!filtros.includes('Todos')) {
			const unidadesEsperadas = filtros
				.filter((f): f is ParticipacionLabel => f !== 'Todos')
				.map((f) => reverseMap[f]);

			resultado = resultado.filter((p) =>
				p.objetivos?.some((o) => unidadesEsperadas.includes(o.unidad))
			);
		}

		// Filtro por título o razón social
		if (searchQuery.trim() !== '') {
			const query = searchQuery.trim().toLowerCase();
			resultado = resultado.filter(
				(p) =>
					p.titulo.toLowerCase().includes(query) ||
					p.institucion?.razonSocial?.toLowerCase().includes(query)
			);
		}

		// Orden por estado y fecha
		resultado.sort((a, b) => {
			const estadoA = estadoTemporizadorProyecto(a);
			const estadoB = estadoTemporizadorProyecto(b);
			const prioridadEstadoA = ESTADO_PRIORIDAD[estadoA] ?? 3;
			const prioridadEstadoB = ESTADO_PRIORIDAD[estadoB] ?? 3;

			if (prioridadEstadoA !== prioridadEstadoB) {
				return prioridadEstadoA - prioridadEstadoB;
			}

			const fechaA = new Date(a.fechaInicio || '').getTime();
			const fechaB = new Date(b.fechaInicio || '').getTime();
			return fechaA - fechaB;
		});

		return resultado;
	}

	function toggleFiltro(tipo: ParticipacionLabel | 'Todos') {
		if (tipo === 'Todos') {
			filtrosSeleccionados = ['Todos'];
		} else {
			const yaSeleccionado = filtrosSeleccionados.includes(tipo);
			if (yaSeleccionado) {
				filtrosSeleccionados = filtrosSeleccionados.filter((t) => t !== tipo);
			} else {
				filtrosSeleccionados = [...filtrosSeleccionados.filter((t) => t !== 'Todos'), tipo];
			}
		}

		// Filtrado actual sin el "Todos"
		const sinTodos = filtrosSeleccionados.filter((f) => f !== 'Todos');

		// Si no hay filtros seleccionados, volvemos a 'Todos'
		if (sinTodos.length === 0) {
			filtrosSeleccionados = ['Todos'];
		}

		// Si están los tres tipos individuales, activar 'Todos'
		if (
			sinTodos.length === 3 &&
			sinTodos.includes('Monetaria') &&
			sinTodos.includes('Materiales') &&
			sinTodos.includes('Voluntariado')
		) {
			filtrosSeleccionados = ['Todos'];
		}
	}

	function resetFiltros() {
		filtrosSeleccionados = ['Todos'];
		searchQuery = writable('');
	}

	$: {
		proyectosVisibles = filtrarProyectos(proyectos, filtrosSeleccionados, $searchQuery);
	}
>>>>>>> main
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-12 sm:px-10 lg:px-20">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-14 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">Proyectos Solidarios</h2>
		<p class="mt-3 text-lg text-gray-600">
			<strong>Colaborá con:</strong> donaciones, materiales o voluntariado.
		</p>
	</div>

	<!-- Buscador -->
	<div class="animate-fade-in-up mx-auto mb-12 w-full max-w-xl">
		<SearchBar
			bind:value={searchQuery}
			placeholder="Buscar por título o institución..."
			ariaLabel="Campo de búsqueda de proyectos solidarios"
			autofocus={false}
		/>
	</div>

	<!-- Filtros -->
	<div class="animate-fade-in-up mb-10">
		<h3 class="mb-5 text-center text-base font-semibold text-gray-800">
			Filtrar por tipo de participación
		</h3>
		<div class="flex flex-wrap justify-center gap-4">
			{#each tiposParticipacion as tipo}
				<button
					on:click={() => toggleFiltro(tipo)}
					class={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ease-in-out
						${
							filtrosSeleccionados.includes(tipo)
								? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
								: 'border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm'
						}`}
				>
					{tipo}
				</button>
			{/each}
		</div>
	</div>

	<!-- Contador -->
	<div class="animate-fade-in-up mb-6 text-center text-sm text-gray-600">
		<p>
			Mostrando <strong>{proyectosVisibles.length}</strong> proyecto{proyectosVisibles.length !== 1
				? 's'
				: ''}
			{#if !filtrosSeleccionados.includes('Todos')}
				de tipo <strong>{filtrosSeleccionados.join(', ')}</strong>
			{/if}
		</p>
	</div>

	<!-- Lista de proyectos -->
	<div class="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
		{#each proyectosVisibles as proyecto (proyecto.id)}
			<div
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 150 }}
				class="transition-transform hover:scale-[1.02]"
			>
				<ProjectCard {proyecto} mostrarBotones={true} />
			</div>
		{/each}
	</div>
	<Pagination totalPages={totalPaginas} {currentPage} onPageChange={cambiarPagina} />

	<!-- Sin resultados -->
	{#if proyectosVisibles.length === 0}
		<div class="animate-fade-in-up py-24 text-center">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">No hay proyectos disponibles</h3>
			<p class="mx-auto mb-6 max-w-xl text-gray-600">
				{#if $searchQuery.trim() !== ''}
					No se encontraron resultados para <strong>"{$searchQuery.trim()}"</strong>.
				{:else}
					Probá con otro tipo de participación o reiniciá los filtros.
				{/if}
			</p>
			<div
				class="flex justify-center"
				on:click={() => {
					resetFiltros();
					searchQuery.set('');
				}}
			>
				<Button label="Ver todos los proyectos" />
			</div>
		</div>
	{/if}
</section>

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
