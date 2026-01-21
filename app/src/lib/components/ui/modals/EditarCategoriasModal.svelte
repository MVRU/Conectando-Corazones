<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Categoria } from '$lib/domain/types/Categoria';
	import { mockCategorias } from '$lib/infrastructure/mocks/mock-categorias';
	import { obtenerIconoCategoria, crearValidadorCategoria } from '$lib/utils/util-proyecto-form';
	import { Icon } from '@steeze-ui/svelte-icon';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { toastStore } from '$lib/stores/toast';

	export let mostrar: boolean = false;
	export let categoriasSeleccionadas: Categoria[] = [];

	const dispatch = createEventDispatcher<{
		guardar: Categoria[];
		cerrar: void;
	}>();

	let categoriasMarcadas: Set<number> = new Set();
	let categoriaOtraDescripcion = '';
	let errorCategoriaOtra = '';
	let categoriaOtraTouched = false;
	let guardando = false;

	const { validarCategoriaOtraDescripcion } = crearValidadorCategoria(
		mockCategorias.map((c) => c.descripcion || '')
	);

	const idCategoriaOtra = mockCategorias.find(
		(c) => c.descripcion?.toLowerCase() === 'otro' || c.descripcion?.toLowerCase() === 'otra'
	)?.id_categoria;

	$: seleccionoOtra = idCategoriaOtra != null && categoriasMarcadas.has(idCategoriaOtra ?? -1);

	$: if (seleccionoOtra && categoriaOtraTouched) {
		const err = validarCategoriaOtraDescripcion(categoriaOtraDescripcion || '');
		if (err) {
			errorCategoriaOtra = err;
		} else {
			errorCategoriaOtra = '';
		}
	} else if (!seleccionoOtra) {
		errorCategoriaOtra = '';
		categoriaOtraDescripcion = '';
		categoriaOtraTouched = false;
	}

	// Inicializar categorías marcadas cuando cambian las seleccionadas
	$: if (categoriasSeleccionadas && categoriasSeleccionadas.length > 0) {
		categoriasMarcadas = new Set(
			categoriasSeleccionadas
				.map((cat) => cat.id_categoria)
				.filter((id): id is number => id !== undefined)
		);
	}

	function toggleCategoria(categoria: Categoria) {
		if (!categoria.id_categoria) return;

		const nuevoSet = new Set(categoriasMarcadas);

		if (nuevoSet.has(categoria.id_categoria)) {
			nuevoSet.delete(categoria.id_categoria);
		} else {
			nuevoSet.add(categoria.id_categoria);
		}

		categoriasMarcadas = nuevoSet; // Asignar nuevo Set para trigger reactivity
	}

	// Variable reactiva para calcular si una categoría está seleccionada
	// Se recalcula cuando cambia categoriasMarcadas
	$: categoriasMarcadasArray = Array.from(categoriasMarcadas);

	function estaSeleccionada(categoria: Categoria): boolean {
		return categoria.id_categoria !== undefined && categoriasMarcadas.has(categoria.id_categoria);
	}

	function cerrar() {
		dispatch('cerrar');
	}

	function guardar() {
		// Marcar como touched para mostrar validación si no se ha hecho
		if (seleccionoOtra) {
			categoriaOtraTouched = true;
			const err = validarCategoriaOtraDescripcion(categoriaOtraDescripcion || '');
			if (err) {
				errorCategoriaOtra = err;
				return;
			}
		}

		guardando = true;

		setTimeout(() => {
			let categoriasFinales = mockCategorias.filter(
				(cat) =>
					cat.id_categoria !== undefined &&
					categoriasMarcadas.has(cat.id_categoria) &&
					cat.id_categoria !== idCategoriaOtra // Excluir "Otra" de las finales
			);

			// Si seleccionó "Otra", agregar la categoría personalizada
			if (seleccionoOtra && categoriaOtraDescripcion.trim()) {
				categoriasFinales = [
					...categoriasFinales,
					{
						id_categoria: undefined, // Sin ID porque es personalizada
						descripcion: categoriaOtraDescripcion.trim()
					}
				];
			}

			console.log('Guardando categorías:', categoriasFinales);
			dispatch('guardar', categoriasFinales);

			toastStore.show({
				variant: 'success',
				title: 'Cambios guardados',
				message: 'Tus categorías favoritas se guardaron correctamente.'
			});

			guardando = false;
			cerrar();
		}, 500);
	}

	function abrir() {
		// Reinicializar cuando se abre el modal
		if (categoriasSeleccionadas && categoriasSeleccionadas.length > 0) {
			categoriasMarcadas = new Set(
				categoriasSeleccionadas
					.map((cat) => cat.id_categoria)
					.filter((id): id is number => id !== undefined)
			);
		} else {
			categoriasMarcadas = new Set();
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
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
		on:click={cerrar}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
			on:click|stopPropagation
		>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Editar Categorías Favoritas</h3>
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

			<p class="mb-4 text-sm text-gray-600">
				Seleccioná las categorías de proyectos que más te interesan. Podés seleccionar o quitar
				categorías haciendo clic en ellas.
			</p>

			<!-- Lista de categorías -->
			<div class="mb-6 max-h-[400px] overflow-y-auto">
				<div class="grid gap-3 sm:grid-cols-2">
					{#each mockCategorias as categoria}
						{@const seleccionada =
							categoria.id_categoria !== undefined &&
							categoriasMarcadas.has(categoria.id_categoria)}
						{@const _ = categoriasMarcadasArray}
						<!-- Force reactivity -->
						<button
							type="button"
							on:click={() => toggleCategoria(categoria)}
							class="group relative flex items-center gap-3 rounded-lg border p-3 text-left transition-all {seleccionada
								? 'border-blue-500 bg-blue-50'
								: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}"
						>
							<!-- Checkbox visual -->
							<div
								class="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors {seleccionada
									? 'border-blue-500 bg-blue-500'
									: 'border-gray-300 bg-white'}"
							>
								{#if seleccionada}
									<svg
										class="h-3 w-3 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="3"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								{/if}
							</div>

							<!-- Icono -->
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
								<Icon
									src={obtenerIconoCategoria(categoria.descripcion)}
									class="h-5 w-5 text-blue-600"
								/>
							</div>
							<!-- Nombre de la categoría -->
							<div class="flex-1">
								<span class="font-medium text-gray-900">{categoria.descripcion}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Campo para "Otra" categoría -->
			{#if seleccionoOtra}
				<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
					<label for="categoria-otra" class="mb-2 block text-sm font-medium text-gray-900">
						Específica la categoría:
					</label>
					<input
						type="text"
						id="categoria-otra"
						bind:value={categoriaOtraDescripcion}
						on:input={() => (categoriaOtraTouched = true)}
						on:blur={() => (categoriaOtraTouched = true)}
						placeholder="Ej: Derechos humanos, Deportes, etc."
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none {errorCategoriaOtra
							? 'border-red-500 bg-red-50'
							: 'bg-white'}"
					/>
					{#if errorCategoriaOtra}
						<p class="mt-2 text-sm text-red-600">{errorCategoriaOtra}</p>
					{/if}
					<p class="mt-2 text-xs text-gray-600">
						Ingresá una categoría que no esté en la lista. Debe tener al menos 3 caracteres y no
						puede repetirse.
					</p>
				</div>
			{/if}

			<!-- Contador de seleccionadas -->
			<div class="mb-6 rounded-lg bg-blue-50 p-3">
				<p class="text-sm text-blue-800">
					<span class="font-medium">{categoriasMarcadas.size}</span>
					categoría{categoriasMarcadas.size !== 1 ? 's' : ''} seleccionada{categoriasMarcadas.size !==
					1
						? 's'
						: ''}
				</p>
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
					label={guardando ? 'Guardando...' : 'Continuar'}
					variant="primary"
					size="md"
					type="button"
					disabled={(seleccionoOtra && errorCategoriaOtra !== '') || guardando}
					on:click={guardar}
					customClass="w-full md:w-auto"
				/>
			</div>
		</div>
	</div>
{/if}


