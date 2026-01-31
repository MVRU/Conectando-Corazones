<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	let editingId: number | null = null;
	let editValue = '';
	let saving = false;

	function startEditing(id: number, currentValue: string) {
		editingId = id;
		editValue = currentValue;
	}

	function cancelEditing() {
		editingId = null;
		editValue = '';
	}

	async function saveParametro(id: number) {
		if (!editValue.trim()) return;

		saving = true;
		try {
			const res = await fetch(`/api/parametros/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ valor: editValue })
			});

			if (!res.ok) {
				const err = await res.json();
				alert(err.error || 'Error al guardar');
				return;
			}

			await invalidateAll();
			editingId = null;
		} catch (e) {
			console.error(e);
			alert('Error de conexión');
		} finally {
			saving = false;
		}
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<header class="flex flex-col gap-2">
		<h1 class="text-3xl font-bold text-gray-900">Parámetros del sistema</h1>
		<p class="text-gray-600">Listado de parámetros de configuración global del sistema.</p>
	</header>

	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
		<table class="w-full min-w-full divide-y divide-gray-200 bg-white text-sm">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="px-6 py-4 font-semibold text-gray-900">ID</th>
					<th class="px-6 py-4 font-semibold text-gray-900">Nombre</th>
					<th class="px-6 py-4 font-semibold text-gray-900">Valor</th>
					<th class="px-6 py-4 font-semibold text-gray-900">Tipo</th>
					<th class="hidden px-6 py-4 font-semibold text-gray-900 md:table-cell">Descripción</th>
					<th class="px-6 py-4 text-right font-semibold text-gray-900">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each data.parametros as parametro}
					<tr class="transition-colors hover:bg-gray-50">
						<td class="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
							{parametro.id_parametro || '-'}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-gray-700">
							{parametro.nombre}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-gray-700">
							{#if editingId === parametro.id_parametro}
								<form
									class="flex gap-2"
									on:submit|preventDefault={() => saveParametro(parametro.id_parametro)}
								>
									<input
										type="text"
										bind:value={editValue}
										class="rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
										disabled={saving}
									/>
								</form>
							{:else}
								<span
									class="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
								>
									{parametro.valor}
								</span>
							{/if}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-gray-500">
							{parametro.tipo}
						</td>
						<td class="hidden px-6 py-4 text-gray-500 md:table-cell">
							{parametro.descripcion}
						</td>
						<td class="px-6 py-4 text-right whitespace-nowrap">
							{#if editingId === parametro.id_parametro}
								<div class="flex justify-end gap-2">
									<button
										on:click={() => saveParametro(parametro.id_parametro)}
										class="font-medium text-green-600 hover:text-green-900"
										disabled={saving}
										type="button"
									>
										Guardar
									</button>
									<button
										on:click={cancelEditing}
										class="text-gray-500 hover:text-gray-700"
										disabled={saving}
										type="button"
									>
										Cancelar
									</button>
								</div>
							{:else}
								<button
									on:click={() => startEditing(parametro.id_parametro, parametro.valor)}
									class="font-medium text-blue-600 hover:text-blue-900"
									type="button"
								>
									Editar
								</button>
							{/if}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-6 py-8 text-center text-gray-500">
							No se encontraron parámetros registrados.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
