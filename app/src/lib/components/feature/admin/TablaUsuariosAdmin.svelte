<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { UsuarioAdminItemDto } from '$lib/domain/types/dto/PanelAdmin';

	export let users: UsuarioAdminItemDto[] = [];
	export let loading = false;
	type SortKey = 'rol' | 'estado_gestion' | 'estado_verificacion' | 'created_at';
	let sortBy: SortKey = 'created_at';
	let sortDir: 'asc' | 'desc' = 'desc';

	const dispatch = createEventDispatcher<{
		toggleEstado: { idUsuario: number; habilitar: boolean };
		verPerfil: { username: string };
	}>();

	$: usuariosOrdenados = [...users].sort((a, b) => {
		const dir = sortDir === 'asc' ? 1 : -1;
		if (sortBy === 'created_at') {
			const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
			const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
			return (tA - tB) * dir;
		}
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

<section class="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
	<div class="border-b border-blue-100 bg-gradient-to-r from-[#0f1029] to-[#1b2a5a] px-5 py-4">
		<h3 class="text-lg font-semibold text-white">Gestión de usuarios</h3>
		<p class="text-sm text-blue-100">Habilitación, inhabilitación y consulta de perfiles.</p>
	</div>

	<div class="overflow-x-auto">
		<table class="min-w-full divide-y divide-blue-100 text-sm">
			<thead class="bg-blue-50/70 text-left">
				<tr>
					<th class="px-4 py-3 font-semibold text-[#0f1029]">Usuario</th>
					<th class="px-4 py-3 font-semibold text-[#0f1029]"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por rol" on:click={() => changeSort('rol')}>Rol {sortBy === 'rol' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-[#0f1029]"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por estado" on:click={() => changeSort('estado_gestion')}>Estado {sortBy === 'estado_gestion' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-[#0f1029]"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por verificación" on:click={() => changeSort('estado_verificacion')}>Verificación {sortBy === 'estado_verificacion' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 font-semibold text-[#0f1029]"><button class="cursor-pointer hover:text-blue-700" title="Ordenar por fecha de alta" on:click={() => changeSort('created_at')}>Fecha alta {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</button></th>
					<th class="px-4 py-3 text-right font-semibold text-[#0f1029]">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-blue-50">
				{#if users.length === 0}
					<tr>
						<td colspan="6" class="px-4 py-8 text-center text-gray-500">Sin resultados</td>
					</tr>
				{:else}
					{#each usuariosOrdenados as user}
						<tr class="transition-colors hover:bg-blue-50/40">
							<td class="px-4 py-3">
								<div class="font-medium text-gray-900">{user.nombre} {user.apellido}</div>
								<div class="text-xs text-blue-700">@{user.username}</div>
							</td>
							<td class="px-4 py-3 capitalize text-gray-700">{user.rol}</td>
							<td class="px-4 py-3">
								<span
									class={`rounded-full px-2 py-1 text-xs font-semibold ${
										user.estado_gestion === 'activo'
											? 'bg-emerald-100 text-emerald-700'
											: user.estado_gestion === 'pendiente'
												? 'bg-amber-100 text-amber-700'
												: 'bg-rose-100 text-rose-700'
									}`}
								>
									{user.estado_gestion}
								</span>
							</td>
							<td class="px-4 py-3">
								<span class={`rounded-full px-2 py-1 text-xs font-semibold ${user.estado_verificacion === 'aprobada' ? 'bg-blue-100 text-blue-700' : user.estado_verificacion === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
									{user.estado_verificacion || 'sin solicitud'}
								</span>
							</td>
							<td class="px-4 py-3 text-gray-600">
								{#if user.created_at}{new Date(user.created_at).toLocaleDateString('es-AR')}{:else}-{/if}
							</td>
							<td class="px-4 py-3">
								<div class="flex justify-end gap-2">
									<Button
										label="Ver perfil"
										size="sm"
										variant="secondary"
										onclick={() => dispatch('verPerfil', { username: user.username })}
										disabled={loading}
									/>
									<Button
										label={user.estado_gestion === 'inhabilitado' ? 'Habilitar' : 'Inhabilitar'}
										size="sm"
										variant={user.estado_gestion === 'inhabilitado' ? 'primary' : 'danger'}
										onclick={() =>
											dispatch('toggleEstado', {
												idUsuario: user.id_usuario,
												habilitar: user.estado_gestion === 'inhabilitado'
											})}
										disabled={loading}
									/>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</section>
