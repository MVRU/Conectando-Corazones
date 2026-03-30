<script lang="ts">
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { SolicitudOnboardingAdminDto } from '$lib/domain/types/dto/PanelAdmin';

	let {
		items = [],
		loading = false,
		onAprobar = undefined,
		onRechazar = undefined
	} = $props<{
		items?: SolicitudOnboardingAdminDto[];
		loading?: boolean;
		onAprobar?: (data: { idVerificacion: number }) => void;
		onRechazar?: (data: { idVerificacion: number; motivo: string }) => void;
	}>();

	let sortBy = $state<'nombre' | 'rol' | 'tipo' | 'created_at'>('created_at');
	let sortDir = $state<'asc' | 'desc'>('desc');
	let modalAbierto = $state(false);
	let idVerificacionRechazo = $state<number | null>(null);
	let motivo = $state('');
	let error = $state('');

	function abrirRechazo(idVerificacion: number) {
		idVerificacionRechazo = idVerificacion;
		motivo = '';
		error = '';
		modalAbierto = true;
	}

	function confirmarRechazo() {
		if (!idVerificacionRechazo) return;
		if (!motivo.trim()) {
			error = 'El motivo de rechazo es obligatorio.';
			return;
		}
		if (onRechazar) onRechazar({ idVerificacion: idVerificacionRechazo, motivo: motivo.trim() });
		modalAbierto = false;
	}

	function getSortValue(item: SolicitudOnboardingAdminDto, key: string): string {
		if (key === 'nombre') return `${item.nombre} ${item.apellido}`;
		if (key === 'rol') return item.rol;
		if (key === 'tipo') return item.tipo;
		return item.created_at ? new Date(item.created_at).toISOString() : '';
	}

	let itemsOrdenados = $derived(
		[...(items ?? [])].sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1;
			if (sortBy === 'created_at') {
				const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return (tA - tB) * dir;
			}
			const valA = getSortValue(a, sortBy).toLowerCase();
			const valB = getSortValue(b, sortBy).toLowerCase();
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
		<h3 class="text-xl font-bold text-white">Bandeja de validación documental</h3>
		<p class="text-sm text-slate-400">Validación documental pendiente de instituciones y colaboradores.</p>
	</div>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-white/5 text-sm">
			<thead class="bg-white/5 text-left">
				<tr>
					<th class="px-6 py-4 font-bold text-slate-300 uppercase tracking-wider">Usuario</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('rol')}
						>
							Rol {sortBy === 'rol' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('tipo')}
						>
							Solicitud {sortBy === 'tipo' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
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
					<th class="px-6 py-4 text-center font-bold text-slate-300 uppercase tracking-wider">Documentos</th>
					<th class="px-6 py-4 text-center font-bold text-slate-300 uppercase tracking-wider">
						Acciones
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/5">
				{#if items.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-12 text-center text-slate-500 italic">
							No hay solicitudes pendientes.
						</td>
					</tr>
				{:else}
					{#each itemsOrdenados as item}
						<tr class="align-top hover:bg-white/5 transition-colors">
							<td class="px-6 py-5">
								<div class="font-bold text-white">{item.nombre} {item.apellido}</div>
								<div class="text-xs font-medium text-slate-500">@{item.username}</div>
							</td>
							<td class="px-6 py-5 capitalize">
								<span
									class="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/20"
								>
									{item.rol}
								</span>
							</td>
							<td class="px-6 py-5">
								<span class="text-slate-300 font-medium">{item.tipo}</span>
							</td>
							<td class="px-6 py-5 text-xs text-slate-400 font-medium">
								{#if item.created_at}{new Date(item.created_at).toLocaleString('es-AR')}{:else}-{/if}
							</td>
							<td class="px-6 py-5 text-center">
								<div class="flex flex-col items-center gap-1.5">
									{#each item.documentos as doc}
										<a
											class="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
											href={doc.url}
											target="_blank"
											rel="noreferrer"
										>
											<svg
												class="mr-1 h-3 w-3"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											{doc.nombre_original || `Documento #${doc.id_archivo}`}
										</a>
									{/each}
								</div>
							</td>
							<td class="px-6 py-5 text-center">
								<div class="flex justify-center gap-3">
									<Button
										label="Aprobar"
										size="sm"
										onclick={() =>
											onAprobar?.({ idVerificacion: item.id_verificacion })}
										disabled={loading}
										class="!bg-emerald-600 !hover:bg-emerald-700 !text-white !rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
									/>
									<Button
										label="Rechazar"
										size="sm"
										variant="danger"
										onclick={() => abrirRechazo(item.id_verificacion)}
										disabled={loading}
										class="!bg-rose-600 !hover:bg-rose-700 !text-white !rounded-full shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40"
									/>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal bind:abierto={modalAbierto} titulo="Motivo de rechazo" anchoMaximo="max-w-xl">
	<div class="space-y-3">
		<label for="motivo-rechazo" class="block text-sm font-medium text-gray-700">Este motivo será enviado al usuario.</label>
		<textarea id="motivo-rechazo" class="w-full rounded-lg border border-gray-300 p-3 text-sm" rows="4" bind:value={motivo} placeholder="Ingresá un motivo claro del rechazo documental..."></textarea>
		{#if error}<p class="text-sm text-red-600">{error}</p>{/if}
	</div>
	{#snippet footer()}
		<div class="flex gap-2">
			<Button label="Cancelar" variant="secondary" size="sm" onclick={() => (modalAbierto = false)} />
			<Button label="Confirmar rechazo" variant="danger" size="sm" onclick={confirmarRechazo} />
		</div>
	{/snippet}
</Modal>
