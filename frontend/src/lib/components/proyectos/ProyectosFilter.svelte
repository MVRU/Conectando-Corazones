<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Filter, ChevronDown, ChevronUp, Trash2 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';

	export let mostrar: boolean = false;
	export let participacion: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	export let tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	export let provincia: string = 'Todas';
	export let localidad: string = 'Todas';
	export let fechaDesde: string = '';
	export let fechaHasta: string = '';
	export let idPrefix: string = 'filter';

	export let provinciasDisponibles: string[] = [];
	export let localidadesDisponibles: string[] = [];
	export let tiposParticipacion: string[] = [];

	const dispatch = createEventDispatcher();

	function toggleFiltros() {
		dispatch('toggle');
	}

	function resetFiltros() {
		dispatch('reset');
	}

	function onUbicacionChange() {
		dispatch('ubicacionChange');
	}
</script>

<div class="animate-fade-in-up mb-4 text-center">
	<button
		on:click={toggleFiltros}
		class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-gray-50"
	>
		<Filter size={16} />
		{mostrar ? 'Ocultar filtros' : 'Mostrar filtros'}
		{#if mostrar}
			<ChevronUp size={16} />
		{:else}
			<ChevronDown size={16} />
		{/if}
	</button>
</div>

{#if mostrar}
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
						for="{idPrefix}-filtro-participacion"
						class="mb-3 block text-sm font-medium text-gray-700">Tipo de participación</label
					>
					<select
						id="{idPrefix}-filtro-participacion"
						bind:value={participacion}
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
						for="{idPrefix}-filtro-tipo-ubicacion"
						class="mb-3 block text-sm font-medium text-gray-700">Tipo de ubicación</label
					>
					<select
						id="{idPrefix}-filtro-tipo-ubicacion"
						bind:value={tipoUbicacion}
						on:change={onUbicacionChange}
						class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
					>
						<option value="Todas">Todas</option>
						<option value="Presencial">Presencial</option>
						<option value="Virtual">Virtual</option>
					</select>
				</div>

				<!-- Filtro por Provincia -->
				{#if tipoUbicacion === 'Presencial'}
					<div>
						<label
							for="{idPrefix}-filtro-provincia"
							class="mb-3 block text-sm font-medium text-gray-700">Provincia</label
						>
						<select
							id="{idPrefix}-filtro-provincia"
							bind:value={provincia}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						>
							{#each provinciasDisponibles as prov (prov)}
								<option value={prov}>{prov}</option>
							{/each}
						</select>
					</div>

					<!-- Filtro por Localidad -->
					<div>
						<label
							for="{idPrefix}-filtro-localidad"
							class="mb-3 block text-sm font-medium text-gray-700">Localidad</label
						>
						<select
							id="{idPrefix}-filtro-localidad"
							bind:value={localidad}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							disabled={provincia === 'Todas'}
						>
							{#each localidadesDisponibles as loc (loc)}
								<option value={loc}>{loc}</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Filtro por Fecha -->
				<div>
					<label for="{idPrefix}-fecha-desde" class="mb-3 block text-sm font-medium text-gray-700"
						>Fecha</label
					>
					<div class="space-y-2">
						<input
							id="{idPrefix}-fecha-desde"
							type="date"
							bind:value={fechaDesde}
							placeholder="Desde"
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						/>
						<input
							id="{idPrefix}-fecha-hasta"
							type="date"
							bind:value={fechaHasta}
							min={fechaDesde}
							placeholder="Hasta"
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						/>
					</div>
				</div>
			</div>

			<!-- Botón para limpiar filtros -->
			<div class="mt-6 text-center">
				<button
					on:click={resetFiltros}
					class="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
				>
					<Trash2 size={16} />
					Limpiar todos los filtros
				</button>
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
</style>
