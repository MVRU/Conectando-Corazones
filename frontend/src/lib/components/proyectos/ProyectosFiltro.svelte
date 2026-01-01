<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Filter, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';

	export let mostrar: boolean = false;
	export let participacion: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	export let categoria: string = 'Todas';
	export let categoriasDisponibles: string[] = ['Todas'];
	export let tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	export let provincia: string = 'Todas';
	export let localidad: string = 'Todas';
	export let fechaDesde: string = '';
	export let fechaHasta: string = '';
	export let prefijoId: string = 'filter';

	// Filtro de Estado
	export let mostrarEstado: boolean = false;
	export let estado: string = 'Todos';
	export let estadosDisponibles: string[] = [];

	export let provinciasDisponibles: string[] = [];
	export let localidadesDisponibles: string[] = [];
	export let tiposParticipacion: string[] = [];

	export let criterioOrden: 'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso' =
		'recientes';

	const dispatch = createEventDispatcher();

	function alternarFiltros() {
		dispatch('toggle');
	}

	function restablecerFiltros() {
		dispatch('reset');
	}

	function manejarCambioUbicacion() {
		dispatch('ubicacionChange');
	}

	$: filtrosActivos = [
		participacion !== 'Todos',
		categoria !== 'Todas',
		tipoUbicacion !== 'Todas',
		provincia !== 'Todas',
		localidad !== 'Todas',
		fechaDesde !== '',
		fechaHasta !== '',
		mostrarEstado && estado !== 'Todos'
	].filter(Boolean).length;
</script>

<div class="animate-fade-in-up mb-4 flex flex-wrap justify-center gap-3">
	<!-- Dropdown de Ordenamiento -->
	<div class="relative">
		<select
			bind:value={criterioOrden}
			class="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
			aria-label="Ordenar proyectos"
		>
			<option value="recientes">Más recientes</option>
			<option value="antiguos">Más antiguos</option>
			<option value="mayor_progreso">Mayor progreso</option>
			<option value="menor_progreso">Menor progreso</option>
		</select>
	</div>

	<button
		on:click={alternarFiltros}
		class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-gray-50"
	>
		{mostrar ? 'Ocultar filtros' : 'Mostrar filtros'}
		{#if filtrosActivos > 0}
			<span
				class="bg-primary hover:bg-primary-dark ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm"
			>
				{filtrosActivos}
			</span>
		{/if}
		{#if mostrar}
			<ChevronUp size={16} />
		{:else}
			<ChevronDown size={16} />
		{/if}
	</button>
</div>

{#if mostrar}
	<div
		class="animate-fade-in-up mb-6"
		in:fly={{ y: -10, duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		<div class="rounded-xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-100/50">
			<div class="mb-5 flex items-center justify-between">
				<h4 class="text-base font-semibold text-gray-800">Filtrar proyectos</h4>
				<button
					on:click={restablecerFiltros}
					class="text-xs font-medium text-red-500 hover:text-red-600 hover:underline disabled:opacity-50"
				>
					Limpiar todo
				</button>
			</div>

			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
				<!-- Filtro por Tipo de Participación -->
				<div class="flex flex-col gap-1.5">
					<label
						for="{prefijoId}-filtro-participacion"
						class="text-xs font-medium uppercase tracking-wide text-gray-500"
					>
						Tipo de participación
					</label>
					<div class="relative">
						<select
							id="{prefijoId}-filtro-participacion"
							bind:value={participacion}
							class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
						>
							{#each tiposParticipacion as tipo (tipo)}
								<option value={tipo}>{tipo}</option>
							{/each}
						</select>
						<ChevronDown
							class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
					</div>
				</div>

				<!-- Filtro por Categoría -->
				<div class="flex flex-col gap-1.5">
					<label
						for="{prefijoId}-filtro-categoria"
						class="text-xs font-medium uppercase tracking-wide text-gray-500"
					>
						Categoría
					</label>
					<div class="relative">
						<select
							id="{prefijoId}-filtro-categoria"
							bind:value={categoria}
							class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
						>
							{#each categoriasDisponibles as cat (cat)}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
						<ChevronDown
							class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
					</div>
				</div>

				<!-- Filtro por Tipo de Ubicación -->
				<div class="flex flex-col gap-1.5">
					<label
						for="{prefijoId}-filtro-tipo-ubicacion"
						class="text-xs font-medium uppercase tracking-wide text-gray-500"
					>
						Ubicación
					</label>
					<div class="relative">
						<select
							id="{prefijoId}-filtro-tipo-ubicacion"
							bind:value={tipoUbicacion}
							on:change={manejarCambioUbicacion}
							class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
						>
							<option value="Todas">Todas</option>
							<option value="Presencial">Presencial</option>
							<option value="Virtual">Virtual</option>
						</select>
						<ChevronDown
							class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
					</div>
				</div>

				<!-- Filtros dinámicos de ubicación (Provincia/Localidad) -->
				{#if tipoUbicacion === 'Presencial'}
					<!-- Provincia -->
					<div class="flex flex-col gap-1.5" in:fade={{ duration: 150 }}>
						<label
							for="{prefijoId}-filtro-provincia"
							class="text-xs font-medium uppercase tracking-wide text-gray-500"
						>
							Provincia
						</label>
						<div class="relative">
							<select
								id="{prefijoId}-filtro-provincia"
								bind:value={provincia}
								class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
							>
								{#each provinciasDisponibles as prov (prov)}
									<option value={prov}>{prov}</option>
								{/each}
							</select>
							<ChevronDown
								class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={16}
							/>
						</div>
					</div>

					<!-- Localidad -->
					<div class="flex flex-col gap-1.5" in:fade={{ duration: 150 }}>
						<label
							for="{prefijoId}-filtro-localidad"
							class="text-xs font-medium uppercase tracking-wide text-gray-500"
						>
							Localidad
						</label>
						<div class="relative">
							<select
								id="{prefijoId}-filtro-localidad"
								bind:value={localidad}
								disabled={provincia === 'Todas'}
								class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#each localidadesDisponibles as loc (loc)}
									<option value={loc}>{loc}</option>
								{/each}
							</select>
							<ChevronDown
								class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={16}
							/>
						</div>
					</div>
				{/if}

				<!-- Filtro por Estado (Opcional) -->
				{#if mostrarEstado}
					<div class="flex flex-col gap-1.5">
						<label
							for="{prefijoId}-filtro-estado"
							class="text-xs font-medium uppercase tracking-wide text-gray-500"
						>
							Estado
						</label>
						<div class="relative">
							<select
								id="{prefijoId}-filtro-estado"
								bind:value={estado}
								class="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
							>
								{#each estadosDisponibles as est (est)}
									<option value={est}>{est}</option>
								{/each}
							</select>
							<ChevronDown
								class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={16}
							/>
						</div>
					</div>
				{/if}

				<!-- Filtro por Fecha -->
				<div class="flex flex-col gap-1.5 {tipoUbicacion !== 'Presencial' ? 'lg:col-span-2' : ''}">
					<label
						for="{prefijoId}-fecha-desde"
						class="text-xs font-medium uppercase tracking-wide text-gray-500"
					>
						Rango de Fechas
					</label>
					<div class="flex items-center gap-2">
						<div class="relative flex-1">
							<input
								id="{prefijoId}-fecha-desde"
								type="date"
								bind:value={fechaDesde}
								class="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
							/>
						</div>
						<span class="text-gray-400">-</span>
						<div class="relative flex-1">
							<input
								id="{prefijoId}-fecha-hasta"
								type="date"
								bind:value={fechaHasta}
								min={fechaDesde}
								class="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

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
	select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		padding-right: 2.5rem;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
</style>
