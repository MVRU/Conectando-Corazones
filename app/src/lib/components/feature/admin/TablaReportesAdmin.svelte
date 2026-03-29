<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import type { ReporteAdminItemDto } from '$lib/domain/types/dto/PanelAdmin';

	export let reportes: ReporteAdminItemDto[] = [];
	export let loading = false;
	type SortKey = 'id_reporte' | 'motivo' | 'estado' | 'created_at';
	let sortBy: SortKey = 'created_at';
	let sortDir: 'asc' | 'desc' = 'desc';

	const dispatch = createEventDispatcher<{
		resolver: {
			reporteId: number;
			accion: 'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto';
			comentario: string;
		};
	}>();

	let modalAbierto = false;
	let reporteActivo: ReporteAdminItemDto | null = null;
	let accion: 'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto' = 'desestimar';
	let comentario = '';

	function abrirResolver(reporte: ReporteAdminItemDto) {
		reporteActivo = reporte;
		accion = 'desestimar';
		comentario = '';
		modalAbierto = true;
	}

	function confirmarResolver() {
		if (!reporteActivo) return;
		dispatch('resolver', {
			reporteId: reporteActivo.id_reporte,
			accion,
			comentario: comentario.trim()
		});
		modalAbierto = false;
	}

	$: reportesOrdenados = [...reportes].sort((a, b) => {
		const dir = sortDir === 'asc' ? 1 : -1;
		if (sortBy === 'created_at') {
			const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
			const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
			return (tA - tB) * dir;
		}
		if (sortBy === 'id_reporte') return (a.id_reporte - b.id_reporte) * dir;
		const valA = (a[sortBy] ?? '').toString().toLowerCase();
		const valB = (b[sortBy] ?? '').toString().toLowerCase();
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
		<h3 class="text-lg font-semibold text-gray-900">Reportes y conflictos</h3>
	</div>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200 text-sm">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por número" on:click={() => changeSort('id_reporte')}>Reporte {sortBy === 'id_reporte' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-gray-700">Reportante</th>
					<th class="px-4 py-3 font-semibold text-gray-700">Reportado</th>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por categoría" on:click={() => changeSort('motivo')}>Categoría {sortBy === 'motivo' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por estado" on:click={() => changeSort('estado')}>Estado {sortBy === 'estado' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por fecha" on:click={() => changeSort('created_at')}>Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#if reportes.length === 0}
					<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Sin reportes</td></tr>
				{:else}
					{#each reportesOrdenados as reporte}
						<tr class="align-top">
							<td class="px-4 py-3"><div class="font-medium text-gray-900">#{reporte.id_reporte}</div><div class="text-xs text-gray-500">{reporte.descripcion}</div></td>
							<td class="px-4 py-3 text-gray-700">{reporte.reportante.nombre} {reporte.reportante.apellido}</td>
							<td class="px-4 py-3 text-gray-700">{reporte.reportado.nombre}</td>
							<td class="px-4 py-3">{reporte.motivo}</td>
							<td class="px-4 py-3"><span class={`rounded-full px-2 py-1 text-xs font-semibold ${reporte.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : reporte.estado === 'resuelto' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{reporte.estado || 'pendiente'}</span></td>
							<td class="px-4 py-3 text-xs text-gray-600">{#if reporte.created_at}{new Date(reporte.created_at).toLocaleString('es-AR')}{:else}-{/if}</td>
							<td class="px-4 py-3 text-right">
								{#if reporte.estado === 'pendiente'}
									<Button label="Resolver" size="sm" onclick={() => abrirResolver(reporte)} disabled={loading} />
								{:else}
									<span class="text-xs text-gray-500">Resuelto</span>
								{/if}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal abierto={modalAbierto} titulo={`Resolver reporte #${reporteActivo?.id_reporte || ''}`} on:cerrar={() => (modalAbierto = false)} anchoMaximo="max-w-xl">
	<div class="space-y-4">
		<div>
			<label for="accion-reporte" class="block text-sm font-medium text-gray-700">Acción resolutiva</label>
			<select id="accion-reporte" class="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm" bind:value={accion}>
				<option value="desestimar">Desestimar reporte</option>
				<option value="inhabilitar_cuenta">Inhabilitar cuenta reportada</option>
				<option value="forzar_baja_proyecto">Forzar baja de proyecto</option>
			</select>
		</div>
		<div>
			<label for="comentario-resolucion" class="block text-sm font-medium text-gray-700">Justificación</label>
			<textarea id="comentario-resolucion" rows="4" bind:value={comentario} class="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"></textarea>
		</div>
	</div>
	<div slot="footer" class="flex gap-2">
		<Button label="Cancelar" size="sm" variant="secondary" onclick={() => (modalAbierto = false)} />
		<Button label="Confirmar resolución" size="sm" onclick={confirmarResolver} />
	</div>
</Modal>
