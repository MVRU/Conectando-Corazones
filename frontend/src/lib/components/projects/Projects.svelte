<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { projects as defaultProjects } from '$lib/mocks/mock-projects';
	import type { Project } from '$lib/types/Project';

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

	let filtrosSeleccionados: (ParticipacionLabel | 'Todos')[] = ['Todos'];
	export let proyectos: Project[] = defaultProjects;
	let proyectosVisibles: Project[] = [];
	let searchQuery = '';

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
		searchQuery = '';
	}

	$: {
		proyectosVisibles = filtrarProyectos(proyectos, filtrosSeleccionados, searchQuery);
	}
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
		<div class="relative">
			<input
				id="search"
				type="text"
				bind:value={searchQuery}
				placeholder="Buscar por título o institución..."
				class="w-full rounded-xl border border-gray-300 bg-white px-12 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-md transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
			/>
			<svg
				class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
				/>
			</svg>
		</div>
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
								? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
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

	<!-- Sin resultados -->
	{#if proyectosVisibles.length === 0}
		<div class="animate-fade-in-up py-24 text-center">
			<h3 class="mb-4 text-xl font-semibold text-gray-800">No hay proyectos disponibles</h3>
			<p class="mx-auto mb-6 max-w-xl text-gray-600">
				{#if searchQuery.trim() !== ''}
					No se encontraron resultados para <strong>"{searchQuery.trim()}"</strong>.
				{:else}
					Probá con otro tipo de participación o reiniciá los filtros.
				{/if}
			</p>
			<div class="flex justify-center" on:click={resetFiltros}>
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
