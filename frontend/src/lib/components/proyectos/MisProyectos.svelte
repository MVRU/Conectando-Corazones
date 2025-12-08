<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Usuario } from '$lib/types/Usuario';
	import { mockProyectos as proyectosPorDefecto } from '$lib/mocks/mock-proyectos';
	import { fade, fly } from 'svelte/transition';
	import MisProyectoCard from '$lib/components/ui/cards/MisProyectoCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import SearchBar from '$lib/components/ui/elementos/SearchBar.svelte';
	import { writable } from 'svelte/store';
	import {
		getProvinciaFromLocalidad,
		obtenerProvinciasDisponibles,
		obtenerLocalidadesDisponibles,
		filtrarPorLocalidad
	} from '$lib/utils/util-ubicaciones';
	import {
		filtrarProyectos,
		filtrarProyectosPorUsuario,
		filtrarPorTipoUbicacion,
		filtrarPorRangoFechas
	} from '$lib/utils/util-proyectos';
	import {
		TIPO_PARTICIPACION_LABELS,
		type TipoParticipacionDescripcion
	} from '$lib/types/TipoParticipacion';
	import type { EstadoDescripcion } from '$lib/types/Estado';

	export let proyectos: Proyecto[] = proyectosPorDefecto;
	export let usuario: Usuario | null = null;

	// Estados independientes para cada sección
	let searchQueryActivos = writable('');
	let searchQueryHistorial = writable('');

	const tiposParticipacion: ('Todos' | TipoParticipacionDescripcion)[] = [
		'Todos',
		...(Object.keys(TIPO_PARTICIPACION_LABELS) as TipoParticipacionDescripcion[])
	];

	// Sección Proyectos Activos
	let mostrarFiltrosActivos = false;
	let filtroParticipacionActivos: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let tipoUbicacionActivos: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	let provinciaSeleccionadaActivos = 'Todas';
	let localidadSeleccionadaActivos = 'Todas';
	let fechaDesdeActivos = '';
	let fechaHastaActivos = '';

	// Sección Historial
	let mostrarFiltrosHistorial = false;
	let filtroParticipacionHistorial: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let tipoUbicacionHistorial: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	let provinciaSeleccionadaHistorial = 'Todas';
	let localidadSeleccionadaHistorial = 'Todas';
	let fechaDesdeHistorial = '';
	let fechaHastaHistorial = '';

	// Estados para filtrar proyectos
	const estadosActivos: EstadoDescripcion[] = [
		'en_curso',
		'pendiente_solicitud_cierre',
		'en_revision',
		'en_auditoria'
	];
	const estadoCompletado: EstadoDescripcion = 'completado';

	// Filtrar proyectos según el rol del usuario
	$: proyectosDelUsuario = filtrarProyectosPorUsuario(proyectos, usuario);

	// Filtrar proyectos por estado
	$: proyectosActivos = proyectosDelUsuario.filter(
		(p) => p.estado && estadosActivos.includes(p.estado)
	);
	$: proyectosHistorial = proyectosDelUsuario.filter((p) => p.estado === estadoCompletado);

	// Provincias disponibles para cada sección
	$: provinciasActivosDisponibles = obtenerProvinciasDisponibles(proyectosActivos);

	$: provinciasHistorialDisponibles = obtenerProvinciasDisponibles(proyectosHistorial);

	// Localidades filtradas por provincia seleccionada
	$: localidadesActivosDisponibles = obtenerLocalidadesDisponibles(
		proyectosActivos,
		provinciaSeleccionadaActivos
	);

	$: localidadesHistorialDisponibles = obtenerLocalidadesDisponibles(
		proyectosHistorial,
		provinciaSeleccionadaHistorial
	);

	// Proyectos visibles con filtros aplicados
	$: proyectosActivosVisibles = aplicarFiltrosAdicionales(
		filtrarProyectos(
			proyectosActivos,
			[filtroParticipacionActivos],
			$searchQueryActivos,
			'Todos',
			provinciaSeleccionadaActivos
		),
		tipoUbicacionActivos,
		localidadSeleccionadaActivos,
		fechaDesdeActivos,
		fechaHastaActivos
	);

	$: proyectosHistorialVisibles = aplicarFiltrosAdicionales(
		filtrarProyectos(
			proyectosHistorial,
			[filtroParticipacionHistorial],
			$searchQueryHistorial,
			'Todos',
			provinciaSeleccionadaHistorial
		),
		tipoUbicacionHistorial,
		localidadSeleccionadaHistorial,
		fechaDesdeHistorial,
		fechaHastaHistorial
	);

	function aplicarFiltrosAdicionales(
		proyectosList: Proyecto[],
		tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual',
		localidad: string,
		fechaDesde: string,
		fechaHasta: string
	): Proyecto[] {
		let resultado = proyectosList;

		// Filtrar por tipo de ubicación
		resultado = filtrarPorTipoUbicacion(resultado, tipoUbicacion);

		// Filtrar por localidad
		resultado = filtrarPorLocalidad(resultado, localidad, tipoUbicacion);

		// Filtrar por rango de fechas
		resultado = filtrarPorRangoFechas(resultado, fechaDesde, fechaHasta);

		return resultado;
	}

	function resetFiltrosActivos() {
		filtroParticipacionActivos = 'Todos';
		tipoUbicacionActivos = 'Todas';
		provinciaSeleccionadaActivos = 'Todas';
		localidadSeleccionadaActivos = 'Todas';
		fechaDesdeActivos = '';
		fechaHastaActivos = '';
		searchQueryActivos.set('');
	}

	function resetFiltrosHistorial() {
		filtroParticipacionHistorial = 'Todos';
		tipoUbicacionHistorial = 'Todas';
		provinciaSeleccionadaHistorial = 'Todas';
		localidadSeleccionadaHistorial = 'Todas';
		fechaDesdeHistorial = '';
		fechaHastaHistorial = '';
		searchQueryHistorial.set('');
	}

	// Reset localidad cuando cambia provincia
	$: if (provinciaSeleccionadaActivos) {
		localidadSeleccionadaActivos = 'Todas';
	}

	$: if (provinciaSeleccionadaHistorial) {
		localidadSeleccionadaHistorial = 'Todas';
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-8 sm:px-10 lg:px-20">
	<!-- SECCIÓN: PROYECTOS ACTIVOS -->
	<div class="mb-16">
		<!-- Encabezado -->
		<div class="animate-fade-in-up mb-6 text-center">
			<h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">Proyectos Activos</h2>
		</div>

		<!-- Buscador -->
		<div class="animate-fade-in-up mx-auto mb-4 w-full max-w-xl">
			<SearchBar
				bind:value={searchQueryActivos}
				placeholder="Buscar por título o institución..."
				ariaLabel="Campo de búsqueda de proyectos activos"
				autofocus={false}
			/>
		</div>

		<!-- Botón para mostrar/ocultar filtros -->
		<div class="animate-fade-in-up mb-4 text-center">
			<button
				on:click={() => (mostrarFiltrosActivos = !mostrarFiltrosActivos)}
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
				{mostrarFiltrosActivos ? 'Ocultar filtros' : 'Mostrar filtros'}
				<svg
					class={`h-4 w-4 transition-transform duration-200 ${mostrarFiltrosActivos ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>

		<!-- Filtros Activos -->
		{#if mostrarFiltrosActivos}
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
							<label
								for="filtro-participacion-activos"
								class="mb-3 block text-sm font-medium text-gray-700">Tipo de participación</label
							>
							<select
								id="filtro-participacion-activos"
								bind:value={filtroParticipacionActivos}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							>
								{#each tiposParticipacion as tipo (tipo)}
									<option value={tipo}>{tipo}</option>
								{/each}
							</select>
						</div>

						<!-- Filtro por Tipo de Ubicación -->
						<div>
							<label
								for="filtro-tipo-ubicacion-activos"
								class="mb-3 block text-sm font-medium text-gray-700">Tipo de ubicación</label
							>
							<select
								id="filtro-tipo-ubicacion-activos"
								bind:value={tipoUbicacionActivos}
								on:change={() => {
									provinciaSeleccionadaActivos = 'Todas';
									localidadSeleccionadaActivos = 'Todas';
								}}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							>
								<option value="Todas">Todas</option>
								<option value="Presencial">Presencial</option>
								<option value="Virtual">Virtual</option>
							</select>
						</div>

						<!-- Filtro por Provincia -->
						{#if tipoUbicacionActivos === 'Presencial'}
							<div>
								<label
									for="filtro-provincia-activos"
									class="mb-3 block text-sm font-medium text-gray-700">Provincia</label
								>
								<select
									id="filtro-provincia-activos"
									bind:value={provinciaSeleccionadaActivos}
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								>
									{#each provinciasActivosDisponibles as provincia (provincia)}
										<option value={provincia}>{provincia}</option>
									{/each}
								</select>
							</div>

							<!-- Filtro por Localidad -->
							<div>
								<label
									for="filtro-localidad-activos"
									class="mb-3 block text-sm font-medium text-gray-700">Localidad</label
								>
								<select
									id="filtro-localidad-activos"
									bind:value={localidadSeleccionadaActivos}
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
									disabled={provinciaSeleccionadaActivos === 'Todas'}
								>
									{#each localidadesActivosDisponibles as localidad (localidad)}
										<option value={localidad}>{localidad}</option>
									{/each}
								</select>
							</div>
						{/if}

						<!-- Filtro por Fecha -->
						<div>
							<label for="fecha-desde-activos" class="mb-3 block text-sm font-medium text-gray-700"
								>Fecha</label
							>
							<div class="space-y-2">
								<input
									id="fecha-desde-activos"
									type="date"
									bind:value={fechaDesdeActivos}
									placeholder="Desde"
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								/>
							<input
								id="fecha-hasta-activos"
								type="date"
								bind:value={fechaHastaActivos}
								min={fechaDesdeActivos}
								placeholder="Hasta"
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
							</div>
						</div>
					</div>

					<!-- Botón para limpiar filtros -->
					<div class="mt-6 text-center">
						<button
							on:click={resetFiltrosActivos}
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
				Mostrando <strong>{proyectosActivosVisibles.length}</strong> proyecto{proyectosActivosVisibles.length !==
				1
					? 's'
					: ''} activo{proyectosActivosVisibles.length !== 1 ? 's' : ''}
			</p>
		</div>

		<!-- Lista de proyectos activos -->
		<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
			{#each proyectosActivosVisibles as proyecto (proyecto.id_proyecto)}
				<div
					in:fly={{ y: 20, duration: 300 }}
					out:fade={{ duration: 150 }}
					class="transition-transform hover:scale-[1.02]"
				>
					<MisProyectoCard 
						{proyecto} 
						esInstitucion={usuario?.rol === 'institucion'}
						esProyectoCompletado={false}
					/>
				</div>
			{/each}
		</div>

		<!-- Sin resultados -->
		{#if proyectosActivosVisibles.length === 0}
			<div class="animate-fade-in-up py-24 text-center">
				<h3 class="mb-4 text-xl font-semibold text-gray-800">No hay proyectos activos</h3>
				<p class="mx-auto mb-6 max-w-xl text-gray-600">
					{#if $searchQueryActivos.trim() !== ''}
						No se encontraron resultados para <strong>"{$searchQueryActivos.trim()}"</strong>.
					{:else}
						No tenés proyectos activos en este momento.
					{/if}
				</p>
				<div class="flex justify-center">
					<Button label="Limpiar filtros" on:click={resetFiltrosActivos} />
				</div>
			</div>
		{/if}
	</div>

	<!-- SECCIÓN: HISTORIAL -->
	<div class="border-t border-gray-200 pt-16">
		<!-- Encabezado -->
		<div class="animate-fade-in-up mb-6 text-center">
			<h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">Historial</h2>
		</div>

		<!-- Buscador -->
		<div class="animate-fade-in-up mx-auto mb-4 w-full max-w-xl">
			<SearchBar
				bind:value={searchQueryHistorial}
				placeholder="Buscar por título o institución..."
				ariaLabel="Campo de búsqueda de historial de proyectos"
				autofocus={false}
			/>
		</div>

		<!-- Botón para mostrar/ocultar filtros -->
		<div class="animate-fade-in-up mb-4 text-center">
			<button
				on:click={() => (mostrarFiltrosHistorial = !mostrarFiltrosHistorial)}
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
				{mostrarFiltrosHistorial ? 'Ocultar filtros' : 'Mostrar filtros'}
				<svg
					class={`h-4 w-4 transition-transform duration-200 ${mostrarFiltrosHistorial ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>

		<!-- Filtros Historial -->
		{#if mostrarFiltrosHistorial}
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
							<label
								for="filtro-participacion-historial"
								class="mb-3 block text-sm font-medium text-gray-700">Tipo de participación</label
							>
							<select
								id="filtro-participacion-historial"
								bind:value={filtroParticipacionHistorial}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							>
								{#each tiposParticipacion as tipo (tipo)}
									<option value={tipo}>{tipo}</option>
								{/each}
							</select>
						</div>

						<!-- Filtro por Tipo de Ubicación -->
						<div>
							<label
								for="filtro-tipo-ubicacion-historial"
								class="mb-3 block text-sm font-medium text-gray-700">Tipo de ubicación</label
							>
							<select
								id="filtro-tipo-ubicacion-historial"
								bind:value={tipoUbicacionHistorial}
								on:change={() => {
									provinciaSeleccionadaHistorial = 'Todas';
									localidadSeleccionadaHistorial = 'Todas';
								}}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							>
								<option value="Todas">Todas</option>
								<option value="Presencial">Presencial</option>
								<option value="Virtual">Virtual</option>
							</select>
						</div>

						<!-- Filtro por Provincia -->
						{#if tipoUbicacionHistorial === 'Presencial'}
							<div>
								<label
									for="filtro-provincia-historial"
									class="mb-3 block text-sm font-medium text-gray-700">Provincia</label
								>
								<select
									id="filtro-provincia-historial"
									bind:value={provinciaSeleccionadaHistorial}
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								>
									{#each provinciasHistorialDisponibles as provincia (provincia)}
										<option value={provincia}>{provincia}</option>
									{/each}
								</select>
							</div>

							<!-- Filtro por Localidad -->
							<div>
								<label
									for="filtro-localidad-historial"
									class="mb-3 block text-sm font-medium text-gray-700">Localidad</label
								>
								<select
									id="filtro-localidad-historial"
									bind:value={localidadSeleccionadaHistorial}
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
									disabled={provinciaSeleccionadaHistorial === 'Todas'}
								>
									{#each localidadesHistorialDisponibles as localidad (localidad)}
										<option value={localidad}>{localidad}</option>
									{/each}
								</select>
							</div>
						{/if}

						<!-- Filtro por Fecha -->
						<div>
							<label for="fecha-desde-historial" class="mb-3 block text-sm font-medium text-gray-700"
								>Fecha</label
							>
							<div class="space-y-2">
								<input
									id="fecha-desde-historial"
									type="date"
									bind:value={fechaDesdeHistorial}
									placeholder="Desde"
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								/>
							<input
								id="fecha-hasta-historial"
								type="date"
								bind:value={fechaHastaHistorial}
								min={fechaDesdeHistorial}
								placeholder="Hasta"
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
							</div>
						</div>
					</div>

					<!-- Botón para limpiar filtros -->
					<div class="mt-6 text-center">
						<button
							on:click={resetFiltrosHistorial}
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
				Mostrando <strong>{proyectosHistorialVisibles.length}</strong> proyecto{proyectosHistorialVisibles.length !==
				1
					? 's'
					: ''} completado{proyectosHistorialVisibles.length !== 1 ? 's' : ''}
			</p>
		</div>

		<!-- Lista de proyectos historial -->
		<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
			{#each proyectosHistorialVisibles as proyecto (proyecto.id_proyecto)}
				<div
					in:fly={{ y: 20, duration: 300 }}
					out:fade={{ duration: 150 }}
					class="transition-transform hover:scale-[1.02]"
				>
					<MisProyectoCard 
						{proyecto} 
						esInstitucion={usuario?.rol === 'institucion'}
						esProyectoCompletado={true}
					/>
				</div>
			{/each}
		</div>

		<!-- Sin resultados -->
		{#if proyectosHistorialVisibles.length === 0}
			<div class="animate-fade-in-up py-24 text-center">
				<h3 class="mb-4 text-xl font-semibold text-gray-800">No hay proyectos en el historial</h3>
				<p class="mx-auto mb-6 max-w-xl text-gray-600">
					{#if $searchQueryHistorial.trim() !== ''}
						No se encontraron resultados para <strong>"{$searchQueryHistorial.trim()}"</strong>.
					{:else}
						Aún no tenés proyectos completados.
					{/if}
				</p>
				<div class="flex justify-center">
					<Button label="Limpiar filtros" on:click={resetFiltrosHistorial} />
				</div>
			</div>
		{/if}
	</div>
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
