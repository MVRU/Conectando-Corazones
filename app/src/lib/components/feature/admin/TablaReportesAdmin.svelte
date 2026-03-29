<script lang="ts">
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { ReporteAdminItemDto } from '$lib/domain/types/dto/PanelAdmin';

	let {
		reportes = [],
		loading = false,
		onResolver = undefined
	} = $props<{
		reportes?: ReporteAdminItemDto[];
		loading?: boolean;
		onResolver?: (data: {
			reporteId: number;
			accion: 'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto';
			comentario: string;
		}) => void;
	}>();

	let sortBy = $state<'id_reporte' | 'motivo' | 'estado' | 'created_at'>('created_at');
	let sortDir = $state<'asc' | 'desc'>('desc');
	let modalAbierto = $state(false);
	let reporteSeleccionado = $state<ReporteAdminItemDto | null>(null);
	let accionSeleccionada = $state<'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto'>(
		'desestimar'
	);
	let comentario = $state('');
	let error = $state('');

	function abrirResolucion(reporte: ReporteAdminItemDto) {
		reporteSeleccionado = reporte;
		accionSeleccionada = 'desestimar';
		comentario = '';
		error = '';
		modalAbierto = true;
	}

	function confirmarResolucion() {
		if (!reporteSeleccionado) return;
		if (!comentario.trim()) {
			error = 'El comentario es obligatorio para la resolución.';
			return;
		}
		if (onResolver) {
			onResolver({
				reporteId: reporteSeleccionado.id_reporte,
				accion: accionSeleccionada,
				comentario: comentario.trim()
			});
		}
		modalAbierto = false;
	}

	let reportesOrdenados = $derived(
		[...(reportes ?? [])].sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1;
			const valA = (a[sortBy] ?? '').toString().toLowerCase();
			const valB = (b[sortBy] ?? '').toString().toLowerCase();
			return valA.localeCompare(valB) * dir;
		})
	);

	function changeSort(key: typeof sortBy) {
		if (sortBy === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = key;
			sortDir = key === 'created_at' ? 'desc' : 'asc';
		}
	}
</script>

<div class="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md shadow-sm">
	<div class="border-b border-white/10 bg-gradient-to-r from-[#1a1b3b] to-[#252a5a] px-6 py-5">
		<h3 class="text-xl font-bold text-white">Denuncias y Reportes</h3>
		<p class="text-sm text-slate-400">Revisión de contenido reportado y acciones disciplinarias.</p>
	</div>

	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-white/5 text-sm">
			<thead class="bg-white/5 text-left">
				<tr>
					<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">ID</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('motivo')}
						>
							Motivo {sortBy === 'motivo' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Denunciante</th>
					<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Objetivo</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('estado')}
						>
							Estado {sortBy === 'estado' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('created_at')}
						>
							Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4 text-right font-bold text-slate-300 uppercase tracking-wider">
						Acciones
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/5">
				{#if reportes.length === 0}
					<tr>
						<td colspan="7" class="px-6 py-12 text-center text-slate-500 italic">
							No hay reportes para mostrar.
						</td>
					</tr>
				{:else}
					{#each reportesOrdenados as reporte}
						<tr class="hover:bg-white/5 transition-colors">
							<td class="px-6 py-4 font-mono text-xs text-slate-500">#{reporte.id_reporte}</td>
							<td class="px-6 py-4">
								<div class="font-bold text-white hover:text-emerald-400 transition-colors">
									{reporte.motivo}
								</div>
								<div class="max-w-xs truncate text-xs text-slate-400">{reporte.descripcion}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-white font-medium">@{reporte.reportante.username}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-xs text-slate-300">
									<span class="font-bold text-slate-500">Tipo:</span>
									{reporte.tipo_objeto}
								</div>
								<div class="text-white font-medium">@{reporte.reportado.nombre}</div>
							</td>
							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${reporte.estado === 'pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
								>
									{reporte.estado}
								</span>
							</td>
							<td class="px-6 py-4 text-slate-400 font-medium">
								{new Date(reporte.created_at).toLocaleDateString('es-AR')}
							</td>
							<td class="px-6 py-4 text-right">
								{#if reporte.estado === 'pendiente'}
									<Button
										label="Resolver"
										size="sm"
										onclick={() => abrirResolucion(reporte)}
										disabled={loading}
										class="!bg-emerald-600 !hover:bg-emerald-700 !text-white !rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
									/>
								{:else}
									<span class="text-xs font-bold text-slate-500 italic">Resuelto</span>
								{/if}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:abierto={modalAbierto} titulo="Resolver Reporte" anchoMaximo="max-w-xl">
	<div class="space-y-4">
		<div>
			<label class="block text-sm font-bold text-slate-700" for="accion"
				>Acción a tomar:</label
			>
			<select
				id="accion"
				class="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
				bind:value={accionSeleccionada}
			>
				<option value="desestimar">Desestimar reporte</option>
				<option value="inhabilitar_cuenta">Inhabilitar cuenta del denunciado</option>
				<option value="forzar_baja_proyecto">Forzar baja de proyecto/contenido</option>
			</select>
		</div>

		<div>
			<label class="block text-sm font-bold text-slate-700" for="comentario"
				>Comentario / Justificación:</label
			>
			<textarea
				id="comentario"
				class="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm"
				rows="4"
				bind:value={comentario}
				placeholder="Explicá el motivo de esta resolución..."
			></textarea>
			{#if error}<p class="mt-1 text-xs text-red-600 font-medium">{error}</p>{/if}
		</div>
	</div>

	{#snippet footer()}
		<div class="flex gap-2">
			<Button
				label="Cancelar"
				variant="secondary"
				size="sm"
				onclick={() => (modalAbierto = false)}
				class="!rounded-full"
			/>
			<Button
				label="Confirmar Resolución"
				variant="primary"
				size="sm"
				onclick={confirmarResolucion}
				class="!bg-blue-600 !hover:bg-blue-700 !text-white !rounded-full shadow-lg"
			/>
		</div>
	{/snippet}
</Modal>
