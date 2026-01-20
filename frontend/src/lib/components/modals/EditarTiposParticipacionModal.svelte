<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TipoParticipacion, TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import { TIPOS_PARTICIPACION_DESCRIPCION } from '$lib/types/TipoParticipacion';
	import { INFO_TIPOS_PARTICIPACION } from '$lib/utils/constants';
	import { Icon } from '@steeze-ui/svelte-icon';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { toastStore } from '$lib/stores/toast';

	export let mostrar: boolean = false;
	export let tiposSeleccionados: TipoParticipacion[] = [];

	const dispatch = createEventDispatcher<{
		guardar: TipoParticipacion[];
		cerrar: void;
	}>();

	let tiposMarcados: Set<TipoParticipacionDescripcion> = new Set();
	let guardando = false;

	// Inicializar tipos marcados cuando cambian los seleccionados
	$: if (tiposSeleccionados && tiposSeleccionados.length > 0) {
		tiposMarcados = new Set(tiposSeleccionados.map(tipo => tipo.descripcion));
	}

	function toggleTipo(tipo: TipoParticipacionDescripcion) {
		const nuevoSet = new Set(tiposMarcados);
		
		if (nuevoSet.has(tipo)) {
			nuevoSet.delete(tipo);
		} else {
			nuevoSet.add(tipo);
		}
		
		tiposMarcados = nuevoSet;
	}

	// Variable reactiva para forzar actualizaciones
	$: tiposMarcadosArray = Array.from(tiposMarcados);
	
	function cerrar() {
		dispatch('cerrar');
	}

	function guardar() {
		guardando = true;

		setTimeout(() => {
			const tiposFinales: TipoParticipacion[] = Array.from(tiposMarcados).map(descripcion => ({
				descripcion
			}));
			console.log('Guardando tipos de participación:', tiposFinales);
			dispatch('guardar', tiposFinales);
			
			toastStore.show({
				variant: 'success',
				title: 'Cambios guardados',
				message: 'Tus tipos de participacion favoritos se guardaron correctamente.'
			});
			
			guardando = false;
			cerrar();
		}, 500);
	}

	function abrir() {
		// Reinicializar cuando se abre el modal
		if (tiposSeleccionados && tiposSeleccionados.length > 0) {
			tiposMarcados = new Set(tiposSeleccionados.map(tipo => tipo.descripcion));
		} else {
			tiposMarcados = new Set();
		}
	}

	// Abrir modal cuando mostrar cambia a true
	$: if (mostrar) {
		abrir();
	}
</script>

{#if mostrar}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" on:click={cerrar}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" on:click|stopPropagation>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Editar Tipos de Participación Favoritas</h3>
				<button
					on:click={cerrar}
					aria-label="Cerrar modal"
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<p class="mb-4 text-sm text-gray-600">
				Seleccioná las formas en las que preferís participar en proyectos. Podés seleccionar o quitar opciones haciendo clic en ellas.
			</p>

			<!-- Lista de tipos de participación -->
			<div class="mb-6">
				<div class="grid gap-3">
					{#each TIPOS_PARTICIPACION_DESCRIPCION as tipo}
						{@const seleccionado = tiposMarcados.has(tipo)}
						{@const _ = tiposMarcadosArray} <!-- Force reactivity -->
						{@const info = INFO_TIPOS_PARTICIPACION[tipo]}
						<button
							type="button"
							on:click={() => toggleTipo(tipo)}
							class="group relative flex items-center gap-4 rounded-lg border p-4 text-left transition-all {seleccionado
								? 'border-blue-500 bg-blue-50'
								: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}"
						>
							<!-- Checkbox visual -->
							<div class="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors {seleccionado
								? 'border-blue-500 bg-blue-500'
								: 'border-gray-300 bg-white'}">
								{#if seleccionado}
									<svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
									</svg>
								{/if}
							</div>
							
							<!-- Icono -->
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-{info.color}-50">
								<Icon src={info.icon} class="h-6 w-6 text-{info.color}-600" />
							</div>
							
							<!-- Información -->
							<div class="flex-1">
								<h4 class="font-medium text-gray-900">{info.titulo}</h4>
								<p class="text-sm text-gray-500">{info.descripcion}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Contador de seleccionados -->
			<div class="mb-6 rounded-lg {tiposMarcados.size === 0 ? 'bg-red-50' : 'bg-blue-50'} p-3">
				<p class="text-sm {tiposMarcados.size === 0 ? 'text-red-800' : 'text-blue-800'}">
					<span class="font-medium">{tiposMarcados.size}</span> tipo{tiposMarcados.size !== 1 ? 's' : ''} de participación seleccionado{tiposMarcados.size !== 1 ? 's' : ''}
					{#if tiposMarcados.size === 0}
						- Debés seleccionar al menos un tipo
					{/if}
				</p>
			</div>

			<!-- Botones de acción -->
		<div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
			<Button
				label="Cancelar"
				variant="secondary"
				size="md"
				type="button"
				on:click={cerrar}
				customClass="w-full md:w-auto"
			/>
			<Button
				label={guardando ? 'Guardando...' : 'Continuar'}
				variant="primary"
				size="md"
				type="button"
				disabled={tiposMarcados.size === 0 || guardando}
				on:click={guardar}
				customClass="w-full md:w-auto"
			/>
		</div>
	</div>
</div>
{/if}
