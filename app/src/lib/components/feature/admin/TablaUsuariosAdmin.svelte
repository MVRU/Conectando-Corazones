<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { UsuarioAdminItemDto } from '$lib/domain/types/dto/PanelAdmin';
	import { scale } from 'svelte/transition';

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
	let busqueda = $state('');
	let paginaActual = $state(1);
	const POR_PAGINA = 20;
	let modalConfirmar = $state<{ abierto: boolean; usuario: UsuarioAdminItemDto | null }>({
		abierto: false,
		usuario: null
	});
	let dialogo: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (dialogo && modalConfirmar.abierto) {
			dialogo.showModal();
		} else if (dialogo && !modalConfirmar.abierto) {
			dialogo.close();
		}
	});

	let usuariosOrdenados = $derived.by(() => {
		const termino = busqueda.trim().toLowerCase();
		const filtrados = termino
			? (users ?? []).filter((u: UsuarioAdminItemDto) => {
					const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
					return (
						nombreCompleto.includes(termino) ||
						u.username.toLowerCase().includes(termino)
					);
				})
			: (users ?? []);

		return [...filtrados].sort((a, b) => {
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
	});

	let totalPaginas = $derived(Math.ceil(usuariosOrdenados.length / POR_PAGINA));

	let usuariosPaginados = $derived(
		usuariosOrdenados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)
	);

	$effect(() => {
		// Resetear a página 1 cuando cambia el filtro o el orden
		busqueda;
		sortBy;
		sortDir;
		paginaActual = 1;
	});

	function changeSort(key: typeof sortBy) {
		if (sortBy === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = key;
			sortDir = key === 'created_at' ? 'desc' : 'asc';
		}
	}

	function tooltipInhabilitar(user: UsuarioAdminItemDto): string | null {
		if (user.estado_gestion === 'inhabilitado') return null;
		if (user.tieneProyectosActivos) {
			return 'No se puede inhabilitar: tiene proyectos en curso.';
		}
		if (user.tieneColaboracionesActivas) {
			return 'No se puede inhabilitar: tiene participaciones activas.';
		}
		return null;
	}

	function confirmarCambioEstado(user: UsuarioAdminItemDto) {
		modalConfirmar = { abierto: true, usuario: user };
	}

	function ejecutarCambioEstado() {
		if (!modalConfirmar.usuario) return;
		const habilitar = modalConfirmar.usuario.estado_gestion === 'inhabilitado';
		onToggleEstado?.({ idUsuario: modalConfirmar.usuario.id_usuario, habilitar });
		modalConfirmar = { abierto: false, usuario: null };
	}

	function cancelarCambio() {
		if (!modalConfirmar.abierto) return;
		modalConfirmar = { abierto: false, usuario: null };
	}
</script>

<section class="overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md shadow-sm">
	<div class="border-b border-white/10 bg-linear-to-r from-[#1a1b3b] to-[#252a5a] px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h3 class="text-xl font-bold text-white">Gestión de usuarios</h3>
			<p class="text-sm text-slate-400">Habilitación, inhabilitación y consulta de perfiles.</p>
		</div>
		<input
			type="text"
			placeholder="Buscar por nombre o @usuario..."
			class="rounded-lg border border-white/10 bg-[#151730] px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:w-72"
			bind:value={busqueda}
		/>
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
				{#if usuariosOrdenados.length === 0}
					<tr>
						<td colspan="6" class="px-6 py-12 text-center text-slate-500 italic">
							{busqueda.trim() ? `Sin resultados para "${busqueda.trim()}"` : 'Sin resultados para mostrar'}
						</td>
					</tr>
				{:else}
					{#each usuariosPaginados as user}
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
										class="bg-white/10! text-white! border-white/20! hover:bg-white/20! rounded-full! shadow-lg"
									/>
									{#if tooltipInhabilitar(user)}
										<span title={tooltipInhabilitar(user) ?? ''} class="cursor-not-allowed">
											<Button
												label="Inhabilitar"
												size="sm"
												variant="danger"
												onclick={() => {}}
												disabled={true}
												class="bg-rose-600/40! text-white/40! rounded-full! pointer-events-none"
											/>
										</span>
									{:else}
										<Button
											label={user.estado_gestion === 'inhabilitado' ? 'Habilitar' : 'Inhabilitar'}
											size="sm"
											variant={user.estado_gestion === 'inhabilitado' ? 'primary' : 'danger'}
											onclick={() => confirmarCambioEstado(user)}
											disabled={loading}
											class={user.estado_gestion === 'inhabilitado'
												? 'bg-emerald-600! hover:bg-emerald-700! text-white! rounded-full! shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40'
												: 'bg-rose-600! hover:bg-rose-700! text-white! rounded-full! shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40'}
										/>
									{/if}
								</div>
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
				Página <span class="font-bold text-white">{paginaActual}</span> de <span class="font-bold text-white">{totalPaginas}</span>
			</div>
			<div class="flex gap-2">
				<button
					class="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/10 disabled:opacity-30"
					disabled={paginaActual <= 1 || loading}
					onclick={() => paginaActual--}
				>
					Anterior
				</button>
				<button
					class="rounded-lg bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/10 disabled:opacity-30"
					disabled={paginaActual >= totalPaginas || loading}
					onclick={() => paginaActual++}
				>
					Siguiente
				</button>
			</div>
		</div>
	{/if}
</section>

<dialog
	bind:this={dialogo}
	onclose={cancelarCambio}
	onclick={(e) => { if (e.target === dialogo) cancelarCambio(); }}
	class="m-auto w-full max-w-md rounded-2xl bg-transparent p-0 px-4 outline-hidden backdrop:bg-black/60 backdrop:backdrop-blur-sm"
>
	{#if modalConfirmar.abierto && modalConfirmar.usuario}
		{@const user = modalConfirmar.usuario}
		{@const habilitar = user.estado_gestion === 'inhabilitado'}
		{@const nombreCompleto = `${user.nombre} ${user.apellido}`.trim()}
		<div
			class="w-full rounded-2xl border border-white/10 bg-[#111327] p-6 shadow-2xl"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Ícono + título -->
			<div class="mb-4 flex items-center gap-3">
				<div
					class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${habilitar ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}
				>
					{#if habilitar}
						<svg class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						<svg class="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
					{/if}
				</div>
				<h3 class="text-lg font-bold text-white">
					{habilitar ? 'Habilitar cuenta' : 'Inhabilitar cuenta'}
				</h3>
			</div>

			<!-- Cuerpo -->
			<p class="mb-1 text-sm text-slate-300">
				¿Confirmás
				<span class={`font-bold ${habilitar ? 'text-emerald-400' : 'text-rose-400'}`}>
					{habilitar ? 'habilitar' : 'inhabilitar'}
				</span>
				la cuenta de:
			</p>
			<p class="mb-6 text-sm font-semibold text-white">
				{nombreCompleto}
				<span class="font-normal text-slate-400">(@{user.username})</span>
			</p>

			<!-- Acciones -->
			<div class="flex justify-end gap-3">
				<button
					type="button"
					class="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10 disabled:opacity-50"
					onclick={cancelarCambio}
					disabled={loading}
				>
					Cancelar
				</button>
				<button
					type="button"
					class={`rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 ${
						habilitar
							? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700'
							: 'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700'
					}`}
					onclick={ejecutarCambioEstado}
					disabled={loading}
				>
					{habilitar ? 'Sí, habilitar' : 'Sí, inhabilitar'}
				</button>
			</div>
		</div>
	{/if}
</dialog>
