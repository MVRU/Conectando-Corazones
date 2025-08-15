<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Bien } from '$lib/types/CreateProject';

	export let bienes: Bien[] = [];
	export let error: string | undefined = undefined;

	const dispatch = createEventDispatcher<{
		change: { bienes: Bien[] };
		error: { message: string };
	}>();

	// Estado para el formulario de nuevo bien
	let nuevoBien = {
		nombre: '',
		cantidad: 1,
		unidad: ''
	};

	function agregarBien() {
		if (!nuevoBien.nombre.trim()) {
			dispatch('error', { message: 'El nombre del bien es obligatorio' });
			return;
		}

		if (!nuevoBien.unidad.trim()) {
			dispatch('error', { message: 'La unidad es obligatoria' });
			return;
		}

		if (nuevoBien.cantidad <= 0) {
			dispatch('error', { message: 'La cantidad debe ser mayor a 0' });
			return;
		}

		const bien: Bien = {
			id: Date.now().toString(),
			nombre: nuevoBien.nombre.trim(),
			cantidad: nuevoBien.cantidad,
			unidad: nuevoBien.unidad.trim()
		};

		bienes = [...bienes, bien];
		dispatch('change', { bienes });

		// Limpiar formulario
		nuevoBien = {
			nombre: '',
			cantidad: 1,
			unidad: ''
		};

		// Limpiar error si había
		if (error) {
			error = undefined;
		}
	}

	function eliminarBien(id: string) {
		bienes = bienes.filter(b => b.id !== id);
		dispatch('change', { bienes });
	}

	function editarBien(id: string, campo: keyof Omit<Bien, 'id'>, valor: any) {
		bienes = bienes.map(b => 
			b.id === id ? { ...b, [campo]: valor } : b
		);
		dispatch('change', { bienes });
	}
</script>

<div class="space-y-4">
	<label for="bienes-list" class="block text-sm font-medium text-gray-700">
		Lista de bienes necesarios *
	</label>

	<!-- Lista de bienes existentes -->
	{#if bienes.length > 0}
		<div id="bienes-list" class="space-y-3">
			{#each bienes as bien (bien.id)}
				<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
					<div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
						<div>
							<span class="font-medium text-gray-600">Nombre:</span>
							<input
								type="text"
								bind:value={bien.nombre}
								on:input={() => editarBien(bien.id, 'nombre', bien.nombre)}
								class="w-full mt-1 text-sm border border-gray-300 rounded px-2 py-1"
							/>
						</div>
						<div>
							<span class="font-medium text-gray-600">Cantidad:</span>
							<input
								type="number"
								min="1"
								bind:value={bien.cantidad}
								on:input={() => editarBien(bien.id, 'cantidad', bien.cantidad)}
								class="w-full mt-1 text-sm border border-gray-300 rounded px-2 py-1"
							/>
						</div>
						<div>
							<span class="font-medium text-gray-600">Unidad:</span>
							<input
								type="text"
								bind:value={bien.unidad}
								on:input={() => editarBien(bien.id, 'unidad', bien.unidad)}
								placeholder="Ej: unidades, kg, litros"
								class="w-full mt-1 text-sm border border-gray-300 rounded px-2 py-1"
							/>
						</div>
					</div>
					<button
						type="button"
						on:click={() => eliminarBien(bien.id)}
						class="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
						aria-label="Eliminar bien"
						title="Eliminar bien"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Formulario para agregar nuevo bien -->
	<div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
		<h4 class="text-sm font-medium text-gray-700 mb-3">Agregar nuevo bien</h4>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
			<div>
				<label for="nuevo-bien-nombre" class="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
				<input
					id="nuevo-bien-nombre"
					type="text"
					bind:value={nuevoBien.nombre}
					placeholder="Ej: Libros de texto"
					class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
			</div>
			
			<div>
				<label for="nuevo-bien-cantidad" class="block text-xs font-medium text-gray-600 mb-1">Cantidad *</label>
				<input
					id="nuevo-bien-cantidad"
					type="number"
					min="1"
					bind:value={nuevoBien.cantidad}
					class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
			</div>
			
			<div>
				<label for="nuevo-bien-unidad" class="block text-xs font-medium text-gray-600 mb-1">Unidad *</label>
				<input
					id="nuevo-bien-unidad"
					type="text"
					bind:value={nuevoBien.unidad}
					placeholder="Ej: unidades, kg, litros"
					class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
			</div>
		</div>

		<button
			type="button"
			on:click={agregarBien}
			class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
			</svg>
			Agregar bien
		</button>
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}

	<p class="text-xs text-gray-500">
		Especifica los bienes materiales que necesitas: nombre, cantidad y unidad (ej: Libros, 50, unidades)
	</p>
</div>
