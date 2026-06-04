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

<div
	class="overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-sm backdrop-blur-md"
>
	<div class="border-b border-white/10 bg-linear-to-r from-[#1a1b3b] to-[#252a5a] px-6 py-5">
		<h3 class="text-xl font-bold text-white">Denuncias y Reportes</h3>
		<p class="text-sm text-slate-400">Revisión de contenido reportado y acciones disciplinarias.</p>
	</div>

	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-white/5 text-sm">
			<thead class="bg-white/5 text-left">
				<tr>
					<th class="px-6 py-4 font-bold tracking-wider text-slate-300 uppercase">ID</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold tracking-wider text-slate-300 uppercase transition-colors hover:text-white"
							onclick={() => changeSort('motivo')}
						>
							Motivo {sortBy === 'motivo' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4 font-bold tracking-wider text-slate-300 uppercase">Denunciante</th>
					<th class="px-6 py-4 font-bold tracking-wider text-slate-300 uppercase">Objetivo</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold tracking-wider text-slate-300 uppercase transition-colors hover:text-white"
							onclick={() => changeSort('estado')}
						>
							Estado {sortBy === 'estado' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold tracking-wider text-slate-300 uppercase transition-colors hover:text-white"
							onclick={() => changeSort('created_at')}
						>
							Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4 text-right font-bold tracking-wider text-slate-300 uppercase">
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
						<tr class="transition-colors hover:bg-white/5">
							<td class="px-6 py-4 font-mono text-xs text-slate-500">#{reporte.id_reporte}</td>
							<td class="px-6 py-4">
								<div class="font-bold text-white transition-colors hover:text-emerald-400">
									{reporte.motivo}
								</div>
								<div class="max-w-xs truncate text-xs text-slate-400">{reporte.descripcion}</div>
							</td>
							<td class="px-6 py-4">
								<div class="font-medium text-white">@{reporte.reportante.username}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-xs text-slate-300">
									<span class="font-bold text-slate-500">Tipo:</span>
									{reporte.tipo_objeto}
								</div>
								<div class="font-medium text-white">@{reporte.reportado.nombre}</div>
							</td>
							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${reporte.estado === 'pendiente' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'}`}
								>
									{reporte.estado}
								</span>
							</td>
							<td class="px-6 py-4 font-medium text-slate-400">
								{new Date(reporte.created_at).toLocaleDateString('es-AR')}
							</td>
							<td class="px-6 py-4 text-right">
								{#if reporte.estado === 'pendiente'}
									<Button
										label="Resolver"
										size="sm"
										onclick={() => abrirResolucion(reporte)}
										disabled={loading}
										class="rounded-full! bg-emerald-600! text-white! shadow-lg shadow-emerald-500/20 hover:bg-emerald-700! hover:shadow-emerald-500/40"
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
			<label class="block text-sm font-bold text-slate-700" for="accion">Acción a tomar:</label>
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
			{#if error}<p class="mt-1 text-xs font-medium text-red-600">{error}</p>{/if}
		</div>
	</div>

	{#snippet footer()}
		<div class="flex gap-2">
			<Button
				label="Cancelar"
				variant="secondary"
				size="sm"
				onclick={() => (modalAbierto = false)}
				class="rounded-full!"
			/>
			<Button
				label="Confirmar Resolución"
				variant="primary"
				size="sm"
				onclick={confirmarResolucion}
				class="rounded-full! bg-blue-600! text-white! shadow-lg hover:bg-blue-700!"
			/>
		</div>
	{/snippet}
</Modal>
