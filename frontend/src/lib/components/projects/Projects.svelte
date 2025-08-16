<!-- FIX:
 	- [ ] Corregir atributos cuando se resuelvan las inconsistencias con el DER
	- [ ] Corregir los estados de Proyecto
	- [ ] Corregir nombres de tipos de participación
	
	-->

<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { mockProyectos as defaultProjects } from '$lib/mocks/mock-proyectos';
	import type { Proyecto } from '$lib/types/Proyecto';
	import SearchBar from '../ui/elements/SearchBar.svelte';
	import { writable } from 'svelte/store';

	let searchQuery = writable('');

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
		Monetaria: 'dinero', // FIX: monetaria
		Voluntariado: 'voluntarios', // FIX: voluntariado
		Materiales: 'materiales' // FIX: especie
	};

	// Nuevos filtros
	const estadosDisponibles = ['Todos', 'Abierto', 'En ejecución', 'Finalizado']; // TODO: corregir los estados
	const urgenciasDisponibles = ['Todas', 'Alta', 'Media', 'Baja'];
	const provinciasDisponibles = [
		'Todas',
		...Array.from(
			new Set(defaultProjects.map((p) => p.direccion?.localidad?.provincia?.nombre).filter(Boolean))
		).sort()
	];
	let filtrosSeleccionados: (ParticipacionLabel | 'Todos')[] = ['Todos'];
	let filtroParticipacionSeleccionado: 'Todos' | ParticipacionLabel = 'Todos';
	let estadoSeleccionado = 'Todos';
	let urgenciaSeleccionada = 'Todas';
	let provinciaSeleccionada = 'Todas';
	let mostrarFiltros = false;

	export let proyectos: Proyecto[] = defaultProjects;
	let proyectosVisibles: Proyecto[] = [];

	const ESTADO_PRIORIDAD: Record<string, number> = {
		// TODO: corregir los estados
		Abierto: 0,
		'En ejecución': 1,
		Finalizado: 2
	};

	function estadoTemporizadorProyecto(p: Proyecto): string {
		const hoy = new Date();
		const inicio = p.created_at ? new Date(p.created_at) : null;
		const cierre = p.fecha_fin_tentativa ? new Date(p.fecha_fin_tentativa) : null;

		// TODO: corregir los estados
		if (!inicio || !cierre) return 'Abierto';

		if (hoy > cierre) return 'Finalizado';
		if (hoy >= inicio && hoy <= cierre) return 'En ejecución';
		return 'Abierto';
	}

	function filtrarProyectos(
		proyectos: Proyecto[],
		filtros: typeof filtrosSeleccionados,
		searchQuery: string,
		estado: string,
		urgencia: string,
		provincia: string
	): Proyecto[] {
		let resultado = [...proyectos];

		// Filtro por tipo de participación
		if (!filtros.includes('Todos')) {
			const unidadesEsperadas = filtros
				.filter((f): f is ParticipacionLabel => f !== 'Todos')
				.map((f) => reverseMap[f]);

			// TODO: Implementar filtro cuando los mocks tengan objetos expandidos
			// resultado = resultado.filter((p) =>
			// 	p.objetivos?.some((o) => unidadesEsperadas.includes(o.unidad))
			// );
		}

		// Filtro por estado
		if (estado !== 'Todos') {
			resultado = resultado.filter((p) => {
				const estadoActual = estadoTemporizadorProyecto(p);
				return estadoActual === estado;
			});
		}

		// Filtro por urgencia
		if (urgencia !== 'Todas') {
			// TODO: Implementar urgencia cuando esté en el tipo
			// resultado = resultado.filter((p) => p.urgencia === urgencia);
		}

		// Filtro por provincia
		if (provincia !== 'Todas') {
			resultado = resultado.filter((p) => p.direccion?.localidad?.provincia?.nombre === provincia);
		}

		// Filtro por título o razón social
		if (searchQuery.trim() !== '') {
			const query = searchQuery.trim().toLowerCase();
			resultado = resultado.filter(
				(p) =>
					p.titulo.toLowerCase().includes(query) ||
					p.institucion?.nombre_legal?.toLowerCase().includes(query)
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

			const fechaA = new Date(a.created_at || '').getTime();
			const fechaB = new Date(b.created_at || '').getTime();
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
		filtroParticipacionSeleccionado = 'Todos';
		estadoSeleccionado = 'Todos';
		urgenciaSeleccionada = 'Todas';
		provinciaSeleccionada = 'Todas';
		searchQuery = writable('');
	}

	// Sincronizar el dropdown con el array de filtros
	$: {
		if (filtroParticipacionSeleccionado === 'Todos') {
			filtrosSeleccionados = ['Todos'];
		} else {
			filtrosSeleccionados = [filtroParticipacionSeleccionado];
		}
	}

	$: {
		proyectosVisibles = filtrarProyectos(
			proyectos,
			filtrosSeleccionados,
			$searchQuery,
			estadoSeleccionado,
			urgenciaSeleccionada,
			provinciaSeleccionada
		);
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-2 sm:px-10 lg:px-20">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-2 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">Proyectos Solidarios</h2>
	</div>

	<!-- Buscador -->
	<div class="animate-fade-in-up mx-auto mb-4 w-full max-w-xl">
		<SearchBar
			bind:value={searchQuery}
			placeholder="Buscar por título o institución..."
			ariaLabel="Campo de búsqueda de proyectos solidarios"
			autofocus={false}
		/>
	</div>

	<!-- Botón para mostrar/ocultar filtros -->
	<div class="animate-fade-in-up mb-4 text-center">
		<button
			on:click={() => (mostrarFiltros = !mostrarFiltros)}
			class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-gray-50"
		>
			<svg
				class="h-4 w-4 transition-transform duration-200"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
				/>
			</svg>
			{mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}
			<svg
				class={`h-4 w-4 transition-transform duration-200 ${mostrarFiltros ? 'rotate-180' : ''}`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	</div>

	<!-- Filtros -->
	{#if mostrarFiltros}
		<div
			class="animate-fade-in-up mb-4"
			in:fly={{ y: -20, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<div class="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
				<h4 class="mb-6 text-center text-lg font-semibold text-gray-800">Filtros</h4>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<!-- Filtro por Tipo de Participación -->
					<div>
						<label for="filtro-participacion" class="mb-3 block text-sm font-medium text-gray-700"
							>Tipo de participación</label
						>
						<select
							id="filtro-participacion"
							bind:value={filtroParticipacionSeleccionado}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						>
							{#each tiposParticipacion as tipo}
								<option value={tipo}>{tipo}</option>
							{/each}
						</select>
					</div>

					<!-- Filtro por Estado -->
					<div>
						<label for="filtro-estado" class="mb-3 block text-sm font-medium text-gray-700"
							>Estado del proyecto</label
						>
						<select
							id="filtro-estado"
							bind:value={estadoSeleccionado}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						>
							{#each estadosDisponibles as estado}
								<option value={estado}>{estado}</option>
							{/each}
						</select>
					</div>

					<!-- Filtro por Urgencia -->
					<div>
						<label for="filtro-urgencia" class="mb-3 block text-sm font-medium text-gray-700"
							>Urgencia</label
						>
						<select
							id="filtro-urgencia"
							bind:value={urgenciaSeleccionada}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						>
							{#each urgenciasDisponibles as urgencia}
								<option value={urgencia}>{urgencia}</option>
							{/each}
						</select>
					</div>

					<!-- Filtro por Provincia -->
					<div>
						<label for="filtro-provincia" class="mb-3 block text-sm font-medium text-gray-700"
							>Provincia</label
						>
						<select
							id="filtro-provincia"
							bind:value={provinciaSeleccionada}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						>
							{#each provinciasDisponibles as provincia}
								<option value={provincia}>{provincia}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Botón para limpiar todos los filtros -->
				<div class="mt-6 text-center">
					<button
						on:click={resetFiltros}
						class="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Limpiar todos los filtros
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Contador -->
	<div class="animate-fade-in-up mb-4 text-center text-sm text-gray-600">
		<p>
			Mostrando <strong>{proyectosVisibles.length}</strong> proyecto{proyectosVisibles.length !== 1
				? 's'
				: ''}
			de <strong>{proyectos.length}</strong> disponible{proyectos.length !== 1 ? 's' : ''}
		</p>

		<!-- Filtros activos -->
		{#if !filtrosSeleccionados.includes('Todos') || estadoSeleccionado !== 'Todos' || urgenciaSeleccionada !== 'Todas' || provinciaSeleccionada !== 'Todas'}
			<div class="mt-2 flex flex-wrap justify-center gap-2">
				<span class="text-xs text-gray-500">Filtros activos:</span>
				{#if !filtrosSeleccionados.includes('Todos')}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
					>
						Tipo: {filtrosSeleccionados.join(', ')}
					</span>
				{/if}
				{#if estadoSeleccionado !== 'Todos'}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
					>
						Estado: {estadoSeleccionado}
					</span>
				{/if}
				{#if urgenciaSeleccionada !== 'Todas'}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700"
					>
						Urgencia: {urgenciaSeleccionada}
					</span>
				{/if}
				{#if provinciaSeleccionada !== 'Todas'}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700"
					>
						Provincia: {provinciaSeleccionada}
					</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Lista de proyectos -->
	<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
		{#each proyectosVisibles as proyecto (proyecto.id_proyecto)}
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
				{#if $searchQuery.trim() !== ''}
					No se encontraron resultados para <strong>"{$searchQuery.trim()}"</strong>.
				{:else}
					Probá con otro tipo de participación o reiniciá los filtros.
				{/if}
			</p>
			<div class="flex justify-center">
				<Button
					label="Ver todos los proyectos"
					on:click={() => {
						resetFiltros();
						searchQuery.set('');
					}}
				/>
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
