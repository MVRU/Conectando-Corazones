<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { RegistroAuditoriaAdminDto } from '$lib/domain/types/dto/PanelAdmin';

	export let logs: RegistroAuditoriaAdminDto[] = [];
	export let loading = false;
	export let filtros = {
		idObjeto: '' as string | number,
		usuarioId: '' as string | number
	};
	export let paginacion = {
		total: 0,
		page: 1,
		pageSize: 100
	};

	type SortKey = 'created_at' | 'tipo_objeto' | 'accion' | 'atributo_afectado' | 'justificacion';
	let sortBy: SortKey = 'created_at';
	let sortDir: 'asc' | 'desc' = 'desc';

	const dispatch = createEventDispatcher<{
		buscar: { idObjeto: string | number; usuarioId: string | number };
		cambiarPagina: { page: number };
	}>();

	$: totalPaginas = Math.max(1, Math.ceil((paginacion.total || 0) / (paginacion.pageSize || 100)));
	$: logsOrdenados = [...logs].sort((a, b) => {
		const dir = sortDir === 'asc' ? 1 : -1;
		const valA = (a[sortBy] ?? '').toString().toLowerCase();
		const valB = (b[sortBy] ?? '').toString().toLowerCase();
		if (sortBy === 'created_at') {
			const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
			const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
			return (tA - tB) * dir;
		}
		return valA.localeCompare(valB) * dir;
	});

	function changeSort(key: SortKey) {
		if (sortBy === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = key;
			sortDir = key === 'created_at' ? 'desc' : 'asc';
		}
	}
</script>

<div class="rounded-xl border border-gray-200 bg-white shadow-sm">
	<div class="border-b border-gray-100 p-4">
		<h3 class="text-lg font-semibold text-gray-900">Auditoría y trazabilidad</h3>
		<p class="text-sm text-gray-500">Por defecto se listan todos los cambios recientes. Los filtros son opcionales.</p>
	</div>

	<form class="grid gap-3 border-b border-gray-100 p-4 md:grid-cols-[1fr_1fr_auto]" on:submit|preventDefault={() => dispatch('buscar', filtros)}>
		<div>
			<label for="filtro-id-objeto" class="mb-1 block text-xs font-semibold text-gray-600 uppercase">ID objeto</label>
			<input id="filtro-id-objeto" type="number" bind:value={filtros.idObjeto} class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
		</div>
		<div>
			<label for="filtro-usuario-id" class="mb-1 block text-xs font-semibold text-gray-600 uppercase">Usuario ID</label>
			<input id="filtro-usuario-id" type="number" bind:value={filtros.usuarioId} class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
		</div>
		<div class="flex items-end">
			<Button label="Aplicar filtros" size="sm" type="submit" disabled={loading} />
		</div>
	</form>

	<div>
		<table class="w-full table-fixed divide-y divide-gray-200 text-sm">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="w-[12%] px-3 py-3 font-semibold text-gray-700">
						<button class="cursor-pointer hover:text-blue-700" title="Ordenar por fecha" on:click={() => changeSort('created_at')}>
							Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="w-[12%] px-3 py-3 font-semibold text-gray-700">
						<button class="cursor-pointer hover:text-blue-700" title="Ordenar por objeto" on:click={() => changeSort('tipo_objeto')}>
							Objeto {sortBy === 'tipo_objeto' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="w-[10%] px-3 py-3 font-semibold text-gray-700">
						<button class="cursor-pointer hover:text-blue-700" title="Ordenar por acción" on:click={() => changeSort('accion')}>
							Acción {sortBy === 'accion' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="w-[10%] px-3 py-3 font-semibold text-gray-700">
						<button class="cursor-pointer hover:text-blue-700" title="Ordenar por atributo" on:click={() => changeSort('atributo_afectado')}>
							Atributo {sortBy === 'atributo_afectado' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="w-[26%] px-3 py-3 font-semibold text-gray-700">
						<button class="cursor-pointer hover:text-blue-700" title="Ordenar por justificación" on:click={() => changeSort('justificacion')}>
							Justificación {sortBy === 'justificacion' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="w-[30%] px-3 py-3 font-semibold text-gray-700">Cambio</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#if logs.length === 0}
					<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Sin resultados para los filtros indicados.</td></tr>
				{:else}
					{#each logsOrdenados as log}
						<tr class="align-top">
							<td class="px-3 py-3 text-xs leading-tight text-gray-600">{#if log.created_at}{new Date(log.created_at).toLocaleString('es-AR')}{:else}-{/if}</td>
							<td class="px-3 py-3 leading-tight"><div class="font-medium text-gray-800">{log.tipo_objeto}</div><div class="text-xs text-gray-500">#{log.id_objeto}</div></td>
							<td class="px-3 py-3 text-sm">{log.accion}</td>
							<td class="px-3 py-3 text-sm">{log.atributo_afectado}</td>
							<td class="px-3 py-3 text-xs break-words text-gray-700">{log.justificacion || '-'}</td>
							<td class="px-3 py-3 text-xs text-gray-700">
								<div class="break-words"><span class="font-semibold">Antes:</span> {log.valor_anterior}</div>
								<div class="break-words"><span class="font-semibold">Después:</span> {log.valor_nuevo}</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
	<div class="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm">
		<p class="text-gray-600">
			Mostrando página {paginacion.page} de {totalPaginas} · {paginacion.total} registros
		</p>
		<div class="flex gap-2">
			<button
				class="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 disabled:opacity-50"
				disabled={paginacion.page <= 1}
				on:click={() => dispatch('cambiarPagina', { page: paginacion.page - 1 })}
				title="Página anterior"
			>
				Anterior
			</button>
			<button
				class="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 disabled:opacity-50"
				disabled={paginacion.page >= totalPaginas}
				on:click={() => dispatch('cambiarPagina', { page: paginacion.page + 1 })}
				title="Página siguiente"
			>
				Siguiente
			</button>
		</div>
	</div>
</div>
