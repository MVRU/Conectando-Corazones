<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Resena } from '$lib/domain/types/Resena';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	export let mostrar = false;
	export let modo: 'crear' | 'editar' = 'crear';
	export let resenaInicial: Resena | null = null;
	export let maxCaracteres = 500;

	const dispatch = createEventDispatcher<{
		guardar: { contenido: string; puntaje: number };
		cerrar: void;
	}>();

	let contenido = '';
	let puntaje = 5;

	$: if (mostrar) {
		contenido = resenaInicial?.contenido ?? '';
		puntaje = resenaInicial?.puntaje ?? 5;
	}

	$: caracteresUsados = contenido.length;
	$: excedeLimite = caracteresUsados > maxCaracteres;
	$: titulo = modo === 'editar' ? 'Editar reseña' : 'Escribir reseña';
	$: botonLabel = modo === 'editar' ? 'Guardar cambios' : 'Publicar reseña';

	function cerrar() {
		dispatch('cerrar');
	}

	function guardar() {
		if (excedeLimite || !contenido.trim()) return;
		dispatch('guardar', { contenido: contenido.trim(), puntaje });
		cerrar();
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
			<div class="relative mb-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-500 p-4 text-white">
				<button
					on:click={cerrar}
					aria-label="Cerrar modal"
					class="absolute top-3 right-3 rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
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
				<p class="text-xs font-semibold uppercase tracking-wide text-white/80">Reseñas del proyecto</p>
				<h3 class="mt-1 text-xl font-semibold">{titulo}</h3>
				<p class="mt-1 text-sm text-white/80">
					Tu opinión ayuda a mejorar futuras colaboraciones.
				</p>
			</div>

			<div class="rounded-xl bg-slate-50 p-4 text-sm text-gray-600">
				<p class="font-medium text-gray-800">Compartí tu reseña del proyecto.</p>
				<ul class="mt-2 list-disc space-y-1 pl-5">
					<li>Contá qué aportó el proyecto a la comunidad.</li>
					<li>Destacá aprendizajes o mejoras para próximas ediciones.</li>
					<li>Evitá datos sensibles o personales.</li>
				</ul>
			</div>

			<form on:submit|preventDefault={guardar} class="mt-6 space-y-6">
				<div>
					<fieldset>
						<legend class="mb-2 block text-sm font-medium text-gray-700">Puntaje</legend>
						<div class="flex items-center gap-1">
							{#each Array(5).keys() as i}
								<button
									type="button"
									on:click={() => (puntaje = i + 1)}
									class="h-8 w-8 {i < puntaje
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

				<div>
					<label for="contenido" class="mb-2 block text-sm font-medium text-gray-700">
						Reseña
					</label>
					<textarea
						id="contenido"
						bind:value={contenido}
						rows="5"
						maxlength={maxCaracteres}
						class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						placeholder="Contá tu experiencia..."
						required
					></textarea>
					<div class="mt-2 flex items-center justify-between text-xs text-gray-500">
						<span>{caracteresUsados}/{maxCaracteres} caracteres</span>
						{#if excedeLimite}
							<span class="text-red-600">Superaste el límite de caracteres.</span>
						{/if}
					</div>
				</div>

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
						label={botonLabel}
						variant="primary"
						size="md"
						type="submit"
						disabled={!contenido.trim() || excedeLimite}
						customClass="w-full md:w-auto"
					/>
				</div>
			</form>
		</div>
	</div>
{/if}
