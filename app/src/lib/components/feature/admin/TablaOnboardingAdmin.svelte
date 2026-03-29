<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { SolicitudOnboardingAdminDto } from '$lib/domain/types/dto/PanelAdmin';

	export let items: SolicitudOnboardingAdminDto[] = [];
	export let loading = false;
	type SortKey = 'nombre' | 'rol' | 'tipo' | 'created_at';
	let sortBy: SortKey = 'created_at';
	let sortDir: 'asc' | 'desc' = 'desc';

	const dispatch = createEventDispatcher<{
		aprobar: { idVerificacion: number };
		rechazar: { idVerificacion: number; motivo: string };
	}>();

	let modalAbierto = false;
	let idVerificacionRechazo: number | null = null;
	let motivo = '';
	let error = '';

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
		dispatch('rechazar', { idVerificacion: idVerificacionRechazo, motivo: motivo.trim() });
		modalAbierto = false;
	}

	function getSortValue(item: SolicitudOnboardingAdminDto, key: SortKey): string {
		if (key === 'nombre') return `${item.nombre} ${item.apellido}`;
		if (key === 'rol') return item.rol;
		if (key === 'tipo') return item.tipo;
		return item.created_at ? new Date(item.created_at).toISOString() : '';
	}

	$: itemsOrdenados = [...items].sort((a, b) => {
		const dir = sortDir === 'asc' ? 1 : -1;
		if (sortBy === 'created_at') {
			const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
			const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
			return (tA - tB) * dir;
		}
		const valA = getSortValue(a, sortBy).toLowerCase();
		const valB = getSortValue(b, sortBy).toLowerCase();
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
		<h3 class="text-lg font-semibold text-gray-900">Bandeja de validación documental</h3>
		<p class="text-sm text-gray-500">Validación documental pendiente de instituciones y colaboradores.</p>
	</div>
	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200 text-sm">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="px-4 py-3 font-semibold text-gray-700">Usuario</th>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por rol" on:click={() => changeSort('rol')}>Rol {sortBy === 'rol' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por tipo de solicitud" on:click={() => changeSort('tipo')}>Solicitud {sortBy === 'tipo' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-gray-700"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por fecha de alta" on:click={() => changeSort('created_at')}>Fecha {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-gray-700">Documentos</th>
					<th class="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#if items.length === 0}
					<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No hay solicitudes pendientes.</td></tr>
				{:else}
					{#each itemsOrdenados as item}
						<tr class="align-top">
							<td class="px-4 py-3 text-gray-800"><div class="font-medium">{item.nombre} {item.apellido}</div><div class="text-xs text-gray-500">@{item.username}</div></td>
							<td class="px-4 py-3 capitalize">{item.rol}</td>
							<td class="px-4 py-3">{item.tipo}</td>
							<td class="px-4 py-3 text-xs text-gray-600">{#if item.created_at}{new Date(item.created_at).toLocaleString('es-AR')}{:else}-{/if}</td>
							<td class="px-4 py-3">
								<div class="space-y-1">
									{#each item.documentos as doc}
										<a class="block text-xs text-blue-700 underline" href={doc.url} target="_blank" rel="noreferrer">{doc.nombre_original || `Documento #${doc.id_archivo}`}</a>
									{/each}
								</div>
							</td>
							<td class="px-4 py-3"><div class="flex justify-end gap-2">
								<Button label="Aprobar" size="sm" onclick={() => dispatch('aprobar', { idVerificacion: item.id_verificacion })} disabled={loading} />
								<Button label="Rechazar" size="sm" variant="danger" onclick={() => abrirRechazo(item.id_verificacion)} disabled={loading} />
							</div></td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<Modal abierto={modalAbierto} titulo="Motivo de rechazo" on:cerrar={() => (modalAbierto = false)} anchoMaximo="max-w-xl">
	<div class="space-y-3">
		<label for="motivo-rechazo" class="block text-sm font-medium text-gray-700">Este motivo será enviado al usuario.</label>
		<textarea id="motivo-rechazo" class="w-full rounded-lg border border-gray-300 p-3 text-sm" rows="4" bind:value={motivo} placeholder="Ingresá un motivo claro del rechazo documental..."></textarea>
		{#if error}<p class="text-sm text-red-600">{error}</p>{/if}
	</div>
	<div slot="footer" class="flex gap-2">
		<Button label="Cancelar" variant="secondary" size="sm" onclick={() => (modalAbierto = false)} />
		<Button label="Confirmar rechazo" variant="danger" size="sm" onclick={confirmarRechazo} />
	</div>
</Modal>
