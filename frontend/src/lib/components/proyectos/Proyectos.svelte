<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import { mockProyectos as defaultProyectos } from '$lib/mocks/mock-proyectos';
	import { fade, fly } from 'svelte/transition';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import SearchBar from '$lib/components/ui/elementos/SearchBar.svelte';
	import { writable } from 'svelte/store';
	import { getProvinciaFromLocalidad } from '$lib/utils/util-ubicaciones';
	import { filtrarProyectos } from '$lib/utils/util-proyectos';
	import { ESTADO_LABELS } from '$lib/types/Estado';
	import {
		TIPO_PARTICIPACION_LABELS,
		type TipoParticipacionDescripcion
	} from '$lib/types/TipoParticipacion';
	import { usuario } from '$lib/stores/auth';

	let searchQuery = writable('');

	const tiposParticipacion: ('Todos' | TipoParticipacionDescripcion)[] = [
		'Todos',
		...(Object.keys(TIPO_PARTICIPACION_LABELS) as TipoParticipacionDescripcion[])
	];

	const estadosDisponibles = ['Todos', ...Object.values(ESTADO_LABELS)];

	let provinciasDisponibles: string[] = [];
	let filtrosSeleccionados: (TipoParticipacionDescripcion | 'Todos')[] = ['Todos'];
	let filtroParticipacionSeleccionado: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let estadoSeleccionado = 'Todos';
	let provinciaSeleccionada = 'Todas';
	let mostrarFiltros = false;

	export let proyectos: Proyecto[] = defaultProyectos;
	let proyectosVisibles: Proyecto[] = [];

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

	function resetFiltros() {
		filtrosSeleccionados = ['Todos'];
		filtroParticipacionSeleccionado = 'Todos';
		estadoSeleccionado = 'Todos';
		provinciaSeleccionada = 'Todas';
		searchQuery.set('');
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
			provinciaSeleccionada
		);
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-2 sm:px-10 lg:px-20">
	<!-- Encabezado -->
	<div class="animate-fade-in-up relative mb-2 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">Proyectos Solidarios</h2>
		
		{#if $usuario}
			<a
				href="/mis-proyectos"
				class="absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-3 rounded-4xl bg-[#007fff] px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-[#0066cc] lg:inline-flex"
			>
				Mis Proyectos
				<span class="text-xl">›</span>
			</a>
		{/if}
	</div>

	<!-- Buscador -->
	<div class="animate-fade-in-up mx-auto mb-4 w-full max-w-xl">
		<SearchBar
			bind:value={$searchQuery}
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

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
							{#each tiposParticipacion as tipo (tipo)}
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
							{#each estadosDisponibles as estado (estado)}
								<option value={estado}>{estado}</option>
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
							{#each provinciasDisponibles as provincia (provincia)}
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
		{#if !filtrosSeleccionados.includes('Todos') || estadoSeleccionado !== 'Todos' || provinciaSeleccionada !== 'Todas'}
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
	<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
		{#each proyectosVisibles as proyecto (proyecto.id_proyecto)}
			<div
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 150 }}
				class="transition-transform hover:scale-[1.02]"
			>
				<ProyectoCard {proyecto} mostrarBotones={true} />
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
				<Button label="Ver todos los proyectos" on:click={resetFiltros} />
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
