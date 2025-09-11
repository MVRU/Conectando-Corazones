<!--
 * * Componente: ProyectoInfoBasica
 * -!- Sección de información básica y categorías del form de proyecto.
 -->
<script lang="ts">
	import { mockCategorias } from '$lib/mocks/mock-categorias';
	import {
		MAX_BENEFICIARIOS,
		formatearFechaLarga,
		obtenerIconoCategoria,
		capitalizarPrimera,
		normalizarTitulo,
		validarTituloProyecto
	} from '$lib/utils/util-proyecto-form';

	export let titulo = '';
	export let descripcion = '';
	export let urlPortada = '';
	export let fechaFinTentativa = '';
	export let fechaMinima = '';
	export let beneficiarios: number | undefined;
	export let categoriasSeleccionadas: number[] = [];
	export let categoriaOtraDescripcion = '';
	export let errores: Record<string, string> = {};
	export let limpiarError: (campo: string) => void;

	function normalizarBeneficiarios() {
		if (beneficiarios == null || Number.isNaN(beneficiarios)) return;
		beneficiarios = Math.trunc(beneficiarios);
		if (beneficiarios < 1) beneficiarios = 1;
		if (beneficiarios > MAX_BENEFICIARIOS) beneficiarios = MAX_BENEFICIARIOS;
	}


	function toggleCategoria(categoriaId?: number) {
		if (categoriaId == null) return;

		if (categoriasSeleccionadas.includes(categoriaId)) {
			categoriasSeleccionadas = categoriasSeleccionadas.filter((id) => id !== categoriaId);
			if (idCategoriaOtra != null && categoriaId === idCategoriaOtra) {
				categoriaOtraDescripcion = '';
				limpiarError('categoria_otra');
			}
		} else {
			categoriasSeleccionadas = [...categoriasSeleccionadas, categoriaId];
		}
	}

	function normalizarCategoriaOtra() {
		categoriaOtraDescripcion = capitalizarPrimera(categoriaOtraDescripcion);
	}

	const idCategoriaOtra = mockCategorias.find(
		(c) => c.descripcion?.toLowerCase() === 'otro' || c.descripcion?.toLowerCase() === 'otra'
	)?.id_categoria;

	$: seleccionoOtra =
		idCategoriaOtra != null && categoriasSeleccionadas.includes(idCategoriaOtra ?? -1);
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="mb-6 text-xl font-semibold text-gray-900">Información básica</h2>

	<div class="grid gap-6">
		<div>
			<label for="titulo" class="mb-2 block text-sm font-medium text-gray-700"
				>Título del proyecto *</label
			>
			<input
				id="titulo"
				type="text"
				bind:value={titulo}
				on:blur={() => normalizarTitulo(titulo)}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
				placeholder="Ejemplo: Infancias felices 2025"
				class:border-red-300={errores.titulo}
			/>
			{#if errores.titulo}
				<p class="mt-1 text-sm text-red-600">{errores.titulo}</p>
			{/if}
		</div>

		<div>
			<label for="descripcion" class="mb-2 block text-sm font-medium text-gray-700"
				>Descripción *</label
			>
			<textarea
				id="descripcion"
				bind:value={descripcion}
				rows="4"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
				placeholder="Describa su proyecto, objetivos y cómo ayudará a la comunidad..."
				class:border-red-300={errores.descripcion}
			></textarea>
			{#if errores.descripcion}
				<p class="mt-1 text-sm text-red-600">{errores.descripcion}</p>
			{/if}
		</div>

		<div>
			<label for="urlPortada" class="mb-2 block text-sm font-medium text-gray-700"
				>URL de imagen de portada</label
			>
			<input
				id="urlPortada"
				type="url"
				bind:value={urlPortada}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
				class:border-red-300={errores.urlPortada}
				placeholder="https://ejemplo.com/imagen.jpg"
			/>
			{#if errores.urlPortada}
				<p class="mt-1 text-sm text-red-600">{errores.urlPortada}</p>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="fechaFin" class="mb-2 block text-sm font-medium text-gray-700"
					>Fecha de fin tentativa *</label
				>
				<input
					id="fechaFin"
					type="date"
					lang="es-AR"
					bind:value={fechaFinTentativa}
					min={fechaMinima}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
					class:border-red-300={errores.fechaFinTentativa}
					aria-invalid={!!errores.fechaFinTentativa}
				/>
				{#if errores.fechaFinTentativa}
					<p class="mt-1 text-sm text-red-600">{errores.fechaFinTentativa}</p>
				{:else if fechaFinTentativa}
					<p class="mt-1 text-xs text-gray-500" aria-live="polite">
						<span class="font-bold">Seleccionaste:</span>
						{formatearFechaLarga(fechaFinTentativa, 'del')}
					</p>
				{/if}
			</div>

			<div>
				<label for="beneficiarios" class="mb-2 block text-sm font-medium text-gray-700"
					>Número de beneficiarios estimados</label
				>
				<input
					id="beneficiarios"
					type="number"
					bind:value={beneficiarios}
					min="1"
					step="1"
					inputmode="numeric"
					on:blur={normalizarBeneficiarios}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
					class:border-red-300={errores.beneficiarios}
					aria-invalid={!!errores.beneficiarios}
					aria-describedby="beneficiarios-help"
					placeholder="Ejemplo: 150"
				/>
				<p id="beneficiarios-help" class="mt-1 text-xs text-gray-500">
					Si no está seguro/a, déjelo vacío.
				</p>
				{#if errores.beneficiarios}
					<p class="mt-1 text-sm text-red-600">{errores.beneficiarios}</p>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="mb-6 text-xl font-semibold text-gray-900">Seleccione al menos una categoría *</h2>

	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
		{#each mockCategorias as categoria (categoria.id_categoria)}
			<button
				type="button"
				on:click={() => toggleCategoria(categoria.id_categoria)}
				class="group relative flex items-center rounded-lg border-2 border-dashed p-3 transition-all duration-200 hover:shadow-sm"
				class:border-blue-500={categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
				class:bg-blue-50={categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
				class:border-gray-300={!categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
				class:bg-white={!categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
				class:hover:border-blue-400={!categoriasSeleccionadas.includes(
					categoria.id_categoria ?? -1
				)}
				class:hover:bg-gray-50={!categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
			>
				<span class="mr-2 flex-shrink-0 text-lg"
					>{obtenerIconoCategoria(categoria.descripcion)}</span
				>
				<div class="min-w-0 flex-1 text-left">
					<span
						class="block text-xs font-medium leading-tight"
						class:text-blue-900={categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
						class:text-gray-700={!categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
					>
						{categoria.descripcion}
					</span>
				</div>
				<div class="ml-1 flex-shrink-0">
					{#if categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
						<div class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
							<svg class="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{:else}
						<div
							class="h-4 w-4 rounded-full border-2 border-dashed border-gray-300 group-hover:border-blue-300"
						></div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if seleccionoOtra}
		<div class="mt-4">
			<label for="categoria_otra" class="mb-2 block text-sm font-medium text-gray-700"
				>Especificá la categoría *</label
			>
			<input
				id="categoria_otra"
				type="text"
				bind:value={categoriaOtraDescripcion}
				maxlength="60"
				on:blur={normalizarCategoriaOtra}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
				class:border-red-300={errores.categoria_otra}
				placeholder="Ejemplo: Personas mayores, Acceso al agua, Inclusión digital…"
				aria-invalid={!!errores.categoria_otra}
			/>
			{#if errores.categoria_otra}
				<p class="mt-1 text-sm text-red-600">{errores.categoria_otra}</p>
			{/if}
		</div>
	{/if}

	{#if errores.categorias}
		<p class="mt-4 flex items-center text-sm text-red-600">
			<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				></path>
			</svg>
			{errores.categorias}
		</p>
	{/if}
</div>
