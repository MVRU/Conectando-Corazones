<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { RegistroAuditoriaAdminDto } from '$lib/domain/types/dto/PanelAdmin';

	// TODO(Tomás): Agregar más filtros a la bitácora de auditoría.
	// Actualmente solo filtra por idObjeto y usuarioId.
	// Filtros faltantes considerados:
	// - Rango de fechas (created_at)
	// - Tipo de objeto (tipo_objeto: 'Usuario', 'Verificacion', etc.)
	// - Acción (accion: 'Crear', 'Actualizar', 'Eliminar', etc.)
	// - Atributo afectado (atributo_afectado)

	let {
		logs = [],
		loading = false,
		filtros = { idObjeto: '', usuarioId: '' },
		paginacion = { total: 0, page: 1, pageSize: 100 },
		onBuscar = undefined,
		onCambiarPagina = undefined
	} = $props<{
		logs?: RegistroAuditoriaAdminDto[];
		loading?: boolean;
		filtros?: { idObjeto: string | number; usuarioId: string | number };
		paginacion?: { total: number; page: number; pageSize: number };
		onBuscar?: (data: { idObjeto: string | number; usuarioId: string | number }) => void;
		onCambiarPagina?: (data: { page: number }) => void;
	}>();

	let innerFiltros = $state({ ...filtros });

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (onBuscar) onBuscar(innerFiltros);
	}

	let totalPaginas = $derived(Math.ceil(paginacion.total / paginacion.pageSize));
</script>

<div class="space-y-6">
	<!-- Filtros de búsqueda -->
	<section class="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md shadow-sm">
		<form class="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<label for="id_objeto" class="text-xs font-bold text-slate-500 uppercase tracking-tighter">ID del Objeto</label>
				<input
					id="id_objeto"
					type="text"
					class="w-full rounded-lg border border-white/10 bg-[#151730] px-4 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
					placeholder="Ej: 123"
					bind:value={innerFiltros.idObjeto}
				/>
			</div>
			<div class="space-y-2">
				<label for="usuario_id" class="text-xs font-bold text-slate-500 uppercase tracking-tighter">ID Usuario Admin</label>
				<input
					id="usuario_id"
					type="text"
					class="w-full rounded-lg border border-white/10 bg-[#151730] px-4 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
					placeholder="Ej: 45"
					bind:value={innerFiltros.usuarioId}
				/>
			</div>
			<div class="flex">
				<button
					type="submit"
					class="w-full rounded-lg bg-white/5 px-6 py-2.5 text-sm font-bold text-white border border-white/10 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 h-[42px]"
					disabled={loading}
				>
					Filtrar
				</button>
			</div>
		</form>
	</section>

	<!-- Tabla de resultados -->
	<section class="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md shadow-sm">
		<div class="border-b border-white/10 bg-gradient-to-r from-[#1a1b3b] to-[#252a5a] px-6 py-5 flex justify-between items-center">
			<div>
				<h3 class="text-xl font-bold text-white">Bitácora de auditoría</h3>
				<p class="text-sm text-slate-400">Historial completo de acciones administrativas.</p>
			</div>
			<div class="text-right">
				<span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
					Total: {paginacion.total}
				</span>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-white/5 text-sm text-left">
				<thead class="bg-white/5">
					<tr>
						<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Fecha</th>
						<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Admin</th>
						<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Acción</th>
						<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Objeto</th>
						<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Detalles</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5">
					{#if logs.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-slate-500 italic">
								No hay registros que coincidan con los filtros.
							</td>
						</tr>
					{:else}
						{#each logs as log}
							<tr class="hover:bg-white/5 transition-colors group">
								<td class="px-6 py-4 text-xs font-medium text-slate-400 whitespace-nowrap">
									{new Date(log.created_at).toLocaleString('es-AR')}
								</td>
								<td class="px-6 py-4">
									<div class="text-white font-bold transition-colors group-hover:text-emerald-400">
										@{log.username_admin}
									</div>
									<div class="text-[10px] text-slate-500">ID: {log.usuario_admin_id}</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center rounded-sm bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-tighter">
										{log.accion}
									</span>
								</td>
								<td class="px-6 py-4">
									<div class="text-white font-medium">{log.tipo_objeto}</div>
									<div class="text-[10px] text-slate-500 font-mono">#{log.id_objeto}</div>
								</td>
								<td class="px-6 py-4">
									<p class="max-w-xs text-xs text-slate-400 leading-relaxed italic">
										"{log.detalles}"
									</p>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Paginación -->
		{#if totalPaginas > 1}
			<div class="border-t border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
				<div class="text-xs text-slate-400">
					Página <span class="font-bold text-white">{paginacion.page}</span> de <span class="font-bold text-white">{totalPaginas}</span>
				</div>
				<div class="flex gap-2">
					<button
						class="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/10 disabled:opacity-30"
						disabled={paginacion.page <= 1 || loading}
						onclick={() => onCambiarPagina?.({ page: paginacion.page - 1 })}
					>
						Anterior
					</button>
					<button
						class="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/10 disabled:opacity-30"
						disabled={paginacion.page >= totalPaginas || loading}
						onclick={() => onCambiarPagina?.({ page: paginacion.page + 1 })}
					>
						Siguiente
					</button>
				</div>
			</div>
		{/if}
	</section>
</div>
