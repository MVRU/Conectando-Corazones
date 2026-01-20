<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Resena } from '$lib/types/Resena';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	export let mostrar: boolean = false;
	export let titulo: string = 'Añadir Reseña';
	export let placeholder: string = 'Comparte tu experiencia...';
	export let tipoObjeto: string = 'usuario';
	export let idObjeto: number | undefined = undefined;

	const dispatch = createEventDispatcher<{
		guardar: Resena;
		cerrar: void;
	}>();

	let nuevaResena = { contenido: '', puntaje: 5 };

	function abrir() {
		nuevaResena = { contenido: '', puntaje: 5 };
	}

	function cerrar() {
		dispatch('cerrar');
	}

	function guardar() {
		const resena: Resena = {
			contenido: nuevaResena.contenido.trim(),
			puntaje: nuevaResena.puntaje,
			tipo_objeto: tipoObjeto,
			id_objeto: idObjeto
		};
		dispatch('guardar', resena);
		cerrar();
	}

	// Abrir modal cuando mostrar cambia a true
	$: if (mostrar) {
		abrir();
	}
</script>

{#if mostrar}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
		on:click={cerrar}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
			on:click|stopPropagation
		>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">{titulo}</h3>
				<button
					on:click={cerrar}
					aria-label="Cerrar modal"
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={guardar} class="space-y-6">
				<!-- Puntaje -->
				<div>
					<fieldset>
						<legend class="mb-2 block text-sm font-medium text-gray-700">Puntaje</legend>
						<div class="flex items-center gap-1">
							{#each Array(5).keys() as i}
								<button
									type="button"
									on:click={() => (nuevaResena.puntaje = i + 1)}
									class="h-8 w-8 {i < nuevaResena.puntaje
										? 'text-amber-400'
										: 'text-gray-300'} transition-colors hover:text-amber-400"
									aria-label="Puntaje {i + 1} de 5"
								>
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z"
										/>
									</svg>
								</button>
							{/each}
						</div>
					</fieldset>
				</div>

				<!-- Contenido -->
				<div>
					<label for="contenido" class="mb-2 block text-sm font-medium text-gray-700">Reseña</label>
					<textarea
						id="contenido"
						bind:value={nuevaResena.contenido}
						rows="4"
						{placeholder}
						class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						required
					></textarea>
				</div>

				<!-- Botones de acción -->
				<div class="flex justify-end gap-4 border-t border-gray-200 pt-6">
					<Button
						label="Cancelar"
						variant="secondary"
						size="md"
						type="button"
						on:click={cerrar}
						customClass="w-full md:w-auto"
					/>
					<Button
						label="Publicar Reseña"
						variant="primary"
						size="md"
						type="submit"
						disabled={!nuevaResena.contenido.trim()}
						customClass="w-full md:w-auto"
					/>
				</div>
			</form>
		</div>
	</div>
{/if}
