<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockCategorias } from '$lib/mocks/mock-categorias';
	import type { Categoria } from '$lib/types/Categoria';

	let categorias: Categoria[] = mockCategorias.map((c) => ({ ...c }));
	let nuevaCategoria = '';
	let categoriaEditando: number | null = null;
	let categoriaEditandoTexto = '';

	let tabActivo: 'categorias' | 'politicas' | 'general' = 'categorias';

	function agregarCategoria() {
		if (!nuevaCategoria.trim()) return;
		const nuevoId = Math.max(...categorias.map((c) => c.id_categoria || 0), 0) + 1;
		categorias = [...categorias, { id_categoria: nuevoId, descripcion: nuevaCategoria.trim() }];
		nuevaCategoria = '';
	}

	function iniciarEdicion(categoria: Categoria) {
		categoriaEditando = categoria.id_categoria || null;
		categoriaEditandoTexto = categoria.descripcion;
	}

	function guardarEdicion() {
		if (categoriaEditando === null || !categoriaEditandoTexto.trim()) return;
		categorias = categorias.map((c) =>
			c.id_categoria === categoriaEditando ? { ...c, descripcion: categoriaEditandoTexto.trim() } : c
		);
		cancelarEdicion();
	}

	function cancelarEdicion() {
		categoriaEditando = null;
		categoriaEditandoTexto = '';
	}

	function eliminarCategoria(id: number | undefined) {
		if (!id) return;
		if (confirm('¿Está seguro de eliminar esta categoría?')) {
			categorias = categorias.filter((c) => c.id_categoria !== id);
		}
	}
</script>

<svelte:head>
	<title>Configuración - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Configuración" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Configuración de plataforma</h1>
			<p class="mt-1 text-sm text-gray-600">Gestión de categorías, políticas y ajustes generales</p>
		</div>
	</div>

	<!-- Tabs -->
	<div class="border-b border-gray-200">
		<nav class="-mb-px flex space-x-8">
			<button
				type="button"
				class="border-b-2 px-1 py-4 text-sm font-medium transition-colors {tabActivo === 'categorias'
					? 'border-blue-500 text-blue-600'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				on:click={() => (tabActivo = 'categorias')}
			>
				Categorías
			</button>
			<button
				type="button"
				class="border-b-2 px-1 py-4 text-sm font-medium transition-colors {tabActivo === 'politicas'
					? 'border-blue-500 text-blue-600'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				on:click={() => (tabActivo = 'politicas')}
			>
				Políticas y términos
			</button>
			<button
				type="button"
				class="border-b-2 px-1 py-4 text-sm font-medium transition-colors {tabActivo === 'general'
					? 'border-blue-500 text-blue-600'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
				on:click={() => (tabActivo = 'general')}
			>
				Ajustes generales
			</button>
		</nav>
	</div>

	<!-- Contenido de tabs -->
	<div class="mt-6">
		{#if tabActivo === 'categorias'}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900">Gestión de categorías</h2>
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={nuevaCategoria}
							placeholder="Nueva categoría"
							class="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							on:keydown={(e) => e.key === 'Enter' && agregarCategoria()}
						/>
						<Button
							label="Agregar"
							variant="primary"
							size="sm"
							type="button"
							on:click={agregarCategoria}
						/>
					</div>
				</div>

				<div class="space-y-2">
					{#each categorias as categoria}
						<div class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
							{#if categoriaEditando === categoria.id_categoria}
								<input
									type="text"
									bind:value={categoriaEditandoTexto}
									class="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									on:keydown={(e) => {
										if (e.key === 'Enter') guardarEdicion();
										if (e.key === 'Escape') cancelarEdicion();
									}}
								/>
								<div class="ml-2 flex gap-2">
									<Button
										label="Guardar"
										variant="primary"
										size="sm"
										type="button"
										on:click={guardarEdicion}
									/>
									<Button
										label="Cancelar"
										variant="secondary"
										size="sm"
										type="button"
										on:click={cancelarEdicion}
									/>
								</div>
							{:else}
								<span class="flex-1 text-sm font-medium text-gray-900">{categoria.descripcion}</span>
								<div class="flex gap-2">
									<Button
										label="Editar"
										variant="secondary"
										size="sm"
										type="button"
										on:click={() => iniciarEdicion(categoria)}
									/>
									<Button
										label="Eliminar"
										variant="secondary"
										size="sm"
										type="button"
										on:click={() => eliminarCategoria(categoria.id_categoria)}
									/>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{:else if tabActivo === 'politicas'}
			<section class="space-y-6">
				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-gray-900">Políticas y términos</h2>
					<div class="space-y-4">
						<div>
							<label for="terminos-condiciones" class="block text-sm font-medium text-gray-700">Términos y condiciones</label>
							<textarea
								id="terminos-condiciones"
								class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="6"
								placeholder="Contenido de términos y condiciones..."
							></textarea>
							<p class="mt-1 text-xs text-gray-500">Última actualización: 2024-01-01</p>
						</div>
						<div>
							<label for="politica-privacidad" class="block text-sm font-medium text-gray-700">Política de privacidad</label>
							<textarea
								id="politica-privacidad"
								class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="6"
								placeholder="Contenido de política de privacidad..."
							></textarea>
							<p class="mt-1 text-xs text-gray-500">Última actualización: 2024-01-01</p>
						</div>
						<div>
							<label for="codigo-conducta" class="block text-sm font-medium text-gray-700">Código de conducta</label>
							<textarea
								id="codigo-conducta"
								class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								rows="6"
								placeholder="Contenido de código de conducta..."
							></textarea>
							<p class="mt-1 text-xs text-gray-500">Última actualización: 2024-01-01</p>
						</div>
						<div class="flex justify-end">
							<Button label="Guardar cambios" variant="primary" size="sm" type="button" />
						</div>
					</div>
				</div>
			</section>
		{:else if tabActivo === 'general'}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Ajustes generales</h2>
				<div class="space-y-4">
					<div>
						<label for="nombre-plataforma" class="block text-sm font-medium text-gray-700">Nombre de la plataforma</label>
						<input
							id="nombre-plataforma"
							type="text"
							value="Conectando Corazones"
							class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="email-contacto" class="block text-sm font-medium text-gray-700">Email de contacto</label>
						<input
							id="email-contacto"
							type="email"
							value="contacto@conectandocorazones.org"
							class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<p class="block text-sm font-medium text-gray-700">Mantenimiento</p>
						<div class="mt-2 flex items-center gap-2">
							<input type="checkbox" id="modo-mantenimiento" class="rounded border-gray-300" />
							<label for="modo-mantenimiento" class="text-sm text-gray-700">Activar modo mantenimiento</label>
						</div>
					</div>
					<div>
						<p class="block text-sm font-medium text-gray-700">Registro de usuarios</p>
						<div class="mt-2 flex items-center gap-2">
							<input type="checkbox" id="registro-abierto" checked class="rounded border-gray-300" />
							<label for="registro-abierto" class="text-sm text-gray-700">Permitir registro abierto</label>
						</div>
					</div>
					<div class="flex justify-end">
						<Button label="Guardar cambios" variant="primary" size="sm" type="button" />
					</div>
				</div>
			</section>
		{/if}
	</div>
</div>
