<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { UsuarioAdminItemDto } from '$lib/domain/types/dto/PanelAdmin';

	let {
		users = [],
		loading = false,
		onToggleEstado = undefined,
		onVerPerfil = undefined
	} = $props<{
		users?: UsuarioAdminItemDto[];
		loading?: boolean;
		onToggleEstado?: (data: { idUsuario: number; habilitar: boolean }) => void;
		onVerPerfil?: (data: { username: string }) => void;
	}>();

	let sortBy = $state<'rol' | 'estado_gestion' | 'estado_verificacion' | 'created_at'>('created_at');
	let sortDir = $state<'asc' | 'desc'>('desc');

	let usuariosOrdenados = $derived(
		[...(users ?? [])].sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1;
			if (sortBy === 'created_at') {
				const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return (tA - tB) * dir;
			}
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

	function confirmarCambioEstado(user: UsuarioAdminItemDto) {
		const habilitar = user.estado_gestion === 'inhabilitado';
		const accion = habilitar ? 'habilitar' : 'inhabilitar';
		const nombreCompleto = `${user.nombre} ${user.apellido}`.trim();
		const mensaje = `¿Confirmás ${accion} la cuenta de ${nombreCompleto} (@${user.username})?`;
		if (!window.confirm(mensaje)) return;

		onToggleEstado?.({
			idUsuario: user.id_usuario,
			habilitar
		});
	}
</script>

<section class="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md shadow-sm">
	<div class="border-b border-white/10 bg-gradient-to-r from-[#1a1b3b] to-[#252a5a] px-6 py-5">
		<h3 class="text-xl font-bold text-white">Gestión de usuarios</h3>
		<p class="text-sm text-slate-400">Habilitación, inhabilitación y consulta de perfiles.</p>
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
							onclick={() => changeSort('estado_gestion')}
						>
							Estado {sortBy === 'estado_gestion' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('estado_verificacion')}
						>
							Verificación {sortBy === 'estado_verificacion' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4">
						<button
							class="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors"
							onclick={() => changeSort('created_at')}
						>
							Fecha alta {sortBy === 'created_at' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
						</button>
					</th>
					<th class="px-6 py-4 text-center font-bold text-slate-300 uppercase tracking-wider">
						Acciones
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/5">
				{#if users.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-12 text-center text-slate-500 italic">
							Sin resultados para mostrar
						</td>
					</tr>
				{:else}
					{#each usuariosOrdenados as user}
						<tr class="transition-colors hover:bg-white/5">
							<td class="px-6 py-4">
								<div class="font-bold text-white hover:text-emerald-400 transition-colors">
									{user.nombre}
									{user.apellido}
								</div>
								<div class="text-xs font-medium text-slate-400">@{user.username}</div>
							</td>
							<td class="px-6 py-4">
								<span
									class="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/20 capitalize"
								>
									{user.rol}
								</span>
							</td>
							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border transition-all duration-300 ${
										user.estado_gestion === 'activo'
											? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
											: user.estado_gestion === 'pendiente'
												? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
												: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
									}`}
								>
									<span
										class={`mr-1.5 h-1.5 w-1.5 rounded-full ${
											user.estado_gestion === 'activo'
												? 'bg-emerald-400 animate-pulse'
												: user.estado_gestion === 'pendiente'
													? 'bg-amber-400'
													: 'bg-rose-400'
										}`}
									></span>
									{user.estado_gestion}
								</span>
							</td>
							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border transition-all duration-300 ${user.estado_verificacion === 'aprobada' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : user.estado_verificacion === 'pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}
								>
									{user.estado_verificacion || 'sin solicitud'}
								</span>
							</td>
							<td class="px-6 py-4 text-slate-400 font-medium">
								{#if user.created_at}{new Date(user.created_at).toLocaleDateString('es-AR')}{:else}-{/if}
							</td>
							<td class="px-6 py-4 text-center">
								<div class="flex justify-center gap-3">
									<Button
										label={user.rol === 'administrador' ? 'Admin' : 'Ver perfil'}
										size="sm"
										variant="secondary"
										onclick={() => onVerPerfil?.({ username: user.username })}
										disabled={loading}
										class="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 !rounded-full shadow-lg"
									/>
									<Button
										label={user.estado_gestion === 'inhabilitado' ? 'Habilitar' : 'Inhabilitar'}
										size="sm"
										variant={user.estado_gestion === 'inhabilitado' ? 'primary' : 'danger'}
										onclick={() => confirmarCambioEstado(user)}
										disabled={loading}
										class={user.estado_gestion === 'inhabilitado'
											? '!bg-emerald-600 !hover:bg-emerald-700 !text-white !rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40'
											: '!bg-rose-600 !hover:bg-rose-700 !text-white !rounded-full shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40'}
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
