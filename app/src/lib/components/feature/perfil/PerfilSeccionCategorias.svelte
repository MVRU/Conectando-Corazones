<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { obtenerIconoCategoria } from '$lib/utils/util-proyecto-form';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let esMiPerfil: boolean;
	export let onEditarClick: () => void;

	$: categorias = perfilUsuario.categorias_preferidas || [];
	$: tieneCategorias = categorias.length > 0;
</script>

<section class="mb-8">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-xl font-semibold text-gray-900">
			{esMiPerfil ? 'Mis categorías favoritas' : 'Categorías favoritas'}
		</h3>
		{#if esMiPerfil}
			<button
				on:click={onEditarClick}
				class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
				Editar
			</button>
		{/if}
	</div>

	{#if tieneCategorias}
		<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each categorias as categoria}
				<div
					class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
				>
					<div class="flex w-full items-center gap-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
							<Icon
								src={obtenerIconoCategoria(categoria.descripcion)}
								class="h-6 w-6 text-blue-600"
							/>
						</div>
						<div class="flex-1">
							<h4 class="font-medium text-gray-900">{categoria.descripcion}</h4>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="rounded-xl border border-gray-200 bg-white py-12 text-center">
			<div class="mx-auto h-12 w-12 text-gray-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
					/>
				</svg>
			</div>
			<h3 class="mt-4 text-lg font-medium text-gray-900">No hay categorías favoritas</h3>
			<p class="mt-2 text-gray-500">
				{esMiPerfil
					? 'Seleccioná tus categorías favoritas para personalizar tu experiencia.'
					: 'Este usuario aún no ha seleccionado categorías favoritas.'}
			</p>
			{#if esMiPerfil}
				<button
					on:click={onEditarClick}
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Agregar categorías
				</button>
			{/if}
		</div>
	{/if}
</section>
